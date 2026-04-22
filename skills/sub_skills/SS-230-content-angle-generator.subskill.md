# SUBSKILL SS-230 - Content Angle Generator

## SECTION 1: SKILL IDENTITY & OWNERSHIP
- Skill_ID: SS-230
- Canonical_Name: Content Angle Generator
- Archetype: integration
- Role_Type: PRIMARY_ROLE
- Owner_Director: Narada
- Domain: Content Strategy

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
- artifact_family:content-angle-generator_packet
- angle_candidates:array
- angle_scores:array
- status:success|failed|degraded
- write_target: dossier.subskills.content-angle-generator (append_only)
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
- Generate multiple differentiated angles per topic
- Align angle set to audience pain points and novelty
- Tag angles by risk, effort, and potential upside
- Avoid repetitive angle templates across channel history
- Bind selected angle to measurable hypothesis

## SECTION 8: EXECUTION RULES & CONSTRAINTS
- Enforce patch-only mutation law for dossier updates.
- Preserve evidence/provenance traceability in all outputs.
- Respect route_id, cost_tier, and policy_verdict constraints.
- Keep outputs deterministic and replay-safe.

## SECTION 9: FAILURE MODES & RECOVERY
- low_novelty_angles -> regenerate with stricter constraints
- audience_mismatch -> reroute to psychology profiling
- angle_conflict_with_policy -> filter and re-rank
- model_timeout -> degrade to minimal angle set

## SECTION 10: TOOL POLICY
- Allowed_Tools: n8n workflow nodes, provider adapters, packet validators, local runtime utilities
- Forbidden_Tools: destructive mutation, unauthorized secrets operations, undeclared network paths
- Secret_Scope: local secure store and approved secrets manager only

## SECTION 11: N8N + OLLAMA PLUGGABILITY
- n8n_consumer_workflows:
  - WF-100
  - WF-200
  - CWF-210
- ollama_reasoning_injection: true
- packet_contract: content-angle-generator_packet
- replay_path: WF-021
- escalation_path: WF-900

## SECTION 12: VALIDATION & ACCEPTANCE
- Must emit status, artifact_family, payload, and provider_execution_summary.
- Must include deterministic error_code for failed/degraded outcomes.
- Must satisfy downstream field contracts before handoff.
