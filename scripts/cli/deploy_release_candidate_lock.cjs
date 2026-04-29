#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

const CWD = process.cwd();
const POLICY_PATH = path.join(CWD, "registries", "deployment_phase1_release_candidate_lock.yaml");
const REPORT_DIR = path.join(CWD, "tests", "reports");
const OUT_JSON = path.join(REPORT_DIR, "deploy_release_candidate_lock_latest.json");
const OUT_MD = path.join(REPORT_DIR, "deploy_release_candidate_lock_latest.md");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${stable(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256Text(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function readPackedRef(gitDir, refName) {
  const packedRefsPath = path.join(gitDir, "packed-refs");
  if (!fs.existsSync(packedRefsPath)) return null;
  const lines = readText(packedRefsPath).split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("^")) continue;
    const [sha, ref] = trimmed.split(/\s+/);
    if (ref === refName) return sha;
  }
  return null;
}

function resolveRefSha(gitDir, refName) {
  const refPath = path.join(gitDir, ...refName.split("/"));
  if (fs.existsSync(refPath)) return readText(refPath).trim();
  return readPackedRef(gitDir, refName);
}

function resolveGitState() {
  const gitDir = path.join(CWD, ".git");
  if (!fs.existsSync(gitDir)) fail(".git directory not found");

  const headRaw = readText(path.join(gitDir, "HEAD")).trim();
  if (!headRaw.startsWith("ref:")) {
    return {
      git_head: headRaw,
      git_branch: "DETACHED",
      git_origin_main: resolveRefSha(gitDir, "refs/remotes/origin/main"),
    };
  }

  const headRef = headRaw.replace(/^ref:\s*/, "").trim();
  const gitHead = resolveRefSha(gitDir, headRef);
  const gitOriginMain = resolveRefSha(gitDir, "refs/remotes/origin/main");
  const gitBranch = headRef.replace(/^refs\/heads\//, "");

  if (!gitHead) fail(`Unable to resolve HEAD ref: ${headRef}`);
  return { git_head: gitHead, git_branch: gitBranch, git_origin_main: gitOriginMain };
}

function loadPolicy() {
  if (!fs.existsSync(POLICY_PATH)) fail(`Missing RC lock policy: ${path.relative(CWD, POLICY_PATH)}`);
  const policy = YAML.parse(readText(POLICY_PATH)) || {};
  if (!Array.isArray(policy.required_reports) || !policy.required_reports.length) {
    fail("RC lock policy has no required_reports.");
  }
  return policy;
}

function loadWorkflowRegistry(policy) {
  const rel = policy.workflow_registry || "registries/workflow_registry.yaml";
  const registryPath = path.join(CWD, rel);
  if (!fs.existsSync(registryPath)) fail(`Missing workflow registry: ${rel}`);
  const doc = YAML.parse(readText(registryPath)) || {};
  const workflows = Array.isArray(doc.workflows) ? doc.workflows : [];
  return { workflows, registryPath };
}

function ensureReport(reportConfig) {
  const relPath = reportConfig.path;
  const expectedStatus = String(reportConfig.expected_status || "PASS").toUpperCase();
  const absPath = path.join(CWD, relPath);
  if (!fs.existsSync(absPath)) fail(`Missing required report: ${relPath}`);
  const raw = readText(absPath);
  const parsed = JSON.parse(raw);
  const status = String(parsed?.summary?.status || parsed?.status || "UNKNOWN").toUpperCase();
  if (status !== expectedStatus) {
    fail(`Required report ${relPath} has status ${status}, expected ${expectedStatus}.`);
  }
  return {
    path: relPath,
    status,
    expected_status: expectedStatus,
    file_sha256: sha256File(absPath),
    stable_sha256: sha256Text(stable(parsed)),
  };
}

function buildWorkflowHashes(workflows, prefix) {
  const rows = workflows
    .filter((w) => w?.workflow_id && w?.source_file)
    .filter((w) => !prefix || String(w.source_file).startsWith(prefix))
    .map((w) => ({
      workflow_id: w.workflow_id,
      workflow_name: w.name || null,
      source_file: w.source_file,
    }))
    .sort((a, b) => a.workflow_id.localeCompare(b.workflow_id));

  if (!rows.length) fail("No workflows matched RC lock source scope.");

  const missing = rows.filter((r) => !fs.existsSync(path.join(CWD, r.source_file)));
  if (missing.length) {
    fail(`Missing workflow source files for RC lock: ${missing.map((m) => m.source_file).join(", ")}`);
  }

  const hashed = rows.map((r) => {
    const absPath = path.join(CWD, r.source_file);
    return {
      workflow_id: r.workflow_id,
      workflow_name: r.workflow_name,
      source_file: r.source_file,
      source_sha256: sha256File(absPath),
    };
  });

  const workflowTreeHash = sha256Text(stable(hashed));
  return { hashed, workflowTreeHash };
}

function writeOutputs(manifest) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(manifest, null, 2), "utf8");

  const md = [
    "# Release Candidate Lock Manifest",
    "",
    `- status: ${manifest.summary.status}`,
    `- generated_at: ${manifest.summary.generated_at}`,
    `- git_branch: ${manifest.summary.git_branch}`,
    `- git_head: ${manifest.summary.git_head}`,
    `- git_origin_main: ${manifest.summary.git_origin_main}`,
    `- workflows_locked: ${manifest.summary.workflows_locked}`,
    `- workflow_tree_hash: ${manifest.summary.workflow_tree_hash}`,
    `- signature: ${manifest.signature.algorithm}:${manifest.signature.digest}`,
    "",
    "## Required Report Hashes",
    "| Report | Status | File SHA256 | Stable SHA256 |",
    "|---|---|---|---|",
    ...manifest.report_hashes.map((r) => `| ${r.path} | ${r.status} | ${r.file_sha256} | ${r.stable_sha256} |`),
    "",
    "## Workflow Source Hashes",
    "| Workflow ID | Source File | SHA256 |",
    "|---|---|---|",
    ...manifest.workflow_source_hashes.map((w) => `| ${w.workflow_id} | ${w.source_file} | ${w.source_sha256} |`),
    ""
  ].join("\n");

  fs.writeFileSync(OUT_MD, md, "utf8");
}

function main() {
  const policy = loadPolicy();
  const git = resolveGitState();
  if (!git.git_origin_main) fail("Unable to resolve refs/remotes/origin/main");

  if (policy.require_head_equals_origin_main && git.git_head !== git.git_origin_main) {
    fail(`HEAD and origin/main differ (${git.git_head} vs ${git.git_origin_main}). Sync before RC lock.`);
  }

  const reports = policy.required_reports.map(ensureReport);
  const { workflows } = loadWorkflowRegistry(policy);
  const prefix = String(policy.source_prefix_required || "");
  const { hashed, workflowTreeHash } = buildWorkflowHashes(workflows, prefix);

  const payload = {
    summary: {
      status: "PASS",
      generated_at: new Date().toISOString(),
      git_branch: git.git_branch,
      git_head: git.git_head,
      git_origin_main: git.git_origin_main,
      workflows_locked: hashed.length,
      workflow_tree_hash: workflowTreeHash,
      required_reports_checked: reports.length,
    },
    policy: {
      path: path.relative(CWD, POLICY_PATH),
      version: policy.version || null,
      target_scope: policy.target_scope || null,
      source_prefix_required: prefix || null,
      require_head_equals_origin_main: !!policy.require_head_equals_origin_main,
    },
    report_hashes: reports,
    workflow_source_hashes: hashed,
  };

  const signatureDigest = sha256Text(stable(payload));
  const manifest = {
    ...payload,
    signature: {
      algorithm: String(policy.signature?.algorithm || "sha256"),
      signer: String(policy.signature?.signer || "shadow-phase1-rc-lock"),
      digest: signatureDigest,
    },
  };

  writeOutputs(manifest);

  console.log("Release Candidate Lock Gate");
  console.log("============================================================");
  console.log("status=PASS");
  console.log(`workflows_locked=${manifest.summary.workflows_locked}`);
  console.log(`workflow_tree_hash=${manifest.summary.workflow_tree_hash}`);
  console.log(`signature=${manifest.signature.algorithm}:${manifest.signature.digest}`);
  console.log(`json_report=${path.relative(CWD, OUT_JSON)}`);
  console.log(`md_report=${path.relative(CWD, OUT_MD)}`);
}

main();
