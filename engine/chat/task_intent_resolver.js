const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class TaskIntentResolver {
  constructor() {
    this.registry = this.loadRegistry();
    this.patterns = [
      { id: 'approve_output', re: /\bapprove\b/i, confidence: 0.97 },
      { id: 'reject_and_remodify', re: /\b(reject|remodify|changes?)\b/i, confidence: 0.95 },
      { id: 'replay_stage', re: /\b(replay|rerun)\b/i, confidence: 0.95 },
      { id: 'troubleshoot_error', re: /\b(error|troubleshoot|debug|failed)\b/i, confidence: 0.9 },
      { id: 'generate_thumbnail_concept', re: /\b(thumbnail|image prompt|cover)\b/i, confidence: 0.9 },
      { id: 'generate_metadata', re: /\b(metadata|title|description|tags?)\b/i, confidence: 0.9 },
      { id: 'debate_script', re: /\b(debate|critique|review script)\b/i, confidence: 0.9 },
      { id: 'generate_topic_ideas', re: /\b(topic ideas?|topic)\b/i, confidence: 0.88 },
      { id: 'new_content_job', re: /\b(script|youtube|video|content|create)\b/i, confidence: 0.86 },
    ];
  }

  loadRegistry() {
    const defaults = {
      gui_tasks: {
        new_content_job: {
          id: 'new_content_job',
          label: 'Create New Content',
          entry_workflow: 'WF-010',
          workflow_chain: ['WF-010', 'WF-100', 'WF-200', 'WF-300', 'WF-400', 'WF-500', 'WF-020'],
          child_workflows: ['WF-100', 'WF-200', 'WF-300', 'WF-400', 'WF-500', 'WF-020'],
          allowed_modes: ['founder', 'creator', 'operator'],
          approval_required: true,
          replay_supported: true,
        },
      },
    };

    try {
      const p = path.join(__dirname, '../../registries/gui_task_routing_matrix.yaml');
      const parsed = yaml.load(fs.readFileSync(p, 'utf8'));
      return parsed && parsed.gui_tasks ? parsed : defaults;
    } catch {
      return defaults;
    }
  }

  resolve(message = '') {
    const msg = String(message || '').trim();
    if (!msg) {
      return {
        intent_id: null,
        confidence: 0,
        requires_clarification: true,
        clarification_message: 'Please tell me what you want to create or run.',
        alternatives: ['new_content_job', 'generate_topic_ideas', 'generate_metadata'],
      };
    }

    let matched = { id: 'new_content_job', confidence: 0.7 };
    const lowered = msg.toLowerCase();
    const scriptSignal = /\b(script|youtube|video|content|create)\b/i.test(msg);
    const thumbnailSignal = /\b(thumbnail|image prompt|cover)\b/i.test(msg);
    const candidates = this.patterns
      .filter((p) => p.re.test(msg))
      .map((p) => ({ ...p, score: p.confidence }));

    // Composite request (script + thumbnail etc.) is treated as a full content job.
    if (scriptSignal && thumbnailSignal) {
      matched = { id: 'new_content_job', confidence: 0.94 };
    } else if (candidates.length > 0) {
      candidates.sort((a, b) => b.score - a.score);
      matched = { id: candidates[0].id, confidence: candidates[0].confidence };
    } else if (lowered.includes('job') || lowered.includes('campaign')) {
      matched = { id: 'new_content_job', confidence: 0.82 };
    }

    const task = this.registry.gui_tasks?.[matched.id] || this.registry.gui_tasks?.new_content_job;
    if (!task) {
      return {
        intent_id: null,
        confidence: 0,
        requires_clarification: true,
        clarification_message: 'Intent could not be mapped to a workflow contract.',
        alternatives: [],
      };
    }

    return {
      intent_id: task.id,
      confidence: matched.confidence,
      requires_clarification: false,
      intent_data: {
        intent_id: task.id,
        label: task.label || task.id,
        primary_workflow: task.entry_workflow || 'WF-010',
        child_workflows: task.child_workflows || task.workflow_chain || [],
        allowed_modes: task.allowed_modes || ['creator'],
        required_route: task.default_route || 'ROUTE_PHASE1_STANDARD',
        approval_required: Boolean(task.approval_required),
        replay_eligible: Boolean(task.replay_supported),
      },
    };
  }
}

module.exports = TaskIntentResolver;
