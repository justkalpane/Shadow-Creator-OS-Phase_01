const DirectorRuntimeRouter = require('./director_runtime_router');

class WF010RuntimeEntrypoint {
  constructor(config = {}) {
    this.router = new DirectorRuntimeRouter(config);
  }

  async run(params = {}) {
    const runId = params.run_id || `RUN-WF010-${Date.now()}`;
    const startedAt = Date.now();
    const startedAtIso = new Date().toISOString();
    const route = params.selected_route || 'ROUTE_PHASE1_STANDARD';
    const dossierId = params.dossier_id || `DOSSIER-WF010-${Date.now()}`;

    if (route === 'ROUTE_PHASE1_REPLAY') {
      if (!params.queue_entry_id || !params.decision || !params.resolved_by) {
        return {
          status: 'FAILED',
          workflow_id: 'WF-010',
          route,
          dossier_id: dossierId,
          error: 'Replay route requires queue_entry_id, decision, resolved_by',
          failure_reason_code: 'WF010_REPLAY_MISSING_INPUT',
          observability: this.buildObservability(runId, startedAt, startedAtIso, 'WF010_REPLAY_MISSING_INPUT')
        };
      }

      const replayStarted = Date.now();
      const replayResult = await this.router.resolveFinalApprovalAndContinue({
        queue_entry_id: params.queue_entry_id,
        decision: params.decision,
        resolved_by: params.resolved_by,
        context: params.resolution_context || {},
        auto_continue: true,
        run_id: runId
      });

      const failureCode = replayResult.status === 'SUCCESS' ? null : (replayResult.failure_reason_code || 'WF010_REPLAY_CONTINUATION_FAILED');
      return {
        status: replayResult.status,
        workflow_id: 'WF-010',
        route,
        dossier_id: dossierId,
        next_workflow_pack: null,
        recommended_reentry_workflow: 'WF-900',
        replay: replayResult,
        failure_reason_code: failureCode,
        observability: this.buildObservability(runId, startedAt, startedAtIso, failureCode, {
          wf020_resolution_ms: Date.now() - replayStarted
        })
      };
    }

    if (route === 'ROUTE_PHASE1_FAST' || route === 'ROUTE_PHASE1_STANDARD') {
      const chainStarted = Date.now();
      const chain = await this.router.executeTopicToScriptChain({
        run_id: runId,
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

      const failureCode = chain.status === 'SUCCESS' ? null : (chain.failure_reason_code || 'WF010_CHAIN_FAILED');
      return {
        status: chain.status,
        workflow_id: 'WF-010',
        route,
        dossier_id: dossierId,
        next_workflow_pack: 'WF-100',
        recommended_reentry_workflow: 'WF-010',
        chain,
        failure_reason_code: failureCode,
        observability: this.buildObservability(runId, startedAt, startedAtIso, failureCode, {
          topic_to_script_chain_ms: Date.now() - chainStarted
        })
      };
    }

    return {
      status: 'FAILED',
      workflow_id: 'WF-010',
      route,
      dossier_id: dossierId,
      error: `Unsupported route: ${route}`,
      failure_reason_code: 'WF010_UNSUPPORTED_ROUTE',
      observability: this.buildObservability(runId, startedAt, startedAtIso, 'WF010_UNSUPPORTED_ROUTE')
    };
  }

  buildObservability(runId, startedAt, startedAtIso, failureReasonCode = null, timings = {}) {
    return {
      run_id: runId,
      started_at: startedAtIso,
      finished_at: new Date().toISOString(),
      duration_ms: Date.now() - startedAt,
      timings_ms: timings,
      failure_reason_code: failureReasonCode
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
