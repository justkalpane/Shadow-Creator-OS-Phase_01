/**
 * Approval Router Engine
 * Routes approval outcomes with deterministic WF-021 / WF-900 guarantees.
 */

const ApprovalResolver = require('./approval_resolver');

class ApprovalRouter {
  constructor(config = {}) {
    this.resolver = new ApprovalResolver(config);
    this.routing_log = [];
    this.routing_counter = 0;
  }

  async routeApprovalDecision(queueEntryId, decision, resolvedBy, context = {}) {
    const routingId = this.buildRoutingId(queueEntryId, decision);

    try {
      const resolution = await this.resolver.resolveDecision(
        queueEntryId,
        decision,
        resolvedBy,
        context
      );
      const routingAction = this.normalizeRouting(decision, resolution.routing_action);

      const payload = {
        routing_id: routingId,
        source_queue_entry_id: queueEntryId,
        resolution_id: resolution.resolution_id,
        decision,
        resolved_by: resolvedBy,
        next_workflow: routingAction.next_workflow,
        action: routingAction.action,
        route_reason: routingAction.action
      };

      if (decision === 'REJECTED' || decision === 'REMODIFY') {
        payload.rejection_reason = routingAction.rejection_reason || null;
        payload.modification_guidance = routingAction.modification_guidance || null;
      }

      this.log({
        routing_id: routingId,
        queue_entry_id: queueEntryId,
        decision,
        next_workflow: routingAction.next_workflow,
        status: 'SUCCESS'
      });

      return {
        status: 'SUCCESS',
        routing_id: routingId,
        next_workflow: routingAction.next_workflow,
        action: routingAction.action,
        payload,
        route_to_workflow: null
      };
    } catch (error) {
      const routed = this.buildRoutedError(error.message);
      this.log({
        routing_id: routingId,
        queue_entry_id: queueEntryId,
        status: 'FAILED',
        error: routed.message,
        next_workflow: routed.route_to_workflow
      });

      return {
        status: 'FAILED',
        routing_id: routingId,
        next_workflow: routed.route_to_workflow,
        action: 'ESCALATE_ROUTING_ERROR',
        error: routed.message,
        route_to_workflow: routed.route_to_workflow
      };
    }
  }

  normalizeRouting(decision, routingAction) {
    const normalized = {
      next_workflow: routingAction?.next_workflow || 'WF-900',
      action: routingAction?.action || 'ESCALATE_ROUTING_ERROR',
      rejection_reason: routingAction?.rejection_reason || null,
      modification_guidance: routingAction?.modification_guidance || null
    };

    if ((decision === 'REJECTED' || decision === 'REMODIFY') && normalized.next_workflow !== 'WF-021') {
      normalized.next_workflow = 'WF-021';
      normalized.action = 'ROUTE_REPLAY_REMODIFY';
    }

    return normalized;
  }

  async checkExpiredApprovals() {
    const queue = await this.resolver.loadQueue();
    const resolutions = Array.isArray(queue.resolutions) ? queue.resolutions : [];
    const resolvedSet = new Set(resolutions.map((row) => row.queue_entry_id));
    const now = Date.now();

    const pending = queue.entries.filter(
      (entry) => entry.status === 'PENDING' && !resolvedSet.has(entry.queue_entry_id)
    );

    const expired = pending.filter((entry) => {
      const deadline = new Date(entry.deadline).getTime();
      return Number.isFinite(deadline) && deadline < now;
    });

    const escalations = expired.map((entry) => ({
      queue_entry_id: entry.queue_entry_id,
      dossier_ref: entry.dossier_ref,
      expired_at: entry.deadline,
      escalate_to: 'WF-900',
      reason: 'APPROVAL_DEADLINE_EXCEEDED'
    }));

    return {
      expired_count: escalations.length,
      escalations
    };
  }

  buildRoutingId(queueEntryId, decision) {
    this.routing_counter += 1;
    const signature = `${queueEntryId}|${decision}|${this.routing_counter}`;
    let hash = 2166136261;
    for (let i = 0; i < signature.length; i += 1) {
      hash ^= signature.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return `APR-${(hash >>> 0).toString(16).padStart(8, '0')}`;
  }

  buildRoutedError(message) {
    const error = new Error(message);
    error.route_to_workflow = 'WF-900';
    return error;
  }

  log(entry) {
    this.routing_log.push({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString()
    });
    if (entry.status === 'FAILED') {
      console.error('[APPROVAL_ROUTING_FAILED]', entry.error);
    }
  }

  getRoutingLog() {
    return this.routing_log;
  }
}

module.exports = ApprovalRouter;
