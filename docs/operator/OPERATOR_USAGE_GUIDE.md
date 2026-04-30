# Shadow Operator Core — Usage Guide

**Target Audience**: Content operators, automation engineers, system administrators  
**Environment**: Windows, Local-First, n8n-Governed

---

## Quick Start

### 1. Start the Operator API

```powershell
cd C:\ShadowEmpire-Git
.\scripts\operator\start-operator.ps1
```

The API will start on `http://localhost:5002`.

Keep this terminal open while operating.

### 2. Health Check (in another terminal)

```powershell
.\scripts\operator\check-shadow-health.ps1
```

Expected output:
```
✅ Operator API: OK
✅ n8n: OK
✅ Repo Path: OK
✅ Data Files: OK
```

### 3. Create a Content Job

```powershell
.\scripts\operator\new-content-job.ps1 "Create a YouTube script about procrastination"
```

Expected output:
```
Status: accepted
Dossier ID: DOSSIER-xxx
Workflow Chain: WF-001 → WF-010
```

### 4. Inspect Output

```powershell
.\scripts\operator\inspect-output.ps1 DOSSIER-xxx
```

### 5. Approve Output

```powershell
.\scripts\operator\approve-output.ps1 DOSSIER-xxx
```

---

## Command Reference

### Health & Monitoring

#### check-shadow-health.ps1
Check if all systems are operational.

```powershell
.\scripts\operator\check-shadow-health.ps1
.\scripts\operator\check-shadow-health.ps1 -Verbose
```

**Output**: ✅/❌ status for each system component

---

### Task Creation

#### new-content-job.ps1
Create a new content job.

```powershell
.\scripts\operator\new-content-job.ps1 "Your topic here"
.\scripts\operator\new-content-job.ps1 "Create script about AI" -Context "YouTube video" -Mode creator
```

**Parameters**:
- `Topic` (required): What you want to create
- `Context` (optional): Platform context (default: "YouTube video")
- `Mode` (optional): Operating mode (default: "creator")
  - `creator`: Can create content
  - `founder`: Full access
  - `builder`: Can edit workflows
  - `operator`: Can inspect/replay

**Output**: Dossier ID, workflow status, next steps

---

### Output Inspection

#### inspect-output.ps1
See what outputs have been generated for a dossier.

```powershell
.\scripts\operator\inspect-output.ps1 DOSSIER-xxx
```

**Shows**:
- Dossier creation date and status
- Count of each output type
- Approval state
- Available actions

#### list-outputs.ps1
Get detailed list of all outputs grouped by type.

```powershell
.\scripts\operator\list-outputs.ps1 DOSSIER-xxx
```

**Shows**:
- Scripts generated
- Research packets
- Debate/critique outputs
- Context packets
- Thumbnails, metadata, etc.

---

### Output Approval & Modification

#### approve-output.ps1
Approve the generated output for publication.

```powershell
.\scripts\operator\approve-output.ps1 DOSSIER-xxx
.\scripts\operator\approve-output.ps1 DOSSIER-xxx -Reason "Ready for YouTube"
```

**Confirmation**: Requires "yes" confirmation  
**Result**: Triggers WF-020, approves dossier  
**Effect**: Output is marked ready for publishing

#### request-changes.ps1
Request modifications to the output.

```powershell
.\scripts\operator\request-changes.ps1 DOSSIER-xxx "Make it shorter and funnier"
.\scripts\operator\request-changes.ps1 DOSSIER-xxx "Add more examples" -TargetWorkflow WF-200
```

**Parameters**:
- `DossierId`: Dossier to modify
- `Instructions`: What to change
- `TargetWorkflow` (optional): Which workflow to replay (default: WF-200)

**Confirmation**: Requires "yes" confirmation  
**Result**: Triggers WF-021 with replay instructions

#### replay-stage.ps1
Replay a workflow stage from checkpoint.

```powershell
.\scripts\operator\replay-stage.ps1 DOSSIER-xxx WF-200
.\scripts\operator\replay-stage.ps1 DOSSIER-xxx WF-100 -Action checkpoint_restore
```

**Parameters**:
- `DossierId`: Which dossier
- `TargetWorkflow`: Which workflow (WF-100, WF-200, etc.)
- `Action` (optional): How to replay (default: reexecute)

**Confirmation**: Requires "yes" confirmation  
**Result**: Workflow restarts from saved checkpoint

---

### Error & Alert Management

#### check-errors.ps1
View system errors and workflow failures.

```powershell
.\scripts\operator\check-errors.ps1
.\scripts\operator\check-errors.ps1 -DossierId DOSSIER-xxx
```

**Shows**:
- Error count and types
- Workflow that failed
- Error message and timestamp
- Suggested fixes

---

### Server Management

#### start-operator.ps1
Start the Shadow Operator Core API.

```powershell
.\scripts\operator\start-operator.ps1
.\scripts\operator\start-operator.ps1 -Port 5002
```

**Default Port**: 5002  
**Access**: http://localhost:5002

---

## Workflows

### Standard Content Creation Workflow

```
1. new-content-job.ps1 "Your topic"
   ↓ Creates DOSSIER-xxx
   
2. WF-001 runs (creates dossier)
   ↓
   
3. WF-010 runs (orchestrates workflow chain)
   ├→ WF-100 (generates topics)
   ├→ WF-200 (generates script)
   ├→ WF-300 (adds context)
   ├→ WF-400 (plans media)
   └→ WF-500 (prepares metadata)
   ↓
   
4. inspect-output.ps1 DOSSIER-xxx
   ↓ Shows all generated packets
   
5. EITHER:
   a) approve-output.ps1 DOSSIER-xxx
      ↓ Approves for publication
      
   OR
   
   b) request-changes.ps1 DOSSIER-xxx "instructions"
      ↓ Triggers WF-021 replay with new instructions
      ↓ Go to step 4
```

### Error Recovery Workflow

```
1. check-errors.ps1
   ↓ Shows failed workflows
   
2. Identify problem dossier
   
3. EITHER:
   a) replay-stage.ps1 DOSSIER-xxx WF-200
      ↓ Re-run script generation
      
   OR
   
   b) request-changes.ps1 DOSSIER-xxx "Fix X"
      ↓ Re-run with new instructions
      
4. inspect-output.ps1 DOSSIER-xxx
   ↓ Verify new output
```

---

## Understanding Status Values

### Dossier Status
- `ACCEPTED` — Created, awaiting workflow
- `RUNNING` — Workflows executing
- `PARTIAL_OUTPUT` — Some packets generated
- `OUTPUT_READY` — All packets generated, ready for review
- `APPROVED` — Approved for publication
- `REJECTED` — Rejected, awaiting remodification
- `REPLAY_REQUESTED` — Replay in progress
- `FAILED` — Workflow failure, needs troubleshooting

### Workflow Status
- `NOT_STARTED` — Not yet triggered
- `QUEUED` — Waiting to execute
- `RUNNING` — Currently executing
- `COMPLETED` — Finished successfully
- `FAILED` — Failed with error

### Output Types
- **Scripts**: Content text (original, debate, refined, final)
- **Research**: Research summaries and source citations
- **Context**: Background information, extended narratives
- **Thumbnails**: Thumbnail concept descriptions
- **Image Prompts**: Detailed image generation prompts
- **Voice Scripts**: Text formatted for voice-over
- **Video Packages**: Complete video production plan
- **Metadata**: SEO, description, tags, scheduling info

---

## Mode System

### Operating Modes
- **creator**: Can create content, cannot approve premium/cloud
- **builder**: Can edit repo/workflows, cannot trigger live execution
- **operator**: Can inspect/replay, cannot modify registry
- **founder**: Full access (subject to policy/consent gates)

### Check Current Mode
```powershell
curl http://localhost:5002/operator/mode/state
```

### Change Mode
Requires setting via API or config file (manual state file edit at operator/se_operator_runtime_state.json)

---

## Troubleshooting

### Operator API won't start
```powershell
# Check if port is in use
netstat -ano | grep 5002

# Check if npm modules are installed
npm install
```

### n8n not responding
```powershell
# Check n8n service
Invoke-WebRequest http://localhost:5678/api/v1/health

# If not running, start n8n manually
```

### Dossier not generating packets
1. Check workflow status: `inspect-output.ps1 DOSSIER-xxx`
2. Check errors: `check-errors.ps1`
3. View dossier timeline: `curl http://localhost:5002/operator/dossier/DOSSIER-xxx/timeline`
4. Replay workflow: `replay-stage.ps1 DOSSIER-xxx WF-200`

### "Unknown error" message
- Check operator logs in the terminal where you started `start-operator.ps1`
- Use `check-errors.ps1` to see detailed error info
- Verify n8n is running and accessible

---

## Environment Variables (Optional)

```powershell
$env:PORT = 5002
$env:N8N_BASE_URL = "http://localhost:5678"
$env:OLLAMA_URL = "http://localhost:11434"
```

---

## API Access via PowerShell/Curl

### Direct API Call
```powershell
# Create job via API
curl -X POST http://localhost:5002/operator/new-content-job `
  -H "Content-Type: application/json" `
  -d @{
    topic = "Your topic"
    context = "YouTube video"
    mode = "creator"
  } | ConvertFrom-Json
```

---

## Safety Guarantees

✅ No fake outputs — only real generated packets  
✅ No fake approval — requires explicit action  
✅ No unauthorized replay — confirms before executing  
✅ No provider calls without approval — safe mode default  
✅ Full audit trail — every action traced to dossier  

---

## Next: See Full API Reference

For detailed API endpoint information, see: **OPERATOR_API_REFERENCE.md**

For acceptance test results, see: **OPERATOR_ACCEPTANCE_TEST_REPORT.md**

---

**Last Updated**: 2026-04-30  
**Version**: 1.0  
**Status**: Operational
