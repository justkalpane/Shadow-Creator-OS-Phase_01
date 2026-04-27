# Installation & Local Setup Guide

## Prerequisites

| Component | Version | Required |
|-----------|---------|----------|
| **Windows / macOS / Linux** | 10+ / 10+ / Any | Yes |
| **Git** | 2.30+ | Yes |
| **Node.js** | 18+ | Yes |
| **npm** | 8+ | Yes |
| **Docker** | 20+ | Optional (if using Docker for Ollama) |
| **Ollama** | Latest | Yes |

## Full Setup Guide (30 Minutes)

### Step 1: Clone Repository (2 min)
```bash
cd C:\projects
git clone https://github.com/justkalpane/Shadow-Creator-OS-Phase_01.git
cd Shadow-Creator-OS-Phase_01
```

### Step 2: Install Node Dependencies (5 min)
```bash
npm install
```

### Step 3: Start Ollama (5 min)

**Option A: Native Ollama**
```bash
# Download from ollama.ai and install
ollama serve
# In another terminal: ollama pull llama2
```

**Option B: Docker**
```bash
docker run -d -p 11434:11434 --name ollama ollama/ollama
docker exec ollama ollama pull llama2
```

### Step 4: Create Environment Configuration (3 min)
Create `.env` file:
```bash
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
N8N_PORT=5678
N8N_HOST=localhost
LOG_LEVEL=debug
```

### Step 5: Start n8n (5 min)
```bash
npm run n8n:start
```
Opens at `http://localhost:5678`

### Step 6: Import Workflows (10 min)
In n8n dashboard → Import → select `n8n/workflows/` → Open all

### Step 7: Validate System (3 min)
```bash
npm run validate:all
# Expected: All validators passed
```

## Quick Commands

```bash
npm run n8n:start          # Start n8n
npm run validate:all       # Validate system
npm run dossier:inspect ID # View dossier
npm run errors:list        # List errors
```

## Troubleshooting

**Ollama not responding:** 
- Verify: `curl http://localhost:11434/api/tags`
- Restart: `ollama serve`

**n8n port in use:**
- Windows: `netstat -ano | findstr :5678` then kill process
- Mac/Linux: `lsof -i :5678 | kill -9`

**npm install fails:**
- Delete node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`

---
