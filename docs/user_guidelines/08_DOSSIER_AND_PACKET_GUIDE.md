# Dossier and Packet Guide: State Management

## What Dossiers Are

**A dossier is immutable execution state.** Every topic-to-publication run creates one dossier that:
- Persists all state (never overwritten)
- Logs all changes in append-only audit trail
- Enables replay from any checkpoint
- Tracks governance, cost, quality, errors

### Dossier Structure

```json
{
  "dossier_id": "unique_topic_run_id",
  "route_id": "ROUTE_PHASE1_STANDARD",
  "status": "pending|in_progress|review|approved|rejected|archived",
  "selected_model": "ollama_local_llama3.2",
  "selected_mode": "creator",
  "workflow_run_id": "execution_trace_id",
  
  "namespaces": {
    "system": {
      "dossier_version": 1,
      "created_at": "2026-04-27T...",
      "owner_workflow": "WF-001"
    },
    "intake": { /* user input */ },
    "discovery": { /* topic discovery */ },
    "research": { /* research synthesis */ },
    "script": { /* script generation */ },
    "context": { /* context engineering */ },
    "approval": { /* approval decisions */ },
    "runtime": { /* metrics, cost, policy */ },
    "media": { /* media production */ },
    "publishing": { /* publishing data */ },
    "analytics": { /* collected metrics */ },
    "evolution": { /* feedback loops */ }
  },
  
  "dossier_delta_log": [
    {
      "delta_id": "delta_001",
      "timestamp": "2026-04-27T10:00:00Z",
      "namespace_target": "discovery",
      "field_changed": "entities",
      "old_value": null,
      "new_value": ["remote work", "2026"],
      "mutation_type": "create",
      "writer_workflow": "CWF-110",
      "version_number": 1
    }
  ],
  
  "error_trace": [ /* all errors */ ],
  "model_routing_trace": [ /* all model selections */ ],
  "mode_transition_trace": [ /* all mode switches */ ],
  "workflow_transition_trace": [ /* all workflow transitions */ ]
}
```

### The 12 Namespaces

| Namespace | Purpose | Example Content |
|-----------|---------|-----------------|
| **system** | Metadata | version, created_at, owner_workflow |
| **intake** | User input | raw topic, mode, model selection |
| **discovery** | Topic analysis | entities, themes, scope, novelty_score |
| **research** | Research synthesis | sources, claims, evidence_map |
| **script** | Script generation | outline, draft, debate_output, refined_draft, quality_score |
| **context** | Execution planning | execution_context, platform_packages, asset_briefs |
| **approval** | Governance decisions | approval_status, approved_by, approval_timestamp |
| **runtime** | Execution metrics | latency_ms, cost_usd, quality_scores, error_count |
| **media** | Media assets | thumbnail, broll, captions, audio (Phase-4+) |
| **publishing** | Distribution data | publish_schedule, channel_config, status |
| **analytics** | Collected metrics | execution_metrics, model_usage, error_analytics |
| **evolution** | Feedback & learning | feedback_records, learning_cycle_count, tuning_recommendations |

### The APPEND_ONLY Law

**Critical Rule:** Never overwrite dossier state.

Instead:

1. **Load current dossier**
2. **Create delta entry:**
   ```json
   {
     "delta_id": "delta_123",
     "timestamp": "2026-04-27T10:05:00Z",
     "namespace_target": "script",
     "field_changed": "quality_score",
     "old_value": 0.82,
     "new_value": 0.88,
     "mutation_type": "update",
     "writer_workflow": "CWF-230",
     "version_number": 7
   }
   ```
3. **Add to dossier_delta_log**
4. **Increment dossier_version**
5. **Update namespace content (append or version)**
6. **Save updated dossier**

**Result:** Full history of every change, who made it, when, and why.

### Creating a Dossier

```bash
# Step 1: Trigger WF-001
curl -X POST http://localhost:5678/api/v1/workflows/WF-001/execute \
  -H "Content-Type: application/json" \
  -d '{
    "dossier_id": "my_first_topic",
    "route_id": "ROUTE_PHASE1_STANDARD",
    "topic": "The future of AI content creation"
  }'

# Step 2: View created dossier
npm run dossier:inspect my_first_topic
```

---

## What Packets Are

**Packets are typed state transitions.** Every workflow emits a packet.

### Packet Structure

```json
{
  "packet_id": "pkt_110_001",
  "packet_type": "topic_discovery_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "CWF-110",
  "dossier_ref": "my_first_topic",
  "created_at": "2026-04-27T10:01:00Z",
  "status": "CREATED",
  
  "payload": {
    "entities": ["AI", "content creation", "automation"],
    "themes": ["future of work", "technology impact"],
    "scope": "macro",
    "confidence": 0.92,
    "estimated_quality_score": 0.85
  }
}
```

### 318+ Packet Families

| Family | Producer | Purpose |
|--------|----------|---------|
| topic_discovery_packet | CWF-110 | Topic entities, themes, scope |
| research_synthesis_packet | CWF-140 | Sources, claims, evidence |
| script_generation_packet | CWF-210 | Outline, draft, hooks |
| script_debate_packet | CWF-220 | Debates, critiques |
| script_refinement_packet | CWF-230 | Refined draft, quality score |
| approval_packet | WF-020 | Approval decision, reviewer, reason |
| analytics_collection_packet | CWF-610 | Execution metrics |
| feedback_processing_packet | CWF-620 | Signal analysis, improvements |
| learning_loop_closure_packet | CWF-630 | Learnings, tuning decisions |
| ... (309 more) | ... | ... |

### Packet Lineage

**Every packet is traceable:**

```
Packet 1: topic_discovery_packet (CWF-110)
  ↓ dossier_ref: my_first_topic
Packet 2: research_synthesis_packet (CWF-140)
  ↓ dossier_ref: my_first_topic
Packet 3: script_generation_packet (CWF-210)
  ↓ dossier_ref: my_first_topic
... (8 total packets in lineage)
```

### Inspecting Packets

```bash
# List all packets for a dossier
npm run packet:list --dossier my_first_topic

# Inspect specific packet
npm run packet:inspect pkt_110_001

# Show lineage (producer → consumer chain)
npm run packet:lineage my_first_topic
```

---

## Dossier Example: Complete Topic Run

```json
{
  "dossier_id": "ai_content_future_001",
  "status": "completed",
  "dossier_version": 47,
  
  "namespaces": {
    "intake": {
      "topic": "The future of AI content creation",
      "mode": "creator",
      "selected_model": "ollama_local_llama3.2",
      "submitted_at": "2026-04-27T10:00:00Z"
    },
    "discovery": {
      "entities": ["AI", "content creation", "automation", "2026"],
      "themes": ["future of work", "tech impact"],
      "scope": "macro",
      "viability_score": 0.92,
      "novelty_score": 0.87
    },
    "research": {
      "sources": [
        { "url": "arxiv.org/...", "credibility": 0.95 },
        { "url": "medium.com/...", "credibility": 0.80 },
        ...
      ],
      "claims": 15,
      "evidence_map": { "claim_001": ["source_1", "source_2"] }
    },
    "script": {
      "outline": "1. Hook 2. AI basics 3. Content creation 4. Examples 5. Future 6. CTA",
      "draft": "In 2026, AI is transforming content creation...",
      "quality_score": 0.91,
      "estimated_time_minutes": 12
    },
    "approval": {
      "approval_status": "approved",
      "approved_by": "script_director",
      "approval_timestamp": "2026-04-27T10:18:00Z",
      "policy_check_passed": true,
      "budget_check_passed": true
    },
    "analytics": {
      "execution_latency_ms": 847000,
      "total_cost_usd": 0.00,
      "quality_scores": { "discovery": 0.92, "research": 0.88, "script": 0.91 },
      "error_count": 0
    }
  },
  
  "dossier_delta_log": [
    { "delta_id": "delta_001", "timestamp": "...", "namespace_target": "discovery", "mutation_type": "create", "writer_workflow": "CWF-110", "version_number": 1 },
    { "delta_id": "delta_002", "timestamp": "...", "namespace_target": "research", "mutation_type": "create", "writer_workflow": "CWF-140", "version_number": 2 },
    ...
    { "delta_id": "delta_047", "timestamp": "...", "namespace_target": "evolution", "mutation_type": "create", "writer_workflow": "CWF-630", "version_number": 47 }
  ]
}
```

---

## Replay from Checkpoint

**Scenario:** Script rejected, need to retry from research stage

```
1. Load dossier version 5 (before script generation)
2. WF-021 reconstructs state at that checkpoint
3. Modify research outputs (add more sources)
4. Re-run from CWF-210 (script generation)
5. New packets generated (version 2 of script packets)
6. Old packets remain in audit trail
7. Final dossier shows full history
```

---
