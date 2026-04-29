#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const YAML = require("yaml");

const CWD = process.cwd();
const WORKFLOW_REGISTRY_PATH = path.join(CWD, "registries", "workflow_registry.yaml");
const INGRESS_REGISTRY_PATH = path.join(CWD, "registries", "deployment_phase1_ingress_endpoints.yaml");
const DB_PATH = path.join(process.env.N8N_USER_FOLDER || "C:/ShadowEmpire/n8n_user", ".n8n", "database.sqlite");
const REPORT_DIR = path.join(CWD, "tests", "reports");
const REPORT_PATH = path.join(REPORT_DIR, "deploy_ingress_contract_latest.json");

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

function parseYaml(p) {
  if (!fs.existsSync(p)) fail(`missing YAML file: ${p}`);
  return YAML.parse(fs.readFileSync(p, "utf8"));
}

function dbGet(db, sql, params = []) {
  return new Promise((resolve, reject) => db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row || null))));
}

function dbAll(db, sql, params = []) {
  return new Promise((resolve, reject) => db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows || []))));
}

function safeUrl(host, port, webhookPath) {
  // n8n stores encoded segments in webhookPath (e.g. trigger%20node). Re-encode % for callable URL.
  const escaped = String(webhookPath).replaceAll("%", "%25");
  return `http://${host}:${port}/webhook/${escaped}`;
}

(async () => {
  const workflowRegistry = parseYaml(WORKFLOW_REGISTRY_PATH);
  const ingressRegistry = parseYaml(INGRESS_REGISTRY_PATH);
  const wfRows = Array.isArray(workflowRegistry.workflows) ? workflowRegistry.workflows : [];
  const ingressRows = Array.isArray(ingressRegistry.ingress_workflows) ? ingressRegistry.ingress_workflows : [];
  const wfMap = new Map(wfRows.map((w) => [w.workflow_id, w]));

  if (!fs.existsSync(DB_PATH)) fail(`n8n sqlite database not found: ${DB_PATH}`);
  const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);

  const host = process.env.N8N_HOST || ingressRegistry?.defaults?.host_fallback || "127.0.0.1";
  const port = Number(process.env.N8N_PORT || ingressRegistry?.defaults?.port_fallback || 5678);

  const issues = [];
  const warnings = [];
  const resolved = [];

  for (const ingress of ingressRows) {
    const wf = wfMap.get(ingress.workflow_id);
    if (!wf) {
      issues.push({ type: "workflow_registry_missing", workflow_id: ingress.workflow_id });
      continue;
    }
    const sourcePath = path.join(CWD, wf.source_file || "");
    if (!wf.source_file || !fs.existsSync(sourcePath)) {
      issues.push({
        type: "workflow_source_missing",
        workflow_id: ingress.workflow_id,
        source_file: wf.source_file || null,
      });
      continue;
    }

    const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
    const webhookNodes = (source.nodes || []).filter((n) => n.type === "n8n-nodes-base.webhook");
    if (webhookNodes.length === 0) {
      issues.push({ type: "repo_webhook_node_missing", workflow_id: ingress.workflow_id, workflow_name: source.name });
      continue;
    }
    if (webhookNodes.length > 1) {
      warnings.push({
        type: "repo_multiple_webhook_nodes",
        workflow_id: ingress.workflow_id,
        workflow_name: source.name,
        count: webhookNodes.length,
      });
    }

    const node = webhookNodes[0];
    const repoMethod = String(node?.parameters?.httpMethod || "POST").toUpperCase();
    const repoPath = String(node?.parameters?.path || "");
    const expectedMethod = String(ingress.expected_method || ingressRegistry?.defaults?.method || "POST").toUpperCase();
    const expectedPath = String(ingress.expected_path || "");

    if (repoMethod !== expectedMethod) {
      issues.push({
        type: "repo_method_mismatch",
        workflow_id: ingress.workflow_id,
        expected: expectedMethod,
        actual: repoMethod,
      });
    }
    if (repoPath !== expectedPath) {
      issues.push({
        type: "repo_path_mismatch",
        workflow_id: ingress.workflow_id,
        expected: expectedPath,
        actual: repoPath,
      });
    }

    const live = await dbGet(
      db,
      "SELECT id,name,active FROM workflow_entity WHERE name = ? ORDER BY updatedAt DESC LIMIT 1",
      [source.name]
    );
    if (!live) {
      issues.push({
        type: "live_workflow_missing",
        workflow_id: ingress.workflow_id,
        workflow_name: source.name,
      });
      continue;
    }

    const hooks = await dbAll(
      db,
      "SELECT webhookPath,method,node FROM webhook_entity WHERE workflowId = ? ORDER BY webhookPath",
      [live.id]
    );
    if (hooks.length === 0) {
      issues.push({
        type: "live_webhook_missing",
        workflow_id: ingress.workflow_id,
        workflow_name: source.name,
      });
      continue;
    }

    const matched = hooks.find((h) => {
      const methodOk = String(h.method || "").toUpperCase() === expectedMethod;
      const pathOk = String(h.webhookPath || "").endsWith(`/${expectedPath}`);
      return methodOk && pathOk;
    });
    if (!matched) {
      issues.push({
        type: "live_webhook_contract_mismatch",
        workflow_id: ingress.workflow_id,
        workflow_name: source.name,
        expected_method: expectedMethod,
        expected_path_suffix: `/${expectedPath}`,
        live_hooks: hooks,
      });
      continue;
    }

    resolved.push({
      workflow_id: ingress.workflow_id,
      workflow_name: source.name,
      workflow_live_id: live.id,
      active: live.active === 1,
      method: expectedMethod,
      expected_path: expectedPath,
      live_webhook_path: matched.webhookPath,
      callable_url: safeUrl(host, port, matched.webhookPath),
    });
  }

  db.close();

  const summary = {
    status: issues.length === 0 ? "PASS" : "FAIL",
    ingress_total: ingressRows.length,
    resolved_count: resolved.length,
    issue_count: issues.length,
    warning_count: warnings.length,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        summary,
        workflow_registry: path.relative(CWD, WORKFLOW_REGISTRY_PATH),
        ingress_registry: path.relative(CWD, INGRESS_REGISTRY_PATH),
        db_path: DB_PATH,
        resolved,
        issues,
        warnings,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log("Deployment Ingress Contract");
  console.log("============================================================");
  console.log(`status=${summary.status}`);
  console.log(`ingress_total=${summary.ingress_total}`);
  console.log(`resolved=${summary.resolved_count}`);
  console.log(`issues=${summary.issue_count}`);
  console.log(`warnings=${summary.warning_count}`);
  console.log(`report=${path.relative(CWD, REPORT_PATH)}`);

  process.exit(issues.length === 0 ? 0 : 1);
})().catch((err) => {
  fail(err.message);
});

