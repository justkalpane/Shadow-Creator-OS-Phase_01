#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sqlite3 = require("sqlite3").verbose();
const YAML = require("yaml");

const CWD = process.cwd();
const WORKFLOW_REGISTRY = path.join(CWD, "registries", "workflow_registry.yaml");
const POLICY_PATH = path.join(CWD, "registries", "deployment_phase1_live_sync_enforcer.yaml");
const REPORT_DIR = path.join(CWD, "tests", "reports");
const OUT_JSON = path.join(REPORT_DIR, "deploy_live_sync_enforcer_latest.json");
const OUT_MD = path.join(REPORT_DIR, "deploy_live_sync_enforcer_latest.md");

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

function hash(value) {
  return crypto.createHash("sha256").update(stable(value)).digest("hex").slice(0, 16);
}

function normalizeNodes(nodes) {
  return (nodes || []).map((n) => ({
    name: n.name || null,
    type: n.type || null,
    typeVersion: n.typeVersion || null,
    parameters: n.parameters || {},
    continueOnFail: !!n.continueOnFail,
    alwaysOutputData: !!n.alwaysOutputData,
    onError: n.onError || null,
    disabled: !!n.disabled,
  }));
}

function normalizeSettings(settings) {
  return {
    errorWorkflow: settings?.errorWorkflow || null,
    executionOrder: settings?.executionOrder || null,
    saveExecutionProgress: settings?.saveExecutionProgress || null,
    timezone: settings?.timezone || null,
  };
}

function resolveDbPath(policy) {
  const envKey = policy?.db?.user_folder_env || "N8N_USER_FOLDER";
  const fallback = policy?.db?.user_folder_fallback || "C:/ShadowEmpire/n8n_user";
  const suffix = policy?.db?.sqlite_path_suffix || ".n8n/database.sqlite";
  const root = process.env[envKey] || fallback;
  return path.join(root, suffix);
}

function readRegistry() {
  if (!fs.existsSync(WORKFLOW_REGISTRY)) fail(`Missing workflow registry: ${WORKFLOW_REGISTRY}`);
  const doc = YAML.parse(fs.readFileSync(WORKFLOW_REGISTRY, "utf8"));
  return Array.isArray(doc?.workflows) ? doc.workflows : [];
}

function readPolicy() {
  if (!fs.existsSync(POLICY_PATH)) fail(`Missing sync policy: ${POLICY_PATH}`);
  return YAML.parse(fs.readFileSync(POLICY_PATH, "utf8")) || {};
}

function dbGet(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row || null)));
  });
}

function dbRun(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) reject(err);
      else resolve(this.changes || 0);
    });
  });
}

function compareSourceLive(source, liveRow) {
  const liveNodes = JSON.parse(liveRow.nodes || "[]");
  const liveConnections = JSON.parse(liveRow.connections || "{}");
  const liveSettings = JSON.parse(liveRow.settings || "{}");
  const liveMeta = JSON.parse(liveRow.meta || "{}");

  return {
    nodeMatch: hash(normalizeNodes(source.nodes || [])) === hash(normalizeNodes(liveNodes)),
    connectionMatch: hash(source.connections || {}) === hash(liveConnections),
    settingsMatch: hash(normalizeSettings(source.settings || {})) === hash(normalizeSettings(liveSettings)),
    metaMatch: hash(source.meta || {}) === hash(liveMeta),
  };
}

async function syncWorkflow(db, wfId, sourcePath) {
  const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const liveRow = await dbGet(
    db,
    "SELECT id,name,nodes,connections,settings,meta,description,versionId,activeVersionId FROM workflow_entity WHERE name=? LIMIT 1",
    [source.name]
  );
  if (!liveRow) {
    return { workflow_id: wfId, workflow_name: source.name, source_file: sourcePath, status: "MISSING_LIVE" };
  }

  const cmpPre = compareSourceLive(source, liveRow);
  const preSynced = cmpPre.nodeMatch && cmpPre.connectionMatch && cmpPre.settingsMatch && cmpPre.metaMatch;

  const now = new Date().toISOString().replace("T", " ").replace("Z", "");
  await dbRun(
    db,
    "UPDATE workflow_entity SET nodes=?, connections=?, settings=?, meta=?, description=?, updatedAt=? WHERE id=?",
    [
      JSON.stringify(source.nodes || []),
      JSON.stringify(source.connections || {}),
      JSON.stringify(source.settings || {}),
      JSON.stringify(source.meta || {}),
      source.description || null,
      now,
      liveRow.id,
    ]
  );

  const versionToSync = liveRow.activeVersionId || liveRow.versionId;
  if (versionToSync) {
    await dbRun(
      db,
      "UPDATE workflow_history SET nodes=?, connections=?, name=?, description=?, updatedAt=? WHERE versionId=?",
      [
        JSON.stringify(source.nodes || []),
        JSON.stringify(source.connections || {}),
        source.name || null,
        source.description || null,
        now,
        versionToSync,
      ]
    );
  }

  const livePost = await dbGet(
    db,
    "SELECT id,name,nodes,connections,settings,meta,description,versionId,activeVersionId FROM workflow_entity WHERE id=? LIMIT 1",
    [liveRow.id]
  );
  const cmpPost = compareSourceLive(source, livePost);
  const postSynced = cmpPost.nodeMatch && cmpPost.connectionMatch && cmpPost.settingsMatch && cmpPost.metaMatch;

  return {
    workflow_id: wfId,
    workflow_name: source.name,
    source_file: path.relative(CWD, sourcePath),
    live_id: liveRow.id,
    status: postSynced ? (preSynced ? "ALREADY_SYNCED" : "SYNCED_NOW") : "DRIFT_REMAINS",
    pre_synced: preSynced,
    post_synced: postSynced,
    active_version_id: liveRow.activeVersionId || null,
    synced_version_id: versionToSync || null,
  };
}

async function main() {
  const workflowRegistry = readRegistry();
  const policy = readPolicy();
  const highRisk = Array.isArray(policy.high_risk_workflows) ? policy.high_risk_workflows : [];
  if (!highRisk.length) fail("No high_risk_workflows configured in sync policy.");

  const byId = new Map(workflowRegistry.map((w) => [w.workflow_id, w]));
  const dbPath = resolveDbPath(policy);
  if (!fs.existsSync(dbPath)) fail(`n8n DB not found: ${dbPath}`);

  const db = new sqlite3.Database(dbPath);
  const rows = [];
  for (const item of highRisk) {
    const wfId = item.workflow_id;
    const reg = byId.get(wfId);
    if (!reg || !reg.source_file) {
      rows.push({ workflow_id: wfId, status: "MISSING_SOURCE_REGISTRY" });
      continue;
    }
    const sourcePath = path.join(CWD, reg.source_file);
    if (!fs.existsSync(sourcePath)) {
      rows.push({ workflow_id: wfId, source_file: reg.source_file, status: "MISSING_SOURCE_FILE" });
      continue;
    }
    try {
      // eslint-disable-next-line no-await-in-loop
      const result = await syncWorkflow(db, wfId, sourcePath);
      rows.push(result);
    } catch (err) {
      rows.push({ workflow_id: wfId, source_file: reg.source_file, status: "SYNC_ERROR", error: err.message });
    }
  }
  db.close();

  const summary = {
    status: "PASS",
    generated_at: new Date().toISOString(),
    total: rows.length,
    already_synced: rows.filter((r) => r.status === "ALREADY_SYNCED").length,
    synced_now: rows.filter((r) => r.status === "SYNCED_NOW").length,
    drift_remains: rows.filter((r) => r.status === "DRIFT_REMAINS").length,
    missing: rows.filter((r) => r.status.startsWith("MISSING_")).length,
    errors: rows.filter((r) => r.status === "SYNC_ERROR").length,
  };

  if (summary.drift_remains > 0 || summary.missing > 0 || summary.errors > 0) summary.status = "FAIL";

  const report = { summary, rows };
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), "utf8");

  const md = [
    "# Deployment Live Sync Enforcer",
    "",
    `- status: ${summary.status}`,
    `- generated_at: ${summary.generated_at}`,
    `- total: ${summary.total}`,
    `- already_synced: ${summary.already_synced}`,
    `- synced_now: ${summary.synced_now}`,
    `- drift_remains: ${summary.drift_remains}`,
    `- missing: ${summary.missing}`,
    `- errors: ${summary.errors}`,
    "",
    "| Workflow ID | Live ID | Status | Source File |",
    "|---|---|---|---|",
    ...rows.map((r) => `| ${r.workflow_id || "-"} | ${r.live_id || "-"} | ${r.status} | ${r.source_file || "-"} |`),
    "",
  ].join("\n");
  fs.writeFileSync(OUT_MD, md, "utf8");

  console.log("Deployment Live Sync Enforcer");
  console.log("============================================================");
  console.log(`status=${summary.status}`);
  console.log(`total=${summary.total}`);
  console.log(`already_synced=${summary.already_synced}`);
  console.log(`synced_now=${summary.synced_now}`);
  console.log(`drift_remains=${summary.drift_remains}`);
  console.log(`missing=${summary.missing}`);
  console.log(`errors=${summary.errors}`);
  console.log(`json_report=${path.relative(CWD, OUT_JSON)}`);
  console.log(`md_report=${path.relative(CWD, OUT_MD)}`);

  if (summary.status !== "PASS") process.exit(1);
}

main().catch((err) => fail(err.message));
