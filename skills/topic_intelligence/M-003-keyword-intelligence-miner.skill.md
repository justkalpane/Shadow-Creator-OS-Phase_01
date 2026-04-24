# SKL-PH1-KEYWORD-INTELLIGENCE-MINER

## 1. Skill Identity
- **Skill ID:** M-003
- **Skill Name:** Keyword Intelligence Miner
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-CWF-110-Topic-Discovery, SE-N8N-CWF-130-Topic-Scoring
- **Consumer Workflows:** SE-N8N-CWF-130-Topic-Scoring
- **Vein/Route/Stage:** discovery_vein / topic_to_script / Stage_B_Discovery_and_Scoring

## 2. Purpose
Runtime-ready canonical skill artifact for M-003 (Keyword Intelligence Miner). This specification follows repository DNA law and enforces deterministic execution, packet lineage, governance-safe escalation, and patch-only mutation discipline.

## 3. DNA Injection
- **Role Definition:** keyword-intelligence-miner_executor
- **DNA Archetype:** Chanakya (strategy through evidence)
- **Behavior Model:** deterministic, registry-bound, escalation-safe
- **Operating Method:** ingest -> validate -> execute -> emit -> index
- **Working Style:** evidence-first, schema-locked, replay-aware

## 4. Workflow Injection
- **Producer:** WF
- **Direct Consumers:** SE-N8N-CWF-130-Topic-Scoring
- **Upstream Dependencies:** workflow_registry, skill_loader_registry, dossier packet context
- **Downstream Handoff:** keyword-intelligence-miner_packet -> downstream workflow chain
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

The Keyword Intelligence Miner deep-dives each opportunity to extract actionable keyword research, intent mapping, and content gap intelligence. It builds a searchable, ranked keyword index for each opportunity with creator-optimized recommendations.

```
STEP 1: VALIDATE INPUTS & LOAD OPPORTUNITY_PROFILES
  - Input: dossier_id, topic_opportunity_miner_packet (from M-002)
  - Validate payload contains:
    * curated_opportunities_top_40 (array of opportunity objects with keyword_research seeds)
    * mining_confidence (0.0-1.0)
  - Load creator context: creator_content_formats, creator_genre_affinities, creator_platforms, content_patterns
  
  Validation: If curated_opportunities_top_40 empty → escalate to WF-900 with escalation_type = "no_opportunities_to_research"
  Confidence floor: >=0.6 to proceed

STEP 2: FOR EACH OPPORTUNITY, EXECUTE KEYWORD EXPANSION
  For each opportunity in curated_opportunities_top_40:
    
    A) SEED_KEYWORD_COLLECTION:
       - Extract from opportunity.keyword_research:
         * primary_keywords (main trend keywords)
         * long_tail_keywords (specific variations)
         * related_keywords (synonyms)
       - Validate minimum 5 seed keywords exist; if <5, flag as "keyword_incomplete"
    
    B) KEYWORD_EXPANSION_ANALYSIS:
       For each seed keyword, query expansion sources:
         - Google Suggest API: auto-complete suggestions
         - YouTube Suggest API: video-specific variations
         - TikTok Hashtag API: platform-native variations
         - Search Volume Data: monthly searches for each variant
       
       Expanded keywords = primary + variants + related synonyms
       Minimum: 15-20 keyword variations per opportunity
    
    C) SEARCH_VOLUME_CLASSIFICATION:
       For each expanded keyword, retrieve:
         * monthly_search_volume (absolute searches)
         * competition_level (keyword_difficulty 0-100, from SEO data)
         * trend_velocity (7d_growth_rate for search volume)
         * platforms_where_used (YouTube, Google, TikTok, etc)
       
       Classify keywords by volume tier:
         HIGH_VOLUME: > 50K searches/month
         MEDIUM_VOLUME: 5K-50K searches/month
         LOW_VOLUME: < 5K searches/month (long-tail, niche)

STEP 3: EXTRACT SEARCH INTENT CATEGORIES
  For each keyword, classify search intent:
    
    A) INTENT_TYPE_CLASSIFICATION:
       - Informational: "what is X?", "how to X?", "X explained", "X tutorial"
         → Content: educational, explanatory, tutorial-format
       - Navigational: "best X", "X for beginners", "X [platform]", "X vs Y"
         → Content: comparisons, guides, recommendations
       - Transactional: "buy X", "X download", "X free", "X tool"
         → Content: product reviews, tool recommendations
       - Commercial: "X app", "X software", "X subscription"
         → Content: tool deep-dives, feature breakdowns
    
    B) CREATOR_CONTENT_ALIGNMENT:
       Compare keyword intent to creator_content_formats:
         IF creator strong in tutorials → +20 bonus for INFORMATIONAL intents
         IF creator strong in comparisons → +20 bonus for NAVIGATIONAL intents
         IF creator strong in product reviews → +20 bonus for TRANSACTIONAL/COMMERCIAL intents
       
       intent_alignment_score = 0-100 (based on creator strength fit)

STEP 4: IDENTIFY_CONTENT_GAPS & UNANSWERED_QUESTIONS
  For each keyword + intent:
    
    A) CONTENT_GAP_DETECTION:
       - Search current top results (YouTube, Google) for this keyword
       - Extract: top 10 ranking videos/articles
       - Analyze: what questions do these results NOT answer?
       - Query Reddit, Quora for: "[keyword] question?" searches
       - Extract unanswered questions from comment sections
    
    B) GAP_SCORING:
       - For each gap, score frequency (how many people asking about this gap?)
       - gap_opportunity_score = frequency * creator_alignment_to_answer
       - High gap_opportunity = creator can fill genuine content need
    
    C) GAP_RECOMMENDATIONS:
       Build: gap_recommendations array for each keyword
       Example: keyword="AI tools for creators" → gaps=[
         "How to set up X tool for beginners",
         "Budget-friendly AI tools under $50",
         "AI tools that work without paid subscriptions"
       ]

STEP 5: MAP_KEYWORDS_TO_CONTENT_FORMAT_STRUCTURES
  For each keyword, determine ideal content format:
    
    A) FORMAT_SUITABILITY_ANALYSIS:
       - SHORT_FORM (TikTok/Shorts): Keywords with entertainment/viral potential
         Example: "AI art generator" (visual demo-friendly)
       - LONG_FORM (YouTube): Keywords requiring explanation/depth
         Example: "How does AI work" (explanatory, tutorial-friendly)
       - PODCAST/AUDIO: Keywords with discussion/conversation potential
         Example: "AI ethics" (debate/discussion friendly)
       - TEXT/BLOG: Keywords with detailed guides, comparisons
         Example: "AI tools comparison" (detailed list-friendly)
    
    B) FORMAT_COMPATIBILITY_SCORING:
       For each keyword, score compatibility with creator_primary_formats:
         IF creator native in VIDEO → video-native keywords +25
         IF creator native in AUDIO → audio-friendly keywords +25
         Cross-platform keywords +10 (adaptable)
         Incompatible keywords -15 (force format change)

STEP 6: RANK_KEYWORDS_BY_OPPORTUNITY
  For each keyword, compute keyword_opportunity_score (0-100):
    
    base_score = 50
    + search_volume_signal (0-25):
      IF HIGH_VOLUME: +25
      ELSE IF MEDIUM_VOLUME: +15
      ELSE IF LOW_VOLUME (long-tail): +10 (long-tail less competition)
    + intent_alignment_score (0-25, from STEP 3B)
    + format_compatibility_score (0-25, from STEP 5B)
    + gap_opportunity_bonus (0-15):
      IF high_frequency_gaps exist: +15
      ELSE IF moderate_gaps: +8
      ELSE: 0
    - competition_penalty (0-20):
      IF competition_level > 80: -20
      ELSE IF competition_level > 60: -10
      ELSE: 0
    
    keyword_opportunity_score = min(100, max(0, base_score))

STEP 7: BUILD_KEYWORD_INTELLIGENCE_PROFILES
  For each opportunity, build ranked keyword intelligence:
    
    keyword_intelligence = {
      "opportunity_id": [from M-002],
      "keyword_cohort": [
        {
          "keyword": string,
          "search_volume_monthly": int,
          "search_volume_tier": "HIGH|MEDIUM|LOW",
          "keyword_difficulty": 0-100,
          "trend_velocity_7d": float (% change),
          "intent_type": "INFORMATIONAL|NAVIGATIONAL|TRANSACTIONAL|COMMERCIAL",
          "intent_alignment_score": 0-100,
          "content_gaps": ["gap1", "gap2", "gap3"],
          "gap_opportunity_frequency": int,
          "recommended_format": "SHORT_FORM|LONG_FORM|PODCAST|TEXT",
          "format_compatibility_score": 0-100,
          "keyword_opportunity_score": 0-100,
          "content_structure_recommendation": string (e.g., "Tutorial + Q&A")
        }
      ],
      "keyword_intelligence_summary": {
        "total_keywords_researched": int,
        "keywords_by_volume_tier": {HIGH: count, MEDIUM: count, LOW: count},
        "keywords_by_intent": {INFORMATIONAL: count, NAVIGATIONAL: count, ...},
        "keywords_by_format_fit": {SHORT_FORM: count, LONG_FORM: count, ...},
        "research_confidence": 0.0-1.0
      }
    }

STEP 8: RANK & CURATE KEYWORD_INTELLIGENCE_PROFILES
  - For each opportunity, retain Top 20 keywords (by keyword_opportunity_score)
  - Apply diversity filter:
    * Include at least 1 HIGH_VOLUME keyword (main topic visibility)
    * Include at least 3-5 LOW_VOLUME keywords (long-tail, less competition)
    * Mix intents: include INFORMATIONAL + NAVIGATIONAL + TRANSACTIONAL
  - Sort by: keyword_opportunity_score (descending)

STEP 9: BUILD_KEYWORD_MINING_ENVELOPE
  keyword_mining_envelope = {
    "mining_id": "KEYWRD-[timestamp]-[creator_id]",
    "source_opportunities_count": int (from M-002),
    "keyword_intelligence_profiles_count": int,
    "total_keywords_mined": int,
    "keyword_mining_strategy": "high_volume_focus|long_tail_focus|balanced",
    "research_confidence": 0.0-1.0,
    "next_stage_routing": "CWF-130-Topic-Scoring or M-004-audience-demographic-mapper"
  }

STEP 10: VALIDATION & EMIT
  Validate keyword_intelligence profiles:
  - Each opportunity has keyword_cohort array non-empty (minimum 5 keywords)
  - Each keyword has all required fields (search_volume, intent, format_fit, gaps)
  - keyword_opportunity_score values in 0-100 range
  - Total keywords_mined > 0
  
  IF all opportunities fully researched AND research_confidence >= 0.8:
    status = "CREATED"
  ELSE IF 70%+ opportunities researched AND research_confidence >= 0.6:
    status = "PARTIAL"
    include degradation_flags
  ELSE:
    status = "EMPTY"
    escalate to WF-900
  
  Emit packet with deterministic lineage
  Write dossier.discovery_vein.keyword-intelligence-miner (append_only)
  Register in se_packet_index
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "KEYWRD-[timestamp]-[creator_id]",
  "artifact_family": "keyword-intelligence-miner_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-110-Topic-Discovery, SE-N8N-CWF-130-Topic-Scoring",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO timestamp]",
  "status": "CREATED | PARTIAL | EMPTY",
  "payload": {
    "skill_id": "M-003",
    "skill_name": "Keyword Intelligence Miner",
    "keyword_mining_metadata": {
      "source_opportunities_count": "[integer from M-002]",
      "opportunities_researched": "[integer]",
      "total_keywords_mined": "[integer]",
      "research_strategy": "[high_volume_focus|long_tail_focus|balanced]",
      "research_confidence": "[0.0-1.0]",
      "data_sources_queried": ["Google_Suggest", "YouTube_Suggest", "TikTok_API", "SEO_Database", "Reddit", "Quora"]
    },
    "keyword_intelligence_profiles": [
      {
        "opportunity_id": "[from M-002]",
        "opportunity_name": "[string]",
        "keyword_cohort": [
          {
            "keyword": "[string]",
            "search_volume_monthly": "[integer]",
            "search_volume_tier": "[HIGH|MEDIUM|LOW]",
            "keyword_difficulty_score": "[0-100]",
            "search_trend_velocity_7d": "[float percent]",
            "intent_type": "[INFORMATIONAL|NAVIGATIONAL|TRANSACTIONAL|COMMERCIAL]",
            "intent_alignment_to_creator": "[0-100]",
            "content_gaps_identified": ["[gap1]", "[gap2]", "[gap3]"],
            "gap_question_frequency": "[integer]",
            "recommended_content_format": "[SHORT_FORM|LONG_FORM|PODCAST|TEXT]",
            "format_compatibility_score": "[0-100]",
            "keyword_opportunity_score": "[0-100]",
            "suggested_content_structure": "[Tutorial+FAQ, Comparison+Guide, Trend Analysis, Tool Review, etc]"
          }
        ],
        "keyword_cohort_summary": {
          "total_keywords_for_opportunity": "[integer]",
          "high_volume_keywords": "[count]",
          "medium_volume_keywords": "[count]",
          "long_tail_keywords": "[count]",
          "intent_distribution": {
            "informational": "[count]",
            "navigational": "[count]",
            "transactional": "[count]",
            "commercial": "[count]"
          },
          "format_distribution": {
            "short_form_suitable": "[count]",
            "long_form_suitable": "[count]",
            "podcast_suitable": "[count]",
            "text_suitable": "[count]"
          }
        }
      }
    ],
    "keyword_mining_summary": {
      "mining_id": "[KEYWRD-timestamp-creator_id]",
      "total_keywords_curated": "[integer]",
      "keywords_by_volume_tier": {
        "high_volume": "[count > 50K/month]",
        "medium_volume": "[count 5K-50K/month]",
        "long_tail": "[count < 5K/month]"
      },
      "recommended_keyword_strategy": "[string - which keyword tier to prioritize]",
      "next_stage_recommendations": [
        "M-004-audience-demographic-mapper",
        "M-006-viral-pattern-detector"
      ]
    },
    "governance": {
      "created_by": "M-003-keyword-intelligence-miner",
      "escalation_trigger": "[none|insufficient_data|research_failed|low_confidence]",
      "audit_trail_ref": "[audit_event_id]"
    }
  }
}
```

**Write Targets:**
- `dossier.discovery_vein.keyword-intelligence-miner` (append_only array)
- `se_packet_index` (one row with family=keyword-intelligence-miner_packet, source=M-003, research_confidence, keyword_count)

## 8. Governance
- **Director Binding:** Chanakya (strategy through evidence) (owner), Krishna (strategic authority)
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
- dossier.discovery_vein.keyword-intelligence-miner (append_only)
- se_packet_index row for packet traceability

**Forbidden Mutations:**
- overwrite of prior dossier values
- write to unrelated namespaces
- mutation without packet metadata

## 11. Failure Modes & Recovery

**Failure Mode 1: Keyword Expansion Source Timeout**
- Detection: 2+ expansion sources (Google Suggest, YouTube Suggest, TikTok API) timeout or return empty results
- Escalation: Return PARTIAL status with "keyword_expansion_degraded" flag, research_confidence reduced
- Recovery: Proceed with available sources, mark keywords with "limited_expansion" flag
- Next Stage: Downstream skills can request keyword refresh or work with limited keyword set
- Fallback: If 4+ sources fail → escalate to WF-900 with escalation_type = "keyword_data_unavailable"

**Failure Mode 2: Low Keyword Quality (Poor Search Intent Classification)**
- Detection: 50%+ keywords have intent_alignment_score < 30 (poor creator fit)
- Escalation: Return PARTIAL status with "poor_keyword_intent_fit" flag
- Recovery: Relax intent_alignment threshold, include tangential intents (adjacent to creator strength)
- Next Stage: Creator can manually select high-fit keywords or request re-research with expanded filter

**Failure Mode 3: Insufficient Content Gap Data**
- Detection: 70%+ keywords have content_gaps empty (no unanswered questions found)
- Escalation: Return PARTIAL status with "insufficient_gap_data" flag
- Recovery: Flag as "gap_research_incomplete", recommend manual gap research before content creation
- Next Stage: Creator can proceed with keywords but should validate gaps manually

**Failure Mode 4: Format Compatibility Mismatch**
- Detection: recommended_format not in creator_primary_formats for 60%+ keywords
- Escalation: Mark keywords with "format_mismatch" warning, risk_level = MEDIUM
- Recovery: Include "format_adaptation_difficulty" score, recommend easier keywords
- Next Stage: Creator can choose to adapt format or select format-native keywords

## 12. Best Practices

- **Keyword Expansion Completeness:** Query minimum 4 expansion sources (Google Suggest, YouTube Suggest, TikTok API, SEO Database). Cache results for 7 days to avoid redundant API calls.

- **Intent Classification Determinism:** Define exact intent patterns (informational: "how to", "what is", "X explained"; navigational: "best", "vs", "for beginners"; transactional: "buy", "download", "free"). Use pattern matching, not fuzzy logic.

- **Search Volume Tier Consistency:** Use exact thresholds (HIGH: >50K, MEDIUM: 5K-50K, LOW: <5K monthly searches). Document source of volume data (Google Trends, SEMrush, Ahrefs, etc).

- **Content Gap Validation:** For each keyword, sample Top 10 ranking results + Reddit/Quora data. Gap must be mentioned by minimum 3+ separate users to count as valid gap.

- **Format Suitability Rules:** Define deterministic rules (viral/entertainment → SHORT_FORM bonus, explanation/depth → LONG_FORM bonus, discussion → PODCAST bonus, detailed guide → TEXT bonus).

- **Creator Alignment Scoring:** Apply explicit bonus/penalty for creator strength areas (+25 for native format, +20 for genre match, -15 for incompatible format).

- **Keyword Diversity in Curation:** Mandatory: 1 HIGH_VOLUME (main topic), 3-5 LOW_VOLUME (long-tail opportunity), balanced intent mix (INFORMATIONAL + NAVIGATIONAL + TRANSACTIONAL).

- **Gap Opportunity Scoring:** Gap_score = frequency_of_gap * creator_alignment_to_answer. Higher frequency gaps = stronger content need signal.

- **Keyword Difficulty Interpretation:** Document how keyword_difficulty calculated (competition level, current ranking authority, estimated effort to rank). Use standard SEO definition (Ahrefs, Moz, or similar).

- **Research Confidence Calculation:** Base it on source_coverage (% of expansion sources successful) + keyword_completeness (% of keywords with all required fields). Formula: research_confidence = 0.5 + 0.3*source_coverage + 0.2*keyword_completeness.

- **Deterministic Ranking:** Sort keywords by keyword_opportunity_score (descending), use tie-breaker: search_volume (desc). No random shuffling.

- **Long-Tail Strategy Emphasis:** Low-volume keywords (< 5K/month) should include +10 bonus in scoring formula (reward underserved, less competitive niches).

## 13. Validation / Done

**Acceptance Tests:**
- **TEST-PH1-TI-M003-001:** Valid opportunity input (40+ opportunities from M-002) produces CREATED packet with total_keywords_mined >= 200
- **TEST-PH1-TI-M003-002:** Keyword expansion correctly retrieves variations from 4+ sources (Google Suggest, YouTube Suggest, TikTok, SEO Database)
- **TEST-PH1-TI-M003-003:** Search volume accurately classified (HIGH_VOLUME > 50K, MEDIUM 5K-50K, LOW < 5K monthly searches)
- **TEST-PH1-TI-M003-004:** Intent classification assigns correct intent_type (INFORMATIONAL for "how to", NAVIGATIONAL for "best", TRANSACTIONAL for "buy", COMMERCIAL for product)
- **TEST-PH1-TI-M003-005:** Content gap detection identifies minimum 2+ unanswered questions per keyword (from top 10 results + Reddit/Quora)
- **TEST-PH1-TI-M003-006:** Format suitability correctly recommends format (SHORT_FORM for viral, LONG_FORM for explanation, PODCAST for discussion, TEXT for detailed guide)
- **TEST-PH1-TI-M003-007:** Creator alignment bonus applied (+25 for native format, +20 for genre match, -15 for incompatible format)
- **TEST-PH1-TI-M003-008:** Keyword opportunity score formula applies all components (search_volume, intent_alignment, format_compatibility, gap_opportunity, competition_penalty)
- **TEST-PH1-TI-M003-009:** Keyword diversity filter enforces minimum 1 HIGH_VOLUME, 3-5 LOW_VOLUME, balanced intent mix per opportunity
- **TEST-PH1-TI-M003-010:** Long-tail keywords (<5K/month) scored with +10 bonus for underserved niche recognition
- **TEST-PH1-TI-M003-011:** Keyword expansion source timeout (2+ sources fail) returns PARTIAL with "keyword_expansion_degraded" flag, research_confidence reduced
- **TEST-PH1-TI-M003-012:** Low keyword quality (intent_alignment < 30 for 50%+ keywords) returns PARTIAL with "poor_keyword_intent_fit" flag
- **TEST-PH1-TI-M003-013:** Insufficient content gaps (70%+ keywords no gaps) returns PARTIAL with "insufficient_gap_data" flag + manual research recommendation
- **TEST-PH1-TI-M003-014:** Format compatibility mismatch (recommended_format not in creator_primary_formats) marks keyword with "format_mismatch" warning, risk_level = MEDIUM
- **TEST-PH1-TI-M003-015:** Dossier patch appended (append_only) to dossier.discovery_vein.keyword-intelligence-miner with no overwrites
- **TEST-PH1-TI-M003-016:** se_packet_index row created with mining_id, research_confidence, keyword_count, source=M-003
- **TEST-PH1-TI-M003-017:** Replay of same dossier_id within 7d produces identical keyword ranking (deterministic)

**Done Criteria:**
- ✅ Keyword expansion queries 4+ sources (Google Suggest, YouTube Suggest, TikTok, SEO Database) with fallback behavior for timeouts
- ✅ Search volume classification deterministic (exact thresholds: HIGH >50K, MEDIUM 5K-50K, LOW <5K monthly)
- ✅ Intent classification deterministic (pattern matching: informational, navigational, transactional, commercial)
- ✅ Content gap detection queries Top 10 results + Reddit + Quora with minimum 2+ gaps per keyword validation
- ✅ Format suitability rules deterministic (viral→SHORT_FORM, explanation→LONG_FORM, discussion→PODCAST, guide→TEXT)
- ✅ Creator alignment scoring applies explicit bonuses/penalties (+25 native format, +20 genre, -15 incompatible)
- ✅ Keyword opportunity score formula documented with all 6 signal components (volume, intent, format, gap, competition, penalties)
- ✅ Keyword diversity curation enforces: 1 HIGH_VOLUME, 3-5 LOW_VOLUME, balanced intents, format mix
- ✅ Long-tail strategy bonus (+10) integrated for <5K/month keywords
- ✅ Output packet includes all required sections (keyword_mining_metadata, keyword_intelligence_profiles, keyword_mining_summary, governance)
- ✅ All 4 failure modes have explicit detection, escalation path, and recovery action
- ✅ Partial status emitted for degraded data (source timeouts, poor intent fit, insufficient gaps) without escalating every gap
- ✅ Escalation path (WF-900) reserved only for unrecoverable errors (no keyword data, research failure)
- ✅ Dossier write validated as append_only with no overwrite of prior keyword intelligence records
- ✅ Research confidence score calculated from source_coverage + keyword_completeness ratio (formula documented)
- ✅ Test suite covers happy path + all 4 failure modes + edge cases (timeout, poor_fit, gaps, format_mismatch)
- ✅ Deterministic replay guaranteed within 7d (same input = same keyword ranking)
