/**
 * Workflow Validator
 * Validates executable n8n workflows and canonical workflow manifest consistency.
 */

const fs = require('fs');
const path = require('path');

class WorkflowValidator {
  constructor(config = {}) {
    this.config = {
      workflows_path: config.workflows_path || './n8n/workflows',
      workflow_bindings_path: config.workflow_bindings_path || './registries/workflow_bindings.yaml'
    };

    this.required_meta_fields = [
      'workflow_id',
      'phase',
      'vein',
      'purpose',
      'implementation_depth',
      'owner_director',
      'next_workflow'
    ];
    this.required_node_fields = ['parameters', 'id', 'name', 'type', 'typeVersion', 'position'];
    this.production_depth = 'production_grade';
  }

  validate(workflow, sourcePath = 'INLINE') {
    const errors = [];
    const warnings = [];

    if (!workflow || typeof workflow !== 'object' || Array.isArray(workflow)) {
      return this.buildInvalidResult(sourcePath, 'UNKNOWN', ['Workflow is not a valid object'], []);
    }

    if (!workflow.name) {
      errors.push('Missing workflow name');
    }
    if (!Array.isArray(workflow.nodes) || workflow.nodes.length === 0) {
      errors.push('Missing or empty nodes array');
    }
    if (!workflow.connections || typeof workflow.connections !== 'object') {
      errors.push('Missing connections object');
    }
    if (!workflow.meta || typeof workflow.meta !== 'object') {
      errors.push('Missing meta object');
    }

    const workflowId = workflow.meta?.workflow_id || this.inferWorkflowIdFromPath(sourcePath);
    if (workflow.meta && typeof workflow.meta === 'object') {
      for (const field of this.required_meta_fields) {
        if (!workflow.meta[field]) {
          errors.push(`Missing meta.${field}`);
        }
      }
      if (workflow.meta.implementation_depth !== this.production_depth) {
        warnings.push(
          `implementation_depth is "${workflow.meta.implementation_depth}", expected "${this.production_depth}"`
        );
      }
    }

    const nodeValidation = this.validateNodes(workflow.nodes || []);
    errors.push(...nodeValidation.errors);
    warnings.push(...nodeValidation.warnings);

    const connectionValidation = this.validateConnections(workflow.nodes || [], workflow.connections || {});
    errors.push(...connectionValidation.errors);
    warnings.push(...connectionValidation.warnings);

    const cycleValidation = this.detectCircularNodeDependencies(workflow.nodes || [], workflow.connections || {});
    if (cycleValidation.has_cycle) {
      errors.push(`Circular node dependency detected: ${cycleValidation.cycles.join(' | ')}`);
    }

    if (!this.hasWf900Escalation(workflow)) {
      errors.push('Missing WF-900 escalation path in workflow definition');
    }

    return {
      valid: errors.length === 0,
      workflow_id: workflowId,
      filepath: sourcePath,
      errors,
      warnings,
      node_count: Array.isArray(workflow.nodes) ? workflow.nodes.length : 0
    };
  }

  validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let workflow;
      try {
        workflow = JSON.parse(content);
      } catch (error) {
        return this.buildInvalidResult(filePath, this.inferWorkflowIdFromPath(filePath), [
          `Invalid n8n JSON: ${error.message}`
        ]);
      }

      return this.validate(workflow, filePath);
    } catch (error) {
      return this.buildInvalidResult(filePath, this.inferWorkflowIdFromPath(filePath), [
        `Cannot read workflow file: ${error.message}`
      ]);
    }
  }

  validateDirectory(dirPath = this.config.workflows_path) {
    const files = this.walkFiles(dirPath, (file) => file.endsWith('.json'));
    const results = files.map((file) => this.validateFile(file));

    return {
      total: results.length,
      valid: results.filter((row) => row.valid).length,
      invalid: results.filter((row) => !row.valid).length,
      results
    };
  }

  validateCanonicalWorkflowManifest() {
    const findings = [];
    const registryPath = path.resolve(this.config.workflow_bindings_path);
    if (!fs.existsSync(registryPath)) {
      findings.push({
        code: 'MISSING_WORKFLOW_BINDINGS_REGISTRY',
        severity: 'error',
        message: `Missing workflow bindings registry: ${registryPath}`
      });
      return {
        valid: false,
        manifest_entries: [],
        findings
      };
    }

    const text = fs.readFileSync(registryPath, 'utf8').replace(/\r\n/g, '\n');
    const entries = this.parseCanonicalWorkflowEntries(text);

    for (const entry of entries) {
      if (!entry.workflow_id || !entry.canonical_json) {
        findings.push({
          code: 'INCOMPLETE_CANONICAL_WORKFLOW_ENTRY',
          severity: 'error',
          message: `Incomplete canonical workflow entry: ${JSON.stringify(entry)}`
        });
        continue;
      }

      const fullPath = path.resolve(entry.canonical_json);
      if (!fs.existsSync(fullPath)) {
        findings.push({
          code: 'MISSING_CANONICAL_WORKFLOW_JSON',
          severity: 'error',
          message: `${entry.workflow_id} missing canonical JSON at ${entry.canonical_json}`
        });
        continue;
      }

      try {
        JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      } catch (error) {
        findings.push({
          code: 'INVALID_CANONICAL_WORKFLOW_JSON',
          severity: 'error',
          message: `${entry.workflow_id} JSON parse failed at ${entry.canonical_json}: ${error.message}`
        });
      }

      if (entry.wf900_error_route && entry.wf900_error_route !== 'WF-900') {
        findings.push({
          code: 'WF900_ROUTE_MISMATCH',
          severity: 'error',
          message: `${entry.workflow_id} wf900_error_route is ${entry.wf900_error_route}, expected WF-900`
        });
      }
    }

    return {
      valid: !findings.some((row) => row.severity === 'error'),
      manifest_entries: entries,
      findings
    };
  }

  validateWorkflowReferenceClosure(workflowResults) {
    const findings = [];
    const parseableWorkflows = [];
    for (const row of workflowResults) {
      try {
        const content = JSON.parse(fs.readFileSync(row.filepath, 'utf8'));
        parseableWorkflows.push({
          workflow_id: content.meta?.workflow_id || row.workflow_id || this.inferWorkflowIdFromPath(row.filepath),
          workflow: content
        });
      } catch (_) {
        // Invalid JSON is already reported by validateFile; skip graph analysis for this row.
      }
    }

    const knownIds = new Set(parseableWorkflows.map((row) => row.workflow_id).filter(Boolean));
    const workflowById = new Map();

    for (const row of parseableWorkflows) {
      workflowById.set(row.workflow_id, row.workflow);
    }

    const graph = new Map();
    for (const [workflowId, workflow] of workflowById.entries()) {
      const refs = new Set();
      const nextWorkflow = workflow.meta?.next_workflow;
      if (typeof nextWorkflow === 'string' && nextWorkflow.trim()) {
        refs.add(nextWorkflow.trim());
      }
      graph.set(workflowId, refs);

      for (const ref of refs) {
        if (!knownIds.has(ref) && ref !== 'WF-900') {
          findings.push({
            code: 'WORKFLOW_DANGLING_REFERENCE',
            severity: 'error',
            message: `${workflowId} references missing next_workflow ${ref}`
          });
        }
      }
    }

    const cycleCheck = this.detectWorkflowCycles(graph);
    for (const cycle of cycleCheck.cycles) {
      findings.push({
        code: 'CIRCULAR_WORKFLOW_DEPENDENCY',
        severity: 'error',
        message: `Circular workflow dependency: ${cycle}`
      });
    }

    return {
      valid: findings.length === 0,
      findings
    };
  }

  runFullCheck() {
    const directory = this.validateDirectory(this.config.workflows_path);
    const manifest = this.validateCanonicalWorkflowManifest();
    const closure = this.validateWorkflowReferenceClosure(directory.results);

    const findings = [
      ...directory.results
        .filter((row) => !row.valid)
        .flatMap((row) =>
          row.errors.map((message) => ({
            code: 'INVALID_WORKFLOW',
            severity: 'error',
            message: `${row.workflow_id}: ${message}`,
            filepath: row.filepath
          }))
        ),
      ...manifest.findings,
      ...closure.findings
    ];

    return {
      overall_valid: findings.length === 0,
      workflow_directory: directory,
      canonical_manifest: manifest,
      reference_closure: closure,
      findings,
      timestamp: new Date().toISOString()
    };
  }

  validateNodes(nodes) {
    const errors = [];
    const warnings = [];
    const nodeIds = new Set();
    const nodeNames = new Set();

    nodes.forEach((node, index) => {
      for (const field of this.required_node_fields) {
        if (!(field in node)) {
          errors.push(`Node[${index}] (${node.name || 'unnamed'}) missing field: ${field}`);
        }
      }

      if (node.id) {
        if (nodeIds.has(node.id)) {
          errors.push(`Duplicate node.id detected: ${node.id}`);
        }
        nodeIds.add(node.id);
      }

      if (node.name) {
        if (nodeNames.has(node.name)) {
          warnings.push(`Duplicate node.name detected: ${node.name}`);
        }
        nodeNames.add(node.name);
      } else {
        errors.push(`Node[${index}] missing name`);
      }
    });

    return { errors, warnings };
  }

  validateConnections(nodes, connections) {
    const errors = [];
    const warnings = [];
    const nodeNames = new Set(nodes.map((node) => node.name).filter(Boolean));

    for (const [source, definition] of Object.entries(connections || {})) {
      if (!nodeNames.has(source)) {
        errors.push(`Connection source "${source}" not found in nodes`);
      }

      const outputs = Array.isArray(definition.main) ? definition.main : [];
      for (const targetGroup of outputs) {
        if (!Array.isArray(targetGroup)) {
          continue;
        }
        for (const target of targetGroup) {
          if (target?.node && !nodeNames.has(target.node)) {
            errors.push(`Connection target "${target.node}" not found in nodes`);
          }
        }
      }
    }

    for (const node of nodeNames) {
      const hasOutgoing = Object.prototype.hasOwnProperty.call(connections, node);
      if (!hasOutgoing && !this.nodeLooksTerminal(node)) {
        warnings.push(`Node "${node}" has no outgoing connection`);
      }
    }

    return { errors, warnings };
  }

  detectCircularNodeDependencies(nodes, connections) {
    const adjacency = new Map();
    for (const node of nodes) {
      adjacency.set(node.name, new Set());
    }

    for (const [source, definition] of Object.entries(connections || {})) {
      const outputs = Array.isArray(definition.main) ? definition.main : [];
      for (const targetGroup of outputs) {
        if (!Array.isArray(targetGroup)) {
          continue;
        }
        for (const target of targetGroup) {
          if (source && target?.node) {
            if (!adjacency.has(source)) {
              adjacency.set(source, new Set());
            }
            adjacency.get(source).add(target.node);
          }
        }
      }
    }

    const visiting = new Set();
    const visited = new Set();
    const stack = [];
    const cycles = [];

    const dfs = (node) => {
      if (visiting.has(node)) {
        const idx = stack.indexOf(node);
        if (idx >= 0) {
          cycles.push([...stack.slice(idx), node].join(' -> '));
        }
        return;
      }
      if (visited.has(node)) {
        return;
      }

      visiting.add(node);
      stack.push(node);
      for (const target of adjacency.get(node) || []) {
        dfs(target);
      }
      stack.pop();
      visiting.delete(node);
      visited.add(node);
    };

    for (const node of adjacency.keys()) {
      dfs(node);
    }

    return {
      has_cycle: cycles.length > 0,
      cycles: [...new Set(cycles)]
    };
  }

  detectWorkflowCycles(graph) {
    const visiting = new Set();
    const visited = new Set();
    const stack = [];
    const cycles = [];

    const dfs = (node) => {
      if (visiting.has(node)) {
        const idx = stack.indexOf(node);
        if (idx >= 0) {
          cycles.push([...stack.slice(idx), node].join(' -> '));
        }
        return;
      }
      if (visited.has(node)) {
        return;
      }

      visiting.add(node);
      stack.push(node);
      for (const target of graph.get(node) || []) {
        if (graph.has(target)) {
          dfs(target);
        }
      }
      stack.pop();
      visiting.delete(node);
      visited.add(node);
    };

    for (const node of graph.keys()) {
      dfs(node);
    }

    return {
      has_cycle: cycles.length > 0,
      cycles: [...new Set(cycles)]
    };
  }

  hasWf900Escalation(workflow) {
    return JSON.stringify(workflow).includes('WF-900');
  }

  parseCanonicalWorkflowEntries(text) {
    const lines = text.split('\n');
    const entries = [];
    let inCanonicalBlock = false;
    let current = null;

    const flush = () => {
      if (current) {
        entries.push(current);
      }
      current = null;
    };

    for (const line of lines) {
      if (/^\s*canonical_workflow_jsons:\s*$/.test(line)) {
        inCanonicalBlock = true;
        continue;
      }

      if (!inCanonicalBlock) {
        continue;
      }

      const startMatch = line.match(/^\s*-\s*workflow_id:\s*([A-Z0-9-]+)\s*$/);
      if (startMatch) {
        flush();
        current = {
          workflow_id: startMatch[1],
          canonical_json: null,
          wf900_error_route: null
        };
        continue;
      }

      if (!current) {
        continue;
      }

      const canonicalMatch = line.match(/^\s*canonical_json:\s*(.+?)\s*$/);
      if (canonicalMatch) {
        current.canonical_json = canonicalMatch[1].trim();
        continue;
      }

      const wf900Match = line.match(/^\s*wf900_error_route:\s*([A-Z0-9-]+)\s*$/);
      if (wf900Match) {
        current.wf900_error_route = wf900Match[1].trim();
      }
    }

    flush();
    return entries;
  }

  walkFiles(root, predicate) {
    const out = [];
    const absolute = path.resolve(root);
    if (!fs.existsSync(absolute)) {
      return out;
    }

    for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
      const full = path.join(absolute, entry.name);
      if (entry.isDirectory()) {
        out.push(...this.walkFiles(full, predicate));
      } else if (entry.isFile() && predicate(full)) {
        out.push(full);
      }
    }
    return out;
  }

  nodeLooksTerminal(name) {
    const lowered = String(name || '').toLowerCase();
    return (
      lowered.includes('completion') ||
      lowered.includes('error routing') ||
      lowered.includes('terminal') ||
      lowered.includes('end')
    );
  }

  inferWorkflowIdFromPath(filePath) {
    const base = path.basename(filePath || '');
    const match = base.match(/(CWF-\d{3}|WF-\d{3})/);
    return match ? match[1] : 'UNKNOWN';
  }

  buildInvalidResult(filePath, workflowId, errors, warnings = []) {
    return {
      valid: false,
      workflow_id: workflowId,
      filepath: filePath,
      errors,
      warnings,
      node_count: 0
    };
  }
}

module.exports = WorkflowValidator;
