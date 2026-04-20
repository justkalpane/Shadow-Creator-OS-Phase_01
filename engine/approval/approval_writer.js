/**
 * Approval Writer Engine
 * Writes approval requests to se_approval_queue with dossier_ref, decision options, and deadline.
 * Canonical table: se_approval_queue
 */

const fs = require('fs');
const path = require('path');

class ApprovalWriter {
  constructor(config = {}) {
    this.config = {
      queue_path: config.queue_path || './data/se_approval_queue.json',
      default_deadline_hours: config.default_deadline_hours || 24
    };
    this.write_log = [];
  }

  /**
   * Write approval request to queue
   * @param {string} dossier_id
   * @param {object} approval_request - { packet_id, artifact_family, owner_director, decision_options, context }
   * @returns {object} - { status, queue_entry_id }
   */
  async writeApprovalRequest(dossier_id, approval_request) {
    const queue_entry_id = 'APQ-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    try {
      this.validateApprovalRequest(approval_request);

      const queue_entry = {
        queue_entry_id,
        dossier_ref: dossier_id,
        packet_id: approval_request.packet_id,
        artifact_family: approval_request.artifact_family,
        approval_type: approval_request.approval_type || 'SCRIPT_FINAL_APPROVAL',
        owner_director: approval_request.owner_director,
        supporting_directors: approval_request.supporting_directors || [],
        decision_options: approval_request.decision_options || ['APPROVED', 'REJECTED', 'REMODIFY'],
        context: approval_request.context || {},
        status: 'PENDING',
        created_at: new Date().toISOString(),
        deadline: new Date(Date.now() + this.config.default_deadline_hours * 3600000).toISOString(),
        resolved_at: null,
        resolution: null
      };

      await this.appendToQueue(queue_entry);

      this.log({ queue_entry_id, status: 'SUCCESS', dossier_id, artifact_family: approval_request.artifact_family });

      return { status: 'SUCCESS', queue_entry_id, dossier_ref: dossier_id };

    } catch (e) {
      this.log({ queue_entry_id, status: 'FAILED', error: e.message });
      throw e;
    }
  }

  validateApprovalRequest(req) {
    const required = ['packet_id', 'artifact_family', 'owner_director'];
    const missing = required.filter(f => !req[f]);
    if (missing.length > 0) throw new Error(`Approval request missing: ${missing.join(', ')}`);
  }

  async appendToQueue(entry) {
    try {
      let queue = { entries: [], last_updated: null };

      if (fs.existsSync(this.config.queue_path)) {
        queue = JSON.parse(fs.readFileSync(this.config.queue_path, 'utf8'));
      } else {
        const dir = path.dirname(this.config.queue_path);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      }

      queue.entries.push(entry);
      queue.last_updated = new Date().toISOString();
      queue.pending_count = queue.entries.filter(e => e.status === 'PENDING').length;

      fs.writeFileSync(this.config.queue_path, JSON.stringify(queue, null, 2));
    } catch (e) {
      throw new Error(`Failed to write approval queue: ${e.message}`);
    }
  }

  async getPendingApprovals(dossier_id = null) {
    const queue = await this.loadQueue();
    let pending = queue.entries.filter(e => e.status === 'PENDING');
    if (dossier_id) pending = pending.filter(e => e.dossier_ref === dossier_id);
    return pending;
  }

  async loadQueue() {
    if (!fs.existsSync(this.config.queue_path)) return { entries: [] };
    return JSON.parse(fs.readFileSync(this.config.queue_path, 'utf8'));
  }

  log(entry) {
    this.write_log.push({ ...entry, timestamp: new Date().toISOString() });
    if (entry.status === 'FAILED') console.error('[APPROVAL_WRITE_FAILED]', entry.error);
  }

  getWriteLog() { return this.write_log; }
}

module.exports = ApprovalWriter;
