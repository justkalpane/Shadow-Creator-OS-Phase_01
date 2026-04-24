# SKL-PH1-CONTEXT-ANALYZER

## 1. Skill Identity
- **Skill ID:** M-002
- **Skill Name:** Context Analyzer
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-WF
- **Consumer Workflows:** WF-001, WF-010, WF-022
- **Vein/Route/Stage:** runtime_vein / topic_to_script / Stage_0_Intake

## 2. Purpose
Runtime-ready canonical skill artifact for M-002 (Context Analyzer). This specification follows repository DNA law and enforces deterministic execution, packet lineage, governance-safe escalation, and patch-only mutation discipline.

## 3. DNA Injection
- **Role Definition:** context-analyzer_executor
- **DNA Archetype:** Brahma
- **Behavior Model:** deterministic, registry-bound, escalation-safe
- **Operating Method:** ingest -> validate -> execute -> emit -> index
- **Working Style:** evidence-first, schema-locked, replay-aware

## 4. Workflow Injection
- **Producer:** WF
- **Direct Consumers:** WF-001, WF-010, WF-022
- **Upstream Dependencies:** workflow_registry, skill_loader_registry, dossier packet context
- **Downstream Handoff:** context-analyzer_packet -> downstream workflow chain
- **Escalation Path:** SE-N8N-WF-900 on validation failure or critical runtime errors
- **Fallback Path:** return partial packet with status "PARTIAL" and explicit failure reasons
- **Replay Path:** SE-N8N-WF-021 when remodify/replay is requested

## 5. Inputs
**Required:**
- dossier_id (string) - parent dossier identifier
- input_payload (object) - upstream packet payload for this skill
- route_id (string) - active route context

**Optional:**
- constraints (object) - quality/cost/latency constraints
- hints (array) - execution hints from upstream steps

## 6. Execution Logic

The Context Analyzer reads and synthesizes creator profile context, producing a comprehensive context envelope that downstream skills (Intent Cortex, Route Arbitrator) can consume.

```
STEP 1: LOAD CREATOR DOSSIER PROFILE
  - Input: dossier_id (string)
  - Retrieve dossier from storage (read_only access to creator_profile namespace)
  - Extract primary fields:
    * creator_id, creator_name, account_created_date
    * primary_audience (demographics, tone, engagement style)
    * default_budget_tier (LOCAL | HYBRID | CLOUD | PREMIUM)
    * default_timeline (URGENT | PLANNED | FLEXIBLE)
    * default_quality_floor (DRAFT | PRODUCTION | BROADCAST)
    * primary_platforms (list of channel/platform IDs)
    * brand_guidelines (content rules, tone, style, format constraints)
    * governance_profile (approval gates, risk_aversion, creator_mode_active)
  
  Validation: If dossier not found OR required fields empty → escalate clarification request
  Confidence factor: +50 if all primary fields present, +25 if partial

STEP 2: ANALYZE CONTENT PATTERNS & HISTORY
  - Read from dossier.content_history (append_only array of past creations)
  - Extract signals from last 20-50 content items:
    * topic_distribution (which topics created, frequency)
    * format_distribution (video, audio, text, hybrid percentages)
    * platform_distribution (where content performed best)
    * engagement_patterns (average views, comments, shares, favorites by format/topic)
    * upload_frequency (cadence: daily, weekly, monthly)
    * performance_trend (improving, stable, declining)
    * avg_production_time_per_asset (estimate from timestamps)
  
  Validation: If content_history empty or <3 items → flag "new_creator" and set confidence_penalty = -30
  Confidence factor: +20 if robust history, +10 if sparse

STEP 3: EXTRACT PLATFORM DEFAULTS & CONSTRAINTS
  - For each platform in primary_platforms:
    * Lookup platform_registry to get:
      - platform_capabilities (max_duration, max_file_size, format_reqs, metadata_fields)
      - creator_performance_tier (tier 1-5 based on follower/engagement count)
      - algorithm_preferences (format affinity, posting time windows, frequency recommendations)
  
  - Build platform_defaults structure:
    {
      "platform_id": string,
      "creator_tier": int (1-5),
      "recommended_format": string,
      "optimal_duration_secs": int,
      "recommended_posting_window": string,
      "frequency_recommendation": string (daily|3x_week|weekly|monthly),
      "format_constraints": {max_duration, max_size, required_metadata}
    }
  
  Confidence factor: +15 per platform analyzed, capped at +60

STEP 4: CLASSIFY CREATOR PROFILE MATURITY & MODE
  - Analyze creator metadata:
    * account_age_days = now - account_created_date
    * content_volume = count(content_history)
    * engagement_avg = mean(engagement_signals) across all content
    * consistency_score = upload_frequency_stability (0-100)
  
  - Classify maturity:
    IF account_age < 30 days AND content_volume < 5:
      profile_maturity = "NASCENT" → confidence_penalty = -40, use system defaults
    ELSE IF account_age < 90 days AND content_volume < 20:
      profile_maturity = "EARLY" → confidence_penalty = -20, blend defaults + patterns
    ELSE IF account_age < 365 days:
      profile_maturity = "GROWTH" → confidence_penalty = -10, trust patterns
    ELSE:
      profile_maturity = "ESTABLISHED" → confidence_penalty = 0, trust historical signals
  
  - Detect creator_mode_active:
    IF dossier.governance_profile.creator_mode_active == true:
      creator_mode_signal = "ACTIVE" → reduce urgency penalties, increase flexibility
    ELSE:
      creator_mode_signal = "STANDARD"
  
  Confidence factor: +15 for maturity classification

STEP 5: RESOLVE CONSTRAINT DEFAULTS
  - Source priority (highest to lowest):
    1. Explicit constraints in current request (override all)
    2. dossier.creator_profile.default_* fields
    3. dossier.governance_profile.* defaults
    4. Platform defaults from Step 3
    5. System defaults (LOCAL, PLANNED, PRODUCTION)
  
  Build constraint_defaults structure:
    {
      "budget_tier": [LOCAL | HYBRID | CLOUD | PREMIUM],
      "timeline": [URGENT | PLANNED | FLEXIBLE],
      "quality_floor": [DRAFT | PRODUCTION | BROADCAST],
      "target_platforms": [array of platform_ids],
      "audience_segment": string,
      "brand_compliance_required": boolean,
      "approval_gates_active": [array of gate names or empty]
    }
  
  Mark source of each default in metadata: { "budget_tier": "value", "source": "creator_profile" }

STEP 6: BUILD GOVERNANCE CONTEXT ENVELOPE
  - Extract from dossier.governance_profile:
    * approval_gates: list of workflows that require approval (WF-020, etc.)
    * veto_authorities: list of directors with veto power (usually Kubera, Yama)
    * escalation_triggers: conditions that force escalation to governance
    * policy_compliance_mode: STRICT | ADVISORY | FLEXIBLE
    * creator_mode_discount: apply to urgency/risk scoring (default 15)
  
  - Build governance structure:
    {
      "approval_gates_active": [list],
      "veto_authorities": [list],
      "escalation_triggers": [list],
      "policy_compliance_mode": string,
      "creator_mode_active": boolean,
      "creator_mode_discount": int
    }
  
  Confidence factor: +10 for governance resolution

STEP 7: CALCULATE CONTEXT CONFIDENCE
  base_confidence = 50
  + (step_1_factor: 0-50)
  + (step_2_factor: 0-30)
  + (step_3_factor: 0-60)
  + (step_4_factor: 0-15)
  + (governance_factor: 0-10)
  - (maturity_penalty: 0-40)
  - (missing_data_penalty: 0-25)
  
  context_confidence = min(100, max(0, base_confidence))
  
  IF context_confidence >= 0.8:
    confidence_level = "HIGH" → proceed with full context envelope
  ELSE IF context_confidence >= 0.6:
    confidence_level = "MODERATE" → emit PARTIAL with clarification flags
  ELSE:
    confidence_level = "LOW" → escalate to WF-900 for profile completion

STEP 8: BUILD CONTEXT ENVELOPE
  context_envelope = {
    "context_id": "CTX-[timestamp]-[creator_id]",
    "creator_audience_profile": {
      "primary_demographic": string,
      "engagement_style": string,
      "growth_stage": string,
      "follower_estimate": int
    },
    "content_patterns": {
      "topic_distribution": {topic: frequency_pct},
      "format_distribution": {format: frequency_pct},
      "platform_distribution": {platform: performance_score},
      "engagement_avg": float,
      "upload_cadence": string,
      "performance_trend": string
    },
    "platform_defaults": [
      {
        "platform_id": string,
        "creator_tier": int,
        "recommended_format": string,
        "optimal_duration": int,
        "posting_window": string,
        "frequency": string
      }
    ],
    "constraint_defaults": {
      "budget_tier": string,
      "timeline": string,
      "quality_floor": string,
      "target_platforms": [array],
      "approval_gates": [array]
    },
    "governance_profile": {
      "approval_gates_active": [array],
      "veto_authorities": [array],
      "policy_compliance_mode": string,
      "creator_mode_active": boolean
    },
    "profile_maturity": [NASCENT | EARLY | GROWTH | ESTABLISHED],
    "context_completeness": 0.0-1.0,
    "missing_data_flags": [array of strings],
    "analysis_timestamp": ISO timestamp
  }

STEP 9: VALIDATION & EMIT
  Validate context_envelope against context-analyzer_packet schema:
  - All required top-level fields present
  - Numeric fields within valid ranges (confidence 0-100, frequencies 0-1)
  - Array fields non-empty where required (constraint_defaults, platform_defaults)
  - Timestamp in ISO format
  
  IF validation passes:
    status = "CREATED"
  ELSE IF context_completeness >= 0.6 AND critical fields present:
    status = "PARTIAL"
    include validation_errors in payload
  ELSE:
    status = "EMPTY"
    escalate to WF-900 with escalation_type = "context_incomplete"
  
  Emit packet with deterministic lineage metadata
  Write dossier.runtime_vein.context_analyzer (append_only)
  Register in se_packet_index
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "CTX-[timestamp]-[creator_id]",
  "artifact_family": "context-analyzer_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-WF-001-Context-Analysis",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO timestamp]",
  "status": "CREATED | PARTIAL | EMPTY",
  "payload": {
    "skill_id": "M-002",
    "skill_name": "Context Analyzer",
    "creator_audience_profile": {
      "primary_demographic": "[description]",
      "engagement_style": "[tone/style descriptor]",
      "growth_stage": "[nascent|early|growth|established]",
      "follower_estimate": "[integer or null]"
    },
    "content_patterns": {
      "topic_distribution": {
        "[topic_name]": "[percentage 0-1]"
      },
      "format_distribution": {
        "video": "[percentage 0-1]",
        "audio": "[percentage 0-1]",
        "text": "[percentage 0-1]",
        "hybrid": "[percentage 0-1]"
      },
      "platform_performance": {
        "[platform_id]": "[score 0-100]"
      },
      "engagement_average": "[float, avg engagement metric]",
      "upload_cadence": "[daily|3x_week|weekly|monthly|sporadic]",
      "performance_trend": "[improving|stable|declining|insufficient_data]"
    },
    "platform_defaults": [
      {
        "platform_id": "[string]",
        "creator_tier": "[1-5]",
        "recommended_format": "[string]",
        "optimal_duration_seconds": "[integer]",
        "recommended_posting_window": "[time_window or timezone]",
        "frequency_recommendation": "[cadence]",
        "format_constraints": {
          "max_duration_seconds": "[integer]",
          "max_file_size_mb": "[integer]",
          "required_metadata": ["[field1]", "[field2]"]
        }
      }
    ],
    "constraint_defaults": {
      "budget_tier": "[LOCAL|HYBRID|CLOUD|PREMIUM]",
      "budget_tier_source": "[creator_profile|governance|system]",
      "timeline": "[URGENT|PLANNED|FLEXIBLE]",
      "timeline_source": "[creator_profile|governance|system]",
      "quality_floor": "[DRAFT|PRODUCTION|BROADCAST]",
      "quality_floor_source": "[creator_profile|governance|system]",
      "target_platforms": ["[platform_id1]", "[platform_id2]"],
      "approval_gates_active": ["[gate_id1]", "[gate_id2]"],
      "approval_gates_source": "[governance_profile|system]"
    },
    "governance_context": {
      "approval_gates_active": ["[WF-020]", "[custom_gate]"],
      "veto_authorities": ["[Kubera]", "[Yama]"],
      "escalation_triggers": ["[trigger_name]"],
      "policy_compliance_mode": "[STRICT|ADVISORY|FLEXIBLE]",
      "creator_mode_active": "[true|false]",
      "creator_mode_discount_on_urgency": "[0-40]"
    },
    "profile_maturity": "[NASCENT|EARLY|GROWTH|ESTABLISHED]",
    "context_assessment": {
      "context_completeness_score": "[0.0-1.0]",
      "completeness_level": "[HIGH|MODERATE|LOW]",
      "missing_data_flags": ["[missing_field]", "[data_type]"],
      "data_freshness": "[fresh|stale|missing]",
      "profile_age_days": "[integer]",
      "content_history_size": "[integer]"
    },
    "confidence_breakdown": {
      "profile_data_confidence": "[0.0-1.0]",
      "pattern_confidence": "[0.0-1.0]",
      "platform_confidence": "[0.0-1.0]",
      "governance_confidence": "[0.0-1.0]",
      "overall_context_confidence": "[0.0-1.0]"
    },
    "governance": {
      "created_by": "M-002-context-analyzer",
      "escalation_trigger": "[none|profile_incomplete|context_stale|missing_governance]",
      "audit_trail_ref": "[audit_event_id]"
    }
  }
}
```

**Write Targets:**
- `dossier.runtime_vein.context-analyzer` (append_only array)
- `se_packet_index` (one row with family=context-analyzer_packet, source=M-002, context_completeness)

## 8. Governance
- **Director Binding:** Brahma (owner), Krishna (strategic authority)
- **Authority Level:** CONTROL (runtime execution), ADVISORY (policy)
- **Veto Power:** no
- **Approval Gate:** none unless downstream workflow requires explicit approval
- **Policy Requirements:**
  - Use patch-only mutation law
  - Never overwrite existing dossier fields
  - Maintain packet lineage and audit references

## 9. Tool / Runtime Usage

**Allowed:**
- deterministic transforms
- schema validation and packet shaping
- route-aware dossier patch appends

**Forbidden:**
- destructive mutations
- unauthorized namespace writes
- bypassing governance escalation paths

## 10. Mutation Law

**Reads:**
- dossier scoped context slices
- route/workflow registry contracts
- upstream packet payloads

**Writes:**
- dossier.runtime_vein.context-analyzer (append_only)
- se_packet_index row for packet traceability

**Forbidden Mutations:**
- overwrite of prior dossier values
- write to unrelated namespaces
- mutation without packet metadata

## 11. Failure Modes & Recovery

**Failure Mode 1: Missing Creator Profile Data (Nascent Creators)**
- Detection: dossier.creator_profile missing primary fields OR account_age < 30 days
- Escalation: Return PARTIAL status with "new_creator" flag + default constraints
- Recovery: Set profile_maturity = NASCENT, confidence_penalty = -40, use system defaults (LOCAL, PLANNED, PRODUCTION)
- Next Stage: Intent Cortex will proceed with defaults; creator can override in future iterations
- Fallback: If dossier_id not found at all → escalate to WF-900 with escalation_type = "profile_not_found"

**Failure Mode 2: Stale Content History (Inactive Creators)**
- Detection: Last content timestamp > 90 days ago OR content_history is empty
- Escalation: Return PARTIAL status with "inactive_creator" flag + "data_freshness": "stale"
- Recovery: Apply performance_trend = "insufficient_data", exclude dated patterns from analysis
- Next Stage: Intent Cortex uses governance defaults instead of pattern-derived constraints
- Timeout: If inactive > 180 days, flag for potential account cleanup (async)
- Re-engagement: Creator can request context refresh if they return

**Failure Mode 3: Platform Registry Mismatch**
- Detection: Primary platform in dossier not found in platform_registry OR platform_capabilities missing
- Escalation: Mark platform_defaults as "degraded", confidence_penalty = -15, skip platform-specific optimization
- Recovery: Use generic platform defaults, flag "platform_not_indexed"
- Action: Submit to registry maintenance queue to add missing platform definition
- Next Stage: Proceed with best-effort context, downstream skills use fallback routing

**Failure Mode 4: Governance Profile Conflicts**
- Detection: Approval gates OR veto authorities cannot be resolved from governance_registry
- Escalation: Escalate to WF-900 with escalation_type = "governance_conflict"
- Recovery: Set policy_compliance_mode = "ADVISORY" (relaxed), flag "governance_degraded"
- Action: Route to Yama (Governance Director) for reconciliation
- Next Stage: Do not proceed with strict approval gates until resolved

## 12. Best Practices

- **Profile Load Order:** Always load dossier.creator_profile first, then content_history, then platform_registry. Fail-fast on missing dossier_id, but allow graceful degradation if history or platform data missing.

- **Confidence Calculation Discipline:** Document every signal that contributes to context_confidence. Never assume high confidence without evidence. Use maturity penalties to dampen confidence for new creators.

- **Platform Defaults as Fallback:** Build platform_defaults array even if sparse. Empty array is invalid; use system defaults if platform_registry lookup fails.

- **Audience Profile Inference:** If dossier.audience_profile missing, infer from content_patterns (topic distribution, engagement patterns). Mark inference source in output.

- **Constraint Source Tracking:** Always tag constraint_defaults with "source" (creator_profile, governance, system) so downstream knows prioritization.

- **Governance Profile Non-Optional:** governance_profile must always resolve, even if partial. Set policy_compliance_mode = ADVISORY if unresolved rather than escalating immediately.

- **Content Pattern Windowing:** Analyze only last 20-50 content items, weighted toward recent. Ignore outliers (single viral posts). Use median, not mean, for engagement averages to resist skewing.

- **Maturity Classification Determinism:** Use exact thresholds (account_age, content_volume, consistency_score). Document edge cases (e.g., 89 days old = EARLY, 91 days old = GROWTH).

- **Creator Mode Awareness:** Always check creator_mode_active. When true, reduce urgency penalties and increase timeline flexibility. Apply creator_mode_discount consistently in downstream scoring.

- **Platform Tier Computation:** Creator tier should reflect follower count in 5 discrete bands (1-100 followers = tier 1, etc.). Publish tier ranges in platform_registry.

- **Timestamp Freshness:** Include profile_age_days in output. If > 180 days, flag data_freshness = "stale" and recommend refresh in next cycle.

- **Escalation Granularity:** Escalate only on unrecoverable errors (governance conflicts, dossier missing, profile_registry failure). Partial data should return PARTIAL status, not escalation.

## 13. Validation / Done

**Acceptance Tests:**
- **TEST-PH1-M002-001:** Established creator profile (90+ days, 20+ content items) produces CREATED packet with HIGH confidence (>0.8)
- **TEST-PH1-M002-002:** Nascent creator profile (new account, <5 items) produces CREATED packet with MODERATE confidence (0.4-0.6), profile_maturity = NASCENT, uses system defaults
- **TEST-PH1-M002-003:** Missing creator_profile fields return PARTIAL status with explicit missing_data_flags and degraded confidence
- **TEST-PH1-M002-004:** Platform defaults correctly populated for all platforms in primary_platforms array (or empty if no platforms defined)
- **TEST-PH1-M002-005:** Constraint defaults properly source-tracked (budget_tier_source, timeline_source, etc.) and merged from creator_profile → governance → system order
- **TEST-PH1-M002-006:** Content pattern analysis extracts topic_distribution, format_distribution, engagement_avg, upload_cadence from content_history (or returns empty with flag if <3 items)
- **TEST-PH1-M002-007:** Creator mode active reduces urgency-related penalties by creator_mode_discount value (default 15)
- **TEST-PH1-M002-008:** Stale content (last update >90 days) detected and marked with "data_freshness": "stale" in context_assessment
- **TEST-PH1-M002-009:** Governance profile conflict unresolved → escalates to WF-900 with escalation_type = "governance_conflict" (does not return CREATED)
- **TEST-PH1-M002-010:** Output packet schema validates against context-analyzer_packet contract (all required fields present, numeric ranges valid, arrays non-empty where required)
- **TEST-PH1-M002-011:** Dossier patch appended (append_only) to dossier.runtime_vein.context-analyzer with no overwrites of prior context records
- **TEST-PH1-M002-012:** se_packet_index row created with context_id, context_completeness_score, source=M-002, and lineage to parent dossier
- **TEST-PH1-M002-013:** Replay of same dossier_id within 7 days produces identical context envelope (deterministic, no random sampling)

**Done Criteria:**
- ✅ Context analysis logic extracts 5+ distinct data sources (profile, content_history, platform_registry, governance, defaults)
- ✅ Confidence scoring formula documented and deterministic (base 50 + 8 signal factors - penalties)
- ✅ All 4 failure modes have explicit detection, escalation path, and recovery action
- ✅ Output packet includes all required sections (audience_profile, content_patterns, platform_defaults, constraint_defaults, governance_context, context_assessment, confidence_breakdown)
- ✅ Maturity classification (NASCENT/EARLY/GROWTH/ESTABLISHED) based on exact thresholds with penalty application
- ✅ Platform defaults array built deterministically from platform_registry lookups
- ✅ Constraint defaults properly source-tracked with fallback chain (creator → governance → system)
- ✅ Creator mode awareness integrated (modifies urgency discounts, increases flexibility)
- ✅ Partial status correctly emitted for degraded data (stale, sparse, missing) without escalating every gap
- ✅ Escalation path (WF-900) reserved only for unrecoverable errors (governance conflicts, dossier missing, registry failures)
- ✅ Dossier write validated as append_only with no overwrite of prior context records
- ✅ Test suite covers happy path + all 4 failure modes + edge cases (nascent, stale, platform gaps, governance conflicts)
- ✅ Deterministic replay guaranteed within 7 days (same input = same output)
- ✅ se_packet_index row includes lineage, source, and context_completeness_score for traceability
