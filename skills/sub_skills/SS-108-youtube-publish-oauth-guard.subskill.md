# SUBSKILL SS-108 - YouTube Publish OAuth Guard

## SECTION 1: SKILL IDENTITY & OWNERSHIP
- Skill_ID: SS-108
- Canonical_Name: YouTube Publish OAuth Guard
- Archetype: integration
- Role_Type: PRIMARY_ROLE
- Owner_Director: Garuda
- Domain: Publishing

## SECTION 2: AUTHORITY MATRIX
- Can_Execute: provider optimization, payload shaping, quality gating, fallback routing
- Cannot_Execute: policy override, budget override, unauthorized namespace mutation
- Requires_Approval: premium provider route when budget/policy token required
- Escalation_Required: critical provider auth/callback failures
- Veto_Authority: NO

## SECTION 3: READS (INPUT VEINS)
### 3.1 Primary Inputs
- dossier_id:string
- publish_packet:object
- oauth_profile_id:string
- callback_context:object

### 3.2 Provider Context
  - youtube_data_api

## SECTION 4: WRITES (OUTPUT VEINS)
- artifact_family:youtube-publish-oauth-guard_packet
- publish_decision:object
- oauth_verdict:object
- status:success|failed|blocked
- write_target: dossier.platform_subskills.youtube-publish-oauth-guard (append_only)
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
- Enforce state and nonce validation on OAuth callback
- Require exact redirect URI match per environment matrix
- Use resumable upload with duplicate-publish suppression key
- Validate title, description, tags, and thumbnail contract before upload
- On auth drift, route to attended founder token bootstrap

## SECTION 8: EXECUTION RULES & CONSTRAINTS
- Enforce patch-only mutation law on dossier writes.
- Never bypass provider auth/callback contracts.
- Record deterministic replay metadata for every execution.
- Respect route_id, cost_tier, and policy verdict constraints.

## SECTION 9: FAILURE MODES & RECOVERY
- oauth_callback_mismatch -> block unattended publish
- refresh_token_invalid -> founder attended reauth required
- quota_exceeded -> defer publish with retry window
- upload_receipt_missing -> replay only through audited publish lane

## SECTION 10: TOOL POLICY
- Allowed_Tools: n8n workflow nodes, provider adapters, packet validators, local runtime utilities
- Forbidden_Tools: destructive filesystem operations, unauthorized secret writes
- Secret_Scope: local secure store and approved secret manager only

## SECTION 11: N8N + OLLAMA PLUGGABILITY
- n8n_consumer_workflows:
  - WF-500
  - CWF-510
  - CWF-530
- ollama_reasoning_injection: true
- packet_contract: youtube-publish-oauth-guard_packet
- replay_path: WF-021
- escalation_path: WF-900

## SECTION 12: VALIDATION & ACCEPTANCE
- Must emit status, artifact_family, payload, and provider_execution_summary.
- Must include deterministic error codes on failed/degraded runs.
- Must pass field-level schema checks before downstream handoff.
