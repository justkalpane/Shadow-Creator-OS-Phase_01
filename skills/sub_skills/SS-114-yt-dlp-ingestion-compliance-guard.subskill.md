# SUBSKILL SS-114 - yt-dlp Ingestion Compliance Guard

## SECTION 1: SKILL IDENTITY & OWNERSHIP
- Skill_ID: SS-114
- Canonical_Name: yt-dlp Ingestion Compliance Guard
- Archetype: integration
- Role_Type: PRIMARY_ROLE
- Owner_Director: Valmiki
- Domain: Ingestion

## SECTION 2: AUTHORITY MATRIX
- Can_Execute: provider optimization, payload shaping, quality gating, fallback routing
- Cannot_Execute: policy override, budget override, unauthorized namespace mutation
- Requires_Approval: premium provider route when budget/policy token required
- Escalation_Required: critical provider auth/callback failures
- Veto_Authority: NO

## SECTION 3: READS (INPUT VEINS)
### 3.1 Primary Inputs
- dossier_id:string
- ingest_request:object
- compliance_mode:string

### 3.2 Provider Context
  - yt_dlp_runtime

## SECTION 4: WRITES (OUTPUT VEINS)
- artifact_family:ytdlp-ingestion-guard_packet
- ingested_assets:array
- provenance_packet:object
- status:success|failed|degraded
- write_target: dossier.platform_subskills.yt-dlp-ingestion-compliance-guard (append_only)
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
- Use allowlisted source domains and explicit legal mode
- Capture source metadata and provenance hashes for every ingest
- Throttle and backoff to avoid anti-ban triggers
- Normalize transcript and media extraction into packet contracts
- Escalate unverifiable sources to manual review

## SECTION 8: EXECUTION RULES & CONSTRAINTS
- Enforce patch-only mutation law on dossier writes.
- Never bypass provider auth/callback contracts.
- Record deterministic replay metadata for every execution.
- Respect route_id, cost_tier, and policy verdict constraints.

## SECTION 9: FAILURE MODES & RECOVERY
- anti_ban_signal -> pause and escalate WF-900
- source_unavailable -> fallback to metadata-only ingest
- transcript_extraction_fail -> reroute to alternate transcript path
- provenance_missing -> quarantine artifact

## SECTION 10: TOOL POLICY
- Allowed_Tools: n8n workflow nodes, provider adapters, packet validators, local runtime utilities
- Forbidden_Tools: destructive filesystem operations, unauthorized secret writes
- Secret_Scope: local secure store and approved secret manager only

## SECTION 11: N8N + OLLAMA PLUGGABILITY
- n8n_consumer_workflows:
  - WF-100
  - CWF-140
  - WF-600
- ollama_reasoning_injection: true
- packet_contract: yt-dlp-ingestion-compliance-guard_packet
- replay_path: WF-021
- escalation_path: WF-900

## SECTION 12: VALIDATION & ACCEPTANCE
- Must emit status, artifact_family, payload, and provider_execution_summary.
- Must include deterministic error codes on failed/degraded runs.
- Must pass field-level schema checks before downstream handoff.
