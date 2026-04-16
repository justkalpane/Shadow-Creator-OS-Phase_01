# Import / Export Runbook

## Active import order for currently present repo artifacts
1. WF-000 Health Check
2. WF-900 Error Handler
3. WF-001 Dossier Create
4. WF-010 Parent Orchestrator

## Referenced but not yet present in this repo
The following packs are part of the intended Phase-1 roadmap, but they are not yet committed as workflow artifacts in this repository:
- WF-100 Topic Intelligence Pack
- WF-200 Script Intelligence Pack
- WF-300 Context Engineering Pack
- WF-400 Approval Pack

Do not treat the above four packs as active import targets until their manifests and workflow JSON files exist in the repo.

## Export discipline
- export after any stable workflow checkpoint
- preserve file names as workflow IDs
- update manifest and registry when a workflow changes
- update this runbook when a future workflow pack becomes repo-present

## Repo sync rule
A workflow may appear in the intended build roadmap before it exists in GitHub.
Only workflows with committed manifest and JSON artifacts count as active repo import targets.
