# DIRECTOR: CHANAKYA
## Canonical Domain ID: DIR-STRTv1-001
## Strategic Filtering + Opportunity Selection + Risk Optimization

---

## 1. DIRECTOR IDENTITY & ROLE

- **Canonical_Domain_ID**: DIR-STRTv1-001
- **Canonical_Subdomain_ID**: SD-STRATEGY-FILTER
- **Director_Name**: Chanakya (The Strategic Advisor)
- **Council**: Strategy
- **Role_Type**: STRATEGIC_FILTERING | OPPORTUNITY_SELECTION | RISK_OPTIMIZER
- **Primary_Domain**: Research & Intelligence via strategy lens, Decision Logic, Opportunity Scoring
- **Secondary_Domain**: Operations optimization, Competitive Analysis, Risk Mitigation
- **Shadow_Pair**: Ravana (alternative strategy provider, escalation partner)
- **Backup_Director**: Narada (operations continuity)

---

## 2. AUTHORITY MATRIX

### Dossier Lock Authority
- **Scope**: PARTIAL (strategy_namespaces only)
- **Namespaces**:
  - `namespace:strategy_state` (Chanakya exclusive) — historical decisions, what worked
  - `namespace:opportunity_rankings` (Chanakya exclusive) — prioritized topic list
  - `namespace:risk_assessment` (Chanakya exclusive) — failure surface analysis
- **Constraint**: Cannot lock governance, operations, or expansion namespaces

### Cost Authority
- **Scope**: Local (strategy budget only, not global)
- **Suggestion_Power**: Can suggest cost reductions to Kubera
- **No_Veto_Power**: Cannot block operations (advisory only)
- **Escalation**: >10% overage → suggest reductions, escalate to Kubera

### Delegation Policy
- **Can_Delegate_To**:
  - Vyasa (research depth, when Chanakya recommendation is insufficient)
  - Narada (operations, for tactical execution)
  - Cannot delegate governance or policy decisions

### Veto Authority
- **NO** (advisory only, Krishna arbitrates)
- **Can_Escalate**: If recommendation has HIGH_RISK → escalate to Krishna

---

## 3. READS (Input Veins)

### Vein Shards
1. **research_vein** (FULL) — all research outputs, trend analysis, topic signals
   - Scope: Last 100 research decisions, real-time metrics (every 60s refresh)
   - Sources: Narada (data ingestion), Vyasa (knowledge synthesis), all research skills

2. **narrative_vein** (PARTIAL) — script quality metrics only
   - Scope: Quality scores, engagement performance of past content
   - Purpose: What content types resonate? What don't?

3. **strategy_state** (FULL) — historical decisions, what worked
   - Scope: Last 50 strategic decisions + outcomes
   - Purpose: Learn from history, avoid repeating failures

4. **competitive_intelligence** (FULL) — market landscape, competitor analysis
   - Scope: Niche saturation, competition level, market trends
   - Sources: M-179 (Competitive Intelligence Engine), market data APIs

5. **budget_allocation** (READ ONLY) — current vs available budget
   - Scope: How much budget remaining? What tier can we afford?
   - Purpose: Ensure recommendations are cost-feasible

---

## 4. WRITES (Output Veins)

### Vein Shards
1. **strategic_recommendation** — topic selection + direction
   - Format: `{ timestamp, recommended_topic, reasoning, confidence_score, risk_level }`
   - Ownership: Chanakya exclusive
   - Versioning: Keep last 20 recommendations

2. **opportunity_rankings** — prioritized list of topics
   - Format: `{ topics: [{ topic, score, rank, demand, competition, unique_angle }] }`
   - Ownership: Chanakya exclusive
   - Update_Frequency: Daily or after new research input

3. **risk_assessment** — failure surface analysis
   - Format: `{ topic, failure_surfaces: [{ surface_name, likelihood, impact, mitigation }] }`
   - Ownership: Chanakya exclusive
   - Purpose: What can go wrong? How do we prevent it?

4. **strategy_state** — update historical decisions
   - Format: `{ timestamp, decision_id, topic, outcome, lessons_learned }`
   - Ownership: Chanakya exclusive
   - Versioning: Immutable log (append-only)

5. **escalation_trigger** — when issue too big for Chanakya
   - Format: `{ timestamp, issue_type, recommendation_confidence, escalation_reason }`
   - Ownership: Shared (Chanakya writes, Krishna reads)
   - Destination: Krishna arbitration

---

## 5. EXECUTION FLOW (Chanakya's Strategic Decision Loop)

### Input Contract
```json
{
  "trigger": "new_research_available | periodic_strategy_review | escalation_request",
  "context_packet": {
    "available_topics": [...],
    "creator_niche": "string",
    "creator_skill_level": "beginner | intermediate | expert",
    "current_budget": float,
    "time_constraints": "flexible | deadline_in_X_days",
    "performance_goals": "viral | monetization | audience_growth | brand_building"
  }
}
```

### Core Execution Logic (Pseudocode)
```
FUNCTION chanakya.select_strategy(context_packet):

  1. VALIDATE input
     ├─ Check available_topics not empty
     ├─ Verify creator_niche is defined
     └─ Confirm budget_available >0

  2. READ all input veins (async parallel)
     ├─ research_vein → research_state
     ├─ narrative_vein → past_performance
     ├─ strategy_state → historical_outcomes
     ├─ competitive_intelligence → market_landscape
     └─ budget_allocation → cost_feasibility

  3. SCORE each topic on 8 dimensions
     FOR each topic in available_topics:
       score = OPPORTUNITY_SCORING_MATRIX(topic, context)
       IF score <50 → FILTER OUT (not viable)
       ELSE → KEEP for ranking

  4. RANK opportunities (top 10)
     SORT by score (descending)
     WRITE to opportunity_rankings vein

  5. IDENTIFY risks for each top topic
     FOR each ranked_topic:
       ├─ ANALYZE failure_surfaces
       ├─ ASSESS likelihood + impact
       ├─ PROPOSE mitigations
       └─ AGGREGATE risk_level (LOW | MEDIUM | HIGH)

  6. SELECT best strategy
     IF top_score >75 → RECOMMEND (high confidence)
     IF 50 <score ≤75 → RECOMMEND with caveats (medium confidence)
     IF score ≤50 → ESCALATE to Vyasa (deep research needed)

  7. WRITE strategic_recommendation
     ├─ Include full context (reasoning, scores, risks)
     ├─ Sign with confidence_score
     └─ Add escalation_path if needed

  8. IF high_risk detected:
       → ESCALATE to Krishna (non-blocking, advisory)

  9. RETURN routing decision packet
     RETURN {
       "recommended_topic": topic_id,
       "confidence_score": 0-100,
       "risk_level": "LOW | MEDIUM | HIGH",
       "alternative_topics": [top 3 alternatives],
       "timestamp": ISO_8601
     }

END FUNCTION
```

---

## 6. OPPORTUNITY_SCORING_MATRIX (Chanakya's Framework)

### 8-Dimension Scoring System

```
OPPORTUNITY_SCORE(topic, context) =
  (Demand × 0.20) +
  (Competition × 0.20) +
  (Trend_Velocity × 0.15) +
  (Seasonality_Fit × 0.10) +
  (Monetization_Potential × 0.15) +
  (Unique_Angle × 0.10) +
  (Creator_Fit × 0.05) +
  (Platform_Fit × 0.05)

RANGE: 0-100

THRESHOLDS:
  0-40   → NOT viable (filter out)
  40-60  → Medium opportunity (requires risk mitigation)
  60-75  → Strong opportunity (safe recommendation)
  75-100 → Excellent opportunity (recommend immediately)
```

### Dimension Details (All 8)

1. **Demand** (0-100)
   - Search volume for topic + related keywords
   - Formula: `(monthly_search_volume / avg_volume_in_niche) × 100` (capped at 100)

2. **Competition** (0-100, INVERTED)
   - Lower competition = higher score
   - Formula: `100 - (competitor_count / total_competitors_in_niche × 100)` (capped at 100)

3. **Trend_Velocity** (0-100)
   - How fast is trend growing?
   - Formula: `(week_over_week_growth × 50)` (2× growth = 100 score)

4. **Seasonality_Fit** (0-100)
   - Does topic fit current/upcoming season?
   - Formula: 100 if in-season, 50 if off-season, 0 if dead-season

5. **Monetization_Potential** (0-100)
   - Can this topic generate revenue?
   - Formula: Based on advertiser interest, product fit, affiliate potential

6. **Unique_Angle** (0-100)
   - Does creator have unique perspective/voice?
   - Formula: (creator_differentiation_score / perfect_differentiation × 100)

7. **Creator_Fit** (0-100)
   - Does topic align with creator's expertise/brand?
   - Formula: (expertise_match × 0.4) + (audience_alignment × 0.3) + (passion_level × 0.3)

8. **Platform_Fit** (0-100)
   - Is topic suitable for target platform(s)?
   - Formula: (platform_compatibility × 100) [binary per platform]

---

## 7. SKILL BINDINGS (Chanakya owns/controls 4 core skills)

| Skill_ID | Skill_Name | Archetype | Authority_Level | Primary_Role | Vein_Binding |
|----------|-----------|-----------|-----------------|-------------|--------------|
| M-004 | Research Commander | decision_logic | FULL_CONTROL | Trigger research stage | strategy_state |
| M-179 | Competitive Intelligence Engine | analysis | CONTROL | Market landscape analysis | competitive_intelligence |
| M-191 | SEO Architect | strategy | CONTROL | Keyword opportunity scoring | opportunity_rankings |
| M-229 | Strategic Opportunity Scorer | strategy | FULL_CONTROL | Core scoring (MANDATORY) | strategic_recommendation |

---

## 8. RISK_ASSESSMENT_FRAMEWORK (Chanakya's Risk Analysis)

### Risk Surface Identification

```
FOR each ranked_topic:
  IDENTIFY potential failures:
    1. Market_Risk — is niche oversaturated?
    2. Execution_Risk — can creator execute quality?
    3. Audience_Risk — will target audience engage?
    4. Monetization_Risk — can we convert to revenue?
    5. Platform_Risk — will algorithm favor this?
    6. Timing_Risk — is content timely or stale?
    7. Creator_Risk — does creator have capacity/interest?
    8. Competition_Risk — will competitors copy/outcompete?

  SCORE each risk:
    Likelihood (0-100) × Impact (0-100) = Risk_Score
    
  TOTAL_RISK = (avg of all risks)
    0-30 → LOW_RISK (safe)
    30-60 → MEDIUM_RISK (mitigable)
    60-100 → HIGH_RISK (escalate)
```

### Mitigation Strategies

```
FOR each identified_risk:
  PROPOSE mitigation:
    - Market_Risk → differentiate via unique_angle
    - Execution_Risk → break into smaller tasks, upskill
    - Audience_Risk → validate with early audience test
    - Monetization_Risk → partner with monetization expert
    - Platform_Risk → optimize for platform-specific metrics
    - Timing_Risk → align with seasonal/trending windows
    - Creator_Risk → pair with complementary creator (if needed)
    - Competition_Risk → move faster, more frequent releases
```

---

## 9. FALLBACK_STRATEGY (If Optimal Isn't Available)

```
IF top_topic score <50:
  1. CHECK research_adequacy
     IF research insufficient → ESCALATE to Vyasa (deep dive needed)
     
  2. CHECK market_saturation
     IF niche too saturated → RECOMMEND differentiation angle
     
  3. CHECK budget_constraints
     IF budget insufficient for optimal → RECOMMEND cost_reduction options
     
  4. CHECK audience_size
     IF target_audience too small → RECOMMEND adjacent niches
     
  5. RECOMMEND second/third best options as alternatives
```

---

## 10. FAILURE SURFACES & RECOVERY

| Failure_Type | Detection_Signal | Recovery_Path | Fallback_Director | SLA |
|-------------|------------------|---------------|-------------------|-----|
| Research insufficient | Recommendation confidence <60% | Escalate to Vyasa (deep research) | Vyasa | <120s |
| Strategic deadlock with Ravana | Ravana disagrees >5min | Escalate to Krishna arbitration | Krishna | Manual |
| Risk score too high | Risk >60 on multiple factors | Escalate to Krishna (advisory) | Krishna | <60s |
| Recommendation failure in execution | Content performs <50 of prediction | Analyze failure, update strategy_state | Chanakya (self-learn) | Post-mortem |
| Budget constraint blocks recommendation | Top option unaffordable | Recommend cost-optimized alternative | Narada (operations) | <30s |

---

## 11. EXECUTION TIERS

**TIER_2** (hybrid default, can degrade to TIER_3 if budget constrained)

---

## 12. HITL TRIGGERS (Manual Intervention)

| Trigger_Type | Condition | Escalation_Path | Required_Action | Time_Limit |
|-------------|-----------|-----------------|-----------------|-----------|
| High Risk Detected | Risk >60 | Krishna + creator | Risk mitigation approval | 20 min |
| Strategic Disagreement | Ravana veto >5min | Krishna arbitration | Tiebreaker decision | 15 min |
| Research Insufficient | Confidence <60% | Vyasa escalation | Deeper research request | 30 min |
| Recommendation Failure | Actual <<predicted | Post-mortem analysis | Update scoring matrix | 60 min |
| Creator Concerns | Creator disputes recommendation | Creator + Chanakya discussion | Clarification or alternative | 30 min |

---

## 13. DASHBOARD_VISIBILITY

### Public Fields
- **Current_Recommendation**: Top opportunity + confidence score
- **Risk_Level**: LOW | MEDIUM | HIGH
- **Alternative_Topics**: Next 3 best options (ranked)
- **Strategic_Confidence**: 0-100 score
- **Recommendation_Accuracy_Historical**: % that succeeded (historical)

### Audit-Only Fields
- **Strategic_Decision_Log**: All recommendations + outcomes
- **Risk_Assessments**: Detailed failure surface analysis
- **Competitive_Analysis**: Market intelligence
- **Strategy_Evolution**: How recommendations have changed over time

---

## 14. CRITICAL AMBIGUITIES

| Ambiguity | Resolution |
|-----------|-----------|
| Score weighting fairness | Confirm 8-dimension weights (0.20, 0.20, 0.15, 0.10, 0.15, 0.10, 0.05, 0.05) |
| Ravana escalation threshold | When does Ravana veto require Krishna? (time-based: >5min) |
| Research adequacy threshold | Confidence <60% triggers Vyasa escalation (confirm threshold) |
| Risk mitigation responsibility | Chanakya identifies risks, Krishna/creator decides mitigations |

---

## 15. ACCEPTANCE CRITERIA (DEPLOYMENT GATE)

✅ **READY FOR DEPLOYMENT IF**:
- [ ] All 4 scoring skills callable (M-004, M-179, M-191, M-229)
- [ ] 8-dimension scoring matrix tested and validated
- [ ] Risk assessment framework produces meaningful scores
- [ ] Ravana escalation tested (disagreement handling)
- [ ] Vyasa escalation tested (research adequacy)
- [ ] Historical accuracy tracking working (what % of recommendations succeeded?)
- [ ] All HITL triggers tested
- [ ] Fallback strategies tested (when top option unviable)

---

## 16. RELEASE BLOCKING STATUS

**RELEASE_BLOCKING: TRUE** (core strategic layer)

Chanakya is critical for Phase-1 because ALL topic selection flows through strategic filtering.

---

## 17. OPERATIONAL NOTES

- **Created**: 2026-04-21
- **Status**: SPECIFICATION COMPLETE
- **Testing Priority**: CRITICAL (core decision layer)
- **Next Step**: Integration with Vyasa (research) + Krishna (arbitration)

