const WF010RuntimeEntrypoint = require('./wf010_runtime_entrypoint');

class RuntimeIntegrationBridge {
  constructor(config = {}) {
    this.entrypoint = new WF010RuntimeEntrypoint(config);
  }

  /**
   * Channel-agnostic runtime gateway.
   * Works with n8n webhooks, chatbot tool calls, or direct JS invocation.
   */
  async run(request = {}) {
    const normalized = this.normalizeRequest(request);
    return this.entrypoint.run(normalized);
  }

  normalizeRequest(request) {
    const route =
      request.selected_route ||
      request.route ||
      request.payload?.selected_route ||
      request.payload?.route ||
      'ROUTE_PHASE1_STANDARD';

    return {
      selected_route: route,
      dossier_id: request.dossier_id || request.payload?.dossier_id,
      discovery_brief: request.discovery_brief || request.payload?.discovery_brief,
      source_refs: request.source_refs || request.payload?.source_refs,
      topic_seed: request.topic_seed || request.payload?.topic_seed,
      candidate_id: request.candidate_id || request.payload?.candidate_id,
      audience: request.audience || request.payload?.audience,
      budget_profile: request.budget_profile || request.payload?.budget_profile,
      audience_profile: request.audience_profile || request.payload?.audience_profile,
      target_duration_seconds: request.target_duration_seconds || request.payload?.target_duration_seconds,
      style_constraints: request.style_constraints || request.payload?.style_constraints,
      queue_entry_id: request.queue_entry_id || request.payload?.queue_entry_id,
      decision: request.decision || request.payload?.decision,
      resolved_by: request.resolved_by || request.payload?.resolved_by,
      resolution_context: request.resolution_context || request.payload?.resolution_context
    };
  }
}

module.exports = RuntimeIntegrationBridge;

if (require.main === module) {
  (async () => {
    const bridge = new RuntimeIntegrationBridge();
    const response = await bridge.run({
      route: 'ROUTE_PHASE1_FAST',
      payload: {
        topic_seed: 'AI creator pipelines',
        audience: 'general'
      }
    });
    console.log(JSON.stringify(response, null, 2));
  })();
}
