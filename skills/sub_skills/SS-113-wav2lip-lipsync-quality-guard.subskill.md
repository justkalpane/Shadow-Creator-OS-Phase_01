# SUBSKILL SS-113 - Wav2Lip LipSync Quality Guard

## SECTION 1: SKILL IDENTITY & OWNERSHIP
- Skill_ID: SS-113
- Canonical_Name: Wav2Lip LipSync Quality Guard
- Archetype: integration
- Role_Type: PRIMARY_ROLE
- Owner_Director: Saraswati
- Domain: LipSync QA

## SECTION 2: AUTHORITY MATRIX
- Can_Execute: provider optimization, payload shaping, quality gating, fallback routing
- Cannot_Execute: policy override, budget override, unauthorized namespace mutation
- Requires_Approval: premium provider route when budget/policy token required
- Escalation_Required: critical provider auth/callback failures
- Veto_Authority: NO

## SECTION 3: READS (INPUT VEINS)
### 3.1 Primary Inputs
- dossier_id:string
- avatar_video_ref:string
- voice_audio_ref:string

### 3.2 Provider Context
  - wav2lip_runtime

## SECTION 4: WRITES (OUTPUT VEINS)
- artifact_family:wav2lip-quality-guard_packet
- lipsync_metrics:object
- segment_repairs:array
- status:success|failed|degraded
- write_target: dossier.platform_subskills.wav2lip-lipsync-quality-guard (append_only)
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
- Align phoneme timing windows against speech energy curve
- Run frame-level lip consistency checks on key visemes
- Apply correction only on failing segments to preserve natural motion
- Use confidence thresholds before accepting final lipsync pass
- Record before-after metrics for governance traceability

## SECTION 8: EXECUTION RULES & CONSTRAINTS
- Enforce patch-only mutation law on dossier writes.
- Never bypass provider auth/callback contracts.
- Record deterministic replay metadata for every execution.
- Respect route_id, cost_tier, and policy verdict constraints.

## SECTION 9: FAILURE MODES & RECOVERY
- confidence_below_floor -> reroute to avatar remodify lane
- alignment_model_error -> fallback to conservative sync mode
- segment_repair_fail -> escalate WF-900 with segment diagnostics
- timing_drift -> trigger audio trim and re-evaluation

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
- packet_contract: wav2lip-lipsync-quality-guard_packet
- replay_path: WF-021
- escalation_path: WF-900

## SECTION 12: VALIDATION & ACCEPTANCE
- Must emit status, artifact_family, payload, and provider_execution_summary.
- Must include deterministic error codes on failed/degraded runs.
- Must pass field-level schema checks before downstream handoff.
