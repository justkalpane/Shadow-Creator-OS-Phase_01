# SUBSKILL SS-232 - Series Strategy Planner

## SECTION 1: SKILL IDENTITY & OWNERSHIP
- Skill_ID: SS-232
- Canonical_Name: Series Strategy Planner
- Archetype: integration
- Role_Type: PRIMARY_ROLE
- Owner_Director: Valmiki
- Domain: Series Planning

## SECTION 2: AUTHORITY MATRIX
- Can_Execute: domain-specific analysis, planning, optimization, and packet shaping
- Cannot_Execute: budget override, policy override, unauthorized namespace mutation
- Requires_Approval: premium route invocation when route budget/policy gates require it
- Escalation_Required: unresolved contradictions, auth/callback failures, critical quality violations
- Veto_Authority: NO

## SECTION 3: READS (INPUT VEINS)
### 3.1 Primary Inputs
- dossier_id:string
- uvp_packet:object
- content_constraints:object

### 3.2 Provider Context
  - internal_strategy_runtime

## SECTION 4: WRITES (OUTPUT VEINS)
- artifact_family:series-strategy-planner_packet
- series_map:object
- episode_objectives:array
- status:success|failed|degraded
- write_target: dossier.subskills.series-strategy-planner (append_only)
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
- Plan episodic progression with escalating value
- Map each episode to a distinct retention objective
- Include dependency links between episodes
- Maintain continuity anchors for returning viewers
- Expose fallback standalone mode for each episode

## SECTION 8: EXECUTION RULES & CONSTRAINTS
- Enforce patch-only mutation law for dossier updates.
- Preserve evidence/provenance traceability in all outputs.
- Respect route_id, cost_tier, and policy_verdict constraints.
- Keep outputs deterministic and replay-safe.

## SECTION 9: FAILURE MODES & RECOVERY
- continuity_gap_detected -> regenerate sequence map
- episode_dependency_cycle -> break and replan
- retention_objective_missing -> block output
- planner_error -> escalate WF-900

## SECTION 10: TOOL POLICY
- Allowed_Tools: n8n workflow nodes, provider adapters, packet validators, local runtime utilities
- Forbidden_Tools: destructive mutation, unauthorized secrets operations, undeclared network paths
- Secret_Scope: local secure store and approved secrets manager only

## SECTION 11: N8N + OLLAMA PLUGGABILITY
- n8n_consumer_workflows:
  - WF-200
  - CWF-210
  - WF-500
- ollama_reasoning_injection: true
- packet_contract: series-strategy-planner_packet
- replay_path: WF-021
- escalation_path: WF-900

## SECTION 12: VALIDATION & ACCEPTANCE
- Must emit status, artifact_family, payload, and provider_execution_summary.
- Must include deterministic error_code for failed/degraded outcomes.
- Must satisfy downstream field contracts before handoff.
