/**
 * Skill Loader Engine
 * Loads, resolves, and executes skills at runtime
 * Integrates with dossier and packet systems for state management
 */

const fs = require('fs');
const path = require('path');

class SkillLoader {
  constructor(config = {}) {
    this.config = {
      skill_registry_path: config.skill_registry_path || './registries/skill_registry_wf100.yaml',
      dossier_path: config.dossier_path || 'C:/ShadowEmpire/n8n_user/',
      mode: config.mode || 'local',
      timeout_ms: config.timeout_ms || 30000,
      retry_count: config.retry_count || 2
    };

    this.skills_registry = {};
    this.execution_log = [];
  }

  /**
   * Initialize loader - load registry
   */
  async initialize() {
    try {
      const registry_content = this.loadYamlRegistry(this.config.skill_registry_path);
      this.skills_registry = registry_content;
      this.log('INFO', 'SkillLoader initialized', { registry_skills: Object.keys(registry_content).length });
      return { status: 'initialized', skills_loaded: Object.keys(registry_content).length };
    } catch (e) {
      this.log('ERROR', 'SkillLoader initialization failed', { error: e.message });
      throw e;
    }
  }

  /**
   * Load YAML registry (simplified - in real implementation use yaml parser)
   */
  loadYamlRegistry(filepath) {
    try {
      if (fs.existsSync(filepath)) {
        const content = fs.readFileSync(filepath, 'utf8');
        // Parse YAML (simplified - actual implementation needs yaml parser)
        return {
          'M-001': { id: 'M-001', name: 'Global Trend Scanner', version: '1.0.0', owner: 'Narada', type: 'discovery' },
          'M-002': { id: 'M-002', name: 'Topic Opportunity Miner', version: '1.0.0', owner: 'Narada', type: 'discovery' },
          'M-003': { id: 'M-003', name: 'Keyword Intelligence Miner', version: '1.0.0', owner: 'Chanakya', type: 'discovery' },
          'M-004': { id: 'M-004', name: 'Audience Demographic Mapper', version: '1.0.0', owner: 'Chandra', type: 'discovery' }
        };
      }
      return {};
    } catch (e) {
      this.log('WARN', 'Could not load registry file', { path: filepath, error: e.message });
      return {};
    }
  }

  /**
   * Resolve skill by ID
   */
  async resolveSkill(skill_id) {
    const skill_def = this.skills_registry[skill_id];
    if (!skill_def) {
      throw new Error(`Skill ${skill_id} not found in registry`);
    }

    return {
      skill_id: skill_def.id,
      skill_name: skill_def.name,
      version: skill_def.version,
      owner: skill_def.owner,
      type: skill_def.type,
      contract: this.loadSkillContract(skill_id)
    };
  }

  /**
   * Load skill contract (input/output spec)
   */
  loadSkillContract(skill_id) {
    const contracts = {
      'M-001': {
        inputs: ['dossier_id', 'discovery_brief', 'source_refs'],
        outputs: ['trend_signal_set'],
        timeout_ms: 15000
      },
      'M-002': {
        inputs: ['dossier_id', 'trend_signal_set'],
        outputs: ['topic_opportunity_set'],
        timeout_ms: 10000
      },
      'M-003': {
        inputs: ['dossier_id', 'topic_opportunity_set'],
        outputs: ['keyword_intelligence_packet'],
        timeout_ms: 10000
      },
      'M-004': {
        inputs: ['dossier_id', 'audience_segment'],
        outputs: ['audience_mapping_packet'],
        timeout_ms: 8000
      }
    };

    return contracts[skill_id] || { inputs: [], outputs: [], timeout_ms: 10000 };
  }

  /**
   * Execute skill with context and dossier
   */
  async executeSkill(skill_id, context_packet, dossier_state) {
    const execution_id = 'SKL-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    try {
      this.log('INFO', 'Starting skill execution', { skill_id, execution_id });

      const skill = await this.resolveSkill(skill_id);
      const contract = skill.contract;

      // Validate inputs
      this.validateInputs(context_packet, contract.inputs);

      // Execute skill (simulated - real implementation calls actual skill logic)
      const skill_result = await this.executeSkillLogic(skill_id, context_packet, dossier_state);

      // Validate outputs
      this.validateOutputs(skill_result, contract.outputs);

      // Package result
      const result = {
        execution_id: execution_id,
        skill_id: skill_id,
        status: 'SUCCESS',
        output: skill_result,
        execution_timestamp: new Date().toISOString(),
        duration_ms: 0
      };

      this.log('INFO', 'Skill execution completed', { skill_id, execution_id, status: 'SUCCESS' });
      return result;

    } catch (e) {
      this.log('ERROR', 'Skill execution failed', { skill_id, execution_id, error: e.message });

      return {
        execution_id: execution_id,
        skill_id: skill_id,
        status: 'FAILED',
        error: e.message,
        execution_timestamp: new Date().toISOString(),
        fallback_action: 'escalate_to_wf900'
      };
    }
  }

  /**
   * Execute actual skill logic (mocked here, real implementation calls skill files)
   */
  async executeSkillLogic(skill_id, context, dossier) {
    // Simulate skill execution
    // In real implementation, this would call the actual skill files
    const skill_outputs = {
      'M-001': { artifact_family: 'trend_signal_set', signals: [], status: 'CREATED' },
      'M-002': { artifact_family: 'topic_opportunity_set', opportunities: [], status: 'CREATED' },
      'M-003': { artifact_family: 'keyword_intelligence_packet', keywords: [], status: 'CREATED' },
      'M-004': { artifact_family: 'audience_mapping_packet', segments: [], status: 'CREATED' }
    };

    return skill_outputs[skill_id] || { status: 'CREATED', artifact_family: 'unknown' };
  }

  /**
   * Validate inputs match contract
   */
  validateInputs(context, required_inputs) {
    const missing = required_inputs.filter(inp => !(inp in context));
    if (missing.length > 0) {
      throw new Error(`Missing required inputs: ${missing.join(', ')}`);
    }
  }

  /**
   * Validate outputs match contract
   */
  validateOutputs(result, required_outputs) {
    if (!result || !result.artifact_family) {
      throw new Error(`Invalid output: missing artifact_family`);
    }
  }

  /**
   * Execute batch of skills with dependencies
   */
  async executeSkillChain(skill_ids, context_packet, dossier_state) {
    const results = [];
    const accumulated_context = { ...context_packet };

    for (const skill_id of skill_ids) {
      const result = await this.executeSkill(skill_id, accumulated_context, dossier_state);
      results.push(result);

      if (result.status === 'FAILED') {
        this.log('WARN', 'Skill chain interrupted on skill failure', { skill_id, next_action: 'escalate' });
        break;
      }

      // Merge output into accumulated context for next skill
      accumulated_context[skill_id + '_output'] = result.output;
    }

    return {
      chain_id: 'CHAIN-' + Date.now(),
      skill_count: skill_ids.length,
      completed_skills: results.filter(r => r.status === 'SUCCESS').length,
      failed_skills: results.filter(r => r.status === 'FAILED').length,
      results: results,
      accumulated_output: accumulated_context
    };
  }

  /**
   * Logging utility
   */
  log(level, message, data = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level: level,
      message: message,
      ...data
    };
    this.execution_log.push(entry);

    if (level === 'ERROR' || level === 'WARN') {
      console.log(`[${level}] ${message}`, data);
    }
  }

  /**
   * Get execution log
   */
  getExecutionLog(filter = {}) {
    let log = this.execution_log;

    if (filter.level) {
      log = log.filter(e => e.level === filter.level);
    }
    if (filter.since) {
      log = log.filter(e => new Date(e.timestamp) > new Date(filter.since));
    }

    return log;
  }

  /**
   * Clear execution log
   */
  clearExecutionLog() {
    this.execution_log = [];
  }
}

module.exports = SkillLoader;

// Export for testing
if (require.main === module) {
  (async () => {
    const loader = new SkillLoader();
    await loader.initialize();

    const test_context = {
      dossier_id: 'TEST-001',
      topic_seed: 'AI trends',
      discovery_brief: {}
    };

    const result = await loader.executeSkill('M-001', test_context, {});
    console.log('Skill Execution Result:', JSON.stringify(result, null, 2));
  })();
}
