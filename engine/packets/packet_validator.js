/**
 * Packet Validator Engine
 * Validates packet envelope + registry schema contract before emission.
 */

const fs = require('fs');
const path = require('path');

class PacketValidator {
  constructor(config = {}) {
    this.config = {
      strict_mode: config.strict_mode !== false,
      schema_registry_path: config.schema_registry_path || './registries/schema_registry.yaml'
    };

    this.validation_log = [];
    this.schemaLookup = this.loadSchemaLookup();
  }

  validatePacket(packet) {
    const validationId = `VAL-${Date.now()}-${this.validation_log.length + 1}`;
    const errors = [];
    const warnings = [];

    try {
      const envelope = this.validateEnvelope(packet);
      if (!envelope.valid) {
        errors.push(...envelope.errors);
      }

      const artifactFamily = packet?.artifact_family || 'UNKNOWN';
      const schemaPath = this.schemaLookup[artifactFamily];
      if (!schemaPath) {
        // Phase-4+ packets (m3xx, m4xx, m5xx) may not have schemas yet - treat as warning only
        if (/^m[345]\d{2}_packet$/.test(artifactFamily)) {
          warnings.push(`Phase-4+ packet without schema registry mapping: ${artifactFamily}`);
        } else {
          errors.push(`No schema registry mapping for artifact_family: ${artifactFamily}`);
        }
      } else {
        const schemaValidation = this.validateAgainstSchema(packet, schemaPath);
        if (!schemaValidation.valid) {
          errors.push(...schemaValidation.errors);
        }
      }

      const lineage = this.validateLineage(packet);
      warnings.push(...lineage.warnings);

      const valid = errors.length === 0;
      this.logValidation({
        validation_id: validationId,
        packet_instance_id: packet?.instance_id || 'UNKNOWN',
        artifact_family: artifactFamily,
        valid,
        errors,
        warnings,
        route_to_workflow: valid ? null : 'WF-900'
      });

      return {
        valid,
        validation_id: validationId,
        errors,
        warnings,
        packet_instance_id: packet?.instance_id,
        timestamp: new Date().toISOString(),
        route_to_workflow: valid ? null : 'WF-900'
      };
    } catch (error) {
      this.logValidation({
        validation_id: validationId,
        packet_instance_id: packet?.instance_id || 'UNKNOWN',
        artifact_family: packet?.artifact_family || 'UNKNOWN',
        valid: false,
        errors: [error.message],
        warnings: [],
        route_to_workflow: 'WF-900'
      });
      return {
        valid: false,
        validation_id: validationId,
        errors: [error.message],
        warnings: [],
        timestamp: new Date().toISOString(),
        route_to_workflow: 'WF-900'
      };
    }
  }

  validateBatch(packets) {
    const results = packets.map((packet) => this.validatePacket(packet));
    return {
      total_packets: packets.length,
      valid_packets: results.filter((r) => r.valid).length,
      invalid_packets: results.filter((r) => !r.valid).length,
      results
    };
  }

  validateEnvelope(packet) {
    const errors = [];
    const required = [
      'instance_id',
      'artifact_family',
      'schema_version',
      'producer_workflow',
      'dossier_ref',
      'status',
      'payload'
    ];
    for (const field of required) {
      if (!(field in (packet || {}))) {
        errors.push(`Missing required envelope field: ${field}`);
      }
    }
    return { valid: errors.length === 0, errors };
  }

  validateAgainstSchema(packet, schemaPath) {
    const absPath = path.resolve(schemaPath);
    if (!fs.existsSync(absPath)) {
      return { valid: false, errors: [`Schema file not found: ${schemaPath}`] };
    }

    let schema;
    try {
      schema = JSON.parse(fs.readFileSync(absPath, 'utf8'));
    } catch (error) {
      return { valid: false, errors: [`Schema parse failed (${schemaPath}): ${error.message}`] };
    }

    const errors = [];
    this.validateNode(packet, schema, '$', errors);
    return { valid: errors.length === 0, errors };
  }

  validateNode(value, schema, nodePath, errors) {
    if (!schema || typeof schema !== 'object') {
      return;
    }

    if (Array.isArray(schema.required) && value && typeof value === 'object') {
      for (const key of schema.required) {
        if (!(key in value)) {
          errors.push(`Schema required violation at ${nodePath}: missing "${key}"`);
        }
      }
    }

    if (schema.type) {
      const typeOk =
        (schema.type === 'object' && value && typeof value === 'object' && !Array.isArray(value)) ||
        (schema.type === 'array' && Array.isArray(value)) ||
        (schema.type === 'string' && typeof value === 'string') ||
        (schema.type === 'number' && typeof value === 'number') ||
        (schema.type === 'integer' && Number.isInteger(value)) ||
        (schema.type === 'boolean' && typeof value === 'boolean') ||
        (schema.type === 'null' && value === null);
      if (!typeOk) {
        errors.push(`Schema type violation at ${nodePath}: expected ${schema.type}`);
        return;
      }
    }

    if (Object.prototype.hasOwnProperty.call(schema, 'const') && value !== schema.const) {
      errors.push(`Schema const violation at ${nodePath}: expected ${JSON.stringify(schema.const)}`);
    }

    if (Array.isArray(schema.enum) && !schema.enum.includes(value)) {
      errors.push(`Schema enum violation at ${nodePath}: value "${value}" not allowed`);
    }

    if (schema.type === 'object' && schema.properties && value && typeof value === 'object') {
      for (const [key, childSchema] of Object.entries(schema.properties)) {
        if (key in value) {
          this.validateNode(value[key], childSchema, `${nodePath}.${key}`, errors);
        }
      }
      if (schema.additionalProperties === false) {
        const allowed = new Set(Object.keys(schema.properties));
        for (const key of Object.keys(value)) {
          if (!allowed.has(key)) {
            errors.push(`Schema additionalProperties violation at ${nodePath}: "${key}" not allowed`);
          }
        }
      }
    }

    if (schema.type === 'array' && schema.items && Array.isArray(value)) {
      for (let i = 0; i < value.length; i += 1) {
        this.validateNode(value[i], schema.items, `${nodePath}[${i}]`, errors);
      }
    }
  }

  validateLineage(packet) {
    const warnings = [];
    const payload = packet?.payload || {};
    const lineage = payload?.context?.sourced_from_packet_id || payload?.lineage_reference;
    if (!lineage && packet?.artifact_family !== 'topic_candidate_board') {
      warnings.push('No lineage reference found in packet payload/context');
    }
    return { valid: true, warnings };
  }

  loadSchemaLookup() {
    const registryPath = path.resolve(this.config.schema_registry_path);
    if (!fs.existsSync(registryPath)) {
      return {};
    }
    const text = fs.readFileSync(registryPath, 'utf8').replace(/\r\n/g, '\n');
    const lines = text.split('\n');
    const lookup = {};
    let currentFamily = null;

    for (const line of lines) {
      const familyMatch = line.match(/^\s*-\s*artifact_family:\s*([a-zA-Z0-9_\-]+)\s*$/);
      if (familyMatch) {
        currentFamily = familyMatch[1];
        continue;
      }

      if (currentFamily) {
        const pathMatch = line.match(/^\s*schema_path:\s*(.+?)\s*$/);
        if (pathMatch) {
          lookup[currentFamily] = pathMatch[1].trim();
          currentFamily = null;
        }
      }
    }

    return lookup;
  }

  logValidation(entry) {
    this.validation_log.push({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString()
    });
  }

  getValidationLog(filter = {}) {
    let log = this.validation_log;
    if (filter.valid !== undefined) log = log.filter((v) => v.valid === filter.valid);
    if (filter.artifact_family) log = log.filter((v) => v.artifact_family === filter.artifact_family);
    return log;
  }
}

module.exports = PacketValidator;
