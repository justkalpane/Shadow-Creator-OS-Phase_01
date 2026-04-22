# SUBSKILL SS-107 - Suno Music Generation Optimizer

## SECTION 1: SKILL IDENTITY & OWNERSHIP
- Skill_ID: SS-107
- Canonical_Name: Suno Music Generation Optimizer
- Archetype: integration
- Role_Type: PRIMARY_ROLE
- Owner_Director: Tumburu
- Domain: Music Generation

## SECTION 2: AUTHORITY MATRIX
- Can_Execute: provider optimization, payload shaping, quality gating, fallback routing
- Cannot_Execute: policy override, budget override, unauthorized namespace mutation
- Requires_Approval: premium provider route when budget/policy token required
- Escalation_Required: critical provider auth/callback failures
- Veto_Authority: NO

## SECTION 3: READS (INPUT VEINS)
### 3.1 Primary Inputs
- dossier_id:string
- music_brief:object
- emotion_curve:object
- duration_seconds:number

### 3.2 Provider Context
  - suno_api
  - local_music_fallback

## SECTION 4: WRITES (OUTPUT VEINS)
- artifact_family:suno-music-generation_packet
- audio_stem_refs:array
- mix_report:object
- status:success|failed|degraded
- write_target: dossier.platform_subskills.suno-music-generation-optimizer (append_only)
- write_target: se_packet_index (append_only)

## SECTION 5: EXECUTION FLOW & ALGORITHM
1. Validate required fields and provider legality posture.
2. Apply platform-specific optimization rules and constraints.
3. Execute guarded transformation and collect runtime telemetry.
4. Validate output packet fields and quality floor criteria.
5. Emit packet, append dossier patch, and route escalation if required.

## SECTION 6: SCORING FRAMEWORK
- quality_score (0-100)
- latency_score (0-100)
- cost_efficiency_score (0-100)
- governance_compliance_score (0-100)
- acceptance_rule: governance_compliance_score >= 90 and quality_score >= 75

## SECTION 7: BEST PRACTICES
- Map emotion curve to tempo, key, and instrumentation profile
- Keep hook motif reusable across intro, body, and outro segments
- Use stem-friendly generation settings for post-production edits
- Apply loudness normalization targets before packaging
- Maintain rights-safe metadata and asset lineage for publish

## SECTION 8: EXECUTION RULES & CONSTRAINTS
- Enforce patch-only mutation law on dossier writes.
- Never bypass provider auth/callback contracts.
- Record deterministic replay metadata for every execution.
- Respect route_id, cost_tier, and policy verdict constraints.

## SECTION 9: FAILURE MODES & RECOVERY
- generation_fail -> retry with reduced style complexity
- rights_metadata_missing -> block package finalization
- mix_quality_low -> route FFmpeg audio polish stage
- provider_unavailable -> fallback to local music bed template

## SECTION 10: TOOL POLICY
- Allowed_Tools: n8n workflow nodes, provider adapters, packet validators, local runtime utilities
- Forbidden_Tools: destructive filesystem operations, unauthorized secret writes
- Secret_Scope: local secure store and approved secret manager only

## SECTION 11: N8N + OLLAMA PLUGGABILITY
- n8n_consumer_workflows:
  - WF-400
  - CWF-430
  - CWF-440
- ollama_reasoning_injection: true
- packet_contract: suno-music-generation-optimizer_packet
- replay_path: WF-021
- escalation_path: WF-900

## SECTION 12: VALIDATION & ACCEPTANCE
- Must emit status, artifact_family, payload, and provider_execution_summary.
- Must include deterministic error codes on failed/degraded runs.
- Must pass field-level schema checks before downstream handoff.
