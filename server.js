const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const axios = require('axios');
const createChatRouter = require('./engine/api/chat');
const createOperatorRouter = require('./engine/api/operator');
const N8nWorkflowClient = require('./engine/chat/n8n_workflow_client');

const app = express();
const PORT = Number(process.env.PORT || 5002);
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';

app.use(cors());
app.use(express.json({ limit: '5mb' }));

function readJsonSafe(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function readYamlSafe(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function repoFile(relPath) {
  return path.join(__dirname, relPath);
}

const workflowClient = new N8nWorkflowClient();

app.get('/api/system/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'shadow_gui_runtime_api',
    backend_port: PORT,
    n8n_base_url: N8N_BASE_URL,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/system/runtime-config', (req, res) => {
  res.json({
    backend: `http://localhost:${PORT}`,
    n8n: N8N_BASE_URL,
    mock_n8n_enabled: process.env.USE_MOCK_N8N === 'true',
    runtime_mode: process.env.RUNTIME_MODE || 'local',
  });
});

app.get('/api/system/n8n-health', async (req, res) => {
  const health = await workflowClient.healthCheck();
  res.status(health.healthy ? 200 : 503).json(health);
});

app.get('/api/system/ollama-health', async (req, res) => {
  try {
    const r = await axios.get('http://localhost:11434/api/tags', { timeout: 3000 });
    res.json({ healthy: true, status: 'ok', models: r.data?.models || [] });
  } catch (error) {
    res.status(503).json({ healthy: false, status: 'unreachable', error: error.message });
  }
});

app.use('/api/chat', createChatRouter());
app.use('/operator', createOperatorRouter());

app.get('/api/registries/modes', (req, res) => res.json(readYamlSafe(repoFile('registries/mode_registry.yaml'), {})));
app.get('/api/registries/models', (req, res) => res.json(readYamlSafe(repoFile('registries/model_registry.yaml'), {})));
app.get('/api/registries/workflows', (req, res) => res.json(readYamlSafe(repoFile('registries/workflow_registry.yaml'), {})));
app.get('/api/registries/tasks', (req, res) => res.json(readYamlSafe(repoFile('registries/task_intent_registry.yaml'), {})));
app.get('/api/registries/gui-routing', (req, res) => res.json(readYamlSafe(repoFile('registries/gui_task_routing_matrix.yaml'), {})));
app.get('/api/registries/n8n-webhooks', (req, res) => res.json(readYamlSafe(repoFile('registries/n8n_webhook_registry.yaml'), {})));

app.get('/api/dossiers', (req, res) => {
  const idx = readJsonSafe(repoFile('data/se_dossier_index.json'), { dossiers: [] });
  const dossiers = Array.isArray(idx.dossiers) ? idx.dossiers : (Array.isArray(idx.records) ? idx.records : []);
  res.json({ dossiers, count: dossiers.length, source: 'data/se_dossier_index.json', last_refreshed: new Date().toISOString() });
});

app.get('/api/dossiers/:dossier_id', (req, res) => {
  const idx = readJsonSafe(repoFile('data/se_dossier_index.json'), { dossiers: [] });
  const dossiers = Array.isArray(idx.dossiers) ? idx.dossiers : (Array.isArray(idx.records) ? idx.records : []);
  const found = dossiers.find((d) => d.dossier_id === req.params.dossier_id);
  const dossierFile = repoFile(`dossiers/${req.params.dossier_id}.json`);
  const full = readJsonSafe(dossierFile, null);
  if (!found && !full) return res.status(404).json({ status: 'not_found' });
  res.json({ index_record: found || null, dossier: full || null, source: full ? `dossiers/${req.params.dossier_id}.json` : 'data/se_dossier_index.json' });
});

app.get('/api/dossiers/:dossier_id/packets', (req, res) => {
  const packetsJson = readJsonSafe(repoFile('data/se_packet_index.json'), { packets: [] });
  const packets = Array.isArray(packetsJson.packets) ? packetsJson.packets : (Array.isArray(packetsJson.entries) ? packetsJson.entries : []);
  const items = packets.filter((p) => (p.dossier_ref || p.dossier_id || p.dossierRef) === req.params.dossier_id);
  res.json({ dossier_id: req.params.dossier_id, packets: items, count: items.length });
});

app.post('/api/dossiers/:dossier_id/approve', async (req, res) => {
  const decision = req.body?.decision || 'approved';
  const out = await workflowClient.triggerWorkflow('WF-020', {
    dossier_id: req.params.dossier_id,
    decision,
    reviewer: req.body?.reviewer || req.body?.user_mode || 'founder',
  });
  res.status(out.status === 'failed' ? 502 : 200).json(out);
});

app.post('/api/dossiers/:dossier_id/replay', async (req, res) => {
  const out = await workflowClient.triggerWorkflow('WF-021', {
    dossier_id: req.params.dossier_id,
    stage: req.body?.stage || 'script',
    checkpoint: req.body?.checkpoint || 'latest',
    remodify_instructions: req.body?.remodify_instructions || null,
  });
  res.status(out.status === 'failed' ? 502 : 200).json(out);
});

app.post('/api/dossiers/:dossier_id/remodify', async (req, res) => {
  const out = await workflowClient.triggerWorkflow('WF-021', {
    dossier_id: req.params.dossier_id,
    stage: req.body?.target_workflow || 'CWF-230',
    checkpoint: 'latest',
    remodify_instructions: req.body?.instructions || req.body?.feedback || null,
  });
  res.status(out.status === 'failed' ? 502 : 200).json(out);
});

app.get('/api/library', (req, res) => {
  const dossiers = readJsonSafe(repoFile('data/se_dossier_index.json'), { dossiers: [] });
  const packets = readJsonSafe(repoFile('data/se_packet_index.json'), { packets: [] });
  const d = Array.isArray(dossiers.dossiers) ? dossiers.dossiers : (Array.isArray(dossiers.records) ? dossiers.records : []);
  const p = Array.isArray(packets.packets) ? packets.packets : (Array.isArray(packets.entries) ? packets.entries : []);
  res.json({
    dossiers_count: d.length,
    packets_count: p.length,
    dossiers: d,
    packets: p,
    grouped_by_type: p.reduce((acc, item) => {
      const key = item.artifact_family || item.packet_family || 'unknown';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {}),
  });
});

app.get('/api/library/dossiers/:dossier_id', (req, res) => {
  const packets = readJsonSafe(repoFile('data/se_packet_index.json'), { packets: [] });
  const p = Array.isArray(packets.packets) ? packets.packets : (Array.isArray(packets.entries) ? packets.entries : []);
  const list = p.filter((x) => (x.dossier_ref || x.dossier_id || x.dossierRef) === req.params.dossier_id);
  res.json({ dossier_id: req.params.dossier_id, packets: list, count: list.length });
});

app.get('/api/library/by-type/:artifact_family', (req, res) => {
  const packets = readJsonSafe(repoFile('data/se_packet_index.json'), { packets: [] });
  const p = Array.isArray(packets.packets) ? packets.packets : (Array.isArray(packets.entries) ? packets.entries : []);
  const list = p.filter((x) => (x.artifact_family || x.packet_family) === req.params.artifact_family);
  res.json({ artifact_family: req.params.artifact_family, packets: list, count: list.length });
});

app.get('/api/library/packets/:packet_id', (req, res) => {
  const packets = readJsonSafe(repoFile('data/se_packet_index.json'), { packets: [] });
  const p = Array.isArray(packets.packets) ? packets.packets : (Array.isArray(packets.entries) ? packets.entries : []);
  const item = p.find((x) => (x.packet_id || x.instance_id) === req.params.packet_id);
  if (!item) return res.status(404).json({ status: 'not_found' });
  return res.json(item);
});

app.get('/api/gallery', (req, res) => {
  const packets = readJsonSafe(repoFile('data/se_packet_index.json'), { packets: [] });
  const p = Array.isArray(packets.packets) ? packets.packets : (Array.isArray(packets.entries) ? packets.entries : []);
  const visualFamilies = new Set(['image_concept_packet', 'thumbnail_concept_packet', 'image_prompt_packet', 'media_packet']);
  const items = p.filter((x) => visualFamilies.has(x.artifact_family || x.packet_family));
  res.json({
    status: 'planning_or_generated',
    provider_boundary_note: 'Planning packet generated. Actual provider execution is not enabled yet.',
    items,
    count: items.length,
  });
});

app.get('/api/gallery/:dossier_id', (req, res) => {
  const packets = readJsonSafe(repoFile('data/se_packet_index.json'), { packets: [] });
  const p = Array.isArray(packets.packets) ? packets.packets : (Array.isArray(packets.entries) ? packets.entries : []);
  const visualFamilies = new Set(['image_concept_packet', 'thumbnail_concept_packet', 'image_prompt_packet', 'media_packet']);
  const items = p.filter((x) => (x.dossier_ref || x.dossier_id || x.dossierRef) === req.params.dossier_id && visualFamilies.has(x.artifact_family || x.packet_family));
  res.json({ dossier_id: req.params.dossier_id, items, count: items.length });
});

app.get('/api/errors', (req, res) => {
  const data = readJsonSafe(repoFile('data/se_error_events.json'), { records: [] });
  const records = Array.isArray(data.records) ? data.records : [];
  res.json({ errors: records, count: records.length });
});

app.post('/api/errors/:error_id/replay', (req, res) => {
  res.json({ status: 'accepted', error_id: req.params.error_id, action: 'replay_requested' });
});

app.post('/api/errors/:error_id/escalate', (req, res) => {
  res.json({ status: 'accepted', error_id: req.params.error_id, action: 'escalated_to_founder' });
});

app.get('/api/approvals', (req, res) => {
  const data = readJsonSafe(repoFile('data/se_approval_queue.json'), { entries: [] });
  const entries = Array.isArray(data.entries) ? data.entries : [];
  res.json({ approvals: entries, count: entries.length, pending_count: entries.filter((e) => e.status === 'PENDING').length });
});

app.post('/api/approvals/:approval_id/approve', (req, res) => {
  res.json({ status: 'accepted', approval_id: req.params.approval_id, decision: 'APPROVED' });
});

app.post('/api/approvals/:approval_id/reject', (req, res) => {
  res.json({ status: 'accepted', approval_id: req.params.approval_id, decision: 'REJECTED' });
});

app.get('/api/workflows', (req, res) => {
  const wr = readYamlSafe(repoFile('registries/workflow_registry.yaml'), {});
  const list = Array.isArray(wr.workflows) ? wr.workflows : [];
  res.json({ workflows: list, count: list.length });
});

app.get('/api/workflows/:workflow_id', (req, res) => {
  const wr = readYamlSafe(repoFile('registries/workflow_registry.yaml'), {});
  const list = Array.isArray(wr.workflows) ? wr.workflows : [];
  const wf = list.find((w) => w.workflow_id === req.params.workflow_id);
  if (!wf) return res.status(404).json({ status: 'not_found' });
  return res.json(wf);
});

app.get('/api/workflows/runs', (req, res) => {
  const rr = readJsonSafe(repoFile('data/se_route_runs.json'), { records: [] });
  const records = Array.isArray(rr.records) ? rr.records : [];
  res.json({ runs: records, count: records.length });
});

app.post('/api/workflows/:workflow_id/trigger', async (req, res) => {
  const result = await workflowClient.triggerWorkflow(req.params.workflow_id, req.body || {});
  res.status(result.status === 'failed' ? 502 : 200).json(result);
});

// Serve UI build if present
const uiDist = path.join(__dirname, 'ui', 'dist');
if (fs.existsSync(uiDist)) {
  app.use(express.static(uiDist));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ status: 'not_found' });
    res.sendFile(path.join(uiDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[GUI API] Listening on http://localhost:${PORT}`);
});
