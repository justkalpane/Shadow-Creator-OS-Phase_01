/**
 * Registry Validator
 * Validates registry closure and cross-registry integrity for skills, workflows, schemas, directors, and tests.
 */

const fs = require('fs');
const path = require('path');

class RegistryValidator {
  constructor(config = {}) {
    this.config = {
      registries_path: config.registries_path || './registries',
      skills_path: config.skills_path || './skills',
      tests_path: config.tests_path || './tests/skills'
    };

    this.requiredRegistries = [
      'skill_registry.yaml',
      'workflow_bindings.yaml',
      'director_binding.yaml',
      'schema_registry.yaml',
      'provider_registry.yaml',
      'mode_registry.yaml',
      'governance_rules.yaml'
    ];

    this.requiredSkillSections = [
      'Skill Identity',
      'Purpose',
      'DNA Injection',
      'Workflow Injection',
      'Inputs',
      'Execution Logic',
      'Outputs',
      'Governance',
      'Tool/Runtime Usage',
      'Mutation Law',
      'Best Practices',
      'Validation/Done'
    ];
  }

  validateRegistryFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (!content || !content.trim()) {
        return { valid: false, filepath: filePath, errors: ['Registry file is empty'] };
      }
      return { valid: true, filepath: filePath, errors: [], warnings: [] };
    } catch (error) {
      return {
        valid: false,
        filepath: filePath,
        errors: [`Cannot read registry file: ${error.message}`],
        warnings: []
      };
    }
  }

  validateAllRegistries() {
    const findings = [];
    const fileResults = [];

    for (const fileName of this.requiredRegistries) {
      const fullPath = path.resolve(this.config.registries_path, fileName);
      const exists = fs.existsSync(fullPath);
      if (!exists) {
        findings.push({
          code: 'MISSING_REQUIRED_REGISTRY',
          severity: 'error',
          message: `Missing required registry file: ${fileName}`
        });
        continue;
      }

      const result = this.validateRegistryFile(fullPath);
      fileResults.push(result);
      if (!result.valid) {
        findings.push({
          code: 'INVALID_REGISTRY_FILE',
          severity: 'error',
          message: `${fileName} is invalid: ${result.errors.join('; ')}`
        });
      }
    }

    return {
      valid: !findings.some((row) => row.severity === 'error'),
      file_results: fileResults,
      findings
    };
  }

  runFullCheck() {
    const registryPresence = this.validateAllRegistries();
    const skillRegistryPath = path.resolve(this.config.registries_path, 'skill_registry.yaml');
    const workflowBindingsPath = path.resolve(this.config.registries_path, 'workflow_bindings.yaml');
    const directorBindingPath = path.resolve(this.config.registries_path, 'director_binding.yaml');
    const schemaRegistryPath = path.resolve(this.config.registries_path, 'schema_registry.yaml');

    const findings = [...registryPresence.findings];
    const skillRegistryText = fs.existsSync(skillRegistryPath) ? fs.readFileSync(skillRegistryPath, 'utf8') : '';
    const workflowBindingsText = fs.existsSync(workflowBindingsPath)
      ? fs.readFileSync(workflowBindingsPath, 'utf8')
      : '';
    const directorBindingText = fs.existsSync(directorBindingPath) ? fs.readFileSync(directorBindingPath, 'utf8') : '';
    const schemaRegistryText = fs.existsSync(schemaRegistryPath) ? fs.readFileSync(schemaRegistryPath, 'utf8') : '';

    const skillRegistry = this.parseSkillRegistry(skillRegistryText);
    const skillRegistryPolicy = this.parseSkillRegistryPolicy(skillRegistryText);
    const workflowBindings = this.parseWorkflowBindings(workflowBindingsText);
    const directorBinding = this.parseDirectorBinding(directorBindingText);
    const schemaRegistry = this.parseSchemaRegistry(schemaRegistryText);

    const registeredSkillIds = new Set(skillRegistry.skills.map((row) => row.skill_id));
    const workflowSkillIds = new Set(workflowBindings.bindings.map((row) => row.skill_id));
    const schemaFamilies = new Map(
      schemaRegistry.schemas.filter((row) => row.artifact_family).map((row) => [row.artifact_family, row])
    );
    const directorNames = new Set(directorBinding.directors);
    const authoritativeSkillScope =
      skillRegistryPolicy.authoritative_skill_ids.size > 0
        ? skillRegistryPolicy.authoritative_skill_ids
        : registeredSkillIds;
    const externalSkillDependencies = skillRegistryPolicy.registered_external_dependencies;

    for (const duplicateSkillId of skillRegistry.duplicate_skill_ids) {
      findings.push({
        code: 'DUPLICATE_SKILL_ID',
        severity: 'error',
        message: `Duplicate skill_id in skill_registry.yaml: ${duplicateSkillId}`
      });
    }

    for (const duplicateFamily of schemaRegistry.duplicate_artifact_families) {
      findings.push({
        code: 'DUPLICATE_ARTIFACT_FAMILY',
        severity: 'error',
        message: `Duplicate artifact_family in schema_registry.yaml: ${duplicateFamily}`
      });
    }

    const repoSkillFiles = this.collectSkillFiles();
    for (const repoSkill of repoSkillFiles) {
      if (!authoritativeSkillScope.has(repoSkill.skill_id)) {
        continue;
      }

      if (!registeredSkillIds.has(repoSkill.skill_id)) {
        findings.push({
          code: 'MISSING_SKILL_REGISTRY_ENTRY',
          severity: 'error',
          message: `Skill file ${repoSkill.skill_id} is not registered in skill_registry.yaml`,
          filepath: repoSkill.filepath
        });
      }
    }

    for (const skill of skillRegistry.skills) {
      const skillFilePath = path.resolve(skill.file_path || '');
      if (!skill.file_path || !fs.existsSync(skillFilePath)) {
        findings.push({
          code: 'MISSING_SKILL_FILE',
          severity: 'error',
          message: `${skill.skill_id} file_path missing or not found: ${skill.file_path || 'UNSET'}`
        });
        continue;
      }

      const skillContract = this.validateSkillFileContract(skillFilePath);
      if (!skillContract.template_valid) {
        findings.push({
          code: 'MISSING_12_SECTION_TEMPLATE',
          severity: 'error',
          message: `${skill.skill_id} does not match required 12-section template order`,
          filepath: skillFilePath
        });
      }
      if (skillContract.test_count < 18) {
        findings.push({
          code: 'MISSING_TEST_COVERAGE',
          severity: 'error',
          message: `${skill.skill_id} has ${skillContract.test_count} tests in skill contract (<18 required)`,
          filepath: skillFilePath
        });
      }
      if (!skillContract.has_wf900) {
        findings.push({
          code: 'MISSING_WF900_ESCALATION_PATH',
          severity: 'error',
          message: `${skill.skill_id} skill contract missing WF-900 escalation path`,
          filepath: skillFilePath
        });
      }

      if (!this.hasSkillTestDefinition(skill.skill_id)) {
        findings.push({
          code: 'MISSING_SKILL_TEST_DEFINITION',
          severity: 'error',
          message: `${skill.skill_id} missing tests/skills test definition markdown`
        });
      }

      if (!workflowSkillIds.has(skill.skill_id)) {
        findings.push({
          code: 'MISSING_WORKFLOW_BINDING',
          severity: 'error',
          message: `${skill.skill_id} missing workflow binding entry`
        });
      }

      const binding = workflowBindings.by_skill_id.get(skill.skill_id);
      if (binding) {
        if (binding.on_error && binding.on_error !== 'WF-900') {
          findings.push({
            code: 'INVALID_WORKFLOW_ERROR_ROUTE',
            severity: 'error',
            message: `${skill.skill_id} binding on_error is ${binding.on_error}, expected WF-900`
          });
        }

        if (
          skill.output_packet_family &&
          binding.emitted_packet_family &&
          skill.output_packet_family !== binding.emitted_packet_family
        ) {
          findings.push({
            code: 'PACKET_FAMILY_BINDING_MISMATCH',
            severity: 'error',
            message:
              `${skill.skill_id} output_packet_family ${skill.output_packet_family} ` +
              `!= binding emitted_packet_family ${binding.emitted_packet_family}`
          });
        }
      }

      if (!skill.schema_ref) {
        findings.push({
          code: 'MISSING_SCHEMA_REFERENCE',
          severity: 'error',
          message: `${skill.skill_id} missing schema_ref`
        });
      } else {
        const schemaRefPath = path.resolve(skill.schema_ref);
        if (!fs.existsSync(schemaRefPath)) {
          findings.push({
            code: 'MISSING_SCHEMA_FILE',
            severity: 'error',
            message: `${skill.skill_id} schema_ref file does not exist: ${skill.schema_ref}`
          });
        }
      }

      // WAVE 1 ADDITION: Validate output packet family parity against canonical mXXX_packet pattern
      const parity = this.validateOutputPacketParity(skill.skill_id, skillContract);
      if (!parity.is_valid) {
        findings.push({
          code: 'OUTPUT_PACKET_FAMILY_PARITY_DRIFT',
          severity: 'error',
          message: `${skill.skill_id} output packet family parity drift: ${parity.error_detail}`,
          filepath: skillFilePath
        });
      }

      if (skill.output_packet_family && !schemaFamilies.has(skill.output_packet_family)) {
        findings.push({
          code: 'MISSING_SCHEMA_REGISTRY_ENTRY',
          severity: 'error',
          message: `${skill.skill_id} output_packet_family ${skill.output_packet_family} missing in schema_registry`
        });
      }

      for (const upstream of skill.upstream_skill_dependencies) {
        if (!registeredSkillIds.has(upstream) && !externalSkillDependencies.has(upstream)) {
          findings.push({
            code: 'UNRESOLVED_UPSTREAM_DEPENDENCY',
            severity: 'error',
            message: `${skill.skill_id} upstream dependency ${upstream} not found in skill_registry`
          });
        }
      }

      for (const downstream of skill.downstream_skill_consumers) {
        if (!registeredSkillIds.has(downstream) && !externalSkillDependencies.has(downstream)) {
          findings.push({
            code: 'UNRESOLVED_DOWNSTREAM_DEPENDENCY',
            severity: 'error',
            message: `${skill.skill_id} downstream consumer ${downstream} not found in skill_registry`
          });
        }
      }

      if (skill.owner_director && !directorNames.has(skill.owner_director)) {
        findings.push({
          code: 'MISSING_DIRECTOR_BINDING',
          severity: 'error',
          message: `${skill.skill_id} owner_director ${skill.owner_director} not found in director_binding`
        });
      }

      if (skill.strategic_authority_director && !directorNames.has(skill.strategic_authority_director)) {
        findings.push({
          code: 'MISSING_DIRECTOR_BINDING',
          severity: 'error',
          message:
            `${skill.skill_id} strategic_authority_director ${skill.strategic_authority_director} ` +
            'not found in director_binding'
        });
      }
    }

    return this.buildResult(!findings.some((row) => row.severity === 'error'), findings, {
      registry_presence: registryPresence,
      skill_registry_stats: {
        skills: skillRegistry.skills.length,
        duplicate_skill_ids: skillRegistry.duplicate_skill_ids.length,
        closure_mode: skillRegistryPolicy.closure_mode,
        authoritative_scope_size: authoritativeSkillScope.size,
        registered_external_dependencies: externalSkillDependencies.size
      },
      workflow_binding_stats: {
        bindings: workflowBindings.bindings.length
      },
      director_binding_stats: {
        directors: directorBinding.directors.length
      },
      schema_registry_stats: {
        schemas: schemaRegistry.schemas.length,
        duplicate_artifact_families: schemaRegistry.duplicate_artifact_families.length
      }
    });
  }

  parseSkillRegistryPolicy(text) {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const authoritativeSkillIds = new Set();
    const registeredExternalDependencies = new Set();
    let closureMode = 'full_estate';
    let listMode = null;

    for (const line of lines) {
      const closureModeMatch = line.match(/^\s*closure_mode:\s*([a-zA-Z0-9_-]+)\s*$/);
      if (closureModeMatch) {
        closureMode = closureModeMatch[1].trim();
      }

      if (/^\s*authoritative_for:\s*$/.test(line)) {
        listMode = 'authoritative_for';
        continue;
      }

      if (/^\s*registered_external_dependencies:\s*$/.test(line)) {
        listMode = 'registered_external_dependencies';
        continue;
      }

      const listItem = line.match(/^\s*-\s*(M-\d{3})\s*$/);
      if (listItem && listMode === 'authoritative_for') {
        authoritativeSkillIds.add(listItem[1]);
        continue;
      }
      if (listItem && listMode === 'registered_external_dependencies') {
        registeredExternalDependencies.add(listItem[1]);
        continue;
      }

      if (!/^\s*-\s*/.test(line) && /^\s*[a-zA-Z0-9_]+:\s*/.test(line)) {
        listMode = null;
      }
    }

    return {
      closure_mode: closureMode,
      authoritative_skill_ids: authoritativeSkillIds,
      registered_external_dependencies: registeredExternalDependencies
    };
  }

  validateSkillPresence(skillIds) {
    const files = this.collectSkillFiles();
    const available = new Set(files.map((row) => row.skill_id));
    const results = skillIds.map((skillId) => ({
      skill_id: skillId,
      found: available.has(skillId),
      status: available.has(skillId) ? 'PRESENT' : 'MISSING'
    }));

    return {
      total: results.length,
      present: results.filter((row) => row.found).length,
      missing: results.filter((row) => !row.found).length,
      results
    };
  }

  validateWorkflowPresence(workflowIds) {
    const workflowFiles = this.walkFiles(path.resolve('./n8n/workflows'), (file) => file.endsWith('.json'));
    const byId = new Map();

    for (const file of workflowFiles) {
      const workflowId = this.extractWorkflowId(file);
      if (workflowId && !byId.has(workflowId)) {
        byId.set(workflowId, file);
      }
    }

    const results = workflowIds.map((workflowId) => {
      const filePath = byId.get(workflowId);
      if (!filePath) {
        return {
          workflow_id: workflowId,
          found: false,
          filepath: null,
          parse_valid: false,
          status: 'MISSING'
        };
      }

      try {
        JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return {
          workflow_id: workflowId,
          found: true,
          filepath: filePath,
          parse_valid: true,
          status: 'VALID'
        };
      } catch (_) {
        return {
          workflow_id: workflowId,
          found: true,
          filepath: filePath,
          parse_valid: false,
          status: 'PARSE_ERROR'
        };
      }
    });

    return {
      total: results.length,
      valid: results.filter((row) => row.status === 'VALID').length,
      missing: results.filter((row) => row.status === 'MISSING').length,
      parse_errors: results.filter((row) => row.status === 'PARSE_ERROR').length,
      results
    };
  }

  parseSkillRegistry(text) {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const skills = [];
    const duplicateSkillIds = [];
    const seen = new Set();
    let inSkillsSection = false;
    let current = null;
    let currentListKey = null;

    const flush = () => {
      if (current) {
        if (seen.has(current.skill_id)) {
          duplicateSkillIds.push(current.skill_id);
        } else {
          seen.add(current.skill_id);
          skills.push(current);
        }
      }
      current = null;
      currentListKey = null;
    };

    for (const line of lines) {
      if (/^\s*skills:\s*$/.test(line)) {
        inSkillsSection = true;
        continue;
      }

      if (!inSkillsSection) {
        continue;
      }

      const start = line.match(/^\s*-\s*skill_id:\s*(M-\d{3})\s*$/);
      if (start) {
        flush();
        current = {
          skill_id: start[1],
          file_path: null,
          owner_director: null,
          strategic_authority_director: null,
          schema_ref: null,
          output_packet_family: null,
          upstream_skill_dependencies: [],
          downstream_skill_consumers: []
        };
        continue;
      }

      if (!current) {
        continue;
      }

      const scalar = line.match(/^\s*([a-zA-Z0-9_]+):\s*(.*?)\s*$/);
      if (scalar) {
        const key = scalar[1];
        const value = scalar[2];
        if (key === 'upstream_skill_dependencies' || key === 'downstream_skill_consumers') {
          currentListKey = key;
        } else {
          currentListKey = null;
          if (value !== '') {
            current[key] = value;
          }
        }
        continue;
      }

      const listItem = line.match(/^\s*-\s*(M-\d{3})\s*$/);
      if (listItem && currentListKey) {
        current[currentListKey].push(listItem[1]);
      }
    }

    flush();

    return {
      skills,
      duplicate_skill_ids: [...new Set(duplicateSkillIds)]
    };
  }

  parseWorkflowBindings(text) {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const bindings = [];
    let inBindings = false;
    let current = null;
    let inRouting = false;

    const flush = () => {
      if (current) {
        bindings.push(current);
      }
      current = null;
      inRouting = false;
    };

    for (const line of lines) {
      if (/^\s*bindings:\s*$/.test(line)) {
        inBindings = true;
        continue;
      }

      if (!inBindings) {
        continue;
      }

      const start = line.match(/^\s*-\s*skill_id:\s*(M-\d{3})\s*$/);
      if (start) {
        flush();
        current = {
          skill_id: start[1],
          emitted_packet_family: null,
          on_error: null,
          on_replay: null
        };
        continue;
      }

      if (!current) {
        continue;
      }

      const packetFamily = line.match(/^\s*emitted_packet_family:\s*([a-zA-Z0-9_-]+)\s*$/);
      if (packetFamily) {
        current.emitted_packet_family = packetFamily[1];
        continue;
      }

      if (/^\s*routing:\s*$/.test(line)) {
        inRouting = true;
        continue;
      }

      if (inRouting) {
        const onError = line.match(/^\s*on_error:\s*([A-Z0-9-]+)\s*$/);
        if (onError) {
          current.on_error = onError[1];
          continue;
        }

        const onReplay = line.match(/^\s*on_replay:\s*([A-Z0-9-]+)\s*$/);
        if (onReplay) {
          current.on_replay = onReplay[1];
        }
      }
    }

    flush();

    return {
      bindings,
      by_skill_id: new Map(bindings.map((row) => [row.skill_id, row]))
    };
  }

  parseDirectorBinding(text) {
    const directors = [];
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*-\s*canonical_name:\s*(.+?)\s*$/);
      if (match) {
        directors.push(match[1].trim());
      }
    }
    return { directors };
  }

  parseSchemaRegistry(text) {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const schemas = [];
    const duplicateArtifactFamilies = [];
    const seen = new Set();
    let current = null;

    const flush = () => {
      if (current) {
        if (seen.has(current.artifact_family)) {
          duplicateArtifactFamilies.push(current.artifact_family);
        } else {
          seen.add(current.artifact_family);
          schemas.push(current);
        }
      }
      current = null;
    };

    for (const line of lines) {
      const start = line.match(/^\s*-\s*artifact_family:\s*([a-zA-Z0-9_-]+)\s*$/);
      if (start) {
        flush();
        current = { artifact_family: start[1], schema_path: null };
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

    return {
      schemas,
      duplicate_artifact_families: [...new Set(duplicateArtifactFamilies)]
    };
  }

  collectSkillFiles() {
    const files = this.walkFiles(path.resolve(this.config.skills_path), (file) => file.endsWith('.skill.md'));
    return files
      .map((file) => {
        const match = path.basename(file).match(/(M-\d{3})/);
        if (!match) {
          return null;
        }
        return {
          skill_id: match[1],
          filepath: file
        };
      })
      .filter(Boolean);
  }

  validateSkillFileContract(filePath) {
    const text = fs.readFileSync(filePath, 'utf8');
    const sectionHeaders = [];
    const sectionRegex = /^##\s+\d+\.\s+(.+)$/gm;
    let sectionMatch = sectionRegex.exec(text);
    while (sectionMatch) {
      sectionHeaders.push(sectionMatch[1].trim());
      sectionMatch = sectionRegex.exec(text);
    }

    const templateValid =
      sectionHeaders.length >= this.requiredSkillSections.length &&
      this.requiredSkillSections.every((section, index) => sectionHeaders[index] === section);

    const testMatches = text.match(/TEST-[A-Z0-9-]+/g) || [];
    const hasWf900 = text.includes('WF-900');

    // Extract skill_id and output_packet_family for parity validation
    const skillIdMatch = text.match(/\*\*Skill ID:\*\*\s*(M-\d{3})/);
    const skillId = skillIdMatch ? skillIdMatch[1] : null;
    const outputPacketFamilyMatch = text.match(/Output Packet Family:\s*(m\d{3}_packet)/);
    const declaredPacketFamily = outputPacketFamilyMatch ? outputPacketFamilyMatch[1] : null;
    const schemaRefMatch = text.match(/Schema Reference:\s*(schemas\/packets\/[^\s]+\.schema\.json)/);
    const schemaRef = schemaRefMatch ? schemaRefMatch[1] : null;

    return {
      template_valid: templateValid,
      detected_sections: sectionHeaders,
      test_count: testMatches.length,
      has_wf900: hasWf900,
      skill_id: skillId,
      output_packet_family: declaredPacketFamily ||
        (skillId ? `m${skillId.replace(/[^0-9]/g, '')}_packet` : null),
      schema_ref: schemaRef ||
        (skillId ? `schemas/packets/m${skillId.replace(/[^0-9]/g, '')}_packet.schema.json` : null)
    };
  }

  hasSkillTestDefinition(skillId) {
    const testFiles = this.walkFiles(path.resolve(this.config.tests_path), (file) => file.endsWith('.md'));
    return testFiles.some((file) => path.basename(file).includes(skillId));
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

  extractWorkflowId(filePath) {
    const match = path.basename(filePath).match(/(CWF-\d{3}|WF-\d{3})/);
    return match ? match[1] : null;
  }

  validateOutputPacketParity(skillId, skillContract) {
    // Extract numeric part from skill_id (M-021 -> 021)
    const skillNum = skillId.replace(/[^0-9]/g, '');
    const expectedPacketFamily = `m${skillNum}_packet`;
    const expectedSchema = `schemas/packets/m${skillNum}_packet.schema.json`;

    // Get declared values from skill contract
    const declaredPacketFamily = skillContract?.output_packet_family || null;
    const declaredSchema = skillContract?.schema_ref || null;

    // Validate packet family parity
    if (!declaredPacketFamily) {
      return {
        is_valid: false,
        error_detail: `Missing output_packet_family declaration (expected: ${expectedPacketFamily})`
      };
    }

    if (declaredPacketFamily !== expectedPacketFamily) {
      return {
        is_valid: false,
        error_detail: `Declared ${declaredPacketFamily} != Expected ${expectedPacketFamily}`
      };
    }

    // Validate schema_ref parity
    if (!declaredSchema) {
      return {
        is_valid: false,
        error_detail: `Missing schema_ref declaration (expected: ${expectedSchema})`
      };
    }

    if (declaredSchema !== expectedSchema) {
      return {
        is_valid: false,
        error_detail: `Declared ${declaredSchema} != Expected ${expectedSchema}`
      };
    }

    // All parity checks passed
    return {
      is_valid: true,
      error_detail: null
    };
  }

  buildResult(overallValid, findings, extra = {}) {
    return {
      overall_valid: overallValid,
      findings,
      ...extra,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = RegistryValidator;
