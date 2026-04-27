# Articles and Learning Paths: Educational Deep Dives

## Article 1: What is Shadow Creator OS?

Shadow Creator OS automates the entire content creation pipeline from topic research through publication preparation. Unlike script generators that only handle writing, Shadow Creator OS:

- Accepts raw topics and validates them (is this relevant? original? on-brand?)
- Researches deeply (finds 20+ sources, extracts claims, validates evidence)
- Generates scripts with hooks, structure, and estimated timing
- Runs internal debate (generates counterarguments, identifies weak points)
- Refines through multi-stage quality gates (quality score, director approval)
- Tracks everything (cost, latency, quality, errors, learning signals)
- Learns from execution to improve future runs

**Why this matters:** Content creators waste 80% of time on research and refinement. Shadow Creator OS automates this, delivering publication-ready scripts in 15 minutes instead of days.

---

## Article 2: The Director-Skill Model Explained

Think of Shadow Creator OS as a newsroom with editors and reporters:

- **Directors** are editors with authority to approve or reject work
- **Skills** are reporters who do the work
- **Workflows** are editorial processes that route work between reporters and editors

**Example:** Script generation is a complex process:

1. **Script Drafting Skill** writes initial draft
2. **Script Debate Skill** generates counterarguments and weak points
3. **Script Quality Fixer Skill** addresses issues
4. **Script Director** (editor) checks quality
   - If quality ≥0.85: ✓ Approve
   - If quality <0.85: ✗ Send back to Script Debate/Fix

This ensures multiple passes, not one-shot generation.

---

## Article 3: Topic-to-Script Automation Pipeline

**Complete flow in 15 minutes:**

```
User says: "I want to create content about AI in 2026"
    ↓ [CWF-110: Topic Discovery]
System extracts: entities (AI, 2026), themes (future, technology), scope (macro)
    ↓ [CWF-120: Topic Qualification]
System checks: searchable? trendy? on-brand? → Score: 0.92
    ↓ [CWF-130: Topic Scoring]
System analyzes: novelty (0.87), trend potential (high)
    ↓ [CWF-140: Research Synthesis]
System finds: 20 sources, extracts 15 claims, maps evidence
    ↓ [CWF-210: Script Generation]
System writes: 12-minute video outline, hook, sections, CTA
    ↓ [CWF-220: Script Debate]
System generates: counterarguments, weak point analysis
    ↓ [CWF-230: Script Refinement]
System improves: fixes issues, validates structure
    ↓ [WF-020: Approval Gate]
Directors check: ✓ Policy (YAMA), ✓ Budget (KUBERA), ✓ Quality (Script Director)
    ↓
RESULT: Publication-ready script, audited, versioned, ready for video production
```

---

## Article 4: Understanding Dossiers and Immutability

A **dossier** is like a lab notebook. Every experiment is recorded:

- Topic is recorded
- Discovery findings are recorded
- Research sources are recorded
- Script draft is recorded
- Quality scores are recorded
- Approvals are recorded
- Everything is timestamped and versioned

**Why immutability matters:**

❌ **Bad:** Script quality changes from 0.82 → 0.88. Original 0.82 is lost. You don't know what changed or why.

✅ **Good:** Script quality changes from 0.82 → 0.88. Both recorded with timestamp, delta_id, owner_workflow, old_value, new_value, version_number. Full history preserved.

**Replay advantage:** If script is rejected, you can:
1. Load dossier at version 5 (before script generation)
2. Modify research (add more sources)
3. Re-run script generation from that point
4. New script packets are generated
5. Old packets remain as history

---

## Article 5: n8n Orchestration: How Workflows Connect

n8n is a visual workflow engine. Shadow Creator OS defines 31 workflows in n8n.

**How it works:**

1. **Each workflow is a sequence of nodes:**
   - Trigger (manual or event-based start)
   - Load data (from dossier, registries)
   - Execute logic (call skills, validate, route)
   - Write results (back to dossier)
   - Emit packet (typed state transition)
   - Determine next workflow

2. **Workflows connect to each other:**
   - WF-010 (parent) routes to WF-100 (topic)
   - WF-100 completes, routes to WF-200 (script)
   - WF-200 completes, routes to WF-020 (approval)
   - If approved, routes to WF-600 (analytics)
   - If rejected, routes to WF-021 (replay)

3. **Visual advantage:**
   - See complete pipeline in n8n dashboard
   - Monitor execution in real-time
   - Inspect logs and errors
   - Manually trigger, pause, resume workflows

**n8n in Phase-1:** n8n dashboard IS the control interface. No separate web UI needed.

---

## Article 6: Your First Workflow Test

**Step-by-step:**

1. **Start n8n:** `npm run n8n:start`
2. **Open dashboard:** http://localhost:5678
3. **Click WF-000:** Health check (verify system ready)
4. **Click WF-001:** Create dossier with topic "Remote work trends"
5. **Click WF-010:** Run complete pipeline
6. **Watch execution:** See each node execute in real-time
7. **Inspect output:** `npm run dossier:inspect [dossier_id]`

**Expected result:** Dossier with topic, research, script, approval, analytics.

**Time:** 15 minutes total

---

## Article 7: Debugging and Troubleshooting Workflows

**If a workflow fails:**

1. **Check n8n logs:** Click workflow → Executions → click failed run
2. **Look at error:** Shows exactly which node failed and why
3. **Check dossier:** `npm run dossier:inspect [id]` — see what state was reached
4. **Check error_trace:** See all errors logged in dossier
5. **Determine cause:** Network? Ollama timeout? Budget exceeded? Policy violation?

**Common issues:**

- **"Ollama connection refused"** → Ollama not running. Start: `ollama serve`
- **"Cost exceeded"** → Budget gate triggered. Reduce scope or increase budget.
- **"Quality below threshold"** → Script Director rejected. Need more debate/refinement.
- **"Policy violation"** → YAMA rejected content. Review brand guidelines.

---

## Article 8: Extending the System Safely

**To add a new skill:**

1. Create skill file: `skills/context_media/my_skill.skill.md`
2. Add to skill_registry.yaml
3. Define dossier interactions (reads/writes)
4. Set quality threshold and escalation
5. Bind to a workflow (add to workflow JSON)
6. Test: `npm run validate:workflows`
7. Commit to git

**To add a new workflow:**

1. Copy existing workflow template
2. Update node logic
3. Add to workflow_registry.yaml
4. Test: `npm run validate:workflows`
5. Commit to git

**Key rule:** Always update registries first. Never run artifacts not in registries.

---

## Learning Path: Beginner to Operator

**Week 1:**
- Read: START HERE, System Overview, Installation
- Do: Run first test (WF-000 through WF-010)
- Understand: Dossier, modes, registries

**Week 2:**
- Read: n8n Runtime Guide, Workflow Usage Guide
- Do: Run 3 complete pipelines with different topics
- Understand: How workflows connect, packet flow

**Week 3:**
- Read: Director/Skill Guide, Knowledge Base, Troubleshooting
- Do: Inspect dossiers, check audit trails, retry failed workflows
- Understand: Governance, escalation, error recovery

**Week 4:**
- Read: Testing & Validation Guide, Production Readiness
- Do: Run validators, check all workflows, prepare for production
- Understand: What makes system production-ready

---
