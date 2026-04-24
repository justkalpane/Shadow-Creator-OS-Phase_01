# SKL-PH1-KNOWLEDGE-SOURCE-COLLECTOR

## 1. Skill Identity
- **Skill ID:** M-009
- **Skill Name:** Knowledge Source Collector
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-WF
- **Consumer Workflows:** WF-100, CWF-140, WF-200
- **Vein/Route/Stage:** research_vein / topic_to_script / Stage_B_Research

## 2. Purpose
Runtime-ready canonical skill artifact for M-009 (Knowledge Source Collector). This specification follows repository DNA law and enforces deterministic execution, packet lineage, governance-safe escalation, and patch-only mutation discipline.

## 3. DNA Injection
- **Role Definition:** knowledge-source-collector_executor
- **DNA Archetype:** Vyasa
- **Behavior Model:** deterministic, registry-bound, escalation-safe
- **Operating Method:** ingest -> validate -> execute -> emit -> index
- **Working Style:** evidence-first, schema-locked, replay-aware

## 4. Workflow Injection
- **Producer:** WF
- **Direct Consumers:** WF-100, CWF-140, WF-200
- **Upstream Dependencies:** workflow_registry, skill_loader_registry, dossier packet context
- **Downstream Handoff:** knowledge-source-collector_packet -> downstream workflow chain
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

The Knowledge Source Collector identifies and catalogs authoritative knowledge sources for each viable topic, enabling research depth and credibility validation. It assembles multi-format source libraries stratified by type and relevance.

```
STEP 1: VALIDATE INPUTS & LOAD_TOPIC_VIABILITY_CONTEXT
  - Input: dossier_id, topic_viability_scorer_packet (from M-008)
  - Validate payload contains:
    * viability_profiles with GO/CONDITIONAL_GO classifications
    * viability_reasoning and execution_roadmaps
    * creator_context (platform defaults, content format preferences)
  - Filter for viable topics: only process viability_classification IN [GO, CONDITIONAL_GO]
  
  Validation: If no viable topics → escalate to WF-900 with escalation_type = "no_viable_topics_to_research"
  Confidence floor: >=0.6 to proceed

STEP 2: FOR EACH VIABLE TOPIC, QUERY_MULTI_SOURCE_DATABASES
  For each viable topic:
    
    A) QUERY_ACADEMIC_SOURCES:
       - Google Scholar API: search by topic keywords + author
       - PubMed (if health/science topic): search database
       - ArXiv (if research topic): search preprints
       - Extract: title, authors, publication_date, journal, URL, citation_count, abstract
       - Filter: publication_date >= 2 years ago (recency threshold configurable per domain)
       - Limit: top 20-30 academic sources per topic
    
    B) QUERY_NEWS_AND_JOURNALISM_SOURCES:
       - News API (current news aggregator)
       - NewsGuard rated sources (credibility tier)
       - Major news outlets directly (Reuters, AP, BBC, etc. if relevant)
       - Extract: headline, source, publication_date, URL, article_summary, relevance_score
       - Filter: published within last 6 months (news freshness requirement)
       - Limit: top 15-20 news sources per topic
    
    C) QUERY_BLOG_AND_EXPERT_SOURCES:
       - Medium.com API (technology, business blogs)
       - Substack (newsletter/expert sources)
       - Industry blogs (search by domain)
       - Expert author platforms (author's domain/website)
       - Extract: author, publish_date, post_title, URL, audience_size (if available), domain_authority (Ahrefs/Moz score if available)
       - Limit: top 15-20 blog/expert sources per topic
    
    D) QUERY_COMMUNITY_AND_DISCUSSION_SOURCES:
       - Reddit: search subreddits, extract top threads
       - Stack Overflow (if technical): search Q&A threads
       - Quora: search questions related to topic
       - Discord communities (if available): search community discussions
       - Extract: community_name, thread_title, discussion_quality_score, participant_count, recency
       - Limit: top 10-15 community sources per topic
    
    E) QUERY_VIDEO_AND_VISUAL_SOURCES:
       - YouTube: search by topic, extract top videos
       - TED Talks (if educational): search database
       - Vimeo (if specialized content): search
       - Extract: video_title, creator, view_count, length, publish_date, URL, transcript (if available)
       - Limit: top 10-15 video sources per topic
    
    F) QUERY_OFFICIAL_AND_PRIMARY_SOURCES:
       - Government resources (if applicable): official statistics, reports
       - Organization websites (manufacturers, institutions)
       - Original data sources (Census, World Bank, etc.)
       - Extract: source_name, data_type, publication_date, URL, data_format (PDF, dataset, API, etc)
       - Limit: top 5-10 official sources per topic

STEP 3: CATEGORIZE_SOURCES_BY_TYPE_AND_TIER
  For all collected sources, build categorization:
    
    A) SOURCE_TYPE_CLASSIFICATION:
       - Academic: peer-reviewed journals, conference papers, dissertations
       - News: journalism outlets, news agencies, verified reporters
       - Expert: blogs by recognized experts, professional publications, newsletters
       - Community: forums, social media discussions, user-generated content
       - Visual: videos, podcasts, presentations, infographics
       - Official: government, organizations, primary data sources
    
    B) CREDIBILITY_TIER_ASSIGNMENT:
       - TIER_1_PRIMARY: peer-reviewed academic, official government, primary data sources
       - TIER_2_AUTHORITATIVE: major news outlets, established experts, institutional research
       - TIER_3_CREDIBLE: specialist blogs, community discussions with high engagement, secondary analysis
       - TIER_4_SUPPLEMENTARY: general audience content, emerging sources, unverified claims
       - TIER_4_UNVERIFIED: anonymous sources, single-opinion pieces without evidence
    
    Assign tier based on: publication_venue, author_authority, citation_count, community_consensus, verification_status
    
    C) RELEVANCE_SCORING:
       For each source, score relevance to topic (0-100):
         * keyword_match (0-30): does title/abstract contain core keywords?
         * audience_match (0-20): is source targeting creator's audience?
         * recency (0-20): how recent is source?
         * depth (0-20): does source provide in-depth coverage (not surface-level)?
         * uniqueness (0-10): does source provide unique perspective vs. redundant coverage?
       
       relevance_score = sum of above (0-100)
       Filter: only include sources with relevance_score >= 40 (or lower threshold if few sources found)

STEP 4: ASSESS_SOURCE_ACCESSIBILITY
  For each source collected:
    
    A) ACCESSIBILITY_CHECK:
       - URL validity: is link accessible (HTTP 200 response)?
       - Paywall status: behind paywall? academic authentication required?
       - Language: is source in creator's language or translatable?
       - Regional restriction: is source geo-blocked?
       - Extraction difficulty: can content be extracted (open text) or is it image-heavy?
    
    B) ACCESSIBILITY_CLASSIFICATION:
       - FULLY_ACCESSIBLE: free, open, no registration required
       - PARTIALLY_ACCESSIBLE: free preview, limited access, summary available
       - GATED: paywall, requires subscription, academic authentication
       - RESTRICTED: geo-blocked, language barrier, very difficult extraction
    
    C) ACCESSIBILITY_SCORE:
       FULLY_ACCESSIBLE = 100, PARTIALLY = 70, GATED = 40, RESTRICTED = 10
       accessibility_score = weighted based on creator's budget constraints (premium content acceptable for high-value topics)

STEP 5: BUILD_SOURCE_INVENTORY_PROFILES
  For each topic, create source_inventory:
    
    source_inventory = {
      "topic_keyword": string,
      "viability_score": [from M-008],
      "total_sources_collected": int,
      "sources_by_type": {
        "academic": {count, avg_relevance_score, avg_accessibility_score},
        "news": {count, avg_relevance_score, avg_accessibility_score},
        "expert": {count, avg_relevance_score, avg_accessibility_score},
        "community": {count, avg_relevance_score, avg_accessibility_score},
        "visual": {count, avg_relevance_score, avg_accessibility_score},
        "official": {count, avg_relevance_score, avg_accessibility_score}
      },
      "sources_by_tier": {
        "TIER_1_PRIMARY": [source_objects with full metadata],
        "TIER_2_AUTHORITATIVE": [source_objects],
        "TIER_3_CREDIBLE": [source_objects],
        "TIER_4_SUPPLEMENTARY": [source_objects],
        "TIER_4_UNVERIFIED": [source_objects]
      },
      "sources_fully_accessible": [count],
      "sources_gated": [count],
      "research_readiness_assessment": {
        "sufficient_academic_sources": boolean (min 10 TIER_1/2 sources),
        "sufficient_primary_sources": boolean (min 5 official/primary sources),
        "diverse_viewpoints": boolean (sources from 4+ types),
        "research_confidence": 0.0-1.0
      }
    }

STEP 6: IDENTIFY_RESEARCH_GAPS
  For each topic, assess what source types are underrepresented:
    
    A) GAP_DETECTION:
       - Missing academic sources? (< 5 peer-reviewed)
       - No official/primary sources? (< 3 primary data)
       - Lack of recent coverage? (> 50% sources > 2 years old)
       - Single perspective dominance? (>70% from one ideology/viewpoint)
       - Limited visual content? (< 2 videos)
    
    B) GAP_IMPACT_ASSESSMENT:
       - research_gap_severity = count(missing_source_types) / 6 (how many types missing?)
       - If research_gap_severity > 0.4: flag as "research_gap_significant", recommend manual source addition
       - If research_gap_severity > 0.6: flag as "research_gap_critical", may require topic reconsideration

STEP 7: BUILD_KNOWLEDGE_SOURCE_COLLECTION_ENVELOPE
  knowledge_source_envelope = {
    "collection_id": "KNOWSRC-[timestamp]-[creator_id]",
    "source_topics_collected": int,
    "total_sources_curated": int,
    "collection_confidence": 0.0-1.0,
    "source_distribution_health": {
      "type_diversity": 0-1.0 (ratio of represented types / 6 total types),
      "tier_distribution": {TIER_1: %, TIER_2: %, TIER_3: %, TIER_4: %},
      "accessibility_distribution": {FULLY: %, PARTIAL: %, GATED: %, RESTRICTED: %}
    },
    "research_readiness": {
      "topics_research_ready": int (sufficient sources for confident research),
      "topics_research_gapped": int (missing key source types),
      "topics_research_critical_gap": int (very sparse source coverage)
    },
    "next_stage_routing": "M-010-source-credibility-validator or CWF-150-Research-Quality"
  }

STEP 8: VALIDATION & EMIT
  Validate knowledge_source_envelope:
  - Each viable topic has source_inventory with minimum 10 sources (or flag PARTIAL)
  - Each source has: type, tier, relevance_score, accessibility_score, URL
  - collection_confidence calculated from: source_count_health, type_diversity, tier_distribution
  - research_readiness explicitly assessed
  
  IF all topics have adequate sources AND collection_confidence >= 0.8:
    status = "CREATED"
  ELSE IF 70%+ topics have adequate sources AND collection_confidence >= 0.6:
    status = "PARTIAL"
    include gap_flags and manual_addition_recommendations
  ELSE:
    status = "EMPTY"
    escalate to WF-900 with escalation_type = "insufficient_source_coverage"
  
  Emit packet with deterministic lineage
  Write dossier.research_vein.knowledge-source-collector (append_only)
  Register in se_packet_index
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "M-009-[timestamp]",
  "artifact_family": "knowledge-source-collector_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-WF",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO timestamp]",
  "status": "CREATED | PARTIAL | EMPTY",
  "payload": {
    "skill_id": "M-009",
    "skill_name": "Knowledge Source Collector",
    "result": {}
  }
}
```

**Write Targets:**
- dossier.research_vein.knowledge-source-collector (append_to_array)
- se_packet_index (single index row)

## 8. Governance
- **Director Binding:** Vyasa (owner), Krishna (strategic authority)
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
- dossier.research_vein.knowledge-source-collector (append_only)
- se_packet_index row for packet traceability

**Forbidden Mutations:**
- overwrite of prior dossier values
- write to unrelated namespaces
- mutation without packet metadata

## 11. Best Practices
- Keep transformations deterministic and replay-safe
- Preserve source evidence/provenance in packet payload
- Emit explicit partial status on non-critical source gaps
- Keep escalation payload machine-readable for WF-900

## 12. Validation / Done

**Acceptance Tests:**
- TEST-PH1-M009-001: valid input produces CREATED packet
- TEST-PH1-M009-002: invalid input escalates to WF-900
- TEST-PH1-M009-003: dossier patch is additive only

**Done Criteria:**
- Output packet schema conforms to family contract
- Additive dossier patch applied with no overwrite
- se_packet_index row produced
- Replay path and escalation path are defined
