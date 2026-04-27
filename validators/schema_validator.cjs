/**
 * Schema Validator
 * Validates packet schemas, schema registry closure, and mutation payload contracts.
 */

const fs = require('fs');
const path = require('path');
const PacketValidator = require('../engine/packets/packet_validator');

class SchemaValidator {
  constructor(config = {}) {
    this.config = {
      schema_registry_path: config.schema_registry_path || './registries/schema_registry.yaml',
      skill_registry_path: config.skill_registry_path || './registries/skill_registry.yaml'
    };

    this.packet_validator = new PacketValidator({
      schema_registry_path: this.config.schema_registry_path
    });
    this.validation_log = [];
    this.allowed_mutation_types = new Set([
      'append_to_array',
      'create_new_packet',
      'create_new_index_row',
      'append_audit_entry'
    ]);
  }

  validatePacket(packet) {
    return this.packet_validator.validatePacket(packet);
  }

  validatePacketBatch(packets) {
    const results = packets.map((packet) => this.validatePacket(packet));
    return {
      total: packets.length,
      valid: results.filter((row) => row.valid).length,
      invalid: results.filter((row) => !row.valid).length,
      results
    };
  }

  validateDossier(dossier) {
    const errors = [];
    const warnings = [];

    if (!dossier || typeof dossier !== 'object' || Array.isArray(dossier)) {
      return { valid: false, errors: ['Dossier is not a valid object'], warnings: [] };
    }

    if (!dossier.dossier_id) {
      errors.push('Missing dossier_id');
    }

    if (dossier._version === undefined) {
      warnings.push('Missing _version field');
    }
    if (!dossier._created_at) {
      warnings.push('Missing _created_at field');
    }

    if (!Array.isArray(dossier._audit_trail)) {
      errors.push('Missing or invalid _audit_trail. Expected array.');
    } else {
      dossier._audit_trail.forEach((entry, index) => {
        this.validateAuditEntry(entry, `audit_trail[${index}]`, errors);
      });
    }

    const allowed_namespaces = new Set([
      'system',
      'intake',
      'discovery',
      'research',
      'script',
      'context',
      'approval',
      'runtime',
      'script_vein',
      'research_vein',
      'media_vein'
    ]);

    Object.keys(dossier)
      .filter((key) => !key.startsWith('_') && key !== 'dossier_id')
      .forEach((namespace) => {
        if (!allowed_namespaces.has(namespace)) {
          warnings.push(`Unknown namespace "${namespace}" in dossier payload`);
        }
      });

    return {
      valid: errors.length === 0,
      dossier_id: dossier.dossier_id || 'UNKNOWN',
      version: dossier._version,
      errors,
      warnings
    };
  }

  validateDelta(delta) {
    const errors = [];

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

    for (const field of required) {
      if (!(field in (delta || {}))) {
        errors.push(`Delta missing required field: ${field}`);
      }
    }

    if (delta?.mutation_type && !this.allowed_mutation_types.has(delta.mutation_type)) {
      errors.push(
        `Invalid mutation_type "${delta.mutation_type}". Allowed: ${Array.from(this.allowed_mutation_types).join(', ')}`
      );
    }

    if (delta?.audit_entry && (typeof delta.audit_entry !== 'object' || Array.isArray(delta.audit_entry))) {
      errors.push('audit_entry must be an object');
    } else if (delta?.audit_entry) {
      if (!delta.audit_entry.workflow_id) {
        errors.push('audit_entry missing workflow_id');
      }
      if (!delta.audit_entry.operation) {
        errors.push('audit_entry missing operation');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  validateSchemaRegistry() {
    const findings = [];
    const registryPath = path.resolve(this.config.schema_registry_path);
    if (!fs.existsSync(registryPath)) {
      findings.push({
        code: 'MISSING_SCHEMA_REGISTRY',
        severity: 'error',
        message: `Missing schema registry: ${registryPath}`
      });
      return { valid: false, schemas: [], findings };
    }

    const schemas = this.parseSchemaRegistry(fs.readFileSync(registryPath, 'utf8'));
    const seenFamilies = new Set();

    for (const schema of schemas) {
      if (!schema.artifact_family) {
        findings.push({
          code: 'SCHEMA_REGISTRY_MISSING_ARTIFACT_FAMILY',
          severity: 'error',
          message: 'Schema registry row missing artifact_family'
        });
      }
      if (!schema.schema_path) {
        findings.push({
          code: 'SCHEMA_REGISTRY_MISSING_SCHEMA_PATH',
          severity: 'error',
          message: `${schema.artifact_family || 'UNKNOWN'} missing schema_path`
        });
      }

      if (schema.artifact_family) {
        if (seenFamilies.has(schema.artifact_family)) {
          findings.push({
            code: 'SCHEMA_REGISTRY_DUPLICATE_ARTIFACT_FAMILY',
            severity: 'error',
            message: `Duplicate artifact_family in schema registry: ${schema.artifact_family}`
          });
        }
        seenFamilies.add(schema.artifact_family);
      }

      if (schema.schema_path) {
        const schemaPath = path.resolve(schema.schema_path);
        if (!fs.existsSync(schemaPath)) {
          findings.push({
            code: 'MISSING_SCHEMA_FILE',
            severity: 'error',
            message: `${schema.artifact_family || 'UNKNOWN'} schema file missing: ${schema.schema_path}`
          });
        } else {
          try {
            JSON.parse(this.stripBom(fs.readFileSync(schemaPath, 'utf8')));
          } catch (error) {
            findings.push({
              code: 'INVALID_SCHEMA_JSON',
              severity: 'error',
              message: `${schema.artifact_family || 'UNKNOWN'} schema parse failed: ${error.message}`
            });
          }
        }
      }
    }

    return {
      valid: !findings.some((row) => row.severity === 'error'),
      schemas,
      findings
    };
  }

  validateSkillSchemaBindings() {
    const findings = [];
    const schemaMap = new Map();
    const schemaCheck = this.validateSchemaRegistry();

    for (const row of schemaCheck.schemas) {
      if (row.artifact_family) {
        schemaMap.set(row.artifact_family, row);
      }
    }

    const skillRegistryPath = path.resolve(this.config.skill_registry_path);
    if (!fs.existsSync(skillRegistryPath)) {
      findings.push({
        code: 'MISSING_SKILL_REGISTRY',
        severity: 'error',
        message: `Missing skill registry: ${skillRegistryPath}`
      });
      return {
        valid: false,
        findings
      };
    }

    const skills = this.parseSkillSchemaBindings(fs.readFileSync(skillRegistryPath, 'utf8'));
    for (const skill of skills) {
      if (!skill.schema_ref) {
        findings.push({
          code: 'SKILL_MISSING_SCHEMA_REF',
          severity: 'error',
          message: `${skill.skill_id} missing schema_ref`
        });
        continue;
      }

      const schemaRefPath = path.resolve(skill.schema_ref);
      if (!fs.existsSync(schemaRefPath)) {
        findings.push({
          code: 'SKILL_SCHEMA_REF_MISSING_FILE',
          severity: 'error',
          message: `${skill.skill_id} schema_ref file missing: ${skill.schema_ref}`
        });
      }

      if (!skill.output_packet_family) {
        findings.push({
          code: 'SKILL_MISSING_OUTPUT_PACKET_FAMILY',
          severity: 'error',
          message: `${skill.skill_id} missing output_packet_family`
        });
      } else if (!schemaMap.has(skill.output_packet_family)) {
        findings.push({
          code: 'SKILL_PACKET_FAMILY_NOT_IN_SCHEMA_REGISTRY',
          severity: 'error',
          message: `${skill.skill_id} output_packet_family ${skill.output_packet_family} not found in schema_registry`
        });
      }
    }

    return {
      valid: schemaCheck.valid && !findings.some((row) => row.severity === 'error'),
      findings
    };
  }

  runFullCheck() {
    const schemaCheck = this.validateSchemaRegistry();
    const bindingCheck = this.validateSkillSchemaBindings();

    return {
      overall_valid: schemaCheck.valid && bindingCheck.valid,
      schema_registry_check: schemaCheck,
      binding_check: bindingCheck,
      findings: [...schemaCheck.findings, ...bindingCheck.findings],
      timestamp: new Date().toISOString()
    };
  }

  stripBom(text) {
    return String(text || '').replace(/^\uFEFF/, '');
  }

  validateAuditEntry(entry, location, errors) {
    const required = ['mutation_id', 'workflow_id', 'namespace', 'timestamp'];
    for (const field of required) {
      if (!entry[field]) {
        errors.push(`${location} missing ${field}`);
      }
    }
  }

  parseSchemaRegistry(text) {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const entries = [];
    let current = null;

    const flush = () => {
      if (current) {
        entries.push(current);
      }
      current = null;
    };

    for (const line of lines) {
      const start = line.match(/^\s*-\s*artifact_family:\s*([a-zA-Z0-9_-]+)\s*$/);
      if (start) {
        flush();
        current = {
          artifact_family: start[1],
          schema_path: null
        };
        continue;
      }

      if (!current) {
        continue;
      }

      const schemaPath = line.match(/^\s*schema_path:\s*(.+?)\s*$/);
      if (schemaPath) {
        current.schema_path = schemaPath[1].trim();
      }
    }

    flush();
    return entries;
  }

  parseSkillSchemaBindings(text) {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const skills = [];
    let current = null;

    const flush = () => {
      if (current) {
        skills.push(current);
      }
      current = null;
    };

    for (const line of lines) {
      const start = line.match(/^\s*-\s*skill_id:\s*(M-\d{3})\s*$/);
      if (start) {
        flush();
        current = {
          skill_id: start[1],
          schema_ref: null,
          output_packet_family: null
        };
        continue;
      }

      if (!current) {
        continue;
      }

      const schemaRef = line.match(/^\s*schema_ref:\s*(.+?)\s*$/);
      if (schemaRef) {
        current.schema_ref = schemaRef[1].trim();
        continue;
      }

      const packetFamily = line.match(/^\s*output_packet_family:\s*([a-zA-Z0-9_-]+)\s*$/);
      if (packetFamily) {
        current.output_packet_family = packetFamily[1].trim();
      }
    }

    flush();
    return skills;
  }

  getValidationLog() {
    return this.validation_log;
  }
}

module.exports = SchemaValidator;
