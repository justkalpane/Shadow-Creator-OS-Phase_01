# Import / Export Runbook

## Canonical active import source
The active repo-present workflow family is defined only in:
- `registries/repo_present_workflow_family.yaml`

Import workflows in the exact order listed in that register.
Do not treat prose lists in docs or tests as authoritative over the register.

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
- update the canonical repo-present workflow family register when a future workflow pack becomes repo-present

## Repo sync rule
A workflow may appear in the intended build roadmap before it exists in GitHub.
Only workflows listed in `registries/repo_present_workflow_family.yaml` count as active repo import targets.
