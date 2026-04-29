#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const CWD = process.cwd();
const REPORT_DIR = path.join(CWD, "tests", "reports");
const RELEASE_MANIFEST = path.join(REPORT_DIR, "deploy_release_manifest_latest.json");
const OUT_JSON = path.join(REPORT_DIR, "deploy_regression_sweep_latest.json");
const OUT_MD = path.join(REPORT_DIR, "deploy_regression_sweep_latest.md");
const DB_PATH = path.join(
  process.env.N8N_USER_FOLDER || "C:/ShadowEmpire/n8n_user",
  ".n8n",
  "database.sqlite"
);

const TARGETS = ["WF-010", "WF-020", "WF-500"];
const DELAY_BETWEEN_MS = 7000;
const FINAL_WAIT_MS = 18000;

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

function safeCountArrayLike(value) {
  if (Array.isArray(value)) return value.length;
  if (!value || typeof value !== "object") return 0;
  if (Array.isArray(value.entries)) return value.entries.length;
  if (Array.isArray(value.packets)) return value.packets.length;
  if (Array.isArray(value.events)) return value.events.length;
  if (Array.isArray(value.items)) return value.items.length;
  if (Array.isArray(value.records)) return value.records.length;
  return 0;
}

function writeJson(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), "utf8");
}

function snapshotState() {
  const packetIndexPath = path.join(CWD, "data", "se_packet_index.json");
  const dossierIndexPath = path.join(CWD, "data", "se_dossier_index.json");
  const routeRunsPath = path.join(CWD, "data", "se_route_runs.json");
  const errorEventsPath = path.join(CWD, "data", "se_error_events.json");
  const dossiersDir = path.join(CWD, "dossiers");

  const packetIndex = readJson(packetIndexPath);
  const dossierIndex = readJson(dossierIndexPath);
  const routeRuns = readJson(routeRunsPath);
  const errorEvents = readJson(errorEventsPath);
  const dossierFiles = fs
    .readdirSync(dossiersDir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.toLowerCase().endsWith(".json")).length;

  return {
    packet_count: safeCountArrayLike(packetIndex),
    dossier_index_count: safeCountArrayLike(dossierIndex),
    route_run_count: safeCountArrayLike(routeRuns),
    error_event_count: safeCountArrayLike(errorEvents),
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

function reviveFlatted(flat) {
  const refs = flat;
  const cache = new Map();
  const isRef = (v) => typeof v === "string" && /^\d+$/.test(v) && Number(v) < refs.length;

  function reviveNode(node) {
    if (isRef(node)) return reviveIndex(Number(node));
    if (Array.isArray(node)) return node.map(reviveNode);
    if (node && typeof node === "object") {
      const out = {};
      for (const [k, v] of Object.entries(node)) out[k] = reviveNode(v);
      return out;
    }
    return node;
  }

  function reviveIndex(index) {
    if (cache.has(index)) return cache.get(index);
    const raw = refs[index];
    if (Array.isArray(raw)) {
      const out = [];
      cache.set(index, out);
      for (const v of raw) out.push(reviveNode(v));
      return out;
    }
    if (raw && typeof raw === "object") {
      const out = {};
      cache.set(index, out);
      for (const [k, v] of Object.entries(raw)) out[k] = reviveNode(v);
      return out;
    }
    cache.set(index, raw);
    return raw;
  }

  return reviveIndex(0);
}

function iterNodeJsonItems(runData) {
  const out = [];
  if (!runData || typeof runData !== "object") return out;
  for (const nodeRuns of Object.values(runData)) {
    if (!Array.isArray(nodeRuns)) continue;
    for (const run of nodeRuns) {
      const main = run?.data?.main;
      if (!Array.isArray(main)) continue;
      for (const channel of main) {
        if (!Array.isArray(channel)) continue;
        for (const item of channel) {
          if (item?.json && typeof item.json === "object") out.push(item.json);
        }
      }
    }
  }
  return out;
}

function packetIdOf(packet) {
  return packet?.instance_id || packet?.packet_id || packet?.id || null;
}

function packetFamilyOf(packet) {
  return packet?.artifact_family || packet?.packet_family || packet?.packet_type || packet?.family || "unknown_packet_family";
}

function dossierOf(packet) {
  return packet?.dossier_ref || packet?.dossier_id || "DOSSIER-UNSPECIFIED";
}

function toIso(value) {
  if (!value) return new Date().toISOString();
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

async function persistExecutionDeltas(db, newExecutions, runToken) {
  const packetIndexPath = path.join(CWD, "data", "se_packet_index.json");
  const routeRunsPath = path.join(CWD, "data", "se_route_runs.json");
  const dossierIndexPath = path.join(CWD, "data", "se_dossier_index.json");

  const packetIndex = readJson(packetIndexPath);
  const routeRuns = readJson(routeRunsPath);
  const dossierIndex = readJson(dossierIndexPath);

  if (!Array.isArray(packetIndex.entries)) packetIndex.entries = [];
  if (!Array.isArray(routeRuns.records)) routeRuns.records = [];
  if (!Array.isArray(dossierIndex.records)) dossierIndex.records = [];

  const packetIdSet = new Set(packetIndex.entries.map((e) => e?.instance_id || e?.packet_id || e?.id).filter(Boolean));
  const routeRunIdSet = new Set(routeRuns.records.map((r) => r?.execution_id).filter((v) => typeof v === "number"));
  const dossierIdSet = new Set(dossierIndex.records.map((r) => r?.dossier_id).filter(Boolean));

  let packetEntriesAdded = 0;
  let routeRunsAdded = 0;
  let dossierIndexAdded = 0;

  for (const exec of newExecutions) {
    if (!routeRunIdSet.has(exec.id)) {
      routeRuns.records.push({
        route_run_id: `RR-${exec.id}`,
        execution_id: exec.id,
        workflow_id: exec.workflow_name || exec.workflow_id,
        workflow_ref: exec.workflow_id,
        status: exec.status || "unknown",
        started_at: toIso(exec.started_at),
        stopped_at: toIso(exec.stopped_at),
        run_token: runToken,
        persisted_at: new Date().toISOString(),
        source: "deploy_regression_sweep",
      });
      routeRunIdSet.add(exec.id);
      routeRunsAdded += 1;
    }
  }

  const executionDataRows = await dbAll(
    db,
    `SELECT executionId, data FROM execution_data WHERE executionId > ? ORDER BY executionId ASC`,
    [newExecutions.length ? Math.min(...newExecutions.map((e) => e.id)) - 1 : -1]
  );

  const execMap = new Map(newExecutions.map((e) => [e.id, e]));
  for (const row of executionDataRows) {
    const exec = execMap.get(row.executionId);
    if (!exec) continue;
    let revived;
    try {
      revived = reviveFlatted(JSON.parse(row.data));
    } catch {
      continue;
    }
    const jsonItems = iterNodeJsonItems(revived?.resultData?.runData);
    for (const json of jsonItems) {
      const candidatePackets = [];
      if (json?.completion_packet && typeof json.completion_packet === "object") candidatePackets.push(json.completion_packet);
      if (json?.runtime_packet && typeof json.runtime_packet === "object") candidatePackets.push(json.runtime_packet);

      for (const packet of candidatePackets) {
        const packetId = packetIdOf(packet);
        if (!packetId || packetIdSet.has(packetId)) continue;
        const dossierId = dossierOf(packet);
        const now = new Date().toISOString();
        packetIndex.entries.push({
          index_entry_id: `IDX-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
          instance_id: packetId,
          artifact_family: packetFamilyOf(packet),
          schema_version: packet.schema_version || "1.0.0",
          producer_workflow: packet.producer_workflow || exec.workflow_name || exec.workflow_id,
          dossier_ref: dossierId,
          created_at: packet.created_at || now,
          indexed_at: now,
          status: packet.status || "CREATED",
          lineage: packet.lineage || {
            sourced_from_packet_id: packet.lineage_reference || null,
            sourced_from_topic_id: null,
            sourced_from_research_id: null,
          },
          next_workflow: packet?.payload?.next_workflow || null,
          escalation_needed: Boolean(packet?.payload?.escalation_needed || false),
          source_execution_id: exec.id,
          run_token: runToken,
        });
        packetIdSet.add(packetId);
        packetEntriesAdded += 1;

        if (dossierId && !dossierIdSet.has(dossierId)) {
          dossierIndex.records.push({
            dossier_id: dossierId,
            status: "active",
            created_at: now,
            updated_at: now,
            source_execution_id: exec.id,
            source_workflow: exec.workflow_name || exec.workflow_id,
          });
          dossierIdSet.add(dossierId);
          dossierIndexAdded += 1;
        }
      }
    }
  }

  packetIndex.total_entries = packetIndex.entries.length;
  packetIndex.last_updated = new Date().toISOString();
  routeRuns.last_updated = new Date().toISOString();
  dossierIndex.last_updated = new Date().toISOString();

  writeJson(packetIndexPath, packetIndex);
  writeJson(routeRunsPath, routeRuns);
  writeJson(dossierIndexPath, dossierIndex);

  return { packet_entries_added: packetEntriesAdded, route_runs_added: routeRunsAdded, dossier_index_added: dossierIndexAdded };
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
  let lastError = null;
  let lastResponse = null;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const bodyText = await res.text();
      const outcome = {
        ok: res.ok,
        status: res.status,
        status_text: res.statusText,
        url,
        body_preview: bodyText.slice(0, 220),
      };
      // Retry alternate URL forms on 404 because webhook path encoding can differ.
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

async function main() {
  if (!fs.existsSync(RELEASE_MANIFEST)) {
    fail(`Missing release manifest: ${path.relative(CWD, RELEASE_MANIFEST)} (run npm run deploy:release first)`);
  }
  if (!fs.existsSync(DB_PATH)) {
    fail(`n8n DB missing: ${DB_PATH}`);
  }

  const manifest = readJson(RELEASE_MANIFEST);
  const ingress = Array.isArray(manifest.ingress_endpoints) ? manifest.ingress_endpoints : [];
  const targetEndpoints = TARGETS.map((wfId) =>
    ingress.find((e) => String(e.workflow_name || "").startsWith(`${wfId} `))
  );

  for (let i = 0; i < TARGETS.length; i += 1) {
    if (!targetEndpoints[i]) fail(`Ingress endpoint not found in manifest for ${TARGETS[i]}`);
  }

  const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);
  const row = await dbGet(db, "SELECT COALESCE(MAX(id), 0) AS max_id FROM execution_entity");
  const preExecMaxId = Number(row && row.max_id ? row.max_id : 0);
  const preState = snapshotState();

  const runToken = `smoke_${Date.now()}`;
  const ingressResults = [];
  for (let i = 0; i < targetEndpoints.length; i += 1) {
    const endpoint = targetEndpoints[i];
    const payload = {
      run_token: runToken,
      source: "deploy_regression_sweep",
      workflow_id: endpoint.workflow_name.split(" ")[0],
      timestamp_utc: new Date().toISOString(),
      dossier_id: `DOSSIER-${runToken}-${i + 1}`,
      route_id: "ROUTE_PHASE1_STANDARD",
      input: {
        topic: `Deployment smoke ${endpoint.workflow_name}`,
        channel_id: "shadow_phase1",
      },
    };
    const result = await invokeWebhook(endpoint, payload);
    ingressResults.push({
      workflow_name: endpoint.workflow_name,
      workflow_id: endpoint.workflow_id,
      expected_method: endpoint.method,
      expected_path: endpoint.webhook_path,
      ...result,
    });
    await sleep(DELAY_BETWEEN_MS);
  }

  await sleep(FINAL_WAIT_MS);

  const newExecutions = await dbAll(
    db,
    `SELECT e.id, e.workflowId AS workflow_id, w.name AS workflow_name, e.status, e.startedAt AS started_at, e.stoppedAt AS stopped_at
     FROM execution_entity e
     LEFT JOIN workflow_entity w ON w.id = e.workflowId
     WHERE e.id > ?
     ORDER BY e.id ASC`,
    [preExecMaxId]
  );
  const persisted = await persistExecutionDeltas(db, newExecutions, runToken);
  const postState = snapshotState();
  db.close();

  const chainEvidence = {
    total_new_executions: newExecutions.length,
    downstream_count: newExecutions.filter((e) => /^WF-1|^WF-2|^WF-3|^WF-4|^WF-5|^WF-6|^CWF-/.test(String(e.workflow_name || ""))).length,
    execution_sample: newExecutions.slice(0, 25),
  };

  const matrix = ingressResults.map((r) => {
    const workflowExecs = newExecutions.filter((e) => e.workflow_id === r.workflow_id);
    const statusPass = r.status >= 200 && r.status < 500;
    const execPass = workflowExecs.length > 0;
    const pass = statusPass && execPass;
    return {
      workflow: r.workflow_name,
      webhook_status: r.status,
      webhook_ok: r.ok,
      execution_count: workflowExecs.length,
      execution_statuses: [...new Set(workflowExecs.map((e) => e.status))],
      result: pass ? "PASS" : "FAIL",
      details: pass ? "ingress reachable + execution recorded" : "missing ingress response or execution evidence",
    };
  });

  const deltas = {
    packet_delta: postState.packet_count - preState.packet_count,
    dossier_index_delta: postState.dossier_index_count - preState.dossier_index_count,
    route_run_delta: postState.route_run_count - preState.route_run_count,
    error_event_delta: postState.error_event_count - preState.error_event_count,
    dossier_file_delta: postState.dossier_file_count - preState.dossier_file_count,
  };

  const overall = matrix.every((m) => m.result === "PASS") ? "PASS" : "FAIL";

  const out = {
    summary: {
      status: overall,
      generated_at: new Date().toISOString(),
      run_token: runToken,
      targets: TARGETS,
      pre_exec_max_id: preExecMaxId,
      new_execution_count: newExecutions.length,
    },
    ingress_matrix: matrix,
    ingress_requests: ingressResults,
    pre_state: preState,
    post_state: postState,
    deltas,
    persisted,
    chain_evidence: chainEvidence,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2), "utf8");

  const mdLines = [
    "# Deployment Regression Sweep",
    "",
    `- status: ${overall}`,
    `- generated_at: ${out.summary.generated_at}`,
    `- run_token: ${runToken}`,
    `- targets: ${TARGETS.join(", ")}`,
    "",
    "## PASS/FAIL Matrix",
    "| Workflow | Webhook Status | Executions | Exec Statuses | Result |",
    "|---|---:|---:|---|---|",
    ...matrix.map(
      (m) =>
        `| ${m.workflow} | ${m.webhook_status} | ${m.execution_count} | ${m.execution_statuses.join(", ") || "-"} | ${m.result} |`
    ),
    "",
    "## Dossier/Packet/Error Deltas",
    "| Metric | Pre | Post | Delta |",
    "|---|---:|---:|---:|",
    `| packet_count | ${preState.packet_count} | ${postState.packet_count} | ${deltas.packet_delta} |`,
    `| dossier_index_count | ${preState.dossier_index_count} | ${postState.dossier_index_count} | ${deltas.dossier_index_delta} |`,
    `| route_run_count | ${preState.route_run_count} | ${postState.route_run_count} | ${deltas.route_run_delta} |`,
    `| error_event_count | ${preState.error_event_count} | ${postState.error_event_count} | ${deltas.error_event_delta} |`,
    `| dossier_file_count | ${preState.dossier_file_count} | ${postState.dossier_file_count} | ${deltas.dossier_file_delta} |`,
    "",
    "## Persistence Bridge Writes",
    `- packet_entries_added: ${persisted.packet_entries_added}`,
    `- route_runs_added: ${persisted.route_runs_added}`,
    `- dossier_index_added: ${persisted.dossier_index_added}`,
    "",
    "## Chain Evidence",
    `- total_new_executions: ${chainEvidence.total_new_executions}`,
    `- downstream_count: ${chainEvidence.downstream_count}`,
    ""
  ];

  fs.writeFileSync(OUT_MD, mdLines.join("\n"), "utf8");

  console.log("Deployment Regression Sweep");
  console.log("============================================================");
  console.log(`status=${overall}`);
  console.log(`json_report=${path.relative(CWD, OUT_JSON)}`);
  console.log(`md_report=${path.relative(CWD, OUT_MD)}`);
}

main().catch((err) => fail(err.message));
