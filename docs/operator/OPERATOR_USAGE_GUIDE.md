# Operator Usage Guide (Current Verified State)

## 1. Start Services
1. Start n8n:
   - `npm.cmd run n8n:start`
2. Start Operator API:
   - `npm.cmd run operator:start`
3. Verify status:
   - `npm.cmd run n8n:status`
   - `npm.cmd run operator:health`

## 2. Run a Content Job
- PowerShell:
  - `powershell -ExecutionPolicy Bypass -File scripts/operator/new-content-job.ps1 "Create a YouTube script about procrastination and give thumbnail ideas"`
- Direct API:
  - `POST http://localhost:5050/operator/new-content-job`

## 3. Inspect Dossier + Outputs
- `powershell -ExecutionPolicy Bypass -File scripts/operator/inspect-output.ps1 DOSSIER_ID`
- `GET http://localhost:5050/operator/dossier/DOSSIER_ID`
- `GET http://localhost:5050/operator/outputs/DOSSIER_ID`

## 4. Review / Approval / Replay
- Approve:
  - `POST http://localhost:5050/operator/approve/DOSSIER_ID`
- Request changes:
  - `POST http://localhost:5050/operator/remodify/DOSSIER_ID`
- Replay:
  - `POST http://localhost:5050/operator/replay/DOSSIER_ID`

## 5. Ollama Tool Runner
- `npm.cmd run operator:ollama -- "Create a YouTube script about AI tools"`

## 6. MCP
- Current file is facade-only and not a runnable MCP server.
- `npm.cmd run operator:mcp` exits immediately.

## 7. Open WebUI
- Connector config file exists: `config/open_webui_tools.json`
- Preflight helper:
  - `powershell -ExecutionPolicy Bypass -File scripts/windows/start_open_webui.ps1 -SkipDocker`
- Runtime not installed/proven in this environment.

## Known Runtime Blocker
- WF-010 webhook currently returns n8n 404 webhook-not-registered.
- Until WF-010 is re-activated/republished and registry path re-verified, end-to-end orchestration will remain blocked after WF-001.
