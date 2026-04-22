# SUBSKILL SS-112 - FFmpeg Render Assembly Guard

## SECTION 1: SKILL IDENTITY & OWNERSHIP
- Skill_ID: SS-112
- Canonical_Name: FFmpeg Render Assembly Guard
- Archetype: integration
- Role_Type: PRIMARY_ROLE
- Owner_Director: Agni
- Domain: Render Assembly

## SECTION 2: AUTHORITY MATRIX
- Can_Execute: provider optimization, payload shaping, quality gating, fallback routing
- Cannot_Execute: policy override, budget override, unauthorized namespace mutation
- Requires_Approval: premium provider route when budget/policy token required
- Escalation_Required: critical provider auth/callback failures
- Veto_Authority: NO

## SECTION 3: READS (INPUT VEINS)
### 3.1 Primary Inputs
- dossier_id:string
- media_package_plan:object
- target_profiles:array

### 3.2 Provider Context
  - ffmpeg_bridge

## SECTION 4: WRITES (OUTPUT VEINS)
- artifact_family:ffmpeg-render-assembly_packet
- render_outputs:array
- render_qc:object
- status:success|failed|degraded
- write_target: dossier.platform_subskills.ffmpeg-render-assembly-guard (append_only)
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
- Use deterministic render presets by platform target
- Validate audio-video sync drift under threshold before final package
- Avoid heavy final renders on unsupported worker classes
- Apply checkpointed intermediate outputs for replay safety
- Emit render metrics for cost and quality observability

## SECTION 8: EXECUTION RULES & CONSTRAINTS
- Enforce patch-only mutation law on dossier writes.
- Never bypass provider auth/callback contracts.
- Record deterministic replay metadata for every execution.
- Respect route_id, cost_tier, and policy verdict constraints.

## SECTION 9: FAILURE MODES & RECOVERY
- render_worker_unsupported -> reroute cloud render worker
- mux_failure -> retry from last successful intermediate
- sync_drift_excess -> route lip-sync correction stage
- codec_validation_fail -> fallback to safe codec profile

## SECTION 10: TOOL POLICY
- Allowed_Tools: n8n workflow nodes, provider adapters, packet validators, local runtime utilities
- Forbidden_Tools: destructive filesystem operations, unauthorized secret writes
- Secret_Scope: local secure store and approved secret manager only

## SECTION 11: N8N + OLLAMA PLUGGABILITY
- n8n_consumer_workflows:
  - WF-400
  - CWF-440
  - WF-500
- ollama_reasoning_injection: true
- packet_contract: ffmpeg-render-assembly-guard_packet
- replay_path: WF-021
- escalation_path: WF-900

## SECTION 12: VALIDATION & ACCEPTANCE
- Must emit status, artifact_family, payload, and provider_execution_summary.
- Must include deterministic error codes on failed/degraded runs.
- Must pass field-level schema checks before downstream handoff.
