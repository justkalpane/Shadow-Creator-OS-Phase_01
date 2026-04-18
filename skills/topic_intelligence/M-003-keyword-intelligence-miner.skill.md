# SKL-PH1-KEYWORD-INTELLIGENCE-MINER

## 1. Skill Identity
- **Skill ID:** M-003
- **Skill Name:** Keyword Intelligence Miner
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Owner Workflow:** SE-N8N-CWF-110-Topic-Discovery, SE-N8N-CWF-130-Topic-Scoring
- **Consumer Workflows:** SE-N8N-CWF-130-Topic-Scoring
- **Vein/Route/Stage:** discovery_vein / topic_to_script / Stage_B_Discovery_and_Scoring

## 2. Purpose
Extract keyword and search-intent patterns that support or weaken topic opportunities. This skill expands keywords from topic seeds, clusters by search intent, and returns demand evidence for scoring stage to validate topic viability.

## 3. DNA Injection
- **Role Definition:** keyword_demand_analyzer
- **DNA Archetype:** Chanakya (strategy through evidence)
- **Behavior Model:** research-oriented, demand-focused, evidence-backed
- **Operating Method:** seed_expansion → intent_clustering → demand_assessment → return_keyword_intelligence
- **Working Style:** methodical, data-driven, market-aware

## 4. Workflow Injection
- **Producer:** SE-N8N-CWF-110-Topic-Discovery, SE-N8N-CWF-130-Topic-Scoring
- **Direct Consumers:** SE-N8N-CWF-130-Topic-Scoring
- **Upstream Dependencies:** topic_opportunity_set (from M-002), keyword_demand_registry
- **Downstream Handoff:** keyword_intelligence_packet → consumed by scoring workflows for viability validation
- **Escalation Path:** SE-N8N-WF-900 on API failure or keyword expansion error
- **Fallback Path:** Return keyword_intelligence_packet with status "partial_keywords_only" if demand data unavailable
- **Replay Path:** SE-N8N-WF-021 if keyword scope needs adjustment

## 5. Inputs
**Required:**
- `dossier_id` (string)
- `topic_opportunity_set` (packet) — opportunities to analyze
- `audience_segment` (object) — which audiences to assess keywords for

**Optional:**
- `search_volume_threshold` (int) — minimum searches/month (default: 100)
- `keyword_expansion_method` (enum) — seed expansion strategy (default: "related_queries")

## 6. Execution Logic
```
1. Validate inputs and dossier state
2. For each topic opportunity:
   a. Extract seed keywords from topic_statement
   b. Expand seeds using: semantic similarity, trending expansions, related queries
   c. For each keyword, assess:
      - Search volume (monthly searches)
      - Search intent (informational, navigational, commercial, transactional)
      - Competition level (how many results)
      - Trend direction (rising, stable, falling)
   d. Cluster keywords by intent + demand relevance
   e. Filter by search_volume_threshold
3. Attach source evidence (where demand data came from)
4. Return keyword_intelligence_packet
5. On API error: escalate to WF-900 with keyword set achieved so far
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "KWI-[timestamp]",
  "artifact_family": "keyword_intelligence_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-130-Topic-Scoring",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO timestamp]",
  "status": "CREATED | PARTIAL | EMPTY",
  "payload": {
    "opportunities_analyzed": [int],
    "total_keywords": [int],
    "keyword_clusters": [
      {
        "cluster_intent": "informational | commercial | transactional | navigational",
        "keywords": [
          {
            "keyword": "[string]",
            "search_volume": [int],
            "competition": "HIGH | MEDIUM | LOW",
            "trend": "RISING | STABLE | FALLING",
            "evidence_source": "[registry name]"
          }
        ]
      }
    ],
    "high_opportunity_keywords": [[keywords with best signal]]
  }
}
```

**Write Targets:**
- `dossier.discovery.keyword_intelligence` (patch-only append)
- `se_packet_index` (one row)

## 8. Governance
- **Director Binding:** Chanakya (owner, strategy authority)
- **Veto Power:** None
- **Approval Gate:** None (evidence collection stage)
- **Policy Requirements:**
  - Keyword sources must be registered in keyword_demand_registry
  - Do NOT invent search volumes; use only registry sources
  - Clearly mark data provenance

## 9. Tool / Runtime Usage

**Allowed:**
- Keyword expansion (query expansion, semantic similarity)
- Demand data lookups from registry
- Clustering by intent

**Forbidden:**
- Paid keyword tools without budget approval
- Hallucinated search volumes
- Commercial APIs without route approval

## 10. Mutation Law

**Reads:**
- `dossier.discovery.topic_opportunities`
- `keyword_demand_registry.yaml`
- External keyword demand sources (API or cached)

**Writes:**
- `dossier.discovery.keyword_intelligence` (patch-only append)
- se_packet_index row

**Forbidden:**
- Do NOT mutate topic_opportunity_set
- Do NOT write to research or approval namespaces

## 11. Best Practices
- Expand keywords conservatively: prefer high-confidence expansions
- Show search volume trends (not just current)
- Capture keyword clusters by intent: different intents have different value
- If demand data is partial, still emit but mark status="PARTIAL"

## 12. Validation / Done

**Acceptance Tests:**
- TEST-PH1-M003-001: Expand keywords, emit intelligence_packet with >5 keywords per opportunity
- TEST-PH1-M003-002: Intent clustering works (keywords grouped by search intent)
- TEST-PH1-M003-003: Partial data handled (API failure doesn't halt, returns what's available)

**Done Criteria:**
- keyword_intelligence_packet schema valid
- Keywords have search volumes + intent classification
- Dossier patch is additive
- se_packet_index row created
