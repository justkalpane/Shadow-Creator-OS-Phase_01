# Troubleshooting Guide: Common Issues and Solutions

## Installation Issues

### Problem: "npm install fails"
**Diagnosis:**
```bash
npm install
# Error: ERR! could not determine executable to run
```
**Solutions:**
1. Delete and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```
2. Check Node version:
   ```bash
   node -v    # Should be 18+
   npm -v     # Should be 8+
   ```
3. Try different registry:
   ```bash
   npm install --registry https://registry.npmjs.org/
   ```

---

## Ollama Issues

### Problem: "Ollama connection refused (localhost:11434)"
**Diagnosis:**
```bash
curl http://localhost:11434/api/tags
# curl: (7) Failed to connect to localhost port 11434
```
**Solutions:**
1. Start Ollama:
   ```bash
   ollama serve
   # In another terminal: ollama pull llama2
   ```
2. Verify Ollama is listening:
   ```bash
   netstat -an | findstr 11434    # Windows
   lsof -i :11434                 # Mac/Linux
   ```
3. Check .env OLLAMA_BASE_URL:
   ```bash
   cat .env | grep OLLAMA_BASE_URL
   # Should be: OLLAMA_BASE_URL=http://localhost:11434
   ```

### Problem: "Ollama timeout (60+ second waits)"
**Diagnosis:** Ollama is responding but slowly
**Solutions:**
1. Check system resources:
   ```bash
   # Windows: Open Task Manager → check CPU, RAM
   # Mac: Activity Monitor
   # Linux: top
   ```
2. Reduce model size or use faster model:
   ```bash
   ollama pull mistral  # Smaller, faster model
   # In .env: OLLAMA_MODEL=mistral
   ```
3. Increase timeout in workflow:
   - Edit n8n workflow timeout settings (advanced)

---

## n8n Issues

### Problem: "n8n port 5678 already in use"
**Diagnosis:**
```bash
npm run n8n:start
# Error: EADDRINUSE: address already in use :::5678
```
**Solutions:**
1. Kill process on port 5678:
   ```bash
   # Windows:
   netstat -ano | findstr :5678
   taskkill /PID <PID> /F
   
   # Mac/Linux:
   lsof -i :5678
   kill -9 <PID>
   ```
2. Change port in .env:
   ```bash
   N8N_PORT=5679  # Use different port
   npm run n8n:start
   # Access at http://localhost:5679
   ```

### Problem: "Workflows disappear after n8n restart"
**Diagnosis:** n8n not persisting workflows to disk
**Solution:** Ensure N8N_USER_FOLDER is set correctly:
```bash
# In .env:
N8N_USER_FOLDER=/path/to/.n8n
# Restart n8n
npm run n8n:start
```

### Problem: "Cannot import workflows into n8n"
**Diagnosis:**
```bash
# In n8n: Import → From File → select workflow.json
# Error: "Invalid workflow JSON"
```
**Solutions:**
1. Verify JSON syntax:
   ```bash
   npm run validate:workflows
   ```
2. Check file is actually JSON:
   ```bash
   file n8n/workflows/WF-010.json
   # Should output: JSON data
   ```
3. Try manual import:
   - Paste JSON directly into n8n import dialog

---

## Validator Issues

### Problem: "npm run validate:all fails"
**Diagnosis:**
```bash
npm run validate:all
# Error: Cannot find module 'validator'
```
**Solutions:**
1. Ensure npm install completed:
   ```bash
   npm install
   npm run validate:all
   ```
2. Check registries exist:
   ```bash
   ls registries/
   # Should show: model_registry.yaml, mode_registry.yaml, etc.
   ```

### Problem: "Registry validator finds orphans"
**Diagnosis:**
```bash
npm run validate:registries
# Error: 3 orphaned artifacts found
```
**Solutions:**
1. Check for typos in registry references:
   ```bash
   grep -r "skill_id" registries/ | grep typo_name
   ```
2. Add missing artifacts to registries:
   - Every artifact must be in registries before execution

---

## Dossier Issues

### Problem: "Cannot inspect dossier"
**Diagnosis:**
```bash
npm run dossier:inspect my_topic
# Error: Dossier not found
```
**Solutions:**
1. Check dossier was created:
   ```bash
   npm run dossier:list
   # See all dossiers
   ```
2. Use exact dossier_id:
   ```bash
   npm run dossier:list | grep my_
   # Copy exact ID
   npm run dossier:inspect <exact_id>
   ```

### Problem: "Dossier quality score is too low"
**Diagnosis:**
```bash
npm run dossier:inspect my_topic | grep quality_score
# quality_score: 0.72 (below creator mode threshold 0.85)
```
**Solutions:**
1. Trigger replay to improve:
   ```bash
   # In n8n: WF-021 → Replay from "script" checkpoint
   # This re-runs script generation with more iterations
   ```
2. Switch to builder mode:
   ```bash
   # In WF-010: Set mode="builder" (threshold 0.70)
   ```

---

## Error Handling Issues

### Problem: "Workflow fails but no error is logged"
**Diagnosis:**
```bash
npm run errors:list --dossier my_topic
# (empty - no errors)
# But workflow shows red in n8n
```
**Solutions:**
1. Check n8n logs directly:
   - Click workflow → Executions → click failed run
   - Scroll to bottom of logs
2. Check WF-900 ran:
   ```bash
   npm run dossier:inspect my_topic
   # Look for error_trace entries
   ```

---

## Performance Issues

### Problem: "WF-010 takes >30 minutes (too slow)"
**Diagnosis:**
```bash
npm run dossier:inspect my_topic
# execution_latency_ms: 1800000 (30 minutes)
```
**Solutions:**
1. Use ROUTE_PHASE1_FAST instead of STANDARD:
   ```bash
   # In WF-010: Set route_id="ROUTE_PHASE1_FAST"
   # Skips some stages, runs in 3-5 minutes
   ```
2. Check system resources (Ollama, CPU):
   ```bash
   # Windows Task Manager
   # Mac Activity Monitor
   # Linux: top
   ```
3. Increase timeouts if Ollama is slow:
   - Edit n8n node timeouts (advanced)

---

## Git and Repository Issues

### Problem: "Cannot push to GitHub"
**Diagnosis:**
```bash
git push origin main
# Error: Permission denied
```
**Solutions:**
1. Check remote:
   ```bash
   git remote -v
   # Should show: github.com/justkalpane/Shadow-Creator-OS-Phase_01.git
   ```
2. Check authentication:
   ```bash
   git config --global user.name
   git config --global user.email
   # Should be configured with GitHub account
   ```
3. Use personal access token instead of password:
   - Create token on github.com → Settings → Developer Settings
   - Use token as password when prompting

---

## Getting Help

**If issue persists:**
1. Check logs: `npm run logs:view`
2. Check dossier: `npm run dossier:inspect [id]`
3. Validate system: `npm run validate:all`
4. Report with: dossier_id, error message, error logs, steps to reproduce

---
