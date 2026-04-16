# Import / Export Runbook

## Canonical active import source
The active repo-present workflow family is defined only in:
- `registries/repo_present_workflow_family.yaml`

Import workflows in the exact order listed in that register.
Do not treat prose lists in docs or tests as authoritative over the register.

## Canonical not-yet-repo-present pack source
The intended but not-yet-repo-present workflow packs are defined only in:
- `registries/not_yet_repo_present_workflow_packs.yaml`

Do not treat any pack listed there as an active import target until its manifest and workflow JSON artifacts exist and it is moved into the repo-present workflow family register.

## Export discipline
- export after any stable workflow checkpoint
- preserve file names as workflow IDs
- update manifest and registry when a workflow changes
- update the canonical repo-present workflow family register when a future workflow pack becomes repo-present
- remove a pack from the not-yet-repo-present register only when its manifest and workflow JSON artifacts are committed

## Repo sync rule
A workflow may appear in the intended build roadmap before it exists in GitHub.
Only workflows listed in `registries/repo_present_workflow_family.yaml` count as active repo import targets.
Packs listed in `registries/not_yet_repo_present_workflow_packs.yaml` remain non-importable roadmap items.
