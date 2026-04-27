# Module Use Cases: Practical Examples

## Use Case 1: Topic Intake → Script Ready (Complete Flow)

**User:** "I want to create content about 'Remote Work Trends in 2026'"

**System Flow:**

```
User Input: "Remote Work Trends in 2026"
    ↓
[CWF-110: topic_parsing skill]
    ↓
[discovery namespace] stores entities, themes, scope
    ↓
[CWF-120: topic_viability_scoring skill]
    ↓
[CWF-130: topic_novelty_analysis skill]
    ↓
[CWF-140: research_synthesis skill]
    ↓
[research namespace] stores synthesis
    ↓
[CWF-210: script_outline_generator skill]
    ↓
[CWF-220: script_debate_critic skill]
    ↓
[CWF-230: script_validator skill]
    ↓
[script namespace] stores final script
    ↓
[WF-020: Approval Gate]
  - YAMA checks: ✓ Policy compliant
  - KUBERA checks: ✓ Cost within budget
  - Script Director checks: ✓ Quality threshold met
    ↓
[WF-600: Analytics Pack]
    ↓
COMPLETE — Script ready for publication
```

**What Got Created:**
✅ Topic parsed and qualified
✅ Research synthesized from sources
✅ Script with outline, hooks, sections
✅ Debate and counterarguments addressed
✅ Full quality validation passed
✅ Governance approved (policy + budget + quality)
✅ Analytics collected
✅ Dossier created with full audit trail
✅ 8 packets emitted

---

## Use Case 2: Script Rejection → Replay/Remodify

**Scenario:** Approval Gate rejects script for "weak evidence"

**System Flow:**

```
[WF-020: Approval Gate]
  Script Director review: ✗ REJECTED
    ↓
[WF-021: Replay/Remodify]
  Loads checkpoint_stage: "research"
  Rolls back to research state
  Calls research_director for second opinion
  Generates additional sources
  Re-runs CWF-210 (script generation)
    ↓
[WF-020: Approval Gate] (second time)
  Script Director review: ✓ APPROVED
    ↓
COMPLETE — Script approved after remodify
```

**Key Points:**
- Saved time by replaying from checkpoint
- Full audit of which versions were used
- Dossier shows full remodify history

---

## Use Case 3: Cost Governance (KUBERA Budget Gate)

**Scenario:** System tracks cost and enforces budget limits

```
[dossier.runtime.cost_tracker]:
  - total_cost_usd: $0.47
  - kubera_budget_remaining: $49.53 (from $50 monthly)
    ↓
[WF-020: KUBERA Check]:
  Current cost: $0.47
  Budget available: $49.53
  Cost gate: ✓ PASS
    ↓
APPROVED for publication
```

**Phase-2 Scenario (Cloud Models):**
If using cloud models, cost tracking enforces budget limits and prevents overspend.

---

## Use Case 4: Mode-Based Execution (Self-Learning)

**Scenario:** Run in self_learning_mode to improve future executions

```
[WF-010: Mode Selection]
  selected_mode: "self_learning_mode"
    ↓
[mode_validator]:
  Checks: Transition legal? ✓
  Nesting rules satisfied? ✓
    ↓
[Execution runs normally]
  But with additional data collection
    ↓
[CWF-610: Analytics Collector]
  Collects metrics
    ↓
[CWF-620: Evolution Feedback Processor]
  Compares to baselines
  Identifies improvements
    ↓
[CWF-630: Learning Loop Closer]
  Synthesizes learnings
  Updates recommendations
    ↓
[evolution namespace] stores learnings
    ↓
COMPLETE — System improved for next runs
```

---

## Use Case 5: Error Handling & Recovery

**Scenario:** Ollama times out, system recovers

```
[CWF-140: Research Synthesis]
  ... timeout after 60 seconds ...
    ↓
[WF-900: Error Handler]
  Classifies: "network_error"
  Logs to error_trace
    ↓
[WF-901: Error Recovery]
  Retry CWF-140 with backoff
  Retry 1, 2, 3...
  Success on retry 3 ✓
    ↓
[Execution continues]
    ↓
COMPLETE — Despite error, system recovered
```

---

## Use Case 6: Workflow Routing

**ROUTE_PHASE1_STANDARD (Full, 10-15 min):**
- All topic intelligence stages
- All script intelligence stages
- All context stages
- Full approval gates
- Full analytics

**ROUTE_PHASE1_FAST (Abbreviated, 3-5 min):**
- Quick entity extraction
- Compressed research (fewer sources)
- Light quality validation
- Reduced approval checks
- Minimal analytics
- Best for rapid prototyping

---

## Use Case 7: Mode-Specific Hard Non-Overridables

**CREATOR Mode constraints:**
- Cannot suppress contradictions — if research finds conflicting views, must include both
- Must cite sources — every claim needs attribution
- Quality threshold 0.85 (non-negotiable) — scripts below 0.85 must be rejected

**Versus BUILDER Mode:**
- Can suppress contradictions
- Can reference "industry knowledge" without attribution
- Quality threshold 0.70 (more flexible)

---

## Use Case 8: Packet Lineage & Replay

**Packet Lineage:**
```
topic_discovery_packet (CWF-110)
  ↓
research_synthesis_packet (CWF-140)
  ↓
script_generation_packet (CWF-210)
  ↓
script_debate_packet (CWF-220)
  ↓
script_refinement_packet (CWF-230)
  ↓
final_script_packet (CWF-240)
  ↓
approval_packet (WF-020)
  ↓
analytics_collection_packet (CWF-610)
```

**Replay from Checkpoint:**
- User rejects output, requests replay from research checkpoint
- System rolls back to version 5 (before script generation)
- Modifies research, re-runs script generation onward
- Creates version 2 packets
- Old packets remain in audit trail

---
