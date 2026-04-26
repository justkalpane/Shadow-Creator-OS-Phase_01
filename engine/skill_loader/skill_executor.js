class SkillExecutor {
  constructor(config = {}) {
    this.config = {
      default_timeout_ms: config.default_timeout_ms || 30000,
      enforce_deterministic_contract: config.enforce_deterministic_contract !== false
    };
  }

  async execute(skillContract, contextPacket, dossierState) {
    const startedAt = Date.now();

    try {
      this.validateExecutionContract(skillContract, contextPacket);
      const output = this.buildOutput(skillContract, contextPacket, dossierState);
      return {
        status: 'SUCCESS',
        output,
        duration_ms: Date.now() - startedAt,
        deterministic: true
      };
    } catch (error) {
      return {
        status: 'FAILED',
        output: {
          artifact_family: 'runtime_error_packet',
          schema_version: '1.0.0',
          producer_workflow: 'skill_executor',
          status: 'FAILED',
          payload: {
            skill_id: skillContract?.skill_id || 'UNKNOWN',
            error: error.message,
            route_to_workflow: 'WF-900'
          }
        },
        error: error.message,
        duration_ms: Date.now() - startedAt,
        next_workflow: 'WF-900'
      };
    }
  }

  validateExecutionContract(skillContract, contextPacket) {
    if (!skillContract || typeof skillContract !== 'object') {
      throw new Error('Invalid skill contract: expected object');
    }
    if (!skillContract.skill_id) {
      throw new Error('Invalid skill contract: missing skill_id');
    }
    if (this.config.enforce_deterministic_contract && /Math\.random|random/i.test(skillContract.process || '')) {
      throw new Error(`Deterministic contract violation for ${skillContract.skill_id}: random logic detected`);
    }

    const context = contextPacket || {};
    if (!context.instance_id && !context.dossier_id && !context.route_id) {
      throw new Error(
        `Deterministic contract violation for ${skillContract.skill_id}: requires one of instance_id, dossier_id, route_id`
      );
    }
  }

  buildOutput(skillContract, contextPacket, dossierState) {
    const context = this.cloneObject(contextPacket || {});
    const dossier = this.cloneObject(dossierState || {});
    const template = this.cloneObject(skillContract.output_template || {});

    const skillId = skillContract.skill_id;
    const fingerprint = this.computeFingerprint({
      skill_id: skillId,
      context,
      dossier_version: dossier._version || 0
    });

    if (!template.skill_id) template.skill_id = skillId;
    if (!template.output_type) template.output_type = `${skillId.toLowerCase()}_output`;
    if (!template.artifact_family) template.artifact_family = template.output_type;
    if (!template.schema_version) template.schema_version = '1.0.0';
    if (!template.status) template.status = 'CREATED';
    if (!template.producer_workflow) template.producer_workflow = skillId;
    if (!template.payload || typeof template.payload !== 'object') template.payload = {};

    if (!template.instance_id) {
      template.instance_id = `${skillId}-${fingerprint.slice(0, 12)}`;
    }
    if (context.dossier_id && !template.dossier_ref) {
      template.dossier_ref = context.dossier_id;
    }
    if (!template.created_at) {
      template.created_at = new Date().toISOString();
    }

    template.payload.runtime = {
      deterministic: true,
      execution_fingerprint: fingerprint,
      source: 'skill_executor',
      context_keys: Object.keys(context).sort()
    };

    template.mutation_metadata = {
      timestamp: new Date().toISOString(),
      writer_id: 'skill_executor',
      skill_id: skillId,
      instance_id: template.instance_id,
      schema_version: template.schema_version,
      lineage_reference: context.lineage_reference || context.route_id || template.producer_workflow,
      audit_entry: 'deterministic skill execution output assembly'
    };

    if (!template.input_snapshot) {
      template.input_snapshot = {
        context_keys: Object.keys(context).sort(),
        dossier_state_keys: Object.keys(dossier).sort()
      };
    }

    return template;
  }

  computeFingerprint(value) {
    const serialized = this.stableStringify(value);
    let hash = 2166136261;
    for (let i = 0; i < serialized.length; i += 1) {
      hash ^= serialized.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const unsigned = hash >>> 0;
    return unsigned.toString(16).padStart(8, '0');
  }

  stableStringify(value) {
    if (value === null || typeof value !== 'object') {
      return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
      return `[${value.map((item) => this.stableStringify(item)).join(',')}]`;
    }
    const keys = Object.keys(value).sort();
    const pairs = keys.map((k) => `${JSON.stringify(k)}:${this.stableStringify(value[k])}`);
    return `{${pairs.join(',')}}`;
  }

  cloneObject(value) {
    return JSON.parse(JSON.stringify(value));
  }
}

module.exports = SkillExecutor;
