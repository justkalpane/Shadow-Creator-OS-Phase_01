# START HERE: Your First 15 Minutes with Shadow Creator OS

## What Problem Does Shadow Creator OS Solve?

Creating quality content is hard and slow:
- Research takes hours
- Writing takes days
- Debate & refinement takes days more
- Publishing across channels takes more time

**Shadow Creator OS automates this.** You give it a topic. It researches. It writes. It debates. It refines. It prepares for publication. All automatically. All in one controlled system.

## What You Need (Minimum)

- **Windows 10+** (or macOS/Linux with Docker)
- **Git** installed
- **Node.js** 18+ installed
- **Docker** or **Ollama** running locally
- **30 minutes** for setup
- **10 minutes** for your first test

## 30-Minute Setup

### Step 1: Clone the Repository (2 min)
```bash
cd C:\Users\YourUsername\projects
git clone https://github.com/justkalpane/Shadow-Creator-OS-Phase_01.git
cd Shadow-Creator-OS-Phase_01
```

### Step 2: Install Node Dependencies (5 min)
```bash
npm install
```

### Step 3: Start Ollama (Assume already running; if not)
```bash
# Windows: Download Ollama from ollama.ai
# Or if using Docker:
docker run -d -p 11434:11434 ollama/ollama
```

### Step 4: Start n8n (5 min)
```bash
npm run n8n:start
```
This starts n8n at `http://localhost:5678`

### Step 5: Import Workflows (10 min)
Go to n8n dashboard → Import → select all JSON files from `n8n/workflows/`

### Step 6: Validate (3 min)
```bash
npm run validate:all
```
Expected output: "All validators passed. System ready."

## Your First 10-Minute Test

### What You'll Do
1. Create a dossier (execution state)
2. Run WF-000 (health check)
3. Run WF-001 (initialize dossier)
4. Run WF-010 (parent orchestrator)
5. Monitor execution in n8n
6. Inspect outputs in dossier

### Step-by-Step

**Step 1: Start n8n (if not running)**
```bash
npm run n8n:start
```

**Step 2: Open n8n Dashboard**
Go to `http://localhost:5678` in your browser

**Step 3: Run WF-000 (Health Check)**
- Click on WF-000-health-check workflow
- Click "Execute Workflow"
- Wait 10 seconds
- Expected output: `{ "status": "healthy", "ollama_available": true, "folders_ok": true }`

**Step 4: Run WF-001 (Create Dossier)**
- Click on WF-001-dossier-create workflow
- Set trigger parameters:
  - `dossier_id`: "test_topic_001"
  - `route_id`: "ROUTE_PHASE1_STANDARD"
  - `topic`: "The history of remote work"
- Click "Execute Workflow"
- Wait 20 seconds
- Expected output: Dossier created with status "pending"

**Step 5: Run WF-010 (Parent Orchestrator)**
- Click on WF-010-parent-orchestrator workflow
- Set trigger parameters:
  - `dossier_id`: "test_topic_001"
  - `mode`: "creator"
- Click "Execute Workflow"
- Wait 5-10 minutes
- Monitor execution in real-time in n8n dashboard

**Step 6: Inspect Results**
```bash
# In a new terminal:
npm run dossier:inspect test_topic_001
```

You should see:
- Topic discovery outputs (entities, themes)
- Research synthesis (sources, claims)
- Script generation (outline, draft)
- Quality scores (all stages)

**Congratulations!** You've run a complete Phase-1 workflow. You've just:
1. Created immutable state (dossier)
2. Ran topic intelligence (discovery → qualification → scoring)
3. Ran research intelligence (synthesis)
4. Ran script intelligence (generation → debate → refinement)
5. All in one automated orchestration

## What Just Happened (5-Minute Explanation)

**WF-010** is the parent orchestrator. It:
1. Loads your dossier
2. Checks your mode (creator)
3. Selects Ollama as the model (only Phase-1 model)
4. Routes to WF-100 (Topic Intelligence Pack)
   - Runs CWF-110 (topic discovery)
   - Runs CWF-120 (topic qualification)
   - Runs CWF-130 (topic scoring)
   - Runs CWF-140 (research synthesis)
5. Routes to WF-200 (Script Intelligence Pack)
   - Runs CWF-210 (script generation)
   - Runs CWF-220 (script debate)
   - Runs CWF-230 (script refinement)
   - Runs CWF-240 (final script shaping)
6. Routes to WF-020 (Approval Gate)
   - Checks governance
   - Approves for publication
7. Routes to WF-600 (Analytics Pack)
   - Collects metrics
   - Learns from execution
   - Closes learning loop

**Every step writes to the dossier.** No overwrites. Only append-only deltas. Full audit trail.

## Next: Understand the System

Read [01 SYSTEM OVERVIEW](01_SYSTEM_OVERVIEW.md) to understand:
- What directors are (governance)
- What skills are (operations)
- What workflows are (orchestration)
- How dossiers work (state)
- How packets work (transitions)
- What validators do (safety)

## Troubleshooting Your First Test

**Problem:** "Ollama connection refused"
- **Solution:** Make sure Ollama is running: `ollama serve` in another terminal

**Problem:** "n8n port already in use"
- **Solution:** Kill process on 5678: `lsof -i :5678 | kill -9`

**Problem:** "npm install fails"
- **Solution:** Delete node_modules and package-lock.json, then `npm install` again

**Problem:** "Validators fail"
- **Solution:** See [11 TESTING & VALIDATION GUIDE](11_TESTING_AND_VALIDATION_GUIDE.md)

## Key Takeaways

✅ Shadow Creator OS **automates** content research → writing → refinement
✅ It's **orchestrated** by n8n locally
✅ It's **governed** by registries and directors
✅ All state is **immutable** (append-only dossier)
✅ All changes are **audited** with version tracking
✅ You can **replay** from any checkpoint

**Ready to go deeper?** → [03 n8n RUNTIME GUIDE](03_N8N_RUNTIME_GUIDE.md)

---
