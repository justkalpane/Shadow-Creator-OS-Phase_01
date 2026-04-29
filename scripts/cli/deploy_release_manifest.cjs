#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const CWD = process.cwd();
const REPORT_DIR = path.join(CWD, "tests", "reports");
const GATE_REPORT_PATH = path.join(REPORT_DIR, "deploy_gate_report_latest.json");
const OUT_JSON = path.join(REPORT_DIR, "deploy_release_manifest_latest.json");
const OUT_MD = path.join(REPORT_DIR, "deploy_release_manifest_latest.md");
const DB_PATH = path.join(process.env.N8N_USER_FOLDER || "C:/ShadowEmpire/n8n_user", ".n8n", "database.sqlite");

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8").trim();
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
  if (fs.existsSync(refPath)) return readText(refPath);
  return readPackedRef(gitDir, refName);
}

function resolveGitState() {
  const gitDir = path.join(CWD, ".git");
  if (!fs.existsSync(gitDir)) {
    throw new Error(".git directory not found");
  }

  const headRaw = readText(path.join(gitDir, "HEAD"));
  if (!headRaw.startsWith("ref:")) {
    return {
      gitHead: headRaw,
      gitBranch: "DETACHED",
      gitOriginMain: resolveRefSha(gitDir, "refs/remotes/origin/main"),
    };
  }

  const headRef = headRaw.replace(/^ref:\s*/, "").trim();
  const gitHead = resolveRefSha(gitDir, headRef);
  const gitOriginMain = resolveRefSha(gitDir, "refs/remotes/origin/main");
  const gitBranch = headRef.replace(/^refs\/heads\//, "");

  if (!gitHead) throw new Error(`Unable to resolve HEAD ref: ${headRef}`);
  return { gitHead, gitOriginMain, gitBranch };
}

function dbAll(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows || [])));
  });
}

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

(async () => {
  if (!fs.existsSync(GATE_REPORT_PATH)) {
    fail(`Missing gate report: ${path.relative(CWD, GATE_REPORT_PATH)}. Run npm run deploy:gate:full first.`);
  }

  const gate = JSON.parse(fs.readFileSync(GATE_REPORT_PATH, "utf8"));
  const gateStatus = String(gate?.summary?.status || "").toUpperCase();
  if (gateStatus !== "PASS") {
    fail(`deploy_gate_report status is ${gateStatus || "UNKNOWN"}; cannot generate release manifest from failing gate.`);
  }

  let gitHead = null;
  let gitOriginMain = null;
  let gitBranch = null;
  try {
    const state = resolveGitState();
    gitHead = state.gitHead;
    gitOriginMain = state.gitOriginMain;
    gitBranch = state.gitBranch;
  } catch (err) {
    fail(`Unable to resolve git state: ${err.message}`);
  }

  if (!gitOriginMain) {
    fail("Unable to resolve refs/remotes/origin/main");
  }

  if (gitHead !== gitOriginMain) {
    fail(`HEAD and origin/main differ (${gitHead} vs ${gitOriginMain}). Push/sync before release manifest.`);
  }

  if (!fs.existsSync(DB_PATH)) {
    fail(`n8n database missing: ${DB_PATH}`);
  }

  const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);
  const workflows = await dbAll(
    db,
    "SELECT id,name,active FROM workflow_entity WHERE isArchived=0 AND (name LIKE 'WF-% Canonical' OR name LIKE 'CWF-% Canonical' OR name LIKE 'SE-N8N-%') ORDER BY name"
  );
  const ingress = await dbAll(
    db,
    `SELECT w.name AS workflow_name, w.id AS workflow_id, h.method AS method, h.webhookPath AS webhook_path
     FROM webhook_entity h JOIN workflow_entity w ON w.id=h.workflowId
     WHERE w.isArchived=0 AND (w.name LIKE 'WF-% Canonical' OR w.name LIKE 'SE-N8N-%')
     ORDER BY w.name, h.webhookPath`
  );
  db.close();

  const canonical = workflows.filter((w) => /^WF-|^CWF-/.test(w.name));
  const legacy = workflows.filter((w) => /^SE-N8N-/.test(w.name));
  const canonicalActive = canonical.filter((w) => w.active === 1);
  const legacyActive = legacy.filter((w) => w.active === 1);

  const host = process.env.N8N_HOST || "127.0.0.1";
  const port = process.env.N8N_PORT || "5678";
  const ingressResolved = ingress.map((i) => ({
    workflow_name: i.workflow_name,
    workflow_id: i.workflow_id,
    method: i.method,
    webhook_path: i.webhook_path,
    callable_url: `http://${host}:${port}/webhook/${String(i.webhook_path).replaceAll("%", "%25")}`,
  }));

  const out = {
    summary: {
      status: "PASS",
      generated_at: new Date().toISOString(),
      git_branch: gitBranch,
      git_head: gitHead,
      git_origin_main: gitOriginMain,
      canonical_total: canonical.length,
      canonical_active: canonicalActive.length,
      legacy_total: legacy.length,
      legacy_active: legacyActive.length,
      ingress_total: ingressResolved.length,
    },
    gate_report: path.relative(CWD, GATE_REPORT_PATH),
    canonical_active_workflows: canonicalActive.map((w) => ({ id: w.id, name: w.name })),
    canonical_inactive_workflows: canonical.filter((w) => w.active !== 1).map((w) => ({ id: w.id, name: w.name })),
    legacy_active_workflows: legacyActive.map((w) => ({ id: w.id, name: w.name })),
    ingress_endpoints: ingressResolved,
    rollback_hint: {
      git_checkout: gitHead,
      verify_commands: [
        "npm run deploy:gate:full",
        "npm run n8n:status",
        "npm run db:verify"
      ]
    }
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2), "utf8");

  const md = [
    "# Deployment Release Manifest",
    "",
    `- generated_at: ${out.summary.generated_at}`,
    `- git_branch: ${out.summary.git_branch}`,
    `- git_head: ${out.summary.git_head}`,
    `- canonical_total: ${out.summary.canonical_total}`,
    `- canonical_active: ${out.summary.canonical_active}`,
    `- legacy_total: ${out.summary.legacy_total}`,
    `- legacy_active: ${out.summary.legacy_active}`,
    `- ingress_total: ${out.summary.ingress_total}`,
    "",
    "## Canonical Active Workflows",
    ...out.canonical_active_workflows.map((w) => `- ${w.name} (${w.id})`),
    "",
    "## Canonical Inactive Workflows",
    ...out.canonical_inactive_workflows.map((w) => `- ${w.name} (${w.id})`),
    "",
    "## Legacy Active Workflows",
    ...(out.legacy_active_workflows.length ? out.legacy_active_workflows.map((w) => `- ${w.name} (${w.id})`) : ["- none"]),
    "",
    "## Ingress Endpoints",
    "| Workflow | Method | Callable URL |",
    "|---|---|---|",
    ...out.ingress_endpoints.map((i) => `| ${i.workflow_name} | ${i.method} | ${i.callable_url} |`),
    "",
    "## Rollback Hint",
    `- git checkout ${gitHead}`,
    `- npm run deploy:gate:full`,
    `- npm run n8n:status`,
    `- npm run db:verify`,
    ""
  ].join("\n");
  fs.writeFileSync(OUT_MD, md, "utf8");

  console.log("Deployment Release Manifest");
  console.log("============================================================");
  console.log("status=PASS");
  console.log(`json_report=${path.relative(CWD, OUT_JSON)}`);
  console.log(`md_report=${path.relative(CWD, OUT_MD)}`);
})().catch((err) => fail(err.message));
