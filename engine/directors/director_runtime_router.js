const fs = require('fs');
const path = require('path');

const SkillLoader = require('../skill_loader/skill_loader');
const DossierWriter = require('../dossier/dossier_writer');
const PacketValidator = require('../packets/packet_validator');
const PacketIndexWriter = require('../packets/packet_index_writer');
const PacketRouter = require('../packets/packet_router');
const ApprovalWriter = require('../approval/approval_writer');
const ApprovalRouter = require('../approval/approval_router');

class DirectorRuntimeRouter {
  constructor(config = {}) {
    this.config = {
      bindings_root: config.bindings_root || './bindings',
      registries_root: config.registries_root || './registries',
      dossier_base_path: config.dossier_base_path || './dossiers',
      packet_index_path: config.packet_index_path || './data/se_packet_index.json',
      approval_queue_path: config.approval_queue_path || './data/se_approval_queue.json'
    };

    this.ensureRuntimeDirectories();

    this.dossierWriter = new DossierWriter({ dossier_base_path: this.config.dossier_base_path });
    this.packetValidator = new PacketValidator();
    this.packetIndexWriter = new PacketIndexWriter({ index_path: this.config.packet_index_path });
    this.packetRouter = new PacketRouter();
    this.approvalWriter = new ApprovalWriter({ queue_path: this.config.approval_queue_path });
    this.approvalRouter = new ApprovalRouter({ queue_path: this.config.approval_queue_path });

    this.childWorkflowContracts = {
      'CWF-110-topic-discovery': { artifact_family: 'topic_candidate_board', namespace: 'discovery', owner_director: 'Narada' },
      'CWF-120-topic-qualification': { artifact_family: 'topic_finalization_packet', namespace: 'qualification', owner_director: 'Chanakya' },
      'CWF-130-topic-scoring': { artifact_family: 'topic_scorecard', namespace: 'scoring', owner_director: 'Krishna' },
      'CWF-140-research-synthesis': { artifact_family: 'research_synthesis_packet', namespace: 'research', owner_director: 'Vyasa' },
      'CWF-210-script-generation': { artifact_family: 'script_draft_packet', namespace: 'script', owner_director: 'Saraswati' },
      'CWF-220-script-debate': { artifact_family: 'script_debate_packet', namespace: 'script', owner_director: 'Krishna' },
      'CWF-230-script-refinement': { artifact_family: 'script_refinement_packet', namespace: 'script', owner_director: 'Saraswati' },
      'CWF-240-final-script-shaping': { artifact_family: 'final_script_packet', namespace: 'script', owner_director: 'Krishna' },
      'CWF-310-execution-context-builder': { artifact_family: 'execution_context_packet', namespace: 'context', owner_director: 'Krishna' },
      'CWF-320-platform-packager': { artifact_family: 'platform_package_packet', namespace: 'context', owner_director: 'Krishna' },
      'CWF-330-asset-brief-generator': { artifact_family: 'asset_brief_packet', namespace: 'context', owner_director: 'Krishna' },
      'CWF-340-lineage-validator': { artifact_family: 'context_engineering_packet', namespace: 'context', owner_director: 'Krishna' }
    };
  }

  ensureRuntimeDirectories() {
    const directories = [
      this.config.dossier_base_path,
      path.dirname(this.config.packet_index_path),
      path.dirname(this.config.approval_queue_path)
    ];

    for (const dir of directories) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  async executeChildWorkflow(params) {
    const startedAt = Date.now();
    const startedAtIso = new Date().toISOString();
    const {
      workflow_pack,
      child_workflow_id,
      dossier_id,
      context_packet = {},
      dossier_state = {},
      run_id = `RUN-CHILD-${Date.now()}`
    } = params;

    if (!workflow_pack || !child_workflow_id || !dossier_id) {
      throw new Error('workflow_pack, child_workflow_id, and dossier_id are required');
    }

    const bindingPath = this.resolveBindingPath(workflow_pack);
    const binding = this.parseWorkflowBinding(bindingPath);
    const childSkills = binding[child_workflow_id];
    if (!childSkills || childSkills.length === 0) {
      throw new Error(`No skills bound for ${child_workflow_id} in ${bindingPath}`);
    }

    const registryPath = this.resolveRegistryPath(workflow_pack);
    const skillLoader = new SkillLoader({
      skill_registry_path: registryPath
    });
    await skillLoader.initialize();

    const chainResult = await skillLoader.executeSkillChain(
      childSkills,
      {
        dossier_id,
        ...context_packet
      },
      dossier_state
    );

    const packet = this.buildPacket(child_workflow_id, dossier_id, context_packet, chainResult);
    const validation = this.packetValidator.validatePacket(packet);
    if (!validation.valid) {
      return {
        status: 'FAILED',
        stage: 'packet_validation',
        failure_reason_code: 'ROUTER_PACKET_VALIDATION_FAILED',
        errors: validation.errors,
        warnings: validation.warnings,
        packet,
        observability: this.buildObservability(run_id, startedAt, startedAtIso, 'ROUTER_PACKET_VALIDATION_FAILED')
      };
    }

    const dossierMutation = await this.writeWorkflowOutputToDossier(child_workflow_id, dossier_id, chainResult, packet);
    const indexWrite = await this.packetIndexWriter.writeIndex(packet, dossier_id);
    const routing = this.packetRouter.route(packet);

    let approval = null;
    if (packet.artifact_family === 'final_script_packet') {
      approval = await this.approvalWriter.writeApprovalRequest(dossier_id, {
        packet_id: packet.instance_id,
        artifact_family: packet.artifact_family,
        owner_director: this.childWorkflowContracts[child_workflow_id].owner_director
      });
    }

    return {
      status: 'SUCCESS',
      workflow_pack,
      child_workflow_id,
      dossier_id,
      skills_executed: childSkills,
      chain_result: chainResult,
      packet,
      packet_index: indexWrite,
      dossier_mutation: dossierMutation,
      routing,
      approval,
      observability: this.buildObservability(run_id, startedAt, startedAtIso, null)
    };
  }

  async executeWorkflowPack(params) {
    const startedAt = Date.now();
    const startedAtIso = new Date().toISOString();
    const { workflow_pack, dossier_id, context_packet = {}, dossier_state = {}, run_id = `RUN-PACK-${Date.now()}` } = params;
    const bindingPath = this.resolveBindingPath(workflow_pack);
    const binding = this.parseWorkflowBinding(bindingPath);
    const childWorkflowIds = Object.keys(binding);
    const results = [];

    let rollingContext = { ...context_packet };
    for (const childWorkflowId of childWorkflowIds) {
      const childStarted = Date.now();
      const result = await this.executeChildWorkflow({
        workflow_pack,
        child_workflow_id: childWorkflowId,
        dossier_id,
        context_packet: rollingContext,
        dossier_state,
        run_id
      });
      results.push(result);
      if (result.status !== 'SUCCESS') {
        break;
      }
      rollingContext = {
        ...rollingContext,
        [`${childWorkflowId}_packet`]: result.packet
      };
      rollingContext.__timings_ms = {
        ...(rollingContext.__timings_ms || {}),
        [childWorkflowId]: Date.now() - childStarted
      };
    }

    const success = results.every((r) => r.status === 'SUCCESS');
    return {
      status: success ? 'SUCCESS' : 'FAILED',
      failure_reason_code: success ? null : (results.find((r) => r.status !== 'SUCCESS')?.failure_reason_code || 'ROUTER_WORKFLOW_PACK_FAILED'),
      workflow_pack,
      dossier_id,
      child_workflows_executed: results.length,
      results,
      observability: this.buildObservability(run_id, startedAt, startedAtIso, success ? null : 'ROUTER_WORKFLOW_PACK_FAILED', {
        ...(rollingContext.__timings_ms || {})
      })
    };
  }

  async executeTopicToScriptChain(params) {
    const startedAt = Date.now();
    const startedAtIso = new Date().toISOString();
    const {
      run_id = `RUN-CHAIN-${Date.now()}`,
      dossier_id,
      wf100_context_packet = {},
      wf200_context_overrides = {},
      dossier_state = {}
    } = params;

    if (!dossier_id) {
      throw new Error('dossier_id is required');
    }

    const wf100 = await this.executeWorkflowPack({
      workflow_pack: 'wf100',
      dossier_id,
      context_packet: wf100_context_packet,
      dossier_state,
      run_id
    });

    if (wf100.status !== 'SUCCESS') {
      return {
        status: 'FAILED',
        stage: 'WF-100',
        failure_reason_code: wf100.failure_reason_code || 'ROUTER_WF100_FAILED',
        wf100,
        wf200: null,
        observability: this.buildObservability(run_id, startedAt, startedAtIso, wf100.failure_reason_code || 'ROUTER_WF100_FAILED', {
          wf100_ms: wf100.observability?.duration_ms || 0
        })
      };
    }

    const topicFinalizationPacket = this.findPacketByArtifactFamily(wf100.results, 'topic_finalization_packet');
    const researchSynthesisPacket = this.findPacketByArtifactFamily(wf100.results, 'research_synthesis_packet');

    const wf200Context = {
      topic_finalization_packet: topicFinalizationPacket,
      research_synthesis_packet: researchSynthesisPacket,
      audience_profile: 'general',
      target_duration_seconds: 60,
      style_constraints: [],
      ...wf200_context_overrides
    };

    const wf200 = await this.executeWorkflowPack({
      workflow_pack: 'wf200',
      dossier_id,
      context_packet: wf200Context,
      dossier_state,
      run_id
    });

    const success = wf200.status === 'SUCCESS';
    const failureCode = success ? null : (wf200.failure_reason_code || 'ROUTER_WF200_FAILED');
    return {
      status: success ? 'SUCCESS' : 'FAILED',
      failure_reason_code: failureCode,
      dossier_id,
      wf100,
      wf200,
      observability: this.buildObservability(run_id, startedAt, startedAtIso, failureCode, {
        wf100_ms: wf100.observability?.duration_ms || 0,
        wf200_ms: wf200.observability?.duration_ms || 0
      })
    };
  }

  async resolveFinalApprovalAndContinue(params) {
    const startedAt = Date.now();
    const startedAtIso = new Date().toISOString();
    const {
      queue_entry_id,
      decision,
      resolved_by,
      context = {},
      auto_continue = true,
      run_id = `RUN-APPROVAL-${Date.now()}`
    } = params;

    if (!queue_entry_id || !decision || !resolved_by) {
      throw new Error('queue_entry_id, decision, and resolved_by are required');
    }

    const approvalRouting = await this.approvalRouter.routeApprovalDecision(
      queue_entry_id,
      decision,
      resolved_by,
      context
    );

    if (approvalRouting.status !== 'SUCCESS') {
      return {
        status: 'FAILED',
        stage: 'approval_resolution',
        failure_reason_code: approvalRouting.error ? 'APPROVAL_ROUTING_FAILED' : 'APPROVAL_RESOLUTION_FAILED',
        approval: approvalRouting,
        observability: this.buildObservability(run_id, startedAt, startedAtIso, approvalRouting.error ? 'APPROVAL_ROUTING_FAILED' : 'APPROVAL_RESOLUTION_FAILED')
      };
    }

    if (!auto_continue) {
      return {
        status: 'SUCCESS',
        stage: 'approval_resolved_only',
        approval: approvalRouting,
        continuation: null,
        observability: this.buildObservability(run_id, startedAt, startedAtIso, null)
      };
    }

    const queue = await this.approvalRouter.resolver.loadQueue();
    const resolvedEntry = queue.entries.find((entry) => entry.queue_entry_id === queue_entry_id);
    const dossierId = resolvedEntry ? resolvedEntry.dossier_ref : null;

    if (!dossierId) {
      return {
        status: 'FAILED',
        stage: 'approval_resolution',
        failure_reason_code: 'APPROVAL_DOSSIER_NOT_FOUND',
        error: `Unable to resolve dossier_ref for queue entry ${queue_entry_id}`,
        approval: approvalRouting,
        observability: this.buildObservability(run_id, startedAt, startedAtIso, 'APPROVAL_DOSSIER_NOT_FOUND')
      };
    }

    const nextWorkflow = approvalRouting.next_workflow;
    if (nextWorkflow === 'WF-300') {
      const wf300 = await this.executeWorkflowPack({
        workflow_pack: 'wf300',
        dossier_id: dossierId,
        context_packet: {
          final_script_packet: { instance_id: resolvedEntry.packet_id },
          approval_resolution: approvalRouting.payload
        },
        dossier_state: {}
      });
      return {
        status: wf300.status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
        stage: 'wf300_continuation',
        failure_reason_code: wf300.status === 'SUCCESS' ? null : (wf300.failure_reason_code || 'WF300_CONTINUATION_FAILED'),
        approval: approvalRouting,
        continuation: wf300,
        observability: this.buildObservability(run_id, startedAt, startedAtIso, wf300.status === 'SUCCESS' ? null : (wf300.failure_reason_code || 'WF300_CONTINUATION_FAILED'))
      };
    }

    if (nextWorkflow === 'WF-021') {
      const replayPlan = this.buildReplayPlanFromContext(context);
      let replayExecution = null;
      if (replayPlan.target_workflow) {
        replayExecution = await this.executeChildWorkflow({
          workflow_pack: replayPlan.target_pack,
          child_workflow_id: replayPlan.target_workflow,
          dossier_id: dossierId,
          context_packet: {
            replay_reason: replayPlan.rejection_reason,
            replay_guidance: replayPlan.guidance
          },
          dossier_state: {}
        });
      }

      return {
        status: replayExecution && replayExecution.status !== 'SUCCESS' ? 'FAILED' : 'SUCCESS',
        stage: 'wf021_replay_continuation',
        failure_reason_code: replayExecution && replayExecution.status !== 'SUCCESS' ? (replayExecution.failure_reason_code || 'WF021_REPLAY_EXECUTION_FAILED') : null,
        approval: approvalRouting,
        continuation: {
          replay_plan: replayPlan,
          replay_execution: replayExecution
        },
        observability: this.buildObservability(
          run_id,
          startedAt,
          startedAtIso,
          replayExecution && replayExecution.status !== 'SUCCESS' ? (replayExecution.failure_reason_code || 'WF021_REPLAY_EXECUTION_FAILED') : null
        )
      };
    }

    return {
      status: 'SUCCESS',
      stage: 'approval_routed_no_runtime_handler',
      approval: approvalRouting,
      continuation: {
        next_workflow: nextWorkflow
      },
      observability: this.buildObservability(run_id, startedAt, startedAtIso, null)
    };
  }

  resolveBindingPath(workflowPack) {
    const suffix = workflowPack.toLowerCase();
    const file = `workflow_skill_binding_${suffix}.yaml`;
    const fullPath = path.join(this.config.bindings_root, file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Workflow binding not found for ${workflowPack}: ${fullPath}`);
    }
    return fullPath;
  }

  resolveRegistryPath(workflowPack) {
    const suffix = workflowPack.toLowerCase();
    const file = `skill_registry_${suffix}.yaml`;
    const fullPath = path.join(this.config.registries_root, file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Skill registry not found for ${workflowPack}: ${fullPath}`);
    }
    return fullPath;
  }

  parseWorkflowBinding(bindingPath) {
    const content = fs.readFileSync(bindingPath, 'utf8');

    if (/^\s*bindings:\s*$/m.test(content)) {
      return this.parsePrimarySkillBinding(content);
    }

    const lines = content.replace(/\r/g, '').split('\n');
    const binding = {};
    let currentChild = null;
    let inSkills = false;

    for (const line of lines) {
      const childMatch = line.match(/^  ([A-Za-z0-9-]+):\s*$/);
      if (childMatch) {
        currentChild = childMatch[1];
        if (!binding[currentChild]) {
          binding[currentChild] = [];
        }
        inSkills = false;
        continue;
      }

      if (/^\s{4}skills:\s*$/.test(line)) {
        inSkills = true;
        continue;
      }

      if (inSkills && currentChild) {
        const skillMatch = line.match(/^\s{6}-\s+([A-Z]-\d{3})\b/);
        if (skillMatch) {
          binding[currentChild].push(skillMatch[1]);
        }
      }
    }

    return binding;
  }

  parsePrimarySkillBinding(content) {
    const lines = content.replace(/\r/g, '').split('\n');
    const binding = {};
    let currentChild = null;

    for (const line of lines) {
      const childMatch = line.match(/^  ([A-Za-z0-9-]+):\s*$/);
      if (childMatch) {
        currentChild = childMatch[1];
        if (!binding[currentChild]) {
          binding[currentChild] = [];
        }
        continue;
      }

      if (!currentChild) {
        continue;
      }

      const primaryMatch = line.match(/^\s{4}primary_skill:\s*([A-Z]-\d{3})\s*$/);
      if (primaryMatch) {
        binding[currentChild].push(primaryMatch[1]);
      }

      const listSkillMatch = line.match(/^\s{6}-\s*([A-Z]-\d{3})\s*$/);
      if (listSkillMatch) {
        binding[currentChild].push(listSkillMatch[1]);
      }
    }

    return binding;
  }

  buildPacket(childWorkflowId, dossierId, contextPacket, chainResult) {
    const contract = this.childWorkflowContracts[childWorkflowId] || {
      artifact_family: 'runtime_packet',
      owner_director: 'Unknown'
    };
    const packetId = `PKT-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const packet = {
      instance_id: packetId,
      artifact_family: contract.artifact_family,
      schema_version: '1.0.0',
      producer_workflow: childWorkflowId.split('-').slice(0, 2).join('-'),
      dossier_ref: dossierId,
      status: 'CREATED',
      created_at: new Date().toISOString(),
      payload: {
        narrative: {
          skill_outputs: chainResult.results.map((r) => ({
            skill_id: r.skill_id,
            status: r.status
          })),
          packet_summary: `${childWorkflowId} executed`
        },
        context: {
          sourced_from_packet_id: this.findPriorPacketId(contextPacket),
          input_context_keys: Object.keys(contextPacket)
        },
        evidence: {
          completed_skills: chainResult.completed_skills,
          failed_skills: chainResult.failed_skills,
          chain_id: chainResult.chain_id
        },
        quality: {
          chain_status: chainResult.failed_skills > 0 ? 'PARTIAL' : 'PASS',
          owner_director: contract.owner_director
        },
        status: {
          next_workflow: null,
          escalation_needed: chainResult.failed_skills > 0,
          generation_phase: chainResult.failed_skills > 0 ? 'FAILED' : 'COMPLETE'
        }
      }
    };

    packet.payload = this.enrichPayloadForArtifactFamily(packet.artifact_family, packet.payload);
    return packet;
  }

  findPriorPacketId(contextPacket) {
    const packetValues = Object.values(contextPacket || {});
    const packet = packetValues.find(
      (value) => value && typeof value === 'object' && value.instance_id
    );
    return packet ? packet.instance_id : null;
  }

  findPacketByArtifactFamily(results, artifactFamily) {
    const found = (results || []).find(
      (entry) => entry && entry.packet && entry.packet.artifact_family === artifactFamily
    );
    return found ? found.packet : null;
  }

  async writeWorkflowOutputToDossier(childWorkflowId, dossierId, chainResult, packet) {
    const contract = this.childWorkflowContracts[childWorkflowId] || { namespace: 'runtime' };
    const target = `namespaces.${contract.namespace}.${childWorkflowId}.packets`;

    return this.dossierWriter.writeDelta(dossierId, {
      namespace: contract.namespace,
      mutation_type: 'append_to_array',
      target,
      value: {
        packet_id: packet.instance_id,
        artifact_family: packet.artifact_family,
        chain_id: chainResult.chain_id,
        completed_skills: chainResult.completed_skills,
        created_at: packet.created_at
      },
      audit_entry: {
        workflow_id: childWorkflowId,
        operation: 'DIRECTOR_RUNTIME_EXECUTION',
        lineage_intact: true
      }
    });
  }

  enrichPayloadForArtifactFamily(artifactFamily, payload) {
    const enriched = JSON.parse(JSON.stringify(payload));
    const now = new Date().toISOString();

    if (artifactFamily === 'topic_candidate_board') {
      enriched.narrative.topic_candidates = enriched.narrative.topic_candidates || [];
      enriched.narrative.signals = enriched.narrative.signals || [];
      enriched.context.discovered_from = enriched.context.discovered_from || 'skill_chain_runtime';
      enriched.context.discovery_timestamp = enriched.context.discovery_timestamp || now;
      enriched.evidence.candidate_count = enriched.evidence.candidate_count || enriched.narrative.topic_candidates.length;
      enriched.quality.discovery_confidence = enriched.quality.discovery_confidence || 0.75;
      enriched.status.next_workflow = 'CWF-120';
      return enriched;
    }

    if (artifactFamily === 'topic_finalization_packet') {
      enriched.narrative.qualified_candidates = enriched.narrative.qualified_candidates || [];
      enriched.narrative.rejected_candidates = enriched.narrative.rejected_candidates || [];
      enriched.context.sourced_from_packet_id = enriched.context.sourced_from_packet_id || null;
      enriched.evidence.qualification_checks = enriched.evidence.qualification_checks || [];
      enriched.quality.decision_summary = enriched.quality.decision_summary || 'qualification_completed';
      enriched.status.next_workflow = 'CWF-130';
      return enriched;
    }

    if (artifactFamily === 'topic_scorecard') {
      enriched.narrative.evaluated_candidates = enriched.narrative.evaluated_candidates || [];
      enriched.context.sourced_from_packet_id = enriched.context.sourced_from_packet_id || null;
      enriched.evidence.scorecard = enriched.evidence.scorecard || { top_candidate_for_research: null };
      enriched.quality.top_candidate_assessment = enriched.quality.top_candidate_assessment || 'pending';
      enriched.status.promotion_decision = enriched.status.promotion_decision || 'REVIEW_REQUIRED';
      return enriched;
    }

    if (artifactFamily === 'research_synthesis_packet') {
      enriched.narrative.main_claim = enriched.narrative.main_claim || '';
      enriched.context.sourced_from_packet_id = enriched.context.sourced_from_packet_id || null;
      enriched.evidence.supporting_claims = enriched.evidence.supporting_claims || [];
      enriched.quality.overall_confidence = enriched.quality.overall_confidence || 0.7;
      enriched.status.ready_for_script_generation = enriched.status.ready_for_script_generation || true;
      return enriched;
    }

    if (artifactFamily === 'script_draft_packet') {
      enriched.narrative.title = enriched.narrative.title || '';
      enriched.narrative.hook = enriched.narrative.hook || '';
      enriched.narrative.body = enriched.narrative.body || [];
      enriched.narrative.closing = enriched.narrative.closing || '';
      enriched.context.topic_statement = enriched.context.topic_statement || '';
      enriched.context.research_confidence = enriched.context.research_confidence || 0.7;
      enriched.evidence.main_claim = enriched.evidence.main_claim || '';
      enriched.evidence.supporting_claims = enriched.evidence.supporting_claims || [];
      enriched.quality.draft_confidence = enriched.quality.draft_confidence || 0.7;
      enriched.status.generation_phase = enriched.status.generation_phase || 'COMPLETE';
      return enriched;
    }

    if (artifactFamily === 'script_debate_packet') {
      enriched.narrative.original_draft = enriched.narrative.original_draft || {};
      enriched.context.sourced_from_packet_id = enriched.context.sourced_from_packet_id || null;
      enriched.evidence.critique_points = enriched.evidence.critique_points || [];
      enriched.quality.overall_debate_decision = enriched.quality.overall_debate_decision || 'PASS';
      enriched.status.debate_result = enriched.status.debate_result || 'PASS';
      return enriched;
    }

    if (artifactFamily === 'script_refinement_packet') {
      enriched.narrative.refined_title = enriched.narrative.refined_title || '';
      enriched.narrative.refined_hook = enriched.narrative.refined_hook || '';
      enriched.context.sourced_from_debate_packet_id = enriched.context.sourced_from_debate_packet_id || null;
      enriched.evidence.new_supporting_evidence = enriched.evidence.new_supporting_evidence || [];
      enriched.quality.overall_quality_improvement = enriched.quality.overall_quality_improvement || 0;
      enriched.status.refinement_complete = enriched.status.refinement_complete || true;
      return enriched;
    }

    if (artifactFamily === 'final_script_packet') {
      enriched.narrative.production_ready_title = enriched.narrative.production_ready_title || '';
      enriched.context.target_platform = enriched.context.target_platform || 'generic';
      enriched.evidence.sources_cited = enriched.evidence.sources_cited || [];
      enriched.quality.seo_readiness = enriched.quality.seo_readiness || 0.7;
      enriched.quality.governance_compliance = enriched.quality.governance_compliance || true;
      enriched.status.ready_for_approval = enriched.status.ready_for_approval || true;
      return enriched;
    }

    if (artifactFamily === 'execution_context_packet') {
      enriched.narrative.execution_strategy = enriched.narrative.execution_strategy || '';
      enriched.context.sourced_from_packet_id = enriched.context.sourced_from_packet_id || null;
      enriched.evidence.constraint_set = enriched.evidence.constraint_set || [];
      enriched.quality.context_integrity = enriched.quality.context_integrity || 0.8;
      enriched.status.context_ready = enriched.status.context_ready || true;
      return enriched;
    }

    if (artifactFamily === 'platform_package_packet') {
      enriched.narrative.platform_targets = enriched.narrative.platform_targets || [];
      enriched.context.sourced_from_packet_id = enriched.context.sourced_from_packet_id || null;
      enriched.evidence.package_elements = enriched.evidence.package_elements || [];
      enriched.quality.platform_fit = enriched.quality.platform_fit || 0.8;
      enriched.status.package_ready = enriched.status.package_ready || true;
      return enriched;
    }

    if (artifactFamily === 'asset_brief_packet') {
      enriched.narrative.asset_plan = enriched.narrative.asset_plan || [];
      enriched.context.sourced_from_packet_id = enriched.context.sourced_from_packet_id || null;
      enriched.evidence.brief_components = enriched.evidence.brief_components || [];
      enriched.quality.brief_quality = enriched.quality.brief_quality || 0.8;
      enriched.status.asset_brief_ready = enriched.status.asset_brief_ready || true;
      return enriched;
    }

    if (artifactFamily === 'context_engineering_packet') {
      enriched.narrative.context_summary = enriched.narrative.context_summary || '';
      enriched.context.sourced_from_packet_id = enriched.context.sourced_from_packet_id || null;
      enriched.evidence.lineage_checks = enriched.evidence.lineage_checks || [];
      enriched.quality.final_context_confidence = enriched.quality.final_context_confidence || 0.8;
      enriched.status.context_engineering_complete = enriched.status.context_engineering_complete || true;
      return enriched;
    }

    return enriched;
  }

  buildReplayPlanFromContext(context = {}) {
    const reason = context.rejection_reason || 'GENERIC_REJECTION';
    const map = {
      WEAK_TOPIC_FOUNDATION: { target_workflow: 'CWF-110-topic-discovery', target_pack: 'wf100', guidance: 'Rework discovery signals.' },
      POOR_TOPIC_FIT: { target_workflow: 'CWF-120-topic-qualification', target_pack: 'wf100', guidance: 'Re-run topic qualification.' },
      TOPIC_SCORE_INSUFFICIENT: { target_workflow: 'CWF-130-topic-scoring', target_pack: 'wf100', guidance: 'Re-score candidates.' },
      WEAK_RESEARCH: { target_workflow: 'CWF-140-research-synthesis', target_pack: 'wf100', guidance: 'Improve research evidence.' },
      WEAK_HOOK: { target_workflow: 'CWF-210-script-generation', target_pack: 'wf200', guidance: 'Regenerate script hooks.' },
      WEAK_STRUCTURE: { target_workflow: 'CWF-210-script-generation', target_pack: 'wf200', guidance: 'Regenerate structure.' },
      TONE_MISMATCH: { target_workflow: 'CWF-230-script-refinement', target_pack: 'wf200', guidance: 'Adjust tone and flow.' },
      GOVERNANCE_VIOLATION: { target_workflow: 'CWF-210-script-generation', target_pack: 'wf200', guidance: 'Remove policy risks.' },
      GENERIC_REJECTION: { target_workflow: 'CWF-120-topic-qualification', target_pack: 'wf100', guidance: 'Re-enter qualification.' }
    };

    const selected = map[reason] || map.GENERIC_REJECTION;
    return {
      rejection_reason: reason,
      ...selected
    };
  }

  buildObservability(runId, startedAt, startedAtIso, failureReasonCode = null, timings = {}) {
    return {
      run_id: runId,
      started_at: startedAtIso,
      finished_at: new Date().toISOString(),
      duration_ms: Date.now() - startedAt,
      timings_ms: timings,
      failure_reason_code: failureReasonCode
    };
  }
}

module.exports = DirectorRuntimeRouter;

if (require.main === module) {
  (async () => {
    const router = new DirectorRuntimeRouter();
    const result = await router.executeChildWorkflow({
      workflow_pack: 'wf100',
      child_workflow_id: 'CWF-110-topic-discovery',
      dossier_id: 'DOSSIER-LOCAL-SMOKE-001',
      context_packet: {
        discovery_brief: {},
        source_refs: [],
        topic_seed: 'AI',
        candidate_id: 'cand-001',
        audience: 'general',
        budget_profile: 'local'
      },
      dossier_state: {}
    });
    console.log(JSON.stringify(result, null, 2));
  })();
}
