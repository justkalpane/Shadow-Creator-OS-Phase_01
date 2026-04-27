# Glossary and Quick Reference

## Quick Reference: Essential Commands

### n8n Management
```bash
npm run n8n:start                    # Start n8n (http://localhost:5678)
npm run n8n:start:bg                 # Start in background
npm run n8n:stop                     # Stop n8n
npm run n8n:status                   # Check status
```

### Validation
```bash
npm run validate:all                 # Full system validation
npm run validate:registries          # Registry cross-reference check
npm run validate:schemas             # Packet schema validation
npm run validate:workflows           # Workflow JSON validation
npm run validate:models              # Model routing validation
npm run validate:modes               # Mode system validation
```

### Dossier Operations
```bash
npm run dossier:list                 # List all dossiers
npm run dossier:inspect [ID]         # Inspect specific dossier
npm run dossier:archive [ID]         # Archive completed dossier
npm run dossier:delete [ID]          # Delete dossier (careful!)
```

### Data & Monitoring
```bash
npm run packet:list --dossier [ID]   # List packets for dossier
npm run packet:inspect [ID]          # Inspect specific packet
npm run packet:lineage [ID]          # Show packet lineage chain
npm run errors:list --dossier [ID]   # List errors
npm run errors:clear --date [DAYS]   # Clear old errors
npm run cost:report --date [DATE]    # Show cost for date
npm run metrics:daily                # Daily metrics
npm run logs:view                    # View system logs
npm run logs:clean --days [N]        # Clean logs older than N days
```

### Testing
```bash
npm run test:e2e                     # Full end-to-end test
npm run test:e2e:fast                # Fast abbreviated test
npm run test:e2e:replay              # Replay/remodify test
npm run health:check                 # System health check
npm run db:verify                    # Database integrity check
```

---

## URLs and Ports

| Service | URL | Port | Notes |
|---------|-----|------|-------|
| **n8n** | http://localhost:5678 | 5678 | Main control interface |
| **Ollama** | http://localhost:11434 | 11434 | LLM engine |
| **PostgreSQL** | localhost | 5432 | Optional (default: SQLite) |
| **API Base** | http://localhost:5678/api | 5678 | n8n API |

---

## Default Credentials & Configuration

```bash
# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# n8n
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http

# Database (SQLite default)
DATABASE_TYPE=sqlite
DATABASE_PATH=data/shadow_creator.db

# Logging
LOG_LEVEL=debug  (or: error, warn, info)
```

---

## Workflow IDs Quick Reference

### System Workflows (7)
| ID | Name | Purpose | Time |
|----|------|---------|------|
| WF-000 | Health Check | Verify system ready | <1 min |
| WF-001 | Dossier Create | Initialize dossier | <1 min |
| WF-010 | Parent Orchestrator | Run full pipeline | 12-15 min |
| WF-020 | Approval | Governance gate | <1 min |
| WF-021 | Replay/Remodify | Rerun from checkpoint | 3-10 min |
| WF-900 | Error Handler | Log and classify errors | <1 min |
| WF-901 | Error Recovery | Attempt error recovery | <5 min |

### Pack Parent Workflows (6)
| ID | Name | Children | Time |
|----|------|----------|------|
| WF-100 | Topic Intelligence | CWF-110/120/130/140 | 3-5 min |
| WF-200 | Script Intelligence | CWF-210/220/230/240 | 5-8 min |
| WF-300 | Context Engineering | CWF-310/320/330/340 | 2-3 min |
| WF-400 | Media Production | CWF-410+ (Phase-2+) | Deferred |
| WF-500 | Publishing | CWF-510+ (Phase-2+) | Deferred |
| WF-600 | Analytics Evolution | CWF-610/620/630 | 2-3 min |

### Child Workflows (18)
| ID | Name | Parent | Purpose |
|----|------|--------|---------|
| CWF-110 | Topic Discovery | WF-100 | Extract entities, themes |
| CWF-120 | Topic Qualification | WF-100 | Check feasibility |
| CWF-130 | Topic Scoring | WF-100 | Analyze novelty |
| CWF-140 | Research Synthesis | WF-100 | Synthesize sources |
| CWF-210 | Script Generation | WF-200 | Generate outline, draft |
| CWF-220 | Script Debate | WF-200 | Generate critiques |
| CWF-230 | Script Refinement | WF-200 | Fix issues |
| CWF-240 | Final Shaping | WF-200 | Polish, SEO |
| CWF-310 | Context Builder | WF-300 | Define execution rules |
| CWF-320 | Platform Packager | WF-300 | Format for platforms |
| CWF-330 | Asset Brief | WF-300 | Create asset briefs |
| CWF-340 | Lineage Validator | WF-300 | Validate chain |
| CWF-610 | Analytics Collector | WF-600 | Collect metrics |
| CWF-620 | Feedback Processor | WF-600 | Process signals |
| CWF-630 | Learning Closer | WF-600 | Synthesize learnings |
| CWF-410+ | Media (Phase-2+) | WF-400 | Deferred |
| CWF-510+ | Publishing (Phase-2+) | WF-500 | Deferred |

---

## Database Tables

| Table | Purpose | Rows |
|-------|---------|------|
| **se_dossier_index** | All dossiers (topic runs) | 1 per dossier |
| **se_route_runs** | Workflow executions | 1 per execution |
| **se_error_events** | Errors encountered | 1 per error |
| **se_packet_index** | State transitions | 1 per packet |
| **se_approval_queue** | Pending approvals | 1 per pending |

---

## Director Reference

| Director | Authority | Veto Power | Escalates To |
|----------|-----------|-----------|--------------|
| **YAMA** | Policy | Yes (policy violation) | Founder |
| **KUBERA** | Budget | Yes (over budget) | Founder |
| **Topic Director** | Topic relevance | Yes (poor fit) | Research Dir |
| **Research Director** | Evidence quality | Yes (weak sources) | Script Dir |
| **Script Director** | Content quality | Yes (low quality) | Founder |
| **Context Director** | Resource planning | Yes (insufficient resources) | KUBERA |
| **Media Director** | Asset production | Yes (impossible) | Tech Lead |

---

## Mode Reference

| Mode | Type | Authority Level | Quality Threshold | Can Suppress Contradictions |
|------|------|-----------------|-------------------|---------------------------|
| **founder** | User | 3 (full) | Any | Yes |
| **creator** | User | 2 (high) | 0.85 | No |
| **builder** | User | 1 (medium) | 0.70 | Yes |
| **operator** | User | 0 (low) | N/A | Limited |
| **alert_mode** | Operational | 2 | N/A | N/A |
| **troubleshoot_mode** | Operational | 2 | N/A | N/A |
| **replay_mode** | Operational | 1 | N/A | N/A |
| **safe_mode** | Operational | 0 | 0.95 | No |
| **debug_mode** | Operational | 2 | N/A | N/A |
| **self_learning_mode** | Operational | 1 | N/A | N/A |
| **analysis_dashboard_mode** | Operational | 1 | N/A | N/A |
| **context_engineering_mode** | Operational | 1 | N/A | N/A |

---

## Status Values

### Dossier Status
- **pending** — Created, waiting for execution
- **in_progress** — Currently executing workflows
- **review** — Awaiting governance approval
- **approved** — Approved, ready for publication
- **rejected** — Rejected by director, awaiting remodify
- **archived** — Completed and archived
- **completed** — Final state, all stages done

### Workflow Execution Status
- **PENDING** — In queue
- **RUNNING** — Currently executing
- **SUCCESS** — Completed successfully
- **FAILURE** — Failed (routed to WF-900)
- **RECOVERED** — Failed but recovered by WF-901
- **MANUAL** — Awaiting manual intervention

---

## Error Categories

| Category | Examples | Recovery |
|----------|----------|----------|
| **validation_error** | Invalid input, schema mismatch | Fix input, retry |
| **runtime_error** | Skill execution failed | Retry, fallback, escalate |
| **governance_error** | Policy violation, budget exceeded | Escalate, remodify |
| **resource_error** | Out of memory, disk full | Scale resources, retry |
| **network_error** | Ollama timeout, connection lost | Retry with backoff |
| **unknown_error** | Unexpected error | Log, investigate, escalate |

---

## Packet Types (Sample)

| Packet | Producer | Purpose |
|--------|----------|---------|
| **topic_discovery_packet** | CWF-110 | Topic analysis results |
| **research_synthesis_packet** | CWF-140 | Research summary |
| **script_generation_packet** | CWF-210 | Generated script |
| **script_debate_packet** | CWF-220 | Debate critiques |
| **script_refinement_packet** | CWF-230 | Refined script |
| **approval_packet** | WF-020 | Approval decision |
| **analytics_collection_packet** | CWF-610 | Execution metrics |
| **feedback_processing_packet** | CWF-620 | Feedback analysis |
| **learning_loop_closure_packet** | CWF-630 | Learnings |
| ... | ... | ... (300+ total) |

---

## Common Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Ollama connection refused" | Ollama not running | `ollama serve` |
| "Port 5678 in use" | n8n already running | `npm run n8n:stop` |
| "Invalid workflow JSON" | Syntax error in JSON | Run `npm run validate:workflows` |
| "Quality below threshold" | Quality score <0.85 | Use WF-021 to replay |
| "Budget exceeded" | KUBERA gate triggered | Reduce scope or increase budget |
| "Policy violation" | YAMA gate triggered | Review brand guidelines, remodify |
| "Dossier not found" | Wrong dossier_id | `npm run dossier:list` |
| "Skill not in registry" | Skill not registered | Add to registries/ |
| "Packet schema invalid" | Payload doesn't match schema | Check schema definition |

---

## Useful Patterns

### Check System Health
```bash
npm run health:check && npm run validate:all && npm run n8n:status
```

### Run Complete Test
```bash
npm run test:e2e
```

### Debug Failed Workflow
```bash
npm run dossier:inspect [dossier_id]
npm run errors:list --dossier [dossier_id]
npm run packet:list --dossier [dossier_id]
```

### Monitor Execution
```bash
# Terminal 1:
npm run n8n:start

# Terminal 2 (Windows PowerShell):
Get-Content -Path logs/n8n.log -Wait -Tail 50
# Terminal 2 (Mac/Linux):
# tail -f logs/n8n.log

# Terminal 3 (cross-platform): re-run inspect every 5 seconds
# PowerShell: while($true) { npm run dossier:inspect [dossier_id]; Start-Sleep 5 }
# Mac/Linux: watch -n 5 'npm run dossier:inspect [dossier_id]'
```

---

## Learning Resources

| Topic | Guide | Time |
|-------|-------|------|
| First test | 00_START_HERE | 15 min |
| Architecture | 01_SYSTEM_OVERVIEW | 30 min |
| Setup | 02_INSTALLATION_AND_SETUP | 30 min |
| n8n Operation | 03_N8N_RUNTIME_GUIDE | 20 min |
| All modules | 04_MODULE_CATALOG | 30 min |
| Examples | 05_MODULE_USE_CASES | 45 min |
| Each workflow | 06_WORKFLOW_USAGE_GUIDE | 30 min |
| Governance | 07_DIRECTOR_SKILL_AGENT_GUIDE | 30 min |
| State management | 08_DOSSIER_AND_PACKET_GUIDE | 30 min |
| Concepts | 09_KNOWLEDGE_BASE | 30 min |
| Deep dives | 10_ARTICLES_AND_LEARNING_PATHS | 60 min |
| Testing | 11_TESTING_AND_VALIDATION_GUIDE | 30 min |
| Problems | 12_TROUBLESHOOTING_GUIDE | As needed |
| Operations | 13_OPERATOR_RUNBOOK | 30 min |
| Extending | 14_DEVELOPER_CONTINUATION_GUIDE | 45 min |
| Production | 15_PRODUCTION_READINESS_GUIDE | 30 min |

---

## Support Contacts

- **Issues:** Create issue in GitHub repository
- **Questions:** Check Knowledge Base (09_KNOWLEDGE_BASE.md)
- **Bugs:** Check Troubleshooting Guide (12_TROUBLESHOOTING_GUIDE.md)
- **Production:** Contact SRE team

---

**Last Updated:** 2026-04-27  
**Version:** 1.0.0  
**Phase:** Production Phase-1

