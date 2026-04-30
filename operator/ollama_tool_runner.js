const TaskRouter = require('./task_router');

class OllamaToolRunner {
  constructor(modeManager, n8nClient) {
    this.taskRouter = new TaskRouter();
    this.modeManager = modeManager;
    this.n8n = n8nClient;
  }

  async run(commandText, context = {}) {
    const mode = context.mode || this.modeManager.getDefaultMode();
    const task = this.taskRouter.resolveTaskFromMessage(commandText);
    const route = this.modeManager.getDefaultRoute(mode);
    const routeCheck = this.modeManager.validateRoute(mode, route);
    const modeCheck = this.modeManager.validateModeForTask(mode, {
      id: task.intent_id,
      allowed_modes: task.task_contract?.allowed_modes || task.allowed_modes || [],
    });

    if (!routeCheck.allowed || !modeCheck.allowed) {
      return {
        status: 'blocked',
        reason: modeCheck.reason || routeCheck.reason,
        mode,
        route,
        intent_id: task.intent_id,
      };
    }

    const payload = {
      user_message: commandText,
      mode,
      route_id: route,
      topic: commandText,
      context: context.topic_context || 'YouTube video',
      dossier_id: context.dossier_id,
    };

    const result = await this.n8n.trigger(task.entry_workflow, payload);
    return {
      status: result.status === 'failed' ? 'failed' : 'accepted',
      intent_id: task.intent_id,
      workflow_id: task.entry_workflow,
      route_id: route,
      mode,
      n8n_result: result,
    };
  }
}

module.exports = OllamaToolRunner;

