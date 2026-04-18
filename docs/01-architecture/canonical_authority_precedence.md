# Canonical Authority Precedence Law
## Shadow Empire / Creator OS — Phase 1 and Beyond
## Classification: Constitutional Machine Law — Wave 00 Establishment

---

## PURPOSE

This document establishes the binding precedence order for all artifacts in the
`justkalpane/Shadow-Creator-OS-Phase_01` repository. When two artifacts disagree,
this order determines which is authoritative. This law is non-overridable by
prose, screenshots, summaries, or conversational context.

The goal is to prevent split authority, flat architecture, validator drift,
phantom repo state, and "AI wrote it so it must exist" mistakes.

---

## PRECEDENCE ORDER (HIGHEST TO LOWEST)

### LEVEL 1 — CONSTITUTIONAL MACHINE LAW
These documents define system-level truth and cannot be superseded by lower
layers.

Examples:
- `docs/01-architecture/canonical_authority_precedence.md`
- `docs/01-architecture/prompt_registry_interlock_law.md`
- `docs/01-architecture/founder_creator_mode_law.md`
- `docs/01-architecture/worker_router_law.md`
- `docs/01-architecture/skill_loader_repo_contract.md`
- `docs/01-architecture/windows_macos_portability_law.md`
- `docs/01-architecture/mission_control_chronos_law.md`
- `docs/01-architecture/akasha_knowledge_plane_law.md`
- `docs/01-architecture/provider_auth_callback_closure_law.md`
- `docs/01-architecture/dashboard_contract_pack_law.md`

**Rule:**
If a lower-layer file contradicts a machine-law document, the machine-law
document is correct.

---

### LEVEL 2 — CANONICAL REGISTRIES
These files define what exists, what is permitted, what is blocked, and what is
production-legal.

Examples:
- `registries/workflow_registry.yaml`
- `registries/provider_registry.yaml`
- `registries/provider_auth_callback_matrix.yaml`
- `registries/mode_registry.yaml`
- `registries/mode_route_registry.yaml`
- `registries/build_blocker_matrix.yaml`
- `registries/release_blocker_matrix.yaml`
- `registries/decision_packet_register.yaml`
- `registries/skill_loader_registry.yaml`
- `registries/worker_router_contract.yaml`
- `registries/knowledge_plane_registry.yaml`
- `registries/dashboard_screen_contract_pack.yaml`
- `registries/dashboard_api_contract_pack.yaml`

**Rule:**
Registries outrank manifests, prose docs, and workflow comments.
If a manifest says a workflow exists but the registry does not, the registry is
correct.

---

### LEVEL 3 — JSON/YAML SCHEMAS
These define structural validity.

Examples:
- `schemas/**/*.json`
- `schemas/**/*.yaml`

**Rule:**
Schemas define legal field shape, but do not define business truth unless a
registry binds that truth.
A file can be schema-valid and still be constitutionally wrong.

---

### LEVEL 4 — WORKFLOW / PACK / MANIFEST FILES
These define executable repo artifacts, but only within the truth boundaries
above.

Examples:
- `n8n/workflows/**/*.json`
- `n8n/manifests/**/*.yaml`
- `bindings/**/*.yaml`

**Rule:**
Workflow files may not imply repo presence, route legality, or provider legality
contrary to registries.

---

### LEVEL 5 — DEPLOYMENT CONFIGURATION
Examples:
- `configs/**/*.yaml`
- `.env.example`
- bootstrap scripts
- local deployment helper files

**Rule:**
Config can tune runtime behavior, but cannot redefine canonical truth.
If config conflicts with registry truth, it becomes a decision packet or a bug.

---

### LEVEL 6 — TESTS / VALIDATORS
Examples:
- `tests/**/*.py`
- validation scripts

**Rule:**
Validators are enforcement tools, not source of truth.
If validator assumptions differ from constitutional law or registry truth, the
validator must be fixed.

---

### LEVEL 7 — OPERATIONAL DOCS / CHECKLISTS / ISSUE PACKS
Examples:
- `docs/00-project-state/*.md`
- repair packs
- implementation notes

**Rule:**
Useful for execution context, but never authoritative over laws, registries, or
schemas.

---

### LEVEL 8 — CONVERSATIONAL CONTEXT / CHAT SUMMARIES / SCREENSHOTS
Examples:
- chat transcripts
- screenshots
- pasted summaries
- remembered assistant commentary

**Rule:**
Conversation can propose or describe. It cannot establish repo truth unless the
truth is written into the repo at a higher layer.

---

## ANTI-DRIFT ENFORCEMENT

When any contradiction is found:
1. check constitutional machine law first
2. check canonical registries second
3. check schema validity third
4. only then inspect workflows/manifests/config/tests

If contradiction persists:
- open/update `registries/decision_packet_register.yaml`
- mark blocker in `registries/build_blocker_matrix.yaml` or
  `registries/release_blocker_matrix.yaml`
- do not silently "pick whichever file looks newer"

---

## DIRECT APPLICATION TO KNOWN PHASE-1 ISSUES

### Example A — WF-100 / WF-200 repo presence contradiction
If manifests and workflow JSONs say WF-100 exists, but the canonical workflow
registry says it is not repo-present, **the registry wins** until corrected.

### Example B — validator mismatch
If `tests/validate_repo_runtime_bindings.py` expects one config value and the
config file contains another, **the config does not automatically become truth**.
The contradiction becomes a decision packet and must be resolved explicitly.

### Example C — prompt says "use provider X"
If a prompt requests provider X, but the provider registry marks it unavailable
or blocked in current mode, **the registry wins**.

---

## CHANGE CONTROL

Any file that would alter Levels 1–3 must be treated as:
- constitutional change
- canonical registry change
- schema contract change

Such changes require:
- explicit commit message
- impact review
- blocker review if applicable
- validator reconciliation if affected

---

## FINAL RULE

**No repo artifact is authoritative merely because it exists.**
**Authority is determined by precedence, not by presence.**

That principle is permanent until explicitly replaced by a higher-order
constitutional file.