# Worker Router Law
## Shadow Empire / Creator OS
## Classification: Constitutional Machine Law — Runtime Dispatch
## Status: Wave 00 Established

---

## PURPOSE

The Worker Router is the neural dispatch contract between routes, skills, workers,
queues, and Vayu. It answers the question: "Given this route, this stage, and this
hardware class, which worker class should execute this task?"

Without a Worker Router, route execution is ambiguous. Ambiguity produces:
- unpredictable provider calls
- worker class mismatches (e.g., trying to run Python-task on a host without Python)
- DLQ confusion (failures with no clear remediation target)
- replay logic that cannot choose a worker

---

## CANONICAL REGISTRY REFERENCE

`registries/worker_router_contract.yaml`

---

## WORKER CLASS LEGALITY

A worker class is **legal** for a route if and only if:

1. The worker class appears in `registries/worker_router_contract.yaml` with `status: active_phase1`
2. The route's `route_worker_assignments` explicitly binds this worker class
3. The host runtime can instantiate the worker class (checked by Vayu at dispatch time)
4. The worker class is compatible with the current runtime mode (local / hybrid / cloud / untrusted_local)

A worker class listed but marked `status: UNAVAILABLE` must not be dispatched.
For Phase-1, `local_python_task_runner` is UNAVAILABLE because Python 3 is not
installed on the current Windows target machine. All Python-dependent logic must
be rewritten in JavaScript or deferred. See release blocker **RB-006**.

---

## QUEUE BINDING

Each worker class declares its queue binding. Phase-1 uses a single default queue:
- `n8n_default_queue` for all local JS task runner work

Future phases may introduce:
- `provider_bridge_queue` for HeyGen / ElevenLabs / YouTube callback work
- `heavy_render_queue` for Fargate / render-farm offload

No work may be enqueued to a queue not declared in the contract.

---

## FALLBACK WORKER BEHAVIOR

If the primary worker for a route is unavailable at dispatch time:

1. Check the contract for `fallback_worker`.
2. If `fallback_worker: none_escalate_to_wf900`, the task escalates to WF-900
   Error Handler with `error_code: SE-P1-002` (local_model_unavailable)
   or equivalent.
3. If a fallback worker is named, Vayu validates the fallback's capability
   envelope matches the task requirements before dispatch.
4. If no legal fallback exists, the task enters DLQ.

Fallback must never silently downgrade a task's safety posture.
A premium-governed task cannot fall back to an unguarded worker.

---

## REPLAY LEGALITY

A task is replay-legal if and only if:

1. The worker class declares `replay_legal: true` in the contract
2. The dossier state permits replay (approval state is `replay_ready` or `replayed`)
3. The error family resolution from WF-900 indicates `replay_target` pointing
   to a route + worker combination that is still legal
4. The replay count has not exceeded the per-route ceiling

Workers with `replay_legal: false` may only execute once per task.
Retries for such workers must be classified as new tasks with audit lineage.

---

## DLQ SEMANTICS

Phase-1 dead-letter target: `se_error_events` (the live n8n Data Table).

Current DLQ discipline:
- `max_retry_before_dlq: 1` (one retry, then dead-letter)
- `dlq_escalation_target: WF-900`

A task entering DLQ must:
1. Write one row to `se_error_events` with full envelope
2. Emit an audit event of type `workflow_failed`
3. Optionally trigger WF-900 if replay is eligible

DLQ is not a silent graveyard. Every DLQ entry requires either:
- a founder-approved close (audited), OR
- a replay instruction from WF-900

---

## ROUTE-WORKER ASSIGNMENT TRUTH

For Phase-1:

| Route                  | Primary Worker         | Max Concurrent | Queue Mode  |
|------------------------|------------------------|----------------|-------------|
| ROUTE_PHASE1_STANDARD  | local_js_task_runner   | 1              | sequential  |
| ROUTE_PHASE1_FAST      | local_js_task_runner   | 1              | sequential  |
| ROUTE_PHASE1_REPLAY    | local_js_task_runner   | 1              | sequential  |

Phase-1 is deliberately single-threaded per lane. This is a safety posture,
not a performance limitation. Concurrent execution introduces race conditions
in dossier mutation that are not yet governed.

See `registries/worker_router_contract.yaml` for the canonical machine truth.

---

## FAILURE ISOLATION

A failed worker must not corrupt:
- the dossier (patch-only law preserves integrity)
- the queue (failed task moves to DLQ, not back to queue)
- the audit log (audit is append-only)
- the runtime index (last healthy state is preserved)

Isolation is the operational form of the patch-only law.

---

## RELATED FILES

- `registries/worker_router_contract.yaml`
- `registries/route_registry.yaml`
- `registries/mode_route_registry.yaml`
- `registries/release_blocker_matrix.yaml` (RB-006 for Python task runner)
- `schemas/governance/audit_event.schema.json`
- `docs/01-architecture/prompt_registry_interlock_law.md`
