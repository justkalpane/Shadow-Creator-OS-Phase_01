# GUI ACCEPTANCE TEST REPORT

## Test Input
`Create a YouTube script about why people procrastinate and give me thumbnail ideas`

## Runtime Setup Used
- GUI API booted on localhost:5002 in temporary host-level run
- Registry endpoint reachable
- n8n localhost:5678 unreachable during this run

## API Evidence
1. `GET /api/system/health` -> **200**
2. `GET /api/registries/n8n-webhooks` -> **200**
3. `POST /api/chat/message` -> **200** with payload:
   - `status: workflow_trigger_failed`
   - `workflow_id: WF-001`
   - `requested_url: http://localhost:5678/webhook/wf-001-dossier-create`
   - `error_message: WF-001 trigger failed`
   - `likely_fix: Check n8n availability at http://localhost:5678 and verify firewall/port.`

## Verdict
- **PARTIAL PASS**
- Reason: GUI runtime now truthfully reports real trigger failures with actionable diagnostics; full PASS requires live n8n success path (`WF-001` and `WF-010` execution with dossier/packet output).
