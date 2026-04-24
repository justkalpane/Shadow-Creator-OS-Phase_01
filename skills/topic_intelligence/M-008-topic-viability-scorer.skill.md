# SKL-PH1-TOPIC-VIABILITY-SCORER

## 1. Skill Identity
- **Skill ID:** M-008
- **Skill Name:** Topic Viability Scorer
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-WF
- **Consumer Workflows:** WF-100, CWF-110, CWF-120, CWF-130, CWF-140
- **Vein/Route/Stage:** topic_intelligence_vein / topic_to_script / Stage_A_Topic

## 2. Purpose
Runtime-ready canonical skill artifact for M-008 (Topic Viability Scorer). This specification follows repository DNA law and enforces deterministic execution, packet lineage, governance-safe escalation, and patch-only mutation discipline.

## 3. DNA Injection
- **Role Definition:** topic-viability-scorer_executor
- **DNA Archetype:** Narada
- **Behavior Model:** deterministic, registry-bound, escalation-safe
- **Operating Method:** ingest -> validate -> execute -> emit -> index
- **Working Style:** evidence-first, schema-locked, replay-aware

## 4. Workflow Injection
- **Producer:** WF
- **Direct Consumers:** WF-100, CWF-110, CWF-120, CWF-130, CWF-140
- **Upstream Dependencies:** workflow_registry, skill_loader_registry, dossier packet context
- **Downstream Handoff:** topic-viability-scorer_packet -> downstream workflow chain
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

The Topic Viability Scorer synthesizes all prior intelligence signals into a composite viability assessment, identifies risks and blockers, and makes a GO/NO_GO recommendation for each topic. It is the synthesis and decision point of the entire discovery_vein pipeline.

```
STEP 1: VALIDATE INPUTS & LOAD_ALL_INTELLIGENCE_SIGNALS
  - Input: dossier_id, collect from dossier all prior intelligence packets:
    * global_trend_scanner_packet (M-001: trend curation)
    * topic_opportunity_miner_packet (M-002: opportunity mining)
    * keyword_intelligence_miner_packet (M-003: keyword research)
    * audience_demographic_mapper_packet (M-004: audience personas)
    * viral_pattern_detector_packet (M-006: viral patterns)
    * algorithm_signal_monitor_packet (M-007: algorithm fit)
    * creator_context (from M-002 Context Analyzer)
  
  Validation: If any critical signal missing → escalate WF-900 with escalation_type = "incomplete_intelligence"
  Note: All prior signals have confidence scores; this step uses those to validate completeness

STEP 2: FOR EACH OPPORTUNITY, AGGREGATE_SCORE_COMPONENTS
  For each keyword-audience-opportunity combo:
    
    A) EXTRACT_COMPONENT_SCORES:
       Source each score from prior packets:
         * opportunity_score: from M-002 topic_opportunity_miner (0-100)
         * keyword_opportunity_score: from M-003 keyword_intelligence (0-100)
         * creator_fit_score: from M-004 audience_demographic_mapper (0-100)
         * viral_potential_score: from M-006 viral_pattern_detector (0-100)
         * algorithm_fit_score: from M-007 algorithm_signal_monitor (0-100)
    
    B) WEIGHT_BY_SIGNAL_IMPORTANCE:
       Assign weights based on research insights about what drives success:
         * opportunity_score: 20% (market opportunity size)
         * keyword_opportunity_score: 15% (search demand + competition)
         * creator_fit_score: 25% (authenticity + audience alignment is CRITICAL)
         * viral_potential_score: 20% (growth potential, reach)
         * algorithm_fit_score: 20% (platform recommendation alignment)
       
       Note: creator_fit weighted highest because misaligned content underperforms regardless of other factors
    
    C) CALCULATE_COMPOSITE_VIABILITY_SCORE:
       composite_viability = (
         (opportunity_score × 0.20) +
         (keyword_opportunity_score × 0.15) +
         (creator_fit_score × 0.25) +
         (viral_potential_score × 0.20) +
         (algorithm_fit_score × 0.20)
       )
       
       Final score: 0-100 (higher = more viable)

STEP 3: IDENTIFY_RISKS_AND_BLOCKERS
  For each opportunity, extract risk signals from prior packets:
    
    A) EXECUTION_RISKS:
       - creator_execution_difficulty: HIGH? (from M-006 viral patterns)
       - format_compatibility_mismatch: found? (from M-004 audience profile)
       - production_timeline: too tight? (from M-002 opportunity)
       Risk_level: LOW | MEDIUM | HIGH | BLOCKING
    
    B) MARKET_SATURATION_RISKS:
       - market_saturation_level: OVERSATURATED? (from M-002 opportunity)
       - creator_coverage_count: too many competitors? (>1000?)
       - underserved_niche_available: if OVERSATURATED, any blue ocean?
       Risk_level: LOW | MEDIUM | HIGH
    
    C) AUDIENCE_MISALIGNMENT_RISKS:
       - creator_audience_fit: WEAK_FIT or POOR_FIT? (from M-004)
       - demographic_mismatch: significant age/geography mismatch?
       - psychographic_alignment: low alignment to persona interests?
       Risk_level: LOW | MEDIUM | HIGH | BLOCKING
    
    D) ALGORITHM_AND_PLATFORM_RISKS:
       - algorithm_fit_score: POOR_FIT? <40?
       - viral_pattern_algorithm_conflict: conflict found? (from M-007)
       - platform_mismatch: identified_patterns don't fit creator's platforms?
       Risk_level: LOW | MEDIUM | HIGH
    
    E) VIRAL_POTENTIAL_RISKS:
       - viral_potential_score: LOW? <40?
       - trending_lifecycle: DECLINING? (from M-006)
       - audience_growth_trajectory: DECLINING?
       Risk_level: LOW | MEDIUM | HIGH (note: not BLOCKING, just indicates slower growth)
    
    Build: risk_assessment = {
      "execution_risk": {level, specific_blockers},
      "market_saturation_risk": {level, competitor_count},
      "audience_alignment_risk": {level, mismatch_details},
      "algorithm_platform_risk": {level, conflicts},
      "viral_potential_risk": {level, growth_expectations},
      "blocking_issues": [list of issues that prevent execution]
    }

STEP 4: DETERMINE_VIABILITY_CLASSIFICATION
  For each opportunity, classify into viability category:
    
    IF blocking_issues.length > 0:
      viability_classification = "NO_GO"
      reasoning = "Blocking issue(s) prevent execution"
      recommendation = "Reject this topic. Address blocker or select alternative."
    
    ELSE IF composite_viability_score >= 75:
      viability_classification = "GO"
      reasoning = "Strong viability across all signals"
      recommendation = "Proceed with confidence. Content well-aligned with market, creator, audience, platform."
    
    ELSE IF composite_viability_score >= 60:
      viability_classification = "CONDITIONAL_GO"
      reasoning = "Viable with mitigation. Some risks present but manageable."
      recommendation = "Proceed with adaptation: [list specific adaptations]"
    
    ELSE IF composite_viability_score >= 45:
      viability_classification = "NEEDS_PIVOTING"
      reasoning = "Opportunity exists but requires significant repositioning"
      recommendation = "Consider angle pivot or audience segment pivot. Modify approach: [specific changes]"
    
    ELSE:
      viability_classification = "NO_GO"
      reasoning = "Composite score too low. Risk-reward imbalance."
      recommendation = "Reject this topic. Select higher-viability opportunity instead."

STEP 5: BUILD_VIABILITY_PROFILES
  For each opportunity, create viability_profile:
    
    viability_profile = {
      "keyword": string,
      "audience_persona_id": string,
      "composite_viability_score": 0-100,
      "viability_classification": "GO | CONDITIONAL_GO | NO_GO | NEEDS_PIVOTING",
      "viability_reasoning": string,
      "component_score_breakdown": {
        "opportunity_score": 0-100,
        "keyword_score": 0-100,
        "creator_fit_score": 0-100,
        "viral_potential_score": 0-100,
        "algorithm_fit_score": 0-100
      },
      "risk_assessment": {
        "execution_risk": {level: "LOW|MEDIUM|HIGH|BLOCKING", blockers: [...]},
        "market_saturation_risk": {level, competitor_count, blue_ocean_available: boolean},
        "audience_alignment_risk": {level, mismatch_description: string},
        "algorithm_platform_risk": {level, conflicts: [...]},
        "viral_potential_risk": {level, growth_expectations: string}
      },
      "blocking_issues": [list of critical blockers if any],
      "mitigation_recommendations": [
        {issue: string, mitigation: string}
      ],
      "execution_roadmap": [list of steps to execute if CONDITIONAL_GO or NEEDS_PIVOTING],
      "viability_confidence": 0.0-1.0
    }

STEP 6: RANK_OPPORTUNITIES_BY_VIABILITY
  - For each opportunity, retain viability_profile
  - Sort by: viability_classification (GO first, CONDITIONAL_GO, NEEDS_PIVOTING, NO_GO)
  - Within each classification, sort by: composite_viability_score (descending)
  - Separate GO/CONDITIONAL_GO from NO_GO/NEEDS_PIVOTING for easy viewing
  - Apply curation: present Top 10-20 GO/CONDITIONAL_GO opportunities, mark remainder

STEP 7: BUILD_VIABILITY_SYNTHESIS_ENVELOPE
  viability_synthesis_envelope = {
    "synthesis_id": "VIAB-[timestamp]-[creator_id]",
    "source_opportunities_count": int (all opportunities analyzed),
    "go_opportunities_count": int (viability >= 75),
    "conditional_go_opportunities": int (viability 60-74),
    "needs_pivoting_opportunities": int (viability 45-59),
    "no_go_opportunities": int (viability < 45 OR blockers),
    "synthesis_confidence": 0.0-1.0,
    "recommended_immediate_action": string (which topic to proceed with),
    "next_stage_routing": "WF-200-Script-Generation or CWF-210-Script-Generation"
  }

STEP 8: VALIDATION & EMIT
  Validate viability_synthesis_envelope:
  - All opportunities have viability_profile
  - composite_viability_score in 0-100 range
  - viability_classification clearly stated with reasoning
  - blocking_issues and mitigations populated
  - synthesis_confidence in 0.0-1.0 range
  
  IF all opportunities scored AND synthesis_confidence >= 0.8 AND >0 GO opportunities:
    status = "CREATED"
  ELSE IF all opportunities scored AND synthesis_confidence >= 0.6:
    status = "PARTIAL"
    include warning_flags if <5 GO opportunities
  ELSE IF synthesis_confidence < 0.6 AND all NO_GO:
    status = "EMPTY"
    escalate to WF-900 with escalation_type = "no_viable_topics"
    recommendation: return to earlier stage (M-001 trend discovery) for new ideas
  ELSE:
    status = "CREATED" (always emit; consumer decides next action)
  
  Emit packet with deterministic lineage
  Write dossier.discovery_vein.topic-viability-scorer (append_only)
  Register in se_packet_index
  Route successful GO/CONDITIONAL_GO topics to script_intelligence_vein (WF-200)
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "VIAB-[timestamp]-[creator_id]",
  "artifact_family": "topic-viability-scorer_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-140-Research-Synthesis",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO timestamp]",
  "status": "CREATED | PARTIAL | EMPTY",
  "payload": {
    "skill_id": "M-008",
    "skill_name": "Topic Viability Scorer",
    "viability_synthesis_metadata": {
      "source_opportunities_analyzed": "[integer]",
      "go_opportunities_count": "[count viability >= 75]",
      "conditional_go_opportunities": "[count 60-74]",
      "needs_pivoting_opportunities": "[count 45-59]",
      "no_go_opportunities": "[count < 45 OR blockers]",
      "viability_distribution_by_classification": {
        "GO_percentage": "[percent]",
        "CONDITIONAL_GO_percentage": "[percent]",
        "NEEDS_PIVOTING_percentage": "[percent]",
        "NO_GO_percentage": "[percent]"
      },
      "overall_synthesis_confidence": "[0.0-1.0]"
    },
    "viability_profiles": [
      {
        "keyword": "[string]",
        "audience_persona_id": "[from M-004]",
        "composite_viability_score": "[0-100]",
        "viability_classification": "[GO|CONDITIONAL_GO|NO_GO|NEEDS_PIVOTING]",
        "viability_reasoning": "[explanation of classification]",
        "component_score_breakdown": {
          "opportunity_score_weighted": "[0-100, 20% weight]",
          "keyword_score_weighted": "[0-100, 15% weight]",
          "creator_fit_weighted": "[0-100, 25% weight]",
          "viral_potential_weighted": "[0-100, 20% weight]",
          "algorithm_fit_weighted": "[0-100, 20% weight]"
        },
        "risk_assessment": {
          "execution_risk": {
            "severity": "[LOW|MEDIUM|HIGH|BLOCKING]",
            "specific_blockers": ["[blocker1]", "[blocker2]"]
          },
          "market_saturation_risk": {
            "severity": "[LOW|MEDIUM|HIGH]",
            "creator_coverage_count": "[integer]",
            "blue_ocean_available": "[true|false]"
          },
          "audience_alignment_risk": {
            "severity": "[LOW|MEDIUM|HIGH]",
            "mismatch_description": "[string]"
          },
          "algorithm_platform_risk": {
            "severity": "[LOW|MEDIUM|HIGH]",
            "conflicts": ["[conflict1]"]
          },
          "viral_potential_risk": {
            "severity": "[LOW|MEDIUM|HIGH]",
            "growth_expectations": "[explosive|strong|moderate|slow]"
          }
        },
        "blocking_issues": ["[if any]"],
        "mitigation_recommendations": [
          {
            "issue": "[string]",
            "mitigation_strategy": "[string]"
          }
        ],
        "execution_roadmap": [
          "[Step 1: ...]",
          "[Step 2: ...]"
        ],
        "viability_confidence": "[0.0-1.0]"
      }
    ],
    "viability_synthesis_summary": {
      "synthesis_id": "[VIAB-timestamp-creator_id]",
      "recommendation_immediate_next_action": "[which topic to proceed with]",
      "top_go_opportunities": [
        {
          "keyword": "[string]",
          "viability_score": "[0-100]",
          "why_go": "[brief explanation]"
        }
      ],
      "bootstrap_recommendations": [
        "[Recommendation 1]",
        "[Recommendation 2]"
      ],
      "next_stage_routing": "WF-200-Script-Generation or CWF-210-Script-Generation"
    },
    "governance": {
      "created_by": "M-008-topic-viability-scorer",
      "escalation_trigger": "[none|no_viable_topics|synthesis_failed|low_confidence]",
      "audit_trail_ref": "[audit_event_id]",
      "synthesis_decision_finality": "[tentative|final_recommendation]"
    }
  }
}
```

**Write Targets:**
- `dossier.discovery_vein.topic-viability-scorer` (append_only array)
- `se_packet_index` (one row with family=topic-viability-scorer_packet, source=M-008, synthesis_confidence, go_count)

## 8. Governance
- **Director Binding:** Narada (owner), Krishna (strategic authority)
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
- dossier.topic_intelligence_vein.topic-viability-scorer (append_only)
- se_packet_index row for packet traceability

**Forbidden Mutations:**
- overwrite of prior dossier values
- write to unrelated namespaces
- mutation without packet metadata

## 11. Failure Modes & Recovery

**Failure Mode 1: Incomplete Upstream Intelligence**
- Detection: Missing one or more prior signals (e.g., no viral patterns from M-006, no algorithm signals from M-007)
- Escalation: Return PARTIAL status with "incomplete_intelligence" flag, synthesis_confidence reduced
- Recovery: Proceed with available signals, weight remaining signals up proportionally, flag as "partial_synthesis"
- Next Stage: Consumer should request missing signal re-analysis before final commitment
- Action: Mark opportunities requiring missing signals with "validation_pending" recommendation

**Failure Mode 2: Score Component Conflicts**
- Detection: Component scores disagree sharply (e.g., high opportunity_score but low algorithm_fit)
- Escalation: Flag opportunity with "conflicting_signals_warning"
- Recovery: Explicitly surface the conflict, recommend creator choose: market_opportunity OR algorithm_safety
- Next Stage: Creator decides which signal to prioritize
- Action: Recommend small-scale testing before full commitment

**Failure Mode 3: All Opportunities NO_GO (No Viable Topics)**
- Detection: Zero GO opportunities, synthesis_confidence < 0.6, all opportunities below viability threshold
- Escalation: Return EMPTY status with escalation to WF-900 with "no_viable_topics" trigger
- Recovery: Recommend return to M-001 (Global Trend Scanner) for new trend discovery
- Next Stage: Restart discovery_vein with expanded trend filters or different creator context
- Action: Analyze why no viability — is creator context limiting? are filters too strict?

**Failure Mode 4: Ambiguous Blocking Issues**
- Detection: Blocking issue identified but not clearly preventable OR easily mitigatable
- Escalation: Mark opportunity with "blocking_issue_clarity_needed"
- Recovery: Present issue explicitly, allow creator to override and proceed at own risk
- Next Stage: Creator makes informed decision: accept risk OR reject topic
- Action: Document creator's choice for future learning

## 12. Best Practices

- **Creator Fit as Primary Weight:** Weight creator_fit_score highest (25%) because authenticity drives engagement. Misaligned content underperforms regardless of other factors.

- **Composite Score Transparency:** Always decompose composite_viability_score into component contributions. Creator must see which factors drive the decision.

- **Blocking Issue Clarity:** Document blocking issues explicitly, not generically. "Execution difficulty too high for bootstrapped creator" beats "BLOCKING."

- **Viability Classification Thresholds Precision:** Use exact thresholds (GO >= 75, CONDITIONAL 60-74, NEEDS_PIVOTING 45-59, NO_GO < 45). No fuzzy ranges.

- **Risk Severity Honesty:** Distinguish between MEDIUM (manageable) and HIGH (requires significant effort) and BLOCKING (prevents execution). Don't conflate.

- **Signal Conflict Transparency:** When component scores contradict (high opportunity, low algorithm fit), surface explicitly. Creator must make informed trade-off decision.

- **Mitigation Specificity:** Don't recommend generic adaptations. "Adjust hook to match TikTok algorithm" beats "modify content." Specificity enables action.

- **Execution Roadmap Actionability:** Include step-by-step execution path for CONDITIONAL_GO opportunities. Make it clear what creator must do.

- **Partial Intelligence Handling:** If missing upstream signals, proceed with available data but mark synthesis_confidence proportionally lower. Use formula: new_confidence = old_confidence × (signals_available / signals_expected).

- **Confidence Score Calculation:** synthesis_confidence = avg(all_upstream_confidence_scores) × (signal_completeness) × (score_agreement_rate). Lower if conflicts detected.

- **Deterministic Ranking:** Sort opportunities by viability_classification first (GO > CONDITIONAL > NEEDS_PIVOTING > NO_GO), then by composite_viability_score descending within each tier.

- **Return-to-Discovery Recommendation:** When no viable topics, recommend specific changes to trend discovery: "Expand trend sources," "Lower creator_fit threshold," "Include declining trends for niche angle."

## 13. Validation / Done

**Acceptance Tests:**
- **TEST-PH1-TI-M008-001:** Valid upstream intelligence from all 6 prior skills produces CREATED packet with viability_profiles for all opportunities
- **TEST-PH1-TI-M008-002:** Component scores weighted correctly: opportunity (20%), keyword (15%), creator_fit (25%), viral (20%), algorithm (20%)
- **TEST-PH1-TI-M008-003:** Composite viability score correctly calculated as weighted sum of components
- **TEST-PH1-TI-M008-004:** Viability classification thresholds applied deterministically: GO >= 75, CONDITIONAL 60-74, NEEDS_PIVOTING 45-59, NO_GO < 45
- **TEST-PH1-TI-M008-005:** Blocking issues identified and surfaces explicitly (execution_difficulty, format_mismatch, algorithm_conflict, etc)
- **TEST-PH1-TI-M008-006:** Risk assessment includes all 5 risk categories (execution, saturation, audience, algorithm, viral_potential) with severity levels
- **TEST-PH1-TI-M008-007:** Mitigation recommendations specific and actionable (not generic guidance)
- **TEST-PH1-TI-M008-008:** Signal conflicts detected when component scores contradict, flagged with "conflicting_signals_warning"
- **TEST-PH1-TI-M008-009:** Incomplete upstream intelligence (missing signal) detected, synthesis_confidence reduced proportionally, synthesis flagged "partial_synthesis"
- **TEST-PH1-TI-M008-010:** All opportunities NO_GO triggers escalation to WF-900 with "no_viable_topics" + recommendation to restart trend discovery
- **TEST-PH1-TI-M008-011:** Opportunities ranked by viability_classification (GO first) then by composite_viability_score (descending within tier)
- **TEST-PH1-TI-M008-012:** Execution roadmap provided for CONDITIONAL_GO and NEEDS_PIVOTING opportunities with step-by-step guidance
- **TEST-PH1-TI-M008-013:** Viability confidence calculated as: avg(upstream_confidence) × signal_completeness × score_agreement_rate
- **TEST-PH1-TI-M008-014:** Dossier patch appended (append_only) to dossier.discovery_vein.topic-viability-scorer with no overwrites
- **TEST-PH1-TI-M008-015:** se_packet_index row created with synthesis_id, synthesis_confidence, go_count, source=M-008
- **TEST-PH1-TI-M008-016:** Replay of same dossier_id within 30d produces identical viability ranking (deterministic)

**Done Criteria:**
- ✅ All 6 upstream signals (M-001 through M-007) integrated into synthesis
- ✅ Component scores weighted deterministically (opportunity 20%, keyword 15%, creator_fit 25%, viral 20%, algorithm 20%)
- ✅ Composite viability score calculated as weighted sum (0-100 range)
- ✅ Viability classification deterministic with exact thresholds (GO >= 75, CONDITIONAL 60-74, NEEDS_PIVOTING 45-59, NO_GO < 45)
- ✅ Blocking issues identified and explicitly surfaced with clear prevention logic
- ✅ Risk assessment includes all 5 risk categories with severity classifications
- ✅ Mitigation recommendations specific to each issue (not generic)
- ✅ Signal conflicts detected and flagged when components contradict
- ✅ Partial intelligence handling: synthesis proceeds with available signals, confidence adjusted proportionally
- ✅ No-viable-topics escalation: escalates to WF-900 with "no_viable_topics" trigger + recommendation for discovery_vein restart
- ✅ Opportunity ranking deterministic (classification first, score second)
- ✅ Execution roadmaps provided for CONDITIONAL_GO and NEEDS_PIVOTING with step-by-step action items
- ✅ Output packet includes all required sections (viability_synthesis_metadata, viability_profiles, viability_synthesis_summary, governance)
- ✅ All 4 failure modes have explicit detection, escalation path, and recovery action
- ✅ Dossier write validated as append_only with no overwrite of prior viability scoring
- ✅ Synthesis confidence score documented with formula: avg(upstream) × completeness × agreement
- ✅ Test suite covers happy path + all 4 failure modes + edge cases (incomplete_intelligence, conflicts, no_viable, ambiguous_blockers)
- ✅ Deterministic replay guaranteed within 30d (same input = same viability ranking)
