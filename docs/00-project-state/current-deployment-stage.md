# Current Deployment Stage

## Canonical posture
- Build mode: n8n-first
- Runtime mode: local-first on Windows laptop
- Current machine target: Lenovo ThinkPad T480S class
- n8n posture: one local n8n instance only
- Model posture: one Ollama model at a time
- Workflow style: generic nodes first
- State posture: n8n Data Tables for indexes/state, JSON/Markdown for larger artifacts

## Current implementation stage
1. Runtime stabilization
2. Folder creation
3. Ollama verification
4. Create five Data Tables
5. Build WF-000 Health Check
6. Build WF-900 Error Handler
7. Build WF-001 Dossier Create
8. Build WF-010 Parent Orchestrator
9. Build Topic Intelligence pack
10. Build Script Intelligence pack
11. Build Context Engineering pack
12. Build Approval / Remodify / Replay pack

## Explicitly deferred
- Heavy media generation
- Full avatar rendering
- Publish/auth automation
- Deep analytics pull
- Browser automation
- Redis/Postgres/Qdrant
- Premium provider bridge beyond stubs

## Repository law
This repository is the static source-of-truth for Phase-1 artifacts.
Runtime state, local secrets, generated outputs, and n8n local storage remain outside Git tracking.
