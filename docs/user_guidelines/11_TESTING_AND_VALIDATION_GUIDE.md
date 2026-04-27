# Testing and Validation Guide

## Types of Validation

### 1. Static Validation (No Runtime)

**Registry Validation:**
```bash
npm run validate:registries
# Checks:
# - All registries exist
# - All YAML syntax is valid
# - All cross-references resolve
# Result: 100% artifact resolution, 0 orphans
```

**Schema Validation:**
```bash
npm run validate:schemas
# Checks:
# - All 318+ packet schemas are valid JSON
# - Dossier schema is complete
# - Required fields present
```

**Workflow Structure Validation:**
```bash
npm run validate:workflows
# Checks:
# - All 31 workflow JSONs are valid
# - All nodes have required fields
# - All connections are defined
# - Error handling routes to WF-900
```

### 2. Runtime Validation (With Execution)

**Model Validator:**
```bash
npm run validate:models
# Checks:
# - Model registry has primary + fallback
# - Fallback chains are acyclic
# - Cost gates are defined
# - Provider legality rules enforced
```

**Mode Validator:**
```bash
npm run validate:modes
# Checks:
# - All 12 modes defined
# - Nesting rules enforced
# - Hard non-overridables respected
# - Governance levels assigned
```

**Runtime State Validator:**
```bash
npm run validate:dossiers
# Checks:
# - Dossier state is consistent
# - Delta log is ordered
# - Namespace ownership is clear
# - Packets have lineage
```

### 3. End-to-End Validation (Full Pipeline)

**Complete Test Flow:**
```bash
npm run test:e2e
# Runs:
# 1. WF-000 (health check)
# 2. WF-001 (create dossier)
# 3. WF-010 (full pipeline)
# 4. Inspect outputs
# 5. Verify all namespaces populated
# 6. Check all packets emitted
# 7. Verify approvals passed
# Result: Pass/Fail with detailed report
```

---

## Validation Commands Reference

```bash
# Full system validation
npm run validate:all

# Individual validators
npm run validate:registries
npm run validate:schemas
npm run validate:workflows
npm run validate:models
npm run validate:modes

# Runtime checks
npm run validate:dossiers
npm run dossier:inspect [dossier_id]
npm run packet:list --dossier [dossier_id]
npm run errors:list --dossier [dossier_id]

# End-to-end tests
npm run test:e2e
npm run test:e2e:fast    # Abbreviated route
npm run test:e2e:replay  # Replay from checkpoint

# Check system health
npm run health:check
npm run db:verify
npm run n8n:status
```

---

## Testing Workflow Execution

**Test 1: Health Check (1 minute)**
```bash
# In n8n: WF-000 → Execute
# Expected: System ready, Ollama available
```

**Test 2: Dossier Creation (2 minutes)**
```bash
# In n8n: WF-001 → Execute with dossier_id and topic
# Expected: Dossier created in database
```

**Test 3: Full Pipeline (15 minutes)**
```bash
# In n8n: WF-010 → Execute with dossier_id
# Monitor: Watch all stages execute
# Expected: All stages complete, approval passed
```

**Test 4: Approval Rejection and Replay (20 minutes)**
```bash
# Manually modify script quality to <0.85
# In n8n: WF-020 → Reject
# In n8n: WF-021 → Replay from research checkpoint
# Expected: Re-runs script generation, approves on second attempt
```

**Test 5: Error Handling (5 minutes)**
```bash
# Manually stop Ollama
# In n8n: WF-010 → Execute
# Expected: Timeout error caught, logged, routed to WF-900
```

---

## Acceptance Criteria

**For Production Readiness:**

✅ All 31 workflows import without errors
✅ WF-000 returns healthy status
✅ WF-001 creates dossier successfully
✅ WF-010 completes end-to-end (15 min)
✅ All governance gates pass (YAMA, KUBERA, directors)
✅ All packets emitted with correct schema
✅ Dossier delta log has entries for each stage
✅ Error handling routes to WF-900
✅ Replay/remodify works from checkpoints
✅ Analytics collected and learning loop closed
✅ Dossier status ends as "completed"
✅ 0 unrecovered errors in error_trace
✅ All validators pass
✅ No orphaned artifacts in registries

---
