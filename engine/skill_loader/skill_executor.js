class SkillExecutor {
  constructor(config = {}) {
    this.config = {
      default_timeout_ms: config.default_timeout_ms || 30000
    };
  }

  async execute(skillContract, contextPacket, dossierState) {
    const startedAt = Date.now();
    const output = this.buildOutput(skillContract, contextPacket, dossierState);
    const durationMs = Date.now() - startedAt;

    return {
      status: 'SUCCESS',
      output,
      duration_ms: durationMs
    };
  }

  buildOutput(skillContract, contextPacket, dossierState) {
    const template = this.cloneObject(skillContract.output_template || {});

    if (!template.skill_id) {
      template.skill_id = skillContract.skill_id;
    }

    if (!template.output_type) {
      template.output_type = `${skillContract.skill_id.toLowerCase()}_output`;
    }

    if (!template.status) {
      template.status = 'created';
    }

    if (!template.artifact_family && template.output_type) {
      template.artifact_family = template.output_type;
    }

    if (!template.payload || typeof template.payload !== 'object') {
      template.payload = {};
    }

    template.payload.runtime = {
      executed_at: new Date().toISOString(),
      source: 'skill_executor',
      context_keys: Object.keys(contextPacket || {})
    };

    if (contextPacket && contextPacket.dossier_id && !template.dossier_ref) {
      template.dossier_ref = contextPacket.dossier_id;
    }

    if (!template.input_snapshot) {
      template.input_snapshot = {
        context_keys: Object.keys(contextPacket || {}),
        dossier_state_keys: Object.keys(dossierState || {})
      };
    }

    return template;
  }

  cloneObject(value) {
    return JSON.parse(JSON.stringify(value));
  }
}

module.exports = SkillExecutor;
