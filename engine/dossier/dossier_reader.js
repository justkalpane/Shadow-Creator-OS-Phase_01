/**
 * Dossier Reader Engine
 * Read-only access to dossier state by namespace or field path.
 * Tracks access patterns without mutation.
 */

const fs = require('fs');
const path = require('path');

class DossierReader {
  constructor(config = {}) {
    this.config = {
      dossier_base_path: config.dossier_base_path || './dossiers/',
      enable_access_log: config.enable_access_log !== false
    };

    this.access_log = [];
  }

  /**
   * Read entire dossier
   */
  async readDossier(dossier_id) {
    const access_id = 'ACC-' + Date.now();

    try {
      const dossier_path = path.join(this.config.dossier_base_path, `${dossier_id}.json`);

      if (!fs.existsSync(dossier_path)) {
        throw new Error(`Dossier not found: ${dossier_id}`);
      }

      const content = fs.readFileSync(dossier_path, 'utf8');
      const dossier = JSON.parse(content);

      this.logAccess({
        access_id,
        dossier_id,
        operation: 'READ_FULL_DOSSIER',
        path: null,
        version: dossier._version || 0,
        status: 'SUCCESS'
      });

      return {
        dossier_id: dossier_id,
        version: dossier._version || 0,
        data: dossier,
        accessed_at: new Date().toISOString()
      };

    } catch (e) {
      this.logAccess({
        access_id,
        dossier_id,
        operation: 'READ_FULL_DOSSIER',
        status: 'FAILED',
        error: e.message
      });
      throw e;
    }
  }

  /**
   * Read namespace from dossier
   */
  async readNamespace(dossier_id, namespace) {
    const access_id = 'ACC-' + Date.now();

    try {
      const dossier = await this.loadDossier(dossier_id);
      const namespace_data = dossier[namespace] || null;

      this.logAccess({
        access_id,
        dossier_id,
        operation: 'READ_NAMESPACE',
        path: namespace,
        namespace: namespace,
        version: dossier._version || 0,
        status: 'SUCCESS'
      });

      return {
        dossier_id: dossier_id,
        namespace: namespace,
        data: namespace_data,
        version: dossier._version || 0,
        accessed_at: new Date().toISOString()
      };

    } catch (e) {
      this.logAccess({
        access_id,
        dossier_id,
        operation: 'READ_NAMESPACE',
        path: namespace,
        status: 'FAILED',
        error: e.message
      });
      throw e;
    }
  }

  /**
   * Read field/path from dossier
   */
  async readField(dossier_id, field_path) {
    const access_id = 'ACC-' + Date.now();

    try {
      const dossier = await this.loadDossier(dossier_id);
      const value = this.getValueByPath(dossier, field_path);

      const path_parts = field_path.split('.');
      const namespace = path_parts[0];

      this.logAccess({
        access_id,
        dossier_id,
        operation: 'READ_FIELD',
        path: field_path,
        namespace: namespace,
        version: dossier._version || 0,
        status: value !== undefined ? 'SUCCESS' : 'NOT_FOUND'
      });

      return {
        dossier_id: dossier_id,
        field_path: field_path,
        value: value,
        found: value !== undefined,
        version: dossier._version || 0,
        accessed_at: new Date().toISOString()
      };

    } catch (e) {
      this.logAccess({
        access_id,
        dossier_id,
        operation: 'READ_FIELD',
        path: field_path,
        status: 'FAILED',
        error: e.message
      });
      throw e;
    }
  }

  /**
   * Get all namespaces present in dossier
   */
  async getNamespaces(dossier_id) {
    try {
      const dossier = await this.loadDossier(dossier_id);

      const namespaces = Object.keys(dossier).filter(k => !k.startsWith('_'));

      return {
        dossier_id: dossier_id,
        namespaces: namespaces,
        namespace_count: namespaces.length,
        version: dossier._version || 0,
        accessed_at: new Date().toISOString()
      };

    } catch (e) {
      throw e;
    }
  }

  /**
   * Get audit trail
   */
  async getAuditTrail(dossier_id, filter = {}) {
    try {
      const dossier = await this.loadDossier(dossier_id);
      let audit_trail = dossier._audit_trail || [];

      if (filter.workflow_id) {
        audit_trail = audit_trail.filter(a => a.workflow_id === filter.workflow_id);
      }
      if (filter.operation) {
        audit_trail = audit_trail.filter(a => a.operation === filter.operation);
      }
      if (filter.namespace) {
        audit_trail = audit_trail.filter(a => a.namespace === filter.namespace);
      }

      return {
        dossier_id: dossier_id,
        audit_trail: audit_trail,
        total_mutations: audit_trail.length,
        version: dossier._version || 0,
        accessed_at: new Date().toISOString()
      };

    } catch (e) {
      throw e;
    }
  }

  /**
   * Verify mutation lineage integrity
   */
  async verifyLineageIntegrity(dossier_id) {
    try {
      const dossier = await this.loadDossier(dossier_id);
      const audit_trail = dossier._audit_trail || [];

      let integrity_ok = true;
      const violations = [];

      for (const entry of audit_trail) {
        if (!entry.lineage_intact) {
          integrity_ok = false;
          violations.push({
            mutation_id: entry.mutation_id,
            issue: 'lineage_not_marked_intact',
            workflow_id: entry.workflow_id
          });
        }
      }

      return {
        dossier_id: dossier_id,
        integrity_ok: integrity_ok,
        total_mutations_checked: audit_trail.length,
        violations: violations,
        version: dossier._version || 0
      };

    } catch (e) {
      throw e;
    }
  }

  /**
   * Load dossier from disk
   */
  async loadDossier(dossier_id) {
    try {
      const dossier_path = path.join(this.config.dossier_base_path, `${dossier_id}.json`);
      if (!fs.existsSync(dossier_path)) {
        throw new Error(`Dossier not found: ${dossier_id}`);
      }
      const content = fs.readFileSync(dossier_path, 'utf8');
      return JSON.parse(content);
    } catch (e) {
      throw new Error(`Failed to load dossier ${dossier_id}: ${e.message}`);
    }
  }

  /**
   * Get value by dot-notation path
   */
  getValueByPath(obj, path) {
    const parts = path.split('.');
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

  /**
   * Log access for audit
   */
  logAccess(entry) {
    this.access_log.push(entry);
  }

  /**
   * Get access log
   */
  getAccessLog(filter = {}) {
    let log = this.access_log;

    if (filter.dossier_id) {
      log = log.filter(a => a.dossier_id === filter.dossier_id);
    }
    if (filter.operation) {
      log = log.filter(a => a.operation === filter.operation);
    }
    if (filter.status) {
      log = log.filter(a => a.status === filter.status);
    }

    return log;
  }
}

module.exports = DossierReader;
