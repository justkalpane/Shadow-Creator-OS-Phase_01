# n8n Runtime Guide: Operating Shadow Creator OS

## Why n8n?

n8n is a **workflow orchestration platform** that:
- Runs all 31 workflows
- Manages dossier state
- Routes between workflows
- Logs everything for audit
- Provides visual interface for monitoring
- Persists state to databases

**In Phase-1, n8n is the only execution engine.**

## Starting n8n

```bash
npm run n8n:start
```

Opens at `http://localhost:5678`

## Importing Workflows

In n8n dashboard:
1. Click **Import** (top-left)
2. Click **From File**
3. Navigate to `n8n/workflows/`
4. Select all `.json` files
5. Click **Open**

You should see 31 workflows in sidebar.

## Running a Workflow

1. Click workflow name (e.g., WF-010)
2. Set trigger parameters
3. Click **Execute Workflow**
4. Monitor execution in real-time
5. Check **Output** tab for results

## Example: WF-010 (Parent Orchestrator)

**Inputs:**
- `dossier_id`: "my_topic"
- `mode`: "creator"
- `selected_model`: "ollama_local_llama3.2"

**Runtime:** 10-15 minutes

**Expected Output:** Dossier with all stages complete

## Monitoring Workflows

- **Executions tab:** View all past runs
- **Workflow Monitor:** Check logs, timing, errors
- **Output:** Final result
- **Variables:** Debug values

## Checking Results

```bash
npm run dossier:inspect my_topic
npm run packet:list --dossier my_topic
npm run errors:list --dossier my_topic
```

## Dossier Updates

Every workflow performs append-only dossier mutations:
- Read current dossier
- Add delta log entry (timestamp, version, owner)
- Update namespace content
- Emit packet
- Route to next workflow

**No overwrites. No data loss. Full audit trail.**

## Error Handling

If error occurs:
- Logged with full context
- Classified (validation/runtime/network/etc.)
- Stored in se_error_events table
- Routed to WF-900 (error handler)

## Stopping n8n

```bash
# Foreground: Ctrl+C
# Background: npm run n8n:stop
```

---
