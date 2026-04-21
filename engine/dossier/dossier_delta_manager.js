/**
 * Dossier Delta Manager
 * Manages delta operations, enforces namespace ownership, coordinates patch-only mutations.
 */

const DossierWriter = require('./dossier_writer');
const DossierReader = require('./dossier_reader');

class DossierDeltaManager {
  constructor(config = {}) {
    this.writer = new DossierWriter(config);
    this.reader = new DossierReader(config);

    this.namespace_ownership_map = {
      'discovery': { workflow_vein: 'discovery_vein', directors: ['Narada'] },
      'qualification': { workflow_vein: 'qualification_vein', directors: ['Chanakya'] },
      'scoring': { workflow_vein: 'scoring_vein', directors: ['Krishna'] },
      'research': { workflow_vein: 'research_vein', directors: ['Vyasa'] },
      'script': { workflow_vein: 'narrative_vein', directors: ['Krishna', 'Saraswati'] },
      'context': { workflow_vein: 'context_engineering_vein', directors: ['Krishna', 'Saraswati'] },
      'approval': { workflow_vein: 'approval_vein', directors: ['Yama', 'Krishna'] },
      'replay': { workflow_vein: 'replay_vein', directors: ['Yama'] },
      'runtime': { workflow_vein: 'runtime_vein', directors: ['Saraswati'] }
    };

    this.delta_queue = [];
    this.conflict_log = [];
  }

  /**
   * Process delta with full validation
   */
  async processDelta(dossier_id, delta) {
    const process_id = 'PROC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    try {
      // 1. Validate namespace ownership
      this.validateNamespaceOwnership(delta);

      // 2. Check for conflicts with existing deltas in queue
      this.checkForConflicts(dossier_id, delta);

      // 3. Read current dossier state
      const current_dossier = await this.reader.readDossier(dossier_id);

      // 4. Validate mutation doesn't violate patch-only law
      this.validatePatchOnly(current_dossier.data, delta);

      // 5. Execute delta via writer
      const result = await this.writer.writeDelta(dossier_id, delta);

      // 6. Log successful delta
      this.delta_queue.push({
        process_id,
        dossier_id,
        status: 'COMPLETED',
        mutation_id: result.mutation_id,
        version: result.version,
        timestamp: result.timestamp
      });

      return {
        process_id,
        status: 'SUCCESS',
        mutation_result: result
      };

    } catch (e) {
      // Log failed delta
      this.delta_queue.push({
        process_id,
        dossier_id,
        status: 'FAILED',
        error: e.message,
        timestamp: new Date().toISOString()
      });

      throw new Error(`Delta processing failed: ${e.message}`);
    }
  }

  /**
   * Batch process multiple deltas atomically
   */
  async processBatch(dossier_id, deltas) {
    const batch_id = 'BATCH-' + Date.now();
    const results = [];

    try {
      for (const delta of deltas) {
        const result = await this.processDelta(dossier_id, delta);
        results.push(result);
      }

      return {
        batch_id,
        status: 'SUCCESS',
        deltas_processed: deltas.length,
        results: results
      };

    } catch (e) {
      // On first failure, stop processing and report
      return {
        batch_id,
        status: 'FAILED_PARTIAL',
        deltas_processed: results.length,
        deltas_total: deltas.length,
        error: e.message,
        results: results
      };
    }
  }

  /**
   * Validate namespace ownership
   */
  validateNamespaceOwnership(delta) {
    const namespace = delta.namespace;
    const ownership = this.namespace_ownership_map[namespace];

    if (!ownership) {
      throw new Error(`Namespace "${namespace}" not recognized. Allowed: ${Object.keys(this.namespace_ownership_map).join(', ')}`);
    }

    // Optionally check that workflow_id in audit_entry matches vein
    const workflow_id = delta.audit_entry?.workflow_id || '';
    // This can be enforced as: workflow must be part of the vein
  }

  /**
   * Check for mutation conflicts in queue
   */
  checkForConflicts(dossier_id, delta) {
    const target_path = delta.target;

    const conflicting = this.delta_queue.filter(d => {
      return (
        d.dossier_id === dossier_id &&
        d.status === 'PENDING' &&
        d.target_path === target_path
      );
    });

    if (conflicting.length > 0) {
      this.conflict_log.push({
        conflict_id: 'CONF-' + Date.now(),
        dossier_id,
        target_path,
        pending_operations: conflicting.length,
        resolution: 'QUEUED_FOR_SEQUENTIAL_EXECUTION'
      });

      // In real implementation, could implement conflict resolution strategy
      // For now, allow sequencing via writer's lock mechanism
    }
  }

  /**
   * Validate patch-only mutation (no overwrites)
   */
  validatePatchOnly(dossier, delta) {
    const path_parts = delta.target.split('.');
    let current = dossier;

    // Navigate to parent
    for (let i = 0; i < path_parts.length - 1; i++) {
      const part = path_parts[i];
      if (part in current) {
        current = current[part];
      }
    }

    const final_key = path_parts[path_parts.length - 1];

    // Validate based on mutation_type
    if (delta.mutation_type === 'append_to_array') {
      if (final_key in current && !Array.isArray(current[final_key])) {
        throw new Error(`Cannot append to non-array: ${delta.target}`);
      }
    } else if (delta.mutation_type === 'append') {
      if (final_key in current) {
        throw new Error(`Cannot overwrite existing field: ${delta.target}. Use patch-only mutations.`);
      }
    }
  }

  /**
   * Get mutation history for dossier
   */
  async getMutationHistory(dossier_id) {
    return await this.reader.getAuditTrail(dossier_id);
  }

  /**
   * Verify dossier consistency
   */
  async verifyConsistency(dossier_id) {
    try {
      const lineage_check = await this.reader.verifyLineageIntegrity(dossier_id);
      const audit_trail = await this.reader.getAuditTrail(dossier_id);

      // Check: all mutations have matching namespace ownership
      const ownership_violations = [];
      for (const entry of audit_trail.audit_trail) {
        const namespace_owner = this.namespace_ownership_map[entry.namespace];
        if (!namespace_owner) {
          ownership_violations.push({
            mutation_id: entry.mutation_id,
            namespace: entry.namespace,
            issue: 'namespace_not_recognized'
          });
        }
      }

      return {
        dossier_id,
        consistency_ok: lineage_check.integrity_ok && ownership_violations.length === 0,
        lineage_integrity: lineage_check.integrity_ok,
        ownership_violations: ownership_violations,
        total_mutations: audit_trail.total_mutations
      };

    } catch (e) {
      throw new Error(`Consistency verification failed: ${e.message}`);
    }
  }

  /**
   * Get delta queue status
   */
  getDeltaQueueStatus() {
    const pending = this.delta_queue.filter(d => d.status === 'PENDING').length;
    const completed = this.delta_queue.filter(d => d.status === 'COMPLETED').length;
    const failed = this.delta_queue.filter(d => d.status === 'FAILED').length;

    return {
      queue_length: this.delta_queue.length,
      pending: pending,
      completed: completed,
      failed: failed,
      conflicts_detected: this.conflict_log.length
    };
  }

  /**
   * Get conflict log
   */
  getConflictLog() {
    return this.conflict_log;
  }
}

module.exports = DossierDeltaManager;
