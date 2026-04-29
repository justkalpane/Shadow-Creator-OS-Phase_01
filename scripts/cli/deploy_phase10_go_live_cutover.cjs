#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const CWD = process.cwd();
const REPORT_DIR = path.join(CWD, "tests", "reports");
const RELEASE_MANIFEST = path.join(REPORT_DIR, "deploy_release_manifest_latest.json");
const OUT_JSON = path.join(REPORT_DIR, "phase10_go_live_cutover_latest.json");
const OUT_MD = path.join(REPORT_DIR, "phase10_go_live_cutover_latest.md");
const DB_PATH = path.join(
  process.env.N8N_USER_FOLDER || "C:/ShadowEmpire/n8n_user",
  ".n8n",
  "database.sqlite"
);

const TARGETS = ["WF-001", "WF-010", "WF-020"];
const DELAY_MS = 8000;

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

function writeJson(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), "utf8");
}

function safeCount(value) {
  if (Array.isArray(value)) return value.length;
  if (!value || typeof value !== "object") return 0;
  if (Array.isArray(value.entries)) return value.entries.length;
  if (Array.isArray(value.records)) return value.records.length;
  if (Array.isArray(value.items)) return value.items.length;
  if (Array.isArray(value.events)) return value.events.length;
  return 0;
}

function snapshotState() {
  const packetIndex = readJson(path.join(CWD, "data", "se_packet_index.json"));
  const dossierIndex = readJson(path.join(CWD, "data", "se_dossier_index.json"));
  const routeRuns = readJson(path.join(CWD, "data", "se_route_runs.json"));
  const errorEvents = readJson(path.join(CWD, "data", "se_error_events.json"));
  const dossiersDir = path.join(CWD, "dossiers");
  const dossierFiles = fs
    .readdirSync(dossiersDir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.toLowerCase().endsWith(".json")).length;
  return {
    packet_count: safeCount(packetIndex),
    dossier_index_count: safeCount(dossierIndex),
    route_run_count: safeCount(routeRuns),
    error_event_count: safeCount(errorEvents),
    dossier_file_count: dossierFiles,
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
  return [...new Set([callable, doubleEncoded, direct, decodedCallable])];
}

async function invokeWebhook(endpoint, payload) {
  const urls = resolveUrls(endpoint);
  let lastErr = null;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const bodyText = await res.text();
      if (res.status === 404) continue;
      let bodyJson = null;
      try {
        bodyJson = JSON.parse(bodyText);
      } catch {
        bodyJson = null;
      }
      return {
        ok: res.ok,
        status: res.status,
        status_text: res.statusText,
        url,
        body_preview: bodyText.slice(0, 300),
        body_json: bodyJson,
      };
    } catch (err) {
      lastErr = err;
    }
  }
  return {
    ok: false,
    status: 0,
    status_text: "NETWORK_ERROR",
    url: urls[urls.length - 1],
    body_preview: String(lastErr && lastErr.message ? lastErr.message : lastErr || "unknown"),
    body_json: null,
  };
}

function extractDossierId(result, fallback) {
  const b = result && result.body_json;
  if (b && typeof b === "object") {
    if (typeof b.dossier_id === "string") return b.dossier_id;
    if (b.data && typeof b.data.dossier_id === "string") return b.data.dossier_id;
    if (Array.isArray(b) && b[0] && typeof b[0].dossier_id === "string") return b[0].dossier_id;
  }
  return fallback;
}

async function main() {
  if (!fs.existsSync(RELEASE_MANIFEST)) fail(`Missing release manifest: ${path.relative(CWD, RELEASE_MANIFEST)}`);
  if (!fs.existsSync(DB_PATH)) fail(`n8n DB missing: ${DB_PATH}`);

  const manifest = readJson(RELEASE_MANIFEST);
  const ingress = Array.isArray(manifest.ingress_endpoints) ? manifest.ingress_endpoints : [];
  const endpointById = new Map();
  for (const e of ingress) {
    const wfId = String(e.workflow_name || "").split(" ")[0];
    endpointById.set(wfId, e);
  }
  for (const wf of TARGETS) {
    if (!endpointById.has(wf)) fail(`Ingress endpoint not found for ${wf}`);
  }

  const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);
  const preExec = await dbGet(db, "SELECT COALESCE(MAX(id), 0) AS max_id FROM execution_entity");
  const preExecMaxId = Number(preExec?.max_id || 0);
  const preState = snapshotState();

  const runToken = `phase10_${Date.now()}`;
  let dossierId = `DOSSIER-${runToken}`;
  const calls = [];

  const wf001Payload = {
    run_token: runToken,
    source: "phase10_go_live_cutover",
    topic: `Phase10 live cutover ${runToken}`,
    context: "go-live validation",
    mode: "operator",
    route_id: "ROUTE_PHASE1_STANDARD",
  };
  const wf001Result = await invokeWebhook(endpointById.get("WF-001"), wf001Payload);
  dossierId = extractDossierId(wf001Result, dossierId);
  calls.push({ workflow_id: "WF-001", request: wf001Payload, response: wf001Result, dossier_id: dossierId });
  await sleep(DELAY_MS);

  const wf010Payload = {
    run_token: runToken,
    source: "phase10_go_live_cutover",
    dossier_id: dossierId,
    route_id: "ROUTE_PHASE1_STANDARD",
    workflow_path: "topic->script->context->approval",
    input: { topic: wf001Payload.topic },
  };
  const wf010Result = await invokeWebhook(endpointById.get("WF-010"), wf010Payload);
  calls.push({ workflow_id: "WF-010", request: wf010Payload, response: wf010Result, dossier_id: dossierId });
  await sleep(DELAY_MS);

  const wf020Payload = {
    run_token: runToken,
    source: "phase10_go_live_cutover",
    dossier_id: dossierId,
    decision: "approved",
    reviewer: "phase10_gate",
    reason: "phase10 go-live cutover approved path validation",
  };
  const wf020Result = await invokeWebhook(endpointById.get("WF-020"), wf020Payload);
  calls.push({ workflow_id: "WF-020", request: wf020Payload, response: wf020Result, dossier_id: dossierId });
  await sleep(15000);

  const newExecRows = await dbAll(
    db,
    `SELECT e.id, e.workflowId as workflow_ref, w.name as workflow_name, e.status, e.mode, e.startedAt, e.stoppedAt
     FROM execution_entity e
     LEFT JOIN workflow_entity w ON w.id = e.workflowId
     WHERE e.id > ?
     ORDER BY e.id ASC`,
    [preExecMaxId]
  );
  db.close();

  const postState = snapshotState();
  const deltas = {
    packet_delta: postState.packet_count - preState.packet_count,
    dossier_index_delta: postState.dossier_index_count - preState.dossier_index_count,
    route_run_delta: postState.route_run_count - preState.route_run_count,
    error_event_delta: postState.error_event_count - preState.error_event_count,
    dossier_file_delta: postState.dossier_file_count - preState.dossier_file_count,
  };

  const matrix = TARGETS.map((wfId) => {
    const call = calls.find((c) => c.workflow_id === wfId);
    const execs = newExecRows.filter((r) => String(r.workflow_name || "").startsWith(`${wfId} `));
    const hasSuccess = execs.some((e) => String(e.status).toLowerCase() === "success");
    const webhookPass = !!call?.response && call.response.status >= 200 && call.response.status < 500;
    const result = webhookPass && hasSuccess ? "PASS" : "FAIL";
    return {
      workflow_id: wfId,
      webhook_status: call?.response?.status || 0,
      webhook_ok: !!call?.response?.ok,
      execution_count: execs.length,
      execution_statuses: [...new Set(execs.map((e) => e.status))],
      result,
    };
  });

  const downstream = newExecRows.filter((r) => /^(WF-|CWF-)/.test(String(r.workflow_name || "")));
  const overall = matrix.every((m) => m.result === "PASS") ? "PASS" : "FAIL";

  const out = {
    summary: {
      status: overall,
      phase: "phase10_go_live_cutover",
      generated_at: new Date().toISOString(),
      run_token: runToken,
      dossier_id: dossierId,
      targets: TARGETS,
      pre_exec_max_id: preExecMaxId,
      new_execution_count: newExecRows.length,
      downstream_execution_count: downstream.length,
    },
    ingress_matrix: matrix,
    calls,
    pre_state: preState,
    post_state: postState,
    deltas,
    execution_rows: newExecRows,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  writeJson(OUT_JSON, out);

  const md = [
    "# Phase 10 Go-Live Cutover",
    "",
    `- status: ${overall}`,
    `- generated_at: ${out.summary.generated_at}`,
    `- run_token: ${runToken}`,
    `- dossier_id: ${dossierId}`,
    "",
    "## WF-001 -> WF-010 -> WF-020 Matrix",
    "| Workflow | Webhook Status | Executions | Exec Statuses | Result |",
    "|---|---:|---:|---|---|",
    ...matrix.map(
      (m) => `| ${m.workflow_id} | ${m.webhook_status} | ${m.execution_count} | ${m.execution_statuses.join(", ") || "-"} | ${m.result} |`
    ),
    "",
    "## Post-Run Deltas",
    "| Metric | Pre | Post | Delta |",
    "|---|---:|---:|---:|",
    `| packet_count | ${preState.packet_count} | ${postState.packet_count} | ${deltas.packet_delta} |`,
    `| dossier_index_count | ${preState.dossier_index_count} | ${postState.dossier_index_count} | ${deltas.dossier_index_delta} |`,
    `| route_run_count | ${preState.route_run_count} | ${postState.route_run_count} | ${deltas.route_run_delta} |`,
    `| error_event_count | ${preState.error_event_count} | ${postState.error_event_count} | ${deltas.error_event_delta} |`,
    `| dossier_file_count | ${preState.dossier_file_count} | ${postState.dossier_file_count} | ${deltas.dossier_file_delta} |`,
    "",
  ].join("\n");
  fs.writeFileSync(OUT_MD, md, "utf8");

  console.log("Phase 10 Go-Live Cutover");
  console.log("============================================================");
  console.log(`status=${overall}`);
  console.log(`run_token=${runToken}`);
  console.log(`dossier_id=${dossierId}`);
  console.log(`new_execution_count=${newExecRows.length}`);
  console.log(`json_report=${path.relative(CWD, OUT_JSON)}`);
  console.log(`md_report=${path.relative(CWD, OUT_MD)}`);

  process.exit(overall === "PASS" ? 0 : 1);
}

main().catch((err) => fail(err.message));

