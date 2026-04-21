const fs = require('fs');
const SkillRegistryResolver = require('./skill_registry_resolver');
const SkillExecutor = require('./skill_executor');

class SkillLoader {
  constructor(config = {}) {
    this.config = {
      skill_registry_path: config.skill_registry_path || './registries/skill_registry_wf100.yaml',
      skills_root: config.skills_root || './skills',
      timeout_ms: config.timeout_ms || 30000,
      retry_count: config.retry_count || 2,
      strict_dependency_check: config.strict_dependency_check !== false
    };

    this.skills_registry = {};
    this.execution_log = [];
    this.resolver = new SkillRegistryResolver({
      registry_path: this.config.skill_registry_path,
      skills_root: this.config.skills_root
    });
    this.executor = new SkillExecutor({ default_timeout_ms: this.config.timeout_ms });
  }

  async initialize() {
    try {
      const resolution = this.resolver.resolveRegistrySkills();
      if (resolution.missing_skill_files.length > 0) {
        throw new Error(`Registry skills missing files: ${resolution.missing_skill_files.join(', ')}`);
      }

      const contracts = {};
      for (const skillId of resolution.skill_ids) {
        const metadata = resolution.resolved[skillId];
        contracts[skillId] = this.loadSkillContract(metadata.file_path, skillId);
      }

      if (this.config.strict_dependency_check) {
        this.validateDependencyClosure(contracts);
      }

      this.skills_registry = contracts;
      this.log('INFO', 'SkillLoader initialized', {
        registry_skills: resolution.skill_ids.length,
        contract_skills: Object.keys(contracts).length,
        registry_path: this.config.skill_registry_path
      });

      return {
        status: 'initialized',
        skills_loaded: Object.keys(contracts).length,
        registry_path: this.config.skill_registry_path
      };
    } catch (error) {
      this.log('ERROR', 'SkillLoader initialization failed', { error: error.message });
      throw error;
    }
  }

  async resolveSkill(skillId) {
    const skill = this.skills_registry[skillId];
    if (!skill) {
      throw new Error(`Skill ${skillId} not found in loaded registry contracts`);
    }
    return skill;
  }

  loadSkillContract(filePath, expectedSkillId = null) {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = content.includes('SKILL_ID:') ? this.parseLegacySkillContract(content) : this.parseMarkdownSkillContract(content);

    if (!parsed.skill_id) {
      parsed.skill_id = expectedSkillId;
    }
    if (expectedSkillId && parsed.skill_id !== expectedSkillId) {
      throw new Error(`Skill ID mismatch in ${filePath}: expected ${expectedSkillId}, found ${parsed.skill_id}`);
    }

    parsed.file_path = filePath;
    parsed.required_inputs = this.extractRequiredInputs(parsed.input_template);
    parsed.dependencies = Array.isArray(parsed.dependencies) ? parsed.dependencies : [];
    return parsed;
  }

  parseLegacySkillContract(content) {
    const contract = {
      skill_id: this.extractScalarField(content, 'SKILL_ID'),
      skill_name: this.extractScalarField(content, 'NAME'),
      dna_archetype: this.extractScalarField(content, 'DNA_ARCHETYPE'),
      role: this.extractBlockField(content, 'ROLE'),
      dependencies: this.parseDependencies(this.extractBlockField(content, 'DEPENDENCIES')),
      route_map: this.extractBlockField(content, 'ROUTE_MAP'),
      approval_gate: this.extractBlockField(content, 'APPROVAL_GATE'),
      veto_power: this.extractBlockField(content, 'VETO_POWER'),
      immune_signature: this.extractBlockField(content, 'IMMUNE_SIGNATURE'),
      action_trigger: this.extractBlockField(content, 'ACTION_TRIGGER'),
      process: this.extractBlockField(content, 'PROCESS'),
      input_template: this.parseJsonField(content, 'INPUT_VARIABLES'),
      output_template: this.parseJsonField(content, 'OUTPUT_FORMAT')
    };

    if (!contract.output_template || typeof contract.output_template !== 'object') {
      contract.output_template = {
        skill_id: contract.skill_id,
        output_type: `${contract.skill_id ? contract.skill_id.toLowerCase() : 'unknown'}_output`,
        status: 'created',
        payload: {}
      };
    }

    return contract;
  }

  parseMarkdownSkillContract(content) {
    const outputBlocks = this.extractJsonBlocks(content);
    const outputTemplate = this.pickOutputTemplate(outputBlocks);
    const requiredInputs = this.extractRequiredInputsFromMarkdown(content);
    const inputTemplate = {};
    for (const inputKey of requiredInputs) {
      inputTemplate[inputKey] = null;
    }

    return {
      skill_id: this.extractRegex(content, /\*\*Skill ID:\*\*\s*([A-Z]-\d{3})/),
      skill_name: this.extractRegex(content, /\*\*Skill Name:\*\*\s*(.+)/),
      dna_archetype: this.extractRegex(content, /\*\*DNA Archetype:\*\*\s*(.+)/),
      role: this.extractRegex(content, /\*\*Role Definition:\*\*\s*(.+)/) || this.extractSectionParagraph(content, '## 2. Purpose'),
      dependencies: this.parseDependencies(this.extractRegex(content, /\*\*Upstream Dependencies:\*\*\s*(.+)/)),
      route_map: this.extractRegex(content, /\*\*Vein\/Route\/Stage:\*\*\s*(.+)/),
      approval_gate: this.extractRegex(content, /\*\*Approval Gate:\*\*\s*(.+)/) || 'none',
      veto_power: this.extractRegex(content, /\*\*Veto Power:\*\*\s*(.+)/) || 'no',
      immune_signature: this.extractRegex(content, /\*\*Immune Signature:\*\*\s*(.+)/) || '',
      action_trigger: this.extractSectionParagraph(content, '## 5. Inputs'),
      process: this.extractSectionParagraph(content, '## 6. Execution Logic'),
      input_template: inputTemplate,
      output_template: outputTemplate || {
        status: 'created',
        payload: {}
      }
    };
  }

  async executeSkill(skillId, contextPacket, dossierState) {
    const executionId = this.buildExecutionId();
    const startedAt = Date.now();

    try {
      this.log('INFO', 'Starting skill execution', { skill_id: skillId, execution_id: executionId });
      const contract = await this.resolveSkill(skillId);
      const normalizedContext = this.applyContractDefaults(contextPacket, contract.input_template || {});
      this.validateInputs(normalizedContext, contract.required_inputs || []);

      const executionResult = await this.executor.execute(contract, normalizedContext, dossierState);
      this.validateOutputs(executionResult.output);

      const result = {
        execution_id: executionId,
        skill_id: skillId,
        status: executionResult.status,
        output: executionResult.output,
        execution_timestamp: new Date().toISOString(),
        duration_ms: Date.now() - startedAt
      };

      this.log('INFO', 'Skill execution completed', {
        skill_id: skillId,
        execution_id: executionId,
        duration_ms: result.duration_ms
      });
      return result;
    } catch (error) {
      this.log('ERROR', 'Skill execution failed', {
        skill_id: skillId,
        execution_id: executionId,
        error: error.message
      });
      return {
        execution_id: executionId,
        skill_id: skillId,
        status: 'FAILED',
        error: error.message,
        execution_timestamp: new Date().toISOString(),
        duration_ms: Date.now() - startedAt,
        fallback_action: 'escalate_to_wf900'
      };
    }
  }

  async executeSkillChain(skillIds, contextPacket, dossierState) {
    const results = [];
    const accumulatedContext = { ...(contextPacket || {}) };

    for (const skillId of skillIds) {
      const result = await this.executeSkill(skillId, accumulatedContext, dossierState);
      results.push(result);
      if (result.status === 'FAILED') {
        this.log('WARN', 'Skill chain interrupted on skill failure', { skill_id: skillId, next_action: 'escalate' });
        break;
      }
      accumulatedContext[`${skillId}_output`] = result.output;
    }

    return {
      chain_id: `CHAIN-${Date.now()}`,
      skill_count: skillIds.length,
      completed_skills: results.filter((r) => r.status === 'SUCCESS').length,
      failed_skills: results.filter((r) => r.status === 'FAILED').length,
      results,
      accumulated_output: accumulatedContext
    };
  }

  validateInputs(context, requiredInputs) {
    const packet = context || {};
    const missing = requiredInputs.filter((key) => !(key in packet));
    if (missing.length > 0) {
      throw new Error(`Missing required inputs: ${missing.join(', ')}`);
    }
  }

  validateOutputs(output) {
    if (!output || typeof output !== 'object') {
      throw new Error('Invalid output: expected object');
    }
    if (!output.artifact_family && !output.output_type) {
      throw new Error('Invalid output: requires artifact_family or output_type');
    }
  }

  validateDependencyClosure(contracts) {
    const availableSkillIds = new Set(Object.keys(contracts));
    for (const [skillId, contract] of Object.entries(contracts)) {
      for (const dependency of contract.dependencies || []) {
        if (!availableSkillIds.has(dependency)) {
          throw new Error(`Unresolvable dependency for ${skillId}: ${dependency}`);
        }
      }
    }
  }

  extractScalarField(content, fieldName) {
    const regex = new RegExp(`^${fieldName}:\\s*(.+)$`, 'm');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  }

  extractBlockField(content, fieldName) {
    const regex = new RegExp(`${fieldName}:\\s*([\\s\\S]*?)(?=\\n[A-Z_]+:\\s*|$)`, 'm');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  }

  parseJsonField(content, fieldName) {
    const block = this.extractBlockField(content, fieldName);
    if (!block) {
      return {};
    }

    const fromFenced = this.extractJsonFromFence(block);
    if (fromFenced) {
      return fromFenced;
    }
    const fromBraces = this.extractJsonFromBraces(block);
    return fromBraces || {};
  }

  extractJsonBlocks(content) {
    const blocks = [];
    const regex = /```json\s*([\s\S]*?)```/g;
    let match = regex.exec(content);
    while (match) {
      const parsed = this.safeParseJson(match[1].trim());
      if (parsed && typeof parsed === 'object') {
        blocks.push(parsed);
      }
      match = regex.exec(content);
    }
    return blocks;
  }

  pickOutputTemplate(jsonBlocks) {
    for (const block of jsonBlocks) {
      if (block.artifact_family || block.output_type || block.skill_id || block.payload) {
        return block;
      }
    }
    return jsonBlocks[0] || null;
  }

  extractRequiredInputsFromMarkdown(content) {
    const inputSection = this.extractSectionParagraph(content, '## 5. Inputs');
    const keys = [];
    const regex = /- `([^`]+)`/g;
    let match = regex.exec(inputSection);
    while (match) {
      keys.push(match[1].trim());
      match = regex.exec(inputSection);
    }
    return keys;
  }

  extractSectionParagraph(content, heading) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`${escaped}\\s*([\\s\\S]*?)(?=\\n##\\s+\\d+\\.|$)`, 'm');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  }

  extractRegex(content, regex) {
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  }

  parseDependencies(raw) {
    if (!raw) {
      return [];
    }
    return raw
      .replace(/\r/g, '')
      .split(/[\n,]/)
      .map((value) => value.trim())
      .map((value) => value.replace(/^-\s*/, ''))
      .filter((value) => /^[A-Z]-\d{3}$/.test(value));
  }

  extractRequiredInputs(inputTemplate) {
    if (!inputTemplate || typeof inputTemplate !== 'object') {
      return [];
    }
    return Object.keys(inputTemplate);
  }

  applyContractDefaults(contextPacket, inputTemplate) {
    const normalized = { ...(contextPacket || {}) };
    if (!inputTemplate || typeof inputTemplate !== 'object') {
      return normalized;
    }

    for (const [key, defaultValue] of Object.entries(inputTemplate)) {
      if (!(key in normalized)) {
        normalized[key] = defaultValue;
      }
    }

    return normalized;
  }

  extractJsonFromFence(text) {
    const fenced = text.match(/```json\s*([\s\S]*?)```/);
    if (!fenced) {
      return null;
    }
    return this.safeParseJson(fenced[1].trim());
  }

  extractJsonFromBraces(text) {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end < start) {
      return null;
    }
    return this.safeParseJson(text.slice(start, end + 1));
  }

  safeParseJson(raw) {
    try {
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  buildExecutionId() {
    return `SKL-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  log(level, message, data = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...data
    };
    this.execution_log.push(entry);
    if (level === 'ERROR' || level === 'WARN') {
      console.log(`[${level}] ${message}`, data);
    }
  }

  getExecutionLog(filter = {}) {
    let log = this.execution_log;
    if (filter.level) {
      log = log.filter((entry) => entry.level === filter.level);
    }
    if (filter.since) {
      log = log.filter((entry) => new Date(entry.timestamp) > new Date(filter.since));
    }
    return log;
  }

  clearExecutionLog() {
    this.execution_log = [];
  }
}

module.exports = SkillLoader;

if (require.main === module) {
  (async () => {
    const loader = new SkillLoader();
    const initialized = await loader.initialize();
    console.log('SkillLoader Init:', JSON.stringify(initialized, null, 2));

    const testContext = {
      dossier_id: 'TEST-001',
      discovery_brief: {},
      source_refs: []
    };
    const result = await loader.executeSkill('M-001', testContext, {});
    console.log('Skill Execution Result:', JSON.stringify(result, null, 2));
  })();
}
