/**
 * Chat Orchestration Service
 *
 * Main coordinator that orchestrates the complete flow:
 * User message → Intent detection → Mode validation → Route legality → Guard enforcement →
 * Dossier creation → Workflow triggering → Result reading → Approval routing
 */

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
      // Step 1: Detect user intent from message
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

      if (!intent) {
        return {
          run_id: runId,
          status: 'error',
          error: 'Intent data is missing from resolver result',
        };
      }

      // Step 2: Validate user mode can access this intent
      const modeAccessCheck = this.modeGuard.validateModeAccess(userMode, intent);
      if (!modeAccessCheck.allowed) {
        return {
          run_id: runId,
          status: 'access_denied',
          intent_id: intent.intent_id,
          reason: modeAccessCheck.reason,
        };
      }

      // Step 3: Determine route
      let selectedRoute = intent.required_route || this.modeGuard.getDefaultRoute(userMode);
      if (operationalMode === 'replay') {
        selectedRoute = 'ROUTE_PHASE1_REPLAY';
      }

      // Step 4: Validate route legality for user mode
      const routeLegalityCheck = this.modeGuard.validateRouteLegality(userMode, selectedRoute);
      if (!routeLegalityCheck.allowed) {
        return {
          run_id: runId,
          status: 'route_not_allowed',
          reason: routeLegalityCheck.reason,
        };
      }

      // Step 5: Enforce hard guards
      const guardEnforcement = this.modeGuard.enforceHardGuards(userMode, intent);
      if (!guardEnforcement.passed) {
        return {
          run_id: runId,
          status: 'guard_violation',
          failures: guardEnforcement.failures,
        };
      }

      // Step 5.5: Select and validate model
      let selectedModel = context.selectedModel || this.modelRouter.getDefaultModel(userMode, intent.intent_id).model_id;

      const modelAccessCheck = this.modelRouter.validateModelAccess(userMode, selectedModel);
      if (!modelAccessCheck.allowed) {
        return {
          run_id: runId,
          status: 'model_not_available',
          reason: modelAccessCheck.reason,
        };
      }

      const modelEndpoint = this.modelRouter.getModelEndpoint(selectedModel, context.selectedRuntime || 'local');

      // Step 6: Create dossier via WF-001 if needed
      let dossierId = context.dossierId;
      if (!dossierId) {
        const newDossier = this.dossierReader.createDossier(
          message.substring(0, 200),
          {
            user_mode: userMode,
            intent_id: intent.intent_id,
            operational_mode: operationalMode,
          }
        );
        dossierId = newDossier.dossier_id;
      }

      // Step 7: Trigger primary workflow
      const workflowResult = await this.workflowClient.triggerWorkflow(intent.primary_workflow, {
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
          error: workflowResult.error,
        };
      }

      // Step 8: Track execution in history
      this.executionHistory[runId] = {
        run_id: runId,
        dossier_id: dossierId,
        intent_id: intent.intent_id,
        workflow_id: intent.primary_workflow,
        execution_id: workflowResult.execution_id,
        user_mode: userMode,
        route: selectedRoute,
        status: 'in_progress',
        created_at: new Date().toISOString(),
      };

      // Step 9: Poll for initial execution status
      const executionStatus = await this.workflowClient.getExecutionStatus(
        workflowResult.execution_id
      );

      // Step 10: Read dossier summary and available packets
      const dossierSummary = this.dossierReader.getDossierSummary(dossierId);
      const packets = this.packetReader.getPacketsByDossier(dossierId);
      const artifactFamilies = this.packetReader.getArtifactFamiliesForDossier(dossierId);

      // Step 11: Determine next actions
      const nextActions = this.determineNextActions(intent, executionStatus, dossierSummary);

      // TRUTH: status is NOT success unless workflow has produced output
      // Triggering != Success
      // If packets exist → RUNNING/COMPLETED
      // If no packets → QUEUED/ACCEPTED
      const truthfulStatus = packets.length > 0
        ? 'running_with_output'
        : 'accepted_awaiting_execution';

      return {
        run_id: runId,
        status: 'accepted', // Orchestration accepted, not necessarily succeeded
        orchestration_truth: truthfulStatus,
        intent_id: intent.intent_id,
        intent_label: intent.label,
        dossier_id: dossierId,
        execution_id: workflowResult.execution_id,
        workflow_triggered: intent.primary_workflow,
        current_stage: dossierSummary.workflow_stage,
        execution_status: executionStatus.status,
        selected_model: selectedModel,
        model_endpoint: modelEndpoint.endpoint,
        packets_generated: packets.length,
        artifact_families: artifactFamilies,
        approval_required: intent.approval_required,
        replay_eligible: intent.replay_eligible,
        next_actions: nextActions,
      };
    } catch (err) {
      console.error(`Orchestration error: ${err.message}`);
      return {
        run_id: runId,
        status: 'error',
        error: err.message,
      };
    }
  }

  async getExecutionResults(runId) {
    const execution = this.executionHistory[runId];
    if (!execution) {
      return {
        run_id: runId,
        status: 'not_found',
        error: `Execution ${runId} not found`,
      };
    }

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
        packet_id: p.packet_id,
        artifact_family: p.artifact_family,
        status: p.status,
        created_at: p.created_at,
      })),
    };
  }

  async approveDossier(dossierId, userMode) {
    if (userMode !== 'founder') {
      return {
        status: 'error',
        reason: `Only founder mode can approve. Current mode: ${userMode}`,
      };
    }

    const approvalResult = await this.workflowClient.approveContent(dossierId, 'approved');

    if (approvalResult.status === 'failed') {
      return {
        status: 'error',
        error: approvalResult.error,
      };
    }

    this.dossierReader.updateDossierStatus(dossierId, 'approved', {
      approved_at: new Date().toISOString(),
      approved_by: userMode,
    });

    return {
      status: 'success',
      dossier_id: dossierId,
      execution_id: approvalResult.execution_id,
    };
  }

  async rejectDossier(dossierId, feedback, userMode) {
    if (userMode !== 'founder') {
      return {
        status: 'error',
        reason: `Only founder mode can reject. Current mode: ${userMode}`,
      };
    }

    const rejectResult = await this.workflowClient.replayWorkflow(dossierId, 'content_generation', {
      rejection_reason: feedback,
    });

    if (rejectResult.status === 'failed') {
      return {
        status: 'error',
        error: rejectResult.error,
      };
    }

    this.dossierReader.updateDossierStatus(dossierId, 'rejected', {
      rejected_at: new Date().toISOString(),
      rejection_feedback: feedback,
    });

    return {
      status: 'success',
      dossier_id: dossierId,
      execution_id: rejectResult.execution_id,
    };
  }

  determineNextActions(intent, executionStatus, dossierSummary) {
    const actions = [];

    if (intent.approval_required && dossierSummary.status !== 'approved') {
      actions.push({
        action: 'approve',
        label: 'Approve & Publish',
        enabled: true,
      });
      actions.push({
        action: 'reject',
        label: 'Reject & Request Changes',
        enabled: true,
      });
    }

    if (intent.replay_eligible && dossierSummary.status === 'in_progress') {
      actions.push({
        action: 'replay',
        label: 'Replay from Checkpoint',
        enabled: true,
      });
    }

    if (executionStatus.status === 'running' || executionStatus.status === 'queued') {
      actions.push({
        action: 'troubleshoot',
        label: 'Monitor Execution',
        enabled: true,
      });
    }

    if (executionStatus.status === 'failed') {
      actions.push({
        action: 'replay',
        label: 'Retry Workflow',
        enabled: intent.replay_eligible,
      });
      actions.push({
        action: 'escalate',
        label: 'Escalate to Error Handler',
        enabled: true,
      });
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
}

module.exports = ChatOrchestrationService;
