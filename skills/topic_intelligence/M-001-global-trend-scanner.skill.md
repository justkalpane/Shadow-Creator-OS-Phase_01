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
Scan broad trend landscapes across sources and surface emerging topic movement worth deeper discovery. This skill ingests trend feeds, identifies recurrent or rising thematic signals, and returns normalized trend observations with source provenance for downstream qualification and scoring.

## 3. DNA Injection
- **Role Definition:** trend_signal_aggregator
- **DNA Archetype:** Narada (seer of broad pattern landscapes)
- **Behavior Model:** observational, non-judgmental signal capture
- **Operating Method:** ingest → normalize → attach_provenance → return_signal_set
- **Working Style:** broad-sweep, evidence-first, source-aware

## 4. Workflow Injection
- **Producer:** SE-N8N-CWF-110-Topic-Discovery (first skill in discovery chain)
- **Direct Consumers:** SE-N8N-CWF-110-Topic-Discovery (pipeline feed), SE-N8N-CWF-120-Topic-Qualification (evidence source)
- **Upstream Dependencies:** feed_registry_phase1, source_family_registry, trend_data_sources
- **Downstream Handoff:** trend_signal_set packet → consumed by M-002, M-003, M-004
- **Escalation Path:** SE-N8N-WF-900 on invalid source refs or provider connectivity failure
- **Fallback Path:** Return empty signal set with status "insufficient_trend_data" if feeds unavailable
- **Replay Path:** SE-N8N-WF-021 if user requests signal refresh with different source scope

## 5. Inputs
**Required:**
- `dossier_id` (string) — parent dossier identifier
- `discovery_brief` (object) — intake constraints (topic seed, audience, channel, budget_profile)
- `source_refs` (array) — which source families to scan (default: all enabled)

**Optional:**
- `timeframe_days` (int) — look-back window (default: 30)
- `signal_threshold` (float) — minimum confidence (default: 0.6)
- `source_exclusions` (array) — sources to skip

## 6. Execution Logic
```
1. Validate dossier_id and discovery brief structure
2. Resolve enabled source families from feed_registry
3. Ingest trend data from each source (API calls, feeds, cached indices)
4. Extract thematic clusters using pattern matching + statistical significance
5. Attach source provenance and confidence scores to each signal
6. Deduplicate near-duplicate signals (cosine similarity > 0.8)
7. Rank signals by recency + mention volume + source diversity
8. Emit trend_signal_set with status "created" or "partial" if some sources failed
9. On critical error: escalate to WF-900 with full context
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "TRD-[timestamp]",
  "artifact_family": "trend_signal_set",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-110-Topic-Discovery",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO timestamp]",
  "status": "CREATED | PARTIAL | EMPTY",
  "payload": {
    "signal_count": 0,
    "signals": [
      {
        "signal_id": "SIG-[id]",
        "thematic_phrase": "[string]",
        "mention_volume": [int],
        "trend_direction": "RISING | STABLE | FALLING",
        "source_refs": ["source_id"],
        "confidence": [0.0-1.0],
        "discovery_window": "[date range]"
      }
    ],
    "coverage": {
      "sources_scanned": [int],
      "sources_failed": [int],
      "timeframe_days": [int]
    }
  }
}
```

**Write Targets:**
- `dossier.discovery.trend_signals` (array)
- `se_packet_index` (one row, reference to signal set file)

## 8. Governance
- **Director Binding:** Narada (owns execution), Krishna (strategic authority)
- **Veto Power:** None
- **Approval Gate:** None (discovery stage, non-blocking)
- **Policy Requirements:**
  - Sources must be in enabled source_family_registry
  - Do NOT invent or assume sources not in registry
  - Signal confidence must be ≥ signal_threshold parameter (default 0.6)
  - Emit explicit source failure reasons if any source fails

## 9. Tool / Runtime Usage

**Allowed:**
- Deterministic transforms (dedup, normalize, cluster)
- Source registry lookups
- Cached feed reads
- Pattern matching (regex, substring, thematic similarity)

**Forbidden:**
- Premium API calls (use only registry-enabled sources)
- Heavy LLM calls (keep local/cached)
- Source data mutation (read-only)

## 10. Mutation Law

**Reads:**
- `feed_registry_phase1.yaml` (source definitions)
- `source_family_registry.yaml` (enabled families)
- `discovery_brief` from dossier
- External trend feeds (read-only, cached when possible)

**Writes:**
- `dossier.discovery.trend_signals` (patch-only append to array, never overwrite)
- New row to `se_packet_index` table
- No other dossier namespaces

**Forbidden Mutations:**
- Do NOT overwrite discovery brief
- Do NOT mutate dossier identity fields (dossier_id, route_id, creator_id)
- Do NOT write to approval, research, or runtime namespaces (those are owned by other skills)

## 11. Best Practices
- Capture at least 3 distinct trend signals before emitting if possible
- Attach source diversity: seek signals from ≥2 different source families
- Mark low-confidence signals explicitly; do NOT silently promote uncertainty to certainty
- If all sources fail, return empty signal set (do NOT fail the workflow); let downstream handle
- Cache results keyed by `[dossier_id]_[source_scope]_[timeframe]` for 24h if possible

## 12. Validation / Done

**Acceptance Tests:**
- TEST-PH1-M001-001: Ingest trend feeds, emit signal set with ≥3 signals
- TEST-PH1-M001-002: Dedup works (duplicate signals merged, confidence averaged)
- TEST-PH1-M001-003: Source failure handled (partial result emitted, failure logged)
- TEST-PH1-M001-004: Confidence filtering works (signals below threshold excluded)

**Done Criteria:**
- Packet schema matches trend_signal_set family
- Every signal includes source_refs + confidence
- Dossier patch is additive only (no overwrites)
- se_packet_index row created with correct file_path
- Escalation to WF-900 works if critical error occurs
