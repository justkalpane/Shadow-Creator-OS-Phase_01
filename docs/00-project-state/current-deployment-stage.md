# Current Deployment Stage

## Canonical posture
- Build mode: n8n-first
- Runtime mode: local-first on Windows laptop
- Current machine target: Lenovo ThinkPad T480S class
- n8n posture: one local n8n instance only
- Model posture: one Ollama model at a time
- Workflow style: generic nodes first
- State posture: n8n Data Tables for indexes/state, JSON/Markdown for larger artifacts

## Intended implementation sequence
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

## Current repo sync truth
This repository is no longer only an early scaffold.
It now contains starter-wired Phase-1 artifacts for the initial workflow estate and core governance layer.

### Repo-present and starter-wired
- root README updated for Phase-1 repo estate
- docs, runbooks, and deployment posture files
- workflow, route, approval, and error registries
- dossier and packet schemas
- dossier patch schema and audit event schema
- WF-000 / WF-900 / WF-001 / WF-010 manifests
- WF-000 / WF-900 / WF-001 / WF-010 starter node-chain workflow JSONs
- five Data Table bootstrap CSVs
- Windows bootstrap and Ollama verification scripts
- starter validation scripts under `tests/`

### Canonical repo-present workflow family register
Use this file as the only ordered truth for active repo-present workflows:
- `registries/repo_present_workflow_family.yaml`

### Canonical not-yet-repo-present workflow pack register
Use this file as the only ordered truth for intended workflow packs that are not yet repo-present:
- `registries/not_yet_repo_present_workflow_packs.yaml`

### Repo-validated layer present
The repo now includes validation scripts for:
- schemas
- registries
- manifests
- workflows
- docs/source-of-truth linkage
- a single Phase-1 validation runner

## Lifecycle interpretation for the current repo
- `starter_wired` means repo artifacts exist and include starter node-chain or contract depth
- `not_built_live` means the workflow should not be treated as confirmed exported from a live n8n build yet
- `repo_checks_present` means validation scripts exist in the repo, not that every runtime path has been executed live

## Live vs repo boundary
### Repo truth
The repo currently preserves:
- the Phase-1 static estate
- starter node-chain workflow logic
- governance contracts
- bootstrap data
- validation scripts

### Live runtime truth
The repo should not yet be interpreted as proof that all current starter workflows are live-exported from the local n8n instance.
The repo contains build-usable starter implementations and governance artifacts, but live n8n execution depth may still differ.

## Packs not yet repo-present
See the canonical register:
- `registries/not_yet_repo_present_workflow_packs.yaml`

Do not treat those packs as active repo import targets until they are committed.

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
