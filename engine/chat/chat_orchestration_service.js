const TaskIntentResolver = require('./task_intent_resolver');
const ModeGuard = require('./mode_guard');
const ModelRouter = require('./model_router');
const N8nWorkflowClient = require('./n8n_workflow_client');
const DossierResultReader = require('./dossier_result_reader');
const PacketResultReader = require('./packet_result_reader');

class ChatOrchestrationService {
  constructor(options = {}) {
    this.taskIntentResolver = new TaskIntentResolver();
    this.modeGuard = new ModeGuard();
    this.modelRouter = new ModelRouter();
    this.workflowClient = new N8nWorkflowClient(options.n8nOptions || {});
    this.dossierReader = new DossierResultReader();
    this.packetReader = new PacketResultReader();
    this.executionHistory = {};
  }

  async processMessage(message, userMode, operationalMode = null, context = {}) {
    const runId = `run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    try {
      const intentResult = this.taskIntentResolver.resolve(message);
      if (intentResult.requires_clarification) {
        return {
          run_id: runId,
          status: 'needs_clarification',
          intent_id: intentResult.intent_id,
          confidence: intentResult.confidence,
          message: intentResult.clarification_message,
          alternatives: intentResult.alternatives,
        };
      }

      const intent = intentResult.intent_data;
      const modeAccessCheck = this.modeGuard.validateModeAccess(userMode, intent);
      if (!modeAccessCheck.allowed) {
        return {
          run_id: runId,
          status: 'access_denied',
          intent_id: intent.intent_id,
          reason: modeAccessCheck.reason,
        };
      }

      let selectedRoute = intent.required_route || this.modeGuard.getDefaultRoute(userMode);
      if (operationalMode === 'replay') selectedRoute = 'ROUTE_PHASE1_REPLAY';

      const routeLegalityCheck = this.modeGuard.validateRouteLegality(userMode, selectedRoute);
      if (!routeLegalityCheck.allowed) {
        return { run_id: runId, status: 'route_not_allowed', reason: routeLegalityCheck.reason };
      }

      const guardEnforcement = this.modeGuard.enforceHardGuards(userMode, intent);
      if (!guardEnforcement.passed) {
        return { run_id: runId, status: 'guard_violation', failures: guardEnforcement.failures };
      }

      let selectedModel = context.selectedModel || this.modelRouter.getDefaultModel(userMode, intent.intent_id).model_id;
      const modelAccessCheck = this.modelRouter.validateModelAccess(userMode, selectedModel);
      if (!modelAccessCheck.allowed) {
        return { run_id: runId, status: 'model_not_available', reason: modelAccessCheck.reason };
      }
      const modelEndpoint = this.modelRouter.getModelEndpoint(selectedModel, context.selectedRuntime || 'local');

      let dossierId = context.dossierId;
      let dossierFallbackUsed = false;
      if (!dossierId) {
        const beforeDossiers = this.dossierReader.getAllDossiers();
        const beforeIds = new Set(beforeDossiers.map((d) => d.dossier_id));

        const dossierCreateResult = await this.workflowClient.triggerWorkflow('WF-001', {
          topic: String(message || '').slice(0, 300),
          context: context.topicContext || 'YouTube video',
          mode: userMode,
          route_id: selectedRoute,
          user_message: message,
        });

        if (dossierCreateResult.status === 'failed') {
          return {
            run_id: runId,
            status: 'workflow_trigger_failed',
            workflow_id: 'WF-001',
            requested_url: dossierCreateResult.requested_url || null,
            method: dossierCreateResult.error_details?.method || 'POST',
            http_status: dossierCreateResult.http_status || null,
            response_body: dossierCreateResult.response_body || null,
            error_message: dossierCreateResult.error || 'WF-001 trigger failed',
            likely_fix: dossierCreateResult.likely_fix || 'Verify WF-001 webhook activation and path in n8n.',
          };
        }

        dossierId =
          dossierCreateResult.response_data?.dossier_id ||
          dossierCreateResult.response_data?.data?.dossier_id ||
          dossierCreateResult.response_data?.dossier?.dossier_id ||
          null;

        if (!dossierId && dossierCreateResult.http_status && dossierCreateResult.http_status < 300) {
          dossierId = await this.findNewDossierFromIndex(beforeIds, String(message || ''));
        }

        if (!dossierId && dossierCreateResult.http_status && dossierCreateResult.http_status < 300) {
          const newDossier = this.dossierReader.createDossier(String(message || '').slice(0, 200), {
            user_mode: userMode,
            intent_id: intent.intent_id,
            operational_mode: operationalMode,
            source: 'wf001_async_fallback',
          });
          dossierId = newDossier.dossier_id;
          dossierFallbackUsed = true;
        } else if (!dossierId && process.env.ENABLE_LOCAL_DOSSIER_FALLBACK === 'true') {
          const newDossier = this.dossierReader.createDossier(String(message || '').slice(0, 200), {
            user_mode: userMode,
            intent_id: intent.intent_id,
            operational_mode: operationalMode,
          });
          dossierId = newDossier.dossier_id;
          dossierFallbackUsed = true;
        }

        if (!dossierId) {
          return {
            run_id: runId,
            status: 'workflow_trigger_failed',
            workflow_id: 'WF-001',
            requested_url: dossierCreateResult.requested_url || null,
            method: 'POST',
            http_status: dossierCreateResult.http_status || null,
            response_body: dossierCreateResult.response_data || dossierCreateResult.response_body || null,
            error_message: 'WF-001 returned no dossier_id',
            likely_fix: 'Ensure WF-001 returns dossier_id in webhook response.',
          };
        }
      }

      let primaryWorkflow = intent.primary_workflow || 'WF-010';
      const primaryWorkflowConfig = this.workflowClient.getWebhookConfig(primaryWorkflow);
      if (
        !primaryWorkflowConfig ||
        String(primaryWorkflowConfig.trigger_mode || '').includes('child_via_parent_orchestrator') ||
        String(primaryWorkflowConfig.method || '').toUpperCase() === 'INTERNAL' ||
        primaryWorkflow === 'WF-001'
      ) {
        primaryWorkflow = 'WF-010';
      }

      const beforePacketCount = this.packetReader.getAllPackets().length;
      const triggerStartedAt = new Date().toISOString();
      const workflowResult = await this.workflowClient.triggerWorkflow(primaryWorkflow, {
        dossier_id: dossierId,
        user_mode: userMode,
        route_id: selectedRoute,
        intent_id: intent.intent_id,
        user_message: message,
        child_workflows: intent.child_workflows || [],
        model_id: selectedModel,
      });

      if (workflowResult.status === 'failed') {
        return {
          run_id: runId,
          status: 'workflow_trigger_failed',
          dossier_id: dossierId,
          workflow_id: primaryWorkflow,
          requested_url: workflowResult.requested_url || null,
          method: workflowResult.error_details?.method || 'POST',
          http_status: workflowResult.http_status || null,
          response_body: workflowResult.response_body || null,
          error_message: workflowResult.error || 'Workflow trigger failed',
          likely_fix: workflowResult.likely_fix || `Verify ${primaryWorkflow} webhook path/activation.`,
        };
      }

      this.executionHistory[runId] = {
        run_id: runId,
        dossier_id: dossierId,
        intent_id: intent.intent_id,
        workflow_id: primaryWorkflow,
        execution_id: workflowResult.execution_id,
        user_mode: userMode,
        route: selectedRoute,
        status: 'in_progress',
        created_at: new Date().toISOString(),
      };

      const executionStatus = await this.workflowClient.getExecutionStatus(workflowResult.execution_id);
      const dossierSummary = this.dossierReader.getDossierSummary(dossierId);
      const packets = this.packetReader.getPacketsByDossier(dossierId);
      const packetDelta = await this.waitForPacketDelta(beforePacketCount, 12000);
      const recentPacketCount = await this.waitForRecentPacketWindow(triggerStartedAt, 12000);
      const packetsGenerated = Math.max(packets.length, packetDelta, recentPacketCount);
      const artifactFamilies = this.packetReader.getArtifactFamiliesForDossier(dossierId);
      const nextActions = this.determineNextActions(intent, executionStatus, dossierSummary, packetsGenerated);

      // Persist dossier mutation with audit trail
      await this.persistDossierMutation(dossierId, {
        event: 'workflow_orchestration_complete',
        workflow_id: primaryWorkflow,
        execution_id: workflowResult.execution_id,
        status: executionStatus.status || 'queued',
        packets_generated: packetsGenerated
      });

      // Persist new packets to index
      if (packets.length > 0) {
        await this.persistNewPackets(primaryWorkflow, workflowResult.execution_id, packets, dossierId);
      }

      const orchestrationTruth = packetsGenerated === 0
        ? 'accepted_awaiting_execution'
        : (dossierSummary.status === 'approved' ? 'output_ready_for_review' : 'running_with_partial_output');

      return {
        run_id: runId,
        status: 'accepted',
        orchestration_truth: orchestrationTruth,
        intent_id: intent.intent_id,
        intent_label: intent.label,
        dossier_id: dossierId,
        execution_id: workflowResult.execution_id,
        workflow_triggered: primaryWorkflow,
        current_stage: dossierSummary.workflow_stage,
        execution_status: executionStatus.status || 'queued',
        selected_model: selectedModel,
        model_endpoint: modelEndpoint.endpoint,
        packets_generated: packetsGenerated,
        packet_delta_from_run: packetDelta,
        recent_packets_in_window: recentPacketCount,
        dossier_fallback_used: dossierFallbackUsed,
        artifact_families: artifactFamilies,
        approval_required: intent.approval_required,
        approval_ready: intent.approval_required && packetsGenerated > 0,
        replay_eligible: intent.replay_eligible,
        next_actions: nextActions,
      };
    } catch (err) {
      return { run_id: runId, status: 'error', error: err.message };
    }
  }

  async findNewDossierFromIndex(previousIds, topicText) {
    const topicLower = String(topicText || '').toLowerCase().trim();
    const timeoutAt = Date.now() + 8000;

    while (Date.now() < timeoutAt) {
      this.dossierReader.refresh();
      const dossiers = this.dossierReader.getAllDossiers();
      const fresh = dossiers.filter((d) => d?.dossier_id && !previousIds.has(d.dossier_id));
      if (fresh.length > 0) {
        const topical = fresh.find((d) => String(d.topic || '').toLowerCase().includes(topicLower.slice(0, 40)));
        const chosen = topical || fresh[fresh.length - 1];
        if (chosen?.dossier_id) return chosen.dossier_id;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return null;
  }

  async waitForPacketDelta(beforeCount, timeoutMs = 12000) {
    const timeoutAt = Date.now() + timeoutMs;
    while (Date.now() < timeoutAt) {
      const nowCount = this.packetReader.getAllPackets().length;
      const delta = Math.max(0, nowCount - beforeCount);
      if (delta > 0) return delta;
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
    return 0;
  }

  async waitForRecentPacketWindow(startedAtIso, timeoutMs = 12000) {
    const timeoutAt = Date.now() + timeoutMs;
    const startedAt = new Date(startedAtIso).getTime();
    while (Date.now() < timeoutAt) {
      const all = this.packetReader.getAllPackets();
      const fresh = all.filter((p) => {
        const ts = Date.parse(p.created_at || p.createdAt || '');
        return Number.isFinite(ts) && ts >= startedAt;
      });
      if (fresh.length > 0) return fresh.length;
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
    return 0;
  }

  async getExecutionResults(runId) {
    const execution = this.executionHistory[runId];
    if (!execution) return { run_id: runId, status: 'not_found', error: `Execution ${runId} not found` };
    this.dossierReader.refresh();
    this.packetReader.refresh();
    const dossierSummary = this.dossierReader.getDossierSummary(execution.dossier_id);
    const packets = this.packetReader.getPacketsByDossier(execution.dossier_id);
    return {
      run_id: runId,
      dossier_id: execution.dossier_id,
      workflow_triggered: execution.workflow_id,
      current_status: dossierSummary.status,
      workflow_stage: dossierSummary.workflow_stage,
      packets_count: packets.length,
      packets: packets.map((p) => ({
        packet_id: p.packet_id || p.instance_id,
        artifact_family: p.artifact_family || p.packet_family,
        status: p.status,
        created_at: p.created_at,
      })),
    };
  }

  async approveDossier(dossierId, userMode) {
    if (userMode !== 'founder') {
      return { status: 'error', reason: `Only founder mode can approve. Current mode: ${userMode}` };
    }
    const approvalResult = await this.workflowClient.approveContent(dossierId, 'approved');
    if (approvalResult.status === 'failed') return { status: 'error', error: approvalResult.error };

    // Aggregate child workflow results into parent status
    await this.aggregateChildResults(dossierId, 'WF-010');

    this.dossierReader.updateDossierStatus(dossierId, 'approved', {
      approved_at: new Date().toISOString(),
      approved_by: userMode,
    });

    // Persist approval to audit trail
    await this.persistDossierMutation(dossierId, {
      event: 'approval_granted',
      approved_by: userMode,
      approved_at: new Date().toISOString()
    });

    return { status: 'success', dossier_id: dossierId, execution_id: approvalResult.execution_id };
  }

  async rejectDossier(dossierId, feedback, userMode) {
    if (userMode !== 'founder') {
      return { status: 'error', reason: `Only founder mode can reject. Current mode: ${userMode}` };
    }
    const rejectResult = await this.workflowClient.replayWorkflow(dossierId, 'content_generation', {
      rejection_reason: feedback,
    });
    if (rejectResult.status === 'failed') return { status: 'error', error: rejectResult.error };
    this.dossierReader.updateDossierStatus(dossierId, 'rejected', {
      rejected_at: new Date().toISOString(),
      rejection_feedback: feedback,
    });
    return { status: 'success', dossier_id: dossierId, execution_id: rejectResult.execution_id };
  }

  determineNextActions(intent, executionStatus, dossierSummary, packetCount = 0) {
    const actions = [];
    if (intent.approval_required && dossierSummary.status !== 'approved' && packetCount > 0) {
      actions.push({ action: 'approve', label: 'Approve Output', enabled: true });
      actions.push({ action: 'reject', label: 'Request Changes', enabled: true });
    }
    if (intent.replay_eligible && dossierSummary.status === 'in_progress' && packetCount > 0) {
      actions.push({ action: 'replay', label: 'Replay from Checkpoint', enabled: true });
    }
    actions.push({ action: 'monitor', label: 'Monitor Execution', enabled: true });
    actions.push({ action: 'refresh_output', label: 'Refresh Output', enabled: true });
    if (executionStatus.status === 'failed') {
      actions.push({ action: 'troubleshoot', label: 'Troubleshoot Error', enabled: true });
    }
    return actions;
  }

  getExecutionHistory() {
    return this.executionHistory;
  }

  getAllDossiers() {
    return this.dossierReader.getAllDossiers();
  }

  getAllPackets() {
    return this.packetReader.getAllPackets();
  }

  async persistDossierMutation(dossierId, mutationData = {}) {
    try {
      this.dossierReader.refresh();
      const dossiers = this.dossierReader.getAllDossiers();
      const idx = dossiers.findIndex(d => d.dossier_id === dossierId);

      if (idx >= 0) {
        const existingAuditTrail = dossiers[idx]._audit_trail || [];
        dossiers[idx] = {
          ...dossiers[idx],
          ...mutationData,
          updated_at: new Date().toISOString(),
          _audit_trail: existingAuditTrail
        };
        dossiers[idx]._audit_trail.push({
          event: mutationData.event || 'workflow_executed',
          timestamp: new Date().toISOString(),
          workflow_id: mutationData.workflow_id,
          data: mutationData
        });

        const dataToWrite = {
          dossiers,
          last_updated: new Date().toISOString()
        };
        this.dossierReader.writeJson(this.dossierReader.indexPath, dataToWrite);
        return { status: 'persisted', dossier_id: dossierId, audit_entry_created: true };
      }
      return { status: 'not_found', dossier_id: dossierId };
    } catch (err) {
      return { status: 'error', dossier_id: dossierId, error: err.message };
    }
  }

  async persistNewPackets(workflowId, executionId, packets = [], dossierId) {
    try {
      if (!packets || packets.length === 0) return { status: 'no_packets', count: 0 };

      this.packetReader.refresh();
      const allPackets = this.packetReader.getAllPackets();
      let persistedCount = 0;

      packets.forEach(packet => {
        const packetExists = allPackets.find(p => p.packet_id === packet.packet_id);
        if (!packetExists) {
          allPackets.push({
            packet_id: packet.packet_id || `PKT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            dossier_ref: packet.dossier_id || dossierId,
            artifact_family: packet.artifact_family,
            source_workflow: workflowId,
            execution_id: executionId,
            created_at: new Date().toISOString(),
            size_bytes: packet.size_bytes || 0,
            ready_for_review: packet.ready_for_review || false
          });
          persistedCount++;
        }
      });

      if (persistedCount > 0) {
        const dataToWrite = {
          packets: allPackets,
          last_updated: new Date().toISOString()
        };
        this.packetReader.writeJson(this.packetReader.indexPath, dataToWrite);
      }
      return { status: 'persisted', count: persistedCount, total_packets: allPackets.length };
    } catch (err) {
      return { status: 'error', count: 0, error: err.message };
    }
  }

  async aggregateChildResults(dossierId, parentWorkflowId) {
    try {
      const routeRunsPath = require('path').join(__dirname, '../../data/se_route_runs.json');
      const fs = require('fs');

      if (!fs.existsSync(routeRunsPath)) {
        return { status: 'file_not_found', all_succeeded: false };
      }

      const routeRuns = JSON.parse(fs.readFileSync(routeRunsPath, 'utf8'));
      const childRuns = routeRuns.filter(r =>
        r.dossier_id === dossierId &&
        r.parent_workflow_id === parentWorkflowId &&
        r.workflow_id !== parentWorkflowId
      );

      const allSucceeded = childRuns.length > 0 &&
                           childRuns.every(r => r.status === 'COMPLETED' || r.status === 'success');

      const parentRun = routeRuns.find(r =>
        r.dossier_id === dossierId &&
        r.workflow_id === parentWorkflowId
      );

      if (parentRun) {
        parentRun.status = allSucceeded ? 'COMPLETED' : 'FAILED';
        parentRun.child_results = {
          total: childRuns.length,
          succeeded: childRuns.filter(r => r.status === 'COMPLETED' || r.status === 'success').length,
          failed: childRuns.filter(r => r.status === 'FAILED' || r.status === 'error').length,
          all_succeeded: allSucceeded
        };
        parentRun.updated_at = new Date().toISOString();

        fs.writeFileSync(routeRunsPath, JSON.stringify(routeRuns, null, 2), 'utf8');
      }

      return {
        status: 'aggregated',
        all_succeeded: allSucceeded,
        child_count: childRuns.length,
        parent_status_updated: !!parentRun
      };
    } catch (err) {
      return { status: 'error', all_succeeded: false, error: err.message };
    }
  }
}

module.exports = ChatOrchestrationService;
