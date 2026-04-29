#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const YAML = require("yaml");

const CWD = process.cwd();
const POLICY_PATH = path.join(CWD, "registries", "deployment_phase1_release_promotion_gate.yaml");
const REPORT_DIR = path.join(CWD, "tests", "reports");
const OUT_JSON = path.join(REPORT_DIR, "deploy_release_promotion_gate_latest.json");
const OUT_MD = path.join(REPORT_DIR, "deploy_release_promotion_gate_latest.md");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${stable(value[k])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256Text(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function runNpmScript(scriptName) {
  const isWin = process.platform === "win32";
  const cmd = isWin ? (process.env.ComSpec || "cmd.exe") : "npm";
  const args = isWin ? ["/d", "/s", "/c", `npm.cmd run ${scriptName}`] : ["run", scriptName];
  const run = spawnSync(cmd, args, { cwd: CWD, stdio: "inherit", shell: false, env: process.env });
  return {
    script: scriptName,
    exit_code: run.status == null ? 1 : run.status,
    signal: run.signal || null,
    error: run.error ? String(run.error.message || run.error) : null,
    pass: run.status === 0,
  };
}

function loadPolicy() {
  if (!fs.existsSync(POLICY_PATH)) fail(`Missing policy: ${path.relative(CWD, POLICY_PATH)}`);
  const policy = YAML.parse(fs.readFileSync(POLICY_PATH, "utf8")) || {};
  if (!Array.isArray(policy.required_steps) || !policy.required_steps.length) {
    fail("Policy missing required_steps.");
  }
  if (!Array.isArray(policy.required_reports) || !policy.required_reports.length) {
    fail("Policy missing required_reports.");
  }
  return policy;
}

function verifyReport(reportRule) {
  const relPath = reportRule.path;
  const expectedStatus = String(reportRule.expected_status || "PASS").toUpperCase();
  const absPath = path.join(CWD, relPath);
  if (!fs.existsSync(absPath)) {
    return {
      path: relPath,
      expected_status: expectedStatus,
      status: "MISSING",
      pass: false,
      file_sha256: null,
      stable_sha256: null,
      error: "file_not_found",
    };
  }
  const parsed = JSON.parse(fs.readFileSync(absPath, "utf8"));
  const status = String(parsed?.summary?.status || parsed?.status || "UNKNOWN").toUpperCase();
  return {
    path: relPath,
    expected_status: expectedStatus,
    status,
    pass: status === expectedStatus,
    file_sha256: sha256File(absPath),
    stable_sha256: sha256Text(stable(parsed)),
    error: null,
  };
}

function main() {
  const policy = loadPolicy();
  const steps = policy.required_steps.map((s) => String(s.npm_script || "").trim()).filter(Boolean);

  const stepResults = [];
  for (const step of steps) {
    const result = runNpmScript(step);
    stepResults.push(result);
    if (!result.pass) {
      // Continue to report verification for full evidence, but final status will FAIL.
    }
  }

  const reportResults = policy.required_reports.map(verifyReport);

  const stepFail = stepResults.some((s) => !s.pass);
  const reportFail = reportResults.some((r) => !r.pass);
  const status = stepFail || reportFail ? "FAIL" : "PASS";

  const payload = {
    summary: {
      status,
      generated_at: new Date().toISOString(),
      steps_total: stepResults.length,
      steps_pass: stepResults.filter((s) => s.pass).length,
      steps_fail: stepResults.filter((s) => !s.pass).length,
      reports_total: reportResults.length,
      reports_pass: reportResults.filter((r) => r.pass).length,
      reports_fail: reportResults.filter((r) => !r.pass).length,
    },
    policy: {
      path: path.relative(CWD, POLICY_PATH),
      version: policy.version || null,
      phase: policy.phase || null,
      name: policy.name || null,
    },
    step_results: stepResults,
    report_results: reportResults,
  };

  const signatureDigest = sha256Text(stable(payload));
  const out = {
    ...payload,
    signature: {
      algorithm: String(policy.signature?.algorithm || "sha256"),
      signer: String(policy.signature?.signer || "shadow-phase1-release-promotion-gate"),
      digest: signatureDigest,
    },
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2), "utf8");

  const md = [
    "# Release Promotion Gate",
    "",
    `- status: ${out.summary.status}`,
    `- generated_at: ${out.summary.generated_at}`,
    `- signature: ${out.signature.algorithm}:${out.signature.digest}`,
    "",
    "## Step Results",
    "| Step | Exit Code | Result |",
    "|---|---:|---|",
    ...out.step_results.map((s) => `| ${s.script} | ${s.exit_code} | ${s.pass ? "PASS" : "FAIL"} |`),
    "",
    "## Report Results",
    "| Report | Expected | Actual | Result |",
    "|---|---|---|---|",
    ...out.report_results.map((r) => `| ${r.path} | ${r.expected_status} | ${r.status} | ${r.pass ? "PASS" : "FAIL"} |`),
    "",
  ].join("\n");
  fs.writeFileSync(OUT_MD, md, "utf8");

  console.log("Release Promotion Gate");
  console.log("============================================================");
  console.log(`status=${out.summary.status}`);
  console.log(`steps_pass=${out.summary.steps_pass}/${out.summary.steps_total}`);
  console.log(`reports_pass=${out.summary.reports_pass}/${out.summary.reports_total}`);
  console.log(`signature=${out.signature.algorithm}:${out.signature.digest}`);
  console.log(`json_report=${path.relative(CWD, OUT_JSON)}`);
  console.log(`md_report=${path.relative(CWD, OUT_MD)}`);

  if (out.summary.status !== "PASS") process.exit(1);
}

main();
