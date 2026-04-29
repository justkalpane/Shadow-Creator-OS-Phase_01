#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const YAML = require("yaml");

const CWD = process.cwd();
const WORKFLOW_REGISTRY_PATH = path.join(CWD, "registries", "workflow_registry.yaml");
const CONTRACT_PATH = path.join(CWD, "registries", "deployment_phase1_error_route_contract.yaml");
const DB_PATH = path.join(process.env.N8N_USER_FOLDER || "C:/ShadowEmpire/n8n_user", ".n8n", "database.sqlite");
const REPORT_DIR = path.join(CWD, "tests", "reports");
const REPORT_PATH = path.join(REPORT_DIR, "deploy_error_route_contract_latest.json");

function parseYaml(p) {
  if (!fs.existsSync(p)) throw new Error(`Missing YAML file: ${p}`);
  return YAML.parse(fs.readFileSync(p, "utf8"));
}

function dbGet(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row || null)));
  });
}

function hasManifestWf900Reference(manifest) {
  const text = JSON.stringify(manifest);
  return text.includes("WF-900");
}

(async () => {
  const workflowRegistry = parseYaml(WORKFLOW_REGISTRY_PATH);
  const contract = parseYaml(CONTRACT_PATH);
  const workflowEntries = Array.isArray(workflowRegistry.workflows) ? workflowRegistry.workflows : [];
  const workflowById = new Map(workflowEntries.map((w) => [w.workflow_id, w]));
  const enforced = Array.isArray(contract.enforced_workflows) ? contract.enforced_workflows : [];

  if (!fs.existsSync(DB_PATH)) throw new Error(`n8n database not found: ${DB_PATH}`);
  const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);

  const wf900Name = contract?.canonical_error_workflow?.workflow_name || "WF-900 Error Handler Canonical";
  const wf900Live = await dbGet(db, "SELECT id,name,active FROM workflow_entity WHERE name=? ORDER BY updatedAt DESC LIMIT 1", [wf900Name]);
  if (!wf900Live) throw new Error(`Live canonical WF-900 not found by name: ${wf900Name}`);
  if (wf900Live.active !== 1) throw new Error(`Live canonical WF-900 is not active`);

  const issues = [];
  const resolved = [];

  for (const workflowId of enforced) {
    const entry = workflowById.get(workflowId);
    if (!entry) {
      issues.push({ type: "workflow_registry_missing", workflow_id: workflowId });
      continue;
    }

    const sourcePath = path.join(CWD, entry.source_file || "");
    if (!entry.source_file || !fs.existsSync(sourcePath)) {
      issues.push({ type: "workflow_source_missing", workflow_id: workflowId, source_file: entry.source_file || null });
      continue;
    }
    const sourceJson = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

    if (contract?.rules?.require_repo_meta_wf900_error_route) {
      const metaRoute = sourceJson?.meta?.wf900_error_route || null;
      if (metaRoute !== "WF-900") {
        issues.push({
          type: "repo_meta_wf900_route_mismatch",
          workflow_id: workflowId,
          expected: "WF-900",
          actual: metaRoute,
        });
      }
    }

    const manifestPath = path.join(CWD, entry.manifest_file || "");
    if (!entry.manifest_file || !fs.existsSync(manifestPath)) {
      issues.push({ type: "manifest_missing", workflow_id: workflowId, manifest_file: entry.manifest_file || null });
      continue;
    }
    const manifest = parseYaml(manifestPath);
    if (contract?.rules?.require_manifest_reference_to_wf900 && !hasManifestWf900Reference(manifest)) {
      issues.push({ type: "manifest_missing_wf900_reference", workflow_id: workflowId, manifest_file: entry.manifest_file });
    }

    const live = await dbGet(db, "SELECT id,name,settings FROM workflow_entity WHERE name=? ORDER BY updatedAt DESC LIMIT 1", [sourceJson.name]);
    if (!live) {
      issues.push({ type: "live_workflow_missing", workflow_id: workflowId, workflow_name: sourceJson.name });
      continue;
    }

    const settings = (() => {
      try {
        return JSON.parse(live.settings || "{}");
      } catch {
        return {};
      }
    })();
    const errWf = settings.errorWorkflow || null;
    const allowNull = !!contract?.rules?.allow_live_settings_errorworkflow_null;
    const allowWf900 = !!contract?.rules?.allow_live_settings_errorworkflow_wf900_id;
    let settingOk = false;
    if (errWf === null) settingOk = allowNull;
    if (errWf === wf900Live.id) settingOk = allowWf900;
    if (!settingOk) {
      issues.push({
        type: "live_settings_errorworkflow_violation",
        workflow_id: workflowId,
        workflow_name: sourceJson.name,
        allowed: [allowNull ? null : undefined, allowWf900 ? wf900Live.id : undefined].filter((v) => v !== undefined),
        actual: errWf,
      });
    }

    resolved.push({
      workflow_id: workflowId,
      workflow_name: sourceJson.name,
      source_file: entry.source_file,
      manifest_file: entry.manifest_file,
      live_id: live.id,
      repo_meta_wf900_error_route: sourceJson?.meta?.wf900_error_route || null,
      live_settings_errorworkflow: errWf,
    });
  }

  db.close();

  const summary = {
    status: issues.length === 0 ? "PASS" : "FAIL",
    enforced_workflows: enforced.length,
    resolved_workflows: resolved.length,
    issue_count: issues.length,
    canonical_wf900_live_id: wf900Live.id,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        summary,
        contract_file: path.relative(CWD, CONTRACT_PATH),
        workflow_registry_file: path.relative(CWD, WORKFLOW_REGISTRY_PATH),
        db_path: DB_PATH,
        resolved,
        issues,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log("Deployment Error Route Contract");
  console.log("============================================================");
  console.log(`status=${summary.status}`);
  console.log(`enforced_workflows=${summary.enforced_workflows}`);
  console.log(`resolved=${summary.resolved_workflows}`);
  console.log(`issues=${summary.issue_count}`);
  console.log(`canonical_wf900_live_id=${summary.canonical_wf900_live_id}`);
  console.log(`report=${path.relative(CWD, REPORT_PATH)}`);

  process.exit(issues.length === 0 ? 0 : 1);
})().catch((err) => {
  console.error("ERROR:", err.message);
  process.exit(1);
});

