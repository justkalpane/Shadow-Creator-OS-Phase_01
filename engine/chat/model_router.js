const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class ModelRouter {
  constructor() {
    this.registry = this.loadRegistry();
    this.modelMap = this.buildModelMap();
  }

  loadRegistry() {
    try {
      const p = path.join(__dirname, '../../registries/model_registry.yaml');
      const parsed = yaml.load(fs.readFileSync(p, 'utf8'));
      return parsed || {};
    } catch {
      return {
        defaults: {
          primary_text_model: 'ollama_local_llama3.2',
          fallback_text_model: 'ollama_local_mistral',
        },
      };
    }
  }

  buildModelMap() {
    const out = {};
    const fam = this.registry.model_families || {};
    for (const family of Object.values(fam)) {
      const list = Array.isArray(family?.models) ? family.models : [];
      for (const m of list) {
        if (m?.model_id) out[m.model_id] = m;
      }
    }
    return out;
  }

  getDefaultModel() {
    return { model_id: this.registry.defaults?.primary_text_model || 'ollama_local_llama3.2' };
  }

  validateModelAccess(userMode, modelId) {
    const model = this.modelMap[modelId];
    if (!model) return { allowed: false, reason: `Unknown model: ${modelId}` };
    if (Array.isArray(model.blocked_modes) && model.blocked_modes.includes(userMode)) {
      return { allowed: false, reason: `${modelId} is blocked for ${userMode}` };
    }
    if (Array.isArray(model.default_modes) && model.default_modes.length > 0 && !model.default_modes.includes(userMode)) {
      return { allowed: false, reason: `${modelId} is not enabled for ${userMode}` };
    }
    return { allowed: true };
  }

  getModelEndpoint(modelId, runtime = 'local') {
    const isOllama = String(modelId).startsWith('ollama_');
    if (isOllama || runtime === 'local') {
      return { endpoint: 'http://localhost:11434', runtime: 'local' };
    }
    return { endpoint: 'cloud_provider', runtime };
  }
}

module.exports = ModelRouter;
