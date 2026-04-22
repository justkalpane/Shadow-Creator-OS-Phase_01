# SUBSKILL SS-240 - Hook Variation Generator

## SECTION 1: SKILL IDENTITY & OWNERSHIP
- Skill_ID: SS-240
- Canonical_Name: Hook Variation Generator
- Archetype: integration
- Role_Type: PRIMARY_ROLE
- Owner_Director: Agni
- Domain: Narrative Hooks

## SECTION 2: AUTHORITY MATRIX
- Can_Execute: domain-specific analysis, planning, optimization, and packet shaping
- Cannot_Execute: budget override, policy override, unauthorized namespace mutation
- Requires_Approval: premium route invocation when route budget/policy gates require it
- Escalation_Required: unresolved contradictions, auth/callback failures, critical quality violations
- Veto_Authority: NO

## SECTION 3: READS (INPUT VEINS)
### 3.1 Primary Inputs
- dossier_id:string
- topic_packet:object
- audience_profile:object

### 3.2 Provider Context
  - ollama_local
  - openrouter_api

## SECTION 4: WRITES (OUTPUT VEINS)
- artifact_family:hook-variation-generator_packet
- hook_variants:array
- hook_scores:array
- status:success|failed|degraded
- write_target: dossier.subskills.hook-variation-generator (append_only)
- write_target: se_packet_index (append_only)

## SECTION 5: EXECUTION FLOW & ALGORITHM
1. Validate input packet fields and route legality context.
2. Execute domain intelligence transform using platform/runtime constraints.
3. Apply quality, cost, and governance-aware optimization passes.
4. Validate output contract and emit deterministic error semantics if degraded.
5. Append output packet and lineage-safe dossier patch.

## SECTION 6: SCORING FRAMEWORK
- quality_score (0-100)
- confidence_score (0-100)
- cost_efficiency_score (0-100)
- governance_compliance_score (0-100)
- acceptance_rule: governance_compliance_score >= 90 and quality_score >= 75

## SECTION 7: BEST PRACTICES
- Produce multi-style hook variants aligned to audience archetypes
- Balance curiosity with clarity and payoff promise
- Tag each hook with expected retention behavior
- Filter clickbait-only hooks that fail content truth tests
- Support A/B hook packets for testing

## SECTION 8: EXECUTION RULES & CONSTRAINTS
- Enforce patch-only mutation law for dossier updates.
- Preserve evidence/provenance traceability in all outputs.
- Respect route_id, cost_tier, and policy_verdict constraints.
- Keep outputs deterministic and replay-safe.

## SECTION 9: FAILURE MODES & RECOVERY
- hooks_low_clarity -> regenerate with constraints
- policy_risk_hook -> quarantine variant
- retention_score_below_floor -> rerank hooks
- generation_error -> escalate WF-900

## SECTION 10: TOOL POLICY
- Allowed_Tools: n8n workflow nodes, provider adapters, packet validators, local runtime utilities
- Forbidden_Tools: destructive mutation, unauthorized secrets operations, undeclared network paths
- Secret_Scope: local secure store and approved secrets manager only

## SECTION 11: N8N + OLLAMA PLUGGABILITY
- n8n_consumer_workflows:
  - WF-200
  - CWF-210
  - CWF-220
- ollama_reasoning_injection: true
- packet_contract: hook-variation-generator_packet
- replay_path: WF-021
- escalation_path: WF-900

## SECTION 12: VALIDATION & ACCEPTANCE
- Must emit status, artifact_family, payload, and provider_execution_summary.
- Must include deterministic error_code for failed/degraded outcomes.
- Must satisfy downstream field contracts before handoff.
