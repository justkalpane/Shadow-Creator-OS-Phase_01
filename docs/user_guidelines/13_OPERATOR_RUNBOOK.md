# Operator Runbook: Before-Test and Execution Procedures

## Pre-Test Checklist (Before Running Any Workflow)

**5 minutes to verify system is ready:**

- [ ] Ollama is running: `ollama serve` in terminal
- [ ] Node/npm installed: `node -v && npm -v` (should be 18+ and 8+)
- [ ] Repository cloned: `cd Shadow-Creator-OS-Phase_01`
- [ ] Dependencies installed: `npm install` completed
- [ ] Environment configured: `.env` file exists with OLLAMA_BASE_URL
- [ ] n8n running: `npm run n8n:start` (check http://localhost:5678)
- [ ] Workflows imported: 31 workflows visible in n8n sidebar
- [ ] System validates: `npm run validate:all` passes
- [ ] Health check passes: WF-000 returns healthy status

**If any fails, fix before proceeding.**

---

## Test Execution Sequence

### Phase 1: Initialization (2 minutes)

**Step 1: Create Test Dossier**
```bash
# In n8n: WF-001-dossier-create
# Inputs:
dossier_id: "test_first_run"
route_id: "ROUTE_PHASE1_STANDARD"
topic: "The history of artificial intelligence"

# Expected Output:
# ✓ Dossier created
# ✓ Status: "pending"
# ✓ Dossier visible in se_dossier_index
```

### Phase 2: Full Pipeline Execution (15 minutes)

**Step 2: Run Parent Orchestrator**
```bash
# In n8n: WF-010-parent-orchestrator
# Inputs:
dossier_id: "test_first_run"
mode: "creator"
selected_model: "ollama_local_llama3.2"

# Expected Timeline:
# 0:00 - Start
# 2:00 - Topic discovery completes
# 4:00 - Research synthesis completes
# 8:00 - Script generation completes
# 10:00 - Script debate/refinement completes
# 12:00 - Context engineering completes
# 13:00 - Approval gate (YAMA, KUBERA, directors check)
# 14:00 - Analytics collection
# 15:00 - Complete

# Monitor in n8n:
# - Watch each node execute (green = success)
# - Check Executions tab for timing
# - If any node turns red → check error tab
```

### Phase 3: Output Verification (3 minutes)

**Step 3: Inspect Dossier**
```bash
npm run dossier:inspect test_first_run

# Expected Output:
# dossier_id: test_first_run
# status: completed
# dossier_version: 45+

# Namespaces should contain:
# - intake: original topic
# - discovery: entities, themes, scope
# - research: sources, claims, evidence_map
# - script: outline, draft, quality_score ~0.85-0.92
# - approval: approval_status: approved
# - analytics: metrics, quality_scores
# - evolution: feedback_signals

echo "✓ Dossier structure complete"
```

**Step 4: Check Packets**
```bash
npm run packet:list --dossier test_first_run

# Expected Output: 8 packets
# 1. topic_discovery_packet (CWF-110)
# 2. research_synthesis_packet (CWF-140)
# 3. script_generation_packet (CWF-210)
# 4. script_debate_packet (CWF-220)
# 5. script_refinement_packet (CWF-230)
# 6. final_script_packet (CWF-240)
# 7. approval_packet (WF-020)
# 8. analytics_collection_packet (CWF-610)

echo "✓ All packets emitted"
```

**Step 5: Verify Error Handling**
```bash
npm run errors:list --dossier test_first_run

# Expected Output: 0 errors (or all recovered)
# If errors exist, they should have recovery_successful: true

echo "✓ No unrecovered errors"
```

---

## Advanced Test Scenarios

### Scenario 1: Fast Route (5 minutes)
```bash
# In WF-010: Change route_id to "ROUTE_PHASE1_FAST"
# Expected runtime: 3-5 minutes (vs 15)
# Outcome: Abbreviated pipeline, quality threshold 0.75 (vs 0.85)
```

### Scenario 2: Replay from Checkpoint (20 minutes)
```bash
# Step 1: Run WF-010 with quality set to <0.85 (force rejection)
# Step 2: In WF-020, Script Director rejects
# Step 3: In WF-021, Replay from "script" checkpoint
#   checkpoint_stage: "script"
#   dossier_id: "test_first_run"
# Step 4: System restores to before script generation, re-runs
# Expected: New script packets generated (version 2)
# Outcome: Approval passes on second attempt

echo "✓ Replay/remodify cycle complete"
```

### Scenario 3: Mode Testing (Creator vs Builder)
```bash
# Test 1: Creator Mode
# - mode: "creator"
# - Must cite sources: ✓
# - Cannot suppress contradictions: ✓
# - Quality threshold: 0.85

# Test 2: Builder Mode
# - mode: "builder"
# - Can omit citations: ✓
# - Can suppress contradictions: ✓
# - Quality threshold: 0.70

# Expected: Same topic, builder mode completes faster
```

---

## Monitoring During Execution

**n8n Dashboard Tips:**
- Click workflow name → see full pipeline
- Click node → see inputs/outputs
- Click Executions tab → see all runs with timing
- Red nodes = error occurred (click for details)
- Green nodes = success
- Yellow nodes = in progress

**Real-Time Monitoring:**
```bash
# In separate terminal:
# Windows PowerShell:
#   Get-Content -Path logs/n8n.log -Wait -Tail 50
# Mac/Linux:
#   tail -f logs/n8n.log
# Or cross-platform via npm:
npm run logs:view -- --lines 50
npm run dossier:inspect test_first_run  # Check current dossier state
```

---

## Post-Test Verification

**After execution completes:**

1. **Check Status:**
   ```bash
   npm run dossier:inspect test_first_run | grep status
   # Expected: "completed" (not "pending" or "in_progress")
   ```

2. **Check Quality:**
   ```bash
   npm run dossier:inspect test_first_run | grep quality_score
   # Expected: ≥0.85 for creator mode, ≥0.70 for builder
   ```

3. **Check Cost:**
   ```bash
   npm run dossier:inspect test_first_run | grep cost_usd
   # Expected: $0.00 for Ollama (Phase-1)
   ```

4. **Check Governance:**
   ```bash
   npm run dossier:inspect test_first_run | grep approval_status
   # Expected: "approved"
   ```

5. **Check Learning:**
   ```bash
   npm run dossier:inspect test_first_run | grep evolution
   # Expected: feedback_records and learning_cycle_count > 0
   ```

**If all ✓:** System is working correctly!

---

## Cleanup After Testing

```bash
# Keep dossier for future replay:
npm run dossier:archive test_first_run

# Or clean up completely:
npm run dossier:delete test_first_run

# Optional: Clear old logs
npm run logs:clean --days 7
```

---

## Running Multiple Tests

**Parallel Testing (3 different topics simultaneously):**

The Phase-1 orchestrator runner accepts a topic seed via env var. Run multiple topics in separate terminals:

```bash
# Terminal 1: Topic 1
SHADOW_TOPIC_SEED="AI in 2026" node engine/directors/parent_orchestrator_runner.js

# Terminal 2: Topic 2
SHADOW_TOPIC_SEED="Remote work trends" node engine/directors/parent_orchestrator_runner.js

# Terminal 3: Topic 3
SHADOW_TOPIC_SEED="Blockchain adoption" node engine/directors/parent_orchestrator_runner.js

# On Windows PowerShell:
#   $env:SHADOW_TOPIC_SEED="AI in 2026"; node engine/directors/parent_orchestrator_runner.js

# Monitor all dossiers afterward:
npm run dossier:list
```

---

## Stopping n8n

```bash
# If running in foreground:
Ctrl+C

# If running in background:
npm run n8n:stop

# Kill manually (if needed):
# Windows PowerShell:
#   Get-Process node | Where-Object { $_.CommandLine -like '*n8n*' } | Stop-Process -Force
# Windows CMD:
#   wmic process where "name='node.exe'" get processid,commandline /format:csv
#   taskkill /PID <PID> /F
# Mac/Linux:
#   ps aux | grep n8n
#   kill -9 <PID>
```

---
