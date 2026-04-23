# WAVE 00 — COMMIT MANIFEST
## Shadow Creator OS Phase 01
## Repository: justkalpane/Shadow-Creator-OS-Phase_01
## Wave: 00 — Authority Freeze, Canonical Reconciliation, Constitution Pack
## Date: 2026-04-18
## Status: WAVE CLOSED WITH DECISION PACKETS

---

## WAVE 00 OBJECTIVE

Establish the machine-law constitutional layer so the rest of the repo cannot
drift. No behavior-changing workflow edits in this wave. Constitutional
authority, registries, matrices, and governance laws only.

---

## FILES CREATED (27 new files)

### Architecture Law Documents (10 files)
| File | Purpose |
|------|---------|
| `docs/01-architecture/canonical_authority_precedence.md` | 8-level precedence order for all repo artifacts |
| `docs/01-architecture/prompt_registry_interlock_law.md` | Anti-hallucination law: registry outranks prose |
| `docs/01-architecture/founder_creator_mode_law.md` | Founder/creator/builder/operator mode law |
| `docs/01-architecture/worker_router_law.md` | Route-to-worker dispatch law, DLQ, replay legality |
| `docs/01-architecture/skill_loader_repo_contract.md` | Skill repo-loadability law and field contract |
| `docs/01-architecture/windows_macos_portability_law.md` | Platform portability law for Windows/macOS |
| `docs/01-architecture/mission_control_chronos_law.md` | Observability and control-plane contract (stub) |
| `docs/01-architecture/akasha_knowledge_plane_law.md` | Knowledge namespace governance and isolation law |
| `docs/01-architecture/provider_auth_callback_closure_law.md` | Provider auth/callback/OAuth closure law |
| `docs/01-architecture/dashboard_contract_pack_law.md` | Dashboard contract-first development law |

### Constitutional Registries (13 files)
| File | Purpose |
|------|---------|
| `registries/mode_registry.yaml` | Canonical operating and runtime mode definitions |
| `registries/mode_route_registry.yaml` | Mode-to-route legal mappings with guard matrix |
| `registries/build_blocker_matrix.yaml` | All build blockers with status (BB-001 to BB-020) |
| `registries/release_blocker_matrix.yaml` | All release blockers (RB-001 to RB-006) |
| `registries/decision_packet_register.yaml` | Unresolved value ledger (DP-001 to DP-007) |
| `registries/empire_registry.instance.json` | Canonical Phase-1 empire instance |
| `registries/provider_registry.yaml` | Provider legality and mode compatibility |
| `registries/provider_auth_callback_matrix.yaml` | Auth/callback/OAuth closure per provider |
| `registries/worker_router_contract.yaml` | Worker classes, queue binding, DLQ semantics |
| `registries/skill_loader_registry.yaml` | Skill loader behavior, parser contract, error classes |
| `registries/portability_hardware_matrix.yaml` | Hardware class definitions and module requirements |
| `registries/dashboard_screen_contract_pack.yaml` | Dashboard screen contracts (SCR-001 to SCR-007) |
| `registries/dashboard_api_contract_pack.yaml` | Dashboard API/DTO contracts (API-001 to API-007) |
| `registries/knowledge_plane_registry.yaml` | Akasha namespace governance and isolation rules |

### Schema (1 file)
| File | Purpose |
|------|---------|
| `schemas/registry/empire_registry.schema.json` | JSON Schema for the empire registry instance |

## FILES UPDATED (2 existing files — replacement content)

| File | Change |
|------|--------|
| `configs/local_repo_integration.yaml` | Version 3: added constitutional refs, DP-003 resolved |
| `registries/workflow_registry.yaml` | Version 2: added constitutional refs, DP-004 flag |

## FILES NOT MODIFIED IN WAVE 00

All existing workflow JSONs, manifests, skill files, bindings, bootstrap CSVs,
test scripts, and deployment docs are preserved without modification.
Wave 00 is additive only for constitutional files and annotative for config/registry.

---

## DECISION PACKETS ESTABLISHED (7 total)

| DP ID | Item | Status | Blocking | Owner |
|-------|------|--------|----------|-------|
| DP-001 | Ollama model name | RESOLVED | RELEASE | founder |
| DP-002 | Data table name set (live vs repo) | OPEN | BUILD | founder |
| DP-003 | runtime_repo_access config vs validator | RESOLVED | BUILD | builder |
| DP-004 | WF-100/WF-200 canonical promotion | OPEN | BUILD | P0 |
| DP-005 | topic_candidate_board schema missing | OPEN | BUILD | P0 |
| DP-006 | Live route_id vs repo route_id naming | OPEN | BUILD | founder |
| DP-007 | se_approval_queue schema mismatch | OPEN | BUILD | P0 |

---

## BUILD BLOCKERS CLOSED IN WAVE 00

BB-001 through BB-013 (constitutional layer established).

## BUILD BLOCKERS REMAINING OPEN (P0 ownership)

BB-014: WF-100/WF-200 canonical register contradiction
BB-015: Config vs validator value drift (resolved)
BB-016: Data table name mismatch
BB-017: topic_candidate_board schema missing
BB-018: Script intelligence skills flat
BB-019: Live route_id vs repo route_id naming
BB-020: se_approval_queue schema mismatch

---

## NEXT WAVE READINESS

**P0 is now UNBLOCKED.**

P0 must:
1. Resolve DP-002 (table names) — recommend adopting se_ prefix names
2. Resolve DP-003 (config value) — completed with `local_clone_preferred`
3. Resolve DP-001 (model name) — completed with `llama3.2:3b`
4. Resolve DP-004 — promote WF-100/WF-200 in all canonical registers
5. Resolve DP-005 — create topic_candidate_board schema
6. Resolve DP-006 (route naming) — recommend ROUTE_PHASE1_* canonical names
7. Resolve DP-007 (approval schema) — recommend adopting live schema
8. Close BB-014 through BB-020
9. Update WF-010 to route to WF-100 instead of emitting null
10. Upgrade S-201 through S-210 skill DNA to repo-loadable depth
11. Rewrite all validators to reflect post-promotion truth

---

## HOW TO APPLY THIS WAVE TO THE REPO

1. Copy all files from the wave00 directory into the repo root, preserving paths
2. For the two UPDATED files (configs/ and registries/workflow_registry.yaml),
   replace the existing files with the new versions
3. Commit with message: `wave-00: constitutional authority freeze and machine-law pack`
4. All 27 new files and 2 updated files form one atomic commit
5. No workflow behavior changes — this is additive constitutional foundation only
