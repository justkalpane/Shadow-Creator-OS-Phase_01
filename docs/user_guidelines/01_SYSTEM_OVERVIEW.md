# System Overview: Shadow Creator OS Architecture

## The 5-Layer Architecture

Shadow Creator OS is built in 5 layers:

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 5: ORCHESTRATION (n8n Workflows & Routing)       │
│  31 Workflows: WF-000 to WF-600 + CWF-110 to CWF-630   │
├─────────────────────────────────────────────────────────┤
│  LAYER 4: SKILLS & DIRECTORS (Governance & Operations)  │
│  75 Skills: Topic, Research, Script, Context, Media     │
│  7 Directors: YAMA, KUBERA, Topic, Research, Script... │
├─────────────────────────────────────────────────────────┤
│  LAYER 3: STATE (Dossier & Packets)                     │
│  Dossier: 12 namespaces, append-only, versioned         │
│  Packets: 318 schema families, typed transitions        │
├─────────────────────────────────────────────────────────┤
│  LAYER 2: REGISTRIES (Machine-Readable Truth)           │
│  9 Registries: Model, Mode, Skill, Director, Workflow.. │
│  223 Entries, 100% cross-reference verified             │
├─────────────────────────────────────────────────────────┤
│  LAYER 1: RUNTIME (Validators & Engines)                │
│  5 Validators: Model, Mode, UI, Workflow, Runtime       │
│  4 Engines: Skill Loader, Dossier, Packet, Approval     │
└─────────────────────────────────────────────────────────┘
```

## Layer 1: Runtime (Bottom)

**What it does:** Validates and executes everything safely.

**Key Components:**

| Component | Purpose |
|-----------|---------|
| **model_validator.js** | Validates model selection, fallback chains, cost gates |
| **mode_validator.js** | Validates mode transitions, governance levels, nesting |
| **ui_validator.js** | Validates UI screens, components, navigation |
| **workflow_validator.js** | Validates workflow JSON structure, dossier mutations |
| **runtime_validator.js** | Validates dossier state, delta log, namespace ownership |

**Key Rule:** VALIDATE_FIRST — No operation executes without validator approval.

## Layer 2: Registries

**What they are:** YAML/JSON files that are the source of truth for the entire system.

**9 Registries:**

1. **model_registry.yaml** — Lists all available LLMs
   - Phase-1: ollama_local_llama3.2 (PRIMARY, $0/k tokens)
   - Phase-2+: openrouter_claude_opus, gemini_pro_vision (DEFERRED)
   - Contains: model_id, model_family, phase_availability, cost_per_k_tokens, fallback_chain

2. **mode_registry.yaml** — Defines operational modes
   - User modes: founder, creator, builder, operator
   - Operational modes: alert_mode, troubleshoot_mode, analysis_dashboard_mode, self_learning_mode, replay_mode, safe_mode, debug_mode, context_engineering_mode
   - Contains: mode_id, governance_level, data_flow, nesting_rules, hard_non_overridables

3. **skill_registry.yaml** — Lists all 218 canonical skills (M-001 through M-245)
   - Architecture note: scope expanded beyond the initial 75-skill plan during build to support full Phase-1 director-coverage with reusable atomic skills.
   - Veins: discovery_vein, script_vein, context_vein, analytics_vein, etc.
   - Contains: skill_id, skill_name, file_path, phase_assignment, vein_assignment, status

4. **director_binding.yaml** — Defines 30 directors
   - Original 7 governance authorities (YAMA, KUBERA, plus 5 domain directors) preserved.
   - Architecture note: expanded to 30 directors covering Phase-1 through Phase-6 governance, observability, learning, and safety.
   - Contains: director_id, role, veto_conditions, escalation_path

5. **workflow_registry.yaml** — Lists all 31 workflows
   - System: WF-000 through WF-901
   - Packs: WF-100 through WF-600
   - Children: CWF-110 through CWF-630
   - Contains: workflow_id, producer_workflow, consumer_workflows, packet_family

6. **provider_registry.yaml** — Lists available providers
   - Phase-1: Ollama (local)
   - Phase-2+: OpenRouter, HuggingFace (DEFERRED)
   - Phase-4+: ElevenLabs, Stability (DEFERRED)

7. **route_registry.yaml** — Defines routing rules
   - ROUTE_PHASE1_STANDARD, ROUTE_PHASE1_FAST, ROUTE_PHASE1_REPLAY

8. **ui_registry.json** — Defines UI screens and components
   - 18 core screens, 8 shared components
   - Contains: screen_id, components, navigation_links

9. **subskill_registry.yaml** — Lists 25 micro-skills

**Key Rule:** REGISTRY_FIRST — Every artifact must exist in registry before runtime loads it.

## Layer 3: State (Dossier & Packets)

### Dossier (Content Dossier)

**What it is:** Immutable execution state for one topic-to-publication run.

**Structure:**
- **dossier_id:** Unique topic run identifier
- **status:** pending → in_progress → review → approved/rejected
- **12 namespaces:** intake, discovery, research, script, context, approval, runtime, media, publishing, analytics, evolution, system
- **Audit trails:** dossier_delta_log (all mutations), error_trace, model_routing_trace, mode_transition_trace, workflow_transition_trace

**Key Law: APPEND_ONLY**
- Never overwrite namespace content
- Only add delta log entries with: timestamp, owner_workflow, version_number, audit_id
- Enables replay from any checkpoint

### Packets (Typed State Transitions)

**What they are:** Schema-bound messages emitted at every workflow transition.

**Examples:**
- topic_discovery_packet: Emitted by CWF-110
- research_synthesis_packet: Emitted by CWF-140
- script_generation_packet: Emitted by CWF-210
- approval_packet: Emitted by WF-020
- analytics_collection_packet: Emitted by CWF-610

**Key Rule:** Every workflow emits exactly one packet. Every packet has a schema. Validators check packet compliance.

## Layer 4: Skills & Directors

### What Skills Are

**A skill is a modular operation.** Examples: "Topic Parsing", "Script Drafting", "Research Evidence Mapping"

**Skills carry DNA:**
- Identity (ID, name, purpose)
- Role (what category)
- Governance (escalation, quality threshold)
- Mutation law (what they read/write)
- Validation (how to check quality)

### What Directors Are

**A director is a governance authority.** Directors make decisions and enforce rules.

**7 Directors:**

1. **YAMA** — Policy Enforcement (checks content policy compliance)
2. **KUBERA** — Budget Governance (checks cost limits)
3. **Topic Director** — Domain Expert (checks topic relevance)
4. **Research Director** — Evidence Authority (checks source quality)
5. **Script Director** — Quality Authority (checks script coherence)
6. **Context Director** — Execution Planning (checks resource constraints)
7. **Media Director** — Asset Production (Phase-4+)

## Layer 5: Orchestration (n8n Workflows)

### Workflow Execution Flow

**WF-010 (Parent Orchestrator)** routes everything:

```
START → Load Dossier → Validate Mode → Select Model
  ↓
WF-100 (Topic Intelligence): CWF-110/120/130/140
  ↓
WF-200 (Script Intelligence): CWF-210/220/230/240
  ↓
WF-300 (Context Engineering): CWF-310/320/330/340
  ↓
WF-020 (Approval): YAMA check, KUBERA check, Directors approve/reject
  ↓
WF-600 (Analytics): Collect metrics, learn, close loop
  ↓
COMPLETE (or route to WF-021 Replay if rejected)
```

### 31 Total Workflows

- **System:** WF-000 (health), WF-001 (dossier create), WF-010 (parent), WF-020 (approval), WF-021 (replay), WF-900 (error), WF-901 (recovery)
- **Parents:** WF-100, 200, 300, 400, 500, 600
- **Children:** CWF-110 through CWF-630 (18 total)

## Key Rules

| Rule | Meaning |
|------|---------|
| **APPEND_ONLY** | Never overwrite dossier. Only add deltas. |
| **REGISTRY_FIRST** | No artifact runs unless in registry first. |
| **SCHEMA_BOUND** | All outputs must match packet schemas. |
| **VALIDATE_FIRST** | No operation without validator approval. |
| **GOVERNANCE_ENFORCED** | Every decision point has a director. |
| **AUDIT_EVERYTHING** | Every change logged for replay capability. |
| **ERROR_ROUTING** | All errors route to WF-900. |
| **COST_TRACKING** | Every model call tracked. |
| **POLICY_ENFORCED** | YAMA checks every content decision. |
| **PHASE_ISOLATED** | Phase-2+ workflows deferred. |

## How Everything Connects

User Topic → WF-010 → Loads dossier → Routes through packs → Directors approve → Analytics → Publication ready

**Every step is validated. Every change is logged. Every decision is audited.**

---
