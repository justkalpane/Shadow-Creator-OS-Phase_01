#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const YAML = require("yaml");

const CWD = process.cwd();
const CHAIN_REGISTRY_PATH = path.join(CWD, "registries", "deployment_phase1_chain_contract.yaml");
const WORKFLOW_REGISTRY_PATH = path.join(CWD, "registries", "workflow_registry.yaml");
const DB_PATH = path.join(process.env.N8N_USER_FOLDER || "C:/ShadowEmpire/n8n_user", ".n8n", "database.sqlite");
const REPORT_DIR = path.join(CWD, "tests", "reports");
const REPORT_PATH = path.join(REPORT_DIR, "deploy_chain_contract_latest.json");

function parseYaml(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Missing file: ${filePath}`);
  return YAML.parse(fs.readFileSync(filePath, "utf8"));
}

function dbGet(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row || null)));
  });
}

function safeParseJson(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function extractExecuteRefs(nodes) {
  const refs = [];
  for (const node of nodes || []) {
    if (node.type !== "n8n-nodes-base.executeWorkflow") continue;
    const p = node.parameters || {};
    const value = p.workflowId && typeof p.workflowId === "object" ? p.workflowId.value : null;
    const cachedName = p.workflowId && typeof p.workflowId === "object" ? p.workflowId.cachedResultName || null : null;
    refs.push({
      node_name: node.name || null,
      workflow_id_ref: value || null,
      workflow_name_ref: cachedName || null,
    });
  }
  return refs;
}

(async () => {
  const chainRegistry = parseYaml(CHAIN_REGISTRY_PATH);
  const workflowRegistry = parseYaml(WORKFLOW_REGISTRY_PATH);
  const chainContracts = Array.isArray(chainRegistry.chain_contracts) ? chainRegistry.chain_contracts : [];
  const workflows = Array.isArray(workflowRegistry.workflows) ? workflowRegistry.workflows : [];
  const workflowById = new Map(workflows.map((w) => [w.workflow_id, w]));

  if (!fs.existsSync(DB_PATH)) throw new Error(`n8n sqlite database not found: ${DB_PATH}`);
  const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);

  const issues = [];
  const warnings = [];
  const resolved = [];

  for (const contract of chainContracts) {
    const wfEntry = workflowById.get(contract.workflow_id);
    if (!wfEntry) {
      issues.push({ type: "workflow_registry_missing", workflow_id: contract.workflow_id });
      continue;
    }
    const sourcePath = path.join(CWD, wfEntry.source_file || "");
    if (!wfEntry.source_file || !fs.existsSync(sourcePath)) {
      issues.push({
        type: "workflow_source_missing",
        workflow_id: contract.workflow_id,
        source_file: wfEntry.source_file || null,
      });
      continue;
    }

    const repoWorkflow = safeParseJson(fs.readFileSync(sourcePath, "utf8"), null);
    if (!repoWorkflow) {
      issues.push({ type: "workflow_source_parse_failed", workflow_id: contract.workflow_id, source_file: wfEntry.source_file });
      continue;
    }

    if (repoWorkflow.name !== contract.workflow_name) {
      issues.push({
        type: "workflow_name_contract_mismatch",
        workflow_id: contract.workflow_id,
        expected: contract.workflow_name,
        actual: repoWorkflow.name || null,
      });
      continue;
    }

    const repoRefs = extractExecuteRefs(repoWorkflow.nodes || []);
    const repoRefNames = new Set(repoRefs.map((r) => r.workflow_name_ref).filter(Boolean));

    const liveWorkflow = await dbGet(
      db,
      "SELECT id,name,nodes FROM workflow_entity WHERE name=? ORDER BY updatedAt DESC LIMIT 1",
      [contract.workflow_name]
    );
    if (!liveWorkflow) {
      issues.push({
        type: "live_workflow_missing",
        workflow_id: contract.workflow_id,
        workflow_name: contract.workflow_name,
      });
      continue;
    }

    const liveNodes = safeParseJson(liveWorkflow.nodes, []);
    const liveRefs = extractExecuteRefs(liveNodes);
    const liveRefIds = new Set(liveRefs.map((r) => r.workflow_id_ref).filter(Boolean));
    const liveRefNames = new Set(liveRefs.map((r) => r.workflow_name_ref).filter(Boolean));

    const children = Array.isArray(contract.expected_children) ? contract.expected_children : [];
    const childResults = [];
    for (const childName of children) {
      const childLive = await dbGet(
        db,
        "SELECT id,name,active FROM workflow_entity WHERE name=? ORDER BY updatedAt DESC LIMIT 1",
        [childName]
      );
      if (!childLive) {
        issues.push({
          type: "expected_child_missing_live",
          parent_workflow_id: contract.workflow_id,
          parent_workflow_name: contract.workflow_name,
          child_workflow_name: childName,
        });
        childResults.push({ child_workflow_name: childName, status: "MISSING_LIVE" });
        continue;
      }

      const inRepo = repoRefNames.has(childName);
      const inLiveByName = liveRefNames.has(childName);
      const inLiveById = liveRefIds.has(childLive.id);
      if (!inRepo) {
        issues.push({
          type: "child_not_linked_in_repo",
          parent_workflow_id: contract.workflow_id,
          parent_workflow_name: contract.workflow_name,
          child_workflow_name: childName,
        });
      }
      if (!inLiveById && !inLiveByName) {
        issues.push({
          type: "child_not_linked_in_live",
          parent_workflow_id: contract.workflow_id,
          parent_workflow_name: contract.workflow_name,
          child_workflow_name: childName,
          child_live_id: childLive.id,
        });
      }
      if (inLiveByName && !inLiveById) {
        warnings.push({
          type: "child_link_resolves_by_name_not_id",
          parent_workflow_id: contract.workflow_id,
          parent_workflow_name: contract.workflow_name,
          child_workflow_name: childName,
          child_live_id: childLive.id,
        });
      }

      childResults.push({
        child_workflow_name: childName,
        child_live_id: childLive.id,
        child_active: childLive.active === 1,
        linked_in_repo: inRepo,
        linked_in_live_by_id: inLiveById,
        linked_in_live_by_name: inLiveByName,
      });
    }

    resolved.push({
      workflow_id: contract.workflow_id,
      workflow_name: contract.workflow_name,
      workflow_live_id: liveWorkflow.id,
      expected_children: children.length,
      repo_execute_refs: repoRefs.length,
      live_execute_refs: liveRefs.length,
      children: childResults,
    });
  }

  db.close();

  const summary = {
    status: issues.length === 0 ? "PASS" : "FAIL",
    chain_contracts: chainContracts.length,
    resolved_contracts: resolved.length,
    issue_count: issues.length,
    warning_count: warnings.length,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        summary,
        chain_registry: path.relative(CWD, CHAIN_REGISTRY_PATH),
        workflow_registry: path.relative(CWD, WORKFLOW_REGISTRY_PATH),
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

  console.log("Deployment Chain Contract");
  console.log("============================================================");
  console.log(`status=${summary.status}`);
  console.log(`chain_contracts=${summary.chain_contracts}`);
  console.log(`resolved=${summary.resolved_contracts}`);
  console.log(`issues=${summary.issue_count}`);
  console.log(`warnings=${summary.warning_count}`);
  console.log(`report=${path.relative(CWD, REPORT_PATH)}`);

  process.exit(issues.length === 0 ? 0 : 1);
})().catch((err) => {
  console.error("ERROR:", err.message);
  process.exit(1);
});
