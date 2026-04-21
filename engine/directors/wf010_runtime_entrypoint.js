const DirectorRuntimeRouter = require('./director_runtime_router');

class WF010RuntimeEntrypoint {
  constructor(config = {}) {
    this.router = new DirectorRuntimeRouter(config);
  }

  async run(params = {}) {
    const route = params.selected_route || 'ROUTE_PHASE1_STANDARD';
    const dossierId = params.dossier_id || `DOSSIER-WF010-${Date.now()}`;

    if (route === 'ROUTE_PHASE1_REPLAY') {
      if (!params.queue_entry_id || !params.decision || !params.resolved_by) {
        return {
          status: 'FAILED',
          workflow_id: 'WF-010',
          route,
          dossier_id: dossierId,
          error: 'Replay route requires queue_entry_id, decision, resolved_by'
        };
      }

      const replayResult = await this.router.resolveFinalApprovalAndContinue({
        queue_entry_id: params.queue_entry_id,
        decision: params.decision,
        resolved_by: params.resolved_by,
        context: params.resolution_context || {},
        auto_continue: true
      });

      return {
        status: replayResult.status,
        workflow_id: 'WF-010',
        route,
        dossier_id: dossierId,
        next_workflow_pack: null,
        recommended_reentry_workflow: 'WF-900',
        replay: replayResult
      };
    }

    if (route === 'ROUTE_PHASE1_FAST' || route === 'ROUTE_PHASE1_STANDARD') {
      const chain = await this.router.executeTopicToScriptChain({
        dossier_id: dossierId,
        wf100_context_packet: {
          discovery_brief: params.discovery_brief || { mode: route === 'ROUTE_PHASE1_FAST' ? 'fast' : 'standard' },
          source_refs: params.source_refs || [],
          topic_seed: params.topic_seed || 'AI creator automation',
          candidate_id: params.candidate_id || 'cand-wf010-001',
          audience: params.audience || 'general',
          budget_profile: params.budget_profile || 'local'
        },
        wf200_context_overrides: {
          audience_profile: params.audience_profile || 'general',
          target_duration_seconds: params.target_duration_seconds || 60,
          style_constraints: params.style_constraints || []
        },
        dossier_state: params.dossier_state || {}
      });

      return {
        status: chain.status,
        workflow_id: 'WF-010',
        route,
        dossier_id: dossierId,
        next_workflow_pack: 'WF-100',
        recommended_reentry_workflow: 'WF-010',
        chain
      };
    }

    return {
      status: 'FAILED',
      workflow_id: 'WF-010',
      route,
      dossier_id: dossierId,
      error: `Unsupported route: ${route}`
    };
  }
}

module.exports = WF010RuntimeEntrypoint;

if (require.main === module) {
  (async () => {
    const entry = new WF010RuntimeEntrypoint();
    const result = await entry.run({
      selected_route: 'ROUTE_PHASE1_STANDARD'
    });
    console.log(JSON.stringify(result, null, 2));
  })();
}
