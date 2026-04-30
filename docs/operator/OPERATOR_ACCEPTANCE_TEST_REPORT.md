# Operator Acceptance Test Report

Date: 2026-05-01

## Commands Run
- `git status -sb`
- `git log --oneline -10`
- `git remote -v`
- `npm.cmd install`
- `npm.cmd run validate:all`
- `npm.cmd run health:check`
- `npm.cmd run n8n:status`
- `Invoke-RestMethod http://localhost:5050/operator/health`
- `POST http://localhost:5050/operator/new-content-job`
- `GET http://localhost:5050/operator/dossier/:dossier_id`
- `GET http://localhost:5050/operator/outputs/:dossier_id`
- `powershell -ExecutionPolicy Bypass -File scripts/operator/new-content-job.ps1 ...`
- `powershell -ExecutionPolicy Bypass -File scripts/operator/inspect-output.ps1 ...`
- `npm.cmd run operator:ollama -- "..."`
- `npm.cmd run operator:mcp`
- `powershell -ExecutionPolicy Bypass -File scripts/windows/start_open_webui.ps1 -SkipDocker`

## Key Runtime Results
- Operator health: PASS
- n8n reachable: PASS
- Ollama reachable: PASS
- WF-001 trigger: PASS (queued, HTTP 200)
- WF-010 trigger: FAIL (n8n HTTP 404 webhook not registered)
- Dossier lookup: PASS
- Output lookup: PASS (currently 0 packets for tested dossier)
- PowerShell operator scripts: PARTIAL PASS (now executable, truthful failures)
- Ollama Tool Runner: PARTIAL PASS (calls Operator API; blocked by WF-010)
- MCP runtime: FAIL (no running MCP server behavior)
- Open WebUI: PARTIAL PASS (connector docs/config ready, runtime not installed)

## Dossier/Output Evidence
- Dossier ID observed in run: `DOSSIER-1777571990812-80TOHPD51`
- Output packet count for dossier: `0`

## Final Verdict
- **PARTIAL PASS**

## Blocking Issues
1. Activate/fix WF-010 production webhook in live n8n.
2. Implement executable MCP server behavior in `operator/mcp/shadow_operator_mcp_server.js`.
3. Install/start Open WebUI runtime (Docker or Python runtime), then verify tool invocation path.
