#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const CWD = process.cwd();
const REPORT_DIR = path.join(CWD, "tests", "reports");
const JSON_OUT = path.join(REPORT_DIR, "deploy_gate_report_latest.json");
const MD_OUT = path.join(REPORT_DIR, "deploy_gate_report_latest.md");

const REQUIRED_REPORTS = [
  "workflow_deploy_reconcile_latest.json",
  "deploy_manifest_contract_latest.json",
  "deploy_live_isolation_contract_latest.json",
  "deploy_state_contract_latest.json",
  "deploy_error_route_contract_latest.json",
  "deploy_chain_contract_latest.json",
  "deploy_ingress_contract_latest.json",
  "deploy_credential_provider_lock_latest.json",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function gitHead() {
  try {
    return execSync("git rev-parse HEAD", { cwd: CWD, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return null;
  }
}

function statusOf(report) {
  if (!report || typeof report !== "object") return "FAIL";
  const summary = report.summary || {};
  const explicit = String(summary.status || "").toUpperCase();
  if (explicit === "PASS") return "PASS";
  if (explicit === "FAIL") return "FAIL";

  // Infer pass/fail for reports that expose numeric error fields instead of status.
  const numericZeroKeys = [
    "drift",
    "missing_live",
    "missing_source",
    "policy_drift",
    "issue_count",
    "issues",
    "error_count",
    "errors",
    "reports_non_pass",
  ];
  let sawSignal = false;
  for (const key of numericZeroKeys) {
    if (Object.prototype.hasOwnProperty.call(summary, key)) {
      sawSignal = true;
      const n = Number(summary[key]);
      if (!Number.isFinite(n) || n !== 0) return "FAIL";
    }
  }
  return sawSignal ? "PASS" : "FAIL";
}

function main() {
  const missing = [];
  const rows = [];

  for (const file of REQUIRED_REPORTS) {
    const full = path.join(REPORT_DIR, file);
    if (!fs.existsSync(full)) {
      missing.push(file);
      rows.push({ report: file, status: "MISSING", summary: null });
      continue;
    }
    let parsed;
    try {
      parsed = readJson(full);
    } catch (err) {
      rows.push({
        report: file,
        status: "INVALID",
        summary: { parse_error: err.message },
      });
      continue;
    }
    rows.push({
      report: file,
      status: statusOf(parsed),
      summary: parsed.summary || {},
    });
  }

  const failed = rows.filter((r) => r.status !== "PASS");
  const overall = failed.length === 0 ? "PASS" : "FAIL";
  const generatedAt = new Date().toISOString();
  const head = gitHead();

  const out = {
    summary: {
      status: overall,
      reports_required: REQUIRED_REPORTS.length,
      reports_pass: rows.filter((r) => r.status === "PASS").length,
      reports_non_pass: failed.length,
      generated_at: generatedAt,
      git_head: head,
    },
    rows,
    missing_reports: missing,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(JSON_OUT, JSON.stringify(out, null, 2), "utf8");

  const md = [
    "# Deployment Gate Report",
    "",
    `- generated_at: ${generatedAt}`,
    `- git_head: ${head || "UNKNOWN"}`,
    `- overall_status: ${overall}`,
    "",
    "| Report | Status |",
    "|---|---|",
    ...rows.map((r) => `| ${r.report} | ${r.status} |`),
    "",
  ].join("\n");
  fs.writeFileSync(MD_OUT, md, "utf8");

  console.log("Deployment Gate Report");
  console.log("============================================================");
  console.log(`status=${overall}`);
  console.log(`reports_required=${REQUIRED_REPORTS.length}`);
  console.log(`reports_pass=${rows.filter((r) => r.status === "PASS").length}`);
  console.log(`reports_non_pass=${failed.length}`);
  console.log(`json_report=${path.relative(CWD, JSON_OUT)}`);
  console.log(`md_report=${path.relative(CWD, MD_OUT)}`);

  process.exit(overall === "PASS" ? 0 : 1);
}

main();
