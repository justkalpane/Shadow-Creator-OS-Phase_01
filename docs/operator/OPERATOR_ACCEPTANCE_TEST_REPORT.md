# Operator Acceptance Test Report

Date: 2026-05-01

## Services
- n8n: `http://localhost:5678` -> UP
- Operator API: `http://localhost:5050/operator/health` -> healthy
- Ollama: `http://localhost:11434/api/tags` -> reachable

## Stage Results
1. Health: PASS
2. New content job: PASS
   - WF-001: queued/200
   - WF-010: queued/200
3. Dossier inspect: PASS
4. Outputs inspect: PASS (truthful packet count + provider boundary note)
5. PowerShell scripts: PASS (`new-content-job.ps1`, `inspect-output.ps1`)
6. Ollama Tool Runner: PASS (accepted via Operator API)
7. MCP runtime: PASS
   - initialize PASS
   - tools/list PASS
   - tools/call health_check PASS
8. Open WebUI:
   - Connector mapping PASS
   - Runtime app launch UNVERIFIED (Docker/Python not installed)

## Sample Evidence IDs
- Dossier: `DOSSIER-1777584892804-GL2GDU7OH`
- Dossier: `DOSSIER-1777585104695-MM67HFOTV`

## Final Verdict
- **PARTIAL PASS**
- Reason: Core runtime path is proven; Open WebUI connector is proven; Open WebUI runtime app is not installed in this environment.
