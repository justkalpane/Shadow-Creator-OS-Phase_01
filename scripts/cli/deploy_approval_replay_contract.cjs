#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const CWD = process.cwd();
const REPORT_DIR = path.join(CWD, "tests", "reports");
const RELEASE_MANIFEST = path.join(REPORT_DIR, "deploy_release_manifest_latest.json");
const POLICY_PATH = path.join(CWD, "registries", "deployment_phase1_approval_replay_contract.yaml");
const OUT_JSON = path.join(REPORT_DIR, "deploy_approval_replay_contract_latest.json");
const OUT_MD = path.join(REPORT_DIR, "deploy_approval_replay_contract_latest.md");
const DB_PATH = path.join(process.env.N8N_USER_FOLDER || "C:/ShadowEmpire/n8n_user", ".n8n", "database.sqlite");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function parsePolicyValue(text, key) {
  const m = text.match(new RegExp(`^\\s*${key}:\\s*(\\d+)\\s*$`, "m"));
  return m ? Number(m[1]) : null;
}

function loadPolicy() {
  const txt = fs.readFileSync(POLICY_PATH, "utf8");
  return {
    wait_after_approved_ms: parsePolicyValue(txt, "wait_after_approved_ms") || 12000,
    wait_after_rejected_ms: parsePolicyValue(txt, "wait_after_rejected_ms") || 12000,
    poll_interval_ms: parsePolicyValue(txt, "poll_interval_ms") || 2000,
    poll_timeout_ms: parsePolicyValue(txt, "poll_timeout_ms") || 30000,
    max_replay_executions_per_window: parsePolicyValue(txt, "max_replay_executions_per_window") || 2,
  };
}

function dbGet(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row || null)));
  });
}

function dbAll(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows || [])));
  });
}

function resolveUrls(endpoint) {
  const pathRaw = String(endpoint.webhook_path || "");
  const host = process.env.N8N_HOST || "127.0.0.1";
  const port = process.env.N8N_PORT || "5678";
  const direct = `http://${host}:${port}/webhook/${pathRaw}`;
  const doubleEncoded = `http://${host}:${port}/webhook/${pathRaw.replaceAll("%", "%25")}`;
  const callable = endpoint.callable_url || direct;
  const decodedCallable = callable.replace(/%2520/g, "%20");
  return [...new Set([doubleEncoded, callable, direct, decodedCallable])];
}

async function invokeWebhook(endpoint, payload) {
  const urls = resolveUrls(endpoint);
  let lastResponse = null;
  let lastError = null;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.text();
      const outcome = {
        ok: res.ok,
        status: res.status,
        status_text: res.statusText,
        url,
        body_preview: body.slice(0, 220),
      };
      if (res.status === 404) {
        lastResponse = outcome;
        continue;
      }
      return outcome;
    } catch (err) {
      lastError = err;
    }
  }
  if (lastResponse) return lastResponse;
  return {
    ok: false,
    status: 0,
    status_text: "NETWORK_ERROR",
    url: urls[urls.length - 1],
    body_preview: String(lastError && lastError.message ? lastError.message : lastError || "unknown"),
  };
}

function workflowShortId(name) {
  const m = String(name || "").match(/^(WF-\d+|CWF-\d+)/);
  return m ? m[1] : null;
}

function countByShortId(rows) {
  const map = {};
  for (const r of rows) {
    const id = workflowShortId(r.workflow_name);
    if (!id) continue;
    map[id] = (map[id] || 0) + 1;
  }
  return map;
}

async function waitForNewRows(db, minIdExclusive, minRows, pollMs, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const rows = await dbAll(
      db,
      `SELECT e.id, e.workflowId AS workflow_id, w.name AS workflow_name, e.status, e.startedAt AS started_at, e.stoppedAt AS stopped_at
       FROM execution_entity e
       LEFT JOIN workflow_entity w ON w.id = e.workflowId
       WHERE e.id > ?
       ORDER BY e.id ASC`,
      [minIdExclusive]
    );
    if (rows.length >= minRows) return rows;
    await sleep(pollMs);
  }
  return dbAll(
    db,
    `SELECT e.id, e.workflowId AS workflow_id, w.name AS workflow_name, e.status, e.startedAt AS started_at, e.stoppedAt AS stopped_at
     FROM execution_entity e
     LEFT JOIN workflow_entity w ON w.id = e.workflowId
     WHERE e.id > ?
     ORDER BY e.id ASC`,
    [minIdExclusive]
  );
}

async function main() {
  if (!fs.existsSync(RELEASE_MANIFEST)) fail(`Missing release manifest: ${path.relative(CWD, RELEASE_MANIFEST)}.`);
  if (!fs.existsSync(POLICY_PATH)) fail(`Missing policy: ${path.relative(CWD, POLICY_PATH)}.`);
  if (!fs.existsSync(DB_PATH)) fail(`n8n DB missing: ${DB_PATH}`);

  const policy = loadPolicy();
  const manifest = readJson(RELEASE_MANIFEST);
  const ingress = Array.isArray(manifest.ingress_endpoints) ? manifest.ingress_endpoints : [];
  const wf020 = ingress.find((e) => String(e.workflow_name || "").startsWith("WF-020 "));
  if (!wf020) fail("WF-020 ingress endpoint not found in release manifest.");

  const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);
  const pre = await dbGet(db, "SELECT COALESCE(MAX(id),0) AS max_id FROM execution_entity");
  let checkpoint = Number(pre?.max_id || 0);

  const runToken = `approval_replay_${Date.now()}`;
  const approvedPayload = {
    run_token: `${runToken}_approved`,
    dossier_id: `DOSSIER-${runToken}-APPROVED`,
    route_id: "ROUTE_PHASE1_STANDARD",
    approval_decision: "APPROVED",
    approval_status: "approved",
    source: "deploy_approval_replay_contract",
  };
  const approvedIngress = await invokeWebhook(wf020, approvedPayload);
  await sleep(policy.wait_after_approved_ms);
  const approvedRows = await waitForNewRows(db, checkpoint, 1, policy.poll_interval_ms, policy.poll_timeout_ms);
  checkpoint = approvedRows.length ? approvedRows[approvedRows.length - 1].id : checkpoint;

  const rejectedPayload = {
    run_token: `${runToken}_rejected`,
    dossier_id: `DOSSIER-${runToken}-REJECTED`,
    route_id: "ROUTE_PHASE1_STANDARD",
    approval_decision: "REJECTED",
    approval_status: "rejected",
    replay_target_workflow: "CWF-210",
    source: "deploy_approval_replay_contract",
  };
  const rejectedIngress = await invokeWebhook(wf020, rejectedPayload);
  await sleep(policy.wait_after_rejected_ms);
  const rejectedRows = await waitForNewRows(db, checkpoint, 1, policy.poll_interval_ms, policy.poll_timeout_ms);
  db.close();

  const approvedCounts = countByShortId(approvedRows);
  const rejectedCounts = countByShortId(rejectedRows);

  const checks = [
    {
      id: "approved_ingress_http",
      pass: approvedIngress.status >= 200 && approvedIngress.status < 500,
      evidence: `status=${approvedIngress.status} url=${approvedIngress.url}`,
    },
    {
      id: "rejected_ingress_http",
      pass: rejectedIngress.status >= 200 && rejectedIngress.status < 500,
      evidence: `status=${rejectedIngress.status} url=${rejectedIngress.url}`,
    },
    {
      id: "approved_branch_determinism",
      pass: (approvedCounts["WF-020"] || 0) >= 1 && (approvedCounts["WF-500"] || 0) >= 1 && (approvedCounts["WF-021"] || 0) === 0,
      evidence: `WF-020=${approvedCounts["WF-020"] || 0}, WF-500=${approvedCounts["WF-500"] || 0}, WF-021=${approvedCounts["WF-021"] || 0}`,
    },
    {
      id: "rejected_branch_determinism",
      pass: (rejectedCounts["WF-020"] || 0) >= 1 && (rejectedCounts["WF-021"] || 0) >= 1 && (rejectedCounts["WF-500"] || 0) === 0,
      evidence: `WF-020=${rejectedCounts["WF-020"] || 0}, WF-021=${rejectedCounts["WF-021"] || 0}, WF-500=${rejectedCounts["WF-500"] || 0}`,
    },
    {
      id: "replay_bounded_cycle",
      pass: (rejectedCounts["WF-021"] || 0) >= 1 && (rejectedCounts["WF-021"] || 0) <= policy.max_replay_executions_per_window,
      evidence: `WF-021 replay count=${rejectedCounts["WF-021"] || 0}, cap=${policy.max_replay_executions_per_window}`,
    },
  ];

  const failed = checks.filter((c) => !c.pass);
  const status = failed.length ? "FAIL" : "PASS";

  const out = {
    summary: {
      status,
      generated_at: new Date().toISOString(),
      run_token: runToken,
      check_total: checks.length,
      check_pass: checks.length - failed.length,
      check_fail: failed.length,
    },
    policy,
    ingress: { approved: approvedIngress, rejected: rejectedIngress },
    windows: {
      approved: {
        rows: approvedRows,
        counts: approvedCounts,
      },
      rejected: {
        rows: rejectedRows,
        counts: rejectedCounts,
      },
    },
    checks,
    failed_checks: failed,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2), "utf8");

  const md = [
    "# Deployment Approval & Replay Reliability",
    "",
    `- status: ${status}`,
    `- generated_at: ${out.summary.generated_at}`,
    `- run_token: ${runToken}`,
    "",
    "## PASS/FAIL Table",
    "| Check | Evidence | Result |",
    "|---|---|---|",
    ...checks.map((c) => `| ${c.id} | ${String(c.evidence).replace(/\|/g, "/")} | ${c.pass ? "PASS" : "FAIL"} |`),
    "",
    "## Window Counts",
    `- approved: WF-020=${approvedCounts["WF-020"] || 0}, WF-500=${approvedCounts["WF-500"] || 0}, WF-021=${approvedCounts["WF-021"] || 0}`,
    `- rejected: WF-020=${rejectedCounts["WF-020"] || 0}, WF-021=${rejectedCounts["WF-021"] || 0}, WF-500=${rejectedCounts["WF-500"] || 0}`,
    "",
  ].join("\n");
  fs.writeFileSync(OUT_MD, md, "utf8");

  console.log("Deployment Approval & Replay Reliability");
  console.log("============================================================");
  console.log(`status=${status}`);
  console.log(`checks_pass=${out.summary.check_pass}`);
  console.log(`checks_fail=${out.summary.check_fail}`);
  console.log(`json_report=${path.relative(CWD, OUT_JSON)}`);
  console.log(`md_report=${path.relative(CWD, OUT_MD)}`);
  if (status !== "PASS") process.exit(1);
}

main().catch((err) => fail(err.message));
