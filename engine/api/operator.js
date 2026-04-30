const express = require('express');
const ModeManager = require('../../operator/mode_manager');
const RouteManager = require('../../operator/route_manager');
const TaskRouter = require('../../operator/task_router');
const OperatorN8nClient = require('../../operator/n8n_client');
const OutputReader = require('../../operator/output_reader');
const ReviewManager = require('../../operator/review_manager');
const AlertManager = require('../../operator/alert_manager');
const TroubleshootManager = require('../../operator/troubleshoot_manager');
const EventStream = require('../../operator/event_stream');
const ProviderRouter = require('../../operator/provider_router');
const OllamaToolRunner = require('../../operator/ollama_tool_runner');

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function createOperatorRouter() {
  const router = express.Router();
  const modes = new ModeManager();
  const routes = new RouteManager();
  const taskRouter = new TaskRouter();
  const n8n = new OperatorN8nClient();
  const outputs = new OutputReader();
  const review = new ReviewManager(n8n);
  const alerts = new AlertManager(n8n);
  const troubleshoot = new TroubleshootManager();
  const events = new EventStream();
  const providers = new ProviderRouter();
  const ollamaRunner = new OllamaToolRunner(modes, n8n);

  router.get('/health', async (req, res) => {
    const n8nHealth = await n8n.health();
    res.status(n8nHealth.healthy ? 200 : 503).json({
      status: n8nHealth.healthy ? 'healthy' : 'degraded',
      mode_default: modes.getDefaultMode(),
      runtime_default: modes.getDefaultRuntimeMode(),
      n8n: n8nHealth,
    });
  });

  router.get('/modes', (req, res) => {
    res.json({
      default_mode: modes.getDefaultMode(),
      default_runtime_mode: modes.getDefaultRuntimeMode(),
      operating_modes: modes.listOperatingModes(),
      operational_modes: modes.listOperationalModes(),
      runtime_modes: modes.getRuntimeModes(),
    });
  });

  router.get('/mode/state', (req, res) => {
    res.json({
      status: 'ok',
      state: modes.getState(),
      generated_at: new Date().toISOString(),
    });
  });

  router.post('/modes/set', (req, res) => {
    const mode = req.body?.mode;
    if (!mode) return res.status(400).json({ status: 'failed', reason: 'mode is required' });
    const out = modes.setMode(mode);
    res.status(out.status === 'success' ? 200 : 400).json(out);
  });

  router.post('/runtime/set', (req, res) => {
    const runtime_mode = req.body?.runtime_mode;
    if (!runtime_mode) return res.status(400).json({ status: 'failed', reason: 'runtime_mode is required' });
    const out = modes.setRuntimeMode(runtime_mode);
    res.status(out.status === 'success' ? 200 : 400).json(out);
  });

  router.post('/modes/operational/:mode_id/enable', (req, res) => {
    const actorMode = req.body?.actor_mode || modes.getDefaultMode();
    const out = modes.enableOperationalMode(req.params.mode_id, { actor_mode: actorMode });
    res.status(out.status === 'success' ? 200 : 400).json(out);
  });

  router.post('/modes/operational/:mode_id/disable', (req, res) => {
    const out = modes.disableOperationalMode(req.params.mode_id);
    res.status(out.status === 'success' ? 200 : 400).json(out);
  });

  router.post('/modes/permission-check', (req, res) => {
    const mode = req.body?.mode || modes.getDefaultMode();
    const task = req.body?.task || '';
    const out = modes.checkPermission(mode, task);
    res.status(out.allowed ? 200 : 403).json({ mode, task, ...out });
  });

  router.get('/routes', (req, res) => {
    const mode = req.query.mode || modes.getDefaultMode();
    res.json({
      mode,
      legal_routes: modes.getLegalRoutes(mode),
      default_route: modes.getDefaultRoute(mode),
      routes: routes.listRoutes(),
    });
  });

  router.post('/new-content-job', async (req, res) => {
    const message = req.body?.message || req.body?.topic || 'new content job';
    const mode = req.body?.mode || modes.getDefaultMode();
    const resolved = taskRouter.resolveTaskFromMessage(message);
    const modeCheck = modes.validateModeForTask(mode, {
      id: resolved.intent_id,
      allowed_modes: resolved.task_contract?.allowed_modes || [],
    });
    const route = req.body?.route_id || modes.getDefaultRoute(mode);
    const routeCheck = modes.validateRoute(mode, route);

    if (!modeCheck.allowed || !routeCheck.allowed) {
      return res.status(403).json({
        status: 'blocked',
        reason: modeCheck.reason || routeCheck.reason,
        mode,
        route,
      });
    }

    // Step 1: Trigger WF-001 (Dossier Create)
    const wf001 = await n8n.trigger('WF-001', {
      topic: req.body?.topic || message,
      context: req.body?.context || 'YouTube video',
      mode,
      route_id: route,
    });

    if (wf001.status === 'failed') {
      return res.status(502).json({
        status: 'failed',
        intent: resolved,
        wf001,
        error_message: 'Failed to create dossier',
      });
    }

    // Step 2: Wait for dossier to be created (poll the dossier index)
    let dossierId = req.body?.dossier_id;
    if (!dossierId) {
      dossierId = await waitForNewDossier(message, 15000);
    }

    if (!dossierId) {
      return res.status(502).json({
        status: 'failed',
        intent: resolved,
        wf001,
        error_message: 'Dossier creation timed out',
      });
    }

    // Step 3: Trigger WF-010 (Parent Orchestrator) with dossier_id from WF-001
    const wf010 = await n8n.trigger('WF-010', {
      dossier_id: dossierId,
      route_id: route,
      user_mode: mode,
      intent_id: resolved.intent_id,
      user_message: message,
    });

    res.status((wf010.status === 'failed') ? 502 : 200).json({
      status: (wf010.status === 'failed') ? 'failed' : 'accepted',
      dossier_id: dossierId,
      intent: resolved,
      wf001,
      wf010,
      provider_boundary_note: 'Planning packet generated. Actual provider execution is not enabled yet.',
    });
  });

  // Helper function to wait for new dossier to appear
  async function waitForNewDossier(topicHint, maxWaitMs = 15000) {
    const timeoutAt = Date.now() + maxWaitMs;
    const topicLower = String(topicHint || '').toLowerCase().trim();
    const fs = require('fs');
    const path = require('path');

    while (Date.now() < timeoutAt) {
      try {
        const dossierPath = path.join(__dirname, '../../data/se_dossier_index.json');
        if (fs.existsSync(dossierPath)) {
          const data = JSON.parse(fs.readFileSync(dossierPath, 'utf8'));
          const dossiers = data.records || data.dossiers || [];
          if (dossiers.length > 0) {
            const newest = dossiers[dossiers.length - 1];
            if (newest?.dossier_id) {
              return newest.dossier_id;
            }
          }
        }
      } catch (err) {
        // Continue polling
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    return null;
  }

  router.post('/run', async (req, res) => {
    const out = await ollamaRunner.run(req.body?.message || '', {
      mode: req.body?.mode,
      topic_context: req.body?.context,
      dossier_id: req.body?.dossier_id,
    });
    res.status(out.status === 'failed' ? 502 : (out.status === 'blocked' ? 403 : 200)).json(out);
  });

  router.get('/dossier/:id', (req, res) => {
    res.json(outputs.getDossier(req.params.id));
  });

  router.get('/outputs/:id', (req, res) => {
    res.json(outputs.getDossierOutputs(req.params.id));
  });

  router.get('/library', (req, res) => {
    res.json(outputs.getLibrary());
  });

  router.post('/approve/:id', async (req, res) => {
    const out = await review.approveOutput(req.params.id, req.body?.reviewer || 'founder');
    res.status(out.status === 'failed' ? 502 : 200).json(out);
  });

  router.post('/remodify/:id', async (req, res) => {
    const out = await review.requestChanges(req.params.id, req.body?.instructions, req.body?.reviewer || 'founder');
    res.status(out.status === 'failed' ? 502 : 200).json(out);
  });

  router.post('/replay/:id', async (req, res) => {
    const out = await review.replayStage(
      req.params.id,
      req.body?.stage || 'script',
      req.body?.checkpoint || 'latest',
      req.body?.instructions || null
    );
    res.status(out.status === 'failed' ? 502 : 200).json(out);
  });

  router.get('/alerts', async (req, res) => {
    res.json(await alerts.listAlerts());
  });

  router.post('/alerts/:alert_id/acknowledge', (req, res) => {
    const out = alerts.acknowledgeAlert(req.params.alert_id);
    res.json(out);
  });

  router.post('/alerts/:alert_id/escalate', (req, res) => {
    const out = alerts.escalateAlert(req.params.alert_id, req.body?.note || null);
    res.json(out);
  });

  router.get('/events', (req, res) => {
    res.json(events.getEvents(Number(req.query.limit || 50)));
  });

  router.get('/runs/:run_id/status', (req, res) => {
    const out = outputs.getRunStatus(req.params.run_id);
    res.status(out.status === 'not_found' ? 404 : 200).json(out);
  });

  router.get('/troubleshoot/dossier/:id', (req, res) => {
    res.json(troubleshoot.traceDossier(req.params.id));
  });

  router.get('/troubleshoot/packet/:id', (req, res) => {
    res.json(troubleshoot.tracePacket(req.params.id));
  });

  router.get('/errors', (req, res) => {
    res.json(troubleshoot.listErrors());
  });

  router.get('/providers', (req, res) => {
    res.json(providers.listProviders());
  });

  router.get('/providers/:id', (req, res) => {
    const status = providers.getProviderStatus(req.params.id);
    res.status(status.status === 'not_found' ? 404 : 200).json(status);
  });

  router.get('/tasks', (req, res) => {
    res.json({
      tasks: taskRouter.listTaskContracts(),
      registered_workflows: n8n.getRegisteredWorkflows(),
    });
  });

  router.get('/dossier/:id/timeline', (req, res) => {
    res.json(outputs.getDossierTimeline(req.params.id));
  });

  router.get('/job/:dossier_id', (req, res) => {
    const dossier = outputs.getDossier(req.params.dossier_id);
    const out = outputs.getDossierOutputs(req.params.dossier_id);
    const grouped = out.grouped_by_type || {};
    const rows = Object.entries(grouped)
      .map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(Array.isArray(v) ? v.length : 0)}</td></tr>`)
      .join('');
    const reviewable = out.packets_count > 0;

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Operator Job Review - ${esc(req.params.dossier_id)}</title>
  <style>
    body { font-family: Segoe UI, Arial, sans-serif; margin: 24px; background: #f8fafc; color: #0f172a; }
    .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
    h1 { margin: 0 0 12px 0; font-size: 22px; }
    h2 { margin: 0 0 10px 0; font-size: 18px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
    .muted { color: #475569; font-size: 13px; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 999px; background: #e2e8f0; font-size: 12px; }
    .btn { display: inline-block; margin-right: 8px; padding: 8px 10px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff; text-decoration: none; color: #0f172a; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Shadow Operator Review Console</h1>
    <div class="muted">Dossier ID: <b>${esc(req.params.dossier_id)}</b></div>
    <div class="muted">Provider boundary: Planning packet generated. Actual provider execution is not enabled yet.</div>
  </div>
  <div class="card">
    <h2>Dossier Summary</h2>
    <div>Status: <span class="badge">${esc(dossier.index_record?.status || dossier.dossier?.status || 'unknown')}</span></div>
    <div>Current Stage: <span class="badge">${esc(dossier.index_record?.current_stage || dossier.index_record?.workflow_stage || 'unknown')}</span></div>
    <div>Topic: ${esc(dossier.index_record?.topic || dossier.dossier?.topic || 'n/a')}</div>
  </div>
  <div class="card">
    <h2>Generated Output Groups</h2>
    <table>
      <thead><tr><th>Output Type</th><th>Count</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="2">No outputs yet.</td></tr>'}</tbody>
    </table>
  </div>
  <div class="card">
    <h2>Review Actions</h2>
    <div class="muted">Reviewable outputs available: <b>${reviewable ? 'YES' : 'NO'}</b></div>
    <div style="margin-top:10px">
      <a class="btn" href="/operator/outputs/${esc(req.params.dossier_id)}">View Raw Outputs JSON</a>
      <a class="btn" href="/operator/dossier/${esc(req.params.dossier_id)}/timeline">View Timeline JSON</a>
    </div>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  });

  return router;
}

module.exports = createOperatorRouter;
