/**
 * Approval Writer Engine
 * Appends approval requests to canonical se_approval_queue.
 */

const fs = require('fs');
const path = require('path');

class ApprovalWriter {
  constructor(config = {}) {
    this.config = {
      queue_path: config.queue_path || './data/se_approval_queue.json',
      default_deadline_hours: config.default_deadline_hours || 24,
      strict_mode: config.strict_mode !== false
    };

    this.write_log = [];
    this.write_counter = 0;
  }

  async writeApprovalRequest(dossierId, approvalRequest, mutationMetadata = {}) {
    const queueEntryId = this.buildQueueEntryId(dossierId, approvalRequest);

    try {
      this.validateApprovalRequest(approvalRequest);

      const metadata = this.resolveMutationMetadata(approvalRequest, mutationMetadata);
      this.validateMutationMetadata(metadata);

      const queueEntry = this.buildQueueEntry(queueEntryId, dossierId, approvalRequest, metadata);
      await this.appendToQueue(queueEntry);

      this.log({
        queue_entry_id: queueEntryId,
        status: 'SUCCESS',
        dossier_id: dossierId,
        artifact_family: approvalRequest.artifact_family
      });

      return {
        status: 'SUCCESS',
        queue_entry_id: queueEntryId,
        dossier_ref: dossierId,
        route_to_workflow: null
      };
    } catch (error) {
      const routed = this.buildRoutedError(error.message);
      this.log({
        queue_entry_id: queueEntryId,
        status: 'FAILED',
        error: routed.message,
        route_to_workflow: routed.route_to_workflow
      });
      throw routed;
    }
  }

  buildQueueEntry(queueEntryId, dossierId, approvalRequest, metadata) {
    const createdAt = metadata.timestamp;
    const deadline = new Date(
      new Date(createdAt).getTime() + this.config.default_deadline_hours * 3600000
    ).toISOString();

    return {
      queue_entry_id: queueEntryId,
      dossier_ref: dossierId,
      packet_id: approvalRequest.packet_id,
      artifact_family: approvalRequest.artifact_family,
      approval_type: approvalRequest.approval_type || 'SCRIPT_FINAL_APPROVAL',
      owner_director: approvalRequest.owner_director,
      supporting_directors: Array.isArray(approvalRequest.supporting_directors)
        ? approvalRequest.supporting_directors
        : [],
      decision_options: Array.isArray(approvalRequest.decision_options)
        ? approvalRequest.decision_options
        : ['APPROVED', 'REJECTED', 'REMODIFY'],
      context: approvalRequest.context || {},
      status: 'PENDING',
      created_at: createdAt,
      deadline,
      timestamp: metadata.timestamp,
      writer_id: metadata.writer_id,
      skill_id: metadata.skill_id,
      instance_id: metadata.instance_id,
      schema_version: metadata.schema_version,
      lineage_reference: metadata.lineage_reference,
      audit_entry: metadata.audit_entry
    };
  }

  validateApprovalRequest(request) {
    const required = ['packet_id', 'artifact_family', 'owner_director'];
    const missing = required.filter((field) => !(field in (request || {})) || !request[field]);
    if (missing.length > 0) {
      throw new Error(`Approval request missing required fields: ${missing.join(', ')}`);
    }
  }

  resolveMutationMetadata(approvalRequest, provided) {
    const requestMeta = approvalRequest.mutation_metadata || {};
    const auditEntry =
      provided.audit_entry ||
      requestMeta.audit_entry ||
      approvalRequest.audit_entry || {
        workflow_id: approvalRequest.producer_workflow || 'WF-020',
        operation: 'create_new_packet',
        notes: 'append approval queue entry'
      };

    return {
      timestamp: provided.timestamp || requestMeta.timestamp || new Date().toISOString(),
      writer_id:
        provided.writer_id ||
        requestMeta.writer_id ||
        approvalRequest.writer_id ||
        approvalRequest.owner_director,
      skill_id:
        provided.skill_id ||
        requestMeta.skill_id ||
        approvalRequest.skill_id ||
        'approval_writer',
      instance_id:
        provided.instance_id ||
        requestMeta.instance_id ||
        approvalRequest.instance_id ||
        approvalRequest.packet_id,
      schema_version:
        provided.schema_version ||
        requestMeta.schema_version ||
        approvalRequest.schema_version ||
        '1.0.0',
      lineage_reference:
        provided.lineage_reference ||
        requestMeta.lineage_reference ||
        approvalRequest.lineage_reference ||
        approvalRequest.packet_id,
      audit_entry: auditEntry
    };
  }

  validateMutationMetadata(metadata) {
    const required = [
      'timestamp',
      'writer_id',
      'skill_id',
      'instance_id',
      'schema_version',
      'lineage_reference',
      'audit_entry'
    ];
    const missing = required.filter((field) => !(field in metadata) || !metadata[field]);
    if (missing.length > 0) {
      throw new Error(`Approval write missing required metadata: ${missing.join(', ')}`);
    }

    if (typeof metadata.audit_entry !== 'object' || Array.isArray(metadata.audit_entry)) {
      throw new Error('Approval write audit_entry must be an object');
    }
  }

  async appendToQueue(entry) {
    const queue = await this.loadQueue();
    if (!Array.isArray(queue.entries)) {
      throw new Error('Invalid queue format: entries must be an array');
    }

    const duplicate = queue.entries.find((row) => row.queue_entry_id === entry.queue_entry_id);
    if (duplicate) {
      throw new Error(`Duplicate queue entry id: ${entry.queue_entry_id}`);
    }

    queue.entries.push(entry);
    queue.last_updated = entry.timestamp;
    queue.pending_count = queue.entries.filter((row) => row.status === 'PENDING').length;

    const targetPath = path.resolve(this.config.queue_path);
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(targetPath, JSON.stringify(queue, null, 2));
  }

  async getPendingApprovals(dossierId = null) {
    const queue = await this.loadQueue();
    const resolutions = Array.isArray(queue.resolutions) ? queue.resolutions : [];
    const resolvedSet = new Set(resolutions.map((row) => row.queue_entry_id));

    let pending = queue.entries.filter(
      (entry) => entry.status === 'PENDING' && !resolvedSet.has(entry.queue_entry_id)
    );

    if (dossierId) {
      pending = pending.filter((entry) => entry.dossier_ref === dossierId);
    }
    return pending;
  }

  async loadQueue() {
    const targetPath = path.resolve(this.config.queue_path);
    if (!fs.existsSync(targetPath)) {
      return { entries: [], resolutions: [], pending_count: 0, last_updated: null };
    }
    const parsed = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    return {
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      resolutions: Array.isArray(parsed.resolutions) ? parsed.resolutions : [],
      pending_count: Number(parsed.pending_count || 0),
      last_updated: parsed.last_updated || null
    };
  }

  buildQueueEntryId(dossierId, approvalRequest) {
    this.write_counter += 1;
    const signature = this.stableStringify({
      dossier_id: dossierId || 'UNKNOWN_DOSSIER',
      packet_id: approvalRequest?.packet_id || 'UNKNOWN_PACKET',
      artifact_family: approvalRequest?.artifact_family || 'UNKNOWN_FAMILY',
      sequence: this.write_counter
    });
    return `APQ-${this.computeHash(signature).slice(0, 12)}`;
  }

  computeHash(text) {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  stableStringify(value) {
    if (value === null || typeof value !== 'object') {
      return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
      return `[${value.map((item) => this.stableStringify(item)).join(',')}]`;
    }
    const keys = Object.keys(value).sort();
    const pairs = keys.map((key) => `${JSON.stringify(key)}:${this.stableStringify(value[key])}`);
    return `{${pairs.join(',')}}`;
  }

  buildRoutedError(message) {
    const error = new Error(message);
    error.route_to_workflow = 'WF-900';
    return error;
  }

  log(entry) {
    this.write_log.push({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString()
    });
    if (entry.status === 'FAILED') {
      console.error('[APPROVAL_WRITE_FAILED]', entry.error);
    }
  }

  getWriteLog() {
    return this.write_log;
  }
}

module.exports = ApprovalWriter;
