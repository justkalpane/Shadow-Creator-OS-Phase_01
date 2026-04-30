const { readYamlSafe } = require('./_shared');

class TaskRouter {
  constructor() {
    this.intentRegistry = readYamlSafe('registries/task_intent_registry.yaml', {});
    this.guiRouting = readYamlSafe('registries/gui_task_routing_matrix.yaml', {});
    this.patterns = [
      { intent_id: 'new_content_job', re: /\b(create|script|youtube|video|content)\b/i },
      { intent_id: 'generate_topic_ideas', re: /\b(topic|ideas?)\b/i },
      { intent_id: 'generate_script', re: /\b(script|write)\b/i },
      { intent_id: 'generate_thumbnail_concept', re: /\b(thumbnail|image prompt|cover)\b/i },
      { intent_id: 'generate_metadata', re: /\b(metadata|tags?|description|title)\b/i },
      { intent_id: 'approve_output', re: /\bapprove\b/i },
      { intent_id: 'reject_and_remodify', re: /\b(reject|changes|remodify)\b/i },
      { intent_id: 'troubleshoot_error', re: /\b(error|debug|troubleshoot|failed)\b/i },
    ];
  }

  listTaskContracts() {
    return this.guiRouting.gui_tasks || {};
  }

  resolveIntent(message) {
    const text = String(message || '').trim();
    if (!text) return 'new_content_job';
    const found = this.patterns.find((p) => p.re.test(text));
    return found ? found.intent_id : 'new_content_job';
  }

  getIntentDef(intentId) {
    const intents = this.intentRegistry.intents || {};
    if (intents[intentId]) return { id: intentId, ...intents[intentId] };
    return null;
  }

  getGuiTaskDef(intentId) {
    const tasks = this.guiRouting.gui_tasks || {};
    if (tasks[intentId]) return tasks[intentId];
    return null;
  }

  resolveTaskFromMessage(message) {
    const intentId = this.resolveIntent(message);
    const intent = this.getIntentDef(intentId) || this.getIntentDef('new_content_job');
    const guiTask = this.getGuiTaskDef(intentId) || this.getGuiTaskDef('new_content_job');

    return {
      intent_id: intent?.id || 'new_content_job',
      label: intent?.label || 'Create New Content',
      entry_workflow: intent?.entry_workflow || guiTask?.entry_workflow || 'WF-010',
      child_workflows: intent?.child_workflows || guiTask?.child_workflows || [],
      approval_required: Boolean(intent?.approval_required),
      replay_eligible: Boolean(intent?.replay_eligible),
      task_contract: guiTask || null,
    };
  }
}

module.exports = TaskRouter;

