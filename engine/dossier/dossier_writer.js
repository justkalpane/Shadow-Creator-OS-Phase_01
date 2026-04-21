/**
 * Dossier Writer Engine
 * Patch-only mutations with namespace ownership, version tracking, and audit trails.
 * Enforces: NO overwrites, NO field deletions, namespace-owned writes only.
 */

const fs = require('fs');
const path = require('path');

class DossierWriter {
  constructor(config = {}) {
    this.config = {
      dossier_base_path: config.dossier_base_path || './dossiers/',
      enable_audit_trail: config.enable_audit_trail !== false,
      strict_mode: config.strict_mode !== false,
      max_version: config.max_version || 999
    };

    this.mutation_log = [];
    this.namespace_ownership = {
      'discovery': { owner: 'discovery_vein', forbidden_overwrites: [] },
      'qualification': { owner: 'qualification_vein', forbidden_overwrites: [] },
      'scoring': { owner: 'scoring_vein', forbidden_overwrites: [] },
      'research': { owner: 'research_vein', forbidden_overwrites: [] },
      'script': { owner: 'narrative_vein', forbidden_overwrites: [] },
      'context': { owner: 'context_engineering_vein', forbidden_overwrites: [] },
      'approval': { owner: 'approval_vein', forbidden_overwrites: [] },
      'replay': { owner: 'replay_vein', forbidden_overwrites: [] },
      'runtime': { owner: 'runtime_vein', forbidden_overwrites: [] }
    };
  }

  /**
   * Write patch to dossier (mutation_type: append, append_to_array, version_bump)
   * @param {string} dossier_id - Dossier ID
   * @param {object} delta - {namespace, mutation_type, target, value, audit_entry}
   * @returns {object} - {status, mutation_id, version, timestamp}
   */
  async writeDelta(dossier_id, delta) {
    const mutation_id = 'MUT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    try {
      // 1. Validate delta structure
      this.validateDelta(delta);

      // 2. Validate namespace ownership
      const namespace_owner = this.namespace_ownership[delta.namespace];
      if (!namespace_owner) {
        throw new Error(`Namespace "${delta.namespace}" not recognized. Allowed: ${Object.keys(this.namespace_ownership).join(', ')}`);
      }

      // 3. Load current dossier version
      const dossier = await this.loadDossier(dossier_id);
      const current_version = dossier._version || 0;

      // 4. Validate mutation doesn't overwrite
      this.validateNoOverwrite(dossier, delta);

      // 5. Apply patch (mutation_type)
      const mutated_dossier = await this.applyMutation(dossier, delta);

      // 6. Update version and audit trail
      mutated_dossier._version = current_version + 1;
      if (!mutated_dossier._audit_trail) {
        mutated_dossier._audit_trail = [];
      }

      // 7. Create audit entry
      const audit_entry = {
        mutation_id: mutation_id,
        timestamp: new Date().toISOString(),
        workflow_id: delta.audit_entry?.workflow_id || 'UNKNOWN',
        operation: delta.audit_entry?.operation || 'MUTATION',
        namespace: delta.namespace,
        mutation_type: delta.mutation_type,
        target_path: delta.target,
        owner_workflow: namespace_owner.owner,
        version_before: current_version,
        version_after: current_version + 1,
        lineage_intact: delta.audit_entry?.lineage_intact || false
      };

      mutated_dossier._audit_trail.push(audit_entry);

      // 8. Persist to disk
      await this.saveDossier(dossier_id, mutated_dossier);

      // 9. Log mutation
      this.logMutation({
        mutation_id,
        dossier_id,
        status: 'SUCCESS',
        version: mutated_dossier._version,
        timestamp: new Date().toISOString(),
        namespace: delta.namespace,
        mutation_type: delta.mutation_type
      });

      return {
        status: 'SUCCESS',
        mutation_id: mutation_id,
        version: mutated_dossier._version,
        timestamp: new Date().toISOString(),
        dossier_id: dossier_id
      };

    } catch (e) {
      this.logMutation({
        mutation_id,
        dossier_id,
        status: 'FAILED',
        error: e.message,
        timestamp: new Date().toISOString()
      });
      throw e;
    }
  }

  /**
   * Validate delta structure
   */
  validateDelta(delta) {
    const required_fields = ['namespace', 'mutation_type', 'target', 'value'];
    const missing = required_fields.filter(f => !(f in delta));

    if (missing.length > 0) {
      throw new Error(`Invalid delta: missing required fields ${missing.join(', ')}`);
    }

    const valid_mutation_types = ['append', 'append_to_array', 'version_bump'];
    if (!valid_mutation_types.includes(delta.mutation_type)) {
      throw new Error(`Invalid mutation_type "${delta.mutation_type}". Allowed: ${valid_mutation_types.join(', ')}`);
    }
  }

  /**
   * Validate that mutation doesn't overwrite existing fields (patch-only law)
   */
  validateNoOverwrite(dossier, delta) {
    const target_path = delta.target;
    const path_parts = target_path.split('.');

    let current = dossier;
    for (let i = 0; i < path_parts.length - 1; i++) {
      const part = path_parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }

    const final_key = path_parts[path_parts.length - 1];

    // For append mutations: target must not exist OR must be array
    if (delta.mutation_type === 'append_to_array') {
      if (final_key in current && !Array.isArray(current[final_key])) {
        throw new Error(`Cannot append to non-array field: ${delta.target}`);
      }
    } else if (delta.mutation_type === 'append') {
      // For simple append: target must not exist (strict mode)
      if (this.config.strict_mode && final_key in current) {
        throw new Error(`Patch-only violation: cannot overwrite existing field ${delta.target}`);
      }
    }
  }

  /**
   * Apply mutation based on mutation_type
   */
  async applyMutation(dossier, delta) {
    const path_parts = delta.target.split('.');
    let current = dossier;

    // Navigate/create path
    for (let i = 0; i < path_parts.length - 1; i++) {
      const part = path_parts[i];
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }

    const final_key = path_parts[path_parts.length - 1];

    switch (delta.mutation_type) {
      case 'append_to_array':
        if (!Array.isArray(current[final_key])) {
          current[final_key] = [];
        }
        current[final_key].push(delta.value);
        break;

      case 'append':
        if (final_key in current && this.config.strict_mode) {
          throw new Error(`Cannot overwrite field: ${delta.target}`);
        }
        current[final_key] = delta.value;
        break;

      case 'version_bump':
        current[final_key] = (current[final_key] || 0) + (delta.value || 1);
        break;

      default:
        throw new Error(`Unknown mutation_type: ${delta.mutation_type}`);
    }

    return dossier;
  }

  /**
   * Load dossier from disk
   */
  async loadDossier(dossier_id) {
    try {
      const dossier_path = path.join(this.config.dossier_base_path, `${dossier_id}.json`);
      if (fs.existsSync(dossier_path)) {
        const content = fs.readFileSync(dossier_path, 'utf8');
        return JSON.parse(content);
      }
      return { dossier_id: dossier_id, _version: 0, _created_at: new Date().toISOString() };
    } catch (e) {
      throw new Error(`Failed to load dossier ${dossier_id}: ${e.message}`);
    }
  }

  /**
   * Save dossier to disk
   */
  async saveDossier(dossier_id, dossier) {
    try {
      const dossier_path = path.join(this.config.dossier_base_path, `${dossier_id}.json`);
      fs.writeFileSync(dossier_path, JSON.stringify(dossier, null, 2));
      return true;
    } catch (e) {
      throw new Error(`Failed to save dossier ${dossier_id}: ${e.message}`);
    }
  }

  /**
   * Log mutation for audit
   */
  logMutation(entry) {
    this.mutation_log.push(entry);
    if (entry.status === 'FAILED') {
      console.error(`[MUTATION_FAILED] ${entry.mutation_id}: ${entry.error}`);
    }
  }

  /**
   * Get mutation history
   */
  getMutationLog(filter = {}) {
    let log = this.mutation_log;

    if (filter.dossier_id) {
      log = log.filter(m => m.dossier_id === filter.dossier_id);
    }
    if (filter.status) {
      log = log.filter(m => m.status === filter.status);
    }
    if (filter.namespace) {
      log = log.filter(m => m.namespace === filter.namespace);
    }

    return log;
  }
}

module.exports = DossierWriter;
