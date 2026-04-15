# Phase-1 Repair Issue Pack

This file converts the audited repo repair matrix into GitHub-ready issue bodies.

Repository target: `justkalpane/Shadow-Creator-OS-Phase_01`

Use one issue per repair block.

---

## Issue 1 — P0: Replace shell workflow JSONs with real exported n8n workflows

### Why this issue exists
The repo currently contains workflow shell files for the core Phase-1 workflows, but the JSON exports do not yet reflect the real built state from the live n8n environment.

Affected workflows observed in repo:
- `n8n/workflows/system/WF-000-health-check.json`
- `n8n/workflows/system/WF-900-error-handler.json`
- `n8n/workflows/parent/WF-001-dossier-create.json`
- `n8n/workflows/parent/WF-010-parent-orchestrator.json`

These files currently contain metadata-only structures with empty `nodes` and `connections`, which blocks true repo/runtime sync.

### Goal
Replace shell JSONs with the actual exported workflow JSONs from the live n8n environment.

### Acceptance criteria
- [ ] WF-000 JSON contains real nodes and real connections
- [ ] WF-900 JSON contains real nodes and real connections
- [ ] WF-001 JSON contains real nodes and real connections
- [ ] WF-010 JSON contains real nodes and real connections
- [ ] Exported filenames remain aligned to workflow IDs
- [ ] Any already-built child workflows are added to repo under canonical paths
- [ ] Repo no longer uses metadata-only shell exports for these workflows

---

## Issue 2 — P0: Align workflow registry lifecycle statuses with actual repo/runtime state

### Why this issue exists
`registries/workflow_registry.yaml` currently marks the core workflows as `planned` even though manifests and workflow JSON files already exist.

This collapses different states into one bucket and makes the repo status misleading.

### Goal
Introduce a real workflow lifecycle model that distinguishes placeholder, exported, synced, and validated states.

### Suggested status model
- `planned`
- `shell_exported`
- `live_built_in_n8n`
- `repo_synced`
- `validated`

### Acceptance criteria
- [ ] `workflow_registry.yaml` uses lifecycle states that match actual repo/runtime truth
- [ ] Core workflows are no longer marked simply `planned` if artifacts already exist
- [ ] Status meanings are documented in repo docs or registry comments
- [ ] Future workflows can be classified consistently without ambiguity

---

## Issue 3 — P0: Expand workflow manifests into full execution contracts

### Why this issue exists
The current manifests are useful, but too skeletal for production-grade repo truth.

They need stronger contracts for:
- dossier namespaces read/written
- Data Table writes
- routing and escalation
- replay/remodify behavior
- approval insertion points
- dependencies and done criteria

### Goal
Upgrade the manifest files from light descriptors into executable design contracts.

### In scope
- `n8n/manifests/WF-000-health-check.manifest.yaml`
- `n8n/manifests/WF-900-error-handler.manifest.yaml`
- `n8n/manifests/WF-001-dossier-create.manifest.yaml`
- `n8n/manifests/WF-010-parent-orchestrator.manifest.yaml`

### Acceptance criteria
- [ ] Every manifest defines inputs, outputs, writes, dependencies, fallback, escalation, and done criteria
- [ ] WF-900 explicitly defines replay/remodify routing behavior
- [ ] WF-001 explicitly defines dossier creation and namespace seeding behavior
- [ ] WF-010 explicitly defines child workflow routing and approval insertion behavior
- [ ] Manifest depth is sufficient to support repo-first governance, not just documentation

---

## Issue 4 — P0: Resolve route source-of-truth mismatch between registry and bootstrap CSV

### Why this issue exists
There is a mismatch between:
- `registries/route_registry.yaml`
- `data/bootstrap/data_tables/routes.csv`

The registry contains `ROUTE_PHASE1_REPLAY`, while the bootstrap CSV currently seeds only `ROUTE_PHASE1_STANDARD` and `ROUTE_PHASE1_FAST`.

### Goal
Make route truth consistent across the registry and bootstrap layer.

### Acceptance criteria
- [ ] Registry and bootstrap CSV list the same active route set
- [ ] Replay route is either added to CSV or removed from active registry until implemented
- [ ] Route entries include purpose, entry workflow, allowed modes, blocked capabilities, and replay semantics
- [ ] Route ownership and fallback behavior are documented
- [ ] Only one canonical route source-of-truth exists going forward

---

## Issue 5 — P0: Harden dossier and packet schemas for patch-only governed runtime

### Why this issue exists
The current schemas are useful starter contracts, but still too generic for the governed Shadow Empire runtime.

Gaps include:
- no dossier patch schema
- loose context packet contract
- insufficient approval/replay/remodify representation
- limited evidence/provenance structure in research/script packets

### Goal
Strengthen the schema layer so it can enforce dossier discipline and Context Engineering-first execution.

### In scope
- `schemas/dossier/content_dossier.schema.json`
- `schemas/packets/context_packet.schema.json`
- `schemas/packets/topic_intake.schema.json`
- `schemas/packets/research_synthesis.schema.json`
- `schemas/packets/script_draft.schema.json`
- add missing patch/approval/replay schemas as needed

### Acceptance criteria
- [ ] Dossier schema includes revision/history/patch-safe fields or compatible equivalents
- [ ] Context packet schema requires real CE fields: intent, audience, tone, evidence expectations, constraints, target module
- [ ] Topic intake packet includes route/domain/source planning hints
- [ ] Research packet includes provenance and contradiction/evidence structure
- [ ] Script draft packet includes lineage, critique hooks, and downstream validation fields
- [ ] Missing patch/approval/replay schemas are added where required

---

## Issue 6 — P0: Replace test placeholders with real Phase-1 validation suite

### Why this issue exists
`tests/README.md` currently describes planned validation areas only. The repo does not yet contain meaningful validation assets.

### Goal
Build the actual Phase-1 validation layer.

### Minimum validation areas
- schema validation
- workflow manifest validation
- registry consistency checks
- bootstrap CSV sanity checks
- route integrity checks
- repo/runtime sync checks for workflow exports

### Acceptance criteria
- [ ] Test assets exist beyond placeholder README text
- [ ] Schemas can be validated automatically or with documented commands
- [ ] Registries are checked for consistency and orphan references
- [ ] Bootstrap CSVs are checked against their registry/schema expectations
- [ ] Validation docs explain how to run the checks locally

---

## Issue 7 — P0: Add missing workflow pack artifacts or correct the import/export runbook

### Why this issue exists
`docs/03-deployment/import-export-runbook.md` references:
- WF-100 Topic Intelligence Pack
- WF-200 Script Intelligence Pack
- WF-300 Context Engineering Pack
- WF-400 Approval Pack

These pack-level artifacts are not visibly present in the audited repo state.

### Goal
Either add the missing pack artifacts or revise the runbook so it only references repo-present workflows.

### Acceptance criteria
- [ ] WF-100/WF-200/WF-300/WF-400 artifacts are added, OR runbook is corrected to match real repo contents
- [ ] Import order is aligned to actual files present in repo
- [ ] No deployment doc references nonexistent workflow packs without an explicit placeholder status
- [ ] Placeholder states are labeled honestly if those packs are still pending

---

## Issue 8 — P0: Add current-phase skill, director, and context-binding layer

### Why this issue exists
The repo has the early Phase-1 estate shape, but it is still missing the stronger governed intelligence layer around the workflows.

From the audit, the following were not meaningfully present in the inspected Phase-1 repo state:
- current-phase director registry
- current-phase skill registry/binding layer
- workflow-to-skill map
- context-engineering field register
- workflow-to-director/context binding logic

### Goal
Add the minimal governed intelligence estate required for Phase-1 repo truth.

### Acceptance criteria
- [ ] Current-phase director binding file exists
- [ ] Current-phase skill binding file exists
- [ ] Workflow-to-skill mapping exists for core Phase-1 workflows
- [ ] Context Engineering field register exists for Phase-1 packet generation and downstream usage
- [ ] Repo can explain which workflow uses which skill/context contract without relying on external chat context

---

## Issue 9 — P1: Upgrade Windows bootstrap from folder creation to runtime verification

### Why this issue exists
The PowerShell bootstrap script creates folders, but does not verify runtime health or Phase-1 readiness.

### Goal
Expand the bootstrap script and/or associated docs so the bootstrap verifies actual local runtime posture.

### Acceptance criteria
- [ ] Bootstrap checks folder existence and writability
- [ ] Bootstrap verifies expected n8n user folder posture
- [ ] Bootstrap verifies binary data path posture
- [ ] Bootstrap verifies Ollama reachability and configured model existence
- [ ] Bootstrap emits useful failure messages when checks do not pass

---

## Issue 10 — P1: Upgrade root README into a real Phase-1 repo control document

### Why this issue exists
The current `README.md` is effectively empty and does not explain the repo to builders, Claude, or GitHub readers.

### Goal
Turn the root README into the primary control document for the Phase-1 estate.

### Acceptance criteria
- [ ] README explains what Phase-1 is
- [ ] README explains what is built vs shell vs deferred
- [ ] README explains repo/runtime separation
- [ ] README links to deployment state, import/export runbook, and key registries/schemas
- [ ] README gives a clean onboarding path for a builder or AI code agent
