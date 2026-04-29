#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const YAML = require("yaml");

const CWD = process.cwd();
const POLICY_PATH = path.join(CWD, "registries", "deployment_phase1_provider_credential_policy.yaml");
const PROVIDER_REGISTRY_PATH = path.join(CWD, "registries", "provider_registry.yaml");
const WORKFLOW_REGISTRY_PATH = path.join(CWD, "registries", "workflow_registry.yaml");
const REPORT_DIR = path.join(CWD, "tests", "reports");
const REPORT_PATH = path.join(REPORT_DIR, "deploy_credential_provider_lock_latest.json");
const DB_PATH = path.join(process.env.N8N_USER_FOLDER || "C:/ShadowEmpire/n8n_user", ".n8n", "database.sqlite");

function parseYamlFile(p) {
  if (!fs.existsSync(p)) throw new Error(`Missing file: ${p}`);
  return YAML.parse(fs.readFileSync(p, "utf8"));
}

function asSet(items) {
  return new Set(Array.isArray(items) ? items : []);
}

function extractCredentialNodeViolations(nodes, fileOrName) {
  const violations = [];
  for (const node of nodes || []) {
    if (node.credentials && Object.keys(node.credentials).length > 0) {
      violations.push({
        scope: fileOrName,
        node_name: node.name,
        node_type: node.type,
        credentials: Object.keys(node.credentials),
      });
    }
  }
  return violations;
}

function extractHttpHostViolations(nodes, fileOrName, allowedHosts, allowedPorts) {
  const violations = [];
  const warnings = [];
  for (const node of nodes || []) {
    if (node.type !== "n8n-nodes-base.httpRequest") continue;
    const url = node?.parameters?.url;
    if (typeof url !== "string" || !url.trim()) continue;

    if (url.includes("{{")) {
      warnings.push({
        scope: fileOrName,
        node_name: node.name,
        reason: "dynamic_url_expression_not_strictly_validated",
        value: url,
      });
      continue;
    }

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      warnings.push({
        scope: fileOrName,
        node_name: node.name,
        reason: "non_url_or_relative_value_skipped",
        value: url,
      });
      continue;
    }

    const host = (parsed.hostname || "").toLowerCase();
    const port = parsed.port ? Number(parsed.port) : parsed.protocol === "https:" ? 443 : 80;
    if (!allowedHosts.has(host)) {
      violations.push({
        scope: fileOrName,
        node_name: node.name,
        node_type: node.type,
        reason: "host_not_allowed_in_phase1",
        host,
        url,
      });
      continue;
    }
    if (!allowedPorts.has(port)) {
      violations.push({
        scope: fileOrName,
        node_name: node.name,
        node_type: node.type,
        reason: "port_not_allowed_in_phase1",
        host,
        port,
        url,
      });
    }
  }
  return { violations, warnings };
}

function checkProviderRegistry(policy, providerRegistry) {
  const issues = [];
  const providers = Array.isArray(providerRegistry.providers) ? providerRegistry.providers : [];
  const byId = new Map(providers.map((p) => [p.provider_id, p]));

  const requiredDefault = policy.provider_policy?.required_default_provider;
  const actualDefault = providerRegistry?.closure_contract?.default_phase1_provider;
  if (requiredDefault && actualDefault !== requiredDefault) {
    issues.push({
      type: "provider_default_mismatch",
      expected: requiredDefault,
      actual: actualDefault || null,
    });
  }

  const requiredEscalation = policy.provider_policy?.required_escalation_workflow;
  for (const p of providers) {
    if (requiredEscalation && p.escalation_workflow !== requiredEscalation) {
      issues.push({
        type: "provider_escalation_workflow_mismatch",
        provider_id: p.provider_id,
        expected: requiredEscalation,
        actual: p.escalation_workflow || null,
      });
    }
  }

  const requiredAllowed = asSet(policy.provider_policy?.required_phase1_allowed_provider_ids);
  const actualAllowed = new Set(providers.filter((p) => p.phase1_allowed === true).map((p) => p.provider_id));
  for (const id of requiredAllowed) {
    if (!actualAllowed.has(id)) {
      issues.push({ type: "required_phase1_provider_not_allowed", provider_id: id });
    }
  }
  for (const id of actualAllowed) {
    if (!requiredAllowed.has(id)) {
      issues.push({ type: "unexpected_phase1_allowed_provider", provider_id: id });
    }
  }

  const requiredDeferred = asSet(policy.provider_policy?.required_deferred_provider_ids);
  for (const id of requiredDeferred) {
    const p = byId.get(id);
    if (!p) {
      issues.push({ type: "required_deferred_provider_missing", provider_id: id });
      continue;
    }
    if (p.status !== "deferred" || p.phase1_allowed !== false) {
      issues.push({
        type: "required_deferred_provider_policy_violation",
        provider_id: id,
        expected_status: "deferred",
        actual_status: p.status,
        expected_phase1_allowed: false,
        actual_phase1_allowed: p.phase1_allowed,
      });
    }
  }

  const requiredActive = asSet(policy.provider_policy?.required_active_provider_ids);
  for (const id of requiredActive) {
    const p = byId.get(id);
    if (!p) {
      issues.push({ type: "required_active_provider_missing", provider_id: id });
      continue;
    }
    if (p.status !== "active") {
      issues.push({
        type: "required_active_provider_not_active",
        provider_id: id,
        actual_status: p.status,
      });
    }
  }

  const requiredAuthNone = asSet(policy.provider_policy?.required_provider_auth_none_ids);
  for (const id of requiredAuthNone) {
    const p = byId.get(id);
    if (!p) {
      issues.push({ type: "required_auth_none_provider_missing", provider_id: id });
      continue;
    }
    if ((p.auth_style || "").toLowerCase() !== "none") {
      issues.push({
        type: "required_auth_none_violation",
        provider_id: id,
        actual_auth_style: p.auth_style || null,
      });
    }
  }

  return issues;
}

function checkRegistryWorkflowFiles(policy, workflowRegistry, allowedHosts, allowedPorts) {
  const issues = [];
  const warnings = [];
  const workflows = Array.isArray(workflowRegistry.workflows) ? workflowRegistry.workflows : [];
  for (const wf of workflows) {
    const source = wf.source_file ? path.join(CWD, wf.source_file) : null;
    if (!source || !fs.existsSync(source)) {
      issues.push({ type: "workflow_source_missing", workflow_id: wf.workflow_id, source_file: wf.source_file || null });
      continue;
    }
    const json = JSON.parse(fs.readFileSync(source, "utf8"));
    if (policy.workflow_credential_policy?.require_zero_workflow_credentials) {
      issues.push(
        ...extractCredentialNodeViolations(json.nodes || [], wf.source_file).map((i) => ({
          type: "workflow_credentials_not_allowed",
          workflow_id: wf.workflow_id,
          ...i,
        }))
      );
    }
    const http = extractHttpHostViolations(json.nodes || [], wf.source_file, allowedHosts, allowedPorts);
    issues.push(
      ...http.violations.map((v) => ({
        type: "workflow_http_policy_violation",
        workflow_id: wf.workflow_id,
        ...v,
      }))
    );
    warnings.push(
      ...http.warnings.map((w) => ({
        type: "workflow_http_policy_warning",
        workflow_id: wf.workflow_id,
        ...w,
      }))
    );
  }
  return { issues, warnings };
}

async function checkLiveCanonicalWorkflows(policy, allowedHosts, allowedPorts) {
  const issues = [];
  const warnings = [];
  if (!policy.workflow_credential_policy?.enforce_on_live_canonical_workflows) {
    return { issues, warnings, scanned: 0 };
  }
  if (!fs.existsSync(DB_PATH)) {
    issues.push({ type: "n8n_database_missing", db_path: DB_PATH });
    return { issues, warnings, scanned: 0 };
  }

  const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);
  const rows = await new Promise((resolve, reject) => {
    db.all(
      "SELECT id,name,nodes FROM workflow_entity WHERE isArchived=0 AND (name LIKE 'WF-% Canonical' OR name LIKE 'CWF-% Canonical')",
      [],
      (err, out) => (err ? reject(err) : resolve(out || []))
    );
  });
  db.close();

  for (const row of rows) {
    let nodes = [];
    try {
      nodes = JSON.parse(row.nodes || "[]");
    } catch {
      issues.push({ type: "live_workflow_nodes_parse_failed", workflow_name: row.name, workflow_id: row.id });
      continue;
    }
    if (policy.workflow_credential_policy?.require_zero_workflow_credentials) {
      issues.push(
        ...extractCredentialNodeViolations(nodes, row.name).map((i) => ({
          type: "live_workflow_credentials_not_allowed",
          workflow_id: row.id,
          workflow_name: row.name,
          ...i,
        }))
      );
    }
    const http = extractHttpHostViolations(nodes, row.name, allowedHosts, allowedPorts);
    issues.push(
      ...http.violations.map((v) => ({
        type: "live_workflow_http_policy_violation",
        workflow_id: row.id,
        workflow_name: row.name,
        ...v,
      }))
    );
    warnings.push(
      ...http.warnings.map((w) => ({
        type: "live_workflow_http_policy_warning",
        workflow_id: row.id,
        workflow_name: row.name,
        ...w,
      }))
    );
  }
  return { issues, warnings, scanned: rows.length };
}

(async () => {
  const policy = parseYamlFile(POLICY_PATH);
  const providerRegistry = parseYamlFile(PROVIDER_REGISTRY_PATH);
  const workflowRegistry = parseYamlFile(WORKFLOW_REGISTRY_PATH);

  const allowedHosts = asSet(policy.network_policy?.allow_static_http_hosts);
  const allowedPorts = asSet(policy.network_policy?.allow_ports);

  const providerIssues = checkProviderRegistry(policy, providerRegistry);
  const repoWorkflow = checkRegistryWorkflowFiles(policy, workflowRegistry, allowedHosts, allowedPorts);
  const liveWorkflow = await checkLiveCanonicalWorkflows(policy, allowedHosts, allowedPorts);

  const issues = [...providerIssues, ...repoWorkflow.issues, ...liveWorkflow.issues];
  const warnings = [...repoWorkflow.warnings, ...liveWorkflow.warnings];

  const summary = {
    status: issues.length === 0 ? "PASS" : "FAIL",
    issue_count: issues.length,
    warning_count: warnings.length,
    live_canonical_scanned: liveWorkflow.scanned,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        summary,
        policy_file: path.relative(CWD, POLICY_PATH),
        provider_registry_file: path.relative(CWD, PROVIDER_REGISTRY_PATH),
        workflow_registry_file: path.relative(CWD, WORKFLOW_REGISTRY_PATH),
        db_path: DB_PATH,
        issues,
        warnings,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log("Deployment Credential/Provider Lock");
  console.log("============================================================");
  console.log(`status=${summary.status}`);
  console.log(`issues=${summary.issue_count}`);
  console.log(`warnings=${summary.warning_count}`);
  console.log(`live_canonical_scanned=${summary.live_canonical_scanned}`);
  console.log(`report=${path.relative(CWD, REPORT_PATH)}`);

  process.exit(issues.length === 0 ? 0 : 1);
})().catch((err) => {
  console.error("ERROR:", err.message);
  process.exit(1);
});

