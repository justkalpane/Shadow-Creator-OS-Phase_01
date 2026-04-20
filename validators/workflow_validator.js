/**
 * Workflow Validator
 * Validates n8n workflow JSON structure: required fields, node completeness, connection integrity.
 */

const fs = require('fs');

class WorkflowValidator {
  constructor() {
    this.required_meta_fields = ['workflow_id', 'phase', 'vein', 'purpose', 'implementation_depth', 'owner_director', 'next_workflow'];
    this.required_node_fields = ['parameters', 'id', 'name', 'type', 'typeVersion', 'position'];
    this.production_depth = 'production_grade';
  }

  /**
   * Validate a workflow JSON object
   */
  validate(workflow) {
    const errors = [];
    const warnings = [];

    if (!workflow || typeof workflow !== 'object') {
      return { valid: false, errors: ['Workflow is not a valid object'] };
    }

    // 1. Top-level fields
    if (!workflow.name) errors.push('Missing workflow name');
    if (!Array.isArray(workflow.nodes) || workflow.nodes.length === 0) errors.push('Missing or empty nodes array');
    if (!workflow.connections || typeof workflow.connections !== 'object') errors.push('Missing connections object');
    if (!workflow.meta) errors.push('Missing meta object');

    // 2. Meta validation
    if (workflow.meta) {
      const meta = workflow.meta;
      this.required_meta_fields.forEach(f => {
        if (!meta[f]) errors.push(`Missing meta.${f}`);
      });
      if (meta.implementation_depth !== this.production_depth) {
        warnings.push(`implementation_depth is "${meta.implementation_depth}", expected "${this.production_depth}"`);
      }
    }

    // 3. Node validation
    if (Array.isArray(workflow.nodes)) {
      workflow.nodes.forEach((node, i) => {
        this.required_node_fields.forEach(f => {
          if (!(f in node)) errors.push(`Node[${i}] (${node.name || 'unnamed'}) missing field: ${f}`);
        });
        if (!node.id) errors.push(`Node[${i}] missing id`);
      });
    }

    // 4. Connection integrity: every connection target must be a valid node name
    if (workflow.connections && Array.isArray(workflow.nodes)) {
      const node_names = new Set(workflow.nodes.map(n => n.name));
      Object.entries(workflow.connections).forEach(([source, conn]) => {
        if (!node_names.has(source)) errors.push(`Connection source "${source}" not found in nodes`);
        (conn.main || []).forEach(outputs => {
          (outputs || []).forEach(target => {
            if (target.node && !node_names.has(target.node)) {
              errors.push(`Connection target "${target.node}" not found in nodes`);
            }
          });
        });
      });
    }

    // 5. Active flag
    if (workflow.active !== true) warnings.push('Workflow active flag is not true');

    return {
      valid: errors.length === 0,
      workflow_id: workflow.meta?.workflow_id || 'UNKNOWN',
      errors,
      warnings,
      node_count: workflow.nodes?.length || 0
    };
  }

  /**
   * Validate workflow file from path
   */
  validateFile(filepath) {
    try {
      const content = fs.readFileSync(filepath, 'utf8');
      const workflow = JSON.parse(content);
      const result = this.validate(workflow);
      return { ...result, filepath };
    } catch (e) {
      return { valid: false, filepath, errors: [`Parse error: ${e.message}`], warnings: [] };
    }
  }

  /**
   * Validate all workflow files in a directory
   */
  validateDirectory(dir_path) {
    const results = [];
    const files = fs.readdirSync(dir_path, { recursive: true })
      .filter(f => f.endsWith('.json'))
      .map(f => `${dir_path}/${f}`);

    files.forEach(f => results.push(this.validateFile(f)));

    return {
      total: results.length,
      valid: results.filter(r => r.valid).length,
      invalid: results.filter(r => !r.valid).length,
      results
    };
  }
}

module.exports = WorkflowValidator;
