# WF-901 Controlled Error Test — Operator Procedure

**Purpose:** Prove that **WF-900 (Error Handler)** captures real failures emitted by **WF-901 (Error Test)** with fresh evidence.

**Why this is a manual operator task:** Activation/deactivation of WF-901 must be guaranteed-safe. WF-901 fires every 1 minute against a dead port (`http://127.0.0.1:9999/force-error`), so leaving it active creates a continuous error stream. The n8n REST API requires session authentication (no API key configured in this Phase-1 deployment), so the controlled toggle is performed by the operator in the n8n web UI under direct supervision.

---

## Pre-flight (verified before this procedure)

- `npm run n8n:status` → returns `{"status":"ok"}` (port 5678 reachable)
- WF-901 is currently **inactive** (DB confirms `active=0` for id `HkaIUwmIIIowNKUA`)
- WF-900 is currently **active** (DB confirms `active=1` for id `1meEmfseU7fkH4ea`)
- WF-901's `errorWorkflow` setting is bound to WF-900's id (`1meEmfseU7fkH4ea`)
- WF-901 trigger is `Schedule Trigger` interval = 1 minute
- WF-901 HTTP target is `http://127.0.0.1:9999/force-error` (intentionally dead)

If any pre-flight item is wrong, **STOP** and resolve before activating WF-901.

---

## Procedure

### 1. Open n8n UI
Browser → `http://127.0.0.1:5678`. Sign in with the configured account.

### 2. Capture baseline
In a separate terminal at `C:\ShadowEmpire-Git`:
```powershell
npm run errors:list
npm run packet:list
```
Note the current counts. These are the "before" baseline.

In n8n UI:
- Open **Executions** (left sidebar) → filter **WF-900 Error Handler**. Note the **most recent execution timestamp** (or "no executions yet").
- Filter **WF-901 Error Test**. Note the **most recent execution timestamp**.

### 3. Activate WF-901 (the timed window starts here)
In n8n UI:
- Open the **SE-N8N-WF-901-Error-Test** workflow.
- Toggle **Active** to **ON** (top right).
- Note the activation timestamp.

### 4. Wait one full schedule tick
- Wait **70 seconds**. (Schedule = 1 minute; a 70 s window guarantees at least one tick.)
- Do not navigate away from the n8n UI.

### 5. Verify the failure event
In n8n UI:
- **Executions** → filter **WF-901**. There MUST be a new execution with status **FAILED** and the error **`ECONNREFUSED 127.0.0.1:9999`** (or similar connection-refused error).
- Click the failed execution → confirm the **HTTP Request** node failed.
- Capture the execution id (e.g. `123`).

### 6. Verify WF-900 captured the error
In n8n UI:
- **Executions** → filter **WF-900 Error Handler**. There MUST be a NEW execution that started **after** the WF-901 failure timestamp.
- Click that execution → confirm the input payload includes the WF-901 error context (workflow id `HkaIUwmIIIowNKUA`, the ECONNREFUSED message, and a timestamp).
- Capture the WF-900 execution id.

### 7. **DEACTIVATE WF-901 IMMEDIATELY**
In n8n UI:
- Open **SE-N8N-WF-901-Error-Test** workflow.
- Toggle **Active** to **OFF**.
- Confirm the toggle is OFF.

### 8. Confirm WF-901 is inactive
- In n8n UI **Executions** → filter **WF-901**. Wait 70 seconds again. **No new execution** must appear.
- If a new execution appears, WF-901 is still active. Repeat step 7.

### 9. Capture proof
In a terminal at `C:\ShadowEmpire-Git`:
```powershell
npm run errors:list
npm run packet:list
```
The "after" counts should be **greater** than the "before" counts (or equal if errors:list/packet:list don't track n8n executions in this Phase-1 build — the authoritative proof is the n8n Executions UI).

Save the captured ids and timestamps to a run log (e.g. `tests/reports/wf901_controlled_run_<UTC>.md`).

---

## Pass criteria

All four MUST be true:
1. **Fresh WF-901 failure** during the controlled window (id + timestamp recorded).
2. **Fresh WF-900 capture** triggered after the WF-901 failure (id + timestamp recorded, with WF-901 error context in the payload).
3. **WF-901 is inactive** at the end (toggle OFF, no new executions in the 70 s after deactivation).
4. **No unintended workflows became active** during the test.

---

## Fail / abort actions

If any of the following happen during the test, **stop and deactivate WF-901 immediately**:
- WF-900 does NOT trigger after a WF-901 failure (errorWorkflow binding broken; debug `settings.errorWorkflow`).
- More than one WF-901 execution fires before deactivation completes (operator was slow; OK — just confirm step 7 again).
- n8n becomes unreachable during the test (`npm run n8n:status` → not 200). Investigate and re-baseline.
- Any other workflow state changes unexpectedly.

---

## Why this is captured here, not run automatically

- This Phase-1 build does NOT have an n8n API key provisioned.
- Without an API key or stored session cookie, the CLI cannot toggle workflow activation safely.
- Direct DB writes while n8n is running risk corruption (n8n caches workflow state in memory).
- Using `n8n stop`+`db patch`+`n8n start` would close all observability for the duration of the test.

The operator-driven UI procedure above is the safest controlled mechanism for Phase-1.

---

## Future automation path (Phase-2 candidate)

To remove the manual step:
1. Provision an n8n API key (`/settings/api` in the n8n UI → create personal API key).
2. Store the key in a non-tracked secret file (`scripts/secrets/n8n_api_key.txt`, gitignored).
3. Build `scripts/cli/wf901_controlled_run.cjs` that:
   - reads the key,
   - PATCH `/api/v1/workflows/{id}` `{ active: true }`,
   - sleeps 70 s,
   - GET `/api/v1/executions?workflowId=...&status=error` (verifies failure),
   - GET `/api/v1/executions?workflowId=1meEmfseU7fkH4ea` (verifies WF-900 capture),
   - PATCH `/api/v1/workflows/{id}` `{ active: false }` (always — wrap in try/finally),
   - writes the run log to `tests/reports/`.

This is **deferred** until Phase-2 because the Phase-1 deployment posture explicitly requires operator-witnessed governance gate runs.
