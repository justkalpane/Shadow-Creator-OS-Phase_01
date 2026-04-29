# PHASE 7 PERSISTENCE LAYER — ACTION PLAN
## Get Shadow Creator OS to "LIVE AND PRODUCTION READY"

**Date:** 2026-04-29  
**Current Status:** Execution chain proven, persistence incomplete  
**Blockers:** 3 code gaps + 1 manual Ollama verification  
**Time to Complete:** 6-9 hours total  

---

## WHAT'S HAPPENING RIGHT NOW

### ✅ Already Working
- All 37 workflows deployed in n8n and responsive
- Parent → Child orchestration chains execute successfully
- WF-010 routes to WF-100/200/300 without errors (children execute)
- Approval (WF-020) and replay (WF-021) workflows functional
- Error handler (WF-900) is active and routes errors
- All validators pass (0 errors, 1 allowed warning)
- All deployment gates pass

### ❌ Not Yet Working
- **Dossier mutations** — Files created but updates not saved to disk
- **Packet index** — New packets created but index stays at 98 entries
- **Parent status** — WF-010/020 show error despite children succeeding
- **Ollama** — Must be installed and verified locally by user

---

## THE EXACT WORK ITEMS (3 Code Gaps)

### Gap 1: Dossier Persistence
**Problem:** Dossier updates are lost when workflows complete  
**Evidence:** Running same dossier twice shows only 1 audit entry (not 2)  
**Fix:**
```
1. Edit WF-001.json: Add "Write dossier to disk" node at end
2. Edit WF-010.json: Add "Append orchestration log" node at end  
3. Edit WF-020.json: Add "Append approval decision" node at end
4. Verify: Run chain twice, dossier shows 2 entries in _audit_trail
```
**Time:** ~1.5 hours  
**Test:** 
```bash
dossier_1=$(curl -X POST ... WF-001 | jq -r .dossier_id)
curl -X POST ... WF-010 -d "{\"dossier_id\":\"$dossier_1\"}"
curl -X POST ... WF-010 -d "{\"dossier_id\":\"$dossier_1\"}"
npm run dossier:inspect $dossier_1
# Should show 2 execution timestamps in _audit_trail
```

### Gap 2: Packet Index Persistence  
**Problem:** Packets created but se_packet_index.json not updated  
**Evidence:** Packet count stays at 98 despite new executions  
**Fix:**
```
1. Edit WF-100.json: Add "Write packet index" node at completion
2. Edit WF-200.json: Same as WF-100
3. Edit WF-300.json: Same as WF-100
4. Edit WF-500.json: Same as WF-100
   OR create post-processing workflow WF-024 that reads n8n execution 
   logs and writes to se_packet_index.json
5. Verify: Run orchestration, packet count increases
```
**Time:** ~1.5 hours  
**Test:**
```bash
before=$(jq '.[] | length' /c/ShadowEmpire-Git/data/se_packet_index.json)
curl -X POST ... WF-010 -d "{\"dossier_id\":\"$dossier_1\"}"
after=$(jq '.[] | length' /c/ShadowEmpire-Git/data/se_packet_index.json)
echo "Before: $before, After: $after" # After should be > Before
```

### Gap 3: Parent Workflow Completion Status  
**Problem:** WF-010/020 report error status even though children succeed  
**Evidence:** Execution logs show parent = error, children = success  
**Fix:**
```
1. Edit WF-010.json: Change completion node logic
   - Check if child_results.all_succeeded == true
   - If yes: output success_packet with status=SUCCESS
   - If no: output error_packet with status=ERROR
2. Edit WF-020.json: Same logic fix
3. Verify: Run orchestration, WF-010 final execution shows status=success
```
**Time:** ~30 minutes  
**Test:**
```bash
curl -X POST ... WF-010 -d "{\"dossier_id\":\"...\"}\"
# Check n8n UI: Execution panel, WF-010 final status should be green (success)
# Currently it shows red (error) even though children passed
```

---

## EXTERNAL REQUIREMENT (User Action)

### Ollama Local LLM Verification
**Required for:** Script generation, debate, refinement workflows  
**User steps:**
```powershell
# 1. Download and install
# Visit: https://ollama.ai
# Download for Windows
# Run installer

# 2. Start Ollama service
ollama serve
# OR check if daemon is already running

# 3. List models
ollama list
# Should show at least one: mistral, llama2, neural-chat, etc.

# 4. Test
curl -X POST http://localhost:11434/api/generate `
  -H "Content-Type: application/json" `
  -d '{"model":"mistral","prompt":"hello world","stream":false}'
# Should return JSON with generated text

# 5. Verify from n8n
npm run health:check
# WF-000 should now pass Ollama validation
```
**Time:** 15-30 minutes  
**Blocker:** If Ollama not running, all LLM-based workflows will fail

---

## EXACT SEQUENCE TO EXECUTE

### Step 1: Implement Gap 1 (Dossier Persistence) — 1.5 hours

```bash
# 1. Edit WF-001.json
code n8n/workflows/WF-001.json
# At the end, before the final outbound connection, add:
# {
#   "id": "wf001_dossier_write_node",
#   "name": "Write Dossier to Disk",
#   "type": "n8n-nodes-base.writeFile",
#   "parameters": {
#     "path": "{{$nodeInputData[0].json.dossier_path}}",
#     "content": "{{JSON.stringify($nodeInputData[0].json.dossier, null, 2)}}"
#   }
# }

# 2. Edit WF-010.json
code n8n/workflows/WF-010.json
# Add similar node to append execution timestamp to existing dossier

# 3. Edit WF-020.json  
code n8n/workflows/WF-020.json
# Add node to append approval decision

# 4. Validate
npm run validate:workflows
# Should still pass

# 5. Import to live n8n
npm run deploy:reconcile
# Should sync without drift

# 6. Test
dossier_id=$(curl -X POST ... WF-001 | jq -r .dossier_id)
cat dossiers/d-*.json | grep timestamp
# Should show timestamp from WF-001 execution
```

### Step 2: Implement Gap 2 (Packet Persistence) — 1.5 hours

```bash
# Edit WF-100.json, WF-200.json, WF-300.json, WF-500.json
# At completion, add packet write node

# OR create new WF-024 post-processor:
code n8n/workflows/WF-024-packet-persistence-bridge.json
# Read n8n execution logs, extract packet objects, write to se_packet_index.json

# Validate
npm run validate:workflows

# Test
before=$(wc -l < data/se_packet_index.json)
curl -X POST ... WF-010 -d "{\"dossier_id\":\"...\"}"
after=$(wc -l < data/se_packet_index.json)
# After should be > Before
```

### Step 3: Fix Gap 3 (Completion Logic) — 30 min

```bash
# Edit WF-010.json and WF-020.json
code n8n/workflows/WF-010.json

# Find the completion branch node, modify logic:
# OLD: output error status regardless
# NEW: 
#   if (all_children_succeeded) { return success_packet }
#   else { return error_packet }

# Validate
npm run validate:workflows

# Test  
curl -X POST ... WF-010 -d "{\"dossier_id\":\"...\"}"
# Check n8n UI: WF-010 execution should show SUCCESS (green), not ERROR (red)
```

### Step 4: Full Validation & Testing — 2 hours

```bash
# Run all gates
npm run deploy:gate
# All 9 sub-gates must PASS

# Run full chain
curl -X POST http://localhost:5678/webhook/.../WF-000-health-check
# Response: health_status = HEALTHY

curl -X POST http://localhost:5678/webhook/.../WF-001-dossier-create \
  -H "Content-Type: application/json" \
  -d '{"topic":"test topic","context":"test context"}'
# Response: dossier_id = d-xyz

curl -X POST http://localhost:5678/webhook/.../WF-010-parent-orchestrator \
  -H "Content-Type: application/json" \
  -d '{"dossier_id":"d-xyz"}'
# Wait 2-5 minutes...

# Verify persistence
npm run dossier:inspect d-xyz
# Should show execution timestamp from WF-001 and WF-010

npm run packet:list
# Should show packet count increased (from 98)

# Test approval
curl -X POST http://localhost:5678/webhook/.../WF-020-final-approval \
  -H "Content-Type: application/json" \
  -d '{"dossier_id":"d-xyz","decision":"approved"}'

npm run dossier:inspect d-xyz
# Should show approval timestamp in _audit_trail

# Test replay
curl -X POST http://localhost:5678/webhook/.../WF-021-replay-remodify \
  -H "Content-Type: application/json" \
  -d '{"dossier_id":"d-xyz","target_workflow":"CWF-230"}'
# Workflow should route back to script refinement

# Verify WF-010 final status (should be SUCCESS, not ERROR now)
npm run n8n:status
# Check execution panel in n8n UI
```

### Step 5: Commit & Push

```bash
git add -A
git commit -m "feat: implement Phase 7 persistence layer for dossier and packet state

- Add Write nodes to WF-001, WF-010, WF-020 for dossier mutations
- Add packet index persistence to WF-100, WF-200, WF-300, WF-500
- Fix parent workflow (WF-010, WF-020) completion status logic
- Verify: Dossier audit trail persists across runs
- Verify: Packet index increases with new executions
- Verify: Parent workflow final status = SUCCESS (not error)

Co-Authored-By: Claude Code <noreply@anthropic.com>"

git push origin main

# Verify
git log --oneline -1
# Should show new commit
```

### Step 6: Manual Ollama Setup (User Action)

```powershell
# Download and install from https://ollama.ai
ollama serve

# In another terminal:
ollama list
curl -X POST http://localhost:11434/api/generate -d '{"model":"mistral","prompt":"test"}'

# Verify in n8n
npm run health:check
# Should pass Ollama check
```

---

## ACCEPTANCE CRITERIA (Sign-Off Checklist)

### Before Phase 7 Start
- [ ] Current working directory: C:\ShadowEmpire-Git
- [ ] Branch: main
- [ ] `npm run deploy:gate` passes (all 9 gates)
- [ ] `npm run health:check` = HEALTHY

### After Implementation
- [ ] All 3 workflow files edited and validated
- [ ] `npm run validate:workflows` = PASS
- [ ] `npm run deploy:gate` = PASS
- [ ] `npm run test:e2e` = PASS (9/9)

### After Testing
- [ ] Full chain executes without errors
- [ ] WF-010 final status = SUCCESS (green in n8n UI)
- [ ] WF-020 final status = SUCCESS
- [ ] Dossier audit trail shows 2+ entries after 2 runs
- [ ] Packet index count increased after new execution
- [ ] Approval decision persisted in dossier
- [ ] Replay routed to CWF-230 successfully

### Final Sign-Off
- [ ] All tests pass
- [ ] Changes committed and pushed
- [ ] `git log --oneline -1` shows new commit
- [ ] `git status` = clean
- [ ] Ollama running and verified
- [ ] Shadow Creator OS = **LIVE AND PRODUCTION READY**

---

## TIME ESTIMATE

| Task | Estimate | Notes |
|------|----------|-------|
| Gap 1: Dossier persistence | 1.5 hrs | Edit 3 files, test |
| Gap 2: Packet persistence | 1.5 hrs | Edit 4-5 files, test |
| Gap 3: Completion logic | 0.5 hrs | Edit 2 files, test |
| Full chain validation | 1 hr | Run smoke tests |
| Testing & verification | 1-2 hrs | Final acceptance |
| Ollama setup (user) | 0.5 hrs | Download, install, verify |
| **TOTAL** | **6-9 hours** | Ready for production |

---

## NO REDESIGN NEEDED

This is NOT a redesign. The architecture is solid. The work is:
- ✅ Adding 5-6 file write nodes
- ✅ Fixing 2 workflow completion branches
- ✅ Validating against existing test suite

No architectural changes. No refactoring. No new features.

---

## EXPECTED RESULT

After Phase 7 completion:

**Shadow Creator OS Phase-1 will be:**
- ✅ Fully deployed in n8n
- ✅ All workflows ingress-callable
- ✅ Parent-child chains executing
- ✅ State persisting correctly
- ✅ Approval/replay functional
- ✅ Error handling active
- ✅ All validators passing
- ✅ **LIVE ON LOCAL MACHINE**
- ✅ **READY FOR PRODUCTION USE**

---

## START NOW

No further delays. All prerequisites are met.

1. Implement Gap 1 (1.5 hrs)
2. Implement Gap 2 (1.5 hrs)  
3. Implement Gap 3 (0.5 hrs)
4. Validate (2 hrs)
5. Commit & push
6. Sign off

**ETA: 6-9 hours to FULLY PRODUCTION READY**

