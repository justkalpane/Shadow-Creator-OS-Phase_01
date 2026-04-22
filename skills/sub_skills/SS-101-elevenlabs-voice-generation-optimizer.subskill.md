# SUBSKILL SS-101 - ElevenLabs Voice Generation Optimizer

## SECTION 1: SKILL IDENTITY & OWNERSHIP
- Skill_ID: SS-101
- Canonical_Name: ElevenLabs Voice Generation Optimizer
- Archetype: integration
- Role_Type: PRIMARY_ROLE
- Owner_Director: Saraswati
- Domain: Voice Generation

## SECTION 2: AUTHORITY MATRIX
- Can_Execute: provider optimization, payload shaping, quality gating, fallback routing
- Cannot_Execute: policy override, budget override, unauthorized namespace mutation
- Requires_Approval: premium provider route when budget/policy token required
- Escalation_Required: critical provider auth/callback failures
- Veto_Authority: NO

## SECTION 3: READS (INPUT VEINS)
### 3.1 Primary Inputs
- dossier_id:string
- script_text:string
- voice_profile_id:string
- emotion_profile:object
- cost_tier:string

### 3.2 Provider Context
  - elevenlabs_api
  - xtts_v2_fallback

## SECTION 4: WRITES (OUTPUT VEINS)
- artifact_family:elevenlabs-voice-generation_packet
- voice_asset_manifest:object
- chunk_metrics:array
- status:success|failed|degraded
- write_target: dossier.platform_subskills.elevenlabs-voice-generation-optimizer (append_only)
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
- Apply 4800-char chunking guard to stay below 5000-char hard cap
- Use stable voice profile with constrained style exaggeration for persona consistency
- Run chunk-level retry with capped premium retries and fallback to XTTS-v2
- Cache voice outputs by script_hash+persona+emotion to reduce repeat spend
- Enforce quality floor checks (clarity, pacing, pronunciation) before publish

## SECTION 8: EXECUTION RULES & CONSTRAINTS
- Enforce patch-only mutation law on dossier writes.
- Never bypass provider auth/callback contracts.
- Record deterministic replay metadata for every execution.
- Respect route_id, cost_tier, and policy verdict constraints.

## SECTION 9: FAILURE MODES & RECOVERY
- provider_auth_error -> block voice stage and escalate WF-900
- quota_exceeded -> fallback XTTS-v2 then founder hold
- latency_timeout -> chunk replay from last successful chunk
- voice_quality_below_floor -> route WF-021 for script/voice remodify

## SECTION 10: TOOL POLICY
- Allowed_Tools: n8n workflow nodes, provider adapters, packet validators, local runtime utilities
- Forbidden_Tools: destructive filesystem operations, unauthorized secret writes
- Secret_Scope: local secure store and approved secret manager only

## SECTION 11: N8N + OLLAMA PLUGGABILITY
- n8n_consumer_workflows:
  - WF-400
  - CWF-430
  - WF-500
- ollama_reasoning_injection: true
- packet_contract: elevenlabs-voice-generation-optimizer_packet
- replay_path: WF-021
- escalation_path: WF-900

## SECTION 12: VALIDATION & ACCEPTANCE
- Must emit status, artifact_family, payload, and provider_execution_summary.
- Must include deterministic error codes on failed/degraded runs.
- Must pass field-level schema checks before downstream handoff.
