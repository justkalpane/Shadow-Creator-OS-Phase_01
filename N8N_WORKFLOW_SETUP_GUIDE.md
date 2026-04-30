# n8n Workflow Setup & Activation Guide

**Status**: n8n is running, but workflows need to be imported and activated  
**Current Issue**: WF-001 webhook returns 404 "not registered"  
**Date**: 2026-04-30

---

## Problem Summary

The Operator Core code is complete and running, but the workflow orchestration chain cannot proceed because:

1. ✅ n8n is running on http://localhost:5678
2. ✅ Operator API is running on http://localhost:5002
3. ❌ Workflow definitions exist in `n8n/workflows/` directory (JSON files)
4. ❌ Workflows are NOT imported into n8n's database
5. ❌ Webhooks are NOT registered for WF-001, WF-010, etc.

### Error Evidence

When attempting to trigger WF-001:
```
POST http://localhost:5678/webhook/msf8SHcqYEdSdi7S/trigger%20node/wf-001-dossier-create

Response: 404 Not Found
Message: "The requested webhook 'POST msf8SHcqYEdSdi7S/trigger node/wf-001-dossier-create' is not registered."
Hint: "The workflow must be active for a production URL to run successfully. You can activate the workflow using the toggle in the top-right of the editor."
```

---

## Solution: Import & Activate Workflows

### Step 1: Access n8n UI

1. Open browser and navigate to: **http://localhost:5678**
2. Sign up or log in (if n8n is fresh, create an account)

### Step 2: Import Workflow Files

n8n workflows are defined in JSON format at: `C:\ShadowEmpire-Git\n8n\workflows\`

**Method A: Manual Import (GUI)**
1. In n8n, click **+ New** → **Workflow**
2. Click **File** menu → **Import from File**
3. Select first workflow file: `CWF-110.json`, `WF-001.json`, etc.
4. Click **Import**
5. Review the workflow nodes
6. **IMPORTANT**: Click the toggle switch in top-right to **ACTIVATE** the workflow
7. Click **Save**
8. Repeat for all 37 workflows

**Method B: Bulk Import (API) - Recommended**

n8n provides an import API endpoint. Use a script to bulk import all workflows:

```bash
#!/bin/bash
# Bulk import all workflow JSON files into n8n

for workflow_file in C:/ShadowEmpire-Git/n8n/workflows/*.json; do
  workflow_name=$(basename "$workflow_file" .json)
  
  echo "Importing: $workflow_name"
  
  curl -X POST http://localhost:5678/api/v1/workflows \
    -H "Content-Type: application/json" \
    -d @"$workflow_file"
done
```

**Method C: CLI (if available)**

```bash
n8n import:workflows --input=C:/ShadowEmpire-Git/n8n/workflows/
```

---

## Step 3: Verify Workflow Activation

After importing, each workflow must be **active** for webhooks to work:

1. For each workflow in n8n:
   - Click the workflow name
   - Look for the **toggle switch** in the top-right corner
   - Ensure it shows **"Active"** (toggle is ON, usually green)
   - If "Inactive", click the toggle to activate
   - Click **Save**

2. Verify webhook registration:
   ```bash
   curl http://localhost:5678/api/v1/webhooks
   ```
   Should return a list of registered webhooks including:
   - WF-001 webhook path
   - WF-010 webhook path
   - WF-100/200/300/400/500 webhook paths

---

## Step 4: Verify Webhook Paths

The webhook registry in the operator code expects specific paths. Verify they match:

**Expected paths** (from `registries/n8n_webhook_registry.yaml`):
```
WF-001: http://localhost:5678/webhook/{webhookId}/trigger/wf-001-dossier-create
WF-010: http://localhost:5678/webhook/{webhookId}/trigger/wf-010-orchestrator
WF-100: http://localhost:5678/webhook/{webhookId}/trigger/wf-100-topic-intel
...
```

**Actual paths** (from activated n8n workflows):
- Use n8n UI: Click workflow → look at "Webhook" node trigger URL
- Or use API: `curl http://localhost:5678/api/v1/webhooks | jq '.[] | select(.path | contains("wf-001"))'`

If paths don't match, update the webhook paths in the workflow JSON files before importing.

---

## Step 5: Re-run Workflow Test

Once all workflows are activated:

```bash
# 1. Verify health
curl http://localhost:5002/operator/health

# 2. Create job (should now succeed)
curl -X POST http://localhost:5002/operator/new-content-job \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Test Workflow",
    "context": "After workflow activation",
    "mode": "creator"
  }'

# 3. Monitor execution
# 4. Inspect outputs
# 5. Approve job
```

**Expected behavior**:
- ✅ POST returns `dossier_id` (not error)
- ✅ WF-001 executes and creates entry in `se_dossier_index.json`
- ✅ WF-010 executes with dossier_id
- ✅ Child workflows execute and generate packets
- ✅ Approval workflow completes

---

## Troubleshooting

### Issue: Webhook Still Returns 404

**Cause**: Workflow not activated

**Solution**:
1. Open n8n UI → Open workflow
2. Click the toggle switch to activate (top-right corner)
3. Click Save
4. Wait 2-3 seconds for webhook to register
5. Retry the curl request

### Issue: Import API Not Working

**Cause**: n8n version mismatch or API not exposed

**Solution**:
1. Use the n8n GUI to manually import workflows
2. Or verify n8n version supports imports: `n8n --version`

### Issue: Workflows Won't Activate

**Cause**: Missing required credentials or node configuration

**Solution**:
1. Open workflow in n8n UI
2. Check for red error icons on nodes
3. Configure any missing credentials (API keys, database connections)
4. Then activate

### Issue: Webhook URL Doesn't Match Registry

**Cause**: n8n generated a different webhook path than expected

**Solution**:
1. Get the actual webhook URL from n8n:
   - Open workflow → Click "Webhook" node → Copy webhook URL
2. Update `registries/n8n_webhook_registry.yaml` with the actual URL
3. The operator code will use the updated path

---

## Workflow Checklist

After setup, verify these 37 workflows are imported and active:

**Core Workflows**:
- [ ] WF-001: Dossier Create (entry point)
- [ ] WF-010: Parent Orchestrator (routes to children)
- [ ] WF-020: Approval (final gate)
- [ ] WF-021: Replay Remodify (for iterations)

**Child Workflows** (execute in parallel):
- [ ] WF-100: Topic Intelligence Pipeline
- [ ] WF-200: Script Generation
- [ ] WF-300: Context Packet Builder
- [ ] WF-400: Media Production
- [ ] WF-500: Metadata Assembly
- [ ] WF-600: Final Artifact Assembly

**Child Workflows (CWF)** - Topic stage variants:
- [ ] CWF-110 through CWF-140 (4 variants)

**Child Workflows (CWF)** - Script stage variants:
- [ ] CWF-210 through CWF-240 (4 variants)

**Child Workflows (CWF)** - Context stage variants:
- [ ] CWF-310 through CWF-340 (4 variants)

**Child Workflows (CWF)** - Media stage variants:
- [ ] CWF-410 through CWF-440 (4 variants)

**Child Workflows (CWF)** - Metadata stage variants:
- [ ] CWF-510 through CWF-540 (4 variants)

**Operational Workflows** (optional for Phase 1):
- [ ] WF-900: Alert Handler
- [ ] WF-910: Troubleshoot Console
- [ ] WF-920: Analytics Dashboard
- [ ] WF-930: Self-Learning Engine

---

## Next Steps After Workflow Activation

Once all workflows are imported and active:

1. **Re-run 5-stage test** → Should now complete end-to-end
2. **Verify persistence** → Check se_dossier_index.json, se_packet_index.json
3. **Commit changes** → Final Phase 1 deployment commit
4. **Phase 2+ planning** → Provider bridges, WebSocket, full MCP integration

---

## Phase 1 to Phase 2+ Transition

**Phase 1 (Current)**: Registry-driven orchestration, 37 workflows, polling-based events
- ✅ Operator API complete
- ✅ Code fixes complete
- ✅ Persistence layer complete
- ⏳ Workflows need activation

**Phase 2+** (After Phase 1 verification):
- Provider bridges (image/audio/video generation)
- WebSocket real-time events (vs. polling)
- Full MCP client integration (Claude Desktop)
- Tavily/OpenRouter cloud reasoning
- UI/UX system (18-screen dashboard)

---

## Commands Reference

### Start/Check Services
```bash
# Check operator API
curl http://localhost:5002/operator/health

# Check n8n
curl http://localhost:5678/api/v1/health

# List registered webhooks
curl http://localhost:5678/api/v1/webhooks
```

### Bulk Operations
```bash
# Export all active workflows from n8n
curl http://localhost:5678/api/v1/workflows > active_workflows.json

# Re-activate a single workflow via API
curl -X PUT http://localhost:5678/api/v1/workflows/{workflowId} \
  -H "Content-Type: application/json" \
  -d '{"active": true}'
```

---

**Status**: Awaiting manual n8n workflow setup before proceeding to Phase 2+
