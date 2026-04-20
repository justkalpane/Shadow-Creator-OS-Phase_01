# E-602 Feedback Analyst

## 1. Skill Identity
- **Skill ID:** E-602
- **Name:** Feedback Analyst
- **Category:** Analytics & Evolution (WF-600)
- **Classification:** Analytical Skill
- **Owner Director:** Chandra (Audience Intelligence Authority)
- **Supporting Director:** Yama (Policy & Sentiment Governance)
- **Version:** 1.0.0
- **Status:** Active

---

## 2. Purpose
Analyze audience feedback, comments, and engagement signals from all platforms to extract sentiment distribution, identify primary themes/concerns, detect praise patterns, classify feedback by intent, and generate actionable audience intelligence. Transform raw feedback into structured sentiment and thematic understanding.

**Strategic Role:** Feedback Analyst is the voice-of-audience function in the analytics pipeline. It processes qualitative feedback signals into quantitative sentiment metrics and thematic insights that inform content strategy evolution.

---

## 3. DNA Injection

### Role
- **Primary Role:** Analytical Skill - Feedback Processing & Sentiment Intelligence
- **Behavioral Mode:** Deterministic analysis with rule-based sentiment classification
- **Operating Model:** Passive analyzer - consumes audience_feedback_packet, produces feedback_insight_packet

### Governance Identity
- **Jurisdiction:** Audience Analytics - Feedback & Sentiment Domain
- **Authority Level:** Non-veto (produces insights; decisions made by CWF-630)
- **Escalation Trigger:** Negative sentiment > 35% or critical_policy_violations detected
- **Fallback Mode:** Return neutral sentiment distribution rather than hallucinate sentiment scores
- **Always-On Guardian:** Yama monitors policy compliance; Chitragupta tracks lineage

---

## 4. Workflow Injection

### Producer Relationship
- **Triggered By:** CWF-620 (Audience Feedback Aggregator)
- **Input Packet:** `audience_feedback_packet` (schema v1.0.0)
  - Contains: platform_feedback (total_comments, sentiment_distribution, top_themes)
  - Contains: quality indicators (feedback_completeness, sentiment_accuracy)

### Consumer Relationship
- **Consumed By:** CWF-630 (Evolution Signal Synthesizer)
- **Output Packet:** `feedback_insight_packet` (schema v1.0.0)
  - Contains: sentiment_analysis, theme_extraction, audience_intent_classification, policy_compliance

### Vein Navigation
- **Vein:** analytics_vein
- **Reads From:** dossier.analytics (current + historical feedback)
- **Writes To:** dossier.analytics.feedback_insights (append_to_array only)
- **Upstream:** CWF-620 (trigger)
- **Downstream:** CWF-630 (input to signal synthesis)
- **Error Path:** WF-900 (escalation on policy violation or data quality failure)

---

## 5. Inputs

### Primary Input: audience_feedback_packet
```json
{
  "instance_id": "AFB-{timestamp}",
  "artifact_family": "audience_feedback_packet",
  "payload": {
    "evidence": {
      "platform_feedback": {
        "youtube": {
          "total_comments": 345,
          "sentiment_distribution": {
            "positive": 215,
            "neutral": 95,
            "negative": 35
          },
          "top_themes": ["hook-strength", "pacing", "relevance"]
        },
        "instagram": {
          "total_comments": 198,
          "sentiment_distribution": {
            "positive": 156,
            "neutral": 32,
            "negative": 10
          },
          "top_themes": ["inspiration", "actionable", "clear-call-to-action"]
        }
      }
    },
    "quality": {
      "feedback_completeness": 0.92,
      "sentiment_accuracy": 0.88
    }
  }
}
```

### Secondary Input: Historical Context
- Dossier namespace: `dossier.analytics.feedback_history` (last 5 feedback snapshots)
- Policy reference: `dossier.governance.content_policy` (brand safety, moderation rules)

### Execution Context
- `dossier_id`: Unique identifier for current content/narrative
- `analysis_period`: Time window for feedback collection
- `platform_list`: Platforms to analyze (youtube, instagram, etc.)

---

## 6. Execution Logic

### Step 1: Validate Input Quality
```
IF audience_feedback_packet.payload.quality.feedback_completeness < 0.75
  THEN escalate to WF-900 with error code SE-P1-007-LOW_FEEDBACK_QUALITY
IF audience_feedback_packet.payload.quality.sentiment_accuracy < 0.75
  THEN log warning, proceed with caution_mode (confidence caps at 0.80)
```

### Step 2: Extract Sentiment Distribution
For each platform in audience_feedback_packet.payload.evidence.platform_feedback:
- Extract: total_comments, sentiment_distribution (positive, neutral, negative counts)
- Calculate sentiment ratios: positive%, neutral%, negative%
- Store as: platform_sentiment_vector

```
sentiment_ratio = {
  positive: platform_feedback[platform].sentiment_distribution.positive / total_comments,
  neutral: platform_feedback[platform].sentiment_distribution.neutral / total_comments,
  negative: platform_feedback[platform].sentiment_distribution.negative / total_comments
}
```

### Step 3: Fetch Historical Feedback Context
Query dossier.analytics.feedback_history:
- Last 5 feedback snapshots (or available)
- Same platforms only
- Calculate sentiment trend (improving, stable, declining)

### Step 4: Analyze Sentiment Trajectory
```
FOR EACH platform:
  current_sentiment = current snapshot sentiment_ratio
  historical_avg = average sentiment_ratio of last 5 snapshots
  
  IF current_sentiment.positive > historical_avg.positive * 1.10
    sentiment_trend = "improving_positivity"
    confidence = 0.85
  ELSE IF current_sentiment.negative > historical_avg.negative * 1.15
    sentiment_trend = "declining_sentiment"
    confidence = 0.85
    escalation_trigger = true (if negative% > 0.35)
  ELSE
    sentiment_trend = "stable"
    confidence = 0.90
```

### Step 5: Classify Overall Sentiment Health
```
aggregate_positive = SUM(positive) / SUM(total_comments across all platforms)
aggregate_negative = SUM(negative) / SUM(total_comments)

IF aggregate_positive > 0.60
  sentiment_health = "strong_positive"
  health_confidence = 0.88
ELSE IF aggregate_positive > 0.45
  sentiment_health = "mixed_positive"
  health_confidence = 0.85
ELSE IF aggregate_positive > 0.30
  sentiment_health = "mixed_negative"
  health_confidence = 0.82
ELSE
  sentiment_health = "concerning_negative"
  health_confidence = 0.85
  escalation_trigger = true
```

### Step 6: Extract Theme Analysis
For each platform, extract top_themes from audience_feedback_packet:
```
themes = platform_feedback[platform].top_themes (pre-aggregated by CWF-620)

FOR EACH theme:
  theme_category = classify_theme_intent(theme)
    // intent: praise | concern | question | request | criticism | suggestion
  theme_frequency = estimate_theme_prevalence(theme) // low/medium/high
  theme_importance = prioritize_theme(theme, sentiment_context)
```

### Step 7: Detect Theme Patterns
```
praise_themes = [themes where intent=praise]
concern_themes = [themes where intent=concern OR intent=criticism]
request_themes = [themes where intent=request OR intent=suggestion]

pattern = {
  primary_praise: most_frequent(praise_themes),
  primary_concern: most_frequent(concern_themes),
  primary_request: most_frequent(request_themes),
  pattern_consistency: measure_across_platforms()
}
```

### Step 8: Classify Audience Intent Distribution
```
intent_distribution = {
  praise_seeking: calculate_ratio(praise_themes),
  problem_reporting: calculate_ratio(concern_themes),
  help_seeking: calculate_ratio(request_themes),
  engagement: calculate_ratio(question_themes),
  other: remaining
}

dominant_intent = intent_distribution key with highest ratio
```

### Step 9: Policy Compliance Check
Query dossier.governance.content_policy for:
- Banned topics/keywords
- Moderation rules
- Brand safety constraints

```
FOR EACH feedback comment (if available):
  IF comment contains banned_keyword
    policy_violation = true
    severity = "critical"
    escalation_trigger = true
  ELSE IF comment triggers moderation_rule
    policy_violation = true
    severity = "warning"
```

### Step 10: Generate Engagement Opportunity Analysis
```
high_engagement_themes = themes with high frequency AND high positive sentiment
opportunity_themes = themes where requests cluster
risk_themes = themes with high negative sentiment concentration

recommendations = {
  amplify: high_engagement_themes (lean into these in future content),
  address: risk_themes (mitigate concerns),
  act_on: opportunity_themes (fulfill requests in next cycle)
}
```

### Step 11: Emit Feedback Insight Packet
Construct feedback_insight_packet with all analyses above, confidence scores, escalation flags, and lineage.

---

## 7. Outputs

### Primary Output: feedback_insight_packet
```json
{
  "instance_id": "FIP-{timestamp}",
  "artifact_family": "feedback_insight_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-630-via-E-602",
  "dossier_ref": "{dossier_id}",
  "created_at": "{ISO8601_timestamp}",
  "status": "CREATED",
  "payload": {
    "narrative": {
      "analysis_period": "24h",
      "platforms_analyzed": 2,
      "total_comments_analyzed": 543,
      "snapshot_count": 5
    },
    "context": {
      "sourced_from_packet_id": "AFB-{timestamp}",
      "historical_baseline": "5-snapshot-average",
      "policy_check_completed": true
    },
    "evidence": {
      "sentiment_analysis": {
        "youtube": {
          "positive_ratio": 0.624,
          "neutral_ratio": 0.275,
          "negative_ratio": 0.101,
          "sentiment_trend": "stable",
          "confidence": 0.85
        },
        "instagram": {
          "positive_ratio": 0.788,
          "neutral_ratio": 0.162,
          "negative_ratio": 0.051,
          "sentiment_trend": "stable",
          "confidence": 0.87
        }
      },
      "sentiment_health": {
        "aggregate_positive": 0.696,
        "aggregate_negative": 0.083,
        "overall_health": "strong_positive",
        "health_confidence": 0.88,
        "trend_direction": "stable_strong"
      },
      "theme_extraction": {
        "primary_themes": [
          {
            "theme": "hook-strength",
            "intent": "praise",
            "frequency": "high",
            "platforms": ["youtube"],
            "prevalence_estimate": 0.18
          },
          {
            "theme": "pacing",
            "intent": "concern",
            "frequency": "medium",
            "platforms": ["youtube", "instagram"],
            "prevalence_estimate": 0.12
          },
          {
            "theme": "call-to-action",
            "intent": "request",
            "frequency": "medium",
            "platforms": ["instagram"],
            "prevalence_estimate": 0.10
          }
        ],
        "theme_consistency_score": 0.78
      },
      "audience_intent": {
        "praise_seeking": 0.42,
        "problem_reporting": 0.15,
        "help_seeking": 0.18,
        "engagement": 0.20,
        "other": 0.05,
        "dominant_intent": "praise_seeking"
      },
      "policy_compliance": {
        "policy_violations": 0,
        "risk_flags": 0,
        "critical_issues": 0,
        "compliance_status": "COMPLIANT"
      },
      "engagement_opportunities": {
        "amplify_themes": ["hook-strength", "inspiration", "relevance"],
        "address_themes": ["pacing", "clarity"],
        "act_on_themes": ["call-to-action", "actionable-next-steps"],
        "opportunity_window": "high"
      }
    },
    "quality": {
      "input_feedback_completeness": 0.92,
      "sentiment_accuracy": 0.88,
      "analysis_confidence": 0.85,
      "policy_check_confidence": 1.0
    },
    "status": {
      "feedback_analyzed": true,
      "sentiment_quantified": true,
      "themes_extracted": true,
      "policy_checked": true,
      "escalation_required": false,
      "next_stage": "CWF-630_signal_synthesis"
    }
  }
}
```

### Schema Reference
**Schema Name:** `feedback_insight_packet` (v1.0.0)
**Location:** `schemas/analytics/feedback_insight_packet.schema.yaml`

### Dossier Mutation
```json
{
  "namespace": "analytics",
  "mutation_type": "append_to_array",
  "target": "dossier.analytics.feedback_insights",
  "value": {
    "packet_id": "{FIP instance_id}",
    "insights": {sentiment_analysis, sentiment_health, theme_extraction, audience_intent, opportunities},
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
- **Can Escalate:** Yes - if negative sentiment > 35% or policy_violations detected
- **Can Fallback:** Yes - returns conservative neutral sentiment distribution

### Approval Gates
- **Approval Required:** No
- **Escalation Required:** If sentiment health = "concerning_negative" OR compliance_status != "COMPLIANT"
- **Escalation Path:** WF-900 (error routing)

### Ownership & Lineage
- **Owner:** Chandra (Audience Intelligence Authority)
- **Policy Guardian:** Yama (sentiment & policy governance)
- **Audit Guardian:** Chitragupta (lineage tracking)
- **Approved By:** (Self-service, no approval gate)

### Governance Rules
1. **Sentiment Integrity:** Never hallucinate sentiment; escalate if accuracy < 0.75
2. **Confidence Calibration:** Report all sentiment analyses with explicit confidence (0.0-1.0)
3. **Policy Enforcement:** Escalate all policy violations immediately; don't suppress
4. **Sentiment Thresholds:** Escalate if negative sentiment > 35% (Yama override level)
5. **Theme Authenticity:** Extract only themes pre-aggregated by CWF-620; don't invent

---

## 9. Tool & Runtime Usage

### Allowed Tools
- n8n Code Node (JavaScript): Sentiment ratio calculation, theme classification, intent analysis
- n8n Dossier Read: Query historical feedback, policy compliance rules
- Logging: Chitragupta audit trail (every analysis step)
- String matching: Policy compliance keyword/rule matching

### Forbidden Tools
- External sentiment APIs (use rule-based classification only)
- ML sentiment models (deterministic analysis only)
- Hallucination (never generate synthetic feedback or sentiment)
- Tone/style inference (classify only on themes and stated intent)

### Environment Assumptions
- Dossier storage available
- Historical feedback snapshots retained (last 30 days)
- Content policy document in dossier.governance
- Audience intent classification rules available

---

## 10. Mutation Law

### Permitted Mutations
- **Append to:** `dossier.analytics.feedback_insights` (array append only)
- **Read from:** `dossier.analytics.feedback_history`, `dossier.governance.content_policy`
- **Never Overwrite:** Any existing dossier field

### Forbidden Mutations
- Delete or modify existing feedback_history
- Overwrite or modify content_policy
- Write to namespaces outside analytics
- Suppress or modify policy violations

### Audit Requirements
Every mutation includes:
```json
{
  "audit_entry": {
    "timestamp": "{ISO8601}",
    "skill_id": "E-602",
    "operation": "ANALYZE_AUDIENCE_FEEDBACK",
    "source_packet_id": "{AFB instance_id}",
    "lineage_intact": true,
    "policy_violations_detected": false
  }
}
```

---

## 11. Best Practices

### Sentiment Analysis Quality
1. **Use aggregated distribution:** Work with sentiment counts from CWF-620; don't re-analyze raw comments
2. **Calculate ratios:** positive% = positive_count / total_comments (not averages)
3. **Historical context:** Always compare against 5-snapshot baseline
4. **Trend detection:** Identify improving vs. declining sentiment separately per platform
5. **Confidence calibration:** Rule-based = 0.85-0.90 confidence; lower if quality_input < 0.85

### Theme Extraction
1. **Use pre-aggregated themes:** CWF-620 provides top_themes; classify intent, don't re-extract
2. **Intent classification:** Map themes to: praise | concern | question | request | criticism | suggestion
3. **Cross-platform patterns:** Identify themes appearing on multiple platforms (higher priority)
4. **Frequency estimation:** Use feedback_completeness to extrapolate from sample
5. **Novel themes:** Flag emerging themes (not in historical feedback) for escalation

### Audience Intent Analysis
1. **Six intents:** Praise-seeking, problem-reporting, help-seeking, engagement, other
2. **Dominant intent:** Report the single most prevalent intent
3. **Distribution fairness:** Allocate all themes to one intent; percentages sum to 1.0
4. **Intent stability:** Compare against historical intent distributions (5-snapshot baseline)
5. **Intent shifts:** Flag if dominant intent changes from previous snapshot

### Policy Compliance
1. **Use dossier policy:** Read dossier.governance.content_policy for brand safety rules
2. **Escalate violations:** All violations escalate to WF-900 with severity
3. **Document violations:** Include violation details in escalation (which platform, comment keyword)
4. **Moderation scope:** Check for banned topics, brand safety, explicit content rules only
5. **False positives:** Be conservative; escalate questionable cases rather than suppress

### Engagement Opportunity Detection
1. **Amplify high-sentiment themes:** Themes with high frequency AND high positive sentiment
2. **Address concerns:** Themes with negative sentiment concentration
3. **Act on requests:** Themes classified as "request" intent
4. **Opportunity window:** Flag if multiple amplify/address/act_on themes detected (high opportunity)
5. **Timing:** Recommend prioritization (short-term quick fixes vs. long-term strategic)

---

## 12. Validation & Done Criteria

### Validation Checklist (12-Point)
1. ✓ Input packet schema valid (audience_feedback_packet v1.0.0)
2. ✓ Data quality >= 0.75 or escalate
3. ✓ Sentiment distribution extracted (positive/neutral/negative ratios calculated)
4. ✓ Sentiment health classified (strong_positive/mixed/concerning)
5. ✓ Historical context fetched (5-snapshot baseline available)
6. ✓ Sentiment trend identified (improving/stable/declining)
7. ✓ Themes extracted and intent classified (praise/concern/request/etc.)
8. ✓ Theme cross-platform consistency calculated
9. ✓ Audience intent distribution computed and dominant identified
10. ✓ Policy compliance check completed (violations documented)
11. ✓ Engagement opportunities identified (amplify/address/act_on lists)
12. ✓ Output packet schema valid (feedback_insight_packet v1.0.0)

### Done Criteria
- [ ] Sentiment analysis completed for all platforms
- [ ] Sentiment health classified with confidence >= 0.85
- [ ] Themes extracted with intent classification
- [ ] Policy compliance check completed (escalate if violations found)
- [ ] feedback_insight_packet emitted with full lineage
- [ ] Dossier mutation recorded with audit entry
- [ ] No hallucinated sentiment scores or fake themes
- [ ] Escalation triggered if negative sentiment > 35%

### Test References
- `tests/analytics/E-602-feedback-analyst.test.js`
- Test data: `tests/fixtures/audience_feedback_packet.json` (sample AFB with 5 snapshots)
- Policy fixtures: `tests/fixtures/content_policy.json`

---

## 13. Skill Evolution & Notes

### Known Limitations
- Rule-based sentiment only (no NLP models)
- Themes pre-aggregated by CWF-620 (no comment-level parsing)
- Intent classification uses keyword matching (not semantic)
- Policy checks limited to keyword/rule matching (no context understanding)

### Future Enhancements
- NLP-based sentiment analysis (Phase 2)
- Comment-level topic modeling (Phase 2)
- Semantic intent understanding (Phase 3)
- Predictive sentiment trends (Phase 3)

### Dependency Chain
- **Depends On:** CWF-620 (feedback aggregation), Yama (policy), Chitragupta (audit), dossier.analytics (historical data)
- **Depended On By:** CWF-630 (evolution synthesis)
- **Related Skills:** E-601 (performance analyst), E-603 (evolution strategist)
