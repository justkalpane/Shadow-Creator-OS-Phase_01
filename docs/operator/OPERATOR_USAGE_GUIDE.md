# Operator Usage Guide (Verified)

## Start Order
1. `npm.cmd run n8n:start` (or `scripts/windows/start_n8n_shadow_phase1.ps1`)
2. `npm.cmd run operator:start`
3. Check:
   - `npm.cmd run n8n:status`
   - `npm.cmd run operator:health`

## Run Jobs
- PowerShell:
  - `powershell -ExecutionPolicy Bypass -File scripts/operator/new-content-job.ps1 "Create a YouTube script about procrastination"`
- API:
  - `POST http://localhost:5050/operator/new-content-job`

## Inspect Results
- `powershell -ExecutionPolicy Bypass -File scripts/operator/inspect-output.ps1 DOSSIER_ID`
- `GET http://localhost:5050/operator/dossier/DOSSIER_ID`
- `GET http://localhost:5050/operator/outputs/DOSSIER_ID`

## Ollama Tool Runner
- `npm.cmd run operator:ollama -- "Create a YouTube script about AI tools"`

## MCP Server
- Start: `npm.cmd run operator:mcp`
- Exposed tools:
  - `create_content_job`
  - `inspect_dossier`
  - `list_outputs`
  - `approve_output`
  - `request_changes`
  - `replay_stage`
  - `check_errors`
  - `health_check`
  - `set_mode`
  - `enable_operational_mode`
  - `disable_operational_mode`

## Open WebUI
- Connector config: `config/open_webui_tools.json`
- Setup preflight: `powershell -ExecutionPolicy Bypass -File scripts/windows/start_open_webui.ps1 -SkipDocker`
- Runtime note: Open WebUI app requires Docker or Python runtime installation on this machine.

## Truth Rules
- Provider-backed media remains deferred unless provider bridge is enabled.
- No fake success states: always use Operator API response and packet/dossier evidence.
