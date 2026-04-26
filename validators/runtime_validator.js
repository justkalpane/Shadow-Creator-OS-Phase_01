/**
 * Runtime Validator
 * Validates runtime mutation law, escalation routing, namespace integrity, and lineage at runtime.
 */

const fs = require('fs');
const path = require('path');
const DossierReader = require('../engine/dossier/dossier_reader');

class RuntimeValidator {
  constructor(config = {}) {
    this.config = {
      dossier_base_path: config.dossier_base_path || './dossiers',
      engine_base_path: config.engine_base_path || './engine'
    };

    this.reader = new DossierReader({ dossier_base_path: this.config.dossier_base_path });
    this.allowed_mutation_operations = new Set([
      'append_to_array',
      'create_new_packet',
      'create_new_index_row',
      'append_audit_entry'
    ]);
    this.namespace_workflow_map = {
      system: ['WF-000', 'WF-001', 'WF-010', 'WF-900'],
      intake: ['WF-001', 'WF-900'],
      discovery: ['CWF-110', 'CWF-120', 'CWF-130', 'WF-900'],
      research: ['CWF-140', 'WF-900'],
      script: ['CWF-210', 'CWF-220', 'CWF-230', 'CWF-240', 'WF-021', 'WF-900'],
      context: ['CWF-210', 'CWF-220', 'CWF-230', 'CWF-240', 'WF-900'],
      approval: ['WF-020', 'WF-021', 'WF-900'],
      runtime: ['WF-010', 'WF-900'],
      script_vein: ['CWF-210', 'CWF-220', 'CWF-230', 'CWF-240', 'WF-021', 'WF-900'],
      research_vein: ['CWF-140', 'WF-021', 'WF-900'],
      media_vein: ['CWF-310', 'CWF-410', 'CWF-430', 'WF-021', 'WF-900']
    };
  }

  async validateAuditTrail(dossierId) {
    const errors = [];
    const warnings = [];

    try {
      const audit = await this.reader.getAuditTrail(dossierId);
      const trail = audit.audit_trail || [];

      if (trail.length === 0) {
        warnings.push('Audit trail is empty');
      }

      trail.forEach((entry, index) => {
        this.validateAuditEntry(entry, index, errors, warnings);
      });

      return {
        valid: errors.length === 0,
        dossier_id: dossierId,
        mutation_count: trail.length,
        errors,
        warnings,
        namespaces_written: [...new Set(trail.map((entry) => entry.namespace).filter(Boolean))]
      };
    } catch (error) {
      return {
        valid: false,
        dossier_id: dossierId,
        errors: [`Audit trail read failed: ${error.message}`],
        warnings
      };
    }
  }

  async validateNamespaceConsistency(dossierId) {
    const errors = [];
    const warnings = [];

    try {
      const namespaceResult = await this.reader.getNamespaces(dossierId);
      const namespaces = namespaceResult.namespaces || [];
      const allowedNamespaces = new Set(Object.keys(this.namespace_workflow_map));

      for (const namespace of namespaces) {
        if (!allowedNamespaces.has(namespace)) {
          errors.push(`Unknown namespace found in dossier: "${namespace}"`);
        }
      }

      return {
        valid: errors.length === 0,
        dossier_id: dossierId,
        namespaces_present: namespaces,
        errors,
        warnings
      };
    } catch (error) {
      return {
        valid: false,
        dossier_id: dossierId,
        errors: [`Namespace check failed: ${error.message}`],
        warnings
      };
    }
  }

  validatePacketLineage(packets) {
    const packetIds = new Set(packets.map((packet) => packet.instance_id));
    const errors = [];

    for (const packet of packets) {
      const ctx = packet.payload?.context || {};
      const refs = [
        ctx.sourced_from_packet_id,
        ctx.sourced_from_debate_packet_id,
        ctx.sourced_from_refinement_packet_id
      ].filter(Boolean);

      for (const ref of refs) {
        if (!packetIds.has(ref)) {
          errors.push(`Packet ${packet.instance_id} references unknown packet ${ref}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      packet_count: packets.length,
      errors
    };
  }

  async validateMutationLaw(dossierId) {
    const errors = [];
    const warnings = [];

    try {
      const audit = await this.reader.getAuditTrail(dossierId);
      for (const [index, entry] of (audit.audit_trail || []).entries()) {
        const operation = (entry.operation || entry.mutation_type || '').trim();
        if (!operation) {
          errors.push(`audit[${index}] missing operation or mutation_type`);
          continue;
        }

        if (!this.allowed_mutation_operations.has(operation)) {
          errors.push(
            `Non-append-only mutation detected at audit[${index}] (mutation_id=${entry.mutation_id || 'UNKNOWN'}): ${operation}`
          );
        }

        const lowered = operation.toLowerCase();
        if (
          lowered.includes('overwrite') ||
          lowered.includes('replace') ||
          lowered.includes('delete') ||
          lowered.includes('remove')
        ) {
          errors.push(
            `Forbidden destructive mutation keyword detected at audit[${index}] (operation=${operation})`
          );
        }
      }

      return {
        valid: errors.length === 0,
        dossier_id: dossierId,
        errors,
        warnings
      };
    } catch (error) {
      return {
        valid: false,
        dossier_id: dossierId,
        errors: [`Mutation law check failed: ${error.message}`],
        warnings
      };
    }
  }

  scanRuntimeEngineContracts() {
    const findings = [];
    const files = [
      'engine/skill_loader/skill_loader.js',
      'engine/skill_loader/skill_registry_resolver.js',
      'engine/skill_loader/skill_executor.js',
      'engine/dossier/dossier_writer.js',
      'engine/dossier/dossier_reader.js',
      'engine/dossier/dossier_delta_manager.js',
      'engine/packets/packet_validator.js',
      'engine/packets/packet_router.js',
      'engine/packets/packet_index_writer.js',
      'engine/approval/approval_writer.js',
      'engine/approval/approval_resolver.js',
      'engine/approval/approval_router.js'
    ];

    for (const relativeFile of files) {
      const fullPath = path.resolve(relativeFile);
      if (!fs.existsSync(fullPath)) {
        findings.push({
          code: 'MISSING_RUNTIME_ENGINE_FILE',
          severity: 'error',
          message: `Missing runtime engine file: ${relativeFile}`
        });
        continue;
      }

      const content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('WF-900')) {
        findings.push({
          code: 'MISSING_WF900_RUNTIME_ROUTE',
          severity: 'error',
          message: `${relativeFile} missing WF-900 escalation route`
        });
      }

      if (content.includes('Math.random')) {
        findings.push({
          code: 'NON_DETERMINISTIC_RUNTIME_LOGIC',
          severity: 'error',
          message: `${relativeFile} uses Math.random in deterministic runtime path`
        });
      }
    }

    const dossierWriterPath = path.resolve('engine/dossier/dossier_writer.js');
    if (fs.existsSync(dossierWriterPath)) {
      const dossierWriter = fs.readFileSync(dossierWriterPath, 'utf8');
      for (const mutation of this.allowed_mutation_operations) {
        if (!dossierWriter.includes(`'${mutation}'`) && !dossierWriter.includes(`"${mutation}"`)) {
          findings.push({
            code: 'MISSING_ALLOWED_MUTATION_CONTRACT',
            severity: 'error',
            message: `dossier_writer.js missing required mutation contract token: ${mutation}`
          });
        }
      }
    }

    return {
      valid: !findings.some((row) => row.severity === 'error'),
      findings
    };
  }

  async validateRuntime(dossierId) {
    const auditCheck = await this.validateAuditTrail(dossierId);
    const namespaceCheck = await this.validateNamespaceConsistency(dossierId);
    const mutationLawCheck = await this.validateMutationLaw(dossierId);
    const runtimeEngineCheck = this.scanRuntimeEngineContracts();

    const overallValid =
      auditCheck.valid && namespaceCheck.valid && mutationLawCheck.valid && runtimeEngineCheck.valid;

    return {
      overall_valid: overallValid,
      dossier_id: dossierId,
      audit_trail_valid: auditCheck.valid,
      namespace_consistency_valid: namespaceCheck.valid,
      mutation_law_valid: mutationLawCheck.valid,
      runtime_engine_contract_valid: runtimeEngineCheck.valid,
      errors: [
        ...(auditCheck.errors || []),
        ...(namespaceCheck.errors || []),
        ...(mutationLawCheck.errors || []),
        ...runtimeEngineCheck.findings.filter((row) => row.severity === 'error').map((row) => row.message)
      ],
      warnings: [...(auditCheck.warnings || []), ...(namespaceCheck.warnings || []), ...(mutationLawCheck.warnings || [])],
      timestamp: new Date().toISOString()
    };
  }

  async runRepositoryRuntimeCheck() {
    const findings = [];
    const engineCheck = this.scanRuntimeEngineContracts();
    findings.push(...engineCheck.findings);

    const dossierFiles = this.walkFiles(path.resolve(this.config.dossier_base_path), (file) =>
      file.endsWith('.json')
    );

    for (const dossierFile of dossierFiles) {
      const dossierId = path.basename(dossierFile, '.json');
      const mutationLaw = await this.validateMutationLaw(dossierId);
      for (const error of mutationLaw.errors) {
        findings.push({
          code: 'NON_APPEND_ONLY_DOSSIER_WRITE',
          severity: 'error',
          message: `${dossierId}: ${error}`
        });
      }
    }

    return {
      overall_valid: findings.filter((row) => row.severity === 'error').length === 0,
      findings,
      scanned_dossiers: dossierFiles.length,
      timestamp: new Date().toISOString()
    };
  }

  validateAuditEntry(entry, index, errors, warnings) {
    const required = ['mutation_id', 'workflow_id', 'namespace', 'timestamp', 'operation'];
    for (const field of required) {
      if (!entry[field]) {
        errors.push(`audit[${index}] missing ${field}`);
      }
    }

    if (entry.namespace && entry.workflow_id) {
      const allowedWorkflows = this.namespace_workflow_map[entry.namespace];
      if (allowedWorkflows && !allowedWorkflows.includes(entry.workflow_id)) {
        errors.push(
          `Namespace ownership violation at audit[${index}]: ${entry.workflow_id} cannot write ${entry.namespace}`
        );
      }
    }

    if (entry.lineage_intact === false) {
      errors.push(`Lineage broken at audit[${index}] (mutation_id=${entry.mutation_id || 'UNKNOWN'})`);
    }

    if (!entry.lineage_reference) {
      warnings.push(`audit[${index}] missing lineage_reference`);
    }
  }

  walkFiles(root, predicate) {
    const out = [];
    if (!fs.existsSync(root)) {
      return out;
    }

    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      const full = path.join(root, entry.name);
      if (entry.isDirectory()) {
        out.push(...this.walkFiles(full, predicate));
      } else if (entry.isFile() && predicate(full)) {
        out.push(full);
      }
    }

    return out;
  }
}

module.exports = RuntimeValidator;
