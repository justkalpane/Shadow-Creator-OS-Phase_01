# SKL-PH1-GLOBAL-TREND-SCANNER

## 1. Skill Identity
- **Skill ID:** M-001
- **Skill Name:** Global Trend Scanner
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-CWF-110-Topic-Discovery
- **Consumer Workflows:** SE-N8N-CWF-110-Topic-Discovery, SE-N8N-CWF-120-Topic-Qualification
- **Vein/Route/Stage:** discovery_vein / topic_to_script / Stage_B_Discovery

## 2. Purpose
Runtime-ready canonical skill artifact for M-001 (Global Trend Scanner). This specification follows repository DNA law and enforces deterministic execution, packet lineage, governance-safe escalation, and patch-only mutation discipline.

## 3. DNA Injection
- **Role Definition:** global-trend-scanner_executor
- **DNA Archetype:** Narada (seer of broad pattern landscapes)
- **Behavior Model:** deterministic, registry-bound, escalation-safe
- **Operating Method:** ingest -> validate -> execute -> emit -> index
- **Working Style:** evidence-first, schema-locked, replay-aware

## 4. Workflow Injection
- **Producer:** WF
- **Direct Consumers:** SE-N8N-CWF-110-Topic-Discovery, SE-N8N-CWF-120-Topic-Qualification
- **Upstream Dependencies:** workflow_registry, skill_loader_registry, dossier packet context
- **Downstream Handoff:** global-trend-scanner_packet -> downstream workflow chain
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

The Global Trend Scanner queries multi-source global trend data, filters by creator context, and curates a ranked list of emerging trends ready for topic discovery and viability analysis downstream.

```
STEP 1: VALIDATE INPUTS & LOAD CREATOR CONTEXT
  - Input: dossier_id, intent_envelope (from M-001 Intent Cortex)
  - Validate intent_envelope contains:
    * primary_lane = discovery_vein (required for this skill)
    * target_platforms (list of platforms for trend filtering)
    * audience_segment (for relevance filtering)
  - Load context from M-002 output (creator_audience_profile, content_patterns, platform_defaults)
  - Extract signals:
    * creator_genre_affinities (topics they've created before)
    * creator_audience_age_range, geography, language
    * primary_platforms (where to scout trends)
    * performance_trend (declining/stable/growing — affect opportunity scoring)
  
  Validation: If intent_envelope missing primary_lane or target_platforms → escalate clarification
  Confidence floor: >=0.7 to proceed; else flag "context_insufficient"

STEP 2: QUERY MULTI-SOURCE TREND FEEDS
  - Query 5+ data sources in parallel:
    
    A) SOCIAL_MEDIA_FEEDS:
       - Twitter/X API: trending topics by geography + category
       - TikTok: trending sounds, hashtags, audio clips (platform_defaults.recommended_format)
       - Instagram: trending hashtags, reels trends, explore page signals
       - YouTube: trending videos by category, music trends, shorts trends
       Each source returns: [trend_name, trend_category, current_volume, 7d_growth_rate, peak_momentum]
    
    B) SEARCH_INTELLIGENCE:
       - Google Trends: search volume spikes, related searches, rising queries
       - YouTube Search: autocomplete popularity, search volume by time window
       - Filters: locale (from creator_profile), language (from audience_profile)
       Returns: [query, search_volume, growth_trend, search_category]
    
    C) NICHE_COMMUNITIES:
       - Reddit: subreddit_rising_posts (by creator's known communities)
       - Discord/Slack community signals (if available)
       - Forums, blogs, wikis in creator's genre
       Returns: [topic, community_name, engagement_score, trend_velocity]
    
    D) MUSIC & AUDIO:
       - Spotify: trending songs, viral clips (for music/audio genres)
       - Apple Music Charts
       - SoundCloud: trending tracks
       Returns: [audio_asset_name, genre, trend_velocity, platform_presence]
    
    E) CULTURAL_SIGNALS:
       - News aggregators: breaking stories, viral news themes
       - Meme tracking (if audience aligned): emerging meme formats
       - Celebrity/influencer triggers: major announcements, controversies
       Returns: [event_name, cultural_impact_score, media_coverage, meme_velocity]
  
  Timeout per source: 5s (fallback: skip missing source, mark "degraded")
  Aggregation: Deduplicate by trend_name (case-insensitive), merge volume signals

STEP 3: APPLY CONTEXT FILTERS
  For each trend from aggregated sources:
    
    A) AUDIENCE_ALIGNMENT_FILTER:
       - Check trend against creator_audience_profile (age, location, interests)
       - Filter out: trends with mismatched demographic signals
       - Scoring: +10 if creator_audience_age_range matches trend_audience
       - Scoring: +10 if geography matches creator_primary_locale
       - Scoring: +5 if language match
       - Threshold: trend_relevance_score >= 5 (soft filter, allow some diversity)
    
    B) PLATFORM_ALIGNMENT_FILTER:
       - For each target_platform:
         * Check if trend_source compatible with platform
         * Example: TikTok sounds → TikTok platform only
         * Example: Twitter topics → compatible with most platforms
       - Scoring: +15 for native format, +5 for adaptable format
       - Threshold: platform_compatibility_score >= 5
    
    C) CREATOR_GENRE_FILTER:
       - Extract trend_category from source data
       - Compare to creator_genre_affinities from content_patterns
       - Scoring: +20 if trend_category in top_3_genres
       - Scoring: +10 if trend_category in broader_niche
       - Scoring: -15 if trend_category is known non-creator genre
       - Threshold: genre_alignment >= 0 (allow exploration outside comfort zone)
    
    D) RECENCY_FILTER:
       - Exclude trends older than 72 hours (unless part of broader macro trend)
       - Extract trend_first_seen_time from source metadata
       - Scoring: +25 if emerged in last 24h (fast-moving)
       - Scoring: +15 if emerged in last 48h
       - Scoring: +10 if emerged in last 72h
       - Scoring: 0 if older (but don't filter completely)
  
  Result: Filtered trend list with individual filter scores

STEP 4: CLASSIFY TREND LIFECYCLE
  For each filtered trend, determine lifecycle stage:
    
    IF trend_volume >= all_time_peak:
      lifecycle_stage = "PEAK_MOMENTUM"
      urgency_signal = +25 (must act NOW)
    
    ELSE IF trend_growth_rate >= 50% (per day):
      lifecycle_stage = "ACCELERATING"
      urgency_signal = +20 (window closing soon)
      growth_days_remaining = estimate based on historical patterns (typically 3-7 days)
    
    ELSE IF trend_growth_rate >= 10%:
      lifecycle_stage = "EMERGING"
      urgency_signal = +10 (opportunity window open)
      growth_days_remaining = 7-14 days typical
    
    ELSE IF trend_volume stable (±10%):
      lifecycle_stage = "SUSTAINED"
      urgency_signal = 0 (no time pressure)
      sustainability = "indefinite or slowly declining"
    
    ELSE IF trend_growth_rate < -5%:
      lifecycle_stage = "DECLINING"
      urgency_signal = -20 (avoid unless unique angle)
      time_to_irrelevance = estimate weeks/months
    
    Metadata: include historical_peak_date, current_volume, 7d_growth_curve

STEP 5: SCORE TRENDS BY OPPORTUNITY
  For each classified trend, compute opportunity_score (0-100):
    
    base_score = 50
    
    # Growth momentum (0-30 points)
    + growth_momentum_signal:
      IF lifecycle_stage == ACCELERATING: +25
      ELSE IF lifecycle_stage == EMERGING: +15
      ELSE IF lifecycle_stage == PEAK_MOMENTUM: +20 (declining urgency)
      ELSE IF lifecycle_stage == SUSTAINED: +10
      ELSE (DECLINING): 0
    
    # Audience size & engagement (0-25 points)
    + audience_signal:
      IF trend_volume >= 1M impressions/day: +25
      ELSE IF trend_volume >= 100K: +20
      ELSE IF trend_volume >= 10K: +15
      ELSE IF trend_volume >= 1K: +10
      ELSE: +5
    
    # Underserved niche bonus (0-20 points)
    + underserved_niche_signal:
      count_existing_creators_covering_trend = query trend_coverage_index
      IF count < 10: +20 (highly underserved)
      ELSE IF count < 50: +15 (underserved)
      ELSE IF count < 200: +10 (moderate coverage)
      ELSE IF count < 1000: +5 (well-covered)
      ELSE: 0 (saturated)
    
    # Creator alignment (0-15 points)
    + genre_alignment_score (from STEP 3) normalized to 0-15
    
    # Platform compatibility (0-10 points)
    + platform_compatibility_score (from STEP 3) normalized to 0-10
    
    # Viral potential (0-15 points)
    + viral_potential_signal:
      IF trend has meme/format_replicability: +15
      ELSE IF trend is sound/audio with high_engagement: +12
      ELSE IF trend is visual_format: +10
      ELSE IF trend is text_only: +5
    
    # Creator performance context (-20 to +10)
    - (IF creator_performance_trend == DECLINING: +10)
    - (IF creator_performance_trend == STABLE: 0)
    + (IF creator_performance_trend == GROWING: +5)
    
    # Cap at 0-100
    opportunity_score = min(100, max(0, base_score))

STEP 6: RANK & CURATE TREND LIST
  - Sort all trends by opportunity_score (descending)
  - Apply diversity filter:
    * Maximum 3 trends per category (avoid clustering)
    * Include at least 1 trend from creator_secondary_genres (exploration)
  - Cap list at Top 20 trends (or adjust based on downstream_batch_capacity)
  - For each trend in final list, include:
    {
      "trend_id": "TREND-[source]-[trend_hash]",
      "trend_name": string,
      "trend_category": string,
      "primary_source": string (Twitter|Google|TikTok|Reddit|News|etc),
      "lifecycle_stage": string,
      "current_volume": int,
      "growth_rate_7d": float (% change),
      "opportunity_score": 0-100,
      "audience_alignment": float (0-1),
      "platform_compatibility": [platform_list],
      "underserved_niche_count": int,
      "estimated_days_relevant": int,
      "emerging_angle": string (brief descriptor of unique take),
      "content_format_recommendation": string,
      "risk_level": "LOW|MEDIUM|HIGH" (based on genre drift, obscurity, etc)
    }

STEP 7: BUILD TREND DISCOVERY ENVELOPE
  trend_discovery_envelope = {
    "discovery_id": "DISC-[timestamp]-[creator_id]",
    "scan_timestamp": ISO timestamp,
    "data_sources_queried": [list of active sources],
    "data_sources_failed": [list of timeouts/errors],
    "context_filters_applied": {
      "audience_alignment": boolean,
      "platform_alignment": boolean,
      "creator_genre": boolean,
      "recency": boolean
    },
    "trends_scanned_total": int,
    "trends_after_filtering": int,
    "trends_curated_top_20": [array of trend objects],
    "curation_strategy": "diversity-balanced|highest-opportunity|emerging-focus",
    "discovery_confidence": 0.0-1.0 (based on data_source_coverage),
    "recommended_next_skills": ["M-002-topic-opportunity-miner", "M-003-keyword-intelligence-miner"]
  }

STEP 8: VALIDATION & EMIT
  Validate trend_discovery_envelope:
  - All required fields present
  - trends_curated_top_20 array non-empty (or flag as PARTIAL)
  - Each trend object has minimum required fields
  - opportunity_score values in 0-100 range
  - Timestamp in ISO format
  
  IF validation passes AND discovery_confidence >= 0.8:
    status = "CREATED"
  ELSE IF trends_curated_top_20 non-empty AND discovery_confidence >= 0.6:
    status = "PARTIAL"
    include validation_errors + degradation_flags
  ELSE IF data_sources_failed > 3 OR no trends found:
    status = "EMPTY"
    escalate to WF-900 with escalation_type = "trend_discovery_failed"
  
  Emit packet with deterministic lineage metadata
  Write dossier.discovery_vein.global-trend-scanner (append_only)
  Register in se_packet_index with discovery_confidence, source=M-001, trend_count
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "DISC-[timestamp]-[creator_id]",
  "artifact_family": "global-trend-scanner_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-110-Topic-Discovery",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO timestamp]",
  "status": "CREATED | PARTIAL | EMPTY",
  "payload": {
    "skill_id": "M-001",
    "skill_name": "Global Trend Scanner",
    "discovery_scan": {
      "scan_timestamp": "[ISO timestamp]",
      "data_sources_queried": [
        "Twitter_Trends",
        "Google_Trends",
        "TikTok_Trending",
        "YouTube_Trending",
        "Reddit_Rising",
        "Spotify_Charts",
        "News_Aggregators"
      ],
      "data_sources_successful": "[integer count]",
      "data_sources_failed": ["[source_name]"],
      "total_trends_scanned": "[integer]",
      "trends_after_filtering": "[integer]",
      "context_filters_applied": {
        "audience_alignment": "[true|false]",
        "platform_alignment": "[true|false]",
        "creator_genre_filter": "[true|false]",
        "recency_filter": "[true|false]"
      }
    },
    "curated_trends_top_20": [
      {
        "trend_id": "[TREND-source-hash]",
        "trend_name": "[string]",
        "trend_category": "[string]",
        "primary_source": "[Twitter|Google|TikTok|YouTube|Reddit|Spotify|News]",
        "lifecycle_stage": "[EMERGING|ACCELERATING|PEAK_MOMENTUM|SUSTAINED|DECLINING]",
        "current_volume": "[integer impressions/searches/engagements]",
        "growth_rate_7d": "[float percent change]",
        "opportunity_score": "[0-100]",
        "audience_alignment_score": "[0-1]",
        "platform_compatibility": ["[platform_id]"],
        "underserved_niche_competitor_count": "[integer]",
        "estimated_days_relevant": "[integer]",
        "emerging_angle_descriptor": "[brief unique take]",
        "recommended_content_format": "[video|audio|text|hybrid]",
        "risk_level": "[LOW|MEDIUM|HIGH]",
        "next_skill_routing": "M-002-topic-opportunity-miner"
      }
    ],
    "curation_metadata": {
      "curation_strategy": "[diversity-balanced|highest-opportunity|emerging-focus]",
      "discovery_confidence_score": "[0.0-1.0]",
      "category_diversity": {
        "[category_name]": "[count of trends in category]"
      },
      "source_diversity": {
        "[source_name]": "[count of trends from source]"
      }
    },
    "discovery_envelope": {
      "discovery_id": "[DISC-timestamp-creator_id]",
      "recommended_next_skills": [
        "M-002-topic-opportunity-miner",
        "M-003-keyword-intelligence-miner"
      ],
      "downstream_routing_hint": "CWF-120-Topic-Qualification"
    },
    "governance": {
      "created_by": "M-001-global-trend-scanner",
      "escalation_trigger": "[none|insufficient_data|source_failures|low_confidence]",
      "audit_trail_ref": "[audit_event_id]"
    }
  }
}
```

**Write Targets:**
- `dossier.discovery_vein.global-trend-scanner` (append_only array)
- `se_packet_index` (one row with family=global-trend-scanner_packet, source=M-001, discovery_confidence, trend_count)

## 8. Governance
- **Director Binding:** Narada (seer of broad pattern landscapes) (owner), Krishna (strategic authority)
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
- dossier.discovery_vein.global-trend-scanner (append_only)
- se_packet_index row for packet traceability

**Forbidden Mutations:**
- overwrite of prior dossier values
- write to unrelated namespaces
- mutation without packet metadata

## 11. Failure Modes & Recovery

**Failure Mode 1: Multiple Data Source Timeouts**
- Detection: 4+ data sources fail within 30s window (network latency, API limits)
- Escalation: Return PARTIAL status with "data_sources_failed" list, discovery_confidence degraded
- Recovery: Proceed with available sources (minimum 2 required), mark as "degraded" in discovery_envelope
- Next Stage: Downstream skills (M-002, M-003) can request trend refresh or accept partial curation
- Fallback: If only 1 source succeeds OR no sources available → escalate to WF-900 with escalation_type = "trend_data_unavailable"

**Failure Mode 2: No Trends Meet Opportunity Threshold**
- Detection: trends_curated_top_20 empty after filtering + scoring (discovery_confidence < 0.4)
- Escalation: Return PARTIAL status with "no_viable_trends" flag
- Recovery: Lower opportunity_score threshold from 50 to 30, include "DECLINING" trends with high underserved_niche_count
- Next Stage: M-002 can work with lower-confidence trends or request re-scan with expanded filters
- Action: Flag for profile update — creator's audience/genre may be too narrow for current trend ecosystem

**Failure Mode 3: Context Filter Too Restrictive**
- Detection: trends_after_filtering < 5 (after audience/platform/genre filters, before curation)
- Escalation: Return PARTIAL status with "context_filters_too_strict" flag
- Recovery: Relax filters incrementally:
  * Remove genre_alignment requirement (allow trend exploration)
  * Expand audience_demographic_range by ±5 years age, ±200km radius
  * Include "adjacent" platforms (not just primary_platforms)
- Next Stage: Proceed with filtered list but flag "exploration_mode" for creator awareness
- Action: Recommend context profile refresh if filters remain restrictive

**Failure Mode 4: Emerging Angle Descriptor Missing**
- Detection: Cannot generate unique_angle for trend (insufficient metadata from sources)
- Escalation: Mark trend's risk_level = "HIGH" (generic trend, high competition)
- Recovery: Populate emerging_angle_descriptor with auto-generated placeholder: "Requires manual angle research"
- Next Stage: M-002 (Topic Opportunity Miner) must generate unique angle before viability scoring
- Action: Recommend manual research slot before full commitment

## 12. Best Practices

- **Data Source Redundancy:** Query 5+ sources in parallel with 5s timeout each. If >50% sources available, proceed. Never rely on single source.

- **Trend Deduplication:** Case-insensitive matching of trend_name across sources. Merge volume signals (take max 7d_growth_rate, sum volume from multiple sources).

- **Opportunity Score Determinism:** Document all 8 signal components (growth, audience, underserved, alignment, compatibility, viral_potential, performance_context, penalties). Use exact thresholds in each band (no fuzzy logic).

- **Lifecycle Stage Precision:** Use exact growth_rate thresholds (50%→ACCELERATING, 10%→EMERGING, ±10%→SUSTAINED, -5%→DECLINING). Include peak_date + current_date for reproducibility.

- **Context Filter Ordering:** Apply filters in priority order (audience → platform → genre → recency) so downstream can understand rejection reasons. Never silent-drop; track all filter failures.

- **Diversity-First Curation:** Maximum 3 trends per category, minimum 1 from secondary_genres. Prevents theme clustering and encourages exploration.

- **Emerging Angle Requirement:** Every trend must have emerging_angle_descriptor or risk_level = HIGH. Do not emit trends with "generic" angles — force M-002 to research.

- **Underserved Niche Scoring:** Query trend_coverage_index only for Top 20 candidates (expensive operation). Cache results for 24h to avoid redundant lookups.

- **Risk Level Transparency:** Explicitly mark trends with genre_drift > 2 categories or obscurity > threshold as "HIGH" risk. Helps downstream prioritization.

- **Discovery Confidence Calculation:** Base it on % of data sources successfully queried + quality of filtered_trends list (confidence = 0.5 + 0.25*source_success_rate + 0.25*trend_quality_ratio).

- **Timestamp Accuracy:** Record scan_timestamp at query initiation, not completion. Include query_window (e.g., "last 24 hours") in envelope for reproducibility.

- **Fallback to Recency:** If opportunity_score low but trend_volume high + recent, escalate trend to M-002 with "recency_override" flag. Recent > opportunity in some cases.

## 13. Validation / Done

**Acceptance Tests:**
- **TEST-PH1-TI-M001-001:** Multi-source query (5+ sources) with all sources available returns CREATED packet with discovery_confidence >= 0.9
- **TEST-PH1-TI-M001-002:** Two data sources timeout (3 available) returns PARTIAL status with degradation flags and discovery_confidence 0.6-0.8
- **TEST-PH1-TI-M001-003:** Four+ sources fail (1 available) escalates to WF-900 with escalation_type = "trend_data_unavailable"
- **TEST-PH1-TI-M001-004:** Curated trends are ranked by opportunity_score (highest first), with Top 20 returned
- **TEST-PH1-TI-M001-005:** Opportunity_score formula correctly applies all 8 signal components (growth, audience, underserved, alignment, compatibility, viral, performance_context, penalties)
- **TEST-PH1-TI-M001-006:** Context filters (audience, platform, genre, recency) applied in order, with tracking of filter failures
- **TEST-PH1-TI-M001-007:** Trend lifecycle stages correctly classified (EMERGING if growth >= 10%, ACCELERATING if >= 50%, etc.)
- **TEST-PH1-TI-M001-008:** Diversity filter prevents >3 trends per category and includes >=1 from secondary_genres
- **TEST-PH1-TI-M001-009:** Emerging angle descriptor populated for each trend (or risk_level = HIGH if missing)
- **TEST-PH1-TI-M001-010:** Underserved niche competitor count correctly queried and scores trends with < 10 competitors +20 points
- **TEST-PH1-TI-M001-011:** No viable trends (discovery_confidence < 0.4) returns PARTIAL with "no_viable_trends" flag + lower threshold retry
- **TEST-PH1-TI-M001-012:** Context filters too restrictive (filtered_list < 5) returns PARTIAL with "filters_too_strict" flag + relaxation guidance
- **TEST-PH1-TI-M001-013:** Dossier patch appended (append_only) to dossier.discovery_vein.global-trend-scanner with no overwrites
- **TEST-PH1-TI-M001-014:** se_packet_index row created with discovery_id, discovery_confidence, trend_count, source=M-001
- **TEST-PH1-TI-M001-015:** Replay of same dossier_id within 24h produces identical trend list (deterministic, consistent ranking)

**Done Criteria:**
- ✅ All 5+ data sources (Twitter, Google, TikTok, YouTube, Reddit, Spotify, News) query logic defined with fallback behavior
- ✅ Context filter chain implemented (audience → platform → genre → recency) with error tracking
- ✅ Opportunity score formula documented with all 8 component signals and exact thresholds
- ✅ Trend lifecycle classification deterministic (exact growth_rate bands for EMERGING/ACCELERATING/PEAK/SUSTAINED/DECLINING)
- ✅ Diversity filter prevents clustering (max 3 per category, min 1 from secondary_genres)
- ✅ Emerging angle descriptor required for every trend (or HIGH risk flag)
- ✅ Underserved niche competitor count integrated into scoring
- ✅ Output packet includes all required sections (discovery_scan, curated_trends_top_20, curation_metadata, discovery_envelope, governance)
- ✅ All 4 failure modes have explicit detection, escalation path, and recovery action
- ✅ Partial status emitted for degraded data (source timeouts, filter restrictions) without escalating every gap
- ✅ Escalation path (WF-900) reserved only for unrecoverable errors (no viable data sources, zero trends found)
- ✅ Dossier write validated as append_only with no overwrite of prior discovery records
- ✅ Discovery confidence score calculated from source success rate + trend_quality ratio (formula documented)
- ✅ Test suite covers happy path + all 4 failure modes + edge cases (timeout, no_trends, restrictive_filters, missing_angle)
- ✅ Deterministic replay guaranteed within 24h (same input = same ranked trend list)
