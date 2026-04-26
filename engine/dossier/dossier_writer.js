/**
 * Dossier Writer Engine
 * Enforces append-only mutation law and audit metadata completeness.
 */

const fs = require('fs');
const path = require('path');

class DossierWriter {
  constructor(config = {}) {
    this.config = {
      dossier_base_path: config.dossier_base_path || './dossiers',
      strict_mode: config.strict_mode !== false
    };

    this.mutation_log = [];
    this.mutation_counter = 0;
    this.namespace_ownership = {
      discovery: { owner: 'discovery_vein' },
      qualification: { owner: 'qualification_vein' },
      scoring: { owner: 'scoring_vein' },
      research: { owner: 'research_vein' },
      script: { owner: 'narrative_vein' },
      context: { owner: 'context_engineering_vein' },
      approval: { owner: 'approval_vein' },
      replay: { owner: 'replay_vein' },
      runtime: { owner: 'runtime_vein' },
      media: { owner: 'media_vein' },
      publishing: { owner: 'publishing_vein' },
      media_vein: { owner: 'media_vein' },
      script_vein: { owner: 'script_vein' },
      research_vein: { owner: 'research_vein' }
    };
    this.allowedMutationTypes = new Set([
      'append_to_array',
      'create_new_packet',
      'create_new_index_row',
      'append_audit_entry'
    ]);
  }

  async writeDelta(dossierId, delta) {
    const mutationId = this.buildMutationId(dossierId, delta);

    try {
      this.validateDelta(delta);
      this.validateNamespaceOwnership(delta.namespace);

      const dossier = await this.loadDossier(dossierId);
      const currentVersion = Number(dossier._version || 0);

      this.validateNoOverwrite(dossier, delta);
      const mutated = this.applyMutation(dossier, delta);

      mutated._version = currentVersion + 1;
      if (!Array.isArray(mutated._audit_trail)) {
        mutated._audit_trail = [];
      }

      const auditEntry = {
        mutation_id: mutationId,
        timestamp: delta.timestamp,
        workflow_id: delta.audit_entry?.workflow_id || delta.writer_id || 'UNKNOWN',
        operation: delta.audit_entry?.operation || delta.mutation_type,
        namespace: delta.namespace,
        mutation_type: delta.mutation_type,
        target_path: delta.target,
        owner_workflow: this.namespace_ownership[delta.namespace].owner,
        version_before: currentVersion,
        version_after: currentVersion + 1,
        lineage_intact: true,
        writer_id: delta.writer_id,
        skill_id: delta.skill_id,
        instance_id: delta.instance_id,
        schema_version: delta.schema_version,
        lineage_reference: delta.lineage_reference
      };
      mutated._audit_trail.push(auditEntry);

      await this.saveDossier(dossierId, mutated);

      this.logMutation({
        mutation_id: mutationId,
        dossier_id: dossierId,
        status: 'SUCCESS',
        version: mutated._version,
        namespace: delta.namespace,
        mutation_type: delta.mutation_type,
        route_to_workflow: null
      });

      return {
        status: 'SUCCESS',
        mutation_id: mutationId,
        version: mutated._version,
        timestamp: delta.timestamp,
        dossier_id: dossierId
      };
    } catch (error) {
      const routed = this.buildRoutedError(error.message);
      this.logMutation({
        mutation_id: mutationId,
        dossier_id: dossierId,
        status: 'FAILED',
        error: routed.message,
        route_to_workflow: routed.route_to_workflow
      });
      throw routed;
    }
  }

  validateDelta(delta) {
    const required = [
      'namespace',
      'mutation_type',
      'target',
      'value',
      'timestamp',
      'writer_id',
      'skill_id',
      'instance_id',
      'schema_version',
      'lineage_reference',
      'audit_entry'
    ];

    const missing = required.filter((f) => !(f in (delta || {})));
    if (missing.length > 0) {
      throw new Error(`Invalid delta: missing required fields ${missing.join(', ')}`);
    }

    if (!this.allowedMutationTypes.has(delta.mutation_type)) {
      throw new Error(
        `Invalid mutation_type "${delta.mutation_type}". Allowed: ${Array.from(this.allowedMutationTypes).join(', ')}`
      );
    }
  }

  validateNamespaceOwnership(namespace) {
    if (!this.namespace_ownership[namespace]) {
      throw new Error(
        `Namespace "${namespace}" not recognized. Allowed: ${Object.keys(this.namespace_ownership).join(', ')}`
      );
    }
  }

  validateNoOverwrite(dossier, delta) {
    const { parent, finalKey, exists } = this.resolvePath(dossier, delta.target, true);

    if (delta.mutation_type === 'append_to_array' || delta.mutation_type === 'create_new_index_row') {
      if (exists && !Array.isArray(parent[finalKey])) {
        throw new Error(`Cannot append to non-array field: ${delta.target}`);
      }
      return;
    }

    if (delta.mutation_type === 'create_new_packet' && exists) {
      throw new Error(`Patch-only violation: cannot overwrite existing field ${delta.target}`);
    }
  }

  applyMutation(dossier, delta) {
    const { parent, finalKey } = this.resolvePath(dossier, delta.target, true);

    switch (delta.mutation_type) {
      case 'append_to_array':
        if (!Array.isArray(parent[finalKey])) {
          parent[finalKey] = [];
        }
        parent[finalKey].push(delta.value);
        break;
      case 'create_new_packet':
        parent[finalKey] = delta.value;
        break;
      case 'create_new_index_row':
        if (!Array.isArray(parent[finalKey])) {
          parent[finalKey] = [];
        }
        parent[finalKey].push(delta.value);
        break;
      case 'append_audit_entry':
        if (!Array.isArray(parent[finalKey])) {
          parent[finalKey] = [];
        }
        parent[finalKey].push(delta.value);
        break;
      default:
        throw new Error(`Unknown mutation_type: ${delta.mutation_type}`);
    }

    return dossier;
  }

  resolvePath(root, targetPath, createMissing = false) {
    const pathParts = String(targetPath || '').split('.');
    if (pathParts.length === 0 || !pathParts[0]) {
      throw new Error(`Invalid target path: ${targetPath}`);
    }

    let current = root;
    for (let i = 0; i < pathParts.length - 1; i += 1) {
      const part = pathParts[i];
      if (!(part in current)) {
        if (!createMissing) {
          return { parent: null, finalKey: null, exists: false };
        }
        current[part] = {};
      }
      if (typeof current[part] !== 'object' || current[part] === null || Array.isArray(current[part])) {
        if (!createMissing) {
          return { parent: null, finalKey: null, exists: false };
        }
        throw new Error(`Cannot navigate through non-object segment "${part}" in ${targetPath}`);
      }
      current = current[part];
    }

    const finalKey = pathParts[pathParts.length - 1];
    return { parent: current, finalKey, exists: Object.prototype.hasOwnProperty.call(current, finalKey) };
  }

  async loadDossier(dossierId) {
    try {
      const dossierPath = path.join(this.config.dossier_base_path, `${dossierId}.json`);
      if (!fs.existsSync(dossierPath)) {
        return { dossier_id: dossierId, _version: 0, _created_at: new Date().toISOString(), _audit_trail: [] };
      }
      return JSON.parse(fs.readFileSync(dossierPath, 'utf8'));
    } catch (error) {
      throw new Error(`Failed to load dossier ${dossierId}: ${error.message}`);
    }
  }

  async saveDossier(dossierId, dossier) {
    try {
      const dossierPath = path.join(this.config.dossier_base_path, `${dossierId}.json`);
      const dir = path.dirname(dossierPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(dossierPath, JSON.stringify(dossier, null, 2));
      return true;
    } catch (error) {
      throw new Error(`Failed to save dossier ${dossierId}: ${error.message}`);
    }
  }

  buildMutationId(dossierId, delta) {
    this.mutation_counter += 1;
    const signature = `${dossierId}|${delta?.target || ''}|${delta?.instance_id || ''}|${this.mutation_counter}`;
    let hash = 2166136261;
    for (let i = 0; i < signature.length; i += 1) {
      hash ^= signature.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return `MUT-${(hash >>> 0).toString(16).padStart(8, '0')}`;
  }

  buildRoutedError(message) {
    const error = new Error(message);
    error.route_to_workflow = 'WF-900';
    return error;
  }

  logMutation(entry) {
    this.mutation_log.push({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString()
    });
    if (entry.status === 'FAILED') {
      console.error(`[MUTATION_FAILED] ${entry.mutation_id}: ${entry.error}`);
    }
  }

  getMutationLog(filter = {}) {
    let log = this.mutation_log;
    if (filter.dossier_id) log = log.filter((m) => m.dossier_id === filter.dossier_id);
    if (filter.status) log = log.filter((m) => m.status === filter.status);
    if (filter.namespace) log = log.filter((m) => m.namespace === filter.namespace);
    return log;
  }
}

module.exports = DossierWriter;
