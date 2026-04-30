# N8N WEBHOOK REGISTRY REPORT

## Registry Source
- File: `registries/n8n_webhook_registry.yaml`
- API: `GET /api/registries/n8n-webhooks` -> **200**

## Registered workflows (core)
- WF-000 -> `/webhook/wf-000-health-check`
- WF-001 -> `/webhook/wf-001-dossier-create`
- WF-010 -> `/webhook/wf-010-parent-orchestrator`
- WF-020 -> `/webhook/wf-020-final-approval`
- WF-021 -> `/webhook/wf-021-replay-remodify`
- WF-500 -> `/webhook/wf-500-publishing-distribution`

## Child/internal workflows
- WF-100/WF-200/WF-300/WF-400/WF-600 marked as internal or parent-chain triggered.
- WF-900 marked error-handler-only.

## Manual host checks
- `POST http://localhost:5678/webhook/wf-001-dossier-create` -> **connection failed** (`Unable to connect to the remote server`).

## GUI API behavior check
- `POST /api/chat/message` now returns structured failure (not unknown):
  - status: `workflow_trigger_failed`
  - workflow_id: `WF-001`
  - requested_url: `http://localhost:5678/webhook/wf-001-dossier-create`
  - likely_fix: check n8n availability and port
