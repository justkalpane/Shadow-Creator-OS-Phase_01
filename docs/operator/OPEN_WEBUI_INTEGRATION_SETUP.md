# Phase 9 - Open WebUI Integration Setup
**Date:** 2026-05-01  
**Purpose:** Enable unified orchestration control via Open WebUI + Ollama + Shadow Operator Core

---

## Overview

This setup allows you to manage the entire Shadow Operator Core orchestration from Open WebUI:

```
User (Open WebUI)
    ↓
Ollama (llama3.2:3b with function calling)
    ↓
Tool Definitions (Create job, inspect, approve, replay)
    ↓
Shadow Operator Core API (localhost:5050)
    ↓
n8n Webhooks (localhost:5678)
    ↓
Workflows (WF-001, WF-010, WF-020, etc.)
```

---

## Option 1: Install Open WebUI via Docker (Recommended)

### Prerequisites
- Docker Desktop installed
- Ollama running on localhost:11434
- Shadow Operator Core running on localhost:5050

### Installation

```bash
# Pull the Open WebUI image
docker pull ghcr.io/open-webui/open-webui:latest

# Run Open WebUI connected to local Ollama
docker run -d \
  --name open-webui \
  -p 3000:8080 \
  -e OLLAMA_API_BASE_URL=http://host.docker.internal:11434 \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  ghcr.io/open-webui/open-webui:latest

# Access at: http://localhost:3000
```

### Configuration

1. Open http://localhost:3000 in browser
2. Sign up with an account
3. Go to Settings → Models
4. Select "llama3.2:3b"
5. Go to Settings → Functions
6. Add custom function definitions (see below)

---

## Option 2: Use Open WebUI via Web (No Docker)

If Docker is not available, use Open WebUI web version:

```bash
# Start Ollama with web support
ollama serve

# In another terminal, access Ollama web UI
# But this won't have function calling - use Option 3 instead
```

---

## Option 3: Direct Ollama + Function Calling Setup (Recommended for Local-Only)

### Start Ollama with Function Calling Support

```bash
ollama serve
```

### Use the Tool Runner Directly

```bash
node operator/ollama_tool_runner.js
```

This provides full tool calling without needing Open WebUI's web interface.

---

## Tool Definitions for Open WebUI

When you add custom functions in Open WebUI, use these definitions:

### Tool 1: Create Content Job

```json
{
  "name": "create_content_job",
  "description": "Create a new content job - triggers WF-001 dossier creation and WF-010 orchestration",
  "parameters": {
    "type": "object",
    "properties": {
      "topic": {
        "type": "string",
        "description": "Content topic (e.g., 'Create a YouTube script about procrastination')"
      },
      "context": {
        "type": "string",
        "description": "Content context (e.g., 'YouTube video', 'Twitter thread')",
        "default": "YouTube video"
      },
      "mode": {
        "type": "string",
        "enum": ["founder", "creator", "builder", "operator"],
        "description": "User mode/role",
        "default": "creator"
      }
    },
    "required": ["topic"]
  },
  "action": "POST http://localhost:5050/operator/new-content-job",
  "response_format": "json"
}
```

### Tool 2: Inspect Dossier Output

```json
{
  "name": "inspect_dossier",
  "description": "Inspect a dossier and view its outputs, status, and audit trail",
  "parameters": {
    "type": "object",
    "properties": {
      "dossier_id": {
        "type": "string",
        "description": "The dossier ID (e.g., DOSSIER-1777580373244-Z5VQMUHKE)"
      }
    },
    "required": ["dossier_id"]
  },
  "action": "GET http://localhost:5050/operator/dossier/{dossier_id}",
  "response_format": "json"
}
```

### Tool 3: List Outputs

```json
{
  "name": "list_outputs",
  "description": "List all generated outputs for a dossier (scripts, research, images, etc.)",
  "parameters": {
    "type": "object",
    "properties": {
      "dossier_id": {
        "type": "string",
        "description": "The dossier ID"
      }
    },
    "required": ["dossier_id"]
  },
  "action": "GET http://localhost:5050/operator/outputs/{dossier_id}",
  "response_format": "json"
}
```

### Tool 4: Approve Output

```json
{
  "name": "approve_output",
  "description": "Approve a dossier's output - calls WF-020 approval workflow",
  "parameters": {
    "type": "object",
    "properties": {
      "dossier_id": {
        "type": "string",
        "description": "The dossier ID to approve"
      },
      "reviewer": {
        "type": "string",
        "description": "Your name/role as reviewer",
        "default": "operator"
      },
      "reason": {
        "type": "string",
        "description": "Approval reason",
        "default": "Approved by operator"
      }
    },
    "required": ["dossier_id"]
  },
  "action": "POST http://localhost:5050/operator/approve/{dossier_id}",
  "response_format": "json"
}
```

### Tool 5: Request Changes

```json
{
  "name": "request_changes",
  "description": "Request changes to a dossier - triggers WF-021 replay/remodify",
  "parameters": {
    "type": "object",
    "properties": {
      "dossier_id": {
        "type": "string",
        "description": "The dossier ID"
      },
      "instructions": {
        "type": "string",
        "description": "What changes to make (e.g., 'Make it shorter and more dramatic')"
      },
      "target_workflow": {
        "type": "string",
        "description": "Which workflow to replay",
        "default": "WF-200"
      }
    },
    "required": ["dossier_id", "instructions"]
  },
  "action": "POST http://localhost:5050/operator/remodify/{dossier_id}",
  "response_format": "json"
}
```

### Tool 6: Health Check

```json
{
  "name": "health_check",
  "description": "Check the health status of Shadow Operator Core, n8n, and dependencies",
  "parameters": {
    "type": "object",
    "properties": {}
  },
  "action": "GET http://localhost:5050/operator/health",
  "response_format": "json"
}
```

---

## Integration Steps

### Step 1: Ensure Services are Running

```bash
# Terminal 1: Start n8n
npm run n8n:start

# Terminal 2: Start Operator API
npm run operator:start

# Terminal 3: Start Ollama
ollama serve
```

### Step 2: (Option A) Install Open WebUI via Docker

```bash
docker run -d \
  --name open-webui \
  -p 3000:8080 \
  -e OLLAMA_API_BASE_URL=http://host.docker.internal:11434 \
  ghcr.io/open-webui/open-webui:latest
```

Access: http://localhost:3000

### Step 2: (Option B) Use Direct Ollama Tool Runner

```bash
node operator/ollama_tool_runner.js
```

Then chat with Ollama directly:

```
User: Create a YouTube script about AI tools for creators.

Ollama will:
1. Understand your intent
2. Call the create_content_job tool
3. Return the dossier_id and status
```

### Step 3: Configure Tools in Open WebUI (if using Docker)

1. Login to http://localhost:3000
2. Go to Settings → Functions
3. Create New Function
4. Copy each tool definition from above
5. Save and test

### Step 4: Test the Integration

**Option A - Open WebUI Chat:**
```
You: Create a YouTube script about procrastination with thumbnail ideas.

Open WebUI will:
- Parse your request
- Call create_content_job tool
- Show you the dossier_id
- You can then ask: "Show me the outputs" → calls list_outputs
- Then: "Approve this" → calls approve_output
```

**Option B - Direct Ollama:**
```
$ node operator/ollama_tool_runner.js

You: Create a YouTube script about procrastination
Ollama Tool Runner: Calling create_content_job...
Response: {
  "status": "accepted",
  "dossier_id": "DOSSIER-1777580373244-Z5VQMUHKE",
  "workflow_chain": ["WF-001", "WF-010"]
}

You: Inspect the outputs
Ollama Tool Runner: Calling list_outputs...
Response: [list of generated packets]

You: Approve this
Ollama Tool Runner: Calling approve_output...
Response: {"status": "approved"}
```

---

## Complete User Flow

### User Experience via Open WebUI

```
1. Open http://localhost:3000
2. Chat: "Create a YouTube script about procrastination"
   → Open WebUI calls create_content_job
   → Dossier created: DOSSIER-xxx
   
3. Chat: "What was generated?"
   → Open WebUI calls list_outputs
   → Shows all packets/scripts
   
4. Chat: "Make the script shorter"
   → Open WebUI calls request_changes
   → WF-021 replay triggered
   
5. Chat: "Approve this"
   → Open WebUI calls approve_output
   → WF-020 approval workflow runs
   
6. Chat: "Show me status"
   → Open WebUI calls health_check
   → Shows all systems operational
```

### Same Flow via Direct Ollama Tool Runner

```
$ node operator/ollama_tool_runner.js

User: Create a YouTube script about procrastination
→ Ollama decides to call create_content_job tool
→ Tool runner calls: POST http://localhost:5050/operator/new-content-job
→ Returns dossier_id and status

User: Show the outputs
→ Ollama decides to call list_outputs tool
→ Shows all generated packets

User: Approve it
→ Ollama calls approve_output
→ Returns approval status
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      USER                                    │
│              (Web browser or Terminal)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
   ┌──────────────┐          ┌──────────────────┐
   │  Open WebUI  │          │ Ollama Tool      │
   │  (3000)      │          │ Runner (CLI)     │
   └──────┬───────┘          └────────┬─────────┘
          │                           │
          └──────────────┬────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │  Tool Definitions      │
            │  - create_job          │
            │  - inspect_dossier     │
            │  - list_outputs        │
            │  - approve_output      │
            │  - request_changes     │
            │  - health_check        │
            └────────────┬───────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │  Shadow Operator Core API (:5050)  │
        │  - /new-content-job                │
        │  - /dossier/:id                    │
        │  - /outputs/:id                    │
        │  - /approve/:id                    │
        │  - /remodify/:id                   │
        │  - /health                         │
        └────────────┬───────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   n8n Webhooks (:5678)     │
        │   - WF-001 (Create)        │
        │   - WF-010 (Orchestrate)   │
        │   - WF-020 (Approve)       │
        │   - WF-021 (Replay)        │
        │   - WF-100-600 (Children)  │
        │   - WF-900 (Errors)        │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   Dossiers & Packets       │
        │   - se_dossier_index.json  │
        │   - se_packet_index.json   │
        │   - se_route_runs.json     │
        │   - se_error_events.json   │
        └────────────────────────────┘
```

---

## Quick Start Commands

### Start Everything

```bash
# Terminal 1: n8n
npm run n8n:start

# Terminal 2: Operator API
npm run operator:start

# Terminal 3: Ollama
ollama serve

# Terminal 4 (Optional): Open WebUI
docker run -d --name open-webui -p 3000:8080 \
  -e OLLAMA_API_BASE_URL=http://host.docker.internal:11434 \
  ghcr.io/open-webui/open-webui:latest

# Terminal 5 (Alternative): Direct Ollama Tool Runner
node operator/ollama_tool_runner.js
```

### Verify Integration

```bash
# Check health
curl http://localhost:5050/operator/health

# Create job
curl -X POST http://localhost:5050/operator/new-content-job \
  -H "Content-Type: application/json" \
  -d '{"topic":"Test","context":"YouTube","mode":"creator"}'

# Via Ollama Tool Runner
node operator/ollama_tool_runner.js
# Then type: Create a YouTube script
```

---

## Troubleshooting

### Open WebUI not connecting to Ollama

**Error:** "Could not reach Ollama"

**Fix:**
```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# If using Docker, ensure OLLAMA_API_BASE_URL is correct
docker logs open-webui
```

### Tool calls not working in Open WebUI

**Error:** "Tool call failed"

**Check:**
1. Shadow Operator Core running: `curl http://localhost:5050/operator/health`
2. n8n running: `curl http://localhost:5678/api/v1/health`
3. Tool definitions properly formatted (valid JSON)
4. Tool endpoints reachable from Open WebUI container (if using Docker)

### Ollama Tool Runner not calling tools

**Error:** "No tool was selected"

**Fix:**
1. Verify tool definitions in operator/ollama_tool_runner.js
2. Check Ollama model supports function calling: `ollama pull llama3.2:3b`
3. Ensure Operator API is running: `npm run operator:start`

---

## Safety & Governance

All tool calls respect Shadow Operator Core safety:
- Mode-based access control (founder/creator/builder/operator)
- Cost gates (Kubera) - no cloud providers without approval
- Policy gates (Yama) - no unsafe operations
- Resource gates (Vayu) - no resource-intensive operations
- Audit trails - all operations traceable to dossier_id

User mode is set via the `mode` parameter in tool calls.

---

## Summary

**Phase 9 Complete!**

You now have:
✅ Open WebUI integration (via Docker or direct Ollama)  
✅ Tool definitions for all major operations  
✅ Full natural language control via Ollama  
✅ Unified orchestration interface  

**Ready for production use with:**
- Create content jobs
- Inspect outputs
- Request changes
- Approve operations
- View system status
- All via natural language

---

**Next Steps:**
- Run `docker run open-webui` (if Docker available)
- OR run `node operator/ollama_tool_runner.js` (direct)
- Start creating content jobs via natural language!
