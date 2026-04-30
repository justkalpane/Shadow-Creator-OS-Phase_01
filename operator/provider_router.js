const { readYamlSafe, nowIso } = require('./_shared');

class ProviderRouter {
  constructor() {
    this.registry = readYamlSafe('registries/provider_registry.yaml', {});
  }

  listProviders() {
    const providers = Array.isArray(this.registry.providers) ? this.registry.providers : [];
    return {
      providers: providers.map((p) => ({
        provider_id: p.provider_id,
        class: p.class,
        status: p.status,
        phase1_allowed: p.phase1_allowed,
        premium_provider: p.premium_provider,
        runtime_modes: p.runtime_modes || [],
      })),
      generated_at: nowIso(),
    };
  }

  getProviderStatus(providerId) {
    const providers = Array.isArray(this.registry.providers) ? this.registry.providers : [];
    const p = providers.find((x) => x.provider_id === providerId);
    if (!p) return { status: 'not_found', provider_id: providerId };
    return {
      provider_id: p.provider_id,
      status: p.status,
      phase1_allowed: p.phase1_allowed,
      premium_provider: p.premium_provider,
      auth_style: p.auth_style,
      notes: p.notes || null,
      generated_at: nowIso(),
    };
  }
}

module.exports = ProviderRouter;

