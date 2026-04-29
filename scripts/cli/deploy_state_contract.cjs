#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

const CWD = process.cwd();
const CONTRACT_PATH = path.join(CWD, "registries", "deployment_phase1_state_contract.yaml");
const REPORT_DIR = path.join(CWD, "tests", "reports");
const REPORT_PATH = path.join(REPORT_DIR, "deploy_state_contract_latest.json");

function parseJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function resolveShape(value) {
  if (Array.isArray(value)) return "root_array";
  if (!value || typeof value !== "object") return "invalid";
  if (Array.isArray(value.entries)) return "entries_object";
  if (Array.isArray(value.packets)) return "packets_object";
  if (Array.isArray(value.records)) return "records_object";
  return "object_without_supported_collection";
}

function rel(p) {
  return path.relative(CWD, p).replaceAll("\\", "/");
}

function run() {
  if (!fs.existsSync(CONTRACT_PATH)) {
    throw new Error(`Missing state contract registry: ${rel(CONTRACT_PATH)}`);
  }

  const contract = YAML.parse(fs.readFileSync(CONTRACT_PATH, "utf8"));
  const requiredFiles = Array.isArray(contract.required_state_files) ? contract.required_state_files : [];
  const dossierContract = contract.dossier_contract || {};

  const issues = [];
  const resolved = [];

  for (const item of requiredFiles) {
    const fullPath = path.join(CWD, item.path || "");
    if (!item.path || !fs.existsSync(fullPath)) {
      issues.push({ type: "state_file_missing", path: item.path || null });
      continue;
    }

    let json;
    try {
      json = parseJson(fullPath);
    } catch (err) {
      issues.push({ type: "state_file_parse_failed", path: item.path, error: err.message });
      continue;
    }

    const shape = resolveShape(json);
    const accepted = new Set(Array.isArray(item.accepted_shapes) ? item.accepted_shapes : []);
    if (!accepted.has(shape)) {
      issues.push({
        type: "state_file_shape_mismatch",
        path: item.path,
        shape,
        accepted_shapes: [...accepted],
      });
      continue;
    }

    let count = 0;
    if (shape === "root_array") count = json.length;
    if (shape === "entries_object") count = json.entries.length;
    if (shape === "packets_object") count = json.packets.length;
    if (shape === "records_object") count = json.records.length;
    resolved.push({ path: item.path, shape, items: count });
  }

  const dossierDir = path.join(CWD, dossierContract.directory || "dossiers");
  if (!fs.existsSync(dossierDir)) {
    issues.push({ type: "dossier_directory_missing", path: rel(dossierDir) });
  } else {
    const extension = dossierContract.extension || ".json";
    const files = fs.readdirSync(dossierDir).filter((f) => f.endsWith(extension));
    const minFiles = Number(dossierContract.min_files || 1);
    if (files.length < minFiles) {
      issues.push({
        type: "dossier_min_files_violation",
        min_files: minFiles,
        actual_files: files.length,
      });
    }

    const requiredRoot = Array.isArray(dossierContract.required_root_keys) ? dossierContract.required_root_keys : [];
    const requiredAnyOfRoot = Array.isArray(dossierContract.required_any_of_root_keys)
      ? dossierContract.required_any_of_root_keys
      : [];
    const acceptedAudit = new Set(Array.isArray(dossierContract.accepted_audit_keys) ? dossierContract.accepted_audit_keys : []);

    for (const file of files) {
      const full = path.join(dossierDir, file);
      let dossier;
      try {
        dossier = parseJson(full);
      } catch (err) {
        issues.push({ type: "dossier_parse_failed", file: `${dossierContract.directory}/${file}`, error: err.message });
        continue;
      }

      for (const key of requiredRoot) {
        if (!(key in dossier)) {
          issues.push({ type: "dossier_missing_required_key", file: `${dossierContract.directory}/${file}`, key });
        }
      }

      if (requiredAnyOfRoot.length > 0) {
        const hasAny = requiredAnyOfRoot.some((k) => k in dossier);
        if (!hasAny) {
          issues.push({
            type: "dossier_missing_required_any_of_key",
            file: `${dossierContract.directory}/${file}`,
            required_any_of_root_keys: requiredAnyOfRoot,
          });
        }
      }

      if (dossier.namespaces && typeof dossier.namespaces !== "object") {
        issues.push({ type: "dossier_namespaces_not_object", file: `${dossierContract.directory}/${file}` });
      }

      if (acceptedAudit.size > 0) {
        const hasAudit = [...acceptedAudit].some((k) => k in dossier);
        if (!hasAudit) {
          issues.push({
            type: "dossier_missing_audit_key",
            file: `${dossierContract.directory}/${file}`,
            accepted_audit_keys: [...acceptedAudit],
          });
        }
      }
    }
  }

  const summary = {
    status: issues.length === 0 ? "PASS" : "FAIL",
    checked_state_files: requiredFiles.length,
    checked_dossier_dir: dossierContract.directory || "dossiers",
    issue_count: issues.length,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        summary,
        contract_file: rel(CONTRACT_PATH),
        resolved,
        issues,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log("Deployment State Contract");
  console.log("============================================================");
  console.log(`status=${summary.status}`);
  console.log(`checked_state_files=${summary.checked_state_files}`);
  console.log(`issue_count=${summary.issue_count}`);
  console.log(`report=${rel(REPORT_PATH)}`);

  process.exit(issues.length === 0 ? 0 : 1);
}

try {
  run();
} catch (err) {
  console.error("ERROR:", err.message);
  process.exit(1);
}
