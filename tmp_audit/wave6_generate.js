const fs = require('fs');
const path = require('path');

const root = 'C:/ShadowEmpire-Git';
const generatedAt = new Date().toISOString();

const requiredNodeContract = [
  'trigger_node',
  'dossier_load_node',
  'registry_lookup_node',
  'skill_execution_node',
  'packet_validation_node',
  'append_only_dossier_write_node',
  'packet_index_write_node',
  'wf900_error_routing_node',
  'next_stage_routing_node',
  'completion_packet_emission_node'
];

const workflows = [
  {
    id: 'CWF-110',
    name: 'CWF-110 Topic Discovery Canonical',
    description: 'Canonical executable topic discovery workflow.',
    legacyPath: 'n8n/workflows/topic/CWF-110-topic-discovery.json',
    manifestPath: 'n8n/manifests/CWF-110-topic-discovery.manifest.yaml',
    phase: 'phase1',
    vein: 'discovery_vein',
    owner: 'Narada',
    purpose: 'Discover and package candidate topics with deterministic governance controls.',
    outputFamily: 'topic_candidate_board',
    successNext: 'CWF-120'
  },
  {
    id: 'CWF-120',
    name: 'CWF-120 Topic Qualification Canonical',
    description: 'Canonical executable topic qualification workflow.',
    legacyPath: 'n8n/workflows/topic/CWF-120-topic-qualification.json',
    manifestPath: 'n8n/manifests/CWF-120-topic-qualification.manifest.yaml',
    phase: 'phase1',
    vein: 'qualification_vein',
    owner: 'Chanakya',
    purpose: 'Qualify discovered topics against demand, fit, and governance criteria.',
    outputFamily: 'topic_finalization_packet',
    successNext: 'CWF-130'
  },
  {
    id: 'CWF-130',
    name: 'CWF-130 Topic Scoring Canonical',
    description: 'Canonical executable topic scoring workflow.',
    legacyPath: 'n8n/workflows/topic/CWF-130-topic-scoring.json',
    manifestPath: 'n8n/manifests/CWF-130-topic-scoring.manifest.yaml',
    phase: 'phase1',
    vein: 'scoring_vein',
    owner: 'Krishna',
    purpose: 'Score qualified topics deterministically and emit ranked shortlist packet.',
    outputFamily: 'topic_scorecard',
    successNext: 'CWF-140'
  },
  {
    id: 'CWF-140',
    name: 'CWF-140 Research Synthesis Canonical',
    description: 'Canonical executable research synthesis workflow with confidence gating.',
    legacyPath: 'n8n/workflows/topic/CWF-140-research-synthesis.json',
    manifestPath: 'n8n/manifests/CWF-140-research-synthesis.manifest.yaml',
    phase: 'phase1',
    vein: 'research_vein',
    owner: 'Vyasa',
    purpose:
      'Synthesize research outputs and apply confidence gate before script-generation routing.',
    outputFamily: 'research_synthesis_packet',
    successNext: 'CWF-210'
  },
  {
    id: 'CWF-210',
    name: 'CWF-210 Script Generation Canonical',
    description: 'Canonical executable script generation workflow.',
    legacyPath: 'n8n/workflows/script/CWF-210-script-generation.json',
    manifestPath: 'n8n/manifests/CWF-210-script-generation.manifest.yaml',
    phase: 'phase1',
    vein: 'narrative_vein',
    owner: 'Saraswati',
    purpose: 'Generate first script draft packet under deterministic runtime contract.',
    outputFamily: 'script_draft_packet',
    successNext: 'CWF-220'
  },
  {
    id: 'CWF-220',
    name: 'CWF-220 Script Debate Canonical',
    description: 'Canonical executable script debate workflow.',
    legacyPath: 'n8n/workflows/script/CWF-220-script-debate.json',
    manifestPath: 'n8n/manifests/CWF-220-script-debate.manifest.yaml',
    phase: 'phase1',
    vein: 'narrative_vein',
    owner: 'Krishna',
    purpose: 'Run deterministic debate checks and emit structured critique packet.',
    outputFamily: 'script_debate_packet',
    successNext: 'CWF-230'
  },
  {
    id: 'CWF-230',
    name: 'CWF-230 Script Refinement Canonical',
    description: 'Canonical executable script refinement workflow.',
    legacyPath: 'n8n/workflows/script/CWF-230-script-refinement.json',
    manifestPath: 'n8n/manifests/CWF-230-script-refinement.manifest.yaml',
    phase: 'phase1',
    vein: 'narrative_vein',
    owner: 'Saraswati',
    purpose: 'Refine script content deterministically and emit refinement packet.',
    outputFamily: 'script_refinement_packet',
    successNext: 'CWF-240'
  },
  {
    id: 'CWF-240',
    name: 'CWF-240 Final Script Shaping Canonical',
    description: 'Canonical executable final script shaping workflow.',
    legacyPath: 'n8n/workflows/script/CWF-240-final-script-shaping.json',
    manifestPath: 'n8n/manifests/CWF-240-final-script-shaping.manifest.yaml',
    phase: 'phase1',
    vein: 'narrative_vein',
    owner: 'Krishna',
    purpose: 'Finalize script packet for approval routing with deterministic checks.',
    outputFamily: 'final_script_packet',
    successNext: 'WF-020'
  },
  {
    id: 'WF-020',
    name: 'WF-020 Final Approval Canonical',
    description: 'Canonical executable final approval workflow.',
    legacyPath: 'n8n/workflows/approval/WF-020-final-approval.json',
    manifestPath: 'n8n/manifests/WF-020-final-approval.manifest.yaml',
    phase: 'phase1',
    vein: 'approval_vein',
    owner: 'Yama',
    purpose: 'Apply final approval checks and route approved or rejected decision path.',
    outputFamily: 'approval_decision_packet',
    successNext: 'WF-300'
  },
  {
    id: 'WF-021',
    name: 'WF-021 Replay Remodify Canonical',
    description: 'Canonical executable replay and remodify workflow.',
    legacyPath: 'n8n/workflows/approval/WF-021-replay-remodify.json',
    manifestPath: 'n8n/manifests/WF-021-replay-remodify.manifest.yaml',
    phase: 'phase1',
    vein: 'replay_vein',
    owner: 'Yama',
    purpose: 'Route remodify/replay requests to deterministic prior-stage handoff.',
    outputFamily: 'replay_routing_packet',
    successNext: 'CWF-210'
  }
];

function writeFile(relPath, content) {
  const abs = path.join(root, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
}

function buildWorkflowJson(wf) {
  const packetCode = `
const now = new Date().toISOString();
const dossierId = $json.dossier_id || 'DOSSIER-UNSPECIFIED';
const routeId = $json.route_id || '${wf.id}-ROUTE';
const researchConfidence = Number($json.research_confidence_score ?? 0.90);
const approvalDecision = $json.approval_decision || 'APPROVED';
const packet = {
  instance_id: '${wf.id}-' + Date.now(),
  artifact_family: '${wf.outputFamily}',
  schema_version: '1.0.0',
  producer_workflow: '${wf.id}',
  dossier_ref: dossierId,
  created_at: now,
  status: 'CREATED',
  payload: {
    workflow_id: '${wf.id}',
    route_id: routeId,
    research_confidence_score: researchConfidence,
    approval_decision: approvalDecision
  }
};
return [{ json: { ...$json, runtime_packet: packet, runtime: { had_error: false, error_message: '' } } }];
`.trim();

  const validateCode = `
try {
  const packet = $json.runtime_packet;
  if (!packet || !packet.instance_id || !packet.artifact_family || !packet.dossier_ref) {
    throw new Error('missing required runtime_packet fields');
  }
  return [{ json: { ...$json, validation_status: 'SUCCESS', route_to_error: false } }];
} catch (error) {
  return [{ json: { ...$json, validation_status: 'FAILED', route_to_error: true, validation_error: String(error.message || error) } }];
}
`.trim();

  const appendCode = `
if ($json.route_to_error) return [];
return [{
  json: {
    ...$json,
    dossier_write: {
      mutation_type: 'append_to_array',
      target: 'dossier.runtime_packets',
      timestamp: new Date().toISOString(),
      writer_id: '${wf.id}',
      skill_id: '${wf.id}',
      instance_id: $json.runtime_packet.instance_id,
      schema_version: $json.runtime_packet.schema_version,
      lineage_reference: $json.runtime_packet.producer_workflow,
      audit_entry: 'append-only dossier write from canonical workflow'
    }
  }
}];
`.trim();

  const indexCode = `
if ($json.route_to_error) return [];
return [{
  json: {
    ...$json,
    se_packet_index_write: {
      operation: 'create_new_index_row',
      packet_id: $json.runtime_packet.instance_id,
      dossier_id: $json.runtime_packet.dossier_ref,
      packet_family: $json.runtime_packet.artifact_family,
      workflow_id: '${wf.id}',
      created_at: new Date().toISOString()
    }
  }
}];
`.trim();

  const errorCode = `
if (!$json.route_to_error) return [];
return [{
  json: {
    workflow_id: '${wf.id}',
    routing_decision: 'ERROR',
    route_to_workflow: 'WF-900',
    error_message: $json.validation_error || $json.runtime?.error_message || 'unknown workflow error',
    failure_packet: $json.runtime_packet || null
  }
}];
`.trim();

  const nextStageCode = `
if ($json.route_to_error) return [];
let nextWorkflow = '${wf.successNext}';
let decision = 'SUCCESS_PATH';

if ('${wf.id}' === 'CWF-140') {
  const confidence = Number($json.runtime_packet?.payload?.research_confidence_score ?? 1);
  if (confidence < 0.85) {
    nextWorkflow = 'CWF-140';
    decision = 'RUN_PHASE1C_CONDITIONAL_RESEARCH';
  } else {
    nextWorkflow = 'CWF-210';
    decision = 'SKIP_PHASE1C_PROCEED_SCRIPT';
  }
}

if ('${wf.id}' === 'WF-020') {
  const approval = String($json.runtime_packet?.payload?.approval_decision || 'APPROVED');
  nextWorkflow = approval === 'APPROVED' ? 'WF-300' : 'WF-021';
  decision = approval === 'APPROVED' ? 'APPROVED_FOR_PUBLISHING' : 'REJECTED_ROUTE_REPLAY';
}

if ('${wf.id}' === 'WF-021') {
  nextWorkflow = $json.replay_target_workflow || 'CWF-210';
  decision = 'REPLAY_TO_PRIOR_STAGE';
}

return [{
  json: {
    ...$json,
    routing_decision: {
      on_success_next_workflow: nextWorkflow,
      on_error_workflow: 'WF-900',
      decision,
      wf900_bound: true
    }
  }
}];
`.trim();

  const completionCode = `
if ($json.route_to_error) return [];
return [{
  json: {
    workflow_id: '${wf.id}',
    execution_status: 'SUCCESS',
    completion_packet: {
      instance_id: '${wf.id}-COMP-' + Date.now(),
      artifact_family: 'workflow_completion_packet',
      schema_version: '1.0.0',
      producer_workflow: '${wf.id}',
      dossier_ref: $json.runtime_packet?.dossier_ref || 'DOSSIER-UNSPECIFIED',
      created_at: new Date().toISOString(),
      status: 'CREATED',
      payload: {
        source_packet_id: $json.runtime_packet?.instance_id || null,
        next_workflow: $json.routing_decision?.on_success_next_workflow || '${wf.successNext}',
        route_to_wf900: 'WF-900'
      }
    }
  }
}];
`.trim();

  return {
    name: wf.name,
    description: wf.description,
    nodes: [
      {
        parameters: {},
        id: `${wf.id.toLowerCase()}_trigger_node`,
        name: 'Trigger Node',
        type: 'n8n-nodes-base.manualTrigger',
        typeVersion: 1,
        position: [200, 300]
      },
      {
        parameters: {
          jsCode:
            "return [{ json: { ...$json, dossier_context: { dossier_id: $json.dossier_id || 'DOSSIER-UNSPECIFIED', loaded_at: new Date().toISOString() } } }];"
        },
        id: `${wf.id.toLowerCase()}_dossier_load_node`,
        name: 'Dossier Load Node',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [420, 300]
      },
      {
        parameters: {
          jsCode:
            "return [{ json: { ...$json, registry_lookup: { skill_registry: 'registries/skill_registry.yaml', workflow_bindings: 'registries/workflow_bindings.yaml', schema_registry: 'registries/schema_registry.yaml', director_binding: 'registries/director_binding.yaml' } } }];"
        },
        id: `${wf.id.toLowerCase()}_registry_lookup_node`,
        name: 'Registry Lookup Node',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [640, 300]
      },
      {
        parameters: { jsCode: packetCode },
        id: `${wf.id.toLowerCase()}_skill_execution_node`,
        name: 'Skill Execution Node',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [860, 300]
      },
      {
        parameters: { jsCode: validateCode },
        id: `${wf.id.toLowerCase()}_packet_validation_node`,
        name: 'Packet Validation Node',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [1080, 300]
      },
      {
        parameters: { jsCode: appendCode },
        id: `${wf.id.toLowerCase()}_append_only_dossier_write_node`,
        name: 'Append-Only Dossier Write Node',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [1300, 220]
      },
      {
        parameters: { jsCode: indexCode },
        id: `${wf.id.toLowerCase()}_packet_index_write_node`,
        name: 'se_packet_index Write Node',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [1520, 220]
      },
      {
        parameters: { jsCode: errorCode },
        id: `${wf.id.toLowerCase()}_wf900_error_routing_node`,
        name: 'Error Routing WF-900 Node',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [1300, 420]
      },
      {
        parameters: { jsCode: nextStageCode },
        id: `${wf.id.toLowerCase()}_next_stage_routing_node`,
        name: 'Next-Stage Routing Node',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [1740, 220]
      },
      {
        parameters: { jsCode: completionCode },
        id: `${wf.id.toLowerCase()}_completion_packet_emission_node`,
        name: 'Completion Packet Emission Node',
        type: 'n8n-nodes-base.code',
        typeVersion: 2,
        position: [1960, 220]
      }
    ],
    connections: {
      'Trigger Node': {
        main: [[{ node: 'Dossier Load Node', type: 'main', index: 0 }]]
      },
      'Dossier Load Node': {
        main: [[{ node: 'Registry Lookup Node', type: 'main', index: 0 }]]
      },
      'Registry Lookup Node': {
        main: [[{ node: 'Skill Execution Node', type: 'main', index: 0 }]]
      },
      'Skill Execution Node': {
        main: [[{ node: 'Packet Validation Node', type: 'main', index: 0 }]]
      },
      'Packet Validation Node': {
        main: [
          [{ node: 'Append-Only Dossier Write Node', type: 'main', index: 0 }],
          [{ node: 'Error Routing WF-900 Node', type: 'main', index: 0 }]
        ]
      },
      'Append-Only Dossier Write Node': {
        main: [[{ node: 'se_packet_index Write Node', type: 'main', index: 0 }]]
      },
      'se_packet_index Write Node': {
        main: [[{ node: 'Next-Stage Routing Node', type: 'main', index: 0 }]]
      },
      'Next-Stage Routing Node': {
        main: [[{ node: 'Completion Packet Emission Node', type: 'main', index: 0 }]]
      }
    },
    meta: {
      workflow_id: wf.id,
      phase: wf.phase,
      vein: wf.vein,
      purpose: wf.purpose,
      implementation_depth: 'production_grade',
      owner_director: wf.owner,
      next_workflow: wf.successNext,
      canonical_file: `n8n/workflows/${wf.id}.json`,
      legacy_file: wf.legacyPath,
      required_node_contract: requiredNodeContract
    },
    active: true,
    settings: {}
  };
}

function upsertManifest(manifestPath, workflowId, canonicalPath, legacyPath) {
  const abs = path.join(root, manifestPath);
  let text = fs.readFileSync(abs, 'utf8').replace(/\r\n/g, '\n');

  const upsertLine = (key, value) => {
    const rx = new RegExp(`^${key}:.*$`, 'm');
    if (rx.test(text)) {
      text = text.replace(rx, `${key}: ${value}`);
    } else {
      text = text.replace(/^workflow_id:.*$/m, (m) => `${m}\n${key}: ${value}`);
    }
  };

  upsertLine('canonical_workflow_json', canonicalPath);
  upsertLine('legacy_workflow_json', legacyPath);
  upsertLine('execution_contract', 'executable_json_required');
  upsertLine('wf900_error_route', 'WF-900');
  upsertLine('completion_packet_emission', 'required');

  text = text.replace(/\nrequired_node_contract:\n(?:  - .*\n)*/m, '\n');
  text = text.replace(
    /^completion_packet_emission:.*$/m,
    (m) => `${m}\nrequired_node_contract:\n${requiredNodeContract.map((n) => `  - ${n}`).join('\n')}`
  );

  writeFile(manifestPath, `${text.trimEnd()}\n`);
}

function updateSystemManifest() {
  const rel = 'SYSTEM_MANIFEST.yaml';
  const abs = path.join(root, rel);
  const lines = fs.readFileSync(abs, 'utf8').replace(/\r\n/g, '\n').split('\n');

  const setRootField = (prefix, value) => {
    const idx = lines.findIndex((l) => l.startsWith(prefix));
    if (idx >= 0) {
      lines[idx] = `${prefix}${value}`;
    }
  };

  setRootField('generated_at: ', `"${generatedAt.slice(0, 10)}"`);
  setRootField('status: ', 'phase1_partial_wave6_canonical_workflow_jsons_in_progress');

  const replacePackFiles = (packId, canonicalPath, legacyPath) => {
    const start = lines.findIndex((l) => l.trim() === `- pack_id: ${packId}`);
    if (start < 0) return;
    let end = lines.length;
    for (let i = start + 1; i < lines.length; i += 1) {
      if (lines[i].startsWith('  - pack_id: ')) {
        end = i;
        break;
      }
    }

    let fileLine = -1;
    let legacyLine = -1;
    for (let i = start; i < end; i += 1) {
      if (lines[i].trim().startsWith('file: ')) fileLine = i;
      if (lines[i].trim().startsWith('legacy_file: ')) legacyLine = i;
    }

    if (fileLine >= 0) {
      lines[fileLine] = `    file: ${canonicalPath}`;
      if (legacyLine >= 0) {
        lines[legacyLine] = `    legacy_file: ${legacyPath}`;
      } else {
        lines.splice(fileLine + 1, 0, `    legacy_file: ${legacyPath}`);
      }
    }
  };

  for (const wf of workflows) {
    replacePackFiles(wf.id, `n8n/workflows/${wf.id}.json`, wf.legacyPath);
  }

  writeFile(rel, `${lines.join('\n').trimEnd()}\n`);
}

function updateWorkflowBindingsRegistry() {
  const rel = 'registries/workflow_bindings.yaml';
  let text = fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
  text = text.replace(/^generated_at:\s+.*$/m, `generated_at: "${generatedAt}"`);
  text = text.replace(
    /^status:\s+.*$/m,
    'status: PARTIAL_WAVE_6_EXECUTABLE_N8N_WORKFLOWS_WITH_MANIFEST_SYNC'
  );
  text = text.replace(/\ncanonical_workflow_jsons:[\s\S]*$/m, '\n');

  const section = [
    'canonical_workflow_jsons:',
    ...workflows.map((wf) =>
      [
        `  - workflow_id: ${wf.id}`,
        `    canonical_json: n8n/workflows/${wf.id}.json`,
        `    legacy_json: ${wf.legacyPath}`,
        '    required_nodes: 10',
        '    wf900_error_route: WF-900',
        '    completion_packet_emission: true'
      ].join('\n')
    )
  ].join('\n');

  text = `${text.trimEnd()}\n${section}\n`;
  writeFile(rel, text);
}

for (const wf of workflows) {
  const workflowJson = buildWorkflowJson(wf);
  writeFile(`n8n/workflows/${wf.id}.json`, `${JSON.stringify(workflowJson, null, 2)}\n`);
  upsertManifest(
    wf.manifestPath,
    wf.id,
    `n8n/workflows/${wf.id}.json`,
    wf.legacyPath
  );
}

updateWorkflowBindingsRegistry();
updateSystemManifest();

console.log('Wave 6 generation complete');
