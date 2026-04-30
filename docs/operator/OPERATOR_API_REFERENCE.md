# Shadow Operator Core — API Reference

**Version**: 1.0  
**Environment**: localhost:5002  
**Last Updated**: 2026-04-30

---

## Base URL

```
http://localhost:5002
```

All endpoints require no authentication (local-only access). Responses are JSON unless otherwise noted.

---

## Health & Status Endpoints

### GET /operator/health

Check if all systems are operational.

**Request**:
```powershell
Invoke-WebRequest -Uri http://localhost:5002/operator/health -Method GET
```

**Response (200 OK)**:
```json
{
  "status": "ok",
  "operator_api": {
    "status": "ok",
    "port": 5002,
    "uptime_seconds": 3600
  },
  "n8n": {
    "status": "ok",
    "url": "http://localhost:5678",
    "version": "1.50.0"
  },
  "ollama": {
    "status": "optional",
    "url": "http://localhost:11434",
    "available": false
  },
  "repository": {
    "status": "ok",
    "path": "C:\\ShadowEmpire-Git"
  },
  "data_files": {
    "status": "ok",
    "dossier_index": true,
    "packet_index": true,
    "route_runs": true,
    "error_events": true,
    "approval_queue": true
  },
  "webhook_registry": {
    "status": "ok",
    "workflows_registered": 8
  }
}
```

**Error (500 - System Unhealthy)**:
```json
{
  "status": "error",
  "message": "System health check failed",
  "failed_components": ["n8n"],
  "details": "n8n at http://localhost:5678 did not respond within 10 seconds"
}
```

---

### GET /operator/events

Real-time event stream (polling-based). Subscribe to workflow status changes, completions, errors.

**Request**:
```powershell
Invoke-WebRequest -Uri http://localhost:5002/operator/events -Method GET
```

**Query Parameters**:
- `since` (optional): ISO 8601 timestamp, return events after this time
- `dossier_id` (optional): Filter to specific dossier

**Response (200 OK)**:
```json
{
  "events": [
    {
      "event_id": "EVT-001",
      "timestamp": "2026-04-30T14:30:00Z",
      "event_type": "workflow_started",
      "dossier_id": "DOSSIER-5c3d",
      "workflow_id": "WF-100",
      "details": {
        "execution_id": "12345abc",
        "stage": "topic_generation"
      }
    },
    {
      "event_id": "EVT-002",
      "timestamp": "2026-04-30T14:35:00Z",
      "event_type": "workflow_completed",
      "dossier_id": "DOSSIER-5c3d",
      "workflow_id": "WF-100",
      "details": {
        "execution_id": "12345abc",
        "packets_generated": 3,
        "duration_seconds": 300
      }
    }
  ],
  "poll_interval_ms": 5000
}
```

---

## Task Operations

### POST /operator/new-content-job

Create a new content generation job. Triggers WF-001 (Dossier Create) → WF-010 (Parent Orchestrator).

**Request**:
```powershell
$payload = @{
    topic = "Create a YouTube script about procrastination"
    context = "YouTube video"
    mode = "creator"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5002/operator/new-content-job `
    -Method POST `
    -ContentType "application/json" `
    -Body $payload
```

**Request Body**:
```json
{
  "topic": "Create a YouTube script about procrastination",
  "context": "YouTube video",
  "mode": "creator"
}
```

**Required Fields**:
- `topic` (string): What to create
- `context` (string): Platform/context (default: "YouTube video")
- `mode` (string): Operating mode (default: "creator")

**Response (202 Accepted)**:
```json
{
  "status": "accepted",
  "dossier_id": "DOSSIER-5c3d",
  "topic": "Create a YouTube script about procrastination",
  "context": "YouTube video",
  "mode": "creator",
  "workflow_chain": ["WF-001", "WF-010"],
  "next_steps": "Monitor with: inspect-output.ps1 DOSSIER-5c3d",
  "created_at": "2026-04-30T14:30:00Z"
}
```

**Error (400 - Invalid Input)**:
```json
{
  "status": "error",
  "message": "Invalid request payload",
  "error_details": {
    "code": "INVALID_PAYLOAD",
    "message": "Topic is required",
    "http_status": 400
  }
}
```

**Error (503 - n8n Unavailable)**:
```json
{
  "status": "error",
  "message": "Unable to create dossier",
  "error_details": {
    "code": "WEBHOOK_UNREACHABLE",
    "message": "n8n at http://localhost:5678 did not respond",
    "http_status": 503
  }
}
```

---

### GET /operator/dossier/:id

Get dossier summary including status, created_at, workflow progress.

**Request**:
```powershell
Invoke-WebRequest -Uri http://localhost:5002/operator/dossier/DOSSIER-5c3d -Method GET
```

**Response (200 OK)**:
```json
{
  "dossier_id": "DOSSIER-5c3d",
  "status": "RUNNING",
  "topic": "Create a YouTube script about procrastination",
  "context": "YouTube video",
  "mode": "creator",
  "created_at": "2026-04-30T14:30:00Z",
  "updated_at": "2026-04-30T14:35:00Z",
  "workflow_chain": {
    "WF-001": {
      "status": "COMPLETED",
      "started_at": "2026-04-30T14:30:00Z",
      "completed_at": "2026-04-30T14:31:00Z"
    },
    "WF-010": {
      "status": "RUNNING",
      "started_at": "2026-04-30T14:31:00Z"
    },
    "WF-100": {
      "status": "COMPLETED",
      "started_at": "2026-04-30T14:31:30Z",
      "completed_at": "2026-04-30T14:32:30Z"
    },
    "WF-200": {
      "status": "RUNNING",
      "started_at": "2026-04-30T14:32:30Z"
    }
  },
  "packets_generated": {
    "scripts": 2,
    "research": 1,
    "debate": 0,
    "context": 0,
    "thumbnails": 0,
    "metadata": 0
  },
  "approval_status": "AWAITING_EXECUTION",
  "approval_required": false
}
```

**Error (404 - Not Found)**:
```json
{
  "status": "error",
  "message": "Dossier not found",
  "error_details": {
    "code": "NOT_FOUND",
    "message": "DOSSIER-5c3d does not exist",
    "http_status": 404
  }
}
```

---

### GET /operator/dossier/:id/timeline

Get detailed execution timeline for a dossier.

**Request**:
```powershell
Invoke-WebRequest -Uri http://localhost:5002/operator/dossier/DOSSIER-5c3d/timeline -Method GET
```

**Response (200 OK)**:
```json
{
  "dossier_id": "DOSSIER-5c3d",
  "timeline": [
    {
      "timestamp": "2026-04-30T14:30:00Z",
      "event": "dossier_created",
      "workflow": "WF-001",
      "details": "Dossier initialized"
    },
    {
      "timestamp": "2026-04-30T14:31:00Z",
      "event": "wf_001_completed",
      "workflow": "WF-001",
      "details": "Dossier create finished, WF-010 enqueued"
    },
    {
      "timestamp": "2026-04-30T14:31:30Z",
      "event": "wf_100_started",
      "workflow": "WF-100",
      "details": "Topic generation started"
    },
    {
      "timestamp": "2026-04-30T14:32:30Z",
      "event": "wf_100_completed",
      "workflow": "WF-100",
      "details": "Generated 2 topic variants"
    },
    {
      "timestamp": "2026-04-30T14:32:30Z",
      "event": "wf_200_started",
      "workflow": "WF-200",
      "details": "Script generation started"
    }
  ]
}
```

---

## Output Operations

### GET /operator/outputs/:id

List grouped outputs for a dossier.

**Request**:
```powershell
Invoke-WebRequest -Uri http://localhost:5002/operator/outputs/DOSSIER-5c3d -Method GET
```

**Response (200 OK)**:
```json
{
  "dossier_id": "DOSSIER-5c3d",
  "outputs": {
    "scripts": [
      {
        "packet_id": "PKT-001",
        "artifact_family": "generated_script_original",
        "created_at": "2026-04-30T14:32:00Z",
        "size_bytes": 12500,
        "preview": "# Introduction\n\nProcrastination is a widespread challenge...",
        "ready_for_review": true
      },
      {
        "packet_id": "PKT-002",
        "artifact_family": "generated_script_refined",
        "created_at": "2026-04-30T14:33:00Z",
        "size_bytes": 11800,
        "preview": "# Why Do We Procrastinate?...",
        "ready_for_review": true
      }
    ],
    "research": [
      {
        "packet_id": "PKT-003",
        "artifact_family": "research_summary",
        "created_at": "2026-04-30T14:31:30Z",
        "size_bytes": 8200,
        "sources": 12,
        "preview": "Research on procrastination reveals three key factors...",
        "ready_for_review": true
      }
    ],
    "debate": [],
    "context": [],
    "thumbnails": [],
    "metadata": []
  },
  "total_packets": 3,
  "approval_required": false
}
```

---

### GET /operator/job/:id

Get HTML review page for a dossier (formatted for viewing in browser).

**Request**:
```powershell
Start-Process http://localhost:5002/operator/job/DOSSIER-5c3d
```

**Response (200 OK)**: HTML page with:
- Dossier metadata (topic, context, created_at, status)
- Output packets grouped by type with previews
- Action buttons: "Approve", "Request Changes", "Replay Stage"
- Provider boundary notices if deferred_provider_required
- Timeline visualization

---

### GET /operator/runs/:run_id/status

Get status of a specific workflow run.

**Request**:
```powershell
Invoke-WebRequest -Uri http://localhost:5002/operator/runs/run-12345/status -Method GET
```

**Response (200 OK)**:
```json
{
  "run_id": "run-12345",
  "workflow_id": "WF-100",
  "dossier_id": "DOSSIER-5c3d",
  "status": "COMPLETED",
  "started_at": "2026-04-30T14:31:30Z",
  "completed_at": "2026-04-30T14:32:30Z",
  "duration_seconds": 60,
  "packets_generated": 2,
  "error": null
}
```

---

## Approval & Modification

### POST /operator/approve/:id

Approve output for publication. Triggers WF-020 (Final Approval).

**Request**:
```powershell
$payload = @{
    reviewer = "operator"
    reason = "Ready for YouTube"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5002/operator/approve/DOSSIER-5c3d `
    -Method POST `
    -ContentType "application/json" `
    -Body $payload
```

**Request Body**:
```json
{
  "reviewer": "operator",
  "reason": "Ready for YouTube"
}
```

**Response (202 Accepted)**:
```json
{
  "status": "approved",
  "dossier_id": "DOSSIER-5c3d",
  "approval_decision": "APPROVED",
  "reviewer": "operator",
  "reason": "Ready for YouTube",
  "approved_at": "2026-04-30T14:35:00Z",
  "workflow_triggered": "WF-020",
  "next_steps": "Output ready for publishing"
}
```

**Error (403 - Permission Denied)**:
```json
{
  "status": "error",
  "message": "Insufficient permissions to approve",
  "error_details": {
    "code": "PERMISSION_DENIED",
    "message": "Current mode does not have approval rights",
    "http_status": 403
  }
}
```

---

### POST /operator/remodify/:id

Request modifications to output. Triggers WF-021 (Replay/Remodify).

**Request**:
```powershell
$payload = @{
    instructions = "Make it shorter and funnier"
    target_workflow = "WF-200"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5002/operator/remodify/DOSSIER-5c3d `
    -Method POST `
    -ContentType "application/json" `
    -Body $payload
```

**Request Body**:
```json
{
  "instructions": "Make it shorter and funnier",
  "target_workflow": "WF-200"
}
```

**Response (202 Accepted)**:
```json
{
  "status": "remodify_queued",
  "dossier_id": "DOSSIER-5c3d",
  "instructions": "Make it shorter and funnier",
  "target_workflow": "WF-200",
  "workflow_triggered": "WF-021",
  "execution_id": "wf-021-exec-abc123",
  "next_steps": "Monitor with: inspect-output.ps1 DOSSIER-5c3d"
}
```

---

### POST /operator/replay/:id

Replay a workflow stage from checkpoint.

**Request**:
```powershell
$payload = @{
    target_workflow = "WF-200"
    action = "reexecute"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5002/operator/replay/DOSSIER-5c3d `
    -Method POST `
    -ContentType "application/json" `
    -Body $payload
```

**Request Body**:
```json
{
  "target_workflow": "WF-200",
  "action": "reexecute"
}
```

**Valid Actions**:
- `reexecute`: Re-run from checkpoint
- `checkpoint_restore`: Restore from previous checkpoint

**Response (202 Accepted)**:
```json
{
  "status": "replay_queued",
  "dossier_id": "DOSSIER-5c3d",
  "target_workflow": "WF-200",
  "action": "reexecute",
  "execution_id": "wf-200-replay-xyz789",
  "next_steps": "Monitor with: inspect-output.ps1 DOSSIER-5c3d"
}
```

---

## Error & Troubleshooting

### GET /operator/errors

List system errors and workflow failures.

**Request**:
```powershell
Invoke-WebRequest -Uri http://localhost:5002/operator/errors -Method GET
```

**Query Parameters**:
- `dossier_id` (optional): Filter to specific dossier
- `workflow_id` (optional): Filter to specific workflow

**Response (200 OK)**:
```json
{
  "error_count": 2,
  "deferred_count": 0,
  "blocked_count": 0,
  "errors": [
    {
      "error_id": "ERR-001",
      "dossier_id": "DOSSIER-5c3d",
      "workflow_id": "WF-300",
      "error_type": "WORKFLOW_FAILURE",
      "message": "Context packet generation failed: API timeout",
      "created_at": "2026-04-30T14:34:00Z",
      "resolvable": true,
      "suggested_action": "replay-stage.ps1 DOSSIER-5c3d WF-300"
    },
    {
      "error_id": "ERR-002",
      "dossier_id": "DOSSIER-5c3d",
      "workflow_id": "WF-400",
      "error_type": "DEFERRED_PROVIDER",
      "message": "Image generation deferred: requires external provider (Phase 2+)",
      "created_at": "2026-04-30T14:35:00Z",
      "resolvable": false,
      "suggested_action": "Acknowledge and continue, or wait for Phase 2 provider integration"
    }
  ]
}
```

---

### POST /operator/alerts/:id/acknowledge

Acknowledge an alert.

**Request**:
```powershell
$payload = @{
    note = "Will fix in next iteration"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5002/operator/alerts/ERR-001/acknowledge `
    -Method POST `
    -ContentType "application/json" `
    -Body $payload
```

**Response (200 OK)**:
```json
{
  "alert_id": "ERR-001",
  "status": "acknowledged",
  "acknowledged_at": "2026-04-30T14:36:00Z",
  "note": "Will fix in next iteration"
}
```

---

### POST /operator/alerts/:id/escalate

Escalate an alert to higher priority.

**Request**:
```powershell
$payload = @{
    reason = "Blocking multiple dossiers"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5002/operator/alerts/ERR-001/escalate `
    -Method POST `
    -ContentType "application/json" `
    -Body $payload
```

**Response (200 OK)**:
```json
{
  "alert_id": "ERR-001",
  "status": "escalated",
  "escalated_at": "2026-04-30T14:36:00Z",
  "reason": "Blocking multiple dossiers",
  "new_priority": "HIGH"
}
```

---

## Mode Management

### GET /operator/mode/state

Get current operating mode.

**Request**:
```powershell
Invoke-WebRequest -Uri http://localhost:5002/operator/mode/state -Method GET
```

**Response (200 OK)**:
```json
{
  "current_mode": "creator",
  "available_modes": ["founder", "creator", "builder", "operator"],
  "operational_modes": {
    "alert_mode": false,
    "troubleshoot_mode": false,
    "analysis_dashboard": false,
    "self_learning": false,
    "replay_mode": false,
    "safe_mode": true,
    "debug_mode": false,
    "context_engineering": false
  },
  "selected_module": "local",
  "available_modules": ["local", "hybrid", "cloud"]
}
```

---

### POST /operator/modes/set

Set operating mode (requires founder access).

**Request**:
```powershell
$payload = @{
    mode = "founder"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:5002/operator/modes/set `
    -Method POST `
    -ContentType "application/json" `
    -Body $payload
```

**Request Body**:
```json
{
  "mode": "founder"
}
```

**Valid Modes**: `founder`, `creator`, `builder`, `operator`

**Response (200 OK)**:
```json
{
  "status": "mode_changed",
  "previous_mode": "creator",
  "current_mode": "founder",
  "changed_at": "2026-04-30T14:37:00Z"
}
```

---

### POST /operator/modes/operational/:mode_id/enable

Enable an operational mode.

**Request**:
```powershell
Invoke-WebRequest -Uri http://localhost:5002/operator/modes/operational/alert_mode/enable `
    -Method POST
```

**Operational Modes**:
- `alert_mode`: Alert monitoring (requires operator+)
- `troubleshoot_mode`: Troubleshoot console (requires builder+)
- `analysis_dashboard`: Analytics (requires operator+)
- `self_learning`: Self-learning (requires founder)
- `replay_mode`: Replay console (requires operator+)
- `safe_mode`: Safe mode (default enabled, creator+)
- `debug_mode`: Debug console (requires builder+)
- `context_engineering`: Context engineering (requires founder)

**Response (200 OK)**:
```json
{
  "status": "enabled",
  "operational_mode": "alert_mode",
  "enabled_at": "2026-04-30T14:37:00Z"
}
```

---

### POST /operator/modes/operational/:mode_id/disable

Disable an operational mode.

**Request**:
```powershell
Invoke-WebRequest -Uri http://localhost:5002/operator/modes/operational/alert_mode/disable `
    -Method POST
```

**Response (200 OK)**:
```json
{
  "status": "disabled",
  "operational_mode": "alert_mode",
  "disabled_at": "2026-04-30T14:37:00Z"
}
```

---

## HTTP Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, mode state retrieved |
| 202 | Accepted | Task queued (new job, approval, replay) |
| 400 | Bad Request | Invalid JSON, missing required fields |
| 403 | Forbidden | Permission denied (mode doesn't allow action) |
| 404 | Not Found | Dossier/alert/workflow not found |
| 500 | Internal Error | Server error, n8n unreachable |
| 503 | Service Unavailable | n8n down, registries missing |

---

## Rate Limiting

No rate limits (local-only API). Caller responsible for reasonable polling intervals.

**Recommended Polling**:
- Event stream: 5-10 seconds
- Dossier status: 5 seconds during execution, 30 seconds while idle
- Error checks: 10 seconds when troubleshooting

---

## Error Response Format

All errors follow this consistent structure:

```json
{
  "status": "error",
  "message": "Human-readable summary",
  "error_details": {
    "code": "MACHINE_CODE",
    "message": "Detailed error message",
    "http_status": 500,
    "response_body": "Raw n8n response if applicable"
  }
}
```

---

**API Version**: 1.0  
**Last Updated**: 2026-04-30  
**Status**: Operational
