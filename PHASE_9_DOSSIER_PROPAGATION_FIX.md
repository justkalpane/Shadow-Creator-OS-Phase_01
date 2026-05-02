# Phase 9 Dossier Propagation Fix - Implementation Guide
**Date:** 2026-05-03  
**Status:** ⚠️ CRITICAL - Blocking Phase 9 open-to-production readiness

---

## Executive Summary

Operator Core + n8n are executing workflows correctly, but **dossier_id is NOT propagating through the workflow chain**. This causes:

1. Packets written with `DOSSIER-UNSPECIFIED` instead of real dossier ID
2. Review Console shows "No outputs"
3. Dossier status stuck at `INTAKE_INITIALIZED`
4. Cannot proceed to Open WebUI until fixed

**Root Cause:** WF-010 Dossier Load Node is not extracting dossier_id from the webhook payload correctly, and subsequent workflow nodes don't pass it downstream.

---

## Live Test Evidence (2026-05-02)

### Test Case
```bash
npm run operator:ollama -- "Create a YouTube script about productivity and give me thumbnail ideas"
```

### Result
✅ Dossier created: `DOSSIER-1777627353811-5EHDZT4Y8`
✅ WF-001 triggered (HTTP 200)
✅ WF-010 triggered (HTTP 200)
❌ Outputs retrieved: `packets_count: 0`

### Evidence of Broken State
```bash
# Review outputs
curl http://localhost:5050/operator/outputs/DOSSIER-1777627353811-5EHDZT4Y8
Result: packets_count = 0, packets = []

# Check packet index
npm run packet:list | grep "DOSSIER-1777627353811"
Result: (no matches)

# Check what WAS created
npm run packet:list | tail -5
Result:
WF-010-COMP-1777627355908 | dossier=DOSSIER-UNSPECIFIED
WF-300-COMP-1777627354902 | dossier=<no-dossier>
WF-500-COMP-1777627355850 | dossier=<no-dossier>

# Inspect dossier
npm run dossier:inspect DOSSIER-1777627353811-5EHDZT4Y8
Result: 
  status: INTAKE_INITIALIZED
  current_workflow: WF-001
  (no runtime namespace updates)
  (no audit trail for WF-010)
```

---

## Architecture Breakdown

The issue manifests at 3 levels:

### Level 1: WF-010 Dossier Load Node
```
Input webhook: { dossier_id: "DOSSIER-...", route_id: "...", ... }
n8n wrapping:  { body: { dossier_id: "DOSSIER-...", ... } }
Code reads:    $json.dossier_id  ← Gets undefined!
Fallback:      "DOSSIER-UNSPECIFIED"
```

**Current code (BROKEN):**
```javascript
const dossier_id = $json.dossier_id || 'DOSSIER-UNSPECIFIED'
```

**Required fix:**
```javascript
const raw = $json || {};
const input = (raw.body && typeof raw.body === 'object') ? raw.body : raw;
const dossier_id = input.dossier_id || input.dossierId || 'DOSSIER-UNSPECIFIED';
// Now ensure it flows downstream:
return [{ json: { ...input, ...$json, dossier_id, dossier_ref: dossier_id } }];
```

### Level 2: WF-010 → Child Workflows (WF-100/200/300/400/500)
```
WF-010 executes: executeWorkflow("WF-100", {...})
Child receives:  $json parameter from parent
But if parent lost dossier_id, child never gets it
Child writes packets with: dossier: <no-dossier>
```

**Required fix:**
Each "Execute Workflow Node" in WF-010 must pass:
```javascript
{
  dossier_id: $json.dossier_id,
  dossier_ref: $json.dossier_id,
  route_id: $json.route_id,
  topic: $json.topic,
  // ... other params
}
```

### Level 3: Child Workflow Packet Writers
```
WF-300 creates packet:
  dossier_ref: $json.dossier_id || <missing>
If WF-010 didn't pass dossier_id, this becomes <no-dossier>
```

**Required fix:**
Each packet writer must check:
```javascript
const dossierId = $json.dossier_id || $json.dossier_ref || $json.parent_dossier_id || '<no-dossier>';
// Write to se_packet_index:
{
  dossier_id: dossierId,
  dossier_ref: dossierId,
  // ...
}
```

---

## Fix Strategy

### Option A: Manually Update Workflows in n8n UI (Immediate)

**Time:** ~30 minutes per workflow

1. Go to http://localhost:5678
2. Open "WF-010 Parent Orchestrator Canonical"
3. Find "Dossier Load Node" (blue code node after webhook trigger)
4. Replace jsCode with the normalized payload extraction
5. Find each "Execute Workflow Node" (WF-100, WF-200, etc.)
6. Ensure they pass dossier_id in parameters
7. Save and publish
8. Restart n8n

**Advantage:** Immediate fix, UI-driven
**Disadvantage:** Manual, error-prone, not version-controlled

### Option B: Replace WF-010 Completely (Safer)

**Time:** ~15 minutes

1. Export current WF-010 from n8n: Settings → Export
2. Use the fixed version from `/n8n/workflows/WF-010.json`
3. Delete old WF-010 in n8n
4. Import fixed version
5. Activate
6. Restart n8n

**Advantage:** Version-controlled, repeatable
**Disadvantage:** Requires n8n export/import flow

### Option C: Database Direct Patch (Advanced)

**Time:** ~10 minutes

1. Stop n8n
2. Find n8n database (SQLite or other)
3. Query: `SELECT id, name FROM workflow_entity WHERE name LIKE '%WF-010%'`
4. Update workflow `nodes` JSON column with fixed code
5. Restart n8n

**Advantage:** Fastest
**Disadvantage:** Risky, requires DB access

---

## Implementation Steps (Option B Recommended)

### Step 1: Export Current WF-010

```bash
# Go to n8n UI
# Settings (⚙️ icon) → Download
# Look for "WF-010 Parent Orchestrator Canonical"
# Click Download
# Save as: WF-010-backup-current.json
```

### Step 2: Verify Fixed Version

```bash
# Check that /c/ShadowEmpire-Git/n8n/workflows/WF-010.json has the fix:
grep "const raw = " /c/ShadowEmpire-Git/n8n/workflows/WF-010.json
# Should show: const raw = $json || {};
```

### Step 3: Delete Old WF-010

```
# In n8n UI
# Find WF-010 in Workflows list
# Click three dots → Delete
# Confirm
```

### Step 4: Import Fixed Version

```
# In n8n UI
# Settings (⚙️) → Import
# Choose file: /c/ShadowEmpire-Git/n8n/workflows/WF-010.json
# Click Import
# When prompted, select "Update existing workflow" or "Create new"
# (Choose based on what worked with delete)
```

### Step 5: Activate Workflow

```
# Find WF-010 in Workflows
# Click to open
# Toggle to "Active" (top right)
# Verify webhook is active
```

### Step 6: Restart Services

```bash
# Stop n8n
npm run n8n:stop || pkill -f "node.*n8n"

# Stop Operator
pkill -f "operator/server.js"

# Wait
sleep 3

# Start n8n
npm run n8n:start &

# Wait for startup
sleep 8

# Start Operator
npm run operator:start &

# Verify
curl http://localhost:5050/operator/health
curl http://localhost:5678/
```

---

## Parallel Fix: All Child Workflows

After fixing WF-010, also fix packet writers in:
- **WF-300** (Context Engineering Pack)
- **WF-500** (Publishing Distribution Pack)
- **WF-100**, **WF-200**, **WF-400**, **WF-600** (optional but recommended)

Each must ensure their final packet node includes:
```javascript
const dossierId = $json.dossier_id || $json.dossier_ref || 'unknown';
const packet = {
  packet_id: ...,
  dossier_id: dossierId,   // ← CRITICAL
  dossier_ref: dossierId,  // ← CRITICAL
  artifact_family: ...,
  artifact_type: ...,
  status: 'generated',
  created_at: new Date().toISOString(),
  content: {...}
};
```

---

## Verification (After Fix)

### Test 1: Fresh Content Job

```bash
npm run operator:ollama -- "Create a YouTube script about time management and give me thumbnail ideas"
```

Expected output includes:
```json
{
  "status": "accepted",
  "dossier_id": "DOSSIER-<timestamp>-<hash>"
}
```

### Test 2: Check Outputs

```bash
# Wait 5 seconds
sleep 5

# Get dossier ID from Test 1 output, then:
curl http://localhost:5050/operator/outputs/DOSSIER-<id>
```

**Expected:**
```json
{
  "packets_count": 3,  // ← NOT 0!
  "packets": [ ... ],  // ← Has entries!
  "grouped_by_type": {
    "orchestration_decision": [ ... ],
    "context_engineering_result": [ ... ],
    "publishing_distribution_result": [ ... ]
  }
}
```

### Test 3: Verify Packet Linkage

```bash
npm run packet:list | grep "DOSSIER-<id-from-test1>"
```

**Expected:**
```
WF-010-COMP-... | orchestration_decision | producer=WF-010 | dossier=DOSSIER-<id>
WF-300-COMP-... | context_engineering_result | producer=WF-300 | dossier=DOSSIER-<id>
WF-500-COMP-... | publishing_distribution_result | producer=WF-500 | dossier=DOSSIER-<id>
```

### Test 4: Review Console

```
Open: http://localhost:5050/operator/job/DOSSIER-<id-from-test1>
```

**Expected:**
- Generated Output Groups: Shows 3+ packets
- Reviewable outputs available: YES
- Topic: Visible
- Current stage: Shows WF-010 or READY_FOR_REVIEW

### Test 5: Dossier Inspection

```bash
npm run dossier:inspect DOSSIER-<id-from-test1>
```

**Expected:**
```json
{
  "status": "ORCHESTRATION_COMPLETE" or "READY_FOR_REVIEW",
  "current_workflow": "WF-010",
  "namespaces": {
    "runtime": {
      "orchestration_runs": [ ... ],
      "last_orchestration_status": "ORCHESTRATION_COMPLETE"
    }
  },
  "_audit_trail": [
    { workflow_id: "WF-001", operation: "DOSSIER_CREATE" },
    { workflow_id: "WF-010", operation: "ORCHESTRATION_UPDATE" }
  ]
}
```

---

## Rollback Plan

If fix causes regressions:

1. Restore backup:
   ```bash
   # In n8n UI: Import WF-010-backup-current.json
   # Or restore from git:
   git checkout HEAD~1 n8n/workflows/WF-010.json
   ```

2. Restart n8n:
   ```bash
   npm run n8n:stop
   npm run n8n:start
   ```

3. Verify health:
   ```bash
   curl http://localhost:5050/operator/health
   ```

---

## Success Criteria

✅ **PASS** when:
1. Fresh test dossier created
2. `/operator/outputs/{dossier_id}` returns `packets_count > 0`
3. `packet:list` shows packets linked to the real dossier ID
4. Review Console shows output groups
5. Dossier status updated beyond `INTAKE_INITIALIZED`
6. All audit trails recorded

❌ **FAIL** if:
- Still getting `DOSSIER-UNSPECIFIED`
- Still getting `<no-dossier>`
- Packets count remains 0
- Review console empty

---

## After This Fix: Next Steps

Once dossier propagation is fixed:

1. ✅ Phase 9 ready for Open WebUI
2. ✅ Can proceed with UI/chat interface
3. ✅ Can test full end-to-end orchestration
4. ✅ Can begin Phases 0-10 deployment

---

## Files Involved

- `/n8n/workflows/WF-010.json` - Fixed version exists here
- `/n8n/workflows/context/CWF-310-*.json` - Child workflows
- `/registries/n8n_webhook_registry.yaml` - Already updated ✅
- `/engine/api/operator.js` - Already has relinking fallback ✅

---

## Questions for Next Session

When you're ready to apply the fix:

1. Do you have access to n8n UI at localhost:5678?
2. Can you navigate to Settings → Download to export current WF-010?
3. Can you upload/import the fixed version?
4. Or do you prefer a database-level patch?

---

**Report Generated:** 2026-05-03  
**Urgency:** CRITICAL - Blocks Phase 9 production handoff
**Estimated Fix Time:** 15-30 minutes (Option B)
**Risk Level:** LOW (fix is non-breaking, easily reversible)
