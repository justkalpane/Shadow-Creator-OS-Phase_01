# Manual n8n Workflow Activation Guide

**Status**: ✅ 37 workflows imported to n8n | ⏳ Awaiting manual activation in UI

---

## Current State

- ✅ **n8n is running** on http://localhost:5678
- ✅ **All 37 workflows are imported** into n8n database
- ⏳ **All workflows are currently INACTIVE** (default import behavior for safety)
- ❌ **Webhooks not registered** (will register when workflows are activated)

## What Needs to Happen

Each of the 37 workflows needs to be **activated** (toggled on) in the n8n UI to register their webhooks and make them available for execution.

---

## Step-by-Step Activation Instructions

### Step 1: Open n8n Web Interface

1. Open your browser
2. Navigate to: **http://localhost:5678**
3. Sign up or log in (create an account if needed)

### Step 2: Activate Each Workflow

For **EACH** of the following workflows, follow these steps:

**Critical Path Workflows** (Activate These First):
- WF-001 (Dossier Create)
- WF-010 (Parent Orchestrator)
- WF-020 (Final Approval)
- WF-100 (Topic Intelligence)
- WF-200 (Script Intelligence)
- WF-300 (Context Engineering)
- WF-400 (Media Production)
- WF-500 (Publishing Distribution)

**For each workflow**:
1. Click the workflow name in the sidebar or search for it
2. You should see the workflow canvas with nodes and connections
3. In the **top-right corner**, look for an **OFF/ON toggle button**
   - It will show **"Inactive"** or similar (greyed out)
4. Click the toggle to turn it **ON** (should show as green/active)
5. You should see a message like: **"Workflow activated"** or webhook paths appear
6. Click **Save** (if there's a save button)
7. Move to the next workflow

### Step 3: Verify Activation

After activating the critical path workflows, verify they're active:

1. In n8n, go to **Workflows** list
2. Look for the **Active** column
3. The critical workflows should show as **Active** (checkmark or green indicator)

### Workflow Priority Order

**Must Activate (for Phase 1 to work)**:
1. WF-001 ✓ Dossier Create (entry point - CRITICAL)
2. WF-010 ✓ Parent Orchestrator (orchestration - CRITICAL)
3. WF-020 ✓ Final Approval (completion - CRITICAL)
4. WF-100 ✓ Topic Intelligence (child workflow)
5. WF-200 ✓ Script Intelligence (child workflow)
6. WF-300 ✓ Context Engineering (child workflow)
7. WF-400 ✓ Media Production (child workflow)
8. WF-500 ✓ Publishing Distribution (child workflow)

**Optional (Phase 2+)**:
- WF-000, WF-600, WF-021, WF-022, WF-023, WF-900, WF-901
- CWF-110 through CWF-630 (child workflow variants)

---

## Complete List of Workflows to Activate

| Workflow ID | Name | Priority |
|---|---|---|
| WF-001 | Dossier Create Canonical | ⚠️ CRITICAL |
| WF-010 | Parent Orchestrator Canonical | ⚠️ CRITICAL |
| WF-020 | Final Approval Canonical | ⚠️ CRITICAL |
| WF-100 | Topic Intelligence Pack | ⚠️ CRITICAL |
| WF-200 | Script Intelligence Pack | ⚠️ CRITICAL |
| WF-300 | Context Engineering Pack | ⚠️ CRITICAL |
| WF-400 | Media Production Pack | ⚠️ CRITICAL |
| WF-500 | Publishing Distribution Pack | ⚠️ CRITICAL |
| WF-000 | Health Check Canonical | Optional |
| WF-600 | Analytics Evolution Pack | Optional |
| WF-021 | Replay Remodify Canonical | Optional |
| WF-022 | Provider Packet Bridge Canonical | Optional |
| WF-023 | Downstream Resource Preparation Canonical | Optional |
| WF-900 | Error Handler Canonical | Optional |
| WF-901 | Error Recovery Canonical | Optional |
| CWF-110 | Topic Discovery Canonical | Optional |
| CWF-120 | Topic Qualification Canonical | Optional |
| CWF-130 | Topic Scoring Canonical | Optional |
| CWF-140 | Research Synthesis Canonical | Optional |
| CWF-210 | Script Generation Canonical | Optional |
| CWF-220 | Script Debate Canonical | Optional |
| CWF-230 | Script Refinement Canonical | Optional |
| CWF-240 | Final Script Shaping Canonical | Optional |
| CWF-310 | Execution Context Builder Canonical | Optional |
| CWF-320 | Platform Packager Canonical | Optional |
| CWF-330 | Asset Brief Generator Canonical | Optional |
| CWF-340 | Lineage Validator Canonical | Optional |
| CWF-410 | Thumbnail Generator Canonical | Optional |
| CWF-420 | Visual Asset Planner Canonical | Optional |
| CWF-430 | Audio Script Optimizer Canonical | Optional |
| CWF-440 | Media Package Finalizer Canonical | Optional |
| CWF-510 | Platform Metadata Generator Canonical | Optional |
| CWF-520 | Distribution Planner Canonical | Optional |
| CWF-530 | Publish Readiness Checker Canonical | Optional |
| CWF-610 | Performance Metrics Collector Canonical | Optional |
| CWF-620 | Audience Feedback Aggregator Canonical | Optional |
| CWF-630 | Evolution Signal Synthesizer Canonical | Optional |

---

## Troubleshooting

### Workflow Won't Activate

**Symptom**: Toggle button doesn't work or error message appears

**Solution**:
1. Check if there are red error icons on any workflow nodes
2. If so, click the node and check what's missing
3. For most workflows, no credentials are needed (they use basic nodes)
4. If still stuck, try:
   - Refresh the page
   - Close and re-open the workflow
   - Check n8n health: http://localhost:5678/api/v1/health

### Can't Find a Workflow

**Symptom**: Workflow name not visible in list

**Solution**:
1. Use the search bar at the top of the workflow list
2. Type the workflow ID (e.g., "WF-001")
3. Or scroll down to find it

### No Webhook Paths Visible

**Symptom**: After activating a workflow, no webhook URL appears

**Solution**:
1. This is normal - not all workflows have webhook triggers
2. Only workflows with "Webhook" trigger nodes will show paths
3. The important ones (WF-001, WF-010, WF-020) do have webhook nodes

---

## After Activation: Verification

Once the **critical 8 workflows** are activated, run the verification test:

```bash
# Test if workflows are now accepting requests
curl -s http://localhost:5002/operator/health
# Should show n8n healthy now

# Try creating a content job
curl -X POST http://localhost:5002/operator/new-content-job \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Test After Activation",
    "context": "YouTube video",
    "mode": "creator"
  }'
# Should return with dossier_id (not error)
```

---

## Time Estimate

- **Critical workflows** (8): 5-10 minutes to activate
- **All workflows** (37): 15-20 minutes to activate

**For Phase 1 verification**: Only need the critical 8 workflows activated (5-10 minutes)

---

## Next Steps After Activation

1. **Run 5-stage workflow test** to verify end-to-end
2. **Verify persistence** in data files
3. **Commit final code** with Phase 1 complete
4. **Begin Phase 2+ planning** (provider bridges, WebSocket, UI system)

---

## Still Stuck?

If you cannot access the n8n UI or toggle workflows:

1. **Verify n8n is running**:
   ```bash
   curl http://localhost:5678/
   # Should return HTML (n8n web interface)
   ```

2. **Check n8n logs**:
   ```bash
   # n8n logs will show in terminal where it was started
   # Look for errors about database or initialization
   ```

3. **Try restarting n8n**:
   ```bash
   # Kill existing process
   taskkill /IM node.exe /F
   # Restart
   n8n start
   ```

---

**Estimated Time to Complete**: 10-20 minutes (manual UI clicks)

**After Activation**: Entire Phase 1 will be verified and complete ✅

---
