const DirectorRuntimeRouter = require('./director_runtime_router');

async function run() {
  const router = new DirectorRuntimeRouter();
  const dossierId = `DOSSIER-ORCH-${Date.now()}`;

  const result = await router.executeTopicToScriptChain({
    dossier_id: dossierId,
    wf100_context_packet: {
      discovery_brief: { mode: 'standard' },
      source_refs: [],
      topic_seed: 'AI creator automation',
      candidate_id: 'cand-seed-001',
      audience: 'general',
      budget_profile: 'local'
    },
    wf200_context_overrides: {
      audience_profile: 'general',
      target_duration_seconds: 75
    },
    dossier_state: {}
  });

  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  run().catch((error) => {
    console.error('[PARENT_ORCHESTRATOR_RUNNER_FAILED]', error.message);
    process.exitCode = 1;
  });
}
