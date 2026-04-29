#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

const CWD = process.cwd();
const POLICY_PATH = path.join(CWD, "registries", "deployment_phase1_production_candidate_signoff.yaml");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
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
  const lines = fs.readFileSync(packedRefsPath, "utf8").split(/\r?\n/);
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
  if (fs.existsSync(refPath)) return fs.readFileSync(refPath, "utf8").trim();
  return readPackedRef(gitDir, refName);
}

function resolveGitState() {
  const gitDir = path.join(CWD, ".git");
  if (!fs.existsSync(gitDir)) fail(".git directory not found");

  const headRaw = fs.readFileSync(path.join(gitDir, "HEAD"), "utf8").trim();
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

function main() {
  if (!fs.existsSync(POLICY_PATH)) fail(`Missing policy: ${path.relative(CWD, POLICY_PATH)}`);
  const policy = YAML.parse(fs.readFileSync(POLICY_PATH, "utf8")) || {};

  const promotionReportRel = String(policy.promotion_gate_report || "tests/reports/deploy_release_promotion_gate_latest.json");
  const promotionReportPath = path.join(CWD, promotionReportRel);
  if (!fs.existsSync(promotionReportPath)) {
    fail(`Missing promotion-gate report: ${promotionReportRel}. Run npm run deploy:promotion-gate first.`);
  }
  const promotionReport = JSON.parse(fs.readFileSync(promotionReportPath, "utf8"));
  const promotionStatus = String(promotionReport?.summary?.status || "").toUpperCase();
  if (promotionStatus !== "PASS") {
    fail(`Promotion-gate report status is ${promotionStatus || "UNKNOWN"}; expected PASS.`);
  }

  const git = resolveGitState();
  if (!git.git_origin_main) fail("Unable to resolve refs/remotes/origin/main");
  if (policy.require_head_equals_origin_main && git.git_head !== git.git_origin_main) {
    fail(`HEAD and origin/main differ (${git.git_head} vs ${git.git_origin_main}). Sync before signoff.`);
  }

  const defaults = policy.default_decision || {};
  const decision = process.env.DEPLOY_DECISION || defaults.decision || "APPROVED_FOR_PRODUCTION_CANDIDATE";
  const decidedBy = process.env.DEPLOY_DECISION_BY || defaults.decided_by || "phase1-release-gate";
  const environment = process.env.DEPLOY_DECISION_ENV || defaults.environment || "local-phase1";
  const notes = process.env.DEPLOY_DECISION_NOTES || "Promotion gate passed with deterministic approval/replay evidence.";

  const payload = {
    summary: {
      status: "PASS",
      generated_at: new Date().toISOString(),
      phase: policy.phase || "phase1",
      candidate_type: "phase1_production_candidate",
      git_branch: git.git_branch,
      git_head: git.git_head,
      git_origin_main: git.git_origin_main,
    },
    decision: {
      decision,
      decided_by: decidedBy,
      decided_at: new Date().toISOString(),
      environment,
      notes,
    },
    promotion_gate: {
      report_path: promotionReportRel,
      report_status: promotionStatus,
      report_file_sha256: sha256File(promotionReportPath),
      report_stable_sha256: sha256Text(stable(promotionReport)),
      report_signature: promotionReport?.signature || null,
    },
    policy: {
      path: path.relative(CWD, POLICY_PATH),
      version: policy.version || null,
      name: policy.name || null,
    },
  };

  const signature = {
    algorithm: String(policy.signature?.algorithm || "sha256"),
    signer: String(policy.signature?.signer || "shadow-phase1-production-candidate-signoff"),
    digest: sha256Text(stable(payload)),
  };
  const manifest = { ...payload, signature };

  const jsonOutRel = String(policy.manifest_output_json || "tests/reports/phase1_production_candidate_manifest_latest.json");
  const mdOutRel = String(policy.manifest_output_md || "tests/reports/phase1_production_candidate_manifest_latest.md");
  const jsonOut = path.join(CWD, jsonOutRel);
  const mdOut = path.join(CWD, mdOutRel);
  fs.mkdirSync(path.dirname(jsonOut), { recursive: true });
  fs.writeFileSync(jsonOut, JSON.stringify(manifest, null, 2), "utf8");

  const md = [
    "# Phase-1 Production Candidate Manifest",
    "",
    `- status: ${manifest.summary.status}`,
    `- generated_at: ${manifest.summary.generated_at}`,
    `- git_head: ${manifest.summary.git_head}`,
    `- decision: ${manifest.decision.decision}`,
    `- decided_by: ${manifest.decision.decided_by}`,
    `- promotion_report: ${manifest.promotion_gate.report_path}`,
    `- promotion_report_stable_sha256: ${manifest.promotion_gate.report_stable_sha256}`,
    `- signature: ${manifest.signature.algorithm}:${manifest.signature.digest}`,
    "",
  ].join("\n");
  fs.writeFileSync(mdOut, md, "utf8");

  console.log("Production Candidate Sign-off Manifest");
  console.log("============================================================");
  console.log("status=PASS");
  console.log(`decision=${manifest.decision.decision}`);
  console.log(`promotion_report_hash=${manifest.promotion_gate.report_stable_sha256}`);
  console.log(`signature=${manifest.signature.algorithm}:${manifest.signature.digest}`);
  console.log(`json_report=${path.relative(CWD, jsonOut)}`);
  console.log(`md_report=${path.relative(CWD, mdOut)}`);
}

main();
