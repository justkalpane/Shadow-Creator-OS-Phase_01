# Mission Control / Chronos Contract
## Shadow Empire / Creator OS
## Classification: Constitutional Machine Law — Observability and Control Plane
## Status: Wave 00 Established (Stub — Implementation deferred to P1/P2)

---

## PURPOSE

Mission Control and Chronos are the observability and control-plane layer for
the Shadow Empire runtime. They are not vague "later polish." They are runtime
authorities that govern how the system is observed, traced, and remediated.

This document establishes the contract. Implementation is deferred to P1/P2.

---

## MISSION CONTROL

Mission Control is the primary operational surface for the Founder mode dashboard
(SCR-006). It provides:

### Required Capabilities

**DAG Visibility**
- Visual representation of the active workflow execution graph
- Nodes: each workflow in the current execution chain
- Edges: handoff points between workflows
- Status overlay: active, completed, failed, waiting states per node

**Weighted Critical-Path ETA**
- For each active dossier, Chronos must compute the expected completion time
- ETA accounts for: current stage, queue depth, historical execution durations
- ETA accuracy target: ±15% for phases with historical data
- ETA display: in minutes for active workflows, in hours for multi-stage chains

**Bottleneck Detection**
- Identify workflow stages where execution time exceeds the p75 baseline
- Surface: stage name, current delay, recommended action (wait / escalate / skip)
- Trigger threshold: 2x the historical median for that stage

**Queue / Dossier State**
- Per-lane queue depth (standard / fast / replay)
- Active dossier count per lane
- Dossiers waiting for approval (blocked on se_approval_queue pending_action)

**RCA Navigation**
- Route: alert -> incident -> root cause -> repair action
- Each step in the RCA must be navigable from within Mission Control
- Deep-link to: se_error_events (errors), se_approval_queue (approvals),
  se_dossier_index (dossier state), se_route_runs (execution history)

---

## CHRONOS

Chronos is the timing and scheduling engine that powers Mission Control's ETA
and bottleneck capabilities.

### Chronos Responsibilities

1. **Execution time tracking** — record start and end timestamps for each
   workflow stage. Store in `se_route_runs` with `ended_at` field.

2. **Baseline computation** — maintain rolling median and p75 execution time
   per workflow ID. Reset on major version changes.

3. **ETA projection** — project completion time based on remaining stages,
   their historical baselines, and current queue depth.

4. **Alert threshold enforcement** — emit an alert event when a stage exceeds
   2x its historical median. Alert targets: Mission Control dashboard + se_error_events.

5. **SLA tracking** — if founder has defined SLA targets (e.g., "topic-to-script
   in under 4 hours"), Chronos must emit a warning at 75% of the SLA window.

### Chronos Data Sources (Phase-1)

| Data | Source |
|------|--------|
| Execution start/end | se_route_runs (started_at, ended_at) |
| Error events | se_error_events |
| Dossier state | se_dossier_index |
| Approval state | se_approval_queue |

### Chronos Data Sources (Future)

A dedicated Chronos state table may be created in later phases to store:
- per-stage execution baselines
- SLA target definitions
- alert threshold configurations

---

## PHASE-1 OBSERVABILITY POSTURE

Phase-1 does not have a full Mission Control implementation. The posture is:

**Manual observation:** Founder monitors state through:
- Direct n8n execution log (visible in n8n UI)
- se_error_events table (viewable in n8n Data Tables UI)
- se_dossier_index table (viewable in n8n Data Tables UI)
- se_route_runs table (viewable in n8n Data Tables UI)

**Auto-escalation:** WF-900 Error Handler auto-escalates critical errors.
This is the Phase-1 proxy for Mission Control alerting.

**RCA path:** Founder reviews error events manually → traces to source workflow
via workflow_id and child_workflow_id fields → takes remediation action.

---

## ACTIVATION TIMELINE

| Component | Status | Wave |
|-----------|--------|------|
| Contract (this doc) | DONE | Wave 00 |
| Data table foundations (se_route_runs ended_at) | PARTIAL | P0 |
| Basic dashboard surface (SCR-005 errors screen) | Stub | P1 |
| Mission Control screen (SCR-006) | Deferred | P2 |
| Chronos engine | Deferred | P2 |

---

## RELATED FILES

- `registries/dashboard_screen_contract_pack.yaml` (SCR-006)
- `registries/dashboard_api_contract_pack.yaml`
- `schemas/governance/audit_event.schema.json`
- `docs/01-architecture/worker_router_law.md`
