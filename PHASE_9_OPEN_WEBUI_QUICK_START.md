# ⚡ Phase 9 - Open WebUI Quick Start Guide

## 🚀 Fastest Way to Get Started

### Option 1: Direct Ollama Tool Runner (Recommended - No Docker)

```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start n8n  
npm run n8n:start

# Terminal 3: Start Operator API
npm run operator:start

# Terminal 4: Start Open WebUI Tool Runner
.\scripts\windows\start_open_webui.ps1 -UseDirectOllama
```

Then interact via command line:
```
User: Create a YouTube script about procrastination

Ollama Tool Runner:
✓ Creating content job...
  Dossier ID: DOSSIER-1777580373244-Z5VQMUHKE
  Status: running
  Next: Inspect outputs for details

User: Show me the outputs

Ollama Tool Runner:
✓ Fetching outputs...
  Generated packets:
  - Research summary
  - Script draft
  - Thumbnail concepts
  - Voice script

User: Approve this

Ollama Tool Runner:
✓ Approving output...
  Status: approved
  Workflow: WF-020 completed
```

---

### Option 2: Docker-based Open WebUI (If Docker Available)

```bash
.\scripts\windows\start_open_webui.ps1
```

Then:
1. Open http://localhost:3000
2. Sign up
3. Go to Settings → Models → Select "llama3.2:3b"
4. Go to Settings → Functions
5. Add tools from `config/open_webui_tools.json`
6. Start chatting!

---

## 📋 Service Status

**Check everything is running:**

```powershell
# Check Ollama
curl http://localhost:11434/api/tags

# Check n8n
curl http://localhost:5678/api/v1/health

# Check Operator API
curl http://localhost:5050/operator/health
```

All should respond with status info.

---

## 🎯 Available Tools

| Tool | Command | Example |
|------|---------|---------|
| Create Job | `create_content_job` | "Create a YouTube script about AI" |
| View Dossier | `inspect_dossier` | "Show me dossier DOSSIER-xxx" |
| List Outputs | `list_outputs` | "What outputs were generated?" |
| Request Changes | `request_changes` | "Make the script shorter and punchier" |
| Replay Stage | `replay_stage` | "Replay the script generation stage" |
| Approve | `approve_output` | "Approve this content" |
| Health Check | `health_check` | "Is everything working?" |
| View Errors | `check_errors` | "Show me any errors" |

---

## 💡 Usage Examples

### Via Ollama Tool Runner (Command Line)

```bash
$ node operator/ollama_tool_runner.js

You: Create a YouTube script about AI tools for content creators

Ollama Tool Runner:
I'll help you create content. Let me create a new content job.
→ Calling create_content_job tool...

Response: {
  "status": "accepted",
  "dossier_id": "DOSSIER-1777580373244-ABC123",
  "workflow_chain": ["WF-001", "WF-010"],
  "packets_generated": 0
}

Your dossier is: DOSSIER-1777580373244-ABC123
Workflows WF-001 and WF-010 are running.

You: What's the status?

Ollama Tool Runner:
Let me check the outputs for you.
→ Calling list_outputs tool...

Response: {
  "dossier_id": "DOSSIER-1777580373244-ABC123",
  "outputs": {
    "research": {...},
    "script_draft": {...},
    "voice_script": {...}
  }
}

Here's what was generated:
- Research summary (1200 words)
- Script draft (5 minutes)
- Voice script (with emphasis marks)

You: Make it more emotional and shorter

Ollama Tool Runner:
I'll request changes to make it more emotional and concise.
→ Calling request_changes tool...

Response: {
  "status": "remodify_requested",
  "dossier_id": "DOSSIER-1777580373244-ABC123",
  "workflow": "WF-021",
  "instruction": "Make it more emotional and shorter"
}

Remodify workflow (WF-021) has been triggered.
The script generation stage will be replayed with your feedback.

You: Approve the new version

Ollama Tool Runner:
I'll approve the revised content.
→ Calling approve_output tool...

Response: {
  "status": "approved",
  "dossier_id": "DOSSIER-1777580373244-ABC123",
  "workflow": "WF-020",
  "approved_at": "2026-05-01T20:30:00Z"
}

✓ Content approved!
The approval workflow (WF-020) has completed.
Your content is now ready for publishing.
```

### Via Open WebUI (Web Interface)

Same natural language, but in a beautiful web interface at http://localhost:3000

```
Chat: Create a YouTube script about AI tools for creators
→ [System shows dossier created, shows outputs]

Chat: Make it shorter
→ [System triggers WF-021 replay]

Chat: Approve this
→ [System calls WF-020 approval]

Chat: Show me status
→ [System calls health_check, displays system status]
```

---

## 🔄 Full Orchestration Flow

```
User Natural Language
    ↓
Ollama (llama3.2:3b)
    ↓
Tool Decision (which tool to call?)
    ↓
Tool Call JSON
    ↓
Ollama Tool Runner / Open WebUI
    ↓
Shadow Operator Core API (:5050)
    ↓
n8n Webhooks (:5678)
    ↓
Actual Workflows Execute
    ↓
Outputs Written to Files
    ↓
Results Returned to User
```

---

## ⚙️ Configuration

### Operator API Endpoints Called

Tool → Endpoint Mapping:

```
create_content_job    → POST   /operator/new-content-job
inspect_dossier       → GET    /operator/dossier/{dossier_id}
list_outputs          → GET    /operator/outputs/{dossier_id}
approve_output        → POST   /operator/approve/{dossier_id}
request_changes       → POST   /operator/remodify/{dossier_id}
replay_stage          → POST   /operator/replay/{dossier_id}
check_errors          → GET    /operator/errors
health_check          → GET    /operator/health
```

All tools call the real Operator API (no mocks).
All Operator API calls trigger real n8n workflows (no fakes).

---

## 🐛 Troubleshooting

### "Tool call failed" or "Connection refused"

**Check:**
```powershell
# Is Operator API running?
curl http://localhost:5050/operator/health

# Is n8n running?
curl http://localhost:5678/api/v1/health

# Is Ollama running?
curl http://localhost:11434/api/tags
```

All must return status data.

### "Ollama didn't call a tool"

**Solution:**
The llama3.2:3b model supports function calling, but the Ollama Tool Runner needs to be configured with the right system prompt. Check `operator/ollama_tool_runner.js` is running correctly.

### "Open WebUI can't reach Ollama"

**If using Docker:**
```bash
# Check the environment variable
docker inspect open-webui | grep OLLAMA_API_BASE_URL

# Should be: http://host.docker.internal:11434
```

If not set correctly, remove the container and restart:
```bash
docker rm open-webui
.\scripts\windows\start_open_webui.ps1
```

---

## 📊 What Phase 9 Gives You

✅ **Natural Language Interface** - Speak to Ollama, not code  
✅ **Full Orchestration Control** - All operations available  
✅ **Local-Only** - Everything runs on your machine  
✅ **Audit Trail** - All operations tracked to dossier_id  
✅ **Safety Gates** - Mode/cost/policy/resource controls enforced  
✅ **Web Interface** - Beautiful Open WebUI (if Docker available)  
✅ **CLI Interface** - Command-line tool runner (no Docker needed)  

---

## 🚀 Start Now

```powershell
# Simplest start: Direct Ollama
.\scripts\windows\start_open_webui.ps1 -UseDirectOllama

# Or with Docker:
.\scripts\windows\start_open_webui.ps1
```

Then interact with natural language!

---

## 📖 Full Documentation

See: `docs/operator/OPEN_WEBUI_INTEGRATION_SETUP.md`

---

**Phase 9 Ready! Orchestrate everything via natural language.** 🎯
