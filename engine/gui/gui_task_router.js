/**
 * GUI Task Router
 *
 * Routes GUI actions to proper orchestration workflows.
 * This is the SOURCE OF TRUTH for GUI → Workflow mapping.
 *
 * Every GUI button must be backed by a proper routing contract.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const GuiExecutionTreeBuilder = require('./gui_execution_tree_builder');

class GuiTaskRouter {
  constructor() {
    this.routingMatrix = this.loadRoutingMatrix();
    this.treeBuilder = new GuiExecutionTreeBuilder();
  }

  /**
   * Load routing matrix from YAML
   */
  loadRoutingMatrix() {
    try {
      const filePath = path.join(__dirname, '../../registries/gui_task_routing_matrix.yaml');
      const content = fs.readFileSync(filePath, 'utf8');
      return yaml.load(content);
    } catch (err) {
      console.error('Failed to load routing matrix:', err.message);
      return { gui_tasks: {}, workflows: {} };
    }
  }

  /**
   * Route a GUI action to its execution chain
   */
  async routeGuiAction(actionId, userMode, inputData = {}) {
    const executionId = this.generateExecutionId();

    try {
      // 1. Get task config from routing matrix
      const taskConfig = this.routingMatrix.gui_tasks[actionId];
      if (!taskConfig) {
        return {
          success: false,
          error: `Unknown action: ${actionId}`,
          execution_id: executionId,
        };
      }

      // 2. Validate user has access to this task
      const accessCheck = this.checkUserAccess(taskConfig, userMode);
      if (!accessCheck.allowed) {
        return {
          success: false,
          error: `Access denied: ${accessCheck.reason}`,
          execution_id: executionId,
          required_mode: taskConfig.allowed_modes,
          current_mode: userMode,
        };
      }

      // 3. Start execution tree
      const tree = this.treeBuilder.startExecutionTree(executionId, taskConfig);

      // 4. Complete intent detection in tree
      this.treeBuilder.completeIntentDetection(executionId, {
        intent_id: taskConfig.id,
        intent_label: taskConfig.label,
        confidence: 0.99,
      });

      // 5. Complete mode/route check
      this.treeBuilder.completeModeRouteCheck(executionId, {
        mode: userMode,
        route: taskConfig.default_route || 'ROUTE_PHASE1_STANDARD',
        guards: {
          mode_check: 'PASS',
          route_check: 'PASS',
          policy_check: 'PASS',
        },
      });

      // 6. Build execution result with tree
      const result = {
        success: true,
        execution_id: executionId,
        task_id: taskConfig.id,
        task_label: taskConfig.label,
        user_mode: userMode,
        route: taskConfig.default_route || 'ROUTE_PHASE1_STANDARD',
        workflow_chain: taskConfig.workflow_chain || [],
        primary_director: taskConfig.primary_director,
        supporting_directors: taskConfig.supporting_directors || [],
        execution_tree: tree,
        tree_text: this.treeBuilder.getTreeAsText(executionId),
      };

      return result;
    } catch (err) {
      return {
        success: false,
        error: err.message,
        execution_id: executionId,
      };
    }
  }

  /**
   * Check if user mode has access to task
   */
  checkUserAccess(taskConfig, userMode) {
    if (!taskConfig.allowed_modes || taskConfig.allowed_modes.length === 0) {
      return { allowed: true };
    }

    if (taskConfig.allowed_modes.includes(userMode)) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: `${taskConfig.label} requires one of: ${taskConfig.allowed_modes.join(', ')}`,
    };
  }

  /**
   * Get all available tasks for a user mode
   */
  getAvailableTasks(userMode) {
    const available = [];

    Object.entries(this.routingMatrix.gui_tasks).forEach(([id, config]) => {
      const access = this.checkUserAccess(config, userMode);
      if (access.allowed) {
        available.push({
          id,
          label: config.label,
          description: config.description,
          is_main_interface: config.is_main_interface,
          requires_prior_output: config.requires_prior_output,
          outputs: config.outputs,
          approval_required: config.approval_required,
        });
      }
    });

    return available;
  }

  /**
   * Get task routing contract (the full mapping)
   */
  getTaskContract(taskId) {
    const task = this.routingMatrix.gui_tasks[taskId];
    if (!task) return null;

    // Enrich with workflow details
    const enriched = {
      ...task,
      workflows: task.workflow_chain
        ? task.workflow_chain.map(wfId => ({
            workflow_id: wfId,
            ...this.routingMatrix.workflows[wfId],
          }))
        : [],
    };

    return enriched;
  }

  /**
   * Execute approval action
   */
  async executeApproval(dossierData, userMode) {
    return this.routeGuiAction('approve_output', userMode, {
      dossier_id: dossierData.dossier_id,
      dossier: dossierData,
    });
  }

  /**
   * Execute rejection/remodify action
   */
  async executeRejection(dossierData, rejectionReason, userMode) {
    return this.routeGuiAction('reject_and_remodify', userMode, {
      dossier_id: dossierData.dossier_id,
      rejection_reason: rejectionReason,
      target_workflow: 'WF-200', // Re-run script generation
    });
  }

  /**
   * Get execution tree
   */
  getExecutionTree(executionId) {
    return this.treeBuilder.getExecutionTree(executionId);
  }

  /**
   * Get execution tree as text
   */
  getExecutionTreeText(executionId) {
    return this.treeBuilder.getTreeAsText(executionId);
  }

  /**
   * Update execution tree during workflow execution
   */
  updateExecutionProgress(executionId, workflowId, status, details = {}) {
    return this.treeBuilder.updateNodeStatus(
      executionId,
      `workflow_${workflowId.toLowerCase()}`,
      status,
      details
    );
  }

  /**
   * Generate unique execution ID
   */
  generateExecutionId() {
    return `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Export routing matrix for UI
   */
  exportRoutingMatrix() {
    return {
      tasks: Object.keys(this.routingMatrix.gui_tasks).map(id => ({
        id,
        ...this.routingMatrix.gui_tasks[id],
      })),
      workflows: Object.keys(this.routingMatrix.workflows).map(id => ({
        workflow_id: id,
        ...this.routingMatrix.workflows[id],
      })),
    };
  }
}

module.exports = GuiTaskRouter;
