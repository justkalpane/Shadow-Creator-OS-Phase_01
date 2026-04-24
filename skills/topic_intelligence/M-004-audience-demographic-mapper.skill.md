# SKL-PH1-AUDIENCE-DEMOGRAPHIC-MAPPER

## 1. Skill Identity
- **Skill ID:** M-004
- **Skill Name:** Audience Demographic Mapper
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-WF
- **Consumer Workflows:** WF-100, CWF-110, CWF-120, CWF-130, CWF-140
- **Vein/Route/Stage:** topic_intelligence_vein / topic_to_script / Stage_A_Topic

## 2. Purpose
Runtime-ready canonical skill artifact for M-004 (Audience Demographic Mapper). This specification follows repository DNA law and enforces deterministic execution, packet lineage, governance-safe escalation, and patch-only mutation discipline.

## 3. DNA Injection
- **Role Definition:** audience-demographic-mapper_executor
- **DNA Archetype:** Narada
- **Behavior Model:** deterministic, registry-bound, escalation-safe
- **Operating Method:** ingest -> validate -> execute -> emit -> index
- **Working Style:** evidence-first, schema-locked, replay-aware

## 4. Workflow Injection
- **Producer:** WF
- **Direct Consumers:** WF-100, CWF-110, CWF-120, CWF-130, CWF-140
- **Upstream Dependencies:** workflow_registry, skill_loader_registry, dossier packet context
- **Downstream Handoff:** audience-demographic-mapper_packet -> downstream workflow chain
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

The Audience Demographic Mapper analyzes each keyword opportunity to identify and characterize the audience that searches for / engages with that content. It builds detailed audience personas, demographic profiles, and creator-fit recommendations for each opportunity.

```
STEP 1: VALIDATE INPUTS & LOAD KEYWORD_PROFILES
  - Input: dossier_id, keyword_intelligence_miner_packet (from M-003)
  - Validate payload contains:
    * keyword_intelligence_profiles (array with keyword_cohorts, gaps, format recommendations)
    * research_confidence (0.0-1.0)
    * total_keywords_mined (integer)
  - Load creator context: creator_audience_profile, creator_platforms, content_patterns, genre_affinities
  
  Validation: If keyword_intelligence_profiles empty → escalate to WF-900 with escalation_type = "no_keywords_to_map"
  Confidence floor: >=0.6 to proceed

STEP 2: FOR EACH KEYWORD, RESEARCH AUDIENCE DEMOGRAPHICS
  For each keyword in keyword_intelligence_profiles:
    
    A) EXTRACT_DEMOGRAPHIC_SIGNALS:
       Query multiple demographic data sources:
         - Google Analytics aggregate data (if available for creator)
         - YouTube audience analytics (by keyword/topic)
         - TikTok audience insights (by hashtag/sound)
         - Reddit: identify subreddits/communities discussing this keyword
         - Twitter: audience profile analysis by keyword mentions
         - Quora: user question patterns and demographic inference
       
       Extract demographic attributes:
         * age_range (13-24, 25-34, 35-44, 45-54, 55-64, 65+)
         * gender_distribution (% male, female, other, unspecified)
         * geographic_distribution (countries, regions, major cities)
         * language_primary
         * device_preference (mobile, desktop, tablet distribution %)
         * timezone_distribution (inferred from posting times, location)
    
    B) BUILD_DEMOGRAPHIC_PROFILE:
       For each keyword, aggregate signals into:
         {
           "audience_age_distribution": {
             "13-24": percentage,
             "25-34": percentage,
             "35-44": percentage,
             ... etc
           },
           "gender_distribution": {male, female, other, unspecified},
           "geographic_distribution": {
             "country_1": percentage,
             "country_2": percentage,
             ... top 5-10 regions
           },
           "primary_language": string,
           "device_preference": {mobile: %, desktop: %, tablet: %},
           "timezone_concentration": [list of main timezones]
         }
    
    C) CONFIDENCE_SCORING_FOR_DEMOGRAPHICS:
       demographic_confidence = (data_source_coverage + data_freshness + audience_size_estimate) / 3
       - data_source_coverage: % of sources successfully queried (max 6: GA, YT, TikTok, Reddit, Twitter, Quora)
       - data_freshness: if data < 30 days old = 1.0, else decay proportionally
       - audience_size_estimate: 1.0 if >100K estimated, 0.7 if 10K-100K, 0.4 if <10K
       - Confidence floor: 0.4 (still report demographic profile but flag as "limited_confidence")

STEP 3: EXTRACT_PSYCHOGRAPHIC_SIGNALS & AUDIENCE_BEHAVIORS
  For each keyword:
    
    A) INTERESTS & PAIN_POINTS:
       - Analyze Reddit/Quora questions for pain points people mention
       - Extract: recurring themes, frustrations, goals, aspirations
       - Map to interest categories (productivity, entertainment, education, lifestyle, tech, health, etc)
       - Score: interest_frequency (how often mentioned across sources)
    
    B) AUDIENCE_VALUES & DRIVERS:
       - Value signals: efficiency, community, authenticity, innovation, sustainability, etc
       - Behavioral signals: early adopters vs. late majority, price-sensitive vs. quality-focused
       - Motivation drivers: curiosity, problem-solving, entertainment, learning, social proof
    
    C) AUDIENCE_BEHAVIOR_PATTERNS:
       - Content consumption patterns: binge watching vs. short sessions, passive vs. interactive
       - Engagement patterns: comment frequency, share behavior, recommendation trust
       - Search behavior: research frequency before purchasing, impulse vs. planned decisions
       - Community behavior: solo creators vs. community engagement, trusted sources vs. algorithm-driven
    
    Build psychographic_profile = {
      "primary_interests": [interest_1, interest_2, interest_3],
      "pain_points": [pain_1, pain_2, pain_3],
      "core_values": [value_1, value_2],
      "adoption_stage": "EARLY_ADOPTER | MAINSTREAM | LATE_ADOPTER",
      "engagement_style": "INTERACTIVE | PASSIVE | MIXED",
      "content_consumption_pattern": "BINGE | SNACKING | FOCUSED_LEARNING",
      "trust_drivers": ["authenticity", "expertise", "community", "results"],
      "psychographic_confidence": 0.0-1.0
    }

STEP 4: ANALYZE_PLATFORM_AUDIENCE_DISTRIBUTION
  For each keyword, determine where this audience is most active:
    
    A) PLATFORM_PRESENCE_ANALYSIS:
       - For each creator_platform (YouTube, TikTok, Instagram, Twitch, Podcast, etc):
         * Estimate audience_concentration (% of this keyword's audience on this platform)
         * Engagement_rate (typical engagement for this keyword on this platform)
         * Content_format_affinity (does this audience prefer shorts, long-form, etc on this platform)
    
    B) PLATFORM_GROWTH_TRAJECTORY:
       - Is audience on this platform growing (expanding demand for this keyword)
       - Mature (stable demand) or declining (decreasing engagement)
       - Seasonal patterns (if applicable)
    
    Build platform_distribution = {
      "YouTube": {
        "audience_concentration": percentage,
        "engagement_rate": float,
        "content_format_affinity": "SHORTS|LONG_FORM|MIXED",
        "growth_trajectory": "GROWING|STABLE|DECLINING"
      },
      ... for each platform
    }

STEP 5: IDENTIFY_UNDERSERVED_AUDIENCE_SEGMENTS
  For each keyword:
    
    A) SEGMENT_IDENTIFICATION:
       - Break audience by age group, geography, device type, adoption stage
       - For each segment, research: creator_count_serving_this_segment
       - Identify segments with HIGH_audience_size but LOW_creator_coverage (underserved)
    
    B) SEGMENT_OPPORTUNITY_SCORING:
       segment_opportunity = audience_size_in_segment * (1 - creator_saturation_ratio) * creator_fit_bonus
       - creator_saturation_ratio: count_creators / total_possible_creators (0-1)
       - creator_fit_bonus: +25 if creator matches segment_age, +20 if matches location/language, etc
    
    C) UNDERSERVED_SEGMENT_RANKING:
       Rank segments by opportunity_score, identify Top 5 most underserved segments
       Example: "25-34 year old females in Southeast Asia" (large audience, few local creators)

STEP 6: MAP_AUDIENCE_TO_CREATOR_STRENGTH
  For each keyword + audience demographic:
    
    A) CREATOR_AUDIENCE_ALIGNMENT_ANALYSIS:
       - Compare keyword_audience demographics to creator_audience_profile
       - Calculate overlap_score = (audience match % across age, geography, language, interests)
       - bonus_for_underserved_audience = +30 if creator serving audience underrepresented by competitors
    
    B) CREATOR_CAPABILITY_MATCH:
       - Can creator authentically serve this audience?
       - Creator_platform_overlap = creator_platforms ∩ audience_platforms (intersection)
       - Format_match = recommended_content_format ∩ audience_preferred_format
       - Language_match = creator_language vs. audience_language
    
    C) GROWTH_POTENTIAL_SCORE:
       growth_potential = audience_growth_trajectory * market_saturation * creator_fit_bonus
       - Higher if audience growing + underserved + good creator fit
       - Lower if audience stable/declining or saturated

STEP 7: BUILD_AUDIENCE_PERSONA_PROFILES
  For each keyword, create audience persona objects:
    
    persona_profile = {
      "keyword": string,
      "persona_name": auto-generated (e.g., "Tech-Savvy Productivity Seeker - TAUS"),
      "demographic_profile": {
        "primary_age_range": "25-34",
        "age_distribution": {...},
        "gender_distribution": {...},
        "primary_geography": "North America",
        "geographic_distribution": {...},
        "primary_language": "English",
        "device_preference": {...},
        "timezone_concentration": [...]
      },
      "psychographic_profile": {
        "primary_interests": [...],
        "pain_points": [...],
        "core_values": [...],
        "adoption_stage": "EARLY_ADOPTER",
        "engagement_style": "INTERACTIVE",
        "content_consumption": "SNACKING",
        "trust_drivers": [...]
      },
      "platform_distribution": {
        "YouTube": {...},
        "TikTok": {...},
        ... etc
      },
      "underserved_segments": [
        {
          "segment_description": string,
          "segment_size_estimate": int,
          "creator_coverage_count": int,
          "segment_opportunity_score": 0-100
        }
      ],
      "creator_fit_analysis": {
        "audience_alignment_score": 0-100,
        "platform_match_score": 0-100,
        "format_match_score": 0-100,
        "language_match_score": 0-100,
        "overall_creator_fit": 0-100
      },
      "growth_potential": {
        "audience_growth_trajectory": "GROWING|STABLE|DECLINING",
        "market_saturation": "UNDERSERVED|MODERATE|SATURATED|OVERSATURATED",
        "growth_potential_score": 0-100
      },
      "demographic_mapping_confidence": 0.0-1.0
    }

STEP 8: RANK_PERSONAS_BY_OPPORTUNITY
  - For each keyword, retain persona if demographic_mapping_confidence >= 0.5 (or flag as "low_confidence")
  - Sort personas by: creator_fit_score * growth_potential_score (compound opportunity)
  - Apply diversity filter:
    * Include at least 1 persona with HIGH creator_fit (potential quick wins)
    * Include at least 2 personas with UNDERSERVED segments (blue ocean opportunities)
    * Include demographics matching creator's existing audience (retention validation)

STEP 9: BUILD_AUDIENCE_MAPPING_ENVELOPE
  audience_mapping_envelope = {
    "mapping_id": "AUDMAP-[timestamp]-[creator_id]",
    "source_keywords_count": int (from M-003),
    "personas_generated_count": int,
    "personas_curated_count": int,
    "mapping_strategy": "creator_fit_focused | underserved_segments_focused | growth_potential_focused",
    "overall_mapping_confidence": 0.0-1.0,
    "next_stage_routing": "CWF-130-Topic-Scoring or M-006-viral-pattern-detector"
  }

STEP 10: VALIDATION & EMIT
  Validate audience_mapping_envelope:
  - Each keyword has at least 1 persona (or flag as "persona_generation_failed")
  - Each persona has all required demographic/psychographic/platform/fit sections
  - demographic_mapping_confidence values in 0.0-1.0 range
  - creator_fit_score, growth_potential_score in 0-100 range
  
  IF all keywords generate personas AND overall_mapping_confidence >= 0.8:
    status = "CREATED"
  ELSE IF 70%+ keywords have personas AND overall_mapping_confidence >= 0.6:
    status = "PARTIAL"
    include degradation_flags
  ELSE:
    status = "EMPTY"
    escalate to WF-900 with escalation_type = "audience_mapping_failed"
  
  Emit packet with deterministic lineage
  Write dossier.discovery_vein.audience-demographic-mapper (append_only)
  Register in se_packet_index
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "AUDMAP-[timestamp]-[creator_id]",
  "artifact_family": "audience-demographic-mapper_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-120-Topic-Qualification",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO timestamp]",
  "status": "CREATED | PARTIAL | EMPTY",
  "payload": {
    "skill_id": "M-004",
    "skill_name": "Audience Demographic Mapper",
    "mapping_metadata": {
      "source_keywords_count": "[integer from M-003]",
      "personas_generated_total": "[integer]",
      "personas_curated_count": "[integer of high-confidence personas]",
      "mapping_strategy": "[creator_fit_focused|underserved_segments_focused|growth_potential_focused]",
      "overall_mapping_confidence": "[0.0-1.0]",
      "data_sources_queried": ["Google_Analytics", "YouTube_Insights", "TikTok_Analytics", "Reddit", "Twitter", "Quora"]
    },
    "audience_persona_profiles": [
      {
        "keyword": "[string from M-003]",
        "persona_id": "[PERSONA-keyword_hash-timestamp]",
        "persona_name": "[auto-generated, e.g., Tech-Savvy Productivity Seeker (TSPS)]",
        "demographic_profile": {
          "primary_age_range": "[13-24|25-34|35-44|45-54|55-64|65+]",
          "age_distribution": {
            "13-24": "[percentage]",
            "25-34": "[percentage]",
            "35-44": "[percentage]",
            "45-54": "[percentage]",
            "55-64": "[percentage]",
            "65+": "[percentage]"
          },
          "gender_distribution": {
            "male": "[percentage]",
            "female": "[percentage]",
            "other": "[percentage]",
            "unspecified": "[percentage]"
          },
          "primary_geography": "[country/region]",
          "geographic_distribution": {
            "[country_1]": "[percentage]",
            "[country_2]": "[percentage]"
          },
          "primary_language": "[string]",
          "device_preference": {
            "mobile": "[percentage]",
            "desktop": "[percentage]",
            "tablet": "[percentage]"
          },
          "timezone_concentration": ["[timezone_1]", "[timezone_2]"]
        },
        "psychographic_profile": {
          "primary_interests": ["[interest_1]", "[interest_2]", "[interest_3]"],
          "pain_points": ["[pain_1]", "[pain_2]", "[pain_3]"],
          "core_values": ["[value_1]", "[value_2]"],
          "adoption_stage": "[EARLY_ADOPTER|MAINSTREAM|LATE_ADOPTER]",
          "engagement_style": "[INTERACTIVE|PASSIVE|MIXED]",
          "content_consumption_pattern": "[BINGE|SNACKING|FOCUSED_LEARNING]",
          "trust_drivers": ["[driver_1]", "[driver_2]"],
          "psychographic_confidence": "[0.0-1.0]"
        },
        "platform_distribution": {
          "YouTube": {
            "audience_concentration_percent": "[percentage]",
            "engagement_rate": "[float]",
            "content_format_affinity": "[SHORTS|LONG_FORM|MIXED]",
            "growth_trajectory": "[GROWING|STABLE|DECLINING]"
          },
          "TikTok": {
            "audience_concentration_percent": "[percentage]",
            "engagement_rate": "[float]",
            "content_format_affinity": "[SHORTS|LONG_FORM|MIXED]",
            "growth_trajectory": "[GROWING|STABLE|DECLINING]"
          }
        },
        "underserved_segments": [
          {
            "segment_description": "[e.g., '25-34 year old females in Southeast Asia']",
            "estimated_segment_size": "[integer audience count estimate]",
            "creators_serving_segment": "[integer]",
            "audience_underserved_level": "[HIGHLY_UNDERSERVED|UNDERSERVED|MODERATE|SATURATED]",
            "segment_opportunity_score": "[0-100]"
          }
        ],
        "creator_fit_analysis": {
          "audience_alignment_score": "[0-100]",
          "platform_match_score": "[0-100]",
          "format_compatibility_score": "[0-100]",
          "language_match_score": "[0-100]",
          "overall_creator_fit_score": "[0-100]",
          "fit_assessment": "[STRONG_FIT|GOOD_FIT|MODERATE_FIT|WEAK_FIT]"
        },
        "growth_potential_analysis": {
          "audience_growth_trajectory": "[GROWING|STABLE|DECLINING]",
          "market_saturation_level": "[UNDERSERVED|MODERATE|SATURATED|OVERSATURATED]",
          "market_saturation_creator_count": "[integer]",
          "growth_potential_score": "[0-100]",
          "market_opportunity_window": "[immediate|3-6_months|6-12_months|12+_months]"
        },
        "demographic_mapping_confidence": "[0.0-1.0]"
      }
    ],
    "audience_mapping_summary": {
      "mapping_id": "[AUDMAP-timestamp-creator_id]",
      "total_keywords_analyzed": "[integer]",
      "keywords_with_high_confidence_personas": "[count >= 0.8 confidence]",
      "keywords_with_moderate_confidence_personas": "[count 0.6-0.8 confidence]",
      "keywords_with_low_confidence_personas": "[count < 0.6 confidence]",
      "most_underserved_segments": [
        {
          "segment": "[string]",
          "opportunity_score": "[0-100]",
          "keyword": "[associated keyword]"
        }
      ],
      "recommended_audience_focus_strategy": "[string recommendation]",
      "next_stage_recommendations": [
        "M-006-viral-pattern-detector",
        "CWF-130-Topic-Scoring"
      ]
    },
    "governance": {
      "created_by": "M-004-audience-demographic-mapper",
      "escalation_trigger": "[none|insufficient_data|mapping_failed|low_confidence]",
      "audit_trail_ref": "[audit_event_id]"
    }
  }
}
```

**Write Targets:**
- `dossier.discovery_vein.audience-demographic-mapper` (append_only array)
- `se_packet_index` (one row with family=audience-demographic-mapper_packet, source=M-004, overall_mapping_confidence, persona_count)

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
- dossier.topic_intelligence_vein.audience-demographic-mapper (append_only)
- se_packet_index row for packet traceability

**Forbidden Mutations:**
- overwrite of prior dossier values
- write to unrelated namespaces
- mutation without packet metadata

## 11. Failure Modes & Recovery

**Failure Mode 1: Demographic Data Source Timeout**
- Detection: 3+ demographic sources (Google Analytics, YouTube Insights, TikTok, Reddit, Twitter, Quora) timeout or return insufficient data
- Escalation: Return PARTIAL status with "demographic_data_degraded" flag, mapping_confidence reduced to 0.5-0.7
- Recovery: Proceed with available sources (minimum 2 required), mark personas with "limited_demographic_coverage" flag
- Next Stage: Downstream skills can request demographic refresh or work with partial persona data
- Fallback: If 5+ sources fail → escalate to WF-900 with escalation_type = "demographic_data_unavailable"

**Failure Mode 2: Weak Psychographic Signal Coverage**
- Detection: 50%+ personas have psychographic_confidence < 0.4 (insufficient pain points, values, behavior insights)
- Escalation: Return PARTIAL status with "weak_psychographic_signals" flag
- Recovery: Flag personas as "psychographic_incomplete", recommend manual psychographic research before content creation
- Next Stage: Creator can proceed with demographic data but should validate psychographic assumptions manually
- Action: Recommend deep-dive Reddit/Quora research for missing psychographic signals

**Failure Mode 3: No Underserved Segments Identified**
- Detection: All personas have market_saturation = SATURATED (few/no underserved audience segments found)
- Escalation: Return PARTIAL status with "no_underserved_segments" flag
- Recovery: Relax saturation threshold, include MODERATE saturation segments as "moderate_opportunity"
- Next Stage: Acknowledge market saturation but provide persona data; creator must find unique angle
- Recommendation: Focus on differentiation strategy (format, angle, positioning) vs. audience discovery

**Failure Mode 4: Low Creator-Audience Fit Across All Personas**
- Detection: 70%+ personas have overall_creator_fit_score < 40 (creator poorly aligned with audiences)
- Escalation: Return PARTIAL status with "creator_audience_mismatch" flag
- Recovery: Flag as "requires_creator_pivot", recommend keywords/audiences with STRONGER creator fit
- Next Stage: Creator should reconsider keyword selection or accept reduced conversion potential
- Recommendation: Return to M-003 (Keyword Intelligence) or M-002 (Opportunity Miner) for better-fit opportunities

## 12. Best Practices

- **Multi-Source Demographic Triangulation:** Query minimum 4-6 demographic sources (Google Analytics, YouTube, TikTok, Reddit, Twitter, Quora) and cross-reference signals. Require 2+ sources agreeing on demographic trait for confidence.

- **Age Distribution Determinism:** Use exact age bands (13-24, 25-34, 35-44, 45-54, 55-64, 65+). Do not estimate from single data point; aggregate from minimum 3 sources.

- **Geographic Granularity:** Include both country-level AND city-level data where available. Track timezone distribution for posting-time optimization recommendations.

- **Psychographic Signal Validation:** Pain points and values must be extracted from actual user text (Reddit/Quora comments) or inferred from engagement patterns, never fabricated. Require minimum 5+ mentions of each pain point to include in profile.

- **Platform Affinity Precision:** For each platform, track engagement_rate (comments+shares / total views) separately from audience_concentration. High concentration + low engagement = audience_mismatch_warning.

- **Underserved Segment Identification Formula:** segment_opportunity = audience_size * (1 - creator_saturation) * creator_fit_bonus. Creator saturation = count_creators_serving / theoretical_maximum_creators.

- **Creator Fit Scoring Components:** Always calculate 4 separate fit dimensions (audience_alignment, platform_match, format_compatibility, language_match), then compound them. Individual scores reveal where fit is weak.

- **Growth Trajectory Evidence:** Don't guess audience growth direction; base it on platform analytics trends (search volume increasing, engagement growing over time). Use 3-month trend window minimum for stability.

- **Persona Naming Convention:** Auto-generate descriptive names (Tech-Savvy Productivity Seeker = TSPS format) for easy reference. Include primary_age_range and adoption_stage in name.

- **Confidence Score Multipliers:** demographic_confidence = (data_source_coverage × data_freshness × audience_size_validity) / 3. Penalize if data >60 days old, audience <10K, or <2 sources covering.

- **Deterministic Persona Ranking:** Sort by compound_score = creator_fit_score × growth_potential_score × (1 - market_saturation_ratio). High compound scores indicate best opportunities.

- **Diversity in Persona Curation:** Include at least 1 persona with STRONG creator_fit (quick win), 2+ with UNDERSERVED segments (blue ocean), 1+ matching creator's existing audience (retention validation).

## 13. Validation / Done

**Acceptance Tests:**
- **TEST-PH1-TI-M004-001:** Valid keyword input (200+ keywords from M-003) produces CREATED packet with personas_generated_count >= 200
- **TEST-PH1-TI-M004-002:** Demographic data sources (4+ platforms) successfully queried and aggregated into age_distribution, gender_distribution, geographic_distribution
- **TEST-PH1-TI-M004-003:** Age distribution correctly classified across 6 bands (13-24, 25-34, 35-44, 45-54, 55-64, 65+) with percentages summing to 100%
- **TEST-PH1-TI-M004-004:** Geographic distribution includes country-level and city-level data with timezone tracking for posting-time optimization
- **TEST-PH1-TI-M004-005:** Psychographic signals extracted from actual user text (Reddit/Quora comments) with minimum 5+ mentions threshold per pain point
- **TEST-PH1-TI-M004-006:** Engagement_rate calculated separately from audience_concentration for each platform (detects audience_mismatch when high_concentration + low_engagement)
- **TEST-PH1-TI-M004-007:** Underserved segments correctly identified using formula: segment_opportunity = audience_size × (1 - creator_saturation) × creator_fit_bonus
- **TEST-PH1-TI-M004-008:** Creator fit analysis applies 4 dimensional scores (audience_alignment, platform_match, format_compatibility, language_match) with compound scoring
- **TEST-PH1-TI-M004-009:** Growth trajectory based on platform analytics trends (3-month minimum window) showing GROWING/STABLE/DECLINING status
- **TEST-PH1-TI-M004-010:** Persona auto-naming follows convention (e.g., "Tech-Savvy Productivity Seeker (TSPS)") with age_range + adoption_stage included
- **TEST-PH1-TI-M004-011:** Demographic confidence calculation applies multipliers (source_coverage × freshness × audience_validity) / 3 with 0.4 floor for reporting
- **TEST-PH1-TI-M004-012:** Demographic data source timeout (3+ sources fail) returns PARTIAL with "demographic_data_degraded" flag, mapping_confidence 0.5-0.7
- **TEST-PH1-TI-M004-013:** Weak psychographic signals (50%+ personas < 0.4 confidence) returns PARTIAL with "weak_psychographic_signals" flag + manual research recommendation
- **TEST-PH1-TI-M004-014:** No underserved segments found (all SATURATED market) returns PARTIAL with "no_underserved_segments" flag, relaxed saturation threshold recovery
- **TEST-PH1-TI-M004-015:** Low creator-audience fit (70%+ personas fit_score < 40) returns PARTIAL with "creator_audience_mismatch" flag, recommends keyword re-selection
- **TEST-PH1-TI-M004-016:** Persona curation enforces diversity: min 1 STRONG_FIT, 2+ UNDERSERVED segments, 1+ matching creator's existing_audience
- **TEST-PH1-TI-M004-017:** Dossier patch appended (append_only) to dossier.discovery_vein.audience-demographic-mapper with no overwrites
- **TEST-PH1-TI-M004-018:** se_packet_index row created with mapping_id, overall_mapping_confidence, persona_count, source=M-004
- **TEST-PH1-TI-M004-019:** Replay of same dossier_id within 30d produces identical persona ranking (deterministic)

**Done Criteria:**
- ✅ Demographic data collection queries 6 sources (GA, YouTube, TikTok, Reddit, Twitter, Quora) with fallback behavior for timeouts
- ✅ Age distribution classification deterministic (exact 6 age bands) with percentages aggregated from minimum 2+ sources
- ✅ Geographic distribution includes both country-level and city-level data with timezone tracking
- ✅ Psychographic profile extraction validates with minimum 5+ text mentions per pain point / value / interest (no fabrication)
- ✅ Platform distribution tracking includes engagement_rate calculation (detects audience_mismatch scenarios)
- ✅ Growth trajectory based on 3-month minimum analytics window (GROWING/STABLE/DECLINING deterministic)
- ✅ Underserved segment identification uses compound formula: audience_size × (1 - saturation) × fit_bonus
- ✅ Creator fit analysis applies 4 dimensional scoring (audience, platform, format, language) with compound scoring
- ✅ Persona naming auto-generated with descriptive convention (age_range + adoption_stage + characteristics)
- ✅ Demographic confidence calculation documented with multiplier formula (source_coverage × freshness × audience_validity)
- ✅ Personas ranked deterministically by: creator_fit_score × growth_potential_score × (1 - market_saturation)
- ✅ Output packet includes all required sections (mapping_metadata, audience_persona_profiles, audience_mapping_summary, governance)
- ✅ All 4 failure modes have explicit detection, escalation path, and recovery action
- ✅ Partial status emitted for degraded data (source timeouts, weak signals, saturation, mismatch) without escalating every gap
- ✅ Escalation path (WF-900) reserved only for unrecoverable errors (no demographic data, mapping failure)
- ✅ Dossier write validated as append_only with no overwrite of prior demographic mapping records
- ✅ Overall mapping confidence score calculated from source_coverage + psychographic_completeness + creator_fit_distribution
- ✅ Test suite covers happy path + all 4 failure modes + edge cases (timeout, weak_psychographics, saturation, fit_mismatch)
- ✅ Deterministic replay guaranteed within 30d (same input = same persona ranking)
