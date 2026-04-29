#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sqlite3 = require("sqlite3").verbose();
const YAML = require("yaml");

const CWD = process.cwd();
const REGISTRY_PATH = path.join(CWD, "registries", "workflow_registry.yaml");
const REPORT_DIR = path.join(CWD, "tests", "reports");
const REPORT_PATH = path.join(REPORT_DIR, "workflow_deploy_reconcile_latest.json");
const INGRESS_WORKFLOWS = new Set(["WF-000", "WF-001", "WF-010", "WF-020", "WF-021", "WF-500"]);

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
  return (nodes || []).map((node) => ({
    name: node.name || null,
    type: node.type || null,
    typeVersion: node.typeVersion || null,
    parameters: node.parameters || {},
    continueOnFail: !!node.continueOnFail,
    alwaysOutputData: !!node.alwaysOutputData,
    onError: node.onError || null,
    disabled: !!node.disabled,
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

function resolveDbPath() {
  const userFolder = process.env.N8N_USER_FOLDER || "C:/ShadowEmpire/n8n_user";
  return path.join(userFolder, ".n8n", "database.sqlite");
}

function readRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error(`Missing registry file: ${REGISTRY_PATH}`);
  }
  const doc = YAML.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  const workflows = Array.isArray(doc?.workflows) ? doc.workflows : [];
  return workflows;
}

function getExpectedPolicy(workflowId) {
  if (workflowId === "WF-900") return "ACTIVE_REQUIRED";
  if (workflowId === "WF-901") return "INACTIVE_CONTROLLED_ONLY";
  if (INGRESS_WORKFLOWS.has(workflowId)) return "ACTIVE_REQUIRED";
  return "INTERNAL_OPTIONAL";
}

function compareRepoVsLive(repoJson, liveRow) {
  const liveNodes = JSON.parse(liveRow.nodes || "[]");
  const liveConnections = JSON.parse(liveRow.connections || "{}");
  const liveSettings = JSON.parse(liveRow.settings || "{}");

  const nodeMatch = hash(normalizeNodes(repoJson.nodes || [])) === hash(normalizeNodes(liveNodes));
  const connectionMatch = hash(repoJson.connections || {}) === hash(liveConnections);
  const settingsMatch = hash(normalizeSettings(repoJson.settings || {})) === hash(normalizeSettings(liveSettings));

  return { nodeMatch, connectionMatch, settingsMatch };
}

function main() {
  const dbPath = resolveDbPath();
  if (!fs.existsSync(dbPath)) {
    console.error(`ERROR: n8n database not found at ${dbPath}`);
    process.exit(1);
  }

  const workflows = readRegistry();
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY);

  const queryLive = (name) =>
    new Promise((resolve, reject) => {
      db.get(
        "SELECT id, name, active, nodes, connections, settings, updatedAt FROM workflow_entity WHERE name = ? ORDER BY updatedAt DESC LIMIT 1",
        [name],
        (err, row) => (err ? reject(err) : resolve(row || null))
      );
    });

  (async () => {
    const rows = [];
    for (const wf of workflows) {
      const sourcePath = path.join(CWD, wf.source_file || "");
      if (!wf.source_file || !fs.existsSync(sourcePath)) {
        rows.push({
          workflow_id: wf.workflow_id,
          source_file: wf.source_file || null,
          status: "MISSING_SOURCE",
        });
        continue;
      }

      const repoJson = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
      const liveRow = await queryLive(repoJson.name);
      if (!liveRow) {
        rows.push({
          workflow_id: wf.workflow_id,
          source_file: wf.source_file,
          workflow_name: repoJson.name,
          status: "MISSING_LIVE",
        });
        continue;
      }

      const cmp = compareRepoVsLive(repoJson, liveRow);
      const syncStatus = cmp.nodeMatch && cmp.connectionMatch && cmp.settingsMatch ? "SYNCED" : "DRIFT";

      const policy = getExpectedPolicy(wf.workflow_id);
      let policyStatus = "OK";
      if (policy === "ACTIVE_REQUIRED" && liveRow.active !== 1) {
        policyStatus = "POLICY_DRIFT";
      } else if (policy === "INACTIVE_CONTROLLED_ONLY" && liveRow.active !== 0) {
        policyStatus = "POLICY_DRIFT";
      }

      rows.push({
        workflow_id: wf.workflow_id,
        source_file: wf.source_file,
        workflow_name: repoJson.name,
        live_id: liveRow.id,
        active: liveRow.active,
        status: syncStatus,
        policy,
        policy_status: policyStatus,
      });
    }

    db.close();

    const summary = {
      total: rows.length,
      synced: rows.filter((r) => r.status === "SYNCED").length,
      drift: rows.filter((r) => r.status === "DRIFT").length,
      missing_live: rows.filter((r) => r.status === "MISSING_LIVE").length,
      missing_source: rows.filter((r) => r.status === "MISSING_SOURCE").length,
      policy_drift: rows.filter((r) => r.policy_status === "POLICY_DRIFT").length,
    };

    fs.mkdirSync(REPORT_DIR, { recursive: true });
    fs.writeFileSync(REPORT_PATH, JSON.stringify({ summary, rows }, null, 2), "utf8");

    console.log("Workflow Deployment Reconciliation");
    console.log("============================================================");
    console.log(`total=${summary.total}`);
    console.log(`synced=${summary.synced}`);
    console.log(`drift=${summary.drift}`);
    console.log(`missing_live=${summary.missing_live}`);
    console.log(`missing_source=${summary.missing_source}`);
    console.log(`policy_drift=${summary.policy_drift}`);
    console.log(`report=${path.relative(CWD, REPORT_PATH)}`);

    const fail =
      summary.drift > 0 ||
      summary.missing_live > 0 ||
      summary.missing_source > 0 ||
      summary.policy_drift > 0;
    process.exit(fail ? 1 : 0);
  })().catch((err) => {
    try {
      db.close();
    } catch {
      // no-op
    }
    console.error("ERROR:", err.message);
    process.exit(1);
  });
}

main();

