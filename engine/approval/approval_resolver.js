/**
 * Approval Resolver Engine
 * Appends immutable resolution records for approval queue entries.
 */

const fs = require('fs');
const path = require('path');

class ApprovalResolver {
  constructor(config = {}) {
    this.config = {
      queue_path: config.queue_path || './data/se_approval_queue.json',
      strict_mode: config.strict_mode !== false
    };

    this.resolution_log = [];
    this.resolution_counter = 0;
  }

  async resolveDecision(queueEntryId, decision, resolvedBy, resolutionContext = {}) {
    const resolutionId = this.buildResolutionId(queueEntryId, decision);

    try {
      this.validateDecision(decision);

      const queue = await this.loadQueue();
      const entry = queue.entries.find((row) => row.queue_entry_id === queueEntryId);
      if (!entry) {
        throw new Error(`Queue entry not found: ${queueEntryId}`);
      }

      if (this.entryAlreadyResolved(queueEntryId, queue.resolutions)) {
        throw new Error(`Queue entry already resolved: ${queueEntryId}`);
      }

      const routingAction = this.determineRoutingAction(decision, entry, resolutionContext);
      const metadata = this.resolveMutationMetadata(entry, decision, resolvedBy, resolutionContext);
      this.validateMutationMetadata(metadata);

      const resolutionRow = {
        resolution_id: resolutionId,
        queue_entry_id: queueEntryId,
        decision,
        resolved_by: resolvedBy,
        resolved_at: metadata.timestamp,
        resolution_context: resolutionContext,
        routing_action: routingAction,
        timestamp: metadata.timestamp,
        writer_id: metadata.writer_id,
        skill_id: metadata.skill_id,
        instance_id: metadata.instance_id,
        schema_version: metadata.schema_version,
        lineage_reference: metadata.lineage_reference,
        audit_entry: metadata.audit_entry
      };

      queue.resolutions.push(resolutionRow);
      queue.last_updated = metadata.timestamp;
      queue.pending_count = this.computePendingCount(queue.entries, queue.resolutions);
      await this.saveQueue(queue);

      this.log({
        resolution_id: resolutionId,
        queue_entry_id: queueEntryId,
        decision,
        resolved_by: resolvedBy,
        next_workflow: routingAction.next_workflow
      });

      return {
        status: 'SUCCESS',
        resolution_id: resolutionId,
        queue_entry_id: queueEntryId,
        decision,
        routing_action: routingAction,
        route_to_workflow: null
      };
    } catch (error) {
      const routed = this.buildRoutedError(error.message);
      this.log({
        resolution_id: resolutionId,
        queue_entry_id: queueEntryId,
        status: 'FAILED',
        error: routed.message,
        next_workflow: routed.route_to_workflow
      });
      throw routed;
    }
  }

  validateDecision(decision) {
    const validDecisions = ['APPROVED', 'REJECTED', 'REMODIFY'];
    if (!validDecisions.includes(decision)) {
      throw new Error(`Invalid decision: ${decision}. Must be one of: ${validDecisions.join(', ')}`);
    }
  }

  determineRoutingAction(decision, entry, context) {
    switch (decision) {
      case 'APPROVED':
        return {
          next_workflow: context.next_workflow_on_approved || 'WF-300',
          action: 'PROCEED_TO_MEDIA_PIPELINE',
          dossier_update: {
            namespace: 'approval',
            field: 'final_approval_status',
            value: 'APPROVED'
          }
        };
      case 'REJECTED':
        return {
          next_workflow: 'WF-021',
          action: 'ROUTE_PHASE_REPLAY',
          rejection_reason: context.rejection_reason || 'GENERIC_REJECTION',
          dossier_update: {
            namespace: 'approval',
            field: 'final_approval_status',
            value: 'REJECTED'
          }
        };
      case 'REMODIFY':
        return {
          next_workflow: 'WF-021',
          action: 'ROUTE_REMODIFY_REPLAY',
          modification_guidance: context.notes || 'Director requested modifications.',
          dossier_update: {
            namespace: 'approval',
            field: 'final_approval_status',
            value: 'REMODIFY'
          }
        };
      default:
        return {
          next_workflow: 'WF-900',
          action: 'ESCALATE_UNKNOWN_DECISION'
        };
    }
  }

  resolveMutationMetadata(entry, decision, resolvedBy, context) {
    const auditEntry =
      context.audit_entry ||
      entry.audit_entry || {
        workflow_id: 'WF-020',
        operation: 'append_audit_entry',
        notes: `append approval resolution for ${decision}`
      };

    return {
      timestamp: context.timestamp || new Date().toISOString(),
      writer_id: context.writer_id || resolvedBy,
      skill_id: context.skill_id || entry.skill_id || 'approval_resolver',
      instance_id: context.instance_id || entry.instance_id || entry.packet_id,
      schema_version: context.schema_version || entry.schema_version || '1.0.0',
      lineage_reference: context.lineage_reference || entry.lineage_reference || entry.packet_id,
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
      throw new Error(`Approval resolution missing required metadata: ${missing.join(', ')}`);
    }
    if (typeof metadata.audit_entry !== 'object' || Array.isArray(metadata.audit_entry)) {
      throw new Error('Approval resolution audit_entry must be an object');
    }
  }

  entryAlreadyResolved(queueEntryId, resolutions) {
    if (!Array.isArray(resolutions)) {
      return false;
    }
    return resolutions.some((row) => row.queue_entry_id === queueEntryId);
  }

  computePendingCount(entries, resolutions) {
    const resolvedSet = new Set((resolutions || []).map((row) => row.queue_entry_id));
    return (entries || []).filter(
      (entry) => entry.status === 'PENDING' && !resolvedSet.has(entry.queue_entry_id)
    ).length;
  }

  async getResolvedApprovals(filter = {}) {
    const queue = await this.loadQueue();
    let resolved = Array.isArray(queue.resolutions) ? queue.resolutions : [];

    if (filter.resolution) {
      const expected = String(filter.resolution).toUpperCase();
      resolved = resolved.filter((row) => String(row.decision).toUpperCase() === expected);
    }

    if (filter.dossier_id) {
      const byEntry = new Map(queue.entries.map((entry) => [entry.queue_entry_id, entry]));
      resolved = resolved.filter((row) => byEntry.get(row.queue_entry_id)?.dossier_ref === filter.dossier_id);
    }

    return resolved;
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

  async saveQueue(queue) {
    const targetPath = path.resolve(this.config.queue_path);
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(targetPath, JSON.stringify(queue, null, 2));
  }

  buildResolutionId(queueEntryId, decision) {
    this.resolution_counter += 1;
    const signature = this.stableStringify({
      queue_entry_id: queueEntryId,
      decision,
      sequence: this.resolution_counter
    });
    return `RES-${this.computeHash(signature).slice(0, 12)}`;
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
    this.resolution_log.push({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString()
    });
    if (entry.status === 'FAILED') {
      console.error('[APPROVAL_RESOLUTION_FAILED]', entry.error);
    }
  }

  getResolutionLog() {
    return this.resolution_log;
  }
}

module.exports = ApprovalResolver;
