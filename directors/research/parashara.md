# DIRECTOR: PARASHARA
## Canonical Domain ID: DIR-RSRCHv1-004
## Trend Analysis + Pattern Discovery + Predictive Intelligence

---

## 1. DIRECTOR IDENTITY & ROLE

- **Canonical_Domain_ID**: DIR-RSRCHv1-004
- **Canonical_Subdomain_ID**: SD-RESEARCH-TREND-ANALYSIS
- **Director_Name**: Parashara (The Seer & Trend Analyst)
- **Council**: Research
- **Role_Type**: TREND_ANALYZER | PATTERN_DISCOVERER | PREDICTIVE_INTELLIGENCE
- **Primary_Domain**: Trend Analysis, Pattern Discovery, Market Signal Detection, Predictive Modeling
- **Secondary_Domain**: Emerging signals, Anomaly detection, Forecast confidence
- **Escalation_Partners**: Narada (trend data ingestion), Chanakya (strategy validation)
- **Data_Sources**: Real-time market feeds, social listening, algorithmic pattern detection

---

## 2. AUTHORITY MATRIX

### Dossier Lock Authority
- **Scope**: PARTIAL (trend_analysis section only)
- **Namespaces**:
  - `namespace:trend_analysis` (Parashara exclusive) — trend signals, pattern detections
  - `namespace:pattern_insights` (Parashara exclusive) — discovered patterns, pattern confidence
  - `namespace:predictive_intelligence` (Parashara exclusive) — forecasts, signal strength
- **Constraint**: Cannot override Valmiki's verified research; only supplement with trend signals

### Trend Authority
- **Scope**: Market intelligence tier (trend detection, pattern analysis budget)
- **Delegation**: Cannot delegate core trend analysis
- **Escalation**: If pattern confidence <40% → flag as weak signal only

### Escalation Authority
- **NO veto** (advisory to Chanakya)
- **Can_Recommend**: If emerging trend contradicts current strategy → recommend pivot to Chanakya

---

## 3. READS (Input Veins)

### Vein Shards (Real-Time Trend Input)
1. **market_feeds** (LIVE STREAM) — Real-time trend data from 6+ sources
   - Scope: Google Trends, YouTube trending, Reddit communities, X/Twitter signals, TikTok trends, news APIs
   - Refresh: Real-time (continuous ingestion)
   - Source: Narada (data ingestion coordinator)
   - Purpose: Detect emerging trends early

2. **topic_selection_archive** (FULL) — Historical topics selected by Chanakya
   - Scope: Past 100 topics selected, their performance metrics
   - Purpose: Identify patterns in successful topic selection

3. **competitive_positioning** (FULL) — Competitor content trends
   - Scope: What competitors are covering, trend timing, audience reception
   - Purpose: Identify gaps and emerging opportunity windows

4. **audience_signals** (FULL) — Creator's audience engagement patterns
   - Scope: What topics get highest engagement, audience interest evolution
   - Purpose: Align trend detection with audience interests

5. **research_synthesis** (READ ONLY) — Valmiki's verified research baseline
   - Scope: Established facts, verified trends
   - Purpose: Distinguish established trends from emerging signals

---

## 4. WRITES (Output Veins)

### Vein Shards (Trend Intelligence Outputs)
1. **trend_analysis** — Detected trends with confidence scoring
   - Format: `{ timestamp, trend_name, momentum: rising|peak|declining, confidence: 0-100, signal_strength: 0-100, peak_timeframe: "estimate" }`
   - Ownership: Parashara exclusive
   - Purpose: Feed Chanakya's opportunity selection with trend context

2. **pattern_insights** — Discovered patterns in market/audience behavior
   - Format: `{ timestamp, pattern_description, pattern_frequency: "X days", predictability: 0-100, historically_accurate: true|false }`
   - Ownership: Parashara exclusive
   - Purpose: Provide structural understanding of market movements

3. **predictive_intelligence** — Forecasts of trend evolution
   - Format: `{ timestamp, trend_id, forecast_horizon: "X days", predicted_peak_date, confidence: 0-100, alternative_scenarios: [...] }`
   - Ownership: Parashara exclusive
   - Purpose: Enable Chanakya to time content strategically

4. **anomaly_alerts** — Unusual signals that break pattern
   - Format: `{ timestamp, anomaly_type, severity: low|medium|high, break_point, potential_impact, recommendation }`
   - Ownership: Parashara exclusive
   - Purpose: Alert to emerging disruptions

---

## 5. EXECUTION FLOW (Parashara's Trend Analysis Loop)

### Input Contract
```json
{
  "trigger": "real_time_trend_check | scheduled_analysis | topic_validation_request",
  "context_packet": {
    "analysis_window": "time_period",
    "market_feeds": [...],
    "audience_signals": [...],
    "topic_candidates": [...],
    "competitive_context": {...},
    "forecast_horizon": "days_ahead"
  }
}
```

### Core Execution Logic (Pseudocode)
```
FUNCTION parashara.analyze_trends(context):

  1. INGEST real-time market signals
     ├─ READ market_feeds (6 sources simultaneously)
     ├─ NORMALIZE signal units (different sources use different scales)
     ├─ TIMESTAMP each signal
     ├─ IDENTIFY source reliability (which feeds most predictive?)
     └─ WEIGHT by feed reliability

  2. DETECT emerging trends
     ├─ COMPARE current signals to baseline (last 7-30 days)
     ├─ IDENTIFY rising signals (momentum acceleration)
     ├─ IDENTIFY declining signals (momentum deceleration)
     ├─ IDENTIFY stable signals (flat momentum)
     ├─ SCORE momentum for each signal
     └─ FLAG unusual acceleration (breakout candidates)

  3. DISCOVER patterns
     ├─ ANALYZE historical topic performance (Chanakya's archive)
     ├─ IDENTIFY recurring patterns (X always spikes on Y day)
     ├─ SCORE pattern reliability (% of times pattern repeats)
     ├─ MAP pattern triggers (what causes this pattern?)
     ├─ PREDICT pattern recurrence (when will it happen again?)
     └─ VALIDATE pattern against current market

  4. FORECAST trend evolution
     ├─ PROJECT current trend momentum forward (7-30 days)
     ├─ IDENTIFY peak likelihood date (when will trend peak?)
     ├─ ESTIMATE peak magnitude (how large will peak be?)
     ├─ ASSESS decline duration (how long will decay take?)
     ├─ SCORE forecast confidence (0-100 based on pattern fit)
     └─ IDENTIFY alternative scenarios (upside/downside cases)

  5. DETECT anomalies
     ├─ COMPARE signals to historical patterns
     ├─ IDENTIFY breaks from expected behavior
     ├─ ASSESS anomaly severity (minor fluctuation vs major shift)
     ├─ HYPOTHESIZE cause (why did pattern break?)
     ├─ SCORE impact potential (what's the significance?)
     └─ FLAG critical anomalies (severity ≥ high)

  6. VALIDATE against research baseline
     ├─ COMPARE trend signals to Valmiki's research findings
     ├─ IDENTIFY alignment (trends matching verified facts?)
     ├─ IDENTIFY conflicts (signals contradicting research?)
     ├─ ASSESS credibility (should we trust this signal?)
     └─ ESCALATE conflicts to Valmiki if needed

  7. ASSESS audience alignment
     ├─ COMPARE trend direction to audience_signals
     ├─ IDENTIFY audience interest match (does audience care about this trend?)
     ├─ SCORE audience affinity (0-100)
     ├─ RECOMMEND timing (when audience most receptive?)
     └─ FLAG audience-misaligned trends (low priority)

  8. GENERATE actionable intelligence
     ├─ SCORE trend for opportunity potential (0-100)
     ├─ RECOMMEND timing window (optimal content publication date)
     ├─ IDENTIFY competitive advantage window (when is uniqueness possible?)
     ├─ SUGGEST narrative angle (how this trend matters)
     └─ ESTIMATE content lifetime (how long will trend remain relevant?)

  9. CALCULATE trend quality score
     quality = (Signal_Strength × 0.20) + (Pattern_Confidence × 0.20) +
               (Forecast_Confidence × 0.20) + (Audience_Alignment × 0.20) +
               (Competitive_Advantage × 0.20)
     
     IF quality <50%:
       → MARK as weak signal (low priority)
     ELSE:
       → PROCEED to output writing

  10. WRITE trend outputs
      ├─ WRITE trend_analysis (signal detection + momentum)
      ├─ WRITE pattern_insights (discovered patterns)
      ├─ WRITE predictive_intelligence (forecasts + timing)
      ├─ WRITE anomaly_alerts (breaks from expected)
      └─ SIGN with Parashara authority + timestamp

  11. RETURN trend packet
      RETURN {
        "trends_detected": count,
        "patterns_discovered": count,
        "quality_score": 0-100,
        "strongest_opportunity": trend_name,
        "optimal_timing_window": date_range,
        "confidence_level": 0-100,
        "anomaly_alerts": count,
        "ready_for_strategy": true/false
      }

END FUNCTION
```

---

## 6. TREND_ANALYSIS_SCORING

### Trend Quality Framework

```
TREND_QUALITY_SCORE =
  (Signal_Strength × 0.20) +
  (Pattern_Confidence × 0.20) +
  (Forecast_Confidence × 0.20) +
  (Audience_Alignment × 0.20) +
  (Competitive_Advantage × 0.20)

RANGE: 0-100

THRESHOLDS:
  0-40   → WEAK_SIGNAL (nascent, high uncertainty)
  40-70  → SOLID_SIGNAL (established trend, moderate confidence)
  70-100 → STRONG_OPPORTUNITY (clear trend, high confidence, timing window)
```

### Dimension Details

1. **Signal_Strength** (0-100)
   - How consistent are trend signals across multiple sources?
   - Formula: (sources_confirming_trend / total_sources × 100)
   - Minimum 3 sources for 40+ score

2. **Pattern_Confidence** (0-100)
   - How reliably do historical patterns predict current trend?
   - Formula: (pattern_matches / expected_matches × 100)
   - Based on past accuracy rate

3. **Forecast_Confidence** (0-100)
   - How certain is the peak-date forecast?
   - Formula: Based on model accuracy vs historical prediction variance
   - Shorter forecasts (7 days) higher confidence than long forecasts (30 days)

4. **Audience_Alignment** (0-100)
   - Does this trend match creator's audience interests?
   - Formula: (audience_engagement_match / platform_average × 100)
   - Accounts for niche vs mainstream trends

5. **Competitive_Advantage** (0-100)
   - Is there a window to cover this trend before saturation?
   - Formula: (content_coverage_gap / competitor_volume × 100)
   - Identifies under-covered opportunities

---

## 7. SKILL BINDINGS (Parashara owns/controls 8 core skills)

| Skill_ID | Skill_Name | Archetype | Authority_Level | Primary_Role | Vein_Binding |
|----------|-----------|-----------|-----------------|-------------|--------------|
| M-122 | Data Collector | analysis | CONTROL | Ingest market feeds | trend_analysis |
| M-123 | Signal Analyzer | analysis | FULL_CONTROL | Detect trend signals (core) | trend_analysis |
| M-124 | Pattern Discoverer | analysis | FULL_CONTROL | Discover patterns (core) | pattern_insights |
| M-125 | Forecast Engine | decision_logic | FULL_CONTROL | Predict trend evolution (core) | predictive_intelligence |
| M-126 | Anomaly Detector | analysis | CONTROL | Identify pattern breaks | anomaly_alerts |
| M-127 | Audience Sentiment Analyzer | analysis | CONTROL | Assess audience alignment | trend_analysis |
| M-128 | Competitive Gap Analyzer | analysis | CONTROL | Identify opportunity windows | trend_analysis |
| M-129 | Trend Scorer | analysis | CONTROL | Calculate trend quality | trend_analysis |

---

## 8. TREND_DETECTION_FRAMEWORK

### Signal Strength Categories

```
SIGNAL_SOURCES:
  Google Trends      → General population search behavior
  YouTube Trending   → Video engagement peaks
  Reddit Threads     → Community discussion volume
  X/Twitter Signals  → Real-time social mention spikes
  TikTok Trends      → Viral short-form content patterns
  News APIs          → Media coverage intensity

SIGNAL_WEIGHTS (reliability-based):
  High_Reliability   → +0.25 weight (Google Trends, YouTube)
  Medium_Reliability → +0.15 weight (Reddit, X)
  Niche_Indicators   → +0.10 weight (TikTok for short-form)
```

### Pattern Discovery Standard

```
PATTERN_TYPES:
  Cyclical Patterns    → Recurring on regular schedule (daily, weekly, seasonal)
  Cascading Patterns   → One trend triggers another predictably
  Momentum Patterns    → Rising/declining at predictable rates
  Seasonal Patterns    → Time-of-year driven (holidays, seasons, events)
  Anomalous Patterns   → Unexpected but reproducible (viral moments)
```

### Forecast Methodology

```
FORECAST_HORIZON:
  7-day forecast   → High confidence (pattern extrapolation)
  14-day forecast  → Medium confidence (broader trends)
  30-day forecast  → Low confidence (assumption-heavy)
  90+ day forecast → Not recommended (too much uncertainty)

CONFIDENCE_ADJUSTMENT:
  - Reduce confidence -10% per week beyond 7-day window
  - Reduce confidence -20% if competing trends detected
  - Reduce confidence -15% if anomalies present
  - Boost confidence +10% if multiple independent patterns confirm
```

---

## 9. FAILURE SURFACES & RECOVERY

| Failure_Type | Detection_Signal | Recovery_Path | Fallback_Director | SLA |
|-------------|------------------|---------------|-------------------|-----|
| Weak signal detection | Multiple sources disagree | Mark as low-confidence, increase monitoring | Parashara (retry) | <60s |
| Pattern validation failure | Pattern doesn't predict | Update pattern reliability, rebuild forecast | Parashara (reanalyze) | <60s |
| Forecast accuracy low | Predicted peak doesn't occur | Adjust model parameters, lower future confidence | Parashara (calibration) | <120s |
| Anomaly false positive | Flagged anomaly is noise | Increase anomaly threshold, reduce sensitivity | Parashara (tuning) | <45s |
| Audience misalignment | Trend irrelevant to audience | Flag for low priority, continue monitoring | Parashara (context) | <30s |
| Research conflict | Trend contradicts verified facts | Escalate to Valmiki for fact clarification | Valmiki (validation) | <60s |
| Competitive saturation | Opportunity window closes | Identify next viable trend signal | Parashara (next trend) | <90s |

---

## 10. EXECUTION TIERS

**TIER_1 (FULL TREND ANALYSIS)**
- All 8 trend skills active
- Real-time monitoring of 6+ sources
- Pattern discovery across 50+ historical topics
- 30-day forecasting with scenario analysis
- Anomaly detection on all signals
- Audience alignment assessment
- Cost: Baseline (high monitoring cost)
- Use case: Flagship timely content, fast-track opportunities

**TIER_2 (STANDARD TREND ANALYSIS)**
- 6/8 skills active (skip M-126, M-129)
- 3-4 source monitoring (major signals only)
- Pattern discovery on 20+ recent topics
- 7-14 day forecasting
- Anomaly detection on major breaks only
- Basic audience alignment
- Cost: 70% of TIER_1
- Use case: Regular timely content

**TIER_3 (FAST TREND ANALYSIS)**
- 4/8 skills active (M-123, M-125, M-128, M-129)
- Top 2 source monitoring only
- Pattern discovery on 5 most recent topics
- 7-day forecasting only
- No anomaly detection
- No audience alignment check
- Cost: 40% of TIER_1
- Use case: Emergency fast-track topics

### Degradation Trigger
```
IF analysis_time_remaining < estimated_time_needed:
  DEGRADE to lower tier (TIER_1 → TIER_2 → TIER_3)
  ADJUST signal_coverage accordingly
  ESCALATE urgency to Narada
```

---

## 11. HITL TRIGGERS (Manual Intervention)

| Trigger_Type | Condition | Escalation_Path | Required_Action | Time_Limit |
|-------------|-----------|-----------------|-----------------|-----------|
| Weak Signal | Quality_score 40-60 | Parashara + Chanakya | Decide: proceed with caution or skip trend | 30 min |
| Pattern Break | Established pattern fails | Parashara + analyst | Investigate cause + update model | 45 min |
| Forecast Miss | Predicted peak didn't occur | Parashara + Narada | Analyze why model failed | 60 min |
| Rapid Saturation | Opportunity window closes fast | Parashara + Chanakya | Accelerate decision or pivot | 15 min |
| Competing Trends | Multiple trends peaking simultaneously | Parashara + Chanakya + Shakti | Prioritize or create multi-topic content | 30 min |
| Audience Mismatch | Strong trend, zero audience interest | Parashara + creator | Decide: educate audience or skip | 30 min |

---

## 12. DASHBOARD_VISIBILITY & TELEMETRY

### Public Fields (Creator Dashboard)
- **Active_Trends**: Count of detected trends currently rising
- **Strongest_Opportunity**: Top-ranked trend + quality score
- **Optimal_Timing_Window**: Date range for best content timing
- **Pattern_Confidence**: % confidence in forecast
- **Audience_Alignment**: 0-100 alignment with creator audience
- **Competitive_Window**: Days until saturation estimated
- **Signal_Strength**: Overall signal confidence 0-100

### Audit-Only Fields (Governance Visible)
- **Source_Breakdown**: Signal strength per source (Google, YouTube, Reddit, etc.)
- **Pattern_History**: Patterns discovered and their accuracy
- **Forecast_Accuracy**: Historical prediction accuracy %
- **Anomaly_Log**: Detected anomalies and their validity
- **Model_Parameters**: Current trend detection thresholds
- **Forecast_Scenarios**: Upside/downside case analysis
- **Competitive_Analysis**: Competitor coverage by trend

---

## 13. CRITICAL AMBIGUITIES

| Ambiguity | Current State | Resolution | Owner |
|-----------|--------------|-----------|-------|
| Minimum sources required | 3+ | Confirm whether all trends need 3+ sources | Parashara |
| Forecast confidence minimum | 50% | Define minimum confidence for actionable forecast | Chanakya |
| Pattern accuracy threshold | Historical accuracy | Define when pattern becomes unreliable (% accuracy drop) | Parashara |
| Audience alignment weighting | 20% | Confirm whether audience matters equally to signal strength | Creator |
| Competitive saturation signal | Monitor continuously | Define saturation threshold (% competitor coverage = too late?) | Narada |
| Time zone handling | Not defined | Confirm how global trends handled across time zones | Narada |

---

## 14. ACCEPTANCE CRITERIA (DEPLOYMENT GATE)

✅ **READY FOR DEPLOYMENT IF**:
- [ ] All 8 trend skills callable and tested
- [ ] Real-time signal ingestion working (6+ sources)
- [ ] Trend detection algorithm functional
- [ ] Pattern discovery working on historical data
- [ ] Forecast engine tested against past trends
- [ ] Anomaly detection working
- [ ] Audience alignment scoring functional
- [ ] Competitive gap analysis working
- [ ] Quality scoring calculation verified
- [ ] All HITL triggers functional
- [ ] Integration with Narada (data feed input) tested
- [ ] Integration with Chanakya (trend → opportunity scoring) tested

---

## 15. RELEASE BLOCKING STATUS

**RELEASE_BLOCKING: FALSE** (trend analysis is enhancement)

System works without Parashara (topic selection can be manual), but significantly better with real-time trend detection. Parashara enables fast-track content that capitalizes on emerging opportunities.

---

## 16. OPERATIONAL NOTES

- **Created**: 2026-04-21
- **Status**: SPECIFICATION COMPLETE
- **Testing Priority**: MEDIUM (enhancement for timely content)
- **Next Step**: Integration with Narada (data feed) and Chanakya (opportunity scoring)
- **Real-Time Requirement**: Must process signals within 60 seconds of market change detection
- **Continuous Monitoring**: Runs 24/7 to detect emerging trends early
