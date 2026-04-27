# Module Catalog: Repository Structure & Purpose

## Root Directory Structure

```
Shadow-Creator-OS-Phase_01/
├── directors/                    # 7 governance authorities
├── skills/                       # 75 skills (50 main + 25 sub)
├── registries/                   # 9+ machine-readable registries
├── bindings/                     # Workflow-skill-registry mappings
├── rules/                        # Governance, policy, escalation
├── schemas/                      # 318+ packet schemas + dossier
├── n8n/                          # 31 executable workflows
│   └── workflows/                # All workflow JSONs
├── validators/                   # 5 safety validators
├── engines/                      # Runtime engines (deferred Phase-2)
├── data_tables/                  # 5 canonical table schemas
├── docs/                         # Documentation
│   ├── 00-project-state/        # Current state
│   ├── 01-architecture/         # Architecture docs
│   ├── 03-deployment/           # Deployment guides
│   └── user_guidelines/         # THIS LAYER (18 guides)
├── tests/                        # Test suites
├── SYSTEM_MANIFEST.yaml          # Master inventory
├── DEPLOYMENT_STATUS.md          # Execution readiness
├── RUNBOOK_PHASE1_EXECUTION.md   # How to run Phase-1
├── .env.example                  # Environment template
├── package.json                  # npm dependencies
└── README.md                     # Top-level project README
```

## Module Breakdown

### directors/ (7 Files)

| File | Purpose | Authority |
|------|---------|-----------|
| yama_director.md | Policy enforcement | Veto content |
| kubera_director.md | Budget governance | Reject for cost |
| topic_director.md | Topic expertise | Qualify topics |
| research_director.md | Evidence authority | Validate sources |
| script_director.md | Quality authority | Approve/reject |
| context_director.md | Execution planning | Adjust resources |
| media_director.md | Asset production (Phase-4+) | Plan media |

### skills/ (75 Files)

**Topic Intelligence (6):**
- topic_parsing, normalization, disambiguation, viability_scoring, novelty_analysis, trend_synthesis

**Research (4):**
- compression, evidence_mapping, source_ranking, fact_validation

**Script Generation (5):**
- outline_generator, hook_generator, drafting, debate_critic, counterargument_generator

**Script Refinement (3):**
- validator, quality_fixer, metadata_generator

**Context & Media (4):**
- context_packet_builder, thumbnail_planner, audio_planner, video_planner

**System Operations (3):**
- workflow_router, error_classifier, replay_safety_checker

**Sub-Skills (25):**
- Micro-operations for each main skill family

### registries/ (20+ Files)

| Registry | Purpose | Entries |
|----------|---------|---------|
| model_registry.yaml | Available LLMs | 9 models |
| mode_registry.yaml | Operational modes | 12 modes |
| skill_registry.yaml | All skills indexed | 75 skills |
| director_registry.yaml | All directors | 7 directors |
| workflow_registry.yaml | All workflows | 31 workflows |
| provider_registry.yaml | Available providers | Phase-1+ |
| route_registry.yaml | Routing rules | 3 routes |
| ui_registry.json | UI screens/components | 18 screens, 8 components |
| subskill_registry.yaml | Micro-skills | 25 skills |

### schemas/ (318+ Files)

- **dossier/content_dossier.schema.json** — Complete dossier structure
- **packets/** — 318+ typed packet schemas
  - Topic intelligence packets (discovery, qualification, scoring)
  - Research packets (synthesis, evidence)
  - Script packets (generation, debate, refinement, shaping)
  - Approval, analytics, evolution packets

### n8n/workflows/ (31 JSON Files)

**System (7):**
- WF-000 (health), WF-001 (dossier), WF-010 (parent), WF-020 (approval), WF-021 (replay), WF-900 (error), WF-901 (recovery)

**Packs (6):**
- WF-100 (topic), WF-200 (script), WF-300 (context), WF-400 (media), WF-500 (publishing), WF-600 (analytics)

**Children (18):**
- CWF-110 through CWF-630 across 6 packs

### validators/ (5 JavaScript Files)

| Validator | Validates |
|-----------|-----------|
| model_validator.js | Model selection, fallback chains, cost gates |
| mode_validator.js | Mode transitions, governance levels, nesting |
| ui_validator.js | Screen structure, component bindings |
| workflow_validator.js | JSON structure, dossier mutations, packet emission |
| runtime_validator.js | Dossier state, delta log, packet lineage |

### data_tables/ (5 SQL Schema Files)

| Table | Purpose |
|-------|---------|
| se_dossier_index | One row per dossier |
| se_route_runs | One row per workflow execution |
| se_error_events | One row per error |
| se_packet_index | One row per packet (with lineage) |
| se_approval_queue | One row per pending approval |

## Status by Module

| Module | Files | Status | Phase | Notes |
|--------|-------|--------|-------|-------|
| directors | 7 | ✅ COMPLETE | 1 | All 7 directors fully defined |
| skills (main) | 50 | ✅ COMPLETE | 1 | DNA-injected, validated |
| skills (sub) | 25 | ✅ COMPLETE | 1 | Micro-operations |
| registries | 20+ | ✅ COMPLETE | 1 | 223+ entries, cross-validated |
| schemas | 318+ | ✅ COMPLETE | 1-6 | All packet families |
| workflows | 31 | ✅ COMPLETE | 1 | Tested, importable JSONs |
| validators | 5 | ✅ COMPLETE | 1 | All 5 implemented |
| data_tables | 5 | ✅ COMPLETE | 1 | SQL/CSV schemas |

---
