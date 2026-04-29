#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const YAML = require("yaml");

const CWD = process.cwd();
const REPORT_DIR = path.join(CWD, "tests", "reports");
const JSON_OUT = path.join(REPORT_DIR, "phase8_wiring_proof_latest.json");
const MD_OUT = path.join(REPORT_DIR, "phase8_wiring_proof_latest.md");
const N8N_DB = "C:/ShadowEmpire/n8n_user/.n8n/database.sqlite";

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function readYaml(filePath) {
  return YAML.parse(readText(filePath));
}

function dbAll(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function dbGet(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function safeParseJsonMaybeDouble(raw) {
  let parsed = JSON.parse(raw);
  if (typeof parsed === "string") parsed = JSON.parse(parsed);
  return parsed;
}

function parseN8nExecutionData(raw) {
  const parsed = safeParseJsonMaybeDouble(raw);
  if (!Array.isArray(parsed)) return parsed;

  const refs = parsed;
  const isRef = (v) => typeof v === "string" && /^\d+$/.test(v) && refs[Number(v)] !== undefined;
  const root = refs[0];
  const seen = new Set();
  const stack = [root];
  seen.add(root);

  while (stack.length) {
    const cur = stack.pop();
    if (!cur || typeof cur !== "object") continue;
    if (Array.isArray(cur)) {
      for (let i = 0; i < cur.length; i += 1) {
        let v = cur[i];
        if (isRef(v)) {
          v = refs[Number(v)];
          cur[i] = v;
        }
        if (v && typeof v === "object" && !seen.has(v)) {
          seen.add(v);
          stack.push(v);
        }
      }
    } else {
      for (const k of Object.keys(cur)) {
        let v = cur[k];
        if (isRef(v)) {
          v = refs[Number(v)];
          cur[k] = v;
        }
        if (v && typeof v === "object" && !seen.has(v)) {
          seen.add(v);
          stack.push(v);
        }
      }
    }
  }

  return root;
}

function listCanonicalChildWorkflows(workflowsDir) {
  return fs
    .readdirSync(workflowsDir)
    .filter((f) => /^CWF-\d+\.json$/i.test(f))
    .sort((a, b) => a.localeCompare(b));
}

function analyzeWorkflowFile(filePath) {
  const wf = readJson(filePath);
  const nodes = Array.isArray(wf.nodes) ? wf.nodes : [];
  const codeNodes = nodes.filter((n) => n.type === "n8n-nodes-base.code");
  const codes = codeNodes.map((n) => String(n?.parameters?.jsCode || ""));

  const hasSkillLoaderRequire = codes.some((c) => c.includes("engine/skill_loader/skill_loader.js"));
  const hasExecuteSkill = codes.some((c) => c.includes("executeSkill("));
  const hasSyntheticFallback = codes.some(
    (c) => c.includes("synthetic") || c.includes("fallback_packet") || c.includes("mock_packet")
  );
  const strictNullOnError = codes.some((c) => c.includes("runtime_packet: null") && c.includes("had_error: true"));
  const hasDirectorRouterRequire = codes.some((c) => c.includes("engine/directors/director_runtime_router.js"));
  const hasExecuteSkillChain = codes.some((c) => c.includes("executeSkillChain("));
  const hasRegistryRefs = codes.some((c) => c.includes("skill_registry") && c.includes("director_binding"));

  return {
    file: path.basename(filePath),
    workflow_id: wf.meta?.workflow_id || null,
    workflow_name: wf.name || null,
    hasSkillLoaderRequire,
    hasExecuteSkill,
    hasSyntheticFallback,
    strictNullOnError,
    hasDirectorRouterRequire,
    hasExecuteSkillChain,
    hasRegistryRefs,
  };
}

function analyzeParentPackWorkflow(filePath) {
  const wf = readJson(filePath);
  const nodes = Array.isArray(wf.nodes) ? wf.nodes : [];
  const packInitNode = nodes.find((n) => n.name === "Pack Initialization Node");
  const code = String(packInitNode?.parameters?.jsCode || "");
  const hasPrimaryDirector = code.includes("primary_director");
  const hasStrategicAuthority = code.includes("strategic_authority");
  const hasGovernanceAuthority = code.includes("governance_authority");
  return {
    file: path.basename(filePath),
    workflow_id: wf.meta?.workflow_id || null,
    workflow_name: wf.name || null,
    hasPrimaryDirector,
    hasStrategicAuthority,
    hasGovernanceAuthority,
  };
}

function classify(passCondition, partialCondition) {
  if (passCondition) return "PASS";
  if (partialCondition) return "PARTIAL";
  return "FAIL";
}

async function gatherRuntimeEvidence() {
  const out = {
    db_path: N8N_DB,
    available: false,
    error: null,
    canonical_workflows: [],
    latest_executions: [],
    execution_payload_observability: {
      inspected_execution_id: null,
      run_data_nodes: 0,
      has_node_payload_data: false,
      probe_node_present: false,
      probe_status: null,
      probe_had_error: null,
      note: "",
    },
  };

  if (!fs.existsSync(N8N_DB)) {
    out.error = "n8n database not found";
    return out;
  }

  const db = new sqlite3.Database(N8N_DB, sqlite3.OPEN_READONLY);
  try {
    const canonicalWorkflows = await dbAll(
      db,
      `
        select id, name, active
        from workflow_entity
        where name like 'WF-%Canonical' or name like 'CWF-%Canonical'
        order by name
      `
    );
    out.canonical_workflows = canonicalWorkflows;

    const latestExecutions = await dbAll(
      db,
      `
        select e.id, e.workflowId, w.name, e.status, e.mode, e.startedAt, e.stoppedAt
        from execution_entity e
        join workflow_entity w on w.id = e.workflowId
        where w.name like 'WF-%Canonical' or w.name like 'CWF-%Canonical'
        order by e.id desc
        limit 120
      `
    );
    out.latest_executions = latestExecutions;

    const sampleCwf = latestExecutions.find((r) => String(r.name || "").startsWith("CWF-"));
    if (sampleCwf) {
      out.execution_payload_observability.inspected_execution_id = sampleCwf.id;
      const row = await dbGet(db, "select data from execution_data where executionId = ?", [sampleCwf.id]);
      if (row && row.data) {
        const parsed = parseN8nExecutionData(row.data);
        const runData = parsed?.resultData?.runData || {};
        const nodeCount = Object.keys(runData).length;
        out.execution_payload_observability.run_data_nodes = nodeCount;
        out.execution_payload_observability.has_node_payload_data = nodeCount > 0;
        const probe = runData["Skill Runtime Probe Node"]?.[0]?.data?.main?.[0]?.[0]?.json;
        out.execution_payload_observability.probe_node_present = !!probe;
        out.execution_payload_observability.probe_status = probe?.phase8_runtime_probe?.status || null;
        out.execution_payload_observability.probe_had_error =
          typeof probe?.phase8_runtime_probe?.had_error === "boolean" ? probe.phase8_runtime_probe.had_error : null;
        out.execution_payload_observability.note =
          nodeCount > 0
            ? "runData present; node-level runtime payload is observable"
            : "runData empty for sampled success execution; runtime payload persistence is disabled or trimmed";
      } else {
        out.execution_payload_observability.note = "no execution_data row found for sampled execution";
      }
    } else {
      out.execution_payload_observability.note = "no canonical CWF executions found";
    }

    out.available = true;
  } catch (err) {
    out.error = String(err && err.message ? err.message : err);
  } finally {
    db.close();
  }
  return out;
}

async function main() {
  const generatedAt = new Date().toISOString();
  const workflowsDir = path.join(CWD, "n8n", "workflows");
  const childFiles = listCanonicalChildWorkflows(workflowsDir);
  const childAnalysis = childFiles.map((f) => analyzeWorkflowFile(path.join(workflowsDir, f)));
  const parentFiles = ["WF-100.json", "WF-200.json", "WF-300.json", "WF-400.json", "WF-500.json", "WF-600.json"];
  const parentAnalysis = parentFiles.map((f) => analyzeParentPackWorkflow(path.join(workflowsDir, f)));

  const skillRegistry = readYaml(path.join(CWD, "registries", "skill_registry.yaml"));
  const directorBindings = readYaml(path.join(CWD, "registries", "director_binding.yaml"));
  const subskillRegistry = readYaml(path.join(CWD, "registries", "subskill_runtime_registry.yaml"));
  const agentClassMatrix = readJson(path.join(CWD, "registries", "agent_class_matrix.json"));
  const subAgentMatrix = readJson(path.join(CWD, "registries", "sub_agent_matrix.json"));

  const subskillEntries = Array.isArray(subskillRegistry?.subskills) ? subskillRegistry.subskills : [];
  const subskillFilesPresent = subskillEntries.filter((s) => {
    const spec = s?.spec_file ? path.join(CWD, String(s.spec_file)) : null;
    const runtimeFile = s?.runtime_file ? path.join(CWD, String(s.runtime_file)) : null;
    return !!(spec && runtimeFile && fs.existsSync(spec) && fs.existsSync(runtimeFile));
  }).length;

  const subAgentEntries = Array.isArray(subAgentMatrix?.entries) ? subAgentMatrix.entries : [];
  const subAgentFilesPresent = subAgentEntries.filter((a) => {
    const p = a?.registry_path ? path.join(CWD, String(a.registry_path)) : null;
    return !!(p && fs.existsSync(p));
  }).length;

  const runtime = await gatherRuntimeEvidence();

  const childCount = childAnalysis.length;
  const parentCount = parentAnalysis.length;
  const skillWired = childAnalysis.filter((x) => x.hasSkillLoaderRequire && x.hasExecuteSkill).length;
  const strictNoSynthetic = childAnalysis.filter((x) => !x.hasSyntheticFallback && x.strictNullOnError).length;
  const directorWired = childAnalysis.filter((x) => x.hasDirectorRouterRequire && x.hasExecuteSkillChain).length;
  const registryRefWired = childAnalysis.filter((x) => x.hasRegistryRefs).length;
  const directorMappedParents = parentAnalysis.filter(
    (x) => x.hasPrimaryDirector && x.hasStrategicAuthority && x.hasGovernanceAuthority
  ).length;

  const canonicalLive = runtime.canonical_workflows.length;
  const canonicalActive = runtime.canonical_workflows.filter((x) => x.active === 1).length;
  const successfulCwfExecutions = runtime.latest_executions.filter(
    (x) => String(x.name || "").startsWith("CWF-") && String(x.status || "").toLowerCase() === "success"
  ).length;

  const directorsStatus = classify(
    directorMappedParents === parentCount && successfulCwfExecutions > 0,
    directorMappedParents > 0 || successfulCwfExecutions > 0 || directorWired > 0
  );
  const skillsStatus = classify(
    skillWired === childCount && strictNoSynthetic === childCount && successfulCwfExecutions > 0,
    skillWired > 0
  );
  const subskillsStatus = classify(
    subskillEntries.length > 0 &&
      subskillFilesPresent === subskillEntries.length &&
      runtime.execution_payload_observability.has_node_payload_data &&
      skillWired === childCount,
    subskillEntries.length > 0 && subskillFilesPresent === subskillEntries.length
  );
  const agentsStatus = classify(
    subAgentEntries.length > 0 &&
      subAgentFilesPresent === subAgentEntries.length &&
      runtime.execution_payload_observability.has_node_payload_data &&
      skillWired === childCount,
    subAgentEntries.length > 0 && subAgentFilesPresent === subAgentEntries.length
  );

  const summary = {
    generated_at: generatedAt,
    phase: "phase8_wiring_proof",
    statuses: {
      directors_runtime_parity: directorsStatus,
      skills_runtime_parity: skillsStatus,
      subskills_runtime_parity: subskillsStatus,
      agents_runtime_parity: agentsStatus,
    },
    totals: {
      canonical_child_workflows: childCount,
      parent_pack_workflows: parentCount,
      child_skill_loader_wired: skillWired,
      child_strict_no_synthetic: strictNoSynthetic,
      child_director_router_wired: directorWired,
      parent_director_mapped: directorMappedParents,
      child_registry_ref_wired: registryRefWired,
      canonical_workflows_live: canonicalLive,
      canonical_workflows_active: canonicalActive,
      recent_successful_cwf_executions: successfulCwfExecutions,
      skill_registry_entries: Array.isArray(skillRegistry?.skills) ? skillRegistry.skills.length : 0,
      director_binding_entries: Array.isArray(directorBindings?.directors)
        ? directorBindings.directors.length
        : 0,
      subskill_registry_entries: Array.isArray(subskillRegistry?.subskills)
        ? subskillRegistry.subskills.length
        : 0,
      agent_class_entries: Array.isArray(agentClassMatrix?.entries) ? agentClassMatrix.entries.length : 0,
      sub_agent_entries: Array.isArray(subAgentMatrix?.entries) ? subAgentMatrix.entries.length : 0,
      subskill_files_present: subskillFilesPresent,
      sub_agent_files_present: subAgentFilesPresent,
    },
    limitations: [
      runtime.execution_payload_observability.has_node_payload_data
        ? null
        : "n8n execution_data.runData is empty for sampled success execution; deep node payload proof is limited",
    ].filter(Boolean),
  };

  const result = {
    summary,
    child_workflow_wiring: childAnalysis,
    parent_workflow_director_mapping: parentAnalysis,
    runtime_evidence: runtime,
    integration_tests: {
      subskill_file_integrity: {
        ok: subskillEntries.length > 0 && subskillFilesPresent === subskillEntries.length,
        total: subskillEntries.length,
        present: subskillFilesPresent,
      },
      subagent_file_integrity: {
        ok: subAgentEntries.length > 0 && subAgentFilesPresent === subAgentEntries.length,
        total: subAgentEntries.length,
        present: subAgentFilesPresent,
      },
    },
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(JSON_OUT, JSON.stringify(result, null, 2), "utf8");

  const md = [
    "# Phase 8 Wiring Proof",
    "",
    `- generated_at: ${generatedAt}`,
    "",
    "## Status",
    `- directors_runtime_parity: ${summary.statuses.directors_runtime_parity}`,
    `- skills_runtime_parity: ${summary.statuses.skills_runtime_parity}`,
    `- subskills_runtime_parity: ${summary.statuses.subskills_runtime_parity}`,
    `- agents_runtime_parity: ${summary.statuses.agents_runtime_parity}`,
    "",
    "## Counts",
    `- canonical_child_workflows: ${summary.totals.canonical_child_workflows}`,
    `- child_skill_loader_wired: ${summary.totals.child_skill_loader_wired}`,
    `- child_strict_no_synthetic: ${summary.totals.child_strict_no_synthetic}`,
    `- child_director_router_wired: ${summary.totals.child_director_router_wired}`,
    `- recent_successful_cwf_executions: ${summary.totals.recent_successful_cwf_executions}`,
    `- skill_registry_entries: ${summary.totals.skill_registry_entries}`,
    `- director_binding_entries: ${summary.totals.director_binding_entries}`,
    `- subskill_registry_entries: ${summary.totals.subskill_registry_entries}`,
    `- agent_class_entries: ${summary.totals.agent_class_entries}`,
    `- sub_agent_entries: ${summary.totals.sub_agent_entries}`,
    "",
    "## Runtime Observability",
    `- has_node_payload_data: ${runtime.execution_payload_observability.has_node_payload_data}`,
    `- note: ${runtime.execution_payload_observability.note}`,
    "",
    "## Limitation Notes",
    ...(summary.limitations.length
      ? summary.limitations.map((l) => `- ${l}`)
      : ["- none"]),
    "",
  ].join("\n");
  fs.writeFileSync(MD_OUT, md, "utf8");

  const overallStatus = Object.values(summary.statuses).includes("FAIL")
    ? "FAIL"
    : Object.values(summary.statuses).includes("PARTIAL")
      ? "PARTIAL"
      : "PASS";

  console.log("Phase 8 Wiring Proof");
  console.log("============================================================");
  console.log(`status=${overallStatus}`);
  console.log(`directors_runtime_parity=${summary.statuses.directors_runtime_parity}`);
  console.log(`skills_runtime_parity=${summary.statuses.skills_runtime_parity}`);
  console.log(`subskills_runtime_parity=${summary.statuses.subskills_runtime_parity}`);
  console.log(`agents_runtime_parity=${summary.statuses.agents_runtime_parity}`);
  console.log(`canonical_child_workflows=${summary.totals.canonical_child_workflows}`);
  console.log(`child_skill_loader_wired=${summary.totals.child_skill_loader_wired}`);
  console.log(`child_director_router_wired=${summary.totals.child_director_router_wired}`);
  console.log(`recent_successful_cwf_executions=${summary.totals.recent_successful_cwf_executions}`);
  console.log(`json_report=${path.relative(CWD, JSON_OUT)}`);
  console.log(`md_report=${path.relative(CWD, MD_OUT)}`);

  process.exit(overallStatus === "FAIL" ? 1 : 0);
}

main().catch((err) => {
  console.error(String(err && err.stack ? err.stack : err));
  process.exit(1);
});
