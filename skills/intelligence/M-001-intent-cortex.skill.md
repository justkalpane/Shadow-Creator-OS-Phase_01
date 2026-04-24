# SKL-PH1-INTENT-CORTEX

## 1. Skill Identity
- **Skill ID:** M-001
- **Skill Name:** Intent Cortex
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-WF
- **Consumer Workflows:** WF-001, WF-010, WF-022
- **Vein/Route/Stage:** runtime_vein / topic_to_script / Stage_0_Intake

## 2. Purpose
Runtime-ready canonical skill artifact for M-001 (Intent Cortex). This specification follows repository DNA law and enforces deterministic execution, packet lineage, governance-safe escalation, and patch-only mutation discipline.

## 3. DNA Injection
- **Role Definition:** intent-cortex_executor
- **DNA Archetype:** Brahma
- **Behavior Model:** deterministic, registry-bound, escalation-safe
- **Operating Method:** ingest -> validate -> execute -> emit -> index
- **Working Style:** evidence-first, schema-locked, replay-aware

## 4. Workflow Injection
- **Producer:** WF
- **Direct Consumers:** WF-001, WF-010, WF-022
- **Upstream Dependencies:** workflow_registry, skill_loader_registry, dossier packet context
- **Downstream Handoff:** intent-cortex_packet -> downstream workflow chain
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

The Intent Cortex normalizes raw creator input into classified, routable intent envelopes.

```
STEP 1: PARSE RAW INTENT
  - Input: creator_message (string), optional context_hints (array)
  - Extract text tokens, detect language, identify intent phrases
  - Classify input modality (text, voice_transcript, structured_form)
  - Confidence floor: >=0.7 for proceed; <0.7 requires clarification escalation

STEP 2: CLASSIFY INTENT TYPE
  Apply deterministic intent classifier (decision tree + heuristics):
  
  IF message contains topic/niche keywords:
    intent_type = "TOPIC_DISCOVERY" 
    primary_lane = "discovery_vein"
    
  ELSE IF message contains script/narrative keywords:
    intent_type = "SCRIPT_REFINEMENT"
    primary_lane = "narrative_vein"
    
  ELSE IF message contains video/production keywords:
    intent_type = "PRODUCTION_OPTIMIZATION"
    primary_lane = "production_vein"
    
  ELSE IF message contains performance/analytics keywords:
    intent_type = "PERFORMANCE_ANALYSIS"
    primary_lane = "analytics_vein"
    
  ELSE IF message contains strategic/growth keywords:
    intent_type = "STRATEGY_EVOLUTION"
    primary_lane = "strategy_vein"
    
  ELSE:
    intent_type = "CLARIFICATION_REQUIRED"
    status = "PARTIAL"
    → escalate WF-900 with clarification_needed = true

STEP 3: EXTRACT CONSTRAINTS
  Parse for:
  - budget_tier (LOCAL | HYBRID | CLOUD | PREMIUM) → default LOCAL
  - timeline (URGENT | PLANNED | FLEXIBLE) → default PLANNED
  - quality_floor (DRAFT | PRODUCTION | BROADCAST) → default PRODUCTION
  - target_platforms (array) → default [creator_default_platforms]
  - audience_segment (string, optional) → default [creator_primary_audience]
  
  Missing constraints → use creator_profile defaults from dossier

STEP 4: CLASSIFY INTENT SEVERITY & URGENCY
  Score severity on 0-100 scale:
    Content_urgency_signal = (includes_deadline OR includes_urgency_words) ? +30 : 0
    Complexity_signal = (length > 500 OR multi_topic) ? +20 : 0
    Risk_signal = (new_direction OR controversial_topic) ? +20 : 0
    Creator_mode_signal = (creator_mode_active) ? -15 : 0
    
  severity_score = min(100, content_urgency + complexity + risk - creator_mode_discount)
  
  IF severity_score >= 70:
    urgency_level = "URGENT" → route to FAST lane if resources available
  ELSE IF severity_score >= 40:
    urgency_level = "PLANNED" → route to STANDARD lane
  ELSE:
    urgency_level = "FLEXIBLE" → route to OPTIMIZATION lane

STEP 5: BUILD INTENT ENVELOPE
  intent_envelope = {
    "intent_id": "INT-[timestamp]-[creator_id]",
    "raw_input": creator_message,
    "intent_type": [TOPIC_DISCOVERY | SCRIPT_REFINEMENT | PRODUCTION_OPTIMIZATION | PERFORMANCE_ANALYSIS | STRATEGY_EVOLUTION],
    "primary_lane": [discovery_vein | narrative_vein | production_vein | analytics_vein | strategy_vein],
    "constraints": {
      "budget_tier": [LOCAL | HYBRID | CLOUD | PREMIUM],
      "timeline": [URGENT | PLANNED | FLEXIBLE],
      "quality_floor": [DRAFT | PRODUCTION | BROADCAST],
      "target_platforms": [array],
      "audience_segment": string
    },
    "severity": {
      "severity_score": 0-100,
      "urgency_level": [URGENT | PLANNED | FLEXIBLE],
      "complexity": [SIMPLE | MODERATE | COMPLEX],
      "risk_profile": [LOW | MEDIUM | HIGH]
    },
    "classification_confidence": 0.0-1.0,
    "router_hint": [target_workflow_id],
    "fallback_strategy": [escalate | clarify | use_default]
  }

STEP 6: ROUTE TO NEXT STAGE
  Using primary_lane + severity + constraints:
  - If TOPIC_DISCOVERY: → M-001 (Global Trend Scanner)
  - If SCRIPT_REFINEMENT: → S-201 (Hook Optimizer)
  - If PRODUCTION_OPTIMIZATION: → M-091 (Lip Sync Engine)
  - If PERFORMANCE_ANALYSIS: → E-601 (Performance Analyst)
  - If STRATEGY_EVOLUTION: → M-179 (Competitive Intelligence Engine)
  - If CLARIFICATION_REQUIRED: → WF-900 with escalation_type = "intent_ambiguous"

STEP 7: VALIDATION & EMIT
  Validate intent_envelope against intent-cortex_packet schema
  If validation passes:
    status = "CREATED"
  Else:
    status = "PARTIAL"
    include validation_errors in payload
    
  Emit packet with deterministic lineage metadata
  Write dossier.runtime_vein.intent_envelope (append_only)
  Register in se_packet_index
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "INT-[timestamp]-[creator_id]",
  "artifact_family": "intent_envelope_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-WF-001-Intent-Intake",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO timestamp]",
  "status": "CREATED | PARTIAL | EMPTY",
  "payload": {
    "skill_id": "M-001",
    "skill_name": "Intent Cortex",
    "raw_input": "[creator_input_text]",
    "intent_classification": {
      "intent_type": "[TOPIC_DISCOVERY | SCRIPT_REFINEMENT | PRODUCTION_OPTIMIZATION | PERFORMANCE_ANALYSIS | STRATEGY_EVOLUTION]",
      "primary_lane": "[discovery_vein | narrative_vein | production_vein | analytics_vein | strategy_vein]",
      "classification_confidence": [0.0-1.0]
    },
    "extracted_constraints": {
      "budget_tier": "[LOCAL | HYBRID | CLOUD | PREMIUM]",
      "timeline": "[URGENT | PLANNED | FLEXIBLE]",
      "quality_floor": "[DRAFT | PRODUCTION | BROADCAST]",
      "target_platforms": ["[platform1]", "[platform2]"],
      "audience_segment": "[segment_description]"
    },
    "severity_assessment": {
      "severity_score": [0-100],
      "urgency_level": "[URGENT | PLANNED | FLEXIBLE]",
      "complexity": "[SIMPLE | MODERATE | COMPLEX]",
      "risk_profile": "[LOW | MEDIUM | HIGH]"
    },
    "router_hint": "[target_workflow_id_for_next_stage]",
    "intent_envelope": {
      "intent_id": "[INT-timestamp-creator_id]",
      "classification_complete": true,
      "ready_for_routing": true,
      "clarification_needed": [true | false],
      "clarification_prompts": ["[prompt1]"] 
    },
    "governance": {
      "created_by": "M-001-intent-cortex",
      "escalation_trigger": "[none | clarification_required | validation_error]",
      "audit_trail_ref": "[audit_event_id]"
    }
  }
}
```

**Write Targets:**
- `dossier.runtime_vein.intent_envelope` (append_only array)
- `se_packet_index` (one row with family=intent_envelope_packet, source=M-001)

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
- dossier.runtime_vein.intent-cortex (append_only)
- se_packet_index row for packet traceability

**Forbidden Mutations:**
- overwrite of prior dossier values
- write to unrelated namespaces
- mutation without packet metadata

## 11. Failure Modes & Recovery

**Failure Mode 1: Intent Ambiguity (confidence < 0.7)**
- Detection: classification_confidence < 0.7 OR multiple_conflicting_classifications
- Escalation: WF-900 with escalation_type = "intent_ambiguous" + clarification_prompts array
- Recovery: Wait for creator clarification, then re-run M-001 with refined input
- Fallback: If >3 clarification cycles, route to STRATEGIC_REVIEW by Brahma

**Failure Mode 2: Missing Required Constraints**
- Detection: critical constraint missing (budget_tier, quality_floor) AND creator has no default
- Action: Apply system defaults (budget_tier=LOCAL, quality_floor=PRODUCTION)
- Log: Add "constraints_imputed_from_defaults" flag to packet
- Recovery: Creator can override in next stage (M-002)

**Failure Mode 3: Unsupported Intent Type**
- Detection: intent_type classified as "CLARIFICATION_REQUIRED" AND clarification_prompts empty
- Escalation: Route to Brahma (Governance) for intent policy review
- Recovery: Add new intent_type to classifier OR reclassify to closest match

**Failure Mode 4: Route Unavailable**
- Detection: router_hint workflow not available OR lane overloaded
- Action: Queue intent with priority = severity_score
- Fallback: Route to ALTERNATIVE_LANE based on secondary_intent_signals
- Timeout: If queued >24h, escalate to Vishnu (HA Coordinator)

## 12. Best Practices

- **Preserve Raw Input:** Always store creator_message verbatim in payload for audit & replay
- **Deterministic Classification:** Use only registered intent_type values; never invent new types
- **Constraint Inference:** Extract constraints from context hints if not explicit in message
- **Severity Scoring Discipline:** Document ALL signals that contribute to severity_score calculation
- **Confidence Thresholding:** Never proceed with classification_confidence < 0.7; escalate ambiguity
- **Graceful Degradation:** If classifier unsure, emit PARTIAL status with clarification_prompts, not empty result
- **Lineage Preservation:** Include intent_id + created_by in all downstream packets for traceability
- **Platform-Default Awareness:** Know creator's default platforms & use them as constraint fallback
- **Creator Profile Sync:** Before classification, refresh creator budget/timeline profile from dossier
- **Replay Safety:** Intent envelope must be deterministic—same input = same classification (within 30 days)

## 13. Validation / Done

**Acceptance Tests:**
- **TEST-PH1-M001-001:** Parse diverse intent types (topic/script/production/analytics/strategy) with confidence >= 0.7
- **TEST-PH1-M001-002:** Extract constraints correctly (budget, timeline, quality, platforms) with fallback to defaults
- **TEST-PH1-M001-003:** Route to correct downstream lane (discovery/narrative/production/analytics/strategy)
- **TEST-PH1-M001-004:** Ambiguous input (<0.7 confidence) escalates to WF-900 with clarification_prompts
- **TEST-PH1-M001-005:** Severity scoring correlates with urgency_level (URGENT/PLANNED/FLEXIBLE)
- **TEST-PH1-M001-006:** Output packet schema validates against intent_envelope_packet contract
- **TEST-PH1-M001-007:** Dossier patch is additive only; no overwrites of existing intent history
- **TEST-PH1-M001-008:** se_packet_index row created with correct lineage reference
- **TEST-PH1-M001-009:** Replay of same input within 30 days produces identical classification
- **TEST-PH1-M001-010:** Creator mode active reduces urgency_score by 15 points (softens time pressure)

**Done Criteria:**
- ✅ Intent classification logic is deterministic (decision tree + heuristics, no LLM randomness)
- ✅ All intent_types routed to correct downstream lanes verified
- ✅ Constraint extraction handles 90%+ of creator input variations
- ✅ Severity scoring correlates with actual downstream resource needs
- ✅ Clarification escalation includes specific prompts for creator
- ✅ Output packet includes ALL required fields per intent_envelope_packet schema
- ✅ Additive dossier write verified (append_only, no overwrites)
- ✅ se_packet_index row created with intent_id, classification_confidence, router_hint
- ✅ Replay path (WF-021) can re-run M-001 with modified input
- ✅ Escalation path (WF-900) handles ambiguous/unsupported intent types
- ✅ Test suite covers happy path + 4 failure modes + edge cases
