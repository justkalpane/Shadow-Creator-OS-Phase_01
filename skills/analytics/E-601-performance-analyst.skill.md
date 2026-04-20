# E-601 Performance Analyst

## 1. Skill Identity
- **Skill ID:** E-601
- **Name:** Performance Analyst
- **Category:** Analytics & Evolution (WF-600)
- **Classification:** Analytical Skill
- **Owner Director:** Chandra (Audience Intelligence Authority)
- **Supporting Director:** Chitragupta (Audit & Lineage)
- **Version:** 1.0.0
- **Status:** Active

---

## 2. Purpose
Analyze performance metrics from all platforms and generate actionable insights on engagement trends, audience reach patterns, content efficacy, and growth trajectory. Detect performance deltas, identify breakpoints in audience engagement, and classify metrics against historical benchmarks.

**Strategic Role:** Performance Analyst is the evidence-gathering function in the analytics pipeline. It transforms raw platform metrics into structured performance intelligence that informs content evolution decisions.

---

## 3. DNA Injection

### Role
- **Primary Role:** Analytical Skill - Metrics Processing & Insight Generation
- **Behavioral Mode:** Deterministic analysis with threshold-based classification
- **Operating Model:** Passive analyzer - consumes performance_analytics_packet, produces performance_insight_packet

### Governance Identity
- **Jurisdiction:** Audience Analytics - Performance Domain
- **Authority Level:** Non-veto (produces insights; decisions made by CWF-630)
- **Escalation Trigger:** Data quality < 0.75 or anomaly detection confidence < 0.70
- **Fallback Mode:** Return conservative (low-confidence) analysis rather than hallucinate metrics
- **Always-On Guardian:** Chitragupta monitors audit trail

---

## 4. Workflow Injection

### Producer Relationship
- **Triggered By:** CWF-610 (Performance Metrics Collector)
- **Input Packet:** `performance_analytics_packet` (schema v1.0.0)
  - Contains: platform_metrics (views, engagement_rate, watch_time, shares, comments)
  - Contains: quality indicators (data_completeness, platform_coverage)

### Consumer Relationship
- **Consumed By:** CWF-630 (Evolution Signal Synthesizer)
- **Output Packet:** `performance_insight_packet` (schema v1.0.0)
  - Contains: engagement_trends, reach_analysis, efficacy_classification, growth_trajectory
  - Contains: anomalies_detected, threshold_violations, benchmark_comparisons

### Vein Navigation
- **Vein:** analytics_vein
- **Reads From:** dossier.analytics (current + historical performance snapshots)
- **Writes To:** dossier.analytics.performance_insights (append_to_array only)
- **Upstream:** CWF-610 (trigger)
- **Downstream:** CWF-630 (input to signal synthesis)
- **Error Path:** WF-900 (escalation on data quality failure)

---

## 5. Inputs

### Primary Input: performance_analytics_packet
```json
{
  "instance_id": "PAP-{timestamp}",
  "artifact_family": "performance_analytics_packet",
  "payload": {
    "evidence": {
      "platform_metrics": {
        "youtube": { "views": 1500, "engagement_rate": 0.08, "watch_time_hours": 45, "shares": 120, "comments_count": 89 },
        "instagram": { "views": 2100, "engagement_rate": 0.12, "watch_time_hours": 22, "shares": 210, "comments_count": 156 }
      }
    },
    "quality": {
      "data_completeness": 1.0,
      "platform_coverage": 0.50
    }
  }
}
```

### Secondary Input: Historical Context
- Dossier namespace: `dossier.analytics.performance_snapshots` (last 7 snapshots for trend calculation)
- Benchmark data: `dossier.analytics.performance_benchmarks` (industry standards per platform)

### Execution Context
- `dossier_id`: Unique identifier for current content/narrative
- `analysis_period`: Time window for metrics (e.g., "24h", "7d", "30d")
- `baseline_mode`: Compare against "industry_standard" or "own_historical"

---

## 6. Execution Logic

### Step 1: Validate Input Quality
```
IF performance_analytics_packet.payload.quality.data_completeness < 0.75
  THEN escalate to WF-900 with error code SE-P1-006-LOW_DATA_QUALITY
IF performance_analytics_packet.payload.quality.platform_coverage < 0.25
  THEN log warning, proceed with low_coverage_mode
```

### Step 2: Extract Platform Metrics
For each platform in performance_analytics_packet.payload.evidence.platform_metrics:
- Extract: views, engagement_rate, watch_time_hours, shares, comments_count
- Store as: platform_performance_vector

### Step 3: Fetch Historical Snapshots
Query dossier.analytics.performance_snapshots:
- Last 7 days (or available)
- Same platforms only
- Calculate trend vectors (upward, stable, downward)

### Step 4: Detect Engagement Trends
```
FOR EACH platform:
  recent_performance = current snapshot metrics
  historical_avg = average of last 7 snapshots
  
  IF recent_performance.views > historical_avg * 1.15
    trend = "upward_momentum"
    confidence = calculate_statistical_confidence(recent_performance, historical_avg)
  ELSE IF recent_performance.views < historical_avg * 0.85
    trend = "declining_engagement"
    confidence = calculate_statistical_confidence(recent_performance, historical_avg)
  ELSE
    trend = "stable"
    confidence = 0.90
```

### Step 5: Classify Engagement Efficacy
```
engagement_ratio = SUM(comments_count + shares) / views

IF engagement_ratio > 0.10
  efficacy = "high_engagement"
  classification_confidence = 0.88
ELSE IF engagement_ratio > 0.05
  efficacy = "moderate_engagement"
  classification_confidence = 0.82
ELSE
  efficacy = "low_engagement"
  classification_confidence = 0.75
```

### Step 6: Analyze Reach Pattern
```
reach_breadth = platform_coverage (platform count / 4)
reach_depth = SUM(views across platforms)

IF reach_depth > historical_avg * 1.25 AND reach_breadth >= 0.5
  pattern = "broad_high_reach"
ELSE IF reach_depth > historical_avg AND reach_breadth < 0.5
  pattern = "concentrated_reach"
ELSE IF reach_depth <= historical_avg AND reach_breadth >= 0.5
  pattern = "dispersed_modest_reach"
ELSE
  pattern = "low_dispersed_reach"
```

### Step 7: Calculate Growth Trajectory
```
growth_rate = (current_week_views - previous_week_views) / previous_week_views

IF growth_rate > 0.25
  trajectory = "accelerating_growth"
  trajectory_confidence = 0.85
ELSE IF growth_rate > 0.05
  trajectory = "modest_positive_growth"
  trajectory_confidence = 0.80
ELSE IF growth_rate >= -0.10
  trajectory = "stable_with_minor_fluctuation"
  trajectory_confidence = 0.75
ELSE
  trajectory = "declining_momentum"
  trajectory_confidence = 0.82
```

### Step 8: Detect Anomalies
```
FOR EACH metric (views, engagement_rate, watch_time, shares):
  IF metric > historical_avg + (2 * std_deviation)
    anomaly = "positive_spike"
    severity = "high"
    spike_analysis = correlate_with_external_factors (e.g., promotion, timing)
  ELSE IF metric < historical_avg - (2 * std_deviation)
    anomaly = "negative_decline"
    severity = "high"
```

### Step 9: Compare Against Benchmarks
```
IF dossier.analytics.performance_benchmarks exists:
  FOR EACH platform AND metric:
    IF current_metric > benchmark + 0.15
      vs_benchmark = "exceeding"
    ELSE IF current_metric >= benchmark * 0.85
      vs_benchmark = "meeting"
    ELSE
      vs_benchmark = "below_benchmark"
```

### Step 10: Emit Performance Insight Packet
Construct performance_insight_packet with all analyses above, confidence scores, and source lineage.

---

## 7. Outputs

### Primary Output: performance_insight_packet
```json
{
  "instance_id": "PIP-{timestamp}",
  "artifact_family": "performance_insight_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-630-via-E-601",
  "dossier_ref": "{dossier_id}",
  "created_at": "{ISO8601_timestamp}",
  "status": "CREATED",
  "payload": {
    "narrative": {
      "analysis_period": "24h",
      "platforms_analyzed": 2,
      "snapshot_count": 7
    },
    "context": {
      "sourced_from_packet_id": "PAP-{timestamp}",
      "historical_baseline": "7-day-average",
      "benchmark_model": "industry_standard"
    },
    "evidence": {
      "engagement_trends": {
        "youtube": {
          "trend": "upward_momentum",
          "confidence": 0.85,
          "delta_vs_baseline": "+18%",
          "velocity": "accelerating"
        },
        "instagram": {
          "trend": "stable",
          "confidence": 0.90,
          "delta_vs_baseline": "+2%",
          "velocity": "stable"
        }
      },
      "reach_analysis": {
        "pattern": "concentrated_reach",
        "breadth": 0.5,
        "depth": 3600,
        "multi_platform_coordination": 0.72
      },
      "efficacy_classification": {
        "overall": "moderate_high_engagement",
        "confidence": 0.83,
        "engagement_ratio": 0.087,
        "platform_breakdown": {
          "youtube": 0.092,
          "instagram": 0.116
        }
      },
      "growth_trajectory": {
        "rate": 0.18,
        "classification": "modest_positive_growth",
        "confidence": 0.80,
        "projected_7day": "3950 views"
      },
      "anomalies": [
        {
          "type": "positive_spike",
          "metric": "instagram_shares",
          "magnitude": 2.1,
          "sigma_deviation": 2.3,
          "severity": "high",
          "probable_cause": "timing_optimization"
        }
      ],
      "benchmark_comparison": {
        "youtube_views_vs_benchmark": "exceeding",
        "instagram_engagement_vs_benchmark": "meeting",
        "overall_positioning": "top_quartile"
      }
    },
    "quality": {
      "input_data_completeness": 1.0,
      "analysis_confidence": 0.83,
      "anomaly_detection_confidence": 0.79,
      "trend_statistical_validity": 0.85
    },
    "status": {
      "performance_analyzed": true,
      "insights_generated": true,
      "escalation_required": false,
      "next_stage": "CWF-630_feedback_synthesis"
    }
  }
}
```

### Schema Reference
**Schema Name:** `performance_insight_packet` (v1.0.0)
**Location:** `schemas/analytics/performance_insight_packet.schema.yaml`

### Dossier Mutation
```json
{
  "namespace": "analytics",
  "mutation_type": "append_to_array",
  "target": "dossier.analytics.performance_insights",
  "value": {
    "packet_id": "{PIP instance_id}",
    "insights": {engagement_trends, reach_analysis, efficacy, trajectory},
    "timestamp": "{ISO8601}"
  }
}
```

---

## 8. Governance

### Authority & Decision Rights
- **Authority Level:** Non-veto (advisory)
- **Can Approve:** No
- **Can Veto:** No
- **Can Escalate:** Yes - if data quality < 0.75 or anomaly confidence < 0.70
- **Can Fallback:** Yes - returns conservative low-confidence analysis

### Approval Gates
- **Approval Required:** No
- **Escalation Required:** If anomalies detected with severity=HIGH
- **Escalation Path:** WF-900 (error routing)

### Ownership & Lineage
- **Owner:** Chandra (Audience Intelligence Authority)
- **Guardian:** Chitragupta (Audit responsibility)
- **Approved By:** (Self-service, no approval gate)

### Governance Rules
1. **Data Integrity:** Never hallucinate missing metrics; escalate if quality < threshold
2. **Confidence Calibration:** Report all analyses with explicit confidence scores (0.0-1.0)
3. **Anomaly Reporting:** All anomalies with severity=HIGH must be escalated
4. **Baseline Fidelity:** Use only dossier-stored historical data; no external sources
5. **Benchmark Alignment:** Use benchmark_model from execution context; never override

---

## 9. Tool & Runtime Usage

### Allowed Tools
- n8n Code Node (JavaScript): Statistical calculations, trend analysis, confidence scoring
- n8n Dossier Read: Query historical performance_snapshots
- n8n Database Query: Access performance_benchmarks table
- Logging: Chitragupta audit trail (every analysis step)

### Forbidden Tools
- External APIs (no real-time platform data fetching)
- ML Models (use rule-based confidence; no black-box scoring)
- Hallucination (never generate synthetic metrics)

### Environment Assumptions
- Dossier storage available and accessible
- Historical snapshots retained for last 30 days
- Benchmark data pre-populated and maintained

---

## 10. Mutation Law

### Permitted Mutations
- **Append to:** `dossier.analytics.performance_insights` (array append only)
- **Read from:** `dossier.analytics.performance_snapshots`, `dossier.analytics.performance_benchmarks`
- **Never Overwrite:** Any existing dossier field

### Forbidden Mutations
- Delete or modify existing performance_snapshots
- Overwrite performance_benchmarks
- Write to namespaces outside analytics
- Modify governance metadata

### Audit Requirements
Every mutation includes:
```json
{
  "audit_entry": {
    "timestamp": "{ISO8601}",
    "skill_id": "E-601",
    "operation": "ANALYZE_PERFORMANCE_METRICS",
    "source_packet_id": "{PAP instance_id}",
    "lineage_intact": true
  }
}
```

---

## 11. Best Practices

### Data Quality Assurance
1. **Validate before analysis:** Check data_completeness >= 0.75
2. **Handle missing platforms:** Proceed with low_coverage_mode if needed, log warning
3. **Conservative confidence:** Report 0.75-0.85 confidence for rule-based analysis, not 0.99
4. **Anomaly documentation:** Always explain probable cause for detected anomalies

### Engagement Analysis
1. **Use multi-metric approach:** Don't rely on views alone; include engagement_ratio, shares, comments
2. **Normalize for platform:** YouTube watch_time != Instagram view duration; analyze separately
3. **Historical context:** Always compare against 7-day baseline, not absolutes
4. **Growth trajectory:** Project next 7-day performance; document uncertainty range

### Trend Detection
1. **Statistical rigor:** Use 2-sigma deviation for anomaly detection
2. **Confidence calibration:** Growth confidence depends on data points available
3. **Seasonal awareness:** Flag if analysis period includes known seasonal breaks
4. **Breakpoint analysis:** Identify if trend shift coincides with external events

### Benchmark Alignment
1. **Use execution context:** Respect baseline_mode (historical vs. industry)
2. **Platform-specific:** Compare YouTube metrics only against YouTube benchmarks
3. **Updated benchmarks:** Query latest benchmark data; don't cache
4. **Document gaps:** If benchmark unavailable, report as "unknown"

---

## 12. Validation & Done Criteria

### Validation Checklist (11-Point)
1. ✓ Input packet schema valid (performance_analytics_packet v1.0.0)
2. ✓ Data completeness >= 0.75 or escalate
3. ✓ All platform metrics extracted (views, engagement_rate, watch_time, shares, comments)
4. ✓ Historical snapshots fetched (7-day baseline available)
5. ✓ Engagement trends calculated with statistical confidence
6. ✓ Efficacy classification assigned (high/moderate/low)
7. ✓ Reach pattern identified (broad/concentrated/dispersed/low)
8. ✓ Growth trajectory calculated with projection
9. ✓ Anomalies detected and severity classified
10. ✓ Benchmark comparisons generated (exceeding/meeting/below)
11. ✓ Output packet schema valid (performance_insight_packet v1.0.0)

### Done Criteria
- [ ] Engagement trends synthesized for all platforms
- [ ] Performance efficacy classified with confidence >= 0.75
- [ ] Anomalies detected and escalated if severity=HIGH
- [ ] performance_insight_packet emitted with full lineage
- [ ] Dossier mutation recorded with audit entry
- [ ] Confidence scores on all analyses
- [ ] No hallucinated metrics

### Test References
- `tests/analytics/E-601-performance-analyst.test.js`
- Test data: `tests/fixtures/performance_analytics_packet.json` (sample PAP with 7 snapshots)
- Mock benchmarks: `tests/fixtures/performance_benchmarks.json`

---

## 13. Skill Evolution & Notes

### Known Limitations
- Rule-based analysis only (no ML models)
- Platform-specific metrics must be normalized by caller
- Seasonal adjustments not automatic (must be in benchmark data)
- Growth projection uses simple linear extrapolation (±15% variance expected)

### Future Enhancements
- Machine learning anomaly detection (Phase 2)
- Seasonal decomposition (Phase 2)
- Cross-content correlation analysis (Phase 3)
- Predictive engagement modeling (Phase 3)

### Dependency Chain
- **Depends On:** CWF-610 (metrics collection), Chitragupta (audit), dossier.analytics (historical data)
- **Depended On By:** CWF-630 (evolution synthesis)
- **Related Skills:** E-602 (feedback analyst), E-603 (evolution strategist)
