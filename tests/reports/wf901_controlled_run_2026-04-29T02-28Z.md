# WF-901 Controlled Error-Capture Run — Evidence Log

**Run UTC:** 2026-04-28 20:58:00 — 20:59:30 (≈ 90 s window)
**Local clock:** 2026-04-29 02:28 — 02:29 IST
**Operator:** Claude Code (acting on user authorization)
**Local repo:** `C:\ShadowEmpire-Git`
**Repo HEAD before run:** `ae00532` (`feat: align workflow triggers for production ingress and internal orchestration`)
**n8n version:** 2.15.0
**n8n user folder:** `C:\ShadowEmpire\n8n_user\.n8n`
**n8n DB path:** `C:\ShadowEmpire\n8n_user\.n8n\database.sqlite`
**Result:** **VERIFIED COMPLETE — fresh paired WF-901→WF-900 capture proof obtained, WF-901 returned to inactive state.**

---

## 1. Pre-flight (verified before activation)

| Item | Value |
|---|---|
| n8n process running | PID 7800 (main) + 6584 (task runner) |
| `npm run n8n:status` | `{"status":"ok"}` 200 |
| `npm run health:check` | HEALTHY |
| `npm run validate:all` | PASS (0 errors, 1 known replay-cycle warning) |
| `npm run test:e2e` | 3/3 suites, 9/9 tests PASS |
| `npm run db:verify` | PASS (0 hard failures) |
| `npm run packet:list` | 98 packets |
| `npm run errors:list` | 0 |
| `npm run cost:report` | $0.0000 |

| Workflow | ID | Initial state | Trigger type |
|---|---|---|---|
| `SE-N8N-WF-901-Error-Test` | `HkaIUwmIIIowNKUA` | inactive | Schedule Trigger 1 min |
| `WF-900 Error Handler Canonical` | `n07PnSkr8hGoVdnI` | **ACTIVE** | Error Trigger |

WF-901 settings include `errorWorkflow: n07PnSkr8hGoVdnI` (DB-confirmed).
WF-901's HTTP node target is `http://127.0.0.1:9999/force-error` (intentional dead port — guaranteed fail).

Latest execution baseline before this run: id=248 (Codex's prior pair from 2026-04-28 18:41 UTC).

---

## 2. Activation procedure (proper n8n lifecycle)

The activation was NOT a DB-flag-only flip. It was the official n8n lifecycle:

1. **02:25:53.240 IST** — `n8n update:workflow --id=HkaIUwmIIIowNKUA --active=true` (CLI)
   CLI output:
   ```
   Publishing workflow HkaIUwmIIIowNKUA with current version
   Note: Changes will not take effect if n8n is running. Please restart n8n.
   ```

2. **02:26:29 IST** — Stopped n8n (PIDs 7800 + 6584). Port 5678 confirmed free.

3. **02:26:47 IST** — Started n8n via `scripts/windows/start_n8n_shadow_phase1.ps1`.

4. **02:27:12 IST** — n8n reachable (`/healthz` 200).

5. **n8n startup log confirmed scheduler activation event** (key line):
   ```
   Activated workflow "SE-N8N-WF-901-Error-Test" (ID: HkaIUwmIIIowNKUA)
   ```

This is the actual n8n scheduler picking up the active flag — a real lifecycle activation, not a stale DB row.

---

## 3. Capture evidence (DB-extracted)

Executions with id > 248 were collected from `workflow_entity` IDs `HkaIUwmIIIowNKUA` and `n07PnSkr8hGoVdnI`:

| Exec ID | Workflow | Status | Mode | Started UTC | Stopped UTC | Duration |
|---|---|---|---|---|---|---|
| **389** | WF-901 (HkaIUwmIIIowNKUA) | error | trigger | 2026-04-28 20:58:03.088 | 2026-04-28 20:58:03.443 | 355 ms |
| **390** | WF-900 (n07PnSkr8hGoVdnI) | success | **error** | 2026-04-28 20:58:03.482 | 2026-04-28 20:58:03.689 | 207 ms |
| **391** | WF-901 (HkaIUwmIIIowNKUA) | error | trigger | 2026-04-28 20:59:03.044 | 2026-04-28 20:59:03.113 | 69 ms |
| **392** | WF-900 (n07PnSkr8hGoVdnI) | success | **error** | 2026-04-28 20:59:03.172 | 2026-04-28 20:59:03.261 | 89 ms |

### Pair 1 (20:58 UTC tick)
- WF-901 fired by Schedule Trigger → HTTP request to `http://127.0.0.1:9999/force-error` → failed → exec 389 (error).
- 394 ms later, WF-900 fired with `mode=error` (n8n's internal flag for error-trigger workflows) → exec 390 (success).

### Pair 2 (20:59 UTC tick)
- WF-901 fired again → exec 391 (error).
- 128 ms later, WF-900 captured → exec 392 (success, mode=error).

### Hard evidence inside execution payloads
- **Exec 389 payload contains** the string `"ECONNREFUSED"` (offset 857) and `"9999"` (offset 2576) — confirms the actual HTTP failure to the dead port.
- **Exec 390 payload contains** the string `"HkaIUwmIIIowNKUA"` (offset 2479) and `"SE-N8N-WF-901-Error-Test"` (offset 6169) — confirms WF-900 received WF-901's id and name as the source-of-error context.

Both pairs satisfy the wave's pass criteria.

---

## 4. Deactivation procedure

1. **02:29:32.745 IST** — `n8n update:workflow --id=HkaIUwmIIIowNKUA --active=false` (CLI).
   CLI output:
   ```
   Deactivating workflow with ID: HkaIUwmIIIowNKUA
   Note: Changes will not take effect if n8n is running. Please restart n8n.
   ```

2. **02:29:53 IST** — Stopped n8n (PIDs 11028 + 19840). Port 5678 free.

3. **02:30:09 IST** — Restarted n8n via launcher.

4. **02:30:39 IST** — n8n reachable (200).

5. **n8n startup log confirmed scheduler did NOT activate WF-901 this time.** The "Activated workflow" lines on this restart listed only:
   - WF-020 Final Approval Canonical
   - WF-021 Replay Remodify Canonical
   - WF-010 Parent Orchestrator Canonical
   - WF-900 Error Handler Canonical (preserved active)
   - WF-000 Health Check Canonical
   - WF-001 Dossier Create Canonical
   - WF-500 Publishing Distribution Pack Canonical
   
   **WF-901 absent from the activation list = scheduler deregistered it.**

6. **02:30:58 — 02:32:18 IST** — 80-second post-deactivation observation window.

7. **DB at 02:32:18 IST** — `SELECT * FROM execution_entity WHERE workflowId='HkaIUwmIIIowNKUA' AND id > 392` → **0 rows.** No new WF-901 execution.

8. **DB final state** — `workflow_entity.active` for `HkaIUwmIIIowNKUA` = **0 (inactive)**. WF-900 (`n07PnSkr8hGoVdnI`) preserved at `active = 1`.

---

## 5. Pass-criteria verdict

| Criterion | Required | Actual | Status |
|---|---|---|---|
| Fresh WF-901 failure during controlled window | ≥ 1 | 2 (exec 389, 391) | **PASS** |
| Fresh WF-900 capture triggered after WF-901 failure | ≥ 1 | 2 (exec 390, 392, both `mode=error`) | **PASS** |
| WF-900 payload references WF-901 as source | yes | yes (both id and name found) | **PASS** |
| WF-901 inactive at end | yes | DB `active=0`, no new exec in 80 s window, scheduler omits from activation list | **PASS** |
| No unintended workflows became active | yes | Only the previously-active set + WF-900 (preserved); no new activations introduced by this run | **PASS** |
| Validation gate green throughout | yes | Pre-run + post-run gate green | **PASS** |

**All pass criteria met.**

---

## 6. Post-run validation gate

| Command | Result |
|---|---|
| `npm run n8n:status` | 200 OK `{"status":"ok"}` |
| `npm run health:check` | HEALTHY (10/10 OK) |
| `npm run validate:all` | PASS (0 errors, 1 known `ALLOWED_REPLAY_CYCLE` warning) |
| `npm run test:e2e` | PASS (3 suites / 9 tests) |
| `npm run db:verify` | PASS (0 hard failures) |
| `npm run packet:list` | 98 packets (unchanged — controlled test does not append to repo packet index) |
| `npm run errors:list` | 0 |
| `npm run cost:report` | $0.0000 |

---

## 7. What is NOT proven by this run

- This run does **not** prove repo-side packet-index lineage capture from n8n executions. The current build's repo `data/se_packet_index.json` is not wired to receive n8n execution deltas; that integration is a deferred Phase-2 concern.
- This run does **not** prove WF-021 replay-on-failure cycle. That requires a separate test.
- This run does **not** prove the recoverable-vs-non-recoverable classification logic of `WF-901 Error Recovery Canonical` (`BbjcT4oukLiL14tR`) — that is a different workflow with `executeWorkflowTrigger` and is invoked from WF-900 only when WF-900 itself routes to it. Out of scope here.

---

## 8. Files produced by this run

- This log: `tests/reports/wf901_controlled_run_2026-04-29T02-28Z.md`
- No repo data/state files modified by the controlled run itself.
- WF-901 returned to its prior inactive state.

---

## 9. Final state delta vs pre-run

| Field | Pre | Post | Delta |
|---|---|---|---|
| HEAD | ae00532 | ae00532 | 0 |
| Repo packet count | 98 | 98 | 0 |
| Repo dossier count | 15 | 15 | 0 |
| n8n executions max id | 248 (relevant pair table) → actually 386 across all wfs | 392 | +4 (the 2 paired captures) |
| WF-901 active | 0 | 0 | back to baseline |
| WF-900 active | 1 | 1 | preserved |

---

## 10. Verdict

**VERIFIED COMPLETE** for the WF-900/WF-901 controlled error-capture validation gate. Fresh, timestamped, payload-correlated paired evidence is captured. WF-901 is fully inactive at end of run. Validation gate is green at run completion.
