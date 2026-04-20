/**
 * Approval Resolver Engine
 * Processes director approval decisions. Updates queue entry status and routes to next action.
 */

const fs = require('fs');

class ApprovalResolver {
  constructor(config = {}) {
    this.config = {
      queue_path: config.queue_path || './data/se_approval_queue.json'
    };
    this.resolution_log = [];
  }

  /**
   * Resolve an approval decision
   * @param {string} queue_entry_id - The approval queue entry to resolve
   * @param {string} decision - APPROVED | REJECTED | REMODIFY
   * @param {string} resolved_by - Director name
   * @param {object} resolution_context - { notes, redirect_to, rejection_reason }
   * @returns {object} - { status, routing_action, next_workflow }
   */
  async resolveDecision(queue_entry_id, decision, resolved_by, resolution_context = {}) {
    const resolution_id = 'RES-' + Date.now();

    try {
      const valid_decisions = ['APPROVED', 'REJECTED', 'REMODIFY'];
      if (!valid_decisions.includes(decision)) {
        throw new Error(`Invalid decision: ${decision}. Must be one of: ${valid_decisions.join(', ')}`);
      }

      const queue = await this.loadQueue();
      const entry = queue.entries.find(e => e.queue_entry_id === queue_entry_id);

      if (!entry) throw new Error(`Queue entry not found: ${queue_entry_id}`);
      if (entry.status !== 'PENDING') throw new Error(`Entry ${queue_entry_id} already resolved (status: ${entry.status})`);

      // Update entry
      entry.status = 'RESOLVED';
      entry.resolution = decision;
      entry.resolved_by = resolved_by;
      entry.resolved_at = new Date().toISOString();
      entry.resolution_context = resolution_context;

      // Save updated queue
      await this.saveQueue(queue);

      // Determine routing action
      const routing_action = this.determineRoutingAction(decision, entry, resolution_context);

      this.log({ resolution_id, queue_entry_id, decision, resolved_by, routing_action: routing_action.next_workflow });

      return {
        status: 'SUCCESS',
        resolution_id,
        queue_entry_id,
        decision,
        routing_action
      };

    } catch (e) {
      this.log({ resolution_id, queue_entry_id, status: 'FAILED', error: e.message });
      throw e;
    }
  }

  /**
   * Determine next routing action based on decision
   */
  determineRoutingAction(decision, entry, context) {
    switch (decision) {
      case 'APPROVED':
        return {
          next_workflow: 'WF-300',
          action: 'PROCEED_TO_MEDIA_PIPELINE',
          dossier_update: { namespace: 'approval', field: 'final_approval_status', value: 'APPROVED' }
        };

      case 'REJECTED':
        return {
          next_workflow: 'WF-021',
          action: 'ROUTE_TO_REPLAY',
          rejection_reason: context.rejection_reason || 'GENERIC_REJECTION',
          dossier_update: { namespace: 'approval', field: 'final_approval_status', value: 'REJECTED' }
        };

      case 'REMODIFY':
        return {
          next_workflow: context.redirect_to || 'CWF-230',
          action: 'REMODIFY_AT_STAGE',
          modification_guidance: context.notes || 'Director requested modifications.',
          dossier_update: { namespace: 'approval', field: 'final_approval_status', value: 'REMODIFY' }
        };

      default:
        return { next_workflow: 'WF-900', action: 'ESCALATE_UNKNOWN_DECISION' };
    }
  }

  /**
   * Get all resolved approvals
   */
  async getResolvedApprovals(filter = {}) {
    const queue = await this.loadQueue();
    let resolved = queue.entries.filter(e => e.status === 'RESOLVED');
    if (filter.resolution) resolved = resolved.filter(e => e.resolution === filter.resolution);
    if (filter.dossier_id) resolved = resolved.filter(e => e.dossier_ref === filter.dossier_id);
    return resolved;
  }

  async loadQueue() {
    if (!fs.existsSync(this.config.queue_path)) return { entries: [] };
    return JSON.parse(fs.readFileSync(this.config.queue_path, 'utf8'));
  }

  async saveQueue(queue) {
    queue.last_updated = new Date().toISOString();
    queue.pending_count = queue.entries.filter(e => e.status === 'PENDING').length;
    fs.writeFileSync(this.config.queue_path, JSON.stringify(queue, null, 2));
  }

  log(entry) {
    this.resolution_log.push({ ...entry, timestamp: new Date().toISOString() });
    if (entry.status === 'FAILED') console.error('[APPROVAL_RESOLUTION_FAILED]', entry.error);
  }

  getResolutionLog() { return this.resolution_log; }
}

module.exports = ApprovalResolver;
