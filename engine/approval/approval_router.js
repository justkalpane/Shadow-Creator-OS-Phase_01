/**
 * Approval Router Engine
 * Routes post-resolution decisions to WF-300 (approved), WF-021 (rejected/remodify), or WF-900 (error).
 */

const ApprovalResolver = require('./approval_resolver');

class ApprovalRouter {
  constructor(config = {}) {
    this.resolver = new ApprovalResolver(config);
    this.routing_log = [];
  }

  /**
   * Route approval based on resolved decision
   * @param {string} queue_entry_id
   * @param {string} decision - APPROVED | REJECTED | REMODIFY
   * @param {string} resolved_by
   * @param {object} context - { rejection_reason, redirect_to, notes }
   * @returns {object} - { status, next_workflow, action, payload }
   */
  async routeApprovalDecision(queue_entry_id, decision, resolved_by, context = {}) {
    const routing_id = 'APR-' + Date.now();

    try {
      // Resolve in queue
      const resolution = await this.resolver.resolveDecision(queue_entry_id, decision, resolved_by, context);

      const routing_action = resolution.routing_action;

      // Build routing payload
      const routing_payload = {
        routing_id,
        source_queue_entry_id: queue_entry_id,
        resolution_id: resolution.resolution_id,
        decision,
        resolved_by,
        next_workflow: routing_action.next_workflow,
        action: routing_action.action
      };

      // Append decision-specific context
      if (decision === 'REJECTED' || decision === 'REMODIFY') {
        routing_payload.rejection_reason = routing_action.rejection_reason || null;
        routing_payload.modification_guidance = routing_action.modification_guidance || null;
        routing_payload.redirect_target = routing_action.next_workflow;
      }

      if (decision === 'APPROVED') {
        routing_payload.media_pipeline_ready = true;
        routing_payload.next_phase = 'MEDIA_PRODUCTION';
      }

      this.log({ routing_id, queue_entry_id, decision, next_workflow: routing_action.next_workflow });

      return {
        status: 'SUCCESS',
        routing_id,
        next_workflow: routing_action.next_workflow,
        action: routing_action.action,
        payload: routing_payload
      };

    } catch (e) {
      this.log({ routing_id, queue_entry_id, status: 'FAILED', error: e.message });

      return {
        status: 'FAILED',
        routing_id,
        next_workflow: 'WF-900',
        action: 'ESCALATE_ROUTING_ERROR',
        error: e.message
      };
    }
  }

  /**
   * Check for expired approvals and escalate
   */
  async checkExpiredApprovals() {
    const pending = await this.resolver.loadQueue().then(q => q.entries.filter(e => e.status === 'PENDING'));
    const now = Date.now();
    const expired = pending.filter(e => new Date(e.deadline).getTime() < now);

    const escalations = [];
    for (const entry of expired) {
      escalations.push({
        queue_entry_id: entry.queue_entry_id,
        dossier_ref: entry.dossier_ref,
        expired_at: entry.deadline,
        escalate_to: 'WF-900',
        reason: 'APPROVAL_DEADLINE_EXCEEDED'
      });
    }

    return {
      expired_count: expired.length,
      escalations
    };
  }

  log(entry) {
    this.routing_log.push({ ...entry, timestamp: new Date().toISOString() });
    if (entry.status === 'FAILED') console.error('[APPROVAL_ROUTING_FAILED]', entry.error);
  }

  getRoutingLog() { return this.routing_log; }
}

module.exports = ApprovalRouter;
