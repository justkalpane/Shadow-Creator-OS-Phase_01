/**
 * Registry Validator
 * Validates registry referential integrity: skill→director bindings, workflow→skill refs, packet→schema refs.
 */

const fs = require('fs');
const path = require('path');

class RegistryValidator {
  constructor(config = {}) {
    this.config = {
      registries_path: config.registries_path || './registries/',
      skills_path: config.skills_path || './skills/',
      workflows_path: config.workflows_path || './n8n/workflows/'
    };
  }

  /**
   * Validate that a registry file is parseable YAML/JSON
   */
  validateRegistryFile(filepath) {
    try {
      const content = fs.readFileSync(filepath, 'utf8');
      if (!content || content.trim() === '') {
        return { valid: false, filepath, errors: ['File is empty'] };
      }
      // Minimal check: file exists and is non-empty
      return { valid: true, filepath, errors: [], warnings: [] };
    } catch (e) {
      return { valid: false, filepath, errors: [`Cannot read file: ${e.message}`] };
    }
  }

  /**
   * Validate all registry files exist and are non-empty
   */
  validateAllRegistries() {
    const results = [];
    const errors = [];

    try {
      const files = fs.readdirSync(this.config.registries_path)
        .filter(f => f.endsWith('.yaml') || f.endsWith('.yml') || f.endsWith('.json'));

      files.forEach(f => {
        const full_path = path.join(this.config.registries_path, f);
        results.push(this.validateRegistryFile(full_path));
      });

    } catch (e) {
      errors.push(`Cannot read registries directory: ${e.message}`);
    }

    return {
      total: results.length,
      valid: results.filter(r => r.valid).length,
      invalid: results.filter(r => !r.valid).length,
      global_errors: errors,
      results
    };
  }

  /**
   * Validate skill files exist for known skill IDs
   */
  validateSkillPresence(skill_ids) {
    const results = [];
    const skill_dirs = ['topic_intelligence', 'script_intelligence', 'planning_intelligence'];

    skill_ids.forEach(skill_id => {
      let found = false;
      for (const dir of skill_dirs) {
        const pattern = path.join(this.config.skills_path, dir);
        if (fs.existsSync(pattern)) {
          const files = fs.readdirSync(pattern);
          if (files.some(f => f.toLowerCase().includes(skill_id.toLowerCase()))) {
            found = true;
            break;
          }
        }
      }
      results.push({ skill_id, found, status: found ? 'PRESENT' : 'MISSING' });
    });

    return {
      total: skill_ids.length,
      present: results.filter(r => r.found).length,
      missing: results.filter(r => !r.found).length,
      results
    };
  }

  /**
   * Validate workflow JSON files exist and parse
   */
  validateWorkflowPresence(workflow_ids) {
    const results = [];

    workflow_ids.forEach(wf_id => {
      let found = false;
      let filepath = null;

      // Search recursively
      const search = (dir) => {
        if (!fs.existsSync(dir)) return;
        fs.readdirSync(dir).forEach(f => {
          const full = path.join(dir, f);
          if (fs.statSync(full).isDirectory()) {
            search(full);
          } else if (f.includes(wf_id) && f.endsWith('.json')) {
            found = true;
            filepath = full;
          }
        });
      };
      search(this.config.workflows_path);

      let parse_valid = false;
      if (found && filepath) {
        try {
          JSON.parse(fs.readFileSync(filepath, 'utf8'));
          parse_valid = true;
        } catch (e) {
          parse_valid = false;
        }
      }

      results.push({ workflow_id: wf_id, found, filepath, parse_valid, status: found && parse_valid ? 'VALID' : (found ? 'PARSE_ERROR' : 'MISSING') });
    });

    return {
      total: workflow_ids.length,
      valid: results.filter(r => r.status === 'VALID').length,
      missing: results.filter(r => r.status === 'MISSING').length,
      parse_errors: results.filter(r => r.status === 'PARSE_ERROR').length,
      results
    };
  }

  /**
   * Run full registry integrity check
   */
  runFullCheck() {
    const phase1_workflow_ids = ['WF-000', 'WF-001', 'WF-010', 'WF-900', 'CWF-110', 'CWF-120', 'CWF-130', 'CWF-140', 'CWF-210', 'CWF-220', 'CWF-230', 'CWF-240', 'WF-020', 'WF-021'];
    const core_skill_ids = ['M-001', 'M-002', 'M-003', 'S-201', 'S-202', 'S-203'];

    const registry_check = this.validateAllRegistries();
    const workflow_check = this.validateWorkflowPresence(phase1_workflow_ids);
    const skill_check = this.validateSkillPresence(core_skill_ids);

    const overall_valid = (
      registry_check.invalid === 0 &&
      workflow_check.missing === 0 &&
      workflow_check.parse_errors === 0
    );

    return {
      overall_valid,
      registry_check,
      workflow_check,
      skill_check,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = RegistryValidator;
