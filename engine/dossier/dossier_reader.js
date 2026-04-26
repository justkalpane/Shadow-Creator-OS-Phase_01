/**
 * Dossier Reader Engine
 * Read-only access to dossier state with access auditing.
 */

const fs = require('fs');
const path = require('path');

class DossierReader {
  constructor(config = {}) {
    this.config = {
      dossier_base_path: config.dossier_base_path || './dossiers',
      enable_access_log: config.enable_access_log !== false
    };

    this.access_log = [];
    this.access_counter = 0;
  }

  async readDossier(dossierId) {
    const accessId = this.buildAccessId(dossierId, 'READ_FULL_DOSSIER');

    try {
      const dossier = await this.loadDossier(dossierId);
      this.logAccess({
        access_id: accessId,
        dossier_id: dossierId,
        operation: 'READ_FULL_DOSSIER',
        path: null,
        version: dossier._version || 0,
        status: 'SUCCESS'
      });

      return {
        dossier_id: dossierId,
        version: dossier._version || 0,
        data: dossier,
        accessed_at: new Date().toISOString()
      };
    } catch (error) {
      this.logAccess({
        access_id: accessId,
        dossier_id: dossierId,
        operation: 'READ_FULL_DOSSIER',
        status: 'FAILED',
        error: error.message,
        route_to_workflow: 'WF-900'
      });
      throw this.buildRoutedError(error.message);
    }
  }

  async readNamespace(dossierId, namespace) {
    const accessId = this.buildAccessId(dossierId, 'READ_NAMESPACE');

    try {
      const dossier = await this.loadDossier(dossierId);
      const namespaceData = dossier[namespace] || null;

      this.logAccess({
        access_id: accessId,
        dossier_id: dossierId,
        operation: 'READ_NAMESPACE',
        path: namespace,
        namespace,
        version: dossier._version || 0,
        status: 'SUCCESS'
      });

      return {
        dossier_id: dossierId,
        namespace,
        data: namespaceData,
        version: dossier._version || 0,
        accessed_at: new Date().toISOString()
      };
    } catch (error) {
      this.logAccess({
        access_id: accessId,
        dossier_id: dossierId,
        operation: 'READ_NAMESPACE',
        path: namespace,
        status: 'FAILED',
        error: error.message,
        route_to_workflow: 'WF-900'
      });
      throw this.buildRoutedError(error.message);
    }
  }

  async readField(dossierId, fieldPath) {
    const accessId = this.buildAccessId(dossierId, 'READ_FIELD');

    try {
      const dossier = await this.loadDossier(dossierId);
      const value = this.getValueByPath(dossier, fieldPath);
      const namespace = String(fieldPath || '').split('.')[0] || null;

      this.logAccess({
        access_id: accessId,
        dossier_id: dossierId,
        operation: 'READ_FIELD',
        path: fieldPath,
        namespace,
        version: dossier._version || 0,
        status: value !== undefined ? 'SUCCESS' : 'NOT_FOUND'
      });

      return {
        dossier_id: dossierId,
        field_path: fieldPath,
        value,
        found: value !== undefined,
        version: dossier._version || 0,
        accessed_at: new Date().toISOString()
      };
    } catch (error) {
      this.logAccess({
        access_id: accessId,
        dossier_id: dossierId,
        operation: 'READ_FIELD',
        path: fieldPath,
        status: 'FAILED',
        error: error.message,
        route_to_workflow: 'WF-900'
      });
      throw this.buildRoutedError(error.message);
    }
  }

  async getNamespaces(dossierId) {
    const dossier = await this.loadDossier(dossierId);
    const namespaces = Object.keys(dossier).filter((k) => !k.startsWith('_'));
    return {
      dossier_id: dossierId,
      namespaces,
      namespace_count: namespaces.length,
      version: dossier._version || 0,
      accessed_at: new Date().toISOString()
    };
  }

  async getAuditTrail(dossierId, filter = {}) {
    const dossier = await this.loadDossier(dossierId);
    let auditTrail = Array.isArray(dossier._audit_trail) ? dossier._audit_trail : [];

    if (filter.workflow_id) auditTrail = auditTrail.filter((a) => a.workflow_id === filter.workflow_id);
    if (filter.operation) auditTrail = auditTrail.filter((a) => a.operation === filter.operation);
    if (filter.namespace) auditTrail = auditTrail.filter((a) => a.namespace === filter.namespace);

    return {
      dossier_id: dossierId,
      audit_trail: auditTrail,
      total_mutations: auditTrail.length,
      version: dossier._version || 0,
      accessed_at: new Date().toISOString()
    };
  }

  async verifyLineageIntegrity(dossierId) {
    const dossier = await this.loadDossier(dossierId);
    const auditTrail = Array.isArray(dossier._audit_trail) ? dossier._audit_trail : [];

    const violations = [];
    for (const entry of auditTrail) {
      if (entry.lineage_intact === false) {
        violations.push({
          mutation_id: entry.mutation_id,
          issue: 'lineage_not_marked_intact',
          workflow_id: entry.workflow_id
        });
      }
      if (!entry.lineage_reference) {
        violations.push({
          mutation_id: entry.mutation_id,
          issue: 'missing_lineage_reference',
          workflow_id: entry.workflow_id
        });
      }
    }

    return {
      dossier_id: dossierId,
      integrity_ok: violations.length === 0,
      total_mutations_checked: auditTrail.length,
      violations,
      version: dossier._version || 0
    };
  }

  async loadDossier(dossierId) {
    try {
      const dossierPath = path.join(this.config.dossier_base_path, `${dossierId}.json`);
      if (!fs.existsSync(dossierPath)) {
        throw new Error(`Dossier not found: ${dossierId}`);
      }
      return JSON.parse(fs.readFileSync(dossierPath, 'utf8'));
    } catch (error) {
      throw new Error(`Failed to load dossier ${dossierId}: ${error.message}`);
    }
  }

  getValueByPath(obj, fieldPath) {
    const parts = String(fieldPath || '').split('.');
    let current = obj;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    return current;
  }

  buildAccessId(dossierId, op) {
    this.access_counter += 1;
    return `ACC-${dossierId}-${op}-${this.access_counter}`;
  }

  buildRoutedError(message) {
    const error = new Error(message);
    error.route_to_workflow = 'WF-900';
    return error;
  }

  logAccess(entry) {
    if (!this.config.enable_access_log) return;
    this.access_log.push({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString()
    });
  }

  getAccessLog(filter = {}) {
    let log = this.access_log;
    if (filter.dossier_id) log = log.filter((a) => a.dossier_id === filter.dossier_id);
    if (filter.operation) log = log.filter((a) => a.operation === filter.operation);
    if (filter.status) log = log.filter((a) => a.status === filter.status);
    return log;
  }
}

module.exports = DossierReader;
