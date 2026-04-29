#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const YAML = require("yaml");

const CWD = process.cwd();
const CONTRACT_PATH = path.join(CWD, "registries", "deployment_phase1_live_workflow_isolation.yaml");
const DB_PATH = path.join(process.env.N8N_USER_FOLDER || "C:/ShadowEmpire/n8n_user", ".n8n", "database.sqlite");
const REPORT_DIR = path.join(CWD, "tests", "reports");
const REPORT_PATH = path.join(REPORT_DIR, "deploy_live_isolation_contract_latest.json");

function parseYaml(p) {
  if (!fs.existsSync(p)) throw new Error(`Missing YAML file: ${p}`);
  return YAML.parse(fs.readFileSync(p, "utf8"));
}

function startsWithAny(value, prefixes) {
  return (prefixes || []).some((p) => value.startsWith(p));
}

function dbAll(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows || [])));
  });
}

(async () => {
  const contract = parseYaml(CONTRACT_PATH);
  const policy = contract.policy || {};
  const legacyPrefixes = Array.isArray(policy.legacy_prefixes) ? policy.legacy_prefixes : ["SE-N8N-"];
  const canonicalPrefixes = Array.isArray(policy.canonical_prefixes) ? policy.canonical_prefixes : ["WF-", "CWF-"];
  const requiredActive = Array.isArray(policy.required_canonical_active_names) ? policy.required_canonical_active_names : [];
  const requiredInactive = Array.isArray(policy.required_canonical_inactive_names) ? policy.required_canonical_inactive_names : [];

  if (!fs.existsSync(DB_PATH)) throw new Error(`n8n database not found: ${DB_PATH}`);
  const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);
  const rows = await dbAll(
    db,
    "SELECT id,name,active,isArchived FROM workflow_entity WHERE isArchived=0 ORDER BY name"
  );
  db.close();

  const legacy = rows.filter((r) => startsWithAny(r.name || "", legacyPrefixes));
  const canonical = rows.filter((r) => startsWithAny(r.name || "", canonicalPrefixes));
  const legacyActive = legacy.filter((r) => r.active === 1);
  const canonicalActive = canonical.filter((r) => r.active === 1);

  const issues = [];
  const warnings = [];

  if (policy.legacy_active_allowed === false && legacyActive.length > 0) {
    issues.push({
      type: "legacy_active_not_allowed",
      active_legacy_workflows: legacyActive.map((w) => ({ id: w.id, name: w.name })),
    });
  }

  if (policy.canonical_presence_required === true && canonical.length === 0) {
    issues.push({ type: "canonical_presence_required_but_missing" });
  }

  const minTotal = Number(policy.canonical_min_total || 0);
  const minActive = Number(policy.canonical_min_active || 0);
  if (canonical.length < minTotal) {
    issues.push({ type: "canonical_min_total_violation", expected_min: minTotal, actual: canonical.length });
  }
  if (canonicalActive.length < minActive) {
    issues.push({ type: "canonical_min_active_violation", expected_min: minActive, actual: canonicalActive.length });
  }

  for (const name of requiredActive) {
    const wf = canonical.find((w) => w.name === name);
    if (!wf) {
      issues.push({ type: "required_canonical_active_missing", workflow_name: name });
      continue;
    }
    if (wf.active !== 1) {
      issues.push({ type: "required_canonical_active_not_active", workflow_name: name, id: wf.id });
    }
  }

  for (const name of requiredInactive) {
    const wf = canonical.find((w) => w.name === name);
    if (!wf) {
      issues.push({ type: "required_canonical_inactive_missing", workflow_name: name });
      continue;
    }
    if (wf.active !== 0) {
      issues.push({ type: "required_canonical_inactive_not_inactive", workflow_name: name, id: wf.id });
    }
  }

  if (legacy.length === 0) {
    warnings.push({ type: "no_legacy_workflows_present" });
  }

  const summary = {
    status: issues.length === 0 ? "PASS" : "FAIL",
    legacy_total: legacy.length,
    legacy_active: legacyActive.length,
    canonical_total: canonical.length,
    canonical_active: canonicalActive.length,
    issue_count: issues.length,
    warning_count: warnings.length,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        summary,
        contract_file: path.relative(CWD, CONTRACT_PATH),
        db_path: DB_PATH,
        legacy: legacy.map((w) => ({ id: w.id, name: w.name, active: w.active })),
        canonical: canonical.map((w) => ({ id: w.id, name: w.name, active: w.active })),
        issues,
        warnings,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log("Deployment Live Workflow Isolation");
  console.log("============================================================");
  console.log(`status=${summary.status}`);
  console.log(`legacy_total=${summary.legacy_total}`);
  console.log(`legacy_active=${summary.legacy_active}`);
  console.log(`canonical_total=${summary.canonical_total}`);
  console.log(`canonical_active=${summary.canonical_active}`);
  console.log(`issues=${summary.issue_count}`);
  console.log(`warnings=${summary.warning_count}`);
  console.log(`report=${path.relative(CWD, REPORT_PATH)}`);

  process.exit(issues.length === 0 ? 0 : 1);
})().catch((err) => {
  console.error("ERROR:", err.message);
  process.exit(1);
});

