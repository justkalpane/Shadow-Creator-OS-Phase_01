# SUBSKILL SS-234 - Platform Strategy Mapper

## SECTION 1: SKILL IDENTITY & OWNERSHIP
- Skill_ID: SS-234
- Canonical_Name: Platform Strategy Mapper
- Archetype: integration
- Role_Type: PRIMARY_ROLE
- Owner_Director: Garuda
- Domain: Platform Strategy

## SECTION 2: AUTHORITY MATRIX
- Can_Execute: domain-specific analysis, planning, optimization, and packet shaping
- Cannot_Execute: budget override, policy override, unauthorized namespace mutation
- Requires_Approval: premium route invocation when route budget/policy gates require it
- Escalation_Required: unresolved contradictions, auth/callback failures, critical quality violations
- Veto_Authority: NO

## SECTION 3: READS (INPUT VEINS)
### 3.1 Primary Inputs
- dossier_id:string
- calendar_plan:object
- platform_profiles:array

### 3.2 Provider Context
  - youtube_data_api
  - youtube_analytics_api
  - internal_platform_runtime

## SECTION 4: WRITES (OUTPUT VEINS)
- artifact_family:platform-strategy-mapper_packet
- platform_strategy_map:object
- distribution_priorities:array
- status:success|failed|degraded
- write_target: dossier.subskills.platform-strategy-mapper (append_only)
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
- Map content formats to platform-specific success metrics
- Adapt metadata and packaging per platform constraints
- Define channel-level distribution priorities
- Attach platform risk and compliance notes
- Feed platform strategy outcomes into analytics loop

## SECTION 8: EXECUTION RULES & CONSTRAINTS
- Enforce patch-only mutation law for dossier updates.
- Preserve evidence/provenance traceability in all outputs.
- Respect route_id, cost_tier, and policy_verdict constraints.
- Keep outputs deterministic and replay-safe.

## SECTION 9: FAILURE MODES & RECOVERY
- platform_constraints_missing -> use safe defaults and flag
- metadata_contract_fail -> block distribution packet
- oauth_or_quota_block -> defer platform branch
- mapping_runtime_error -> escalate WF-900

## SECTION 10: TOOL POLICY
- Allowed_Tools: n8n workflow nodes, provider adapters, packet validators, local runtime utilities
- Forbidden_Tools: destructive mutation, unauthorized secrets operations, undeclared network paths
- Secret_Scope: local secure store and approved secrets manager only

## SECTION 11: N8N + OLLAMA PLUGGABILITY
- n8n_consumer_workflows:
  - WF-500
  - CWF-510
  - CWF-520
- ollama_reasoning_injection: true
- packet_contract: platform-strategy-mapper_packet
- replay_path: WF-021
- escalation_path: WF-900

## SECTION 12: VALIDATION & ACCEPTANCE
- Must emit status, artifact_family, payload, and provider_execution_summary.
- Must include deterministic error_code for failed/degraded outcomes.
- Must satisfy downstream field contracts before handoff.
