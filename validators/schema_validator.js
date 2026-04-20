/**
 * Schema Validator
 * Validates packets and dossier objects against known schema families.
 * Enforces: envelope fields, 5-section structure, critical field presence, type checks.
 */

const PacketValidator = require('../engine/packets/packet_validator');

class SchemaValidator {
  constructor() {
    this.packet_validator = new PacketValidator();
    this.validation_log = [];
  }

  /**
   * Validate a packet against its schema family
   */
  validatePacket(packet) {
    return this.packet_validator.validatePacket(packet);
  }

  /**
   * Validate a dossier object structure
   */
  validateDossier(dossier) {
    const errors = [];
    const warnings = [];

    if (!dossier || typeof dossier !== 'object') {
      return { valid: false, errors: ['Dossier is not a valid object'] };
    }

    // Required envelope fields
    if (!dossier.dossier_id) errors.push('Missing dossier_id');
    if (dossier._version === undefined) warnings.push('Missing _version field');
    if (!dossier._created_at) warnings.push('Missing _created_at field');

    // Audit trail
    if (!Array.isArray(dossier._audit_trail)) {
      warnings.push('Missing or invalid _audit_trail. Expected array.');
    } else {
      dossier._audit_trail.forEach((entry, i) => {
        if (!entry.mutation_id) errors.push(`audit_trail[${i}] missing mutation_id`);
        if (!entry.workflow_id) errors.push(`audit_trail[${i}] missing workflow_id`);
        if (!entry.namespace) errors.push(`audit_trail[${i}] missing namespace`);
        if (!entry.timestamp) errors.push(`audit_trail[${i}] missing timestamp`);
      });
    }

    // Namespace ownership check (from content_dossier.schema.json)
    const allowed_namespaces = ['system', 'intake', 'discovery', 'research', 'script', 'context', 'approval', 'runtime'];
    Object.keys(dossier).filter(k => !k.startsWith('_')).forEach(ns => {
      if (!allowed_namespaces.includes(ns)) {
        warnings.push(`Unknown namespace: "${ns}". Allowed: ${allowed_namespaces.join(', ')}`);
      }
    });

    return {
      valid: errors.length === 0,
      dossier_id: dossier.dossier_id || 'UNKNOWN',
      version: dossier._version,
      errors,
      warnings,
      namespace_count: Object.keys(dossier).filter(k => !k.startsWith('_')).length
    };
  }

  /**
   * Validate dossier delta before applying
   */
  validateDelta(delta) {
    const errors = [];

    const required = ['namespace', 'mutation_type', 'target', 'value', 'audit_entry'];
    required.forEach(f => { if (!delta[f]) errors.push(`Delta missing: ${f}`); });

    const valid_types = ['append', 'append_to_array', 'version_bump'];
    if (delta.mutation_type && !valid_types.includes(delta.mutation_type)) {
      errors.push(`Invalid mutation_type: ${delta.mutation_type}. Allowed: ${valid_types.join(', ')}`);
    }

    if (delta.audit_entry) {
      if (!delta.audit_entry.workflow_id) errors.push('audit_entry missing workflow_id');
      if (!delta.audit_entry.operation) errors.push('audit_entry missing operation');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate batch of packets
   */
  validatePacketBatch(packets) {
    const results = packets.map(p => this.validatePacket(p));
    return {
      total: packets.length,
      valid: results.filter(r => r.valid).length,
      invalid: results.filter(r => !r.valid).length,
      results
    };
  }

  getValidationLog() { return this.validation_log; }
}

module.exports = SchemaValidator;
