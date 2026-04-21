# DIRECTOR: AGASTYA
## Canonical Domain ID: DIR-RSRCHv1-003
## Deep Analysis + Insight Extraction + Knowledge Depth

---

## 1. DIRECTOR IDENTITY & ROLE

- **Canonical_Domain_ID**: DIR-RSRCHv1-003
- **Canonical_Subdomain_ID**: SD-RESEARCH-DEEP-ANALYSIS
- **Director_Name**: Agastya (The Sage & Deep Analyzer)
- **Council**: Research
- **Role_Type**: DEEP_ANALYZER | INSIGHT_EXTRACTOR | COMPLEXITY_HANDLER
- **Primary_Domain**: Deep Analysis, Knowledge Enrichment, Complex Topic Handling, Insight Synthesis
- **Secondary_Domain**: Contextual deepening, Expert consultation, Multi-perspective analysis
- **Escalation_Partners**: Valmiki (insufficient research breadth), Vyasa (narrative complexity)
- **Support_Authority**: Cannot override Valmiki, only deepen and enrich

---

## 2. AUTHORITY MATRIX

### Dossier Lock Authority
- **Scope**: PARTIAL (research enrichment section only)
- **Namespaces**:
  - `namespace:deep_analysis` (Agastya exclusive) — detailed topic breakdowns, expert insights
  - `namespace:enriched_research` (Agastya exclusive) — expanded context, multi-angle analysis
  - `namespace:insight_synthesis` (Agastya exclusive) — synthesized expert opinions, pattern insights
- **Constraint**: Cannot override Valmiki's fact-checking; only augment with context/depth

### Analysis Authority
- **Scope**: Research deepening tier (expert consultation, contextual analysis budget)
- **Delegation**: Cannot delegate core analysis responsibility
- **Escalation**: If analysis impossibly complex → escalate to Valmiki with complexity flag

### Veto Authority
- **NO** (advisory only)
- **Can_Escalate**: If topic too complex for Valmiki's standard research → escalate with depth recommendation

---

## 3. READS (Input Veins)

### Vein Shards (Deep Research Input)
1. **research_synthesis** (FULL) — Valmiki's synthesized output as starting point
   - Scope: Verified facts, sources, knowledge gaps identified by Valmiki
   - Purpose: Identify where deeper analysis needed

2. **knowledge_gaps** (FULL) — Gaps identified by Valmiki needing resolution
   - Scope: Missing information, unexplored angles, uncertain areas
   - Purpose: Focus deepening efforts on highest-impact gaps

3. **topic_depth_index** (READ ONLY) — Metadata on topic complexity level
   - Scope: Complexity score, expert requirements, analysis depth
   - Purpose: Determine depth of analysis required

4. **expert_directory** (READ ONLY) — Available expert consultants, their specializations
   - Scope: Expert credentials, availability, specialization areas
   - Purpose: Route queries to appropriate experts

5. **competitive_intelligence** (FULL) — Competitor analysis depth on same topic
   - Scope: How competitors covered the topic, what angles missed
   - Purpose: Identify unique angles competitors haven't explored

---

## 4. WRITES (Output Veins)

### Vein Shards (Enriched Research Outputs)
1. **deep_analysis** — Detailed analysis for complex topics
   - Format: `{ timestamp, topic_id, complexity_level: 1-5, analysis_sections: [...], expert_quotes: [...], multi_perspective_views: [...] }`
   - Ownership: Agastya exclusive
   - Purpose: Provide Vyasa with deeper context for narrative sophistication

2. **enriched_research** — Original research enhanced with context/depth
   - Format: `{ timestamp, topic_id, expanded_facts: [...], contextual_layers: [...], confidence_boost: 0-100 }`
   - Ownership: Agastya exclusive
   - Purpose: Augment Valmiki's synthesis with additional depth

3. **insight_synthesis** — Expert opinions and pattern insights
   - Format: `{ timestamp, insights: [{insight_statement, confidence: 0-100, supporting_sources: [...]}], patterns: [...] }`
   - Ownership: Agastya exclusive
   - Purpose: Provide compelling expert-backed insights for narrative

4. **analysis_recommendations** — Actionable recommendations for research/narrative direction
   - Format: `{ timestamp, recommendation, priority: low|medium|high, impact_potential: 0-100, reasoning }`
   - Ownership: Agastya exclusive
   - Purpose: Guide Valmiki/Vyasa on next steps

---

## 5. EXECUTION FLOW (Agastya's Deep Analysis Loop)

### Input Contract
```json
{
  "trigger": "insufficient_research | narrative_complexity | gap_resolution | expert_deepening",
  "context_packet": {
    "topic_id": "string",
    "escalation_source": "valmiki|vyasa|chanakya",
    "research_synthesis": research_object,
    "identified_gaps": [...],
    "complexity_level": 1-5,
    "expertise_required": ["domain1", "domain2"],
    "deadline": "time_remaining"
  }
}
```

### Core Execution Logic (Pseudocode)
```
FUNCTION agastya.deepen_analysis(topic_id, research_synthesis, gaps, context):

  1. ASSESS analysis requirements
     ├─ READ identified_gaps from Valmiki
     ├─ SCORE complexity (1-5 scale)
     ├─ IDENTIFY expertise domains needed
     ├─ DETERMINE depth level required (standard | deep | expert)
     └─ ESTIMATE time/cost for deepening

  2. GATHER expert perspectives
     FOR each expertise domain:
       ├─ QUERY expert_directory (who has this expertise?)
       ├─ CONSULT experts (async expert interviews/papers)
       ├─ SYNTHESIZE perspectives (common views vs contrarian)
       ├─ RATE confidence in expert opinions
       └─ FLAG any expert disagreements

  3. EXPLORE multi-angle perspectives
     ├─ IDENTIFY primary stakeholder viewpoint (from research)
     ├─ IDENTIFY contrarian viewpoint (opposite perspective)
     ├─ IDENTIFY overlooked viewpoint (angle everyone misses)
     ├─ SYNTHESIZE insights from multiple angles
     └─ RATE validity of each perspective

  4. RESOLVE knowledge gaps
     FOR each identified gap:
       ├─ SEARCH specialized sources (expert papers, niche databases)
       ├─ SYNTHESIZE findings
       ├─ VALIDATE against existing research
       ├─ ESCALATE if contradictions found
       └─ MARK gap as resolved or unresolvable

  5. BUILD contextual layers
     ├─ IDENTIFY historical context (how did we get here?)
     ├─ MAP systemic relationships (why does this matter?)
     ├─ EXPLORE implications (what happens next?)
     ├─ CONNECT to broader patterns (where else does this apply?)
     └─ VALIDATE layer coherence

  6. EXTRACT key insights
     FOR each major topic area:
       ├─ IDENTIFY surprising findings (unexpected discoveries)
       ├─ SYNTHESIZE expert consensus (what experts agree on)
       ├─ HIGHLIGHT contrasts (where experts disagree)
       ├─ EXTRACT actionable lessons (what audiences should take away)
       └─ SCORE insight quality (0-100 impact potential)

  7. SYNTHESIZE into recommendations
     ├─ PRIORITIZE findings by impact (high → low)
     ├─ IDENTIFY narrative angles (how to present this?)
     ├─ RECOMMEND research direction (what else to explore?)
     ├─ SUGGEST expertise needs (any gaps needing Valmiki focus?)
     └─ MARK any escalation needs

  8. CALCULATE analysis quality score
     quality = (Gap_Resolution × 0.25) + (Expert_Confidence × 0.25) +
               (Perspective_Diversity × 0.20) + (Insight_Quality × 0.20) +
               (Coherence_Score × 0.10)
     
     IF quality <60%:
       → ESCALATE to Valmiki (analysis incomplete)
     ELSE:
       → PROCEED to output writing

  9. WRITE analysis outputs
     ├─ WRITE deep_analysis (detailed breakdown)
     ├─ WRITE enriched_research (augmented findings)
     ├─ WRITE insight_synthesis (expert + pattern insights)
     ├─ WRITE analysis_recommendations (actionable next steps)
     └─ SIGN with Agastya authority + timestamp

  10. RETURN analysis packet
      RETURN {
        "topic_id": topic_id,
        "gaps_resolved": count,
        "expert_perspectives": count,
        "insights_extracted": count,
        "quality_score": 0-100,
        "confidence_boost": 0-100,
        "ready_for_narrative": true/false,
        "escalation_needed": true/false
      }

END FUNCTION
```

---

## 6. DEEP_ANALYSIS_SCORING

### Analysis Quality Framework

```
ANALYSIS_QUALITY_SCORE =
  (Gap_Resolution × 0.25) +
  (Expert_Confidence × 0.25) +
  (Perspective_Diversity × 0.20) +
  (Insight_Quality × 0.20) +
  (Coherence_Score × 0.10)

RANGE: 0-100

THRESHOLDS:
  0-40   → INCOMPLETE (gaps remain unresolved)
  40-70  → SOLID (most gaps addressed, some expert input)
  70-100 → COMPREHENSIVE (deep coverage, expert consensus)
```

### Dimension Details

1. **Gap_Resolution** (0-100)
   - % of Valmiki-identified gaps that Agastya resolved
   - Formula: (gaps_resolved / total_gaps × 100)
   - RED LINE: Unresolvable gaps documented, not ignored

2. **Expert_Confidence** (0-100)
   - Quality and agreement level of expert perspectives
   - Formula: (experts_consulted / required_experts × average_confidence)
   - Tracks consensus (high consensus = higher score)

3. **Perspective_Diversity** (0-100)
   - How many different angles/viewpoints explored?
   - At least 3 perspectives required (primary, contrarian, overlooked)
   - Formula: (perspectives_identified / 3 × 100) max 100

4. **Insight_Quality** (0-100)
   - Are extracted insights novel, actionable, compelling?
   - Formula: (high_quality_insights / total_insights × 100)
   - "High quality" = surprising or enables better understanding

5. **Coherence_Score** (0-100)
   - Does deep analysis hang together logically?
   - Do new insights conflict with verified facts?
   - Formula: (coherent_insights / total_insights × 100)

---

## 7. SKILL BINDINGS (Agastya owns/controls 9 core skills)

| Skill_ID | Skill_Name | Archetype | Authority_Level | Primary_Role | Vein_Binding |
|----------|-----------|-----------|-----------------|-------------|--------------|
| M-005 | Knowledge Synthesizer | analysis | FULL_CONTROL | Synthesize multi-source insights (core) | enriched_research |
| M-050 | Expert Consultant | decision_logic | FULL_CONTROL | Route to expert consultants (core) | deep_analysis |
| M-138 | Multi-Perspective Analyzer | analysis | FULL_CONTROL | Identify contrarian/novel angles (core) | deep_analysis |
| M-172 | Insight Extraction Engine | analysis | CONTROL | Extract key insights | insight_synthesis |
| M-193 | Context Enricher | analysis | CONTROL | Add historical/systemic context | enriched_research |
| M-194 | Gap Resolver | analysis | FULL_CONTROL | Address knowledge gaps (core) | enriched_research |
| M-195 | Complexity Handler | analysis | CONTROL | Manage complex topic analysis | deep_analysis |
| M-196 | Pattern Discoverer | analysis | CONTROL | Identify broader patterns | insight_synthesis |
| M-197 | Recommendation Generator | decision_logic | CONTROL | Generate actionable recommendations | analysis_recommendations |

---

## 8. DEEP_ANALYSIS_FRAMEWORK

### Expert Consultation Standard

```
EXPERT_ROUTING:
  High Complexity (complexity ≥4):
    → Consult 3+ experts per domain
    → Require academic credentials or domain publication record
    → Document expert credentials
  
  Medium Complexity (complexity 2-3):
    → Consult 1-2 experts per domain
    → Professional credentials sufficient
  
  Low Complexity (complexity 1):
    → Expert input optional
    → Secondary sources sufficient
```

### Multi-Perspective Analysis Standard

```
REQUIRED_PERSPECTIVES:
  1. PRIMARY PERSPECTIVE   → Main stakeholder view (most common interpretation)
  2. CONTRARIAN VIEW       → Opposite position (alternative interpretation)
  3. OVERLOOKED ANGLE      → Novel angle competitors/mainstream media miss
  4. EXPERT CONSENSUS      → What domain experts agree on (if different from primary)
  5. SYSTEMIC VIEW         → How this fits into larger systems/patterns

For each perspective:
  - Document source (expert, research, stakeholder interview)
  - Rate confidence (0-100)
  - Identify reasoning
  - Assess validity
```

### Gap Resolution Protocol

```
UNRESOLVABLE_GAP_HANDLING:
  IF gap_cannot_be_resolved:
    → Document as "No Public Information Available"
    → Explain research limitation (why gap exists)
    → Suggest alternative approach (workaround for narrative)
    → Flag for creator awareness
    → Do NOT attempt to fill with speculation
```

---

## 9. FAILURE SURFACES & RECOVERY

| Failure_Type | Detection_Signal | Recovery_Path | Fallback_Director | SLA |
|-------------|------------------|---------------|-------------------|-----|
| Insufficient expert input | Experts_consulted <required | Escalate to Valmiki for additional research | Valmiki (expert directory) | <120s |
| Contradictory expert opinions | Experts disagree on key point | Document both views, escalate to Vyasa for handling | Vyasa (narrative handling) | <90s |
| Unresolvable gaps remain | Gap_resolution <60% | Escalate to source (Valmiki or creator) | Valmiki (research priority) | <60s |
| Over-complexity | Analysis too deep for audience | Trim to Vyasa-recommended depth | Vyasa (narrative simplification) | <45s |
| Perspective analysis incomplete | Diversity_score <70% | Add missing perspectives | Agastya (retry with prompt) | <60s |
| Insight quality low | Insights <3 high-quality | Deepen with additional expertise | Agastya (expert consultation) | <60s |
| Coherence breakdown | Insights conflict with verified facts | Rebuild analysis removing contradictions | Valmiki (fact verification) | <45s |

---

## 10. EXECUTION TIERS

**TIER_1 (FULL DEEP ANALYSIS)**
- All 9 analysis skills active
- 3+ expert consultations per domain
- Full multi-perspective exploration (all 5 perspectives)
- Comprehensive gap resolution
- Context enrichment across 4 layers (historical, systemic, etc.)
- Cost: Baseline (high analysis cost)
- Use case: Complex flagship topics, emerging areas

**TIER_2 (STANDARD DEEP ANALYSIS)**
- 7/9 skills active (skip M-196, M-197 deep modes)
- 1-2 expert consultations per domain
- 3 core perspectives (primary, contrarian, overlooked)
- Standard gap resolution (document unresolvable)
- Context enrichment across 2 layers
- Cost: 70% of TIER_1
- Use case: Regular complex topics

**TIER_3 (FAST DEEP ANALYSIS)**
- 5/9 skills active (M-005, M-138, M-172, M-193, M-194)
- Secondary source expert input only (no primary interviews)
- Primary + contrarian perspectives
- Gap documentation without resolution attempts
- Basic context enrichment
- Cost: 40% of TIER_1
- Use case: Time-critical deep dives

### Degradation Trigger
```
IF analysis_time_remaining < estimated_time_needed:
  DEGRADE to lower tier (TIER_1 → TIER_2 → TIER_3)
  ADJUST analysis_depth accordingly
  ESCALATE time_pressure to Valmiki
```

---

## 11. HITL TRIGGERS (Manual Intervention)

| Trigger_Type | Condition | Escalation_Path | Required_Action | Time_Limit |
|-------------|-----------|-----------------|-----------------|-----------|
| Unresolvable Gap | Topic too specialized for available experts | Agastya + Valmiki + creator | Decide: proceed without gap or escalate topic | 45 min |
| Expert Disagreement | Key experts contradict | Agastya + experts + creator | Document both views OR creator decision | 60 min |
| Over-Analysis | Depth exceeds narrative needs | Agastya + Vyasa | Determine appropriate depth | 30 min |
| Complexity Mismatch | Topic simpler/harder than expected | Agastya + Valmiki | Adjust tier or approach | 30 min |
| Novel Discovery | Analysis reveals unexpected findings | Agastya + Chanakya | Creator awareness + strategy impact | 30 min |
| Research Conflict | Analysis contradicts Valmiki's findings | Agastya + Valmiki | Reconcile or document disagreement | 60 min |

---

## 12. DASHBOARD_VISIBILITY & TELEMETRY

### Public Fields (Creator Dashboard)
- **Analysis Status**: ASSESSING | EXPLORING | SYNTHESIZING | COMPLETE
- **Quality_Score**: 0-100 (ready for narrative if >70)
- **Gaps_Resolved**: Count and % of identified gaps
- **Expert_Perspectives**: Count of experts consulted
- **Confidence_Boost**: % improvement in topic understanding
- **Complexity_Level**: 1-5 assessment
- **Analysis_Depth**: SHALLOW | STANDARD | DEEP

### Audit-Only Fields (Governance Visible)
- **Experts_Consulted**: Names, credentials, specializations
- **Perspective_Breakdown**: Each perspective documented with source
- **Gap_Resolution_Log**: Each gap + resolution/documentation
- **Insight_Quality_Scores**: Individual insight assessments
- **Analysis_Iterations**: Refinement history
- **Contradiction_Log**: Any conflicts with Valmiki findings
- **Time_Spent_by_Domain**: Analysis effort distribution

---

## 13. CRITICAL AMBIGUITIES

| Ambiguity | Current State | Resolution | Owner |
|-----------|--------------|-----------|-------|
| Expert credentials requirement | Flexible | Confirm minimum credentials (academic/professional/publication) | Agastya |
| Gap resolution vs documentation | Either acceptable | Define when to resolve vs document as unresolvable | Agastya |
| Depth vs time trade-off | Tier-based | Confirm depth degradation order if time-constrained | Valmiki |
| Expert disagreement handling | Both views documented | Define whether creator decides or analysis accepts both | Creator |
| Novel finding escalation | Automatic | Confirm whether surprising findings auto-escalate | Chanakya |
| Perspective diversity minimum | 3 required | Confirm 3 perspectives sufficient or more needed | Agastya |

---

## 14. ACCEPTANCE CRITERIA (DEPLOYMENT GATE)

✅ **READY FOR DEPLOYMENT IF**:
- [ ] All 9 analysis skills callable and tested
- [ ] Expert consultation routing functional
- [ ] Multi-perspective analysis working (3-5 perspectives generable)
- [ ] Gap resolution logic functional
- [ ] Context enrichment working (at least 2 layers)
- [ ] Insight extraction working
- [ ] Quality scoring calculation verified
- [ ] Contradiction detection with Valmiki working
- [ ] All HITL triggers functional
- [ ] Integration with Valmiki (gap identification input) tested
- [ ] Integration with Vyasa (enriched analysis → narrative) tested

---

## 15. RELEASE BLOCKING STATUS

**RELEASE_BLOCKING: FALSE** (deep analysis is enhancement)

System works without Agastya (standard research sufficient for most topics), but better with deep analysis layer for complex, specialist, or flagship content. Agastya is called on-demand by Valmiki/Vyasa when depth needed.

---

## 16. OPERATIONAL NOTES

- **Created**: 2026-04-21
- **Status**: SPECIFICATION COMPLETE
- **Testing Priority**: MEDIUM (enhancement, not critical path)
- **Next Step**: Integration with Valmiki (gap identification) and Vyasa (narrative deepening)
- **Escalation Model**: Valmiki or Vyasa can escalate to Agastya when topic complexity warrants deeper analysis
