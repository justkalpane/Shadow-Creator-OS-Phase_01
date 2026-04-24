# SKL-PH1-TOPIC-OPPORTUNITY-MINER

## 1. Skill Identity
- **Skill ID:** M-002
- **Skill Name:** Topic Opportunity Miner
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-CWF-110-Topic-Discovery
- **Consumer Workflows:** SE-N8N-CWF-110-Topic-Discovery, SE-N8N-CWF-120-Topic-Qualification
- **Vein/Route/Stage:** discovery_vein / topic_to_script / Stage_B_Discovery

## 2. Purpose
Runtime-ready canonical skill artifact for M-002 (Topic Opportunity Miner). This specification follows repository DNA law and enforces deterministic execution, packet lineage, governance-safe escalation, and patch-only mutation discipline.

## 3. DNA Injection
- **Role Definition:** topic-opportunity-miner_executor
- **DNA Archetype:** Narada (pattern recognition across signals)
- **Behavior Model:** deterministic, registry-bound, escalation-safe
- **Operating Method:** ingest -> validate -> execute -> emit -> index
- **Working Style:** evidence-first, schema-locked, replay-aware

## 4. Workflow Injection
- **Producer:** WF
- **Direct Consumers:** SE-N8N-CWF-110-Topic-Discovery, SE-N8N-CWF-120-Topic-Qualification
- **Upstream Dependencies:** workflow_registry, skill_loader_registry, dossier packet context
- **Downstream Handoff:** topic-opportunity-miner_packet -> downstream workflow chain
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

The Topic Opportunity Miner deep-dives each curated global trend to uncover specific, underserved micro-opportunities and unique creator angles. It enriches trends with competitor analysis, micro-niche opportunities, and positioning recommendations.

```
STEP 1: VALIDATE INPUTS & LOAD TREND ENVELOPE
  - Input: dossier_id, global_trend_scanner_packet (from M-001)
  - Validate payload contains:
    * curated_trends_top_20 (array of trend objects with trend_id, lifecycle_stage, opportunity_score)
    * discovery_confidence (0.0-1.0)
  - Load creator context from M-002 output (content_patterns, platform_defaults, audience_profile)
  - Extract signals for mining:
    * creator_primary_platforms (where to analyze opportunities)
    * creator_content_formats (video|audio|text|hybrid)
    * creator_genre_affinities
  
  Validation: If curated_trends_top_20 empty → escalate to WF-900 with escalation_type = "no_trends_to_mine"
  Confidence floor: >=0.6 to proceed; else flag "limited_context"

STEP 2: FOR EACH TREND, EXECUTE COMPETITOR ANALYSIS
  For each trend in curated_trends_top_20:
    
    A) IDENTIFY EXISTING_CREATORS_COVERING_TREND:
       - Query platform-specific creator search (YouTube, TikTok, Twitter, etc.):
         * Filter by: trend_name in title/tags/description
         * Filter by: posted in last 30 days (recent coverage)
         * Limit: first 100 results per platform
       - For each creator found, extract:
         * creator_follower_count
         * content_views
         * engagement_rate
         * format_used (video/shorts/reels/tweets/etc)
         * angle_used (their unique take on trend)
         * posting_frequency_during_trend
       - Aggregate: count_total_creators, avg_views, avg_engagement, format_distribution
    
    B) CLASSIFY_COMPETITOR_COVERAGE_INTENSITY:
       IF count_total_creators < 50:
         coverage_intensity = "UNDERSERVED" → high_opportunity_bonus
       ELSE IF count_total_creators < 200:
         coverage_intensity = "MODERATE" → standard_opportunity
       ELSE IF count_total_creators < 1000:
         coverage_intensity = "SATURATED" → requires_unique_angle
       ELSE:
         coverage_intensity = "OVERSATURATED" → risk_high, opportunity_low
    
    C) EXTRACT_COMPETITOR_ANGLES:
       - Sample 10-20 top creators (by views/engagement)
       - For each, infer angle/positioning:
         * "beginner_tutorial_angle" (teaching angle)
         * "entertainment_angle" (funny/entertaining take)
         * "expert_analysis_angle" (deep-dive/authority)
         * "personal_story_angle" (lived experience)
         * "trending_format_angle" (challenges, dances, skits)
       - Map: angle → creator_count, avg_views, avg_engagement
       - Identify: missing_angles (angles not yet heavily covered)
    
    D) IDENTIFY_CREATOR_DIFFERENTIATION:
       - Compare competitor_angles to creator_strength_areas (from content_patterns)
       - Identify angles aligned with creator's historical performance:
         IF creator excels in "entertainment": recommend entertainment_angle with bonus
         IF creator excels in "education": recommend tutorial_angle with bonus
         IF creator excels in "personal_story": recommend lived_experience_angle with bonus
       - Differentiation_score = (1 - coverage_pct_of_angle) * creator_alignment_bonus
       - Higher differentiation_score = less saturation + high creator fit

STEP 3: MINE FOR MICRO-NICHE OPPORTUNITIES
  For each trend:
    
    A) SEGMENT_TREND_BY_MICRO_NICHES:
       Break trend into smallest viable sub-segments:
       Example: "AI" trend segments into:
         - "AI for creators" (content creation tools)
         - "AI for business" (productivity automation)
         - "AI safety" (ethics/concerns)
         - "AI art generation" (specific tool category)
         - "AI learning" (tutorials, how-tos)
       
       - Recursively segment until audience_size >= 1000 but <= 100K (optimal micro-niche size)
       - For each micro-niche, query:
         * Search volume (Google Trends for sub-query)
         * Creator coverage count (YouTube/TikTok search)
         * Engagement potential (avg_views for this sub-segment)
    
    B) SCORE_MICRO_NICHE_OPPORTUNITY:
       opportunity_score_per_niche = 50
       + (IF segment_creator_count < 20: +30) ELSE IF < 100: +15 ELSE 0  // underserved bonus
       + (IF audience_size 10K-100K: +20) ELSE IF 1K-10K: +10 ELSE 0      // audience size
       + (IF creator_genre_match: +25) ELSE IF adjacent_genre: +10 ELSE 0 // creator fit
       - (IF trend_lifecycle == DECLINING: +20)                           // declining penalty
       
       niche_opportunity = min(100, max(0, opportunity_score_per_niche))
    
    C) RANK_MICRO_NICHES:
       Sort by niche_opportunity (descending)
       Return Top 5 micro-niches per trend

STEP 4: RESEARCH RELATED KEYWORDS & HASHTAGS
  For each trend + top micro-niche:
    
    A) EXTRACT_KEYWORD_VARIATIONS:
       - Query Google Suggest, YouTube Suggest, TikTok Suggest for trend keywords
       - Identify long-tail variations:
         Example: "AI" → ["best AI tools", "free AI generator", "AI for beginners", "AI art", "AI music maker", etc.]
       - For each variation, extract:
         * search_volume (monthly searches)
         * competition_level (creator_count covering this keyword)
         * search_trend (rising/stable/declining)
    
    B) EXTRACT_HASHTAG_INTELLIGENCE:
       - Platform-specific hashtag analysis (TikTok, Instagram, Twitter):
         * Primary hashtag (main trend tag)
         * Related hashtags (suggest similar content)
         * Niche hashtags (underserved, long-tail)
       - For each hashtag:
         * hashtag_video_count (total content using it)
         * hashtag_avg_views (average views per video)
         * hashtag_growth_rate (7d change)
    
    C) IDENTIFY_CREATOR_QUESTIONS:
       - Query Reddit, Quora, YouTube comments for trend-related questions:
         * "How do I...?" questions (tutorial demand)
         * "What is...?" questions (education demand)
         * "Best...?" questions (recommendations demand)
       - Aggregate: question_category → frequency_score
       - Recommendations: high-frequency question categories = content opportunity

STEP 5: ANALYZE_CONTENT_FORMAT_VARIATIONS
  For each trend + micro-niche:
    
    A) IDENTIFY_WINNING_FORMATS:
       - Analyze competitor_angles from STEP 2C
       - For each format (video, shorts, reels, tweets, posts, podcasts):
         * avg_views_in_this_format
         * engagement_rate_in_this_format
         * creator_count_using_format
         * format_trend (rising/stable/declining)
       - Rank: format_performance = avg_views * engagement_rate * creator_rarity_bonus
    
    B) IDENTIFY_UNDERUTILIZED_FORMATS:
       - If trend mostly covered in video, but podcasts have high engagement_rate → opportunity
       - Format underutilization = (avg_views_in_format) / (creator_count_using_format) (views per creator)
       - Higher ratio = less saturated, higher upside potential
    
    C) MATCH_TO_CREATOR_STRENGTH:
       - Compare winning_formats to creator_primary_formats (from platform_defaults)
       - Strong_match_bonus = +25 for platform-native formats
       - Weak_match = -10 for unsupported formats

STEP 6: BUILD_OPPORTUNITY_PROFILES
  For each trend, create opportunity_profile objects:
    
    opportunity_profile = {
      "opportunity_id": "OPP-[trend_id]-[niche_hash]",
      "trend_id": [from M-001],
      "trend_name": string,
      "micro_niche": string (e.g., "AI for creators"),
      "niche_opportunity_score": 0-100,
      "competitor_analysis": {
        "total_creators_covering_trend": int,
        "coverage_intensity": "UNDERSERVED|MODERATE|SATURATED|OVERSATURATED",
        "most_common_angles": [list of angle → count],
        "missing_angles": [list of underutilized angles],
        "creator_fit_angle": "best_angle_for_this_creator",
        "differentiation_score": 0-100
      },
      "micro_niche_breakdown": {
        "niche_name": string,
        "audience_size_estimate": int,
        "creator_count_in_niche": int,
        "avg_views_in_niche": int,
        "niche_opportunity_score": 0-100
      },
      "keyword_research": {
        "primary_keywords": ["keyword1", "keyword2"],
        "long_tail_opportunities": ["long_tail_keyword1"],
        "search_volume_opportunity": "high|medium|low",
        "related_keywords": ["keyword_variant1"]
      },
      "hashtag_research": {
        "primary_hashtag": string,
        "related_hashtags": [list],
        "underutilized_hashtags": [list with low_video_count but high_avg_views],
        "hashtag_growth_trend": "rising|stable|declining"
      },
      "audience_questions": {
        "top_questions": ["question1", "question2"],
        "question_demand_categories": {"how_to": 45, "what_is": 30, "best_of": 25}
      },
      "format_recommendations": {
        "winning_format": "video|shorts|reels|tweets|podcast",
        "winning_format_avg_views": int,
        "underutilized_format": string (high_upside),
        "creator_native_format": string (creator's strength)
      },
      "overall_opportunity_score": 0-100,
      "opportunity_confidence": 0-1.0,
      "risk_level": "LOW|MEDIUM|HIGH",
      "next_skill_routing": "M-003-keyword-intelligence-miner"
    }

STEP 7: RANK & CURATE OPPORTUNITY_PROFILES
  - For each trend, retain Top 3 opportunity_profiles (by overall_opportunity_score)
  - Aggregate across all 20 trends: return Top 40-60 opportunities overall
  - Sort by: overall_opportunity_score (descending)
  - Filter for relevance:
    * Exclude opportunities with risk_level = HIGH (unless creator explicitly wants exploration)
    * Bonus: opportunities with differentiation_score > 0.8 (unique positioning)

STEP 8: BUILD OPPORTUNITY_MINING_ENVELOPE
  opportunity_mining_envelope = {
    "mining_id": "MINE-[timestamp]-[creator_id]",
    "source_trends_count": int (from M-001),
    "opportunities_mined_total": int,
    "opportunities_curated_top_40": [array of opportunity_profile objects],
    "curation_strategy": "highest_opportunity|lowest_saturation|creator_fit_optimized",
    "mining_confidence": 0.0-1.0,
    "competitor_data_freshness": string (data sources: YouTube, TikTok, Twitter),
    "next_stage_routing": "M-003-keyword-intelligence-miner or M-004-audience-demographic-mapper"
  }

STEP 9: VALIDATION & EMIT
  Validate opportunity_mining_envelope:
  - All required fields present
  - opportunities_curated_top_40 array non-empty (or flag PARTIAL)
  - Each opportunity_profile has minimum required fields
  - overall_opportunity_score values in 0-100 range
  - Timestamp in ISO format
  
  IF validation passes AND mining_confidence >= 0.8:
    status = "CREATED"
  ELSE IF opportunities_curated_top_40 non-empty AND mining_confidence >= 0.6:
    status = "PARTIAL"
    include validation_errors + degradation_flags
  ELSE:
    status = "EMPTY"
    escalate to WF-900 with escalation_type = "opportunity_mining_failed"
  
  Emit packet with deterministic lineage metadata
  Write dossier.discovery_vein.topic-opportunity-miner (append_only)
  Register in se_packet_index
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "MINE-[timestamp]-[creator_id]",
  "artifact_family": "topic-opportunity-miner_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-110-Topic-Discovery",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO timestamp]",
  "status": "CREATED | PARTIAL | EMPTY",
  "payload": {
    "skill_id": "M-002",
    "skill_name": "Topic Opportunity Miner",
    "mining_metadata": {
      "source_trends_count": "[integer from M-001]",
      "source_discovery_confidence": "[0.0-1.0]",
      "opportunities_mined_total": "[integer]",
      "opportunities_curated_count": "[integer up to 40-60]",
      "curation_strategy": "[highest_opportunity|lowest_saturation|creator_fit_optimized]",
      "mining_confidence_score": "[0.0-1.0]",
      "competitor_data_sources": ["YouTube", "TikTok", "Twitter", "Google_Trends"]
    },
    "curated_opportunities_top_40": [
      {
        "opportunity_id": "[OPP-trend_id-niche_hash]",
        "trend_id": "[from M-001]",
        "trend_name": "[string]",
        "micro_niche": "[specific segment, e.g., 'AI for creators']",
        "niche_opportunity_score": "[0-100]",
        "competitor_analysis": {
          "total_creators_covering_trend": "[integer]",
          "coverage_intensity": "[UNDERSERVED|MODERATE|SATURATED|OVERSATURATED]",
          "most_common_angles": [{"angle": "[string]", "creator_count": "[integer]"}],
          "missing_angles": ["[unused_angle1]", "[unused_angle2]"],
          "best_angle_for_creator": "[string]",
          "creator_differentiation_score": "[0-100]"
        },
        "micro_niche_breakdown": {
          "niche_description": "[string]",
          "estimated_audience_size": "[integer]",
          "creators_covering_niche": "[integer]",
          "avg_views_per_creator": "[integer]",
          "niche_opportunity_score": "[0-100]"
        },
        "keyword_research": {
          "primary_keywords": ["[keyword1]", "[keyword2]"],
          "long_tail_keywords": ["[keyword1]", "[keyword2]"],
          "search_volume_category": "[high|medium|low]",
          "related_keywords": ["[variant1]"]
        },
        "hashtag_research": {
          "primary_hashtag": "[#trending_tag]",
          "related_hashtags": ["[#related1]"],
          "underutilized_hashtags": ["[#low_saturation_high_engagement]"],
          "hashtag_growth_trend": "[rising|stable|declining]"
        },
        "audience_questions": {
          "top_questions": ["[How to...?]", "[What is...?]"],
          "question_categories_by_demand": {
            "tutorial_demand": "[percentage]",
            "educational_demand": "[percentage]",
            "recommendation_demand": "[percentage]"
          }
        },
        "format_analysis": {
          "winning_content_format": "[video|shorts|reels|tweets|podcast]",
          "winning_format_avg_views": "[integer]",
          "winning_format_engagement_rate": "[float 0-1]",
          "underutilized_format_opportunity": "[string]",
          "creator_native_format_match": "[string]"
        },
        "overall_opportunity_score": "[0-100]",
        "opportunity_confidence": "[0.0-1.0]",
        "risk_level": "[LOW|MEDIUM|HIGH]",
        "next_skill_recommendation": "M-003-keyword-intelligence-miner"
      }
    ],
    "mining_envelope": {
      "mining_id": "[MINE-timestamp-creator_id]",
      "mining_strategy": "[based on creator_performance_trend]",
      "recommended_next_skills": [
        "M-003-keyword-intelligence-miner",
        "M-004-audience-demographic-mapper"
      ],
      "downstream_routing_hint": "CWF-120-Topic-Qualification"
    },
    "governance": {
      "created_by": "M-002-topic-opportunity-miner",
      "escalation_trigger": "[none|insufficient_data|mining_failed|low_confidence]",
      "audit_trail_ref": "[audit_event_id]"
    }
  }
}
```

**Write Targets:**
- `dossier.discovery_vein.topic-opportunity-miner` (append_only array)
- `se_packet_index` (one row with family=topic-opportunity-miner_packet, source=M-002, mining_confidence, opportunity_count)

## 8. Governance
- **Director Binding:** Narada (pattern recognition across signals) (owner), Krishna (strategic authority)
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
- dossier.discovery_vein.topic-opportunity-miner (append_only)
- se_packet_index row for packet traceability

**Forbidden Mutations:**
- overwrite of prior dossier values
- write to unrelated namespaces
- mutation without packet metadata

## 11. Failure Modes & Recovery

**Failure Mode 1: Competitor Data Source Timeouts**
- Detection: 2+ platform searches (YouTube, TikTok, Twitter) timeout within 30s window
- Escalation: Return PARTIAL status with "competitor_data_degraded" flag, mining_confidence reduced
- Recovery: Proceed with available platform data, mark opportunities with "limited_competitor_analysis" flag
- Next Stage: Downstream skills (M-003, M-004) can request competitor refresh or accept partial analysis
- Fallback: If 3+ sources fail → escalate to WF-900 with escalation_type = "competitor_data_unavailable"

**Failure Mode 2: No Viable Micro-Niches Found**
- Detection: After segmentation, all micro-niches have coverage_intensity = OVERSATURATED (>1000 creators per niche)
- Escalation: Return PARTIAL status with "no_underserved_niches" flag
- Recovery: Lower saturation threshold (accept SATURATED niches as valid), or relax creator_alignment filter to allow genre exploration
- Next Stage: M-003 can work with saturated niches but must find unique angles for differentiation
- Action: Flag for creator profile update — creator may need to expand genre/audience scope

**Failure Mode 3: Weak Competitor Angle Diversity**
- Detection: 70%+ of competitors using same angle (low missing_angles count) → hard to differentiate
- Escalation: Mark opportunities with risk_level = HIGH and differentiation_score < 50
- Recovery: Escalate to M-003 (keyword intelligence) to find sub-keyword angles not covered by competitors
- Next Stage: M-003 can identify untapped keyword variations that enable differentiation

**Failure Mode 4: Creator Fit / Format Mismatch**
- Detection: winning_format not in creator_native_format (creator strong in podcasts, but winning format is video)
- Escalation: Return opportunity with "format_mismatch" warning and risk_level = MEDIUM
- Recovery: Include "underutilized_format_opportunity" in analysis (format with high potential but low creator saturation)
- Next Stage: Creator can choose to adapt format or select opportunities with better format fit

## 12. Best Practices

- **Platform-Specific Search Logic:** Tailor competitor search queries to each platform's native API/interface (YouTube search, TikTok hashtag API, Twitter search operators). Cache results for 24h to avoid redundant queries.

- **Micro-Niche Segmentation Discipline:** Stop segmentation when audience_size reaches 1K-100K range (optimal). Avoid over-segmentation (niches <1K) or under-segmentation (>100K, too broad).

- **Angle Classification Determinism:** Define exact angle categories (tutorial, entertainment, expert, personal_story, trending_format) upfront. Use consistent labels across all analysis to enable aggregation.

- **Creator-to-Opportunity Fit Scoring:** Always compare winning_format + common_angles to creator_strength_areas. Include explicit fit_bonus (+25 for native format, -10 for weak fit).

- **Competitor Metrics Aggregation:** For each format analyzed, track avg_views, median_views (resistant to outliers), engagement_rate (comments+shares+saves / views). Use median for underserved_niche detection.

- **Keyword Research Completeness:** Must include: primary keywords (main trend), long_tail (specific variations), related_keywords (synonyms/variants). Minimum 5 keywords per opportunity.

- **Hashtag Underutilization Detection:** Identify hashtags with high_avg_views but low_total_posts (underutilized). Formula: hashtag_opportunity = avg_views_per_post / sqrt(total_posts) (rewards low-saturation + high-engagement).

- **Question-Based Content Validation:** Audience questions reveal content demand. Track question frequency across categories (how_to, what_is, best_of). Opportunities with high question volume = strong content direction signal.

- **Format Underutilization Bonus:** If winning_format is video but podcasts show high_engagement_rate + low_creator_count, flag as "underutilized_format_opportunity" with explicit bonus.

- **Differentiation Score Non-Optional:** Every opportunity must have differentiation_score (0-100). If = LOW, mark risk_level = HIGH and escalate to M-003 for angle research.

- **Mining Confidence Calculation:** Base it on competitor_data_coverage (% of platforms queried successfully) + micro_niche_viability (% opportunities with coverage_intensity < OVERSATURATED). Formula: mining_confidence = 0.5 + 0.3*source_coverage + 0.2*niche_viability.

- **Deterministic Ranking:** Sort opportunities by overall_opportunity_score (descending), then by differentiation_score (descending) as tie-breaker. No random shuffling.

## 13. Validation / Done

**Acceptance Tests:**
- **TEST-PH1-TI-M002-001:** Valid trend input (20 trends from M-001) produces CREATED packet with opportunities_curated_count >= 40
- **TEST-PH1-TI-M002-002:** Competitor analysis correctly counts creators covering trend and classifies coverage_intensity (UNDERSERVED < 50, MODERATE < 200, etc.)
- **TEST-PH1-TI-M002-003:** Micro-niche segmentation creates segments with audience_size in 1K-100K range (or flags as "undersized" or "oversized")
- **TEST-PH1-TI-M002-004:** Angle extraction identifies minimum 3+ distinct angles per trend (tutorial, entertainment, expert, personal_story, trending_format)
- **TEST-PH1-TI-M002-005:** Creator differentiation score correctly applies creator_alignment_bonus (+25 for native format, penalty for mismatched format)
- **TEST-PH1-TI-M002-006:** Keyword research includes primary keywords + long_tail variations + related_keywords (minimum 5 per opportunity)
- **TEST-PH1-TI-M002-007:** Hashtag analysis identifies underutilized_hashtags (high_avg_views, low_total_posts) with correct scoring formula
- **TEST-PH1-TI-M002-008:** Audience question extraction categorizes questions by type (how_to, what_is, best_of) and ranks by frequency
- **TEST-PH1-TI-M002-009:** Format analysis correctly identifies winning_format (by avg_views * engagement_rate) and flags underutilized_format opportunities
- **TEST-PH1-TI-M002-010:** Overall opportunity score correctly applies all scoring components (niche score, competitor analysis, format fit, risk penalties)
- **TEST-PH1-TI-M002-011:** Opportunities ranked by overall_opportunity_score (descending), with differentiation_score as tie-breaker
- **TEST-PH1-TI-M002-012:** Competitor data timeout (2+ sources) returns PARTIAL with "competitor_data_degraded" flag, mining_confidence reduced
- **TEST-PH1-TI-M002-013:** No underserved niches found (all coverage_intensity = OVERSATURATED) returns PARTIAL with "no_underserved_niches" flag + recovery guidance
- **TEST-PH1-TI-M002-014:** Weak angle diversity (70%+ competitors same angle) marks opportunities with risk_level = HIGH, differentiation_score < 50
- **TEST-PH1-TI-M002-015:** Dossier patch appended (append_only) to dossier.discovery_vein.topic-opportunity-miner with no overwrites
- **TEST-PH1-TI-M002-016:** se_packet_index row created with mining_id, mining_confidence, opportunity_count, source=M-002
- **TEST-PH1-TI-M002-017:** Replay of same dossier_id within 24h produces identical opportunity ranking (deterministic)

**Done Criteria:**
- ✅ Competitor analysis logic queries 4+ platforms (YouTube, TikTok, Twitter, Google_Trends) with fallback behavior for timeouts
- ✅ Coverage intensity classification deterministic (exact creator count thresholds: <50=UNDERSERVED, <200=MODERATE, <1000=SATURATED, >=1000=OVERSATURATED)
- ✅ Angle extraction identifies 5+ distinct angles per trend with creator count mapping
- ✅ Micro-niche segmentation produces segments in 1K-100K audience size range with viability scoring
- ✅ Keyword research includes 5+ keywords per opportunity (primary, long_tail, related) with search_volume classification
- ✅ Hashtag analysis includes underutilization detection formula (high_avg_views + low_total_posts bonus)
- ✅ Audience questions categorized by type with demand frequency ranking
- ✅ Format analysis identifies winning_format (by engagement*views) and underutilized_format opportunities
- ✅ Creator differentiation scoring applies fit_bonus for native formats, penalties for mismatched formats
- ✅ Overall opportunity score formula documented with all components (niche, competitor, format, risk)
- ✅ Opportunities ranked deterministically by overall_opportunity_score desc, differentiation_score desc
- ✅ Output packet includes all required sections (mining_metadata, curated_opportunities_top_40, mining_envelope, governance)
- ✅ All 4 failure modes have explicit detection, escalation path, and recovery action
- ✅ Partial status emitted for degraded data (competitor timeouts, saturation, weak angles) without escalating every gap
- ✅ Escalation path (WF-900) reserved only for unrecoverable errors (no competitor data, mining failure)
- ✅ Dossier write validated as append_only with no overwrite of prior mining records
- ✅ Mining confidence score calculated from source_coverage + niche_viability ratio (formula documented)
- ✅ Test suite covers happy path + all 4 failure modes + edge cases (timeout, saturation, weak_angles, format_mismatch)
- ✅ Deterministic replay guaranteed within 24h (same input = same opportunity ranking)
