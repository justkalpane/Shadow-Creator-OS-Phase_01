# Shadow Creator OS — Phase 1 n8n Repo Estate

This repository is the **static source-of-truth** for the current Phase-1 Shadow Empire / Creator OS build.

It is not the runtime itself.
It holds the artifacts that the local n8n runtime will import, validate, and use during the current build stage.

## Current build posture
- n8n-first
- local-first on Windows laptop
- one local n8n instance only
- one Ollama model at a time
- generic nodes first
- Data Tables for compact state/indexes
- JSON and Markdown for larger artifacts

## Current implementation sequence
1. Runtime stabilization
2. Folder creation
3. Ollama verification
4. Create five Data Tables
5. WF-000 Health Check
6. WF-900 Error Handler
7. WF-001 Dossier Create
8. WF-010 Parent Orchestrator
9. Topic Intelligence pack
10. Script Intelligence pack
11. Context Engineering pack
12. Approval / Remodify / Replay pack

## What this repo contains
- `docs/` — deployment posture, architecture notes, runbooks
- `registries/` — workflow, route, approval, and error registries
- `schemas/` — dossier and packet schemas
- `n8n/manifests/` — workflow contracts
- `n8n/workflows/` — importable workflow JSON shells
- `data/bootstrap/data_tables/` — CSV seed files for the five Data Tables
- `scripts/windows/` — local helper scripts
- `tests/` — repo validation checks

## n8n integration model
This repo connects to n8n in four ways:
1. workflow JSON files are imported into the local n8n instance
2. manifests define workflow purpose, inputs, outputs, and writeback intent
3. Data Table CSVs seed the five operational tables
4. docs and scripts guide local setup, validation, and re-import discipline

## Five Phase-1 Data Tables
- `dossiers`
- `routes`
- `approvals`
- `providers_deferred`
- `runtime_index`

## Runtime boundary
Tracked here:
- registries
- schemas
- workflow JSONs
- manifests
- docs
- bootstrap CSVs
- validation files

Not tracked here:
- local secrets
- n8n runtime state
- `n8n_user/`
- generated packets
- logs
- binary media
- caches

## Explicitly deferred from Phase 1
- heavy media generation
- full avatar rendering
- publish/auth automation
- deep analytics pull
- browser automation
- Redis/Postgres/Qdrant
- premium provider bridge beyond stubs

## Current repo status
The Phase-1 estate scaffold is present.
What remains is deeper workflow implementation, stronger validation, and later workflow-pack expansion beyond the initial system and parent workflow set.
