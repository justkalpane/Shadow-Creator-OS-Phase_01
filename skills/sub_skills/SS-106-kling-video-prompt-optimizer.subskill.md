# SUBSKILL SS-106 - Kling Video Prompt Optimizer

## SECTION 1: SKILL IDENTITY & OWNERSHIP
- Skill_ID: SS-106
- Canonical_Name: Kling Video Prompt Optimizer
- Archetype: integration
- Role_Type: PRIMARY_ROLE
- Owner_Director: Maya
- Domain: Video Prompt Optimization

## SECTION 2: AUTHORITY MATRIX
- Can_Execute: provider optimization, payload shaping, quality gating, fallback routing
- Cannot_Execute: policy override, budget override, unauthorized namespace mutation
- Requires_Approval: premium provider route when budget/policy token required
- Escalation_Required: critical provider auth/callback failures
- Veto_Authority: NO

## SECTION 3: READS (INPUT VEINS)
### 3.1 Primary Inputs
- dossier_id:string
- scene_brief:object
- duration_class:string
- style_profile:string

### 3.2 Provider Context
  - kling_api
  - prompt_fallback_chain

## SECTION 4: WRITES (OUTPUT VEINS)
- artifact_family:kling-prompt-optimization_packet
- optimized_prompts:array
- variant_eval:array
- status:success|failed|degraded
- write_target: dossier.platform_subskills.kling-video-prompt-optimizer (append_only)
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
- Convert long prompts into hierarchical scene directives
- Use constraint blocks for camera, subject, lighting, and motion
- Apply style lock to reduce cross-shot drift
- Generate prompt variants tuned for short, mid, and long form
- Attach failure-replay metadata for deterministic regeneration

## SECTION 8: EXECUTION RULES & CONSTRAINTS
- Enforce patch-only mutation law on dossier writes.
- Never bypass provider auth/callback contracts.
- Record deterministic replay metadata for every execution.
- Respect route_id, cost_tier, and policy verdict constraints.

## SECTION 9: FAILURE MODES & RECOVERY
- prompt_rejection -> simplify constraints and retry
- output_drift -> inject stronger style anchors
- quota_limit -> fallback to reduced variant set
- provider_latency_spike -> move to deferred queue with SLA tag

## SECTION 10: TOOL POLICY
- Allowed_Tools: n8n workflow nodes, provider adapters, packet validators, local runtime utilities
- Forbidden_Tools: destructive filesystem operations, unauthorized secret writes
- Secret_Scope: local secure store and approved secret manager only

## SECTION 11: N8N + OLLAMA PLUGGABILITY
- n8n_consumer_workflows:
  - WF-400
  - CWF-420
  - CWF-440
- ollama_reasoning_injection: true
- packet_contract: kling-video-prompt-optimizer_packet
- replay_path: WF-021
- escalation_path: WF-900

## SECTION 12: VALIDATION & ACCEPTANCE
- Must emit status, artifact_family, payload, and provider_execution_summary.
- Must include deterministic error codes on failed/degraded runs.
- Must pass field-level schema checks before downstream handoff.
