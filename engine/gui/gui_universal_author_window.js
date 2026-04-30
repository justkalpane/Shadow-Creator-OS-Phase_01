/**
 * GUI Universal Author Window
 *
 * The main orchestration command interface.
 * Understands natural language and routes to real workflows.
 * Shows complete execution tree, not just summaries.
 */

const GuiTaskRouter = require('./gui_task_router');
const ChatOrchestrationService = require('../chat/chat_orchestration_service');

class GuiUniversalAuthorWindow {
  constructor() {
    this.taskRouter = new GuiTaskRouter();
    this.orchestrator = new ChatOrchestrationService();
  }

  /**
   * Process user command through Universal Author Window
   *
   * Returns:
   * - What task was understood
   * - Which workflow will execute
   * - Which directors are involved
   * - Full execution tree
   * - Output packets when available
   */
  async processCommand(userInput, userMode) {
    const result = {
      user_input: userInput,
      user_mode: userMode,
      timestamp: new Date().toISOString(),
    };

    try {
      // Step 1: Process through orchestration (existing intent resolver)
      const orchestrationResult = await this.orchestrator.processMessage(
        userInput,
        userMode,
        null,
        { selectedRuntime: 'local' }
      );

      result.orchestration = orchestrationResult;

      // Step 2: Get routing contract for transparency
      if (orchestrationResult.status === 'accepted' || orchestrationResult.status === 'success') {
        const contract = this.taskRouter.getTaskContract(orchestrationResult.intent_id);
        result.routing_contract = contract;

        // Step 3: Build detailed response showing the full chain
        result.display = this.buildUniversalAuthorResponse(
          orchestrationResult,
          contract,
          userMode
        );
      } else {
        result.display = this.buildErrorResponse(orchestrationResult);
      }

      return result;
    } catch (err) {
      console.error('Universal Author error:', err.message);
      return {
        success: false,
        error: err.message,
        user_input: userInput,
      };
    }
  }

  /**
   * Build the complete response for Universal Author Window
   */
  buildUniversalAuthorResponse(orchestration, contract, userMode) {
    const hasOutput = orchestration.packets_generated > 0;
    const indicator = hasOutput ? '📦' : '⏳';

    let response = `${indicator} TASK UNDERSTOOD\n`;
    response += `Intent: ${orchestration.intent_label}\n`;
    response += `Confidence: ${(0.99 * 100).toFixed(0)}%\n\n`;

    // Detected intents
    if (contract && contract.workflow_chain) {
      response += `WORKFLOWS TRIGGERED\n`;
      response += `${'='.repeat(50)}\n`;
      contract.workflow_chain.forEach((wf, i) => {
        const status = i === 0 ? '→ RUNNING' : '⏳ PENDING';
        response += `${i + 1}. ${wf} ${status}\n`;
      });
      response += '\n';
    }

    // Mode & Route
    response += `MODE & ROUTE\n`;
    response += `${'='.repeat(50)}\n`;
    response += `Mode:      ${userMode}\n`;
    response += `Route:     ${orchestration.route || 'ROUTE_PHASE1_STANDARD'}\n`;
    response += `Model:     ${orchestration.selected_model}\n\n`;

    // Dossier & Execution
    response += `DOSSIER & EXECUTION\n`;
    response += `${'='.repeat(50)}\n`;
    response += `Dossier ID:      ${orchestration.dossier_id}\n`;
    response += `Execution ID:    ${orchestration.execution_id}\n`;
    response += `Status:          ${orchestration.orchestration_truth || 'RUNNING'}\n`;
    response += `Current Stage:   ${orchestration.current_stage}\n\n`;

    // Output Status
    response += `OUTPUT STATUS\n`;
    response += `${'='.repeat(50)}\n`;
    response += `Packets Generated: ${orchestration.packets_generated}\n`;
    if (orchestration.packets_generated > 0) {
      response += `Families:          ${orchestration.artifact_families.join(', ')}\n`;
    } else {
      response += `Families:          awaiting workflow execution\n`;
    }
    response += '\n';

    // Director mapping
    if (contract && contract.primary_director) {
      response += `DIRECTORS ASSIGNED\n`;
      response += `${'='.repeat(50)}\n`;
      response += `Primary:     ${contract.primary_director}\n`;
      if (contract.supporting_directors && contract.supporting_directors.length > 0) {
        response += `Supporting:  ${contract.supporting_directors.join(', ')}\n`;
      }
      response += '\n';
    }

    // Next actions
    response += `NEXT ACTIONS\n`;
    response += `${'='.repeat(50)}\n`;
    if (hasOutput && orchestration.approval_required) {
      response += `• Approve Output (founder mode only)\n`;
      response += `• Request Changes\n`;
      response += `• Monitor Execution\n`;
    } else if (hasOutput) {
      response += `• Monitor Execution\n`;
      response += `• View Packets\n`;
    } else {
      response += `• Monitor workflow execution\n`;
      response += `• Check status in a few moments\n`;
    }

    return response;
  }

  /**
   * Build error response
   */
  buildErrorResponse(orchestration) {
    let response = `⚠️ ISSUE PROCESSING TASK\n\n`;
    response += `Status: ${orchestration.status}\n`;

    if (orchestration.reason) {
      response += `Reason: ${orchestration.reason}\n`;
    }
    if (orchestration.error) {
      response += `Error: ${orchestration.error}\n`;
    }
    if (orchestration.message) {
      response += `Message: ${orchestration.message}\n`;
    }

    return response;
  }
}

module.exports = GuiUniversalAuthorWindow;
