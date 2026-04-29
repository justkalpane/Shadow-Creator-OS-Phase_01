#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const CWD = process.cwd();
const REPORT_DIR = path.join(CWD, "tests", "reports");
const SWEEP_REPORT = path.join(REPORT_DIR, "deploy_regression_sweep_latest.json");
const OUT_JSON = path.join(REPORT_DIR, "deploy_persistence_contract_latest.json");
const OUT_MD = path.join(REPORT_DIR, "deploy_persistence_contract_latest.md");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), "utf8");
}

function main() {
  if (!fs.existsSync(SWEEP_REPORT)) {
    fail(`Missing sweep report: ${path.relative(CWD, SWEEP_REPORT)}. Run npm run deploy:regression-sweep first.`);
  }

  const sweep = readJson(SWEEP_REPORT);
  const matrix = Array.isArray(sweep.ingress_matrix) ? sweep.ingress_matrix : [];
  const persisted = sweep.persisted || {};
  const chain = sweep.chain_evidence || {};
  const deltas = sweep.deltas || {};

  const checks = [
    {
      id: "ingress_matrix_pass",
      pass: String(sweep?.summary?.status || "").toUpperCase() === "PASS" && matrix.length >= 3 && matrix.every((m) => m.result === "PASS"),
      evidence: `summary.status=${sweep?.summary?.status || "UNKNOWN"}, rows=${matrix.length}`,
    },
    {
      id: "downstream_chain_present",
      pass: Number(chain.downstream_count || 0) > 0 && Number(chain.total_new_executions || 0) >= 3,
      evidence: `downstream_count=${chain.downstream_count || 0}, total_new_executions=${chain.total_new_executions || 0}`,
    },
    {
      id: "packet_persistence_positive",
      pass: Number(persisted.packet_entries_added || 0) > 0,
      evidence: `packet_entries_added=${persisted.packet_entries_added || 0}`,
    },
    {
      id: "route_run_persistence_positive",
      pass: Number(persisted.route_runs_added || 0) > 0,
      evidence: `route_runs_added=${persisted.route_runs_added || 0}`,
    },
    {
      id: "state_delta_positive",
      pass: Number(deltas.packet_delta || 0) > 0 && Number(deltas.route_run_delta || 0) > 0,
      evidence: `packet_delta=${deltas.packet_delta || 0}, route_run_delta=${deltas.route_run_delta || 0}`,
    },
  ];

  const failed = checks.filter((c) => !c.pass);
  const status = failed.length ? "FAIL" : "PASS";

  const out = {
    summary: {
      status,
      generated_at: new Date().toISOString(),
      source_sweep_report: path.relative(CWD, SWEEP_REPORT),
      check_total: checks.length,
      check_pass: checks.length - failed.length,
      check_fail: failed.length,
    },
    checks,
    failed_checks: failed,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  writeJson(OUT_JSON, out);

  const md = [
    "# Deployment Persistence Contract",
    "",
    `- status: ${status}`,
    `- generated_at: ${out.summary.generated_at}`,
    "",
    "| Check | Evidence | Result |",
    "|---|---|---|",
    ...checks.map((c) => `| ${c.id} | ${String(c.evidence).replace(/\|/g, "/")} | ${c.pass ? "PASS" : "FAIL"} |`),
    ""
  ].join("\n");
  fs.writeFileSync(OUT_MD, md, "utf8");

  console.log("Deployment Persistence Contract");
  console.log("============================================================");
  console.log(`status=${status}`);
  console.log(`checks_pass=${out.summary.check_pass}`);
  console.log(`checks_fail=${out.summary.check_fail}`);
  console.log(`json_report=${path.relative(CWD, OUT_JSON)}`);
  console.log(`md_report=${path.relative(CWD, OUT_MD)}`);
  if (status !== "PASS") process.exit(1);
}

main();
