/**
 * Dossier Delta Manager
 * Coordinates append-only dossier mutations and preserves version/audit integrity.
 */

const DossierWriter = require('./dossier_writer');
const DossierReader = require('./dossier_reader');

class DossierDeltaManager {
  constructor(config = {}) {
    this.writer = new DossierWriter(config);
    this.reader = new DossierReader(config);

    this.namespaceOwnershipMap = {
      discovery: { workflow_vein: 'discovery_vein', directors: ['Narada'] },
      qualification: { workflow_vein: 'qualification_vein', directors: ['Chanakya'] },
      scoring: { workflow_vein: 'scoring_vein', directors: ['Krishna'] },
      research: { workflow_vein: 'research_vein', directors: ['Vyasa'] },
      script: { workflow_vein: 'narrative_vein', directors: ['Krishna', 'Saraswati'] },
      context: { workflow_vein: 'context_engineering_vein', directors: ['Krishna', 'Saraswati'] },
      approval: { workflow_vein: 'approval_vein', directors: ['Yama', 'Krishna'] },
      replay: { workflow_vein: 'replay_vein', directors: ['Yama'] },
      runtime: { workflow_vein: 'runtime_vein', directors: ['Saraswati'] },
      media_vein: { workflow_vein: 'media_vein', directors: ['Narada', 'Vyasa', 'Shiva'] },
      script_vein: { workflow_vein: 'script_vein', directors: ['Krishna', 'Saraswati'] },
      research_vein: { workflow_vein: 'research_vein', directors: ['Vyasa', 'Brihaspati'] }
    };

    this.deltaQueue = [];
    this.conflictLog = [];
    this.processCounter = 0;
  }

  async processDelta(dossierId, delta) {
    const processId = this.buildProcessId(dossierId, delta);
    this.deltaQueue.push({
      process_id: processId,
      dossier_id: dossierId,
      target_path: delta?.target || null,
      status: 'PENDING',
      timestamp: new Date().toISOString()
    });

    try {
      this.validateNamespaceOwnership(delta);
      this.validateAuditMetadata(delta);
      this.checkForConflicts(dossierId, delta, processId);

      const currentDossier = await this.reader.readDossier(dossierId);
      this.validatePatchOnly(currentDossier.data, delta);

      const result = await this.writer.writeDelta(dossierId, delta);
      this.markQueueStatus(processId, 'COMPLETED');

      return {
        process_id: processId,
        status: 'SUCCESS',
        mutation_result: result
      };
    } catch (error) {
      const routed = this.buildRoutedError(`Delta processing failed: ${error.message}`);
      this.markQueueStatus(processId, 'FAILED', routed.message);
      throw routed;
    }
  }

  async processBatch(dossierId, deltas) {
    const batchId = `BATCH-${dossierId}-${Date.now()}`;
    const results = [];

    for (const delta of deltas) {
      try {
        const result = await this.processDelta(dossierId, delta);
        results.push(result);
      } catch (error) {
        return {
          batch_id: batchId,
          status: 'FAILED_PARTIAL',
          deltas_processed: results.length,
          deltas_total: deltas.length,
          error: error.message,
          next_workflow: 'WF-900',
          results
        };
      }
    }

    return {
      batch_id: batchId,
      status: 'SUCCESS',
      deltas_processed: deltas.length,
      results
    };
  }

  validateNamespaceOwnership(delta) {
    const namespace = delta?.namespace;
    if (!this.namespaceOwnershipMap[namespace]) {
      throw new Error(
        `Namespace "${namespace}" not recognized. Allowed: ${Object.keys(this.namespaceOwnershipMap).join(', ')}`
      );
    }
  }

  validateAuditMetadata(delta) {
    const required = [
      'timestamp',
      'writer_id',
      'skill_id',
      'instance_id',
      'schema_version',
      'lineage_reference',
      'audit_entry'
    ];
    const missing = required.filter((k) => !(k in (delta || {})));
    if (missing.length > 0) {
      throw new Error(`Delta missing required mutation metadata: ${missing.join(', ')}`);
    }
  }

  checkForConflicts(dossierId, delta, processId) {
    const targetPath = delta.target;
    const conflicting = this.deltaQueue.filter(
      (d) =>
        d.process_id !== processId &&
        d.dossier_id === dossierId &&
        d.status === 'PENDING' &&
        d.target_path === targetPath
    );

    if (conflicting.length > 0) {
      this.conflictLog.push({
        conflict_id: `CONF-${Date.now()}-${this.conflictLog.length + 1}`,
        dossier_id: dossierId,
        target_path: targetPath,
        pending_operations: conflicting.length,
        resolution: 'QUEUED_FOR_SEQUENTIAL_EXECUTION'
      });
    }
  }

  validatePatchOnly(dossier, delta) {
    const parts = String(delta.target || '').split('.');
    let current = dossier;

    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i];
      if (part in current) {
        current = current[part];
      } else {
        current = {};
        break;
      }
    }

    const finalKey = parts[parts.length - 1];
    const exists = Object.prototype.hasOwnProperty.call(current, finalKey);

    if (delta.mutation_type === 'append_to_array' || delta.mutation_type === 'create_new_index_row') {
      if (exists && !Array.isArray(current[finalKey])) {
        throw new Error(`Cannot append to non-array: ${delta.target}`);
      }
      return;
    }

    if (delta.mutation_type === 'create_new_packet' && exists) {
      throw new Error(`Cannot overwrite existing field: ${delta.target}. Use append-only mutations.`);
    }
  }

  markQueueStatus(processId, status, errorMessage = null) {
    const row = this.deltaQueue.find((d) => d.process_id === processId);
    if (!row) return;
    row.status = status;
    row.completed_at = new Date().toISOString();
    if (errorMessage) {
      row.error = errorMessage;
      row.route_to_workflow = 'WF-900';
    }
  }

  async getMutationHistory(dossierId) {
    return this.reader.getAuditTrail(dossierId);
  }

  async verifyConsistency(dossierId) {
    try {
      const lineageCheck = await this.reader.verifyLineageIntegrity(dossierId);
      const auditTrail = await this.reader.getAuditTrail(dossierId);

      const ownershipViolations = [];
      for (const entry of auditTrail.audit_trail) {
        if (!this.namespaceOwnershipMap[entry.namespace]) {
          ownershipViolations.push({
            mutation_id: entry.mutation_id,
            namespace: entry.namespace,
            issue: 'namespace_not_recognized'
          });
        }
      }

      return {
        dossier_id: dossierId,
        consistency_ok: lineageCheck.integrity_ok && ownershipViolations.length === 0,
        lineage_integrity: lineageCheck.integrity_ok,
        ownership_violations: ownershipViolations,
        total_mutations: auditTrail.total_mutations
      };
    } catch (error) {
      throw this.buildRoutedError(`Consistency verification failed: ${error.message}`);
    }
  }

  getDeltaQueueStatus() {
    const pending = this.deltaQueue.filter((d) => d.status === 'PENDING').length;
    const completed = this.deltaQueue.filter((d) => d.status === 'COMPLETED').length;
    const failed = this.deltaQueue.filter((d) => d.status === 'FAILED').length;
    return {
      queue_length: this.deltaQueue.length,
      pending,
      completed,
      failed,
      conflicts_detected: this.conflictLog.length
    };
  }

  getConflictLog() {
    return this.conflictLog;
  }

  buildProcessId(dossierId, delta) {
    this.processCounter += 1;
    const base = `${dossierId}|${delta?.target || ''}|${this.processCounter}`;
    let hash = 2166136261;
    for (let i = 0; i < base.length; i += 1) {
      hash ^= base.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return `PROC-${(hash >>> 0).toString(16).padStart(8, '0')}`;
  }

  buildRoutedError(message) {
    const error = new Error(message);
    error.route_to_workflow = 'WF-900';
    return error;
  }
}

module.exports = DossierDeltaManager;
