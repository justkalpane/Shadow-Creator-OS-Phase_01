/**
 * Runtime Validator
 * Validates dossier mutation audit trail, namespace ownership, and lineage integrity at runtime.
 */

const DossierReader = require('../engine/dossier/dossier_reader');
const SchemaValidator = require('./schema_validator');

class RuntimeValidator {
  constructor(config = {}) {
    this.reader = new DossierReader(config);
    this.schema_validator = new SchemaValidator();

    this.namespace_workflow_map = {
      'system':     ['WF-000'],
      'intake':     ['WF-001'],
      'discovery':  ['CWF-110', 'CWF-120', 'CWF-130'],
      'research':   ['CWF-140'],
      'script':     ['CWF-210', 'CWF-220', 'CWF-230', 'CWF-240'],
      'context':    ['CWF-310', 'CWF-320', 'CWF-330', 'CWF-340'],
      'approval':   ['WF-020', 'WF-900', 'CWF-220'],
      'runtime':    ['WF-010', 'WF-900', 'CWF-240']
    };
  }

  /**
   * Validate dossier audit trail integrity
   */
  async validateAuditTrail(dossier_id) {
    const errors = [];
    const warnings = [];

    try {
      const audit = await this.reader.getAuditTrail(dossier_id);
      const trail = audit.audit_trail || [];

      if (trail.length === 0) {
        warnings.push('Audit trail is empty. Dossier may not have been mutated yet.');
        return { valid: true, dossier_id, errors, warnings, mutation_count: 0 };
      }

      trail.forEach((entry, i) => {
        // Required fields
        if (!entry.mutation_id) errors.push(`audit[${i}] missing mutation_id`);
        if (!entry.workflow_id) errors.push(`audit[${i}] missing workflow_id`);
        if (!entry.namespace) errors.push(`audit[${i}] missing namespace`);
        if (!entry.timestamp) errors.push(`audit[${i}] missing timestamp`);
        if (!entry.operation) errors.push(`audit[${i}] missing operation`);

        // Namespace ownership
        if (entry.namespace && entry.workflow_id) {
          const allowed_workflows = this.namespace_workflow_map[entry.namespace];
          if (allowed_workflows && !allowed_workflows.includes(entry.workflow_id)) {
            errors.push(`Namespace ownership violation: ${entry.workflow_id} wrote to namespace "${entry.namespace}" (not allowed)`);
          }
        }

        // Lineage check
        if (entry.lineage_intact === false) {
          errors.push(`Lineage broken at audit[${i}] (mutation_id: ${entry.mutation_id})`);
        }

        // Version monotonicity
        if (i > 0) {
          const prev = trail[i - 1];
          if (entry.version_after <= prev.version_after) {
            warnings.push(`Version not monotonically increasing at audit[${i}]: ${prev.version_after} -> ${entry.version_after}`);
          }
        }
      });

      return {
        valid: errors.length === 0,
        dossier_id,
        errors,
        warnings,
        mutation_count: trail.length,
        namespaces_written: [...new Set(trail.map(e => e.namespace))]
      };

    } catch (e) {
      return { valid: false, dossier_id, errors: [`Audit trail read failed: ${e.message}`], warnings };
    }
  }

  /**
   * Validate dossier namespace consistency
   */
  async validateNamespaceConsistency(dossier_id) {
    const errors = [];
    const warnings = [];

    try {
      const ns_result = await this.reader.getNamespaces(dossier_id);
      const namespaces = ns_result.namespaces;
      const allowed = Object.keys(this.namespace_workflow_map);

      namespaces.forEach(ns => {
        if (!allowed.includes(ns)) {
          errors.push(`Unknown namespace found in dossier: "${ns}"`);
        }
      });

      return {
        valid: errors.length === 0,
        dossier_id,
        namespaces_present: namespaces,
        errors,
        warnings
      };

    } catch (e) {
      return { valid: false, dossier_id, errors: [`Namespace check failed: ${e.message}`], warnings };
    }
  }

  /**
   * Validate packet lineage chain
   * Checks that each packet's sourced_from references exist in se_packet_index
   */
  validatePacketLineage(packets) {
    const packet_ids = new Set(packets.map(p => p.instance_id));
    const errors = [];

    packets.forEach(p => {
      const ctx = p.payload?.context || {};
      const refs = [
        ctx.sourced_from_packet_id,
        ctx.sourced_from_debate_packet_id,
        ctx.sourced_from_refinement_packet_id
      ].filter(Boolean);

      refs.forEach(ref => {
        if (!packet_ids.has(ref)) {
          errors.push(`Packet ${p.instance_id} references unknown packet: ${ref}`);
        }
      });
    });

    return {
      valid: errors.length === 0,
      packet_count: packets.length,
      errors
    };
  }

  /**
   * Full runtime validation for a dossier
   */
  async validateRuntime(dossier_id) {
    const audit_check = await this.validateAuditTrail(dossier_id);
    const namespace_check = await this.validateNamespaceConsistency(dossier_id);

    const overall_valid = audit_check.valid && namespace_check.valid;

    return {
      overall_valid,
      dossier_id,
      audit_trail_valid: audit_check.valid,
      namespace_consistency_valid: namespace_check.valid,
      audit_errors: audit_check.errors,
      namespace_errors: namespace_check.errors,
      warnings: [...(audit_check.warnings || []), ...(namespace_check.warnings || [])],
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = RuntimeValidator;
