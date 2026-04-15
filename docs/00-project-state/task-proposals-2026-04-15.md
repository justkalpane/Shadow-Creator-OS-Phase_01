# Codebase Task Proposals (2026-04-15)

This document proposes four concrete tasks discovered while reviewing the current repository.

## 1) Typo Fix Task
**Title:** Rename `Remodify` wording to `Modify` in deployment-stage wording.

**Why:** The phrase "Build Approval / Remodify / Replay pack" appears to use a typo/non-standard wording and reduces clarity in planning docs.

**Scope:**
- Update the phase list wording in `docs/00-project-state/current-deployment-stage.md`.
- Keep wording consistent with approval state names in `registries/approval_registry.yaml`.

**Acceptance criteria:**
- The deployment-stage wording uses standard terminology (for example: "Modify" or "Revision").
- No conflicting terms remain in project-state docs.

## 2) Bug Fix Task
**Title:** Make Windows bootstrap script create the full documented folder layout.

**Why:** The Windows setup doc includes the repository folder (`C:\ShadowEmpire\Shadow-Creator-OS-Phase_01`) in the suggested layout, but the bootstrap script does not create it. This can produce an incomplete environment after running bootstrap.

**Scope:**
- Add the missing repository path (or remove it from docs if intentionally excluded) so script and docs agree.
- Optionally add idempotent checks/console output for all required folders.

**Acceptance criteria:**
- Running `scripts/windows/bootstrap-shadow-empire.ps1` creates every folder listed in `docs/03-deployment/windows-local-bootstrap.md`.
- Script remains safe to run repeatedly.

## 3) Documentation Discrepancy Task
**Title:** Update test READMEs that still describe tests as placeholders.

**Why:** The repository already contains executable validation scripts (`tests/validate_*.py` and `tests/run_phase1_checks.py`), but test README files still label test areas as "placeholders" and "planned checks". This is stale documentation.

**Scope:**
- Refresh `tests/README.md`, `tests/workflows/README.md`, `tests/registries/README.md`, and `tests/schemas/README.md` to describe what is currently validated.
- Include the command to run all checks (`python tests/run_phase1_checks.py`).

**Acceptance criteria:**
- README text reflects current implemented checks.
- No section still claims checks are only placeholders where checks already exist.

## 4) Test Improvement Task
**Title:** Strengthen workflow validation to check registry/manifest consistency.

**Why:** `tests/validate_workflows.py` only validates basic workflow JSON structure for a hardcoded file list. It does not verify that workflow JSONs match `registries/workflow_registry.yaml` or that referenced manifest files exist and align.

**Scope:**
- Load workflow entries dynamically from `registries/workflow_registry.yaml`.
- Verify each `source_file` and `manifest_file` exists.
- Validate `meta.workflow_id` in each workflow JSON matches the registry `workflow_id`.

**Acceptance criteria:**
- Workflow tests fail when registry/workflow/manifest references drift.
- Hardcoded workflow file list is removed from the test.
