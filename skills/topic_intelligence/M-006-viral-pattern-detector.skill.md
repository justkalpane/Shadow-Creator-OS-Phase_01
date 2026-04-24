# SKL-PH1-VIRAL-PATTERN-DETECTOR

## 1. Skill Identity
- **Skill ID:** M-006
- **Skill Name:** Viral Pattern Detector
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-WF
- **Consumer Workflows:** WF-100, CWF-110, CWF-120, CWF-130, CWF-140
- **Vein/Route/Stage:** topic_intelligence_vein / topic_to_script / Stage_A_Topic

## 2. Purpose
Runtime-ready canonical skill artifact for M-006 (Viral Pattern Detector). This specification follows repository DNA law and enforces deterministic execution, packet lineage, governance-safe escalation, and patch-only mutation discipline.

## 3. DNA Injection
- **Role Definition:** viral-pattern-detector_executor
- **DNA Archetype:** Narada
- **Behavior Model:** deterministic, registry-bound, escalation-safe
- **Operating Method:** ingest -> validate -> execute -> emit -> index
- **Working Style:** evidence-first, schema-locked, replay-aware

## 4. Workflow Injection
- **Producer:** WF
- **Direct Consumers:** WF-100, CWF-110, CWF-120, CWF-130, CWF-140
- **Upstream Dependencies:** workflow_registry, skill_loader_registry, dossier packet context
- **Downstream Handoff:** viral-pattern-detector_packet -> downstream workflow chain
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

The Viral Pattern Detector analyzes successful content in each opportunity's keyword/audience space to extract replicable viral patterns. It identifies content structures, hooks, pacing, platform-specific signals, and timing that drive viral engagement, then scores opportunities by viral potential.

```
STEP 1: VALIDATE INPUTS & LOAD PERSONAS_AND_KEYWORDS
  - Input: dossier_id, audience_demographic_mapper_packet (from M-004) + keyword_intelligence_miner_packet (from M-003)
  - Validate payload contains:
    * audience_persona_profiles (with creator_fit, psychographics, platform_distribution)
    * keyword_intelligence_profiles (with keyword, intent, recommended_format, gap_opportunities)
    * overall_mapping_confidence >= 0.6 (or flag as "low_confidence_mapping")
  - Load creator context: creator_content_formats, creator_platforms, content_patterns, engagement_history
  
  Validation: If audience_persona_profiles OR keyword_intelligence_profiles empty → escalate
  Confidence floor: >=0.6 to proceed

STEP 2: FOR EACH KEYWORD-AUDIENCE COMBO, RESEARCH VIRAL CONTENT
  For each keyword + matching persona:
    
    A) QUERY_VIRAL_CONTENT_FOR_KEYWORD:
       - Search Top 20-50 most viral posts for this keyword (by engagement metrics)
       - Platforms queried: YouTube, TikTok, Instagram Reels, Twitter, Reddit (based on platform_distribution)
       - Sort by: engagement_rate (engagement / total_views), NOT just total_views
         * Prefer: high engagement_rate (indicates strong audience resonance)
         * Minimum videos/posts: 10 per keyword (or flag as "insufficient_viral_samples")
       
       For each top viral content sample, extract:
         * content_id, platform, creator_handle, views, engagement_count
         * engagement_breakdown: likes, comments, shares, saves
         * engagement_rate: (likes + comments + shares + saves) / views
         * viral_velocity: engagement_rate / days_since_publication (how quickly went viral)
         * content_format: short_form | long_form | educational | entertainment | hybrid
    
    B) IDENTIFY_CONTENT_HOOKS:
       Extract the "hook" (first 3 seconds / first line) from each viral sample:
         - Hook type: curiosity_gap ("Wait until..."), pattern_interrupt ("You've been doing this wrong..."), 
                       benefit_promise ("This changed my..."), emotional_trigger (funny, shocking, inspiring)
         - Hook_element: specific phrase, visual element, or pattern used
         - Hook_effectiveness: frequency_of_hook_across_samples / total_samples
       
       Build: hook_patterns = [
         {hook_type, hook_element, effectiveness_score, platform_specific}
       ]
    
    C) EXTRACT_CONTENT_STRUCTURE_PATTERNS:
       For long-form content (YouTube, longer TikToks):
         - Opening structure: hook type + duration (0-3s typical)
         - Body structure: pacing (slow reveal vs quick succession), pattern (list, story, problem-solution)
         - Climax/transition: where viewers get "hooked in" (typically 15-30% into content)
         - CTA structure: when/how call-to-action appears (beginning, middle, end, multiple)
       
       For short-form content (TikTok, Reels, Shorts):
         - Frame 1: hook type + visual impact
         - Pacing: quick cuts? slow reveals? music syncing?
         - Retention pattern: "keep watching because..." signal (cliffhanger, curiosity, pattern expectancy)
         - Ending: abrupt end? resolution? CTA placement?
       
       Build: structure_patterns = [
         {content_format, structure_type, pacing, effectiveness_score}
       ]
    
    D) IDENTIFY_PLATFORM_SPECIFIC_VIRAL_SIGNALS:
       For each platform (YouTube, TikTok, Instagram, Twitter, etc):
         - Algorithm preference: does algorithm favor certain hook types? structures? lengths?
         - Timing signal: when does content peak (immediate vs. slow burn)?
         - Format affinity: which format performs best on this platform for this keyword?
         - Engagement type preference: comments-driven vs. shares-driven vs. watch-time-driven?
       
       Build: platform_viral_signals = {
         "YouTube": {hook_preference, structure_affinity, optimal_length, engagement_driver},
         "TikTok": {...},
         ... etc
       }

STEP 3: ANALYZE_VIRAL_ELEMENT_FREQUENCIES
  - For each extracted hook, structure, CTA pattern, calculate:
    * frequency_score: % of top viral samples using this element
    * effectiveness_score: avg_engagement_rate for samples using this element
    * reliability_score: (# samples with element AND high_engagement) / (# samples with element)
  
  - Only include patterns that appear in 30%+ of samples AND avg_engagement >= platform_median
  - This filters out noise and identifies genuinely viral patterns

STEP 4: SCORE_OPPORTUNITIES_BY_VIRAL_POTENTIAL
  For each keyword-audience combo:
    
    A) HOOK_ALIGNMENT_ANALYSIS:
       - Identify: which hooks resonate best with the persona (based on psychographic profile)
       - Creator_strength: can creator execute hooks (emotional authenticity, humor, expertise)?
       - hook_alignment_score = (persona_psychographic_match) * (creator_execution_capability)
    
    B) STRUCTURE_CREATOR_FIT:
       - Can creator naturally follow identified structures? (don't force unnatural pacing)
       - Creator_native_structure = closest_match_to_creator's_existing_format
       - structure_fit_score = (identified_pattern_effectiveness) * (creator_replication_ease)
    
    C) PLATFORM_ALGORITHM_FIT:
       - For each platform in creator_platforms:
         * platform_algorithm_score = viral_pattern_alignment_on_platform * creator_growth_stage_advantage
         * Growth_stage_advantage: new creators may benefit from authenticity over high-production
       
       compound_platform_score = avg(platform_scores across creator_platforms)
    
    D) TIMING_AND_VELOCITY_SIGNAL:
       - viral_velocity = engagement_rate / days_to_peak
       - High velocity = fast-moving trend (requires quick execution)
       - Low velocity = slower build (allows more careful content planning)
       - timing_risk_score = (velocity_of_trend) * (creator_execution_speed_capability)
    
    E) VIRAL_POTENTIAL_SCORE (0-100):
       base_score = 50
       + hook_alignment_score (0-25)
       + structure_fit_score (0-25)
       + compound_platform_score (0-20)
       + viral_velocity_bonus (0-10, reward high-velocity trends for explosive growth potential)
       - execution_complexity_penalty (0-15, harder patterns = more difficult to execute well)
       
       viral_potential_score = min(100, max(0, base_score))

STEP 5: BUILD_VIRAL_PATTERN_PROFILES
  For each keyword-audience combo, create viral_pattern object:
    
    viral_pattern_profile = {
      "keyword": string,
      "audience_persona_id": string,
      "identified_viral_hooks": [
        {
          "hook_type": "curiosity_gap | pattern_interrupt | benefit_promise | emotional_trigger",
          "hook_element": string (specific phrase or visual),
          "effectiveness_score": 0-100,
          "creator_execution_difficulty": "LOW | MEDIUM | HIGH",
          "psychographic_persona_match": 0-100
        }
      ],
      "identified_content_structures": [
        {
          "content_format": "short_form | long_form | hybrid",
          "structure_name": string,
          "key_elements": [element_1, element_2, element_3],
          "pacing_pattern": string (quick_cuts | slow_reveal | rhythmic),
          "effectiveness_score": 0-100,
          "creator_replication_ease": 0-100,
          "estimated_time_to_produce": "hours or days estimate"
        }
      ],
      "platform_specific_viral_signals": {
        "YouTube": {
          "hook_preference": string,
          "optimal_length_seconds": int,
          "engagement_driver": "watch_time | comments | shares | saves",
          "algorithm_affinity_score": 0-100
        },
        "TikTok": {...},
        ... etc
      },
      "trending_lifecycle": {
        "lifecycle_stage": "EMERGING | ACCELERATING | PEAK | SUSTAINING | DECLINING",
        "viral_velocity": float (engagement_rate / days_to_peak),
        "estimated_time_to_saturation": "days or weeks"
      },
      "viral_potential_score": 0-100,
      "creator_viral_execution_risk": "LOW | MEDIUM | HIGH",
      "viral_pattern_confidence": 0.0-1.0
    }

STEP 6: RANK_OPPORTUNITIES_BY_VIRAL_POTENTIAL
  - For each keyword, rank by viral_potential_score (descending)
  - Apply filtering:
    * Include at least 1 opportunity with LOW execution_risk (safe bet)
    * Include at least 2 opportunities with HIGH viral_potential (moonshot opportunities)
    * Balance between EMERGING (high upside, unproven) and SUSTAINING (proven, less explosive)
  - Sort final list by: viral_potential_score * creator_execution_capability (compound opportunity)

STEP 7: BUILD_VIRAL_PATTERN_MINING_ENVELOPE
  viral_pattern_mining_envelope = {
    "mining_id": "VIRAL-[timestamp]-[creator_id]",
    "source_keywords_count": int (from M-003),
    "source_personas_count": int (from M-004),
    "viral_patterns_identified": int,
    "high_confidence_patterns": int (confidence >= 0.8),
    "creator_execution_risk_profile": "LOW_RISK | BALANCED | HIGH_RISK",
    "overall_viral_mining_confidence": 0.0-1.0,
    "next_stage_routing": "M-007-algorithm-signal-monitor or CWF-130-Topic-Scoring"
  }

STEP 8: VALIDATION & EMIT
  Validate viral_pattern_mining_envelope:
  - Each keyword has viral_pattern_profile (or flag as "pattern_generation_failed")
  - identified_viral_hooks array non-empty (minimum 2-3 hooks per keyword)
  - identified_content_structures array non-empty
  - platform_specific_viral_signals populated for creator_platforms
  - viral_potential_score in 0-100 range
  - viral_pattern_confidence in 0.0-1.0 range
  
  IF all keywords have viral patterns AND overall_viral_mining_confidence >= 0.8:
    status = "CREATED"
  ELSE IF 70%+ keywords have patterns AND overall_viral_mining_confidence >= 0.6:
    status = "PARTIAL"
    include degradation_flags
  ELSE:
    status = "EMPTY"
    escalate to WF-900 with escalation_type = "viral_pattern_mining_failed"
  
  Emit packet with deterministic lineage
  Write dossier.discovery_vein.viral-pattern-detector (append_only)
  Register in se_packet_index
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "VIRAL-[timestamp]-[creator_id]",
  "artifact_family": "viral-pattern-detector_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-130-Topic-Scoring",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO timestamp]",
  "status": "CREATED | PARTIAL | EMPTY",
  "payload": {
    "skill_id": "M-006",
    "skill_name": "Viral Pattern Detector",
    "viral_mining_metadata": {
      "source_keywords_count": "[integer from M-003]",
      "source_personas_count": "[integer from M-004]",
      "keyword_persona_combinations_analyzed": "[integer]",
      "viral_patterns_identified_total": "[integer]",
      "high_confidence_patterns_count": "[count >= 0.8 confidence]",
      "overall_mining_confidence": "[0.0-1.0]",
      "data_sources_queried": ["YouTube", "TikTok", "Instagram_Reels", "Twitter", "Reddit"]
    },
    "viral_pattern_profiles": [
      {
        "keyword": "[string]",
        "audience_persona_id": "[from M-004]",
        "identified_viral_hooks": [
          {
            "hook_type": "[curiosity_gap|pattern_interrupt|benefit_promise|emotional_trigger]",
            "hook_element": "[specific phrase or visual element]",
            "effectiveness_score": "[0-100]",
            "creator_execution_difficulty": "[LOW|MEDIUM|HIGH]",
            "psychographic_persona_alignment": "[0-100]"
          }
        ],
        "identified_content_structures": [
          {
            "content_format": "[short_form|long_form|hybrid]",
            "structure_name": "[string]",
            "key_elements": ["[element1]", "[element2]"],
            "pacing_pattern": "[quick_cuts|slow_reveal|rhythmic]",
            "effectiveness_score": "[0-100]",
            "creator_replication_difficulty": "[LOW|MEDIUM|HIGH]",
            "estimated_production_time": "[hours or days]"
          }
        ],
        "platform_viral_signals": {
          "YouTube": {
            "hook_type_preference": "[string]",
            "optimal_video_length_seconds": "[integer]",
            "engagement_driver": "[watch_time|comments|shares|saves]",
            "algorithm_affinity_score": "[0-100]"
          },
          "TikTok": {
            "hook_type_preference": "[string]",
            "optimal_video_length_seconds": "[integer]",
            "engagement_driver": "[string]",
            "algorithm_affinity_score": "[0-100]"
          }
        },
        "trending_lifecycle_analysis": {
          "lifecycle_stage": "[EMERGING|ACCELERATING|PEAK|SUSTAINING|DECLINING]",
          "viral_velocity": "[float - engagement_rate / days_to_peak]",
          "estimated_saturation_timeline": "[days or weeks estimate]"
        },
        "viral_potential_score": "[0-100]",
        "creator_execution_risk_level": "[LOW|MEDIUM|HIGH]",
        "viral_pattern_confidence": "[0.0-1.0]"
      }
    ],
    "viral_pattern_mining_summary": {
      "mining_id": "[VIRAL-timestamp-creator_id]",
      "total_keywords_analyzed": "[integer]",
      "patterns_with_high_confidence": "[count >= 0.8]",
      "patterns_with_moderate_confidence": "[count 0.6-0.8]",
      "patterns_with_low_confidence": "[count < 0.6]",
      "creator_execution_risk_profile": "[LOW_RISK|BALANCED|HIGH_RISK]",
      "most_viral_opportunities": [
        {
          "keyword": "[string]",
          "viral_potential_score": "[0-100]",
          "primary_hook_type": "[string]",
          "recommended_platform_focus": "[platform_name]"
        }
      ],
      "next_stage_recommendations": [
        "M-007-algorithm-signal-monitor",
        "CWF-130-Topic-Scoring"
      ]
    },
    "governance": {
      "created_by": "M-006-viral-pattern-detector",
      "escalation_trigger": "[none|insufficient_data|pattern_mining_failed|low_confidence]",
      "audit_trail_ref": "[audit_event_id]"
    }
  }
}
```

**Write Targets:**
- `dossier.discovery_vein.viral-pattern-detector` (append_only array)
- `se_packet_index` (one row with family=viral-pattern-detector_packet, source=M-006, overall_mining_confidence, pattern_count)

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
- dossier.topic_intelligence_vein.viral-pattern-detector (append_only)
- se_packet_index row for packet traceability

**Forbidden Mutations:**
- overwrite of prior dossier values
- write to unrelated namespaces
- mutation without packet metadata

## 11. Failure Modes & Recovery

**Failure Mode 1: Insufficient Viral Content Samples**
- Detection: <10 viral content samples found per keyword (insufficient data to identify patterns)
- Escalation: Return PARTIAL status with "insufficient_viral_samples" flag, pattern_confidence reduced
- Recovery: Proceed with available samples (minimum 5 acceptable), mark patterns as "limited_sample_size"
- Next Stage: Downstream skills can request expanded viral content research or work with partial patterns
- Action: Recommend broader keyword query or temporal expansion (look at viral content from past 90 days)

**Failure Mode 2: Hook Extraction Ambiguity**
- Detection: Unable to identify clear hooks from 50%+ viral content samples (hooks too varied or subtle)
- Escalation: Return PARTIAL status with "ambiguous_hook_signals" flag
- Recovery: Flag as "hook_pattern_unclear", recommend manual hook analysis before content creation
- Next Stage: Creator should study successful examples manually to develop hook intuition
- Recommendation: Focus on structure patterns instead of specific hooks

**Failure Mode 3: Creator Execution Capability Mismatch**
- Detection: Identified viral patterns require HIGH execution difficulty, creator_capability = LOW
- Escalation: Mark patterns with "execution_risk: HIGH", viral_potential_score discounted by -25
- Recovery: Filter to only LOW/MEDIUM execution patterns, or flag as "requires_skill_development"
- Next Stage: Creator can build skills before executing high-complexity patterns
- Action: Recommend starting with LOW_RISK patterns to build confidence and execution capability

**Failure Mode 4: Platform Algorithm Misalignment**
- Detection: Optimal viral patterns for keyword don't align with creator_platforms (e.g., TikTok patterns for podcast creator)
- Escalation: Mark patterns with "platform_mismatch_warning", recommend platform_adaptation
- Recovery: Include "cross-platform_adaptation_difficulty" score, suggest format adaptations
- Next Stage: Creator can adapt patterns to native platform or expand to new platform
- Recommendation: Prioritize patterns that translate well to creator's native platforms

## 12. Best Practices

- **Engagement-Based Ranking Over Vanity Metrics:** Rank viral samples by engagement_rate (engagement / views), NOT total_views. High engagement_rate = audience resonance, not just reach.

- **Minimum Viable Samples:** Require minimum 10 viral samples per keyword to identify patterns, 5 as absolute floor. Patterns from <5 samples are statistical noise.

- **Hook Extraction Precision:** Extract only hooks that appear in 30%+ of samples with corresponding high_engagement. Ignore edge-case hooks (outliers, one-off phenomena).

- **Frequency + Effectiveness Dual Criteria:** Score patterns by BOTH frequency (% of samples) AND effectiveness (avg_engagement of samples using pattern). Low frequency + high effectiveness = unreliable.

- **Platform-Specific Pattern Isolation:** Analyze YouTube patterns separately from TikTok patterns separately from Twitter, etc. Cross-platform generalization is unreliable.

- **Creator Execution Difficulty Honesty:** Score execution difficulty based on actual creator capability, not pattern elegance. High-production patterns are HIGH_DIFFICULTY for bootstrapped creators.

- **Viral Velocity Signal Interpretation:** High viral_velocity (engagement_rate / days_to_peak) = fast trend window, requires quick execution. Low velocity = slower build, more time to plan.

- **Lifecycle Stage Timing:** EMERGING patterns have high upside but unproven effectiveness. PEAK patterns are proven but saturated. SUSTAINING patterns are stable but declining. Balance portfolio.

- **Psychographic-Hook Alignment:** Match identified hooks to audience psychographic profile (pain_points, values, interests). Curiosity_gap hooks for problem-solvers, emotional_triggers for value-driven audiences.

- **Structure Authenticity Preservation:** Never force creators to follow structures that feel unnatural. creator_replication_ease score must reflect whether structure aligns with creator's natural style.

- **Platform Adaptation Cost Transparency:** When top patterns exist on platform X but creator operates on platform Y, calculate adaptation_difficulty score + time_to_learn cost, don't pretend transfer is seamless.

- **Temporal Validation:** Patterns identified from viral content >60 days old should be marked as "historical_pattern_unproven" — social media algorithms evolve, verify recency.

## 13. Validation / Done

**Acceptance Tests:**
- **TEST-PH1-TI-M006-001:** Valid persona + keyword input produces CREATED packet with viral_patterns_identified >= keyword_count
- **TEST-PH1-TI-M006-002:** Viral content samples queried from 5+ sources (YouTube, TikTok, Instagram, Twitter, Reddit) with minimum 10 samples per keyword (or 5 minimum floor)
- **TEST-PH1-TI-M006-003:** Engagement_rate correctly calculated (engagement / views) and used for ranking, NOT total_views vanity metric
- **TEST-PH1-TI-M006-004:** Hook types correctly classified (curiosity_gap, pattern_interrupt, benefit_promise, emotional_trigger) with frequency >= 30% threshold for inclusion
- **TEST-PH1-TI-M006-005:** Content structures extracted with key_elements, pacing_pattern, and effectiveness_score for both short_form and long_form formats
- **TEST-PH1-TI-M006-006:** Platform-specific viral signals identified separately for each platform (YouTube, TikTok, Instagram, etc) with hook_preference, optimal_length, engagement_driver
- **TEST-PH1-TI-M006-007:** Viral velocity calculated correctly (engagement_rate / days_to_peak) with lifecycle_stage classification (EMERGING/ACCELERATING/PEAK/SUSTAINING/DECLINING)
- **TEST-PH1-TI-M006-008:** Viral potential score applies all components: hook_alignment (0-25) + structure_fit (0-25) + platform_score (0-20) + velocity_bonus (0-10) - complexity_penalty (0-15)
- **TEST-PH1-TI-M006-009:** Creator execution difficulty scored honestly (HIGH for high-production patterns, LOW for authentic/simple patterns)
- **TEST-PH1-TI-M006-010:** Psychographic-hook alignment verified (hooks match audience pain_points, values, interests from M-004 persona)
- **TEST-PH1-TI-M006-011:** Insufficient viral samples (<10 per keyword) returns PARTIAL with "insufficient_viral_samples" flag, pattern_confidence reduced, minimum 5 floor acceptable
- **TEST-PH1-TI-M006-012:** Hook extraction ambiguity (50%+ samples unclear hooks) returns PARTIAL with "ambiguous_hook_signals" flag, recommends manual analysis
- **TEST-PH1-TI-M006-013:** Creator execution mismatch (patterns require HIGH difficulty, creator_capability LOW) marks patterns with execution_risk = HIGH, viral_potential discounted -25
- **TEST-PH1-TI-M006-014:** Platform mismatch detected (optimal patterns for platform X, creator on platform Y), adaptation_difficulty scored, alternatives provided
- **TEST-PH1-TI-M006-015:** Dossier patch appended (append_only) to dossier.discovery_vein.viral-pattern-detector with no overwrites
- **TEST-PH1-TI-M006-016:** se_packet_index row created with mining_id, overall_mining_confidence, pattern_count, source=M-006
- **TEST-PH1-TI-M006-017:** Replay of same dossier_id within 30d produces identical pattern ranking (deterministic)

**Done Criteria:**
- ✅ Viral content querying covers 5+ platforms (YouTube, TikTok, Instagram, Twitter, Reddit) with fallback for timeouts
- ✅ Engagement_rate metric properly normalized (engagement / views), used as primary ranking signal over vanity metrics
- ✅ Hook extraction identifies 4 distinct hook types with 30%+ frequency threshold for pattern validity
- ✅ Hook effectiveness scoring based on both frequency (% samples with hook) AND avg_engagement (samples with hook)
- ✅ Content structure extraction identifies key_elements, pacing patterns, CTA placement for short_form and long_form separately
- ✅ Platform-specific viral signals captured separately (YouTube hook_preference ≠ TikTok hook_preference, etc)
- ✅ Viral velocity calculation formula documented (engagement_rate / days_to_peak) with lifecycle stage classification
- ✅ Creator execution difficulty scored based on actual creator_capability, not pattern elegance
- ✅ Psychographic-hook alignment verified (hooks match audience profile pain_points, values, interests)
- ✅ Viral potential score formula documented with all 5 signal components (hook, structure, platform, velocity, complexity)
- ✅ Persona-pattern matching ensures emotional authenticity (creator_replication_ease score reflects natural style fit)
- ✅ Output packet includes all required sections (viral_mining_metadata, viral_pattern_profiles, viral_pattern_mining_summary, governance)
- ✅ All 4 failure modes have explicit detection, escalation path, and recovery action
- ✅ Partial status emitted for degraded data (insufficient samples, ambiguous hooks, execution mismatch, platform mismatch) without escalating every gap
- ✅ Escalation path (WF-900) reserved only for unrecoverable errors (no viral data, pattern mining failure)
- ✅ Dossier write validated as append_only with no overwrite of prior viral pattern records
- ✅ Overall mining confidence score calculated from sample_coverage + pattern_clarity + creator_fit_distribution
- ✅ Test suite covers happy path + all 4 failure modes + edge cases (insufficient_samples, ambiguous_hooks, execution_mismatch, platform_mismatch)
- ✅ Deterministic replay guaranteed within 30d (same input = same pattern ranking)
