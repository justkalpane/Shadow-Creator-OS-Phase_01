# Workflow Usage Guide: Operating Each Workflow

## System Workflows (7)

### WF-000: Health Check
**Purpose:** Verify system readiness (Ollama, folders, config)
**Inputs:** None
**Outputs:** `{ "status": "healthy", "ollama_available": true, "folders_ok": true }`
**Runtime:** <1 minute
**Use When:** First time, after updates

```bash
# In n8n: WF-000-health-check → Execute
# Expected: Healthy status
```

### WF-001: Dossier Create
**Purpose:** Initialize dossier for new topic
**Inputs:**
- `dossier_id`: "my_topic"
- `route_id`: "ROUTE_PHASE1_STANDARD"
- `topic`: "Your topic here"
**Outputs:** New dossier in se_dossier_index
**Runtime:** <1 minute
**Use When:** Starting new content project

### WF-010: Parent Orchestrator
**Purpose:** Main orchestrator (topic → research → script → approval → analytics)
**Inputs:**
- `dossier_id`: "my_topic"
- `mode`: "creator" (or builder, founder, operator)
- `selected_model`: "ollama_local_llama3.2"
**Outputs:** Complete dossier with all stages executed
**Runtime:** 10-15 minutes
**Use When:** Running complete content pipeline

### WF-020: Final Approval
**Purpose:** Governance gate before publishing
**Inputs:** Dossier from WF-010
**Outputs:** approval_status (approved/rejected)
**Runtime:** <1 minute
**Approvers:** YAMA (policy), KUBERA (budget), Script Director (quality)

### WF-021: Replay/Remodify
**Purpose:** Rerun from checkpoint if rejected
**Inputs:**
- `dossier_id`: "my_topic"
- `checkpoint_stage`: "research" (discovery, research, script, context, approval)
**Outputs:** Updated dossier with new attempts
**Runtime:** Depends on checkpoint (3-10 min)
**Use When:** Script rejected, need to fix and retry

### WF-900: Error Handler
**Purpose:** Classify and log errors
**Inputs:** Error from any workflow
**Outputs:** Logged error in se_error_events, routed to WF-901
**Runtime:** <1 minute (automatic)
**Automatic:** Yes

### WF-901: Error Recovery
**Purpose:** Attempt recovery (retry, fallback, escalate)
**Inputs:** Error classification from WF-900
**Outputs:** Recovery attempt logged, next action determined
**Runtime:** <5 minutes
**Automatic:** Yes

---

## Pack Parent Workflows (6)

### WF-100: Topic Intelligence
**Purpose:** Orchestrate topic discovery, qualification, scoring
**Children:** CWF-110, CWF-120, CWF-130, CWF-140
**Runtime:** 3-5 minutes
**Outputs:** All topic discovery packets, discovery namespace populated

### WF-200: Script Intelligence
**Purpose:** Orchestrate script generation, debate, refinement
**Children:** CWF-210, CWF-220, CWF-230, CWF-240
**Runtime:** 5-8 minutes
**Outputs:** All script packets, script namespace populated

### WF-300: Context Engineering
**Purpose:** Orchestrate execution context, platform packaging, asset briefs
**Children:** CWF-310, CWF-320, CWF-330, CWF-340
**Runtime:** 2-3 minutes
**Outputs:** Context, platform, asset briefs

### WF-400: Media Production (Phase-2+)
**Status:** Deferred (no Ollama video generation in Phase-1)
**Children:** CWF-410, CWF-420, CWF-430, CWF-440 (not yet implemented)

### WF-500: Publishing Distribution (Phase-2+)
**Status:** Deferred
**Children:** CWF-510, CWF-520, CWF-530 (not yet implemented)

### WF-600: Analytics Evolution
**Purpose:** Orchestrate analytics collection, feedback processing, learning loop
**Children:** CWF-610, CWF-620, CWF-630
**Runtime:** 2-3 minutes
**Outputs:** Metrics, feedback signals, learnings

---

## Child Workflows (18)

### Topic Intelligence Pack (CWF-110 through CWF-140)

**CWF-110: Topic Discovery**
- Input: Raw topic text
- Output: Entities, themes, scope
- Skill: topic_parsing, topic_theme_identifier
- Dossier Write: discovery.entities, discovery.themes

**CWF-120: Topic Qualification**
- Input: Parsed topic
- Output: Viability score, constraints
- Skill: topic_viability_scoring
- Dossier Write: discovery.viability_score

**CWF-130: Topic Scoring**
- Input: Qualified topic
- Output: Novelty score, trend analysis
- Skill: topic_novelty_analysis, topic_trend_synthesis
- Dossier Write: discovery.novelty_score

**CWF-140: Research Synthesis**
- Input: Scored topic
- Output: Sources, claims, evidence map
- Skill: research_compression, research_evidence_mapping, research_source_ranking
- Dossier Write: research.sources, research.claims, research.evidence_map

### Script Intelligence Pack (CWF-210 through CWF-240)

**CWF-210: Script Generation**
- Input: Research synthesis
- Output: Outline, hook, draft, sections
- Skill: script_outline_generator, script_hook_generator, script_drafting
- Dossier Write: script.outline, script.draft

**CWF-220: Script Debate**
- Input: Generated script
- Output: Debate output, critique, counterarguments
- Skill: script_debate_critic, script_counterargument_generator
- Dossier Write: script.debate_output, script.critiques

**CWF-230: Script Refinement**
- Input: Script with debate
- Output: Refined script, quality score, metadata
- Skill: script_validator, script_quality_fixer, script_metadata_generator
- Dossier Write: script.refined_draft, script.quality_score, script.metadata

**CWF-240: Final Script Shaping**
- Input: Refined script
- Output: SEO-optimized, final polish, ready for publication
- Skill: script_quality_fixer (SEO variant)
- Dossier Write: script.final_draft, script.seo_optimized

### Context Engineering Pack (CWF-310 through CWF-340)

**CWF-310: Execution Context Builder**
- Output: Allowed tools, constraints, quality gates
- Dossier Write: context.execution_context

**CWF-320: Platform Packager**
- Output: YouTube, blog, email, social packaging
- Dossier Write: context.platform_packages

**CWF-330: Asset Brief Generator**
- Output: Thumbnail, B-roll, caption, audio briefs
- Dossier Write: context.asset_briefs

**CWF-340: Lineage Validator**
- Output: Full chain validation
- Dossier Write: context.lineage_validation

### Analytics Pack (CWF-610 through CWF-630)

**CWF-610: Analytics Collector**
- Input: Complete dossier
- Output: Execution metrics, workflow traces, model usage
- Dossier Write: analytics.collected_metrics

**CWF-620: Evolution Feedback Processor**
- Input: Metrics
- Output: Consolidated signals, improvement areas
- Dossier Write: evolution.feedback_records

**CWF-630: Learning Loop Closer**
- Input: Feedback records
- Output: Learnings, tuning decisions
- Dossier Write: evolution.learning_records
- Final Output: dossier.status = "completed"

---

## Workflow Execution Order

**Canonical Phase-1 Flow:**

```
WF-000 (Health Check) [optional]
  ↓
WF-001 (Create Dossier)
  ↓
WF-010 (Parent Orchestrator):
  ├→ WF-100 (Topic Intelligence):
  │   ├→ CWF-110 (Discovery)
  │   ├→ CWF-120 (Qualification)
  │   ├→ CWF-130 (Scoring)
  │   └→ CWF-140 (Research)
  │
  ├→ WF-200 (Script Intelligence):
  │   ├→ CWF-210 (Generation)
  │   ├→ CWF-220 (Debate)
  │   ├→ CWF-230 (Refinement)
  │   └→ CWF-240 (Shaping)
  │
  ├→ WF-300 (Context):
  │   ├→ CWF-310 (Context Builder)
  │   ├→ CWF-320 (Platform Packager)
  │   ├→ CWF-330 (Asset Brief)
  │   └→ CWF-340 (Lineage Validator)
  │
  ├→ WF-020 (Approval Gate)
  │   If rejected → WF-021 (Replay)
  │   If approved → WF-600
  │
  └→ WF-600 (Analytics):
      ├→ CWF-610 (Collector)
      ├→ CWF-620 (Feedback Processor)
      └→ CWF-630 (Learning Loop Closer)
        ↓
   COMPLETE
```

---
