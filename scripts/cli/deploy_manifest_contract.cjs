#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

const CWD = process.cwd();
const WORKFLOW_REGISTRY_PATH = path.join(CWD, "registries", "workflow_registry.yaml");
const CONTRACT_PATH = path.join(CWD, "registries", "deployment_phase1_manifest_contract.yaml");
const REPORT_DIR = path.join(CWD, "tests", "reports");
const REPORT_PATH = path.join(REPORT_DIR, "deploy_manifest_contract_latest.json");

function parseYamlFile(p) {
  if (!fs.existsSync(p)) {
    throw new Error(`Missing YAML file: ${path.relative(CWD, p)}`);
  }
  return YAML.parse(fs.readFileSync(p, "utf8"));
}

function main() {
  const workflowRegistry = parseYamlFile(WORKFLOW_REGISTRY_PATH);
  const contract = parseYamlFile(CONTRACT_PATH);

  const workflows = Array.isArray(workflowRegistry.workflows) ? workflowRegistry.workflows : [];
  const rules = contract.rules || {};
  const wf900Policy = contract.wf900_reference_policy || {};
  const wf900Required = new Set(Array.isArray(wf900Policy.required_for_workflow_ids) ? wf900Policy.required_for_workflow_ids : []);

  const issues = [];
  const warnings = [];
  const resolved = [];

  for (const wf of workflows) {
    const workflowId = wf.workflow_id;
    const manifestPath = wf.manifest_file ? path.join(CWD, wf.manifest_file) : null;

    if (rules.require_manifest_file_exists && (!manifestPath || !fs.existsSync(manifestPath))) {
      issues.push({
        type: "manifest_missing",
        workflow_id: workflowId,
        manifest_file: wf.manifest_file || null,
      });
      continue;
    }

    let manifest;
    try {
      manifest = parseYamlFile(manifestPath);
    } catch (err) {
      if (rules.require_manifest_parsable_yaml) {
        issues.push({
          type: "manifest_parse_failed",
          workflow_id: workflowId,
          manifest_file: wf.manifest_file,
          error: err.message,
        });
        continue;
      }
      warnings.push({
        type: "manifest_parse_warning",
        workflow_id: workflowId,
        manifest_file: wf.manifest_file,
        error: err.message,
      });
      continue;
    }

    if (rules.require_manifest_workflow_id_match) {
      const manifestWfId = manifest?.workflow_id || null;
      if (manifestWfId !== workflowId) {
        issues.push({
          type: "manifest_workflow_id_mismatch",
          workflow_id: workflowId,
          manifest_file: wf.manifest_file,
          expected: workflowId,
          actual: manifestWfId,
        });
      }
    }

    if (rules.require_manifest_name_field && !manifest?.name) {
      issues.push({
        type: "manifest_name_missing",
        workflow_id: workflowId,
        manifest_file: wf.manifest_file,
      });
    }

    if (rules.require_manifest_dependencies_array_or_list) {
      const deps = manifest?.dependencies;
      if (deps === undefined) {
        issues.push({
          type: "manifest_dependencies_missing",
          workflow_id: workflowId,
          manifest_file: wf.manifest_file,
        });
      }
    }

    if (wf900Policy.require_wf900_string_presence && wf900Required.has(workflowId)) {
      const raw = JSON.stringify(manifest);
      if (!raw.includes("WF-900")) {
        issues.push({
          type: "manifest_missing_wf900_reference",
          workflow_id: workflowId,
          manifest_file: wf.manifest_file,
        });
      }
    }

    resolved.push({
      workflow_id: workflowId,
      manifest_file: wf.manifest_file,
      manifest_name: manifest?.name || null,
      manifest_workflow_id: manifest?.workflow_id || null,
      has_wf900_reference: JSON.stringify(manifest).includes("WF-900"),
    });
  }

  const summary = {
    status: issues.length === 0 ? "PASS" : "FAIL",
    workflows_checked: workflows.length,
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
        contract_file: path.relative(CWD, CONTRACT_PATH),
        workflow_registry_file: path.relative(CWD, WORKFLOW_REGISTRY_PATH),
        resolved,
        issues,
        warnings,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log("Deployment Manifest Contract");
  console.log("============================================================");
  console.log(`status=${summary.status}`);
  console.log(`workflows_checked=${summary.workflows_checked}`);
  console.log(`resolved=${summary.resolved_count}`);
  console.log(`issues=${summary.issue_count}`);
  console.log(`warnings=${summary.warning_count}`);
  console.log(`report=${path.relative(CWD, REPORT_PATH)}`);

  process.exit(issues.length === 0 ? 0 : 1);
}

try {
  main();
} catch (err) {
  console.error("ERROR:", err.message);
  process.exit(1);
}

