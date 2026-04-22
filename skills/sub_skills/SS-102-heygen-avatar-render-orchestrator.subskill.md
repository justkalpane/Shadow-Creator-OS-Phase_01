# SUBSKILL SS-102 - HeyGen Avatar Render Orchestrator

## SECTION 1: SKILL IDENTITY & OWNERSHIP
- Skill_ID: SS-102
- Canonical_Name: HeyGen Avatar Render Orchestrator
- Archetype: integration
- Role_Type: PRIMARY_ROLE
- Owner_Director: Vishwakarma
- Domain: Avatar Rendering

## SECTION 2: AUTHORITY MATRIX
- Can_Execute: provider optimization, payload shaping, quality gating, fallback routing
- Cannot_Execute: policy override, budget override, unauthorized namespace mutation
- Requires_Approval: premium provider route when budget/policy token required
- Escalation_Required: critical provider auth/callback failures
- Veto_Authority: NO

## SECTION 3: READS (INPUT VEINS)
### 3.1 Primary Inputs
- dossier_id:string
- avatar_profile_id:string
- voice_asset_ref:string
- scene_plan:object
- governance_ack:boolean(optional)

### 3.2 Provider Context
  - heygen_api
  - local_avatar_fallback

## SECTION 4: WRITES (OUTPUT VEINS)
- artifact_family:heygen-avatar-render_packet
- render_job_id:string
- render_state:string
- status:success|failed|degraded
- write_target: dossier.platform_subskills.heygen-avatar-render-orchestrator (append_only)
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
- Submit render jobs with deterministic job tags tied to dossier and route
- Use poll interval 60s and max 40 cycles when callback contract is not final
- Validate avatar-motion consistency and lip-sync envelope before acceptance
- Apply callback signature verification when webhook mode is enabled
- Route long-form jobs to cloud premium lane with explicit budget token

## SECTION 8: EXECUTION RULES & CONSTRAINTS
- Enforce patch-only mutation law on dossier writes.
- Never bypass provider auth/callback contracts.
- Record deterministic replay metadata for every execution.
- Respect route_id, cost_tier, and policy verdict constraints.

## SECTION 9: FAILURE MODES & RECOVERY
- render_timeout -> escalate WF-900 with provider_job_id
- callback_verification_failed -> switch to secure poller mode
- provider_job_failed -> route WF-021 with remodify hints
- budget_denied -> founder hold with local avatar draft fallback

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
- packet_contract: heygen-avatar-render-orchestrator_packet
- replay_path: WF-021
- escalation_path: WF-900

## SECTION 12: VALIDATION & ACCEPTANCE
- Must emit status, artifact_family, payload, and provider_execution_summary.
- Must include deterministic error codes on failed/degraded runs.
- Must pass field-level schema checks before downstream handoff.
