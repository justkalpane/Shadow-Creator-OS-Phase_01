# SKL-PH1-TOPIC-OPPORTUNITY-MINER

## 1. Skill Identity
- **Skill ID:** M-002
- **Skill Name:** Topic Opportunity Miner
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Owner Workflow:** SE-N8N-CWF-110-Topic-Discovery
- **Consumer Workflows:** SE-N8N-CWF-110-Topic-Discovery, SE-N8N-CWF-120-Topic-Qualification
- **Vein/Route/Stage:** discovery_vein / topic_to_script / Stage_B_Discovery

## 2. Purpose
Turn raw trend and audience signals into candidate topic opportunities suitable for qualification. This skill clusters related signals, derives topic opportunity statements, and attaches discovery metadata and rationale for downstream qualification filtering.

## 3. DNA Injection
- **Role Definition:** opportunity_synthesizer
- **DNA Archetype:** Narada (pattern recognition across signals)
- **Behavior Model:** signal-driven, cluster-aware, opportunity-oriented
- **Operating Method:** ingest_trends → cluster_signals → derive_topic_statements → attach_rationale
- **Working Style:** synthetic, creative but grounded, signal-backed

## 4. Workflow Injection
- **Producer:** SE-N8N-CWF-110-Topic-Discovery
- **Direct Consumers:** SE-N8N-CWF-120-Topic-Qualification
- **Upstream Dependencies:** trend_signal_set (from M-001), audience_demographic_data (from M-004)
- **Downstream Handoff:** topic_opportunity_set packet → qualified by M-016 (qualification gate)
- **Escalation Path:** SE-N8N-WF-900 on clustering failure or validation error
- **Fallback Path:** Return empty opportunity set with status "insufficient_signals_for_clustering" if <3 trends available
- **Replay Path:** SE-N8N-WF-021 if user requests different clustering strategy

## 5. Inputs
**Required:**
- `dossier_id` (string)
- `trend_signal_set` (packet) — output from M-001
- `audience_insights` (object) — audience intent/interest patterns

**Optional:**
- `clustering_threshold` (float) — signal similarity threshold (default: 0.75)
- `min_cluster_size` (int) — minimum signals per cluster (default: 2)

## 6. Execution Logic
```
1. Validate input packets and dossier state
2. Group signals by thematic similarity (cosine similarity ≥ clustering_threshold)
3. For each cluster:
   a. Extract defining characteristics
   b. Generate candidate topic statement (clear, actionable wording)
   c. Attach cluster rationale (why these signals group together)
   d. Map to audience needs from demographic data
   e. Assign confidence (avg of signal confidences in cluster)
4. Rank opportunities by signal volume + audience fit
5. Return topic_opportunity_set packet
6. On clustering error: escalate to WF-900
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "TOP-[timestamp]",
  "artifact_family": "topic_opportunity_set",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-110-Topic-Discovery",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO timestamp]",
  "status": "CREATED | PARTIAL | EMPTY",
  "payload": {
    "opportunity_count": 0,
    "opportunities": [
      {
        "opportunity_id": "OPP-[id]",
        "topic_statement": "[string, clear and actionable]",
        "cluster_signals": ["signal_ids"],
        "cluster_confidence": [0.0-1.0],
        "rationale": "[why these signals cluster]",
        "audience_alignment": "[which audiences care]",
        "estimated_demand": "HIGH | MEDIUM | LOW"
      }
    ]
  }
}
```

**Write Targets:**
- `dossier.discovery.topic_opportunities` (append)
- `se_packet_index` (one row)

## 8. Governance
- **Director Binding:** Narada (owner)
- **Veto Power:** None
- **Approval Gate:** None (pre-qualification stage)
- **Policy Requirements:**
  - Topic statements must be clear and specific (not vague)
  - Do NOT promote unsupported opportunities without signal backing
  - Confidence ≥ average of constituent signals

## 9. Tool / Runtime Usage

**Allowed:**
- Clustering algorithms (k-means, hierarchical, density-based)
- Similarity metrics (cosine, Jaccard, semantic)
- Local NLP/text transforms (tokenization, normalization)

**Forbidden:**
- External LLM calls (use local transforms)
- Premium APIs

## 10. Mutation Law

**Reads:**
- `dossier.discovery.trend_signals` (from M-001)
- `dossier.discovery.audience_insights` (from M-004)
- Clustering rules from rules/topic_clustering_rules.yaml

**Writes:**
- `dossier.discovery.topic_opportunities` (patch-only append)
- se_packet_index row

**Forbidden:**
- Do NOT mutate trend_signal_set
- Do NOT write to approval or research namespaces

## 11. Best Practices
- Prefer clarity in topic statements over sophisticated wording
- Cluster conservatively: better to have more clusters than merged-too-tight clusters
- Always show cluster composition (which signals grouped)
- If audience data is missing, still emit opportunities but mark confidence lower

## 12. Validation / Done

**Acceptance Tests:**
- TEST-PH1-M002-001: Cluster signals, emit ≥2 opportunities from diverse signals
- TEST-PH1-M002-002: Topic statements are clear and specific
- TEST-PH1-M002-003: Confidence scores reflect cluster composition

**Done Criteria:**
- topic_opportunity_set schema valid
- All opportunities have cluster composition traceable
- Dossier patch is additive
- se_packet_index row created
