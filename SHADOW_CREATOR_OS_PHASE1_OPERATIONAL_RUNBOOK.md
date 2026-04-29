# Shadow Creator OS Phase-1: Operational Runbook

**Version:** 1.0 (Production-Ready)  
**Generated:** 2026-04-29  
**Phase 10 Status:** PASS (WF-001→WF-010→WF-020 live cycle verified)  
**Author:** Shadow Creator OS Deployment Team  

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Startup & Shutdown Procedures](#startup--shutdown-procedures)
3. [Daily Operations](#daily-operations)
4. [Monitoring & Health Checks](#monitoring--health-checks)
5. [Error Recovery & Rollback](#error-recovery--rollback)
6. [Dossier & Packet Management](#dossier--packet-management)
7. [Troubleshooting Reference](#troubleshooting-reference)
8. [Emergency Contacts & Escalation](#emergency-contacts--escalation)

---

## System Architecture Overview

### Components

**n8n Workflow Orchestration Engine**
- Port: 5678 (default)
- Database: SQLite3 at `${N8N_USER_FOLDER}/.n8n/database.sqlite`
- 37 workflows deployed:
  - WF-000: Health check
  - WF-001: Dossier create (ingress entry point)
  - WF-010: Parent orchestrator (routes to child workflows)
  - WF-020: Final approval (governance gate)
  - WF-021: Replay/remodify (rewind capability)
  - WF-100/200/300/500: Director script generation (skill_loader execution)
  - WF-900: Error handler (active on all error routes)
  - CWF-xxx (11 child workflows): Director/skill/agent implementation

**Local LLM Runtime (Ollama)**
- Port: 11434
- Models: mistral, llama2, or neural-chat
- Used by: WF-100, WF-200, WF-300, WF-500 (script generation)
- Fallback: If Ollama unavailable, skill_loader uses synthetic responses

**State Persistence Layer**
- Dossiers: JSON files in `dossiers/` directory
- Packet index: `data/se_packet_index.json`
- Dossier index: `data/se_dossier_index.json`
- Route runs: `data/se_route_runs.json`
- Error events: `data/se_error_events.json`

### Deployment Evidence (Phase 10)

```
Phase 10 Go-Live Results:
✅ WF-001 (Dossier Create): HTTP 200, status=success
✅ WF-010 (Orchestrator): HTTP 200, status=success
✅ WF-020 (Approval): HTTP 200, status=success
✅ Packet delta: +4 new packets (275→279)
✅ Dossier delta: +2 new entries (36→38)
✅ All validators passing (0 errors)
✅ All deployment gates passing
```

---

## Startup & Shutdown Procedures

### Starting the System

#### Step 1: Verify Prerequisites
```bash
cd C:\ShadowEmpire-Git

# Check Node.js and npm
node --version    # Expect: v18+
npm --version     # Expect: v8+

# Check git status (should be clean or artifact-only)
git status

# Verify Ollama is running (in separate terminal)
ollama serve
# OR check if daemon is already running:
ollama list
```

#### Step 2: Start n8n
```bash
# Use production startup script with runtime flags
.\scripts\windows\start_n8n_shadow_phase1.ps1

# Or manual startup:
$env:N8N_HOST="127.0.0.1"
$env:N8N_PORT="5678"
$env:N8N_USER_FOLDER="C:/ShadowEmpire/n8n_user"
$env:NODE_FUNCTION_ALLOW_BUILTIN="fs,path"
$env:N8N_RUNNERS_ENABLED="false"
npm run n8n:start

# Verify startup
npm run n8n:status

# n8n UI available at: http://localhost:5678
```

#### Step 3: Verify Health
```bash
# Health check (runs WF-000 internally)
npm run health:check

# Expected output:
# ✓ n8n running on port 5678
# ✓ 37 workflows deployed
# ✓ Ollama connectivity: OK (or FALLBACK)
# ✓ Database accessible: OK
# ✓ State files readable: OK
```

#### Step 4: System Ready
```
SYSTEM STATUS: READY FOR INGRESS
- n8n listening on http://localhost:5678
- WF-001 callable at: /webhook/ingress/WF-001-dossier-create
- Ollama ready for script generation (if available)
- All 37 workflows responsive
```

### Stopping the System

#### Graceful Shutdown
```bash
# Stop n8n cleanly
npm run n8n:stop

# Verify stop
npm run n8n:status
# Expected: "n8n is not running" or timeout

# Verify state files are not corrupted
ls -la data/se_*.json
# All should have recent timestamps
```

#### Emergency Stop (force kill)
```powershell
# If graceful stop fails
Stop-Process -Name "node" -Force

# Verify
Get-Process node -ErrorAction SilentlyContinue
# Should return nothing
```

---

## Daily Operations

### Starting a Daily Job (Content Creation Cycle)

```bash
# 1. Ensure system is running
npm run n8n:status
# Expected: "n8n running on port 5678"

# 2. Create a new dossier (WF-001 entry point)
TOPIC="Latest AI Trends in Content Creation"
CONTEXT="YouTube video script generation"

curl -X POST http://localhost:5678/webhook/ingress/WF-001-dossier-create \
  -H "Content-Type: application/json" \
  -d "{
    \"topic\": \"$TOPIC\",
    \"context\": \"$CONTEXT\",
    \"mode\": \"operator\",
    \"source\": \"daily_ops\"
  }"

# Response: {"dossier_id": "DOSSIER-xyz", "status": "created", ...}
# Save the dossier_id for next steps
DOSSIER_ID="DOSSIER-xyz"

# 3. Trigger orchestration (WF-010)
# This routes to multiple directors: Krishna, Vishnu, Narada
curl -X POST http://localhost:5678/webhook/ingress/WF-010-parent-orchestrator \
  -H "Content-Type: application/json" \
  -d "{
    \"dossier_id\": \"$DOSSIER_ID\",
    \"route_id\": \"ROUTE_PHASE1_STANDARD\"
  }"

# Response: {"status": "orchestration_initiated", "children_triggered": 11, ...}
# System will now:
# - Invoke WF-100/200/300/500 in parallel (script generation)
# - Collect results into dossier
# - Wait for execution to complete (2-5 minutes)

# 4. Monitor progress
# Option A: Check dossier in real-time
npm run dossier:inspect $DOSSIER_ID
# Shows: creation_timestamp, orchestration_calls, child_results, _audit_trail

# Option B: Watch n8n UI
# Navigate to http://localhost:5678
# Check "Executions" tab for WF-001, WF-010, WF-100/200/300/500 status

# 5. Final approval (WF-020)
# Once children complete, trigger final approval
curl -X POST http://localhost:5678/webhook/ingress/WF-020-final-approval \
  -H "Content-Type: application/json" \
  -d "{
    \"dossier_id\": \"$DOSSIER_ID\",
    \"decision\": \"approved\",
    \"reviewer\": \"operator\",
    \"reason\": \"Content meets quality gate\"
  }"

# Response: {"status": "approved", "finalized_at": "2026-04-29T...", ...}

# 6. Verify final state
npm run dossier:inspect $DOSSIER_ID
# Should show approval_decision and final_status=approved in _audit_trail

# 7. Archive if needed
npm run dossier:archive $DOSSIER_ID
# Dossier marked as archived, removed from active processing
```

### Estimated Timeline
- WF-001 (dossier create): 5-10 seconds
- WF-010 (orchestration trigger): 2-3 minutes (includes child execution)
- Child workflows (WF-100/200/300/500): 1-2 minutes each in parallel
- WF-020 (approval): 5-10 seconds
- **Total end-to-end: 3-5 minutes** (1-2 minutes if Ollama not available, falls back to synthetic)

---

## Monitoring & Health Checks

### Real-Time Health Check
```bash
npm run health:check

# Output includes:
# ✓ n8n status: running|stopped
# ✓ Workflow count: 37 deployed
# ✓ Execution database: accessible
# ✓ State files: readable
# ✓ Ollama: connected|fallback|unavailable
# ✓ Last execution timestamp
# ✓ Error count (last 24h)
```

### Daily Metrics
```bash
# Daily summary
npm run metrics:daily

# Weekly summary
npm run metrics:weekly

# Output: 
# Total executions (24h), success rate, error count, 
# packet emissions, dossier count, average latency

# Example:
# 2026-04-29 Metrics:
# - Total executions: 42
# - Success rate: 98.1%
# - Errors: 1 (recoverable)
# - New packets: 12
# - New dossiers: 3
# - Avg latency: 145ms
```

### Cost Reporting
```bash
# Ollama usage (compute cost)
npm run cost:report

# Output:
# LLM invocations: N
# Tokens processed: M
# Fallback rates: X%
# Estimated cost: $Y
```

### Log Inspection
```bash
# View recent logs
npm run logs:view

# Clean old logs (>30 days)
npm run logs:clean
```

### Database Health
```bash
# Verify database integrity
npm run db:verify

# Output: "Database OK" or list of repairs needed
```

---

## Error Recovery & Rollback

### Common Error Scenarios

#### Scenario 1: Child Workflow Fails (WF-010 Returns Error Status)

**Symptoms:**
- WF-010 execution shows red (error) in n8n UI
- Dossier audit trail shows child_result.status = FAILED

**Recovery:**
```bash
# 1. Inspect the failed dossier
DOSSIER_ID="DOSSIER-xyz"
npm run dossier:inspect $DOSSIER_ID

# 2. Check which child failed
# Review child_results array for status != SUCCESS

# 3. View error details
npm run errors:list
# Find entry matching DOSSIER_ID and timestamp

# 4. Replay failed child workflow
curl -X POST http://localhost:5678/webhook/ingress/WF-021-replay-remodify \
  -H "Content-Type: application/json" \
  -d "{
    \"dossier_id\": \"$DOSSIER_ID\",
    \"target_workflow\": \"CWF-310\",
    \"action\": \"reexecute\"
  }"

# 5. Verify replay succeeded
npm run dossier:inspect $DOSSIER_ID
# Should show new execution entry in _audit_trail

# 6. If still failing, escalate to manual review (see Escalation section)
```

#### Scenario 2: Ollama Unavailable (LLM Generation Fails)

**Symptoms:**
- WF-100/200/300/500 show "FALLBACK: synthetic response"
- Script quality reduced (template-based, not LLM-generated)

**Recovery:**
```bash
# 1. Verify Ollama is running
ollama list
# If error: Ollama daemon not running

# 2. Start Ollama (in separate terminal)
ollama serve

# 3. Verify model availability
ollama list
# Expected: At least one model (mistral, llama2, neural-chat)

# 4. Test connectivity from n8n
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "mistral",
    "prompt": "test",
    "stream": false
  }'
# Should return JSON with generated text

# 5. Retry failed executions
# Re-run WF-010 with same dossier_id (will now use real Ollama)
```

#### Scenario 3: Packet Index Corruption

**Symptoms:**
- `npm run packet:list` shows stale count
- New packets created but not indexed

**Recovery:**
```bash
# 1. Backup current state
cp data/se_packet_index.json data/se_packet_index.json.backup.$(date +%s)

# 2. Rebuild packet index from execution logs
npm run deploy:live-sync-enforcer
# Rescans n8n execution database and rebuilds packet_index.json

# 3. Verify count matches
npm run packet:list
# Compare before/after count

# 4. If count still wrong, restore from backup
cp data/se_packet_index.json.backup.TIMESTAMP data/se_packet_index.json
# Escalate to manual investigation
```

#### Scenario 4: Dossier File Missing or Corrupted

**Symptoms:**
- `npm run dossier:inspect DOSSIER_ID` returns "not found"
- Error when trying to approve dossier (WF-020)

**Recovery:**
```bash
# 1. Check if file exists
ls dossiers/DOSSIER-*.json | grep DOSSIER_ID

# 2. If missing but indexed
# Rebuild dossier from index metadata
npm run dossier:inspect DOSSIER_ID --recover
# (Creates minimal dossier stub if it exists in index)

# 3. If corrupted (invalid JSON)
# Restore from backup
cp backups/dossier_*.tar.gz ./
tar -xzf dossier_*.tar.gz
# Replace corrupted dossier

# 4. If not in backups, mark as unrecoverable
npm run dossier:delete DOSSIER_ID --reason "corrupted"
# Remove from index and mark in audit trail
```

### Rollback Procedure

#### Full System Rollback (Last Stable State)
```bash
# 1. Stop n8n
npm run n8n:stop

# 2. Find last known good commit
git log --oneline | head -20
# Look for commit message with "PASSED Phase 10" or similar

# 3. Restore to known good state
git reset --hard d216ff6  # Replace with actual commit hash from step 2

# 4. Restore database from backup
# n8n maintains automatic backups in ${N8N_USER_FOLDER}/.n8n/backups/
# Restore most recent: cp backups/database.sqlite* .n8n/database.sqlite

# 5. Clear runtime artifacts (dossiers, packets from failed run)
rm dossiers/DOSSIER-PROBLEM_*.json
npm run dossier:list | grep "status: error"
# Review and delete only the problematic entries

# 6. Restart system
npm run n8n:start
npm run health:check
```

---

## Dossier & Packet Management

### Dossier Lifecycle

```
CREATED (WF-001) 
  → ORCHESTRATION_INITIATED (WF-010)
    → CHILDREN_EXECUTING (WF-100/200/300/500)
      → RESULTS_COLLECTED
        → APPROVAL_PENDING (WF-020 awaits decision)
          → APPROVED or REJECTED
            → ARCHIVED (optional cleanup)
              → DELETED (final purge)
```

### Common Dossier Operations

```bash
# List all dossiers
npm run dossier:list
# Output: ID, created_at, status, topic, packet_count

# Inspect specific dossier
npm run dossier:inspect DOSSIER-xyz
# Output: Full dossier JSON with audit trail

# Archive completed dossier
npm run dossier:archive DOSSIER-xyz
# Marks as archived, removed from active processing

# Delete dossier permanently
npm run dossier:delete DOSSIER-xyz
# Removes from disk and index (irreversible)
```

### Packet Management

```bash
# List all packets
npm run packet:list
# Output: packet_id, source_workflow, dossier_id, timestamp

# Inspect packet lineage (trace through workflows)
npm run packet:lineage PACKET-xyz
# Output: entry_point → WF-010 → WF-100 → WF-020 (chain of custody)

# Archive old packets (>30 days)
# Automatic via npm run logs:clean or manual:
find data/packets/ -name "*.json" -mtime +30 -delete
```

---

## Troubleshooting Reference

### Quick Diagnosis Commands

```bash
# 1. Is n8n running?
npm run n8n:status

# 2. Are all 37 workflows deployed?
npm run validate:workflows
# Expected: 37 workflows pass validation

# 3. Is database accessible?
npm run db:verify

# 4. Are state files intact?
npm run validate:registries

# 5. What happened in last hour?
npm run logs:view | tail -50

# 6. Are there unresolved errors?
npm run errors:list
npm run errors:clear  # (clears after review)

# 7. Is Ollama available?
curl -s http://localhost:11434/api/tags | jq .models
```

### Error Message Reference

| Error | Cause | Fix |
|-------|-------|-----|
| `Connection refused on port 5678` | n8n not running | `npm run n8n:start` |
| `Module 'fs' is disallowed` | Runtime policy blocking fs | Restart with `start_n8n_shadow_phase1.ps1` |
| `Execution timed out after 30s` | Child workflow taking too long | Check Ollama, increase timeout in WF-010 config |
| `Dossier not found: DOSSIER-xyz` | File deleted or corrupted | Restore from backup or rebuild from index |
| `Packet index out of sync` | Missing write to disk | Run `npm run deploy:live-sync-enforcer` |
| `Ollama connection refused` | LLM service down | `ollama serve` in separate terminal |
| `Cannot write to dossiers/ directory` | Permission issue | Check directory ownership: `ls -la dossiers/` |

---

## Emergency Contacts & Escalation

### Escalation Decision Tree

```
Problem occurs
  ↓
Is it in "Troubleshooting Reference" table?
  ├─ YES → Apply Fix
  └─ NO → Continue below
  
Has Rollback Procedure been attempted?
  ├─ YES → Continue below
  └─ NO → Execute "Full System Rollback"
  
Check error logs for patterns
  ├─ Reproducible (same error on repeat) → Document and escalate to Engineering
  └─ Intermittent (random) → Enable verbose logging and observe pattern
  
Enable Debug Logging
  ├─ Set env var: N8N_LOG_LEVEL=debug
  ├─ Restart n8n
  ├─ Reproduce error
  ├─ Collect logs: npm run logs:view > debug_$(date +%s).log
  └─ Escalate with debug logs attached
```

### Support Channels

**For Production Issues (P1):**
- Immediate: Stop accepting new dossiers (don't curl WF-001)
- Status: Run `npm run health:check` and capture output
- Contact: Development team with:
  - Phase 10 status (PASS/FAIL)
  - Last successful execution timestamp
  - Error logs from `npm run logs:view`
  - Current state: `npm run dossier:list` and `npm run packet:list`

**For Monitoring (P2):**
- Daily review: `npm run metrics:daily`
- Weekly review: `npm run metrics:weekly`
- Monthly validation: `npm run deploy:gate` (full gate suite)

**For Enhancement Requests (P3):**
- Document in issue tracker with:
  - Current behavior vs. desired behavior
  - Affected workflow (WF-xxx)
  - Estimated impact

---

## Appendix: Environment Variables

```bash
# Required
export N8N_HOST="127.0.0.1"              # n8n binding address
export N8N_PORT="5678"                   # n8n listening port
export N8N_USER_FOLDER="C:/ShadowEmpire/n8n_user"  # State directory

# Optional but Recommended
export NODE_FUNCTION_ALLOW_BUILTIN="fs,path"  # Enable fs module in Code nodes
export N8N_RUNNERS_ENABLED="false"       # Disable external runners
export N8N_LOG_LEVEL="info"              # Log verbosity: debug|info|warn|error

# LLM Integration
export OLLAMA_HOST="http://localhost:11434"  # Ollama API endpoint
export LLM_TIMEOUT_MS="30000"            # Timeout for script generation

# Optional Tuning
export N8N_EXECUTION_TIMEOUT="300000"    # 5 min max per workflow
export N8N_DB_SQLITE_TIMEOUT="30000"     # SQLite lock timeout
export NODE_MAX_OLD_SPACE_SIZE="2048"    # Heap size for large executions
```

---

## Document History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0 | 2026-04-29 | Initial runbook based on Phase 10 PASS | Production Ready |

---

**END OF OPERATIONAL RUNBOOK**
