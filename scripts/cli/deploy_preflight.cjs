#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const CWD = process.cwd();
const DB_PATH = path.join(process.env.N8N_USER_FOLDER || "C:/ShadowEmpire/n8n_user", ".n8n", "database.sqlite");
const RECONCILE_REPORT = path.join(CWD, "tests", "reports", "workflow_deploy_reconcile_latest.json");
const INGRESS_EXPECTED = [
  "WF-000 Health Check Canonical",
  "WF-001 Dossier Create Canonical",
  "WF-010 Parent Orchestrator Canonical",
  "WF-020 Final Approval Canonical",
  "WF-021 Replay Remodify Canonical",
  "WF-500 Publishing Distribution Pack Canonical",
];

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exit(1);
}

function ok(message) {
  console.log(`[OK] ${message}`);
}

async function checkN8nHealth() {
  const host = process.env.N8N_HOST || "127.0.0.1";
  const port = process.env.N8N_PORT || "5678";
  const url = `http://${host}:${port}/healthz`;
  const res = await fetch(url);
  if (!res.ok) fail(`n8n health check failed: ${url} => ${res.status}`);
  ok(`n8n reachable: ${url} => ${res.status}`);
}

function checkReconcileReport() {
  if (!fs.existsSync(RECONCILE_REPORT)) {
    fail(`reconcile report missing: ${path.relative(CWD, RECONCILE_REPORT)} (run npm run deploy:reconcile first)`);
  }
  const report = JSON.parse(fs.readFileSync(RECONCILE_REPORT, "utf8"));
  const summary = report.summary || {};
  if (summary.total !== 37) fail(`unexpected workflow total in reconcile report: ${summary.total} (expected 37)`);
  if (summary.synced !== 37) fail(`workflow sync mismatch: synced=${summary.synced}, expected 37`);
  if (summary.drift !== 0 || summary.missing_live !== 0 || summary.missing_source !== 0 || summary.policy_drift !== 0) {
    fail(
      `reconcile report has failures: drift=${summary.drift}, missing_live=${summary.missing_live}, missing_source=${summary.missing_source}, policy_drift=${summary.policy_drift}`
    );
  }
  ok("workflow reconciliation report clean (37/37 synced, no drift)");
}

function dbAll(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

async function checkLivePolicyAndIngress() {
  if (!fs.existsSync(DB_PATH)) fail(`n8n sqlite database not found: ${DB_PATH}`);
  const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);
  try {
    const wfRows = await dbAll(
      db,
      "SELECT id,name,active FROM workflow_entity WHERE isArchived=0 AND (name LIKE 'WF-% Canonical' OR name LIKE 'CWF-% Canonical') ORDER BY name"
    );
    if (wfRows.length < 32) fail(`canonical live workflows too low: ${wfRows.length} (expected at least 32)`);

    const byName = new Map(wfRows.map((r) => [r.name, r]));
    const wf900 = byName.get("WF-900 Error Handler Canonical");
    const wf901 = byName.get("WF-901 Error Recovery Canonical");
    if (!wf900) fail("WF-900 Error Handler Canonical missing live");
    if (!wf901) fail("WF-901 Error Recovery Canonical missing live");
    if (wf900.active !== 1) fail("WF-900 must be active");
    if (wf901.active !== 0) fail("WF-901 must remain inactive outside controlled validation");
    ok("WF-900/WF-901 policy lock is correct");

    const hooks = await dbAll(
      db,
      `SELECT w.name AS workflow_name, h.webhookPath AS webhook_path, h.method AS method
       FROM webhook_entity h
       JOIN workflow_entity w ON w.id=h.workflowId
       WHERE w.name IN (${INGRESS_EXPECTED.map(() => "?").join(",")})
       ORDER BY w.name`,
      INGRESS_EXPECTED
    );
    if (hooks.length !== INGRESS_EXPECTED.length) {
      fail(`ingress webhook registration mismatch: found ${hooks.length}, expected ${INGRESS_EXPECTED.length}`);
    }
    for (const name of INGRESS_EXPECTED) {
      const hit = hooks.find((h) => h.workflow_name === name);
      if (!hit) fail(`ingress webhook missing for ${name}`);
      if ((hit.method || "").toUpperCase() !== "POST") fail(`ingress webhook method for ${name} is not POST`);
      if (!hit.webhook_path || !String(hit.webhook_path).includes("/")) fail(`ingress webhook path invalid for ${name}`);
    }
    ok("all ingress webhooks are registered with POST");
  } finally {
    db.close();
  }
}

(async () => {
  console.log("Deployment Preflight");
  console.log("============================================================");
  await checkN8nHealth();
  checkReconcileReport();
  await checkLivePolicyAndIngress();
  ok("deployment preflight passed");
  process.exit(0);
})().catch((err) => {
  fail(err.message);
});

