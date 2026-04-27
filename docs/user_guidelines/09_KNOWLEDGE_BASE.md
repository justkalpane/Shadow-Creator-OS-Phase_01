# Knowledge Base: Core Concepts and Glossary

## Core Concepts (5-Minute Read)

### Immutable State
**Definition:** Dossier state that cannot be overwritten, only extended.
**Why:** Preserves full history for audit, debugging, and replay.
**Example:** If script quality changes from 0.82 to 0.88, both versions are logged.

### Append-Only Mutation
**Definition:** Changes are added to audit log, never overwritten.
**Pattern:** (timestamp, owner, version, delta_id) + new_value.
**Benefit:** Every change is traceable and replayable.

### Governance Authority
**Definition:** Directors who make decisions and can veto.
**Examples:** YAMA (policy), KUBERA (budget), Script Director (quality).
**Power:** Can reject workflows, require re-work, escalate to founder.

### Skill DNA
**Definition:** Modular operation with identity, role, governance, validation.
**Components:** ID, name, purpose, inputs, outputs, escalation, quality_threshold.
**Reusability:** Skills can be called by multiple workflows.

### Packet Schema
**Definition:** Typed data structure for state transitions.
**Enforcement:** All packets validated against schema before emission.
**Lineage:** Every packet knows its dossier, producer, timestamp.

### Registry Authority
**Definition:** Machine-readable source of truth.
**Types:** Model, mode, skill, director, workflow, route, provider, UI.
**Law:** No artifact runs unless in registry first.

### Dossier Namespace
**Definition:** Logical grouping of related state.
**Examples:** intake (user input), discovery (topic analysis), script (generated content).
**Ownership:** Each workflow owns the namespace it writes to.

### Validation Gate
**Definition:** Checkpoint that verifies safety before proceeding.
**Types:** Model selection, mode transition, workflow structure, runtime state.
**Result:** Pass → proceed; Fail → error routing.

### Replay Checkpoint
**Definition:** Saved dossier state that can be restored.
**Use:** If workflow fails or needs remodification, restart from checkpoint.
**Example:** Reject script, replay from research checkpoint, regenerate script.

### Quality Threshold
**Definition:** Minimum quality score required to proceed.
**Enforcement:** Script Director checks quality; below threshold → send to refinement.
**Flexibility:** Different thresholds per mode (creator 0.85, builder 0.70).

---

## Complete Glossary (50+ Terms)

### A
**Append-Only:** Mutation pattern where changes are added, never overwritten. See Immutable State.
**Approval Gate:** WF-020 workflow that checks policy, budget, quality before approval.
**Asset Brief:** Instructions for generating media assets (thumbnails, B-roll, captions).

### B
**Budget Gate:** KUBERA's cost enforcement. Rejects if over budget.
**Builder Mode:** Operational mode for content builders. Can suppress contradictions. Quality threshold 0.70.

### C
**Checkpoint:** Saved dossier state that can be restored for replay.
**CWF:** Child Workflow. Workflows numbered CWF-110 through CWF-630 (children of pack parents).
**Cost Tracker:** Part of dossier.runtime that tracks total_cost_usd and cost_by_model.
**Creator Mode:** User-facing mode for content creators. Must cite sources. Quality threshold 0.85.

### D
**Delta:** Single change entry in dossier_delta_log. Includes timestamp, owner, version, old_value, new_value.
**Dossier:** Immutable execution state for one topic-to-publication run.
**Director:** Governance authority (YAMA, KUBERA, Topic Director, etc.).
**DNA Injection:** Metadata that every skill carries (identity, role, governance, validation).

### E
**Evolution:** Namespace for feedback loops and learning cycles.
**Escalation:** Route to higher authority (e.g., Script Director escalates to founder).

### F
**Fallback Chain:** Series of models to try if primary model fails. Defined in model_registry.yaml.
**Founder Mode:** User-facing mode with full authority. Can override any director decision.

### G
**Governance:** System of directors, rules, and escalation paths.
**Governance Level:** How much authority a mode has (0=none, 1=limited, 2=creator-level, 3=founder-level).

### I
**Immutable:** Cannot be changed. Dossier is append-only immutable.
**Intake:** Namespace for user input (topic, mode, model selection).

### K
**KUBERA:** Budget governance director. Enforces cost limits.
**Knowledge Plane:** Conceptual layer for future knowledge integration (Phase-5+).

### M
**Mode:** Operational context (creator, builder, operator, founder, or alert/troubleshoot/replay/etc.).
**Mode Registry:** Machine-readable definition of all 12 modes.
**Model Routing:** Process of selecting which LLM to use based on task, cost, capability.
**Mutation:** Change to dossier state. Always logged in delta_log.

### N
**Namespace:** Logical grouping in dossier (intake, discovery, research, script, etc.).
**Non-Overridable:** Hard constraint that cannot be bypassed (e.g., creator mode must cite sources).

### O
**Operator Mode:** User-facing mode for workflow operators. Limited authority.
**Ollama:** Local LLM engine used in Phase-1. Primary model: llama3.2.

### P
**Packet:** Typed state transition emitted by every workflow.
**Packet Schema:** JSON/YAML definition of packet structure.
**Phase:** Release phase (Phase-1 text only, Phase-2+ advanced features).
**Policy:** Rules enforced by YAMA (brand guidelines, legal boundaries, etc.).
**Provider:** Source of LLMs (Ollama Phase-1, OpenRouter Phase-2+, etc.).

### Q
**Quality Score:** 0-1 metric of output quality. Script Director enforces quality threshold.
**Quality Threshold:** Minimum quality score required (creator 0.85, builder 0.70).

### R
**Registry:** Machine-readable source of truth (model, mode, skill, director, workflow, etc.).
**Route:** Routing strategy (ROUTE_PHASE1_STANDARD, ROUTE_PHASE1_FAST, ROUTE_PHASE1_REPLAY).
**Replay:** Re-execution from a checkpoint after failure or rejection.

### S
**Schema:** Data structure definition (dossier schema, packet schemas, etc.).
**Skill:** Modular operation (topic parsing, script drafting, etc.).
**Skill DNA:** Metadata every skill carries (purpose, inputs, outputs, escalation, quality).
**Script Director:** Director who enforces quality and coherence.

### T
**Threshold:** Minimum value required to proceed (quality_threshold, etc.).
**Topic Director:** Director who qualifies topics for relevance.
**Trace:** Audit trail (model_routing_trace, error_trace, workflow_transition_trace).
**Trigger:** Manual or event-based start of a workflow.

### U
**UI Registry:** Machine-readable definition of screens and components.
**User Guide:** Documentation for users of the system.

### V
**Validator:** Safety checkpoint (model_validator, mode_validator, etc.).
**Veto:** Director's power to reject a workflow.

### W
**Workflow:** n8n orchestration unit (WF-000, WF-010, CWF-110, etc.).
**Workflow Registry:** Machine-readable list of all workflows.
**Workflow Transition:** Movement from one workflow to next. Logged in workflow_transition_trace.

### Y
**YAMA:** Policy enforcement director. Checks legal compliance, brand alignment.

---

## Common Questions

**Q: What happens if a workflow fails?**
A: Error is logged, classified, and routed to WF-900 (error handler). WF-901 attempts recovery.

**Q: Can I overwrite dossier state?**
A: No. Only append-only mutations allowed. Every change logged in delta_log with version number.

**Q: What's the difference between creator and builder mode?**
A: Creator: must cite sources, cannot suppress contradictions, quality ≥0.85. Builder: can omit citations, can suppress, quality ≥0.70.

**Q: How do I replay a failed workflow?**
A: Use WF-021 (replay/remodify). Select checkpoint_stage (discovery, research, script, etc.). System rolls back to that point and resumes.

**Q: What is a packet?**
A: Typed message emitted at every workflow transition. Contains dossier reference, producer workflow, timestamp, schema version, payload.

**Q: How is cost tracked?**
A: Every model call tracked in model_routing_trace. Total accumulated in dossier.runtime.cost_tracker. KUBERA enforces limits.

**Q: What if KUBERA rejects for budget?**
A: Workflow stops. Founder can override in founder mode, or reduce scope in builder mode.

**Q: How do I see what changed in a dossier?**
A: View dossier_delta_log. Shows every change with: delta_id, timestamp, owner_workflow, field_changed, old_value, new_value, version_number.

---
