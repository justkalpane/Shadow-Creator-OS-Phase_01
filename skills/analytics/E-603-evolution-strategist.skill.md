# E-603 Evolution Strategist

## 1. Skill Identity
- **Skill ID:** E-603
- **Name:** Evolution Strategist
- **Category:** Analytics & Evolution (WF-600)
- **Classification:** Strategic Synthesis Skill
- **Owner Director:** Chandra (Audience Intelligence Authority)
- **Supporting Directors:** Vyasa (Narrative Integrity), Chanakya (Strategy)
- **Version:** 1.0.0
- **Status:** Active

---

## 2. Purpose
Synthesize performance insights and feedback insights into actionable evolution signals and strategic recommendations for content strategy improvement. Bridge quantitative performance metrics with qualitative audience sentiment to generate coherent evolution vectors. Translate analytics into narrative and creative direction changes.

**Strategic Role:** Evolution Strategist is the synthesis and strategy function in the analytics pipeline. It transforms isolated performance and feedback insights into unified, actionable evolution signals that inform next-cycle content design decisions.

---

## 3. DNA Injection

### Role
- **Primary Role:** Strategic Synthesis Skill - Cross-Vein Signal Fusion
- **Behavioral Mode:** Deterministic synthesis with confidence-weighted signal combination
- **Operating Model:** Passive synthesizer - consumes performance_insight_packet + feedback_insight_packet, produces evolution_signal_packet

### Governance Identity
- **Jurisdiction:** Analytics & Strategy - Evolution Domain
- **Authority Level:** Non-veto (produces recommendations; CWF-630 decides routing)
- **Escalation Trigger:** Conflicting signals OR low overall confidence < 0.72 OR critical_policy_concerns
- **Fallback Mode:** Return generic "maintain current approach" evolution signal rather than hallucinate
- **Always-On Guardian:** Vyasa monitors narrative coherence; Chitragupta tracks lineage

---

## 4. Workflow Injection

### Producer Relationship
- **Triggered By:** CWF-630 (Evolution Signal Synthesizer - orchestrates E-601 + E-602)
- **Input Packets:** 
  - `performance_insight_packet` (from E-601)
  - `feedback_insight_packet` (from E-602)
- **Input Schema:** v1.0.0 for both

### Consumer Relationship
- **Consumed By:** CWF-630 (aggregates E-603 output into final analytics_evolution_packet)
- **Output Packet:** `evolution_signal_packet` (schema v1.0.0)
  - Contains: evolution_vectors, strategic_recommendations, priority_ranking, confidence_scores

### Vein Navigation
- **Vein:** analytics_vein (consumes analytics signals)
- **Reads From:** dossier.analytics (performance_insights, feedback_insights, evolution_history)
- **Writes To:** dossier.analytics.evolution_recommendations (append_to_array only)
- **Upstream:** E-601, E-602 (triggers via CWF-630)
- **Downstream:** CWF-630 (final output aggregation)
- **Error Path:** WF-900 (escalation on signal conflict or confidence failure)

---

## 5. Inputs

### Primary Inputs
```json
{
  "performance_insight_packet": {
    "instance_id": "PIP-{timestamp}",
    "payload": {
      "evidence": {
        "engagement_trends": {...},
        "reach_analysis": {...},
        "efficacy_classification": {...},
        "growth_trajectory": {...}
      },
      "quality": {
        "analysis_confidence": 0.83
      }
    }
  },
  "feedback_insight_packet": {
    "instance_id": "FIP-{timestamp}",
    "payload": {
      "evidence": {
        "sentiment_analysis": {...},
        "sentiment_health": {...},
        "theme_extraction": {...},
        "audience_intent": {...}
      },
      "quality": {
        "analysis_confidence": 0.85
      }
    }
  }
}
```

### Secondary Input: Strategic Context
- Dossier namespace: `dossier.analytics.evolution_history` (last 3 evolution cycles)
- Dossier namespace: `dossier.narrative.creative_directives` (current narrative architecture)
- Strategic mode: `aggressive_growth` | `quality_focus` | `balance` | `consolidation`

### Execution Context
- `dossier_id`: Unique identifier for current content/narrative
- `strategic_mode`: Override mode for evolution direction
- `priority_weighting`: Allocate relative importance (performance vs. feedback)

---

## 6. Execution Logic

### Step 1: Validate Input Integrity
```
IF performance_insight_packet is missing OR feedback_insight_packet is missing
  THEN escalate to WF-900 with error code SE-P1-008-INCOMPLETE_SYNTHESIS_INPUT

IF performance_insight_packet.payload.quality.analysis_confidence < 0.70
  AND feedback_insight_packet.payload.quality.analysis_confidence < 0.70
  THEN escalate to WF-900 with error code SE-P1-009-LOW_SYNTHESIS_CONFIDENCE
```

### Step 2: Extract Performance Vectors
From performance_insight_packet.payload.evidence:
```
performance_vectors = {
  engagement_trend: engagement_trends[primary_platform].trend,
  engagement_confidence: engagement_trends[primary_platform].confidence,
  
  reach_pattern: reach_analysis.pattern,
  reach_score: reach_analysis.breadth * reach_analysis.depth / 10000,
  
  efficacy_status: efficacy_classification.overall,
  efficacy_confidence: efficacy_classification.confidence,
  
  trajectory: growth_trajectory.classification,
  trajectory_score: growth_trajectory.rate,
  
  anomalies: anomalies[] (if any),
  benchmark_gap: benchmark_comparison.overall_positioning
}
```

### Step 3: Extract Feedback Vectors
From feedback_insight_packet.payload.evidence:
```
feedback_vectors = {
  sentiment_health: sentiment_health.overall_health,
  sentiment_confidence: sentiment_health.health_confidence,
  sentiment_trend: sentiment_health.trend_direction,
  
  primary_praise: theme_extraction.primary_themes[intent=praise].theme,
  primary_concern: theme_extraction.primary_themes[intent=concern].theme,
  primary_request: theme_extraction.primary_themes[intent=request].theme,
  theme_consistency: theme_extraction.theme_consistency_score,
  
  dominant_intent: audience_intent.dominant_intent,
  intent_distribution: audience_intent,
  
  opportunities: engagement_opportunities.{amplify_themes, address_themes, act_on_themes}
}
```

### Step 4: Detect Signal Alignment
```
alignment_score = 0

IF performance_vectors.engagement_trend MATCHES feedback_vectors.sentiment_trend
  alignment_score += 0.3
ELSE
  signal_conflict = "engagement_trend_mismatch"

IF performance_vectors.efficacy_status MATCHES sentiment_health classification
  alignment_score += 0.3
ELSE
  signal_conflict = "efficacy_sentiment_mismatch"

IF performance_vectors.trajectory MATCHES feedback_vectors.intent_distribution
  alignment_score += 0.4
ELSE
  signal_conflict = "trajectory_intent_mismatch"

IF alignment_score < 0.5
  escalation_trigger = true
  escalation_reason = "conflicting_signals"
```

### Step 5: Generate Hook Evolution Vector
```
hook_analysis = {
  current_performance: performance_vectors.engagement_trend,
  audience_feedback: feedback_vectors.primary_praise OR feedback_vectors.primary_concern,
  opportunity: feedback_vectors.opportunities.amplify_themes contains "hook" ? "high" : "standard"
}

IF engagement_trend = "upward_momentum" AND primary_praise contains "hook"
  vector_direction = "maintain_hook_strategy"
  intensity = "aggressive_production_velocity"
ELSE IF engagement_trend = "stable" AND primary_concern contains "hook"
  vector_direction = "strengthen_hook"
  intensity = "increase_hook_production_investment"
ELSE IF engagement_trend = "declining" OR sentiment = "concerning"
  vector_direction = "redesign_hook"
  intensity = "urgent_hook_research_required"
ELSE
  vector_direction = "optimize_hook"
  intensity = "standard_iteration"

hook_confidence = (performance_confidence + feedback_confidence) / 2
```

### Step 6: Generate Narrative Evolution Vector
```
narrative_analysis = {
  current_clarity: efficacy_classification,
  feedback_clarity: primary_concern contains "clarity" ? "low" : "adequate",
  opportunity: feedback_vectors.opportunities.address_themes contains "pacing/clarity"
}

IF efficacy = "high_engagement" AND theme_consistency > 0.75
  vector_direction = "maintain_narrative_structure"
  intensity = "refine_existing"
ELSE IF efficacy = "moderate_engagement" AND feedback indicates requests
  vector_direction = "enhance_narrative_actionability"
  intensity = "add_call_to_action_clarity"
ELSE IF efficacy = "low_engagement" OR theme_consistency < 0.60
  vector_direction = "restructure_narrative_flow"
  intensity = "major_revision_required"
ELSE
  vector_direction = "optimize_narrative_pacing"
  intensity = "standard_pacing_adjustment"

narrative_confidence = efficacy_confidence
```

### Step 7: Generate Production Evolution Vector
```
production_analysis = {
  current_reach: reach_analysis.pattern,
  audience_engagement_capacity: feedback_vectors.intent_distribution.engagement,
  current_quality: benchmark_comparison.overall_positioning
}

IF reach = "broad_high_reach" AND quality = "exceeding"
  vector_direction = "expand_production_scope"
  intensity = "increase_production_investment"
ELSE IF reach = "concentrated" AND sentiment = "strong_positive"
  vector_direction = "optimize_production_for_current_platforms"
  intensity = "deepen_platform_specialization"
ELSE IF quality < benchmark
  vector_direction = "invest_in_production_quality"
  intensity = "quality_improvement_priority"
ELSE
  vector_direction = "maintain_current_production_approach"
  intensity = "standard_optimization"

production_confidence = (reach_score + benchmark_position_score) / 2
```

### Step 8: Generate Growth Evolution Vector
```
growth_analysis = {
  current_trajectory: growth_trajectory.classification,
  audience_growth_readiness: feedback_vectors.dominant_intent = "engagement" ? 0.85 : 0.65,
  capacity_signals: reach_analysis.multi_platform_coordination
}

IF trajectory = "accelerating_growth" AND sentiment = "strong_positive"
  vector_direction = "aggressive_growth_acceleration"
  intensity = "maximize_growth_opportunity"
ELSE IF trajectory = "modest_growth" AND sentiment = "mixed_positive"
  vector_direction = "sustainable_growth_focus"
  intensity = "balance_growth_and_quality"
ELSE IF trajectory = "declining" AND sentiment = "concerning"
  vector_direction = "recovery_and_stabilization"
  intensity = "tactical_pause_and_reinvention"
ELSE
  vector_direction = "maintain_growth_momentum"
  intensity = "steady_optimization"

growth_confidence = (trajectory_score + sentiment_health_confidence) / 2
```

### Step 9: Rank Evolution Priorities
```
evolution_vectors_list = [hook_vector, narrative_vector, production_vector, growth_vector]

FOR EACH vector IN evolution_vectors_list:
  priority_score = vector.confidence * calculate_urgency(vector.intensity)

SORT evolution_vectors_list BY priority_score DESC

priority_ranking = [
  { vector: evolution_vectors_list[0].name, priority: 1, score: priority_score[0] },
  { vector: evolution_vectors_list[1].name, priority: 2, score: priority_score[1] },
  ...
]
```

### Step 10: Detect Content Opportunities & Risks
```
opportunities = {
  immediate_actions: [],
  quick_wins: [],
  strategic_investments: []
}

risks = {
  critical: [],
  moderate: [],
  monitoring: []
}

// Amplify opportunities
FOR EACH theme IN feedback_vectors.opportunities.amplify_themes:
  opportunities.strategic_investments.push({
    theme: theme,
    recommendation: "double_down_in_next_cycle",
    expected_impact: "high"
  })

// Address concerns
FOR EACH theme IN feedback_vectors.opportunities.address_themes:
  risks.moderate.push({
    theme: theme,
    recommendation: "prioritize_in_next_cycle",
    expected_impact: "medium"
  })

// If sentiment concerning or engagement declining
IF sentiment_health = "concerning" OR engagement_trend = "declining"
  risks.critical.push({
    issue: "audience_satisfaction_declining",
    recommendation: "urgent_strategic_reset_required",
    expected_impact: "high"
  })
```

### Step 11: Generate Integrated Evolution Signal
Combine all vectors, priorities, opportunities, risks into coherent evolution_signal_packet.

---

## 7. Outputs

### Primary Output: evolution_signal_packet
```json
{
  "instance_id": "ESP-{timestamp}",
  "artifact_family": "evolution_signal_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-630-via-E-603",
  "dossier_ref": "{dossier_id}",
  "created_at": "{ISO8601_timestamp}",
  "status": "CREATED",
  "payload": {
    "narrative": {
      "analysis_period": "24h-aggregate",
      "signals_integrated": 4,
      "evolution_cycle": "{cycle_number}",
      "synthesis_method": "performance_feedback_fusion"
    },
    "context": {
      "sourced_from_packets": [
        "PIP-{timestamp}",
        "FIP-{timestamp}"
      ],
      "performance_weight": 0.45,
      "feedback_weight": 0.45,
      "strategic_weight": 0.10
    },
    "evidence": {
      "evolution_vectors": [
        {
          "vector_name": "hook_evolution",
          "direction": "strengthen_hook",
          "intensity": "increase_hook_production_investment",
          "confidence": 0.85,
          "priority": 1,
          "rationale": "Strong engagement on hook segments; audience provides positive feedback on hook strength"
        },
        {
          "vector_name": "narrative_evolution",
          "direction": "enhance_narrative_actionability",
          "intensity": "add_call_to_action_clarity",
          "confidence": 0.80,
          "priority": 2,
          "rationale": "Audience requests clearer next steps; moderate efficacy indicates pacing optimization opportunity"
        },
        {
          "vector_name": "production_evolution",
          "direction": "expand_production_scope",
          "intensity": "increase_production_investment",
          "confidence": 0.78,
          "priority": 3,
          "rationale": "Broad reach with positive sentiment; quality exceeds benchmark; ready for production expansion"
        },
        {
          "vector_name": "growth_evolution",
          "direction": "sustainable_growth_focus",
          "intensity": "balance_growth_and_quality",
          "confidence": 0.82,
          "priority": 4,
          "rationale": "Modest positive growth trajectory; audience engagement strong; maintain quality focus during scaling"
        }
      ],
      "priority_ranking": [
        { rank: 1, vector: "hook_evolution", action_urgency: "standard", timeline: "next_cycle" },
        { rank: 2, vector: "narrative_evolution", action_urgency: "standard", timeline: "next_2_cycles" },
        { rank: 3, vector: "production_evolution", action_urgency: "medium", timeline: "next_3_cycles" },
        { rank: 4, vector: "growth_evolution", action_urgency: "low", timeline: "ongoing" }
      ],
      "signal_alignment": {
        "alignment_score": 0.85,
        "alignment_status": "high_coherence",
        "conflicting_signals": [],
        "confidence": 0.88
      },
      "opportunities_identified": {
        "immediate_actions": [
          "Strengthen hook segment production",
          "A/B test new hook strategies"
        ],
        "quick_wins": [
          "Add explicit call-to-action to scripts",
          "Optimize narrative pacing in body segments"
        ],
        "strategic_investments": [
          "Expand to new platform based on instagram_success",
          "Invest in multi-format hook concepts"
        ]
      },
      "risks_identified": {
        "critical": [],
        "moderate": [
          {
            "issue": "pacing_concern_moderate",
            "risk_level": "medium",
            "mitigation": "Test faster pacing in next cycle"
          }
        ],
        "monitoring": [
          "Engagement_stability_on_youtube"
        ]
      }
    },
    "quality": {
      "performance_confidence": 0.83,
      "feedback_confidence": 0.85,
      "synthesis_confidence": 0.84,
      "signal_coherence": 0.85,
      "overall_evolution_signal_quality": 0.84
    },
    "status": {
      "evolution_signals_synthesized": true,
      "signal_alignment_validated": true,
      "opportunities_identified": true,
      "risks_assessed": true,
      "next_stage": "content_evolution_execution",
      "decision": "EVOLUTION_VECTORS_READY_FOR_CONTENT_DESIGN"
    }
  }
}
```

### Schema Reference
**Schema Name:** `evolution_signal_packet` (v1.0.0)
**Location:** `schemas/analytics/evolution_signal_packet.schema.yaml`

### Dossier Mutation
```json
{
  "namespace": "analytics",
  "mutation_type": "append_to_array",
  "target": "dossier.analytics.evolution_recommendations",
  "value": {
    "packet_id": "{ESP instance_id}",
    "evolution_vectors": [{vector_name, direction, intensity, confidence}],
    "priority_ranking": [{rank, vector, action_urgency, timeline}],
    "opportunities": {immediate_actions, quick_wins, strategic_investments},
    "risks": {critical, moderate, monitoring},
    "timestamp": "{ISO8601}"
  }
}
```

---

## 8. Governance

### Authority & Decision Rights
- **Authority Level:** Non-veto (produces recommendations; CWF-630 makes final routing)
- **Can Approve:** No
- **Can Veto:** No
- **Can Escalate:** Yes - if signal_alignment < 0.50 or overall_confidence < 0.72 or critical_risks detected
- **Can Fallback:** Yes - returns generic "maintain current approach" evolution signal

### Approval Gates
- **Approval Required:** No
- **Escalation Required:** If alignment_score < 0.50 (conflicting signals) OR synthesis_confidence < 0.72
- **Escalation Path:** WF-900 (error routing)

### Ownership & Lineage
- **Owner:** Chandra (Audience Intelligence Authority)
- **Strategic Advisor:** Chanakya (strategy governance)
- **Narrative Advisor:** Vyasa (narrative coherence)
- **Audit Guardian:** Chitragupta (lineage tracking)
- **Approved By:** (Self-service, no approval gate)

### Governance Rules
1. **Signal Integrity:** Never hallucinate evolution signals; escalate if inputs missing or low-confidence
2. **Alignment Validation:** Detect and escalate conflicting signals (engagement vs. sentiment mismatch)
3. **Confidence Calibration:** All vectors report explicit confidence (0.0-1.0); synthesis confidence >= 0.72
4. **Narrative Coherence:** Vyasa reviews vector recommendations for narrative alignment
5. **Strategy Compliance:** Evolution vectors align with strategic_mode (growth/quality/balance/consolidation)

---

## 9. Tool & Runtime Usage

### Allowed Tools
- n8n Code Node (JavaScript): Signal alignment scoring, vector synthesis, priority ranking
- n8n Dossier Read: Query performance_insights, feedback_insights, evolution_history
- Logging: Chitragupta audit trail (each synthesis step)
- Decision logic: Deterministic rules for vector direction/intensity

### Forbidden Tools
- External ML models (use rule-based synthesis)
- Predictive analytics (only analyze historical signals)
- Hallucination (never invent evolution vectors)
- Override governance directives (Vyasa/Chanakya reviews, don't skip)

### Environment Assumptions
- Dossier storage available
- Historical evolution recommendations available (last 3 cycles)
- Creative directives available in dossier.narrative
- Strategic mode parameter passed in execution context

---

## 10. Mutation Law

### Permitted Mutations
- **Append to:** `dossier.analytics.evolution_recommendations` (array append only)
- **Read from:** `dossier.analytics.{performance_insights, feedback_insights, evolution_history}`, `dossier.narrative.creative_directives`
- **Never Overwrite:** Any existing dossier field

### Forbidden Mutations
- Delete or modify existing evolution_recommendations
- Overwrite creative_directives
- Write to namespaces outside analytics
- Suppress or reinterpret performance/feedback signals

### Audit Requirements
Every mutation includes:
```json
{
  "audit_entry": {
    "timestamp": "{ISO8601}",
    "skill_id": "E-603",
    "operation": "SYNTHESIZE_EVOLUTION_SIGNALS",
    "source_packets": ["PIP-{timestamp}", "FIP-{timestamp}"],
    "signal_alignment": 0.85,
    "synthesis_confidence": 0.84,
    "lineage_intact": true
  }
}
```

---

## 11. Best Practices

### Signal Fusion Quality
1. **Validate inputs first:** Both PIP and FIP must be present with confidence >= 0.70
2. **Extract vectors completely:** Don't skip fields; null fields indicate missing data (escalate)
3. **Weight equally:** Performance and feedback get equal weight (45% each) unless strategic_mode overrides
4. **Document weighting:** Explicitly state confidence weighting in output packet
5. **Alignment scoring:** Use measurable criteria (trend match, efficacy match, trajectory match)

### Evolution Vector Generation
1. **Map to execution domains:** Hook, narrative, production, growth (four vectors always)
2. **Specify intensity:** Use quantified intensity levels (aggressive, increase, standard, optimize, maintain)
3. **Include rationale:** Every vector must explain "why" (supporting evidence from signals)
4. **Confidence per vector:** Each vector gets own confidence score (aggregate in synthesis_confidence)
5. **Priority ranking:** Deterministic ranking based on urgency + confidence * impact

### Conflict Detection & Escalation
1. **Three conflict types:** Trend mismatch, efficacy mismatch, trajectory mismatch
2. **Alignment threshold:** alignment_score >= 0.50 = safe, < 0.50 = escalate
3. **Root cause analysis:** Document which signals conflict (not just "signals conflict")
4. **Escalation documentation:** Include conflicting vector pairs and magnitude of conflict
5. **Fallback mode:** Return "maintain current approach" if conflicts cannot be resolved

### Opportunity & Risk Assessment
1. **Amplify themes:** Map to "immediate_actions" and "quick_wins" (high confidence)
2. **Address concerns:** Map to "moderate" risks (requires action in 1-3 cycles)
3. **Critical risks:** Only if sentiment health = "concerning" or engagement declining significantly
4. **Monitoring risks:** Emerging trends that don't yet require action (flag for next cycle)
5. **Timeline realism:** Immediate = next cycle, quick_wins = 1-2 cycles, strategic = 3+ cycles

### Governance Alignment
1. **Strategic mode respect:** If mode = "aggressive_growth", amplify growth vectors; if "consolidation", emphasize quality
2. **Narrative coherence:** Ensure growth vectors don't contradict Vyasa's narrative integrity rules
3. **Chanakya strategy:** Evolution vectors must align with current strategic directives (from dossier)
4. **Escalation clarity:** When escalating to WF-900, include clear escalation_reason (signal conflict / low confidence / etc)

---

## 12. Validation & Done Criteria

### Validation Checklist (13-Point)
1. ✓ Both input packets present and valid (PIP + FIP)
2. ✓ Performance confidence >= 0.70 or feedback confidence >= 0.70 (at least one)
3. ✓ All performance vectors extracted (engagement, reach, efficacy, trajectory, anomalies, benchmark)
4. ✓ All feedback vectors extracted (sentiment, theme, intent, opportunities)
5. ✓ Signal alignment score calculated (0.0-1.0)
6. ✓ No conflicting signals or aligned >= 0.50
7. ✓ Four evolution vectors generated (hook, narrative, production, growth)
8. ✓ Each vector: direction, intensity, confidence, rationale
9. ✓ Priority ranking generated (deterministic sorting by urgency + confidence)
10. ✓ Opportunities identified (immediate/quick_wins/strategic)
11. ✓ Risks identified (critical/moderate/monitoring)
12. ✓ Output packet schema valid (evolution_signal_packet v1.0.0)
13. ✓ Dossier mutation recorded with audit entry

### Done Criteria
- [ ] Evolution vectors synthesized for all four domains (hook, narrative, production, growth)
- [ ] Signal alignment validated (>= 0.50 or escalate)
- [ ] Opportunities and risks identified with clear priority ranking
- [ ] evolution_signal_packet emitted with full lineage and confidence
- [ ] Dossier mutation recorded with synthesis_confidence and audit trail
- [ ] No hallucinated evolution signals or invented vectors
- [ ] Escalation triggered if alignment < 0.50 or confidence < 0.72

### Test References
- `tests/analytics/E-603-evolution-strategist.test.js`
- Test data: `tests/fixtures/performance_insight_packet.json`, `tests/fixtures/feedback_insight_packet.json`
- Conflict scenarios: `tests/fixtures/signal_conflicts.json`

---

## 13. Skill Evolution & Notes

### Known Limitations
- Rule-based synthesis only (no ML-based pattern discovery)
- Fixed four-vector framework (hook, narrative, production, growth)
- Conflict detection binary (conflict or no conflict, not degree of conflict)
- Strategic mode override not fully flexible (pre-defined modes only)

### Future Enhancements
- Multi-dimensional vector space (Phase 2)
- Learning-based signal weighting (Phase 3)
- Predictive impact modeling (Phase 3)
- Narrative style transfer recommendations (Phase 3)

### Dependency Chain
- **Depends On:** E-601 (performance analyst), E-602 (feedback analyst), CWF-630 (orchestration), Vyasa (narrative coherence), Chanakya (strategy), dossier.analytics
- **Depended On By:** CWF-630 (final evolution output aggregation)
- **Related Skills:** E-601, E-602 (input sources)

---

## 14. Integration Pattern (CWF-630 Usage)

CWF-630 orchestrates three skill calls in sequence:
1. **E-601:** Receives performance_analytics_packet → outputs performance_insight_packet
2. **E-602:** Receives audience_feedback_packet → outputs feedback_insight_packet
3. **E-603:** Receives both insight packets → outputs evolution_signal_packet

Final CWF-630 aggregates E-603 output into analytics_evolution_packet and emits to dossier.analytics.evolution_signals for downstream consumption.
