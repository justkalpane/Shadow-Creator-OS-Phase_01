# BUILD_EXECUTION_PLAN_FROM_HANDOFF

Plan Date: 2026-04-26  
Repository: `C:\ShadowEmpire-Git`  
Authority: `CLAUDE - COMPREHENSIVE HANDOFF DOCUMENT FOR.txt`

## Wave 0 (Completed In This Turn)

### Files Created
- `PRE_BUILD_AUDIT.md`
- `BUILD_EXECUTION_PLAN_FROM_HANDOFF.md`
- `tmp_audit/pre_build_scan.json`
- `tmp_audit/run_pre_build_scan.ps1`

### Files Modified
- None

### Expected Counts After Wave 0
- Skill markdown files: `218`
- Director specs: `30`
- Workflow JSON files: `37`
- Validator files: `4`

### Validation Commands
1. `git rev-parse --abbrev-ref HEAD`
2. `git rev-parse HEAD`
3. `Get-ChildItem -Recurse -File skills -Filter *.skill.md | Measure-Object`
4. `Get-ChildItem -Recurse -File n8n/workflows -Filter *.json | Measure-Object`
5. `git status --short`

### Risks
1. Canonical required registries/files are missing and block registry-first closure.
2. Existing skill estate contains ID collisions and semantic mismatches with handoff IDs.

### Rollback Notes
1. Revert Wave 0 via `git revert <wave0_commit_sha>` once committed.

---

## Wave 1 — Phase 2C Skills (`M-121` through `M-130`)

### Files To Modify (Exact)
- `skills/swarm_expansion/M-121-algorithm-intelligence-core.skill.md`
- `skills/swarm_expansion/M-122-data-signal-collector.skill.md`
- `skills/swarm_expansion/M-123-algorithm-pattern-analyzer.skill.md`
- `skills/swarm_expansion/M-124-watch-time-analyzer.skill.md`
- `skills/swarm_expansion/M-125-retention-drop-detector.skill.md`
- `skills/swarm_expansion/M-126-retention-repair-engine.skill.md`
- `skills/swarm_expansion/M-127-viral-pattern-library.skill.md`
- `skills/swarm_expansion/M-128-viral-pattern-replicator.skill.md`
- `skills/swarm_expansion/M-129-thumbnail-heatmap-analyzer.skill.md`
- `skills/swarm_expansion/M-130-thumbnail-optimization-engine.skill.md`
- `registries/skill_registry.yaml` (create if missing, then update)
- `registries/workflow_bindings.yaml` (create if missing, then update)
- `registries/schema_registry.yaml` (create if missing, then update)
- `registries/director_binding.yaml` (create if missing, then update)
- `SYSTEM_MANIFEST.yaml` (update canonical references only)

### Files To Create (Exact)
- `tests/skills/phase2c/test_M-121_tiktok_script_optimizer.md`
- `tests/skills/phase2c/test_M-122_youtube_script_optimizer.md`
- `tests/skills/phase2c/test_M-123_blog_article_generator.md`
- `tests/skills/phase2c/test_M-124_podcast_script_generator.md`
- `tests/skills/phase2c/test_M-125_linkedin_article_generator.md`
- `tests/skills/phase2c/test_M-126_infographic_script_generator.md`
- `tests/skills/phase2c/test_M-127_email_sequence_generator.md`
- `tests/skills/phase2c/test_M-128_social_media_caption_generator.md`
- `tests/skills/phase2c/test_M-129_newsletter_script_generator.md`
- `tests/skills/phase2c/test_M-130_multi_format_coordinate_manager.md`

### Expected Counts After Wave 1
- Skill markdown files: `218` (in-place upgrade for 10 IDs)
- Canonical Phase 2C skills compliant: `10/10`
- Canonical registry files present: `skill_registry.yaml`, `workflow_bindings.yaml`, `schema_registry.yaml`, `director_binding.yaml`

### Validation Commands
1. `rg -n "^##\\s+[0-9]+\\." skills/swarm_expansion/M-12*.skill.md`
2. `rg -n "TEST-" skills/swarm_expansion/M-12*.skill.md`
3. `rg -n "WF-900|WF-021|append-only|Append-only|append_only" skills/swarm_expansion/M-12*.skill.md`
4. JSON parse check for workflow references impacted by Phase 2C.
5. Registry cross-reference check: each `M-121..M-130` in all canonical registries.

### Risks
1. Current filenames are legacy swarm names; content will be canonicalized with alias metadata.
2. Existing downstream references to old semantic names may require additional registry alias entries.

### Rollback Notes
1. Keep Wave 1 isolated in one commit: `build: add Phase 2C platform variant skills`.
2. Rollback with `git revert <wave1_commit_sha>`.

---

## Wave 2 — Phase 1C Conditional Research Skills (`M-021` through `M-030`)

### Files To Modify (Exact)
- `skills/research_intelligence/M-021-fact-cross-verification-unit.skill.md`
- `skills/research_intelligence/M-022-knowledge-graph-builder.skill.md`
- `skills/topic_intelligence/M-023-trend-risk-evaluator.skill.md`
- `skills/topic_intelligence/M-024-topic-finalization-engine.skill.md`
- `skills/research_intelligence/M-025-research-archive-manager.skill.md`
- `skills/script_intelligence_army/M-026-title-engineer.skill.md`
- `skills/script_intelligence_army/M-027-seo-architect.skill.md`
- `skills/script_intelligence_army/M-028-metadata-builder.skill.md`
- `skills/script_intelligence_army/M-029-audience-analyzer.skill.md`
- `skills/script_intelligence_army/M-030-engagement-predictor.skill.md`
- `registries/skill_registry.yaml`
- `registries/workflow_bindings.yaml`
- `registries/schema_registry.yaml`
- `n8n/workflows/topic/CWF-140-research-synthesis.json` (conditional route gate for `M-020` confidence branch)

### Files To Create (Exact)
- `tests/skills/phase1c/test_M-021_primary_source_interrogator.md`
- `tests/skills/phase1c/test_M-022_longitudinal_analysis_engine.md`
- `tests/skills/phase1c/test_M-023_causal_inference_builder.md`
- `tests/skills/phase1c/test_M-024_meta_analysis_synthesizer.md`
- `tests/skills/phase1c/test_M-025_assumption_validator.md`
- `tests/skills/phase1c/test_M-026_knowledge_gap_identifier.md`
- `tests/skills/phase1c/test_M-027_nuance_capture_engine.md`
- `tests/skills/phase1c/test_M-028_predictive_extrapolation.md`
- `tests/skills/phase1c/test_M-029_research_limitations_documenter.md`
- `tests/skills/phase1c/test_M-030_final_research_dossier_seal.md`

### Expected Counts After Wave 2
- Skill markdown files: `218` (in-place upgrade for 10 IDs)
- Canonical Phase 1C skills compliant: `10/10`
- `CWF-140` routing condition includes confidence branch:
  - `>=0.85` skip Phase 1C
  - `<0.85` execute Phase 1C

### Validation Commands
1. `rg -n "research_confidence_score|0\\.85|M-021|M-030" n8n/workflows/topic/CWF-140-research-synthesis.json`
2. `rg -n "TEST-" skills/**/M-02*.skill.md`
3. Registry closure checks for `M-021..M-030`.

### Risks
1. IDs `M-023..M-030` currently mapped to unrelated semantics; in-place upgrades must avoid hidden stale references.

### Rollback Notes
1. Single commit: `build: add Phase 1C conditional research skills`.
2. Rollback with `git revert <wave2_commit_sha>`.

---

## Wave 3 — Phase 3A Graphics Skills (`M-201` through `M-215`)

### Files To Create (Exact)
- `skills/media_graphics/M-201-visual-design-brief-generator.skill.md`
- `skills/media_graphics/M-202-color-palette-optimizer.skill.md`
- `skills/media_graphics/M-203-typography-selector.skill.md`
- `skills/media_graphics/M-204-layout-composition-strategist.skill.md`
- `skills/media_graphics/M-205-icon-illustration-mapper.skill.md`
- `skills/media_graphics/M-206-brand-consistency-validator.skill.md`
- `skills/media_graphics/M-207-accessibility-analyzer.skill.md`
- `skills/media_graphics/M-208-image-asset-sourcing-advisor.skill.md`
- `skills/media_graphics/M-209-infographic-structure-designer.skill.md`
- `skills/media_graphics/M-210-animation-transition-specifier.skill.md`
- `skills/media_graphics/M-211-mobile-first-layout-optimizer.skill.md`
- `skills/media_graphics/M-212-dark-mode-variant-generator.skill.md`
- `skills/media_graphics/M-213-print-ready-format-converter.skill.md`
- `skills/media_graphics/M-214-social-media-graphics-optimizer.skill.md`
- `skills/media_graphics/M-215-banner-header-designer.skill.md`
- `tests/skills/phase3a/test_M-201.md`
- `tests/skills/phase3a/test_M-202.md`
- `tests/skills/phase3a/test_M-203.md`
- `tests/skills/phase3a/test_M-204.md`
- `tests/skills/phase3a/test_M-205.md`
- `tests/skills/phase3a/test_M-206.md`
- `tests/skills/phase3a/test_M-207.md`
- `tests/skills/phase3a/test_M-208.md`
- `tests/skills/phase3a/test_M-209.md`
- `tests/skills/phase3a/test_M-210.md`
- `tests/skills/phase3a/test_M-211.md`
- `tests/skills/phase3a/test_M-212.md`
- `tests/skills/phase3a/test_M-213.md`
- `tests/skills/phase3a/test_M-214.md`
- `tests/skills/phase3a/test_M-215.md`

### Files To Modify (Exact)
- `registries/skill_registry.yaml`
- `registries/workflow_bindings.yaml`
- `registries/schema_registry.yaml`
- `registries/director_binding.yaml` (only if new director mappings introduced)

### Expected Counts After Wave 3
- Skill markdown files: `233` (adds 15 new IDs)
- Canonical graphics set compliant: `15/15`

### Validation Commands
1. Confirm all `M-201..M-215` files exist.
2. Confirm 12-section order and 18+ tests per file.
3. Confirm dossier target `dossier.media_vein.[skill_namespace]`.

### Risks
1. Raw file count exceeds 218 unless legacy non-canonical files are excluded from canonical registry truth.

### Rollback Notes
1. Single commit: `build: add Phase 3A graphics skills`.

---

## Wave 4 — Phase 3B Video Skills (`M-216` through `M-230`)

### Files To Create (Exact)
- `skills/media_video/M-216-shot-list-generator.skill.md`
- `skills/media_video/M-217-b-roll-sourcing-strategy.skill.md`
- `skills/media_video/M-218-video-editing-script.skill.md`
- `skills/media_video/M-219-color-grading-brief.skill.md`
- `skills/media_video/M-220-sound-design-specifications.skill.md`
- `skills/media_video/M-221-motion-graphics-storyboard.skill.md`
- `skills/media_video/M-222-video-transitions-optimizer.skill.md`
- `skills/media_video/M-223-pacing-rhythm-editor.skill.md`
- `skills/media_video/M-224-title-card-generator.skill.md`
- `skills/media_video/M-225-thumbnail-designer.skill.md`
- `skills/media_video/M-226-video-seo-optimizer.skill.md`
- `skills/media_video/M-227-captions-subtitle-generator.skill.md`
- `skills/media_video/M-228-multi-angle-cut-strategy.skill.md`
- `skills/media_video/M-229-video-performance-predictor.skill.md`
- `skills/media_video/M-230-platform-specific-video-adapter.skill.md`
- `tests/skills/phase3b/test_M-216.md`
- `tests/skills/phase3b/test_M-217.md`
- `tests/skills/phase3b/test_M-218.md`
- `tests/skills/phase3b/test_M-219.md`
- `tests/skills/phase3b/test_M-220.md`
- `tests/skills/phase3b/test_M-221.md`
- `tests/skills/phase3b/test_M-222.md`
- `tests/skills/phase3b/test_M-223.md`
- `tests/skills/phase3b/test_M-224.md`
- `tests/skills/phase3b/test_M-225.md`
- `tests/skills/phase3b/test_M-226.md`
- `tests/skills/phase3b/test_M-227.md`
- `tests/skills/phase3b/test_M-228.md`
- `tests/skills/phase3b/test_M-229.md`
- `tests/skills/phase3b/test_M-230.md`

### Files To Modify (Exact)
- `registries/skill_registry.yaml`
- `registries/workflow_bindings.yaml`
- `registries/schema_registry.yaml`
- `registries/director_binding.yaml` (if needed)

### Expected Counts After Wave 4
- Skill markdown files: `248` (adds 15 new IDs)
- Canonical video set compliant: `15/15`

### Validation Commands
1. Confirm all `M-216..M-230` files exist and validate against 12-section/18-test minimum.
2. Confirm packet families and schema bindings registered.

### Risks
1. Alias management required where handoff names differ by section.

### Rollback Notes
1. Single commit: `build: add Phase 3B video skills`.

---

## Wave 5 — Phase 3C Audio Skills (`M-231` through `M-245`)

### Files To Create (Exact)
- `skills/media_audio/M-231-voiceover-direction-script.skill.md`
- `skills/media_audio/M-232-sound-design-brief.skill.md`
- `skills/media_audio/M-233-music-selection-advisor.skill.md`
- `skills/media_audio/M-234-podcast-audio-optimization.skill.md`
- `skills/media_audio/M-235-acoustic-environment-analyzer.skill.md`
- `skills/media_audio/M-236-noise-reduction-strategy.skill.md`
- `skills/media_audio/M-237-audio-levels-normalization.skill.md`
- `skills/media_audio/M-238-compression-eq-specifications.skill.md`
- `skills/media_audio/M-239-reverb-effects-designer.skill.md`
- `skills/media_audio/M-240-audio-mixing-guide.skill.md`
- `skills/media_audio/M-241-mastering-specifications.skill.md`
- `skills/media_audio/M-242-podcast-intro-outro-designer.skill.md`
- `skills/media_audio/M-243-audio-transitions-optimizer.skill.md`
- `skills/media_audio/M-244-transcript-generator.skill.md`
- `skills/media_audio/M-245-accessibility-audio-description.skill.md`
- `tests/skills/phase3c/test_M-231.md`
- `tests/skills/phase3c/test_M-232.md`
- `tests/skills/phase3c/test_M-233.md`
- `tests/skills/phase3c/test_M-234.md`
- `tests/skills/phase3c/test_M-235.md`
- `tests/skills/phase3c/test_M-236.md`
- `tests/skills/phase3c/test_M-237.md`
- `tests/skills/phase3c/test_M-238.md`
- `tests/skills/phase3c/test_M-239.md`
- `tests/skills/phase3c/test_M-240.md`
- `tests/skills/phase3c/test_M-241.md`
- `tests/skills/phase3c/test_M-242.md`
- `tests/skills/phase3c/test_M-243.md`
- `tests/skills/phase3c/test_M-244.md`
- `tests/skills/phase3c/test_M-245.md`

### Files To Modify (Exact)
- `registries/skill_registry.yaml`
- `registries/workflow_bindings.yaml`
- `registries/schema_registry.yaml`
- `registries/director_binding.yaml` (if needed)

### Expected Counts After Wave 5
- Skill markdown files: `263` (adds 15 new IDs)
- Canonical audio set compliant: `15/15`

### Validation Commands
1. Confirm all `M-231..M-245` files exist and satisfy template/tests requirements.
2. Confirm `dossier.media_vein.[skill_namespace]` target on all 15.

### Risks
1. Legacy non-canonical files still present on disk; canonical registry must explicitly define authoritative set.

### Rollback Notes
1. Single commit: `build: add Phase 3C audio skills`.

---

## Wave 6 — n8n Workflow JSONs (Canonical Filenames)

### Files To Create (Exact)
- `n8n/workflows/CWF-110.json`
- `n8n/workflows/CWF-120.json`
- `n8n/workflows/CWF-130.json`
- `n8n/workflows/CWF-140.json`
- `n8n/workflows/CWF-210.json`
- `n8n/workflows/CWF-220.json`
- `n8n/workflows/CWF-230.json`
- `n8n/workflows/CWF-240.json`
- `n8n/workflows/WF-020.json`
- `n8n/workflows/WF-021.json`

### Files To Modify (Exact)
- Existing nested workflow JSONs only if needed to preserve consistency:
  - `n8n/workflows/topic/CWF-110-topic-discovery.json`
  - `n8n/workflows/topic/CWF-120-topic-qualification.json`
  - `n8n/workflows/topic/CWF-130-topic-scoring.json`
  - `n8n/workflows/topic/CWF-140-research-synthesis.json`
  - `n8n/workflows/script/CWF-210-script-generation.json`
  - `n8n/workflows/script/CWF-220-script-debate.json`
  - `n8n/workflows/script/CWF-230-script-refinement.json`
  - `n8n/workflows/script/CWF-240-final-script-shaping.json`
  - `n8n/workflows/approval/WF-020-final-approval.json`
  - `n8n/workflows/approval/WF-021-replay-remodify.json`
- `registries/workflow_bindings.yaml`
- `SYSTEM_MANIFEST.yaml`

### Expected Counts After Wave 6
- Canonical required workflow JSON files present: `10/10`
- All canonical workflow JSON parse-valid: `10/10`

### Validation Commands
1. JSON parse of all `n8n/workflows/*.json`.
2. Node coverage checks for required 10-node architecture per workflow.
3. Ensure WF-900 routing and completion packet emission present in each.

### Risks
1. Duplicate `WF-020` definitions currently conflict; canonical file must be authoritative.

### Rollback Notes
1. Single commit: `build: add executable n8n workflow JSONs`.

---

## Wave 7 — Runtime Engines

### Files To Modify (Exact)
- `engine/skill_loader/skill_loader.js`
- `engine/skill_loader/skill_registry_resolver.js`
- `engine/skill_loader/skill_executor.js`
- `engine/dossier/dossier_writer.js`
- `engine/dossier/dossier_reader.js`
- `engine/dossier/dossier_delta_manager.js`
- `engine/packets/packet_validator.js`
- `engine/packets/packet_router.js`
- `engine/packets/packet_index_writer.js`
- `engine/approval/approval_writer.js`
- `engine/approval/approval_resolver.js`
- `engine/approval/approval_router.js`

### Expected Counts After Wave 7
- Required runtime files present: `12/12`
- Deterministic non-random runtime contract enforced.
- Append-only mutation law enforcement centralized.

### Validation Commands
1. Static scan: no `Math.random()` in deterministic execution paths.
2. Runtime unit checks: overwrite mutation attempts must fail.
3. Error routing checks: all failures route to `WF-900`; rejection to `WF-021`.

### Risks
1. Existing consumers may depend on current relaxed packet/delta structure.

### Rollback Notes
1. Single commit: `build: add runtime engines`.

---

## Wave 8 — Validators

### Files To Modify (Exact)
- `validators/workflow_validator.js`
- `validators/schema_validator.js`
- `validators/registry_validator.js`
- `validators/runtime_validator.js`

### Files To Create (Exact)
- `tests/validators/test_workflow_validator.md`
- `tests/validators/test_schema_validator.md`
- `tests/validators/test_registry_validator.md`
- `tests/validators/test_runtime_validator.md`

### Expected Counts After Wave 8
- Required validator files present: `4/4`
- Mandatory checks from handoff implemented end-to-end.

### Validation Commands
1. Run validator scripts against repo.
2. Confirm detection on injected negative fixtures:
   - duplicate skill IDs
   - missing schema refs
   - missing WF-900 route
   - non-append dossier mutation

### Risks
1. Validation strictness may fail current legacy files until migration is complete.

### Rollback Notes
1. Single commit: `build: add validation layer`.

---

## Wave 9 — Remaining Registries

### Files To Create (Exact)
- `registries/governance_rules.yaml`

### Files To Modify (Exact)
- `registries/provider_registry.yaml`
- `registries/mode_registry.yaml`
- `registries/skill_registry.yaml`
- `registries/workflow_bindings.yaml`
- `registries/director_binding.yaml`
- `registries/schema_registry.yaml`

### Expected Counts After Wave 9
- Mandatory canonical registries present: `7/7`
- Registry referential closure valid.

### Validation Commands
1. YAML parse for all canonical registries.
2. Cross-reference:
   - every skill in `skill_registry.yaml` exists
   - every skill has `workflow_bindings.yaml` entry
   - every packet family has `schema_registry.yaml` entry
   - every referenced director exists in `director_binding.yaml`

### Risks
1. Legacy split registries may diverge from new canonical files if dual-maintained.

### Rollback Notes
1. Single commit: `build: complete registries and system docs`.

---

## Wave 10 — System Documentation

### Files To Create (Exact)
- `DEPLOYMENT_STATUS.md`
- `RUNBOOK_PHASE1_EXECUTION.md`

### Files To Modify (Exact)
- `SYSTEM_MANIFEST.yaml`

### Expected Counts After Wave 10
- Required core system docs present: `3/3`
- Documentation state aligned to validated repository reality.

### Validation Commands
1. Validate all file references in docs exist.
2. Ensure completion claims are backed by validator output.
3. Ensure phase status marks `PARTIAL` until all acceptance conditions are actually met.

### Risks
1. Documentation drift risk if generated before final validation pass.

### Rollback Notes
1. Single commit: `build: complete registries and system docs`.

---

## Global Validation Suite To Run After Every Wave
1. Skill count and template checks (`12 sections`, `18+ tests`, `8-10+ execution steps`).
2. JSON parse for all workflow files touched.
3. YAML parse for all registry files touched.
4. Referential closure:
   - skill registry ↔ workflow bindings
   - skill/director references ↔ director binding
   - packet families ↔ schema registry
5. Mutation-law checks:
   - no overwrite operations
   - append-only audit continuity
6. Escalation checks:
   - `WF-900` and `WF-021` path coverage where required.
7. `git status --short` reporting.

## Commit Discipline
1. Wave 1: `build: add Phase 2C platform variant skills`
2. Wave 2: `build: add Phase 1C conditional research skills`
3. Wave 3: `build: add Phase 3A graphics skills`
4. Wave 4: `build: add Phase 3B video skills`
5. Wave 5: `build: add Phase 3C audio skills`
6. Wave 6: `build: add executable n8n workflow JSONs`
7. Wave 7: `build: add runtime engines`
8. Wave 8: `build: add validation layer`
9. Wave 9-10: `build: complete registries and system docs`

## Logged Assumptions
1. Legacy artifacts can remain physically present but must be excluded from canonical runtime truth via canonical registries.
2. Canonical acceptance will be driven by authoritative registry binding and validator pass results, not raw file count alone during migration.
