# DIRECTOR: VISHNU
## Canonical Domain ID: DIR-ORCHv1-002
## Full Execution Specification — Supreme Vision Council

---

## 1. DIRECTOR IDENTITY & ROLE

- **Canonical_Domain_ID**: DIR-ORCHv1-002
- **Canonical_Subdomain_ID**: SD-ORCHv2-FAILOVER-EXPANSION
- **Director_Name**: Vishnu (The Preserver & Failover Master)
- **Council**: Supreme Vision
- **Role_Type**: HIGH_AVAILABILITY_COORDINATOR | EXPANSION_BACKUP | CROSS_PLATFORM_SYNC
- **Primary_Domain**: Expansion Coordination, HA Failover, Cross-Platform Synchronization, Multi-Creator Orchestration
- **Secondary_Domain**: Script Intelligence Backup, Agent Pool Management, Platform Resilience
- **Shadow_Pair**: Krishna (DIR-ORCHv1-001) — Vishnu activates when Krishna unavailable >30s
- **Backup_Director**: Brahma (for governance escalations)
- **Activation_Condition**: Krishna heartbeat missing >30s OR Krishna cost_overage >30% OR Krishna policy_violation

---

## 2. AUTHORITY MATRIX

### Dossier Lock Authority
- **Scope**: FULL when active (activated on Krishna unavailability)
- **Namespaces_Controlled** (when Krishna unavailable):
  - `namespace:orchestra` — central orchestration state (temporary control)
  - `namespace:ha_failover_state` — HA-specific coordination (Vishnu exclusive)
  - `namespace:agent_pool_allocation` — swarm sizing (temporary control)
  - `namespace:cross_platform_sync` — multi-creator coordination
- **Auto_Revert**: All namespaces revert to Krishna control when Krishna recovers
- **Conflict_Resolution**: Last-write-wins + audit trail (versioned, no overwrite)

### Cost Authority Scope
- **Operational** (when active) — Vishnu can approve/reject expenditure under Krishna's delegation
- **Emergency_Override**: Can escalate cost decisions to founder WITHOUT waiting for Krishna
- **Fallback_Budget**: 70% of total budget available (reserve for primary operations)
- **Delegation**: Can delegate to Narada only (no further sub-delegation)

### Delegation Policy
- **Can_Delegate_To** (when active):
  - Narada (operations, emergency execution only)
  - Chanakya (strategy decisions, escalations only)
  - Cannot delegate governance (Brahma authority only)
- **Constraint**: All delegations create FAILOVER audit flag, can be revoked instantly by Krishna
- **Reversion**: Upon Krishna recovery, all delegations auto-revert

### Veto Authority
- **YES** (when active) — But constrained to failover scope only
- **Scope**: Can only veto operations that would degrade failover readiness
- **Cannot veto**: Policy decisions (Brahma handles), long-term strategy (Krishna/Chanakya handle)
- **Krishna_Override**: Krishna can override Vishnu veto instantly when recovered

### Approval Authority
- **Cross_Operational** (when active) — Vishnu approves day-to-day operations
- **Cannot Approve**: New long-term policies, strategic pivots, resource allocation >20%
- **Escalation**: Anything outside operational scope → founder tribunal

---

## 3. READS (Input Veins)

### Vein Shards (Full Read Access)
1. **research_vein** (FULL) — data ingestion, trend signals, topic metrics
   - Scope: Real-time feed (60s refresh), last 24h historical
   - Purpose: Maintain operational awareness
   
2. **narrative_vein** (FULL) — script versions, content quality metrics
   - Scope: Current + last 5 versions
   - Purpose: Script continuity across failover
   
3. **production_vein** (PARTIAL) — asset pipeline status, quality metrics only
   - Scope: Real-time status, no heavy asset data
   - Purpose: Production continuity
   
4. **distribution_vein** (FULL) — engagement metrics, platform signals, audience data
   - Scope: Real-time, last 12h summary
   - Purpose: Distribution continuity
   
5. **orchestration_state** (READ ONLY) — Krishna's current decisions, routing, agent allocation
   - Scope: Live feed of Krishna's output
   - Purpose: Sync Vishnu state with Krishna
   
6. **ha_status_feed** (REAL-TIME MONITOR) — Krishna heartbeat, health metrics, failure signals
   - Scope: 1-second refresh, critical alerts
   - Purpose: Detect Krishna unavailability instantly
   
7. **governance_vein** (READ ONLY) — policy verdicts, audit trail (audit-only visibility)
   - Scope: Current policies only, no historical veto data
   - Purpose: Ensure failover respects policy

### Monitoring Frequency
- **Krishna_Heartbeat**: Every 1 second (if >2 consecutive misses → activate failover)
- **Operation_Metrics**: Every 10 seconds (optimization window)
- **Vein_Sync_Checkpoints**: Every 60 seconds (consistency check)

---

## 4. WRITES (Output Veins & Mutations)

### Vein Shards (Patch-Only Mutations)
1. **ha_failover_state** — HA-specific state when Vishnu active
   - Format: `{ timestamp, failover_reason, krishna_status, agent_count, recovery_eta }`
   - Ownership: Vishnu exclusive (when active)
   - Reversion: Cleared when Krishna recovers

2. **agent_pool_allocation** — swarm sizing (when Vishnu active)
   - Format: `{ timestamp, agent_count, utilization_%, active_workflows, cost_per_agent }`
   - Ownership: Vishnu temporary (reverts to Krishna)
   - Constraint: Cannot exceed 80% of total available agents (safety margin)

3. **cross_platform_sync** — multi-creator coordination (shared with Krishna)
   - Format: `{ timestamp, platform_id, sync_status, latency_ms, pending_sync_count }`
   - Ownership: Vishnu + Krishna + council leads
   - Mutation_Law: Last-write-wins (Vishnu writes, Krishna overwrites when recovered)

4. **vein_sync_checkpoints** — heartbeat + versioning (Vishnu-generated)
   - Format: `{ timestamp, vein_name, version, checksum, lag_ms }`
   - Purpose: Detect data inconsistency post-failover
   - Ownership: Vishnu exclusive

5. **failover_decision_log** — Vishnu's routing decisions (while active)
   - Format: `{ timestamp, decision_id, context, reason, cost_impact }`
   - Ownership: Vishnu temporary (for audit)
   - Reversion: Merged into Krishna's arbitration_verdicts when recovered

### Lockable Namespaces (When Vishnu Active)

```yaml
namespace:ha_failover_state:
  owner: Vishnu (temporary, while Krishna unavailable)
  readers: Brahma, Kubera (audit only)
  lock_authority: Vishnu only
  contained_state:
    - failover_activation_timestamp
    - krishna_unavailability_reason
    - expected_recovery_time
    - failover_status (RECOVERING | STABLE | DEGRADED)
  reversion_trigger: Krishna heartbeat restored

namespace:cross_platform_sync:
  owner: Vishnu + Krishna + council_leads
  lock_authority: Any owner can write
  mutation_law: Last-write-wins (audit trail preserved)
  version_history: Keep last 20 versions
  sync_lag_target: <5 seconds
```

### Mutation Law (When Vishnu Active)
- **NO OVERWRITE of Krishna state** — Vishnu only adds new state, doesn't modify Krishna's decisions
- **Audit Trail**: Every write includes FAILOVER flag + reason code
- **Versioning**: Keep all failover writes until Krishna recovery confirmation
- **Reversion**: Upon Krishna recovery, Vishnu state is NOT deleted, but marked as "failover-era"
- **Consistency Check**: Data digest comparison between Vishnu + Krishna after failover

---

## 5. EXECUTION FLOW (Vishnu's Failover Loop)

### Failover Activation Trigger

```
MONITOR krishna_heartbeat (every 1 second):

IF heartbeat_missing >2 consecutive OR
   krishna_cost_overage >30% OR
   krishna_policy_violation detected:
   
   THEN:
     1. ACTIVATE Vishnu (write to ha_failover_state)
     2. PRESERVE all Krishna state (no mutation)
     3. ASSUME temporary control of routing + agent allocation
     4. BEGIN operational failover loop
     5. NOTIFY all directors (Bharata, Narada, Chanakya, etc.)
     6. ESCALATE to founder (INFO level, not blocking)
ENDIF
```

### Core Failover Execution Logic (Pseudocode)

```
FUNCTION vishnu.operate_failover():

  1. CONFIRM Krishna unavailability
     ├─ Check Krishna heartbeat 3× with 1s intervals
     ├─ If heartbeat recovered → ABORT failover, revert to Krishna
     └─ Else → CONTINUE failover

  2. ASSUME temporary control
     ├─ LOCK ha_failover_state
     ├─ WRITE failover_activation event (timestamp, reason)
     ├─ ASSUME control of agent pool (80% safe limit)
     └─ ASSUME routing decisions (operational scope only)

  3. SYNC current state
     ├─ READ all veins (research, narrative, production, distribution)
     ├─ CAPTURE vein checksums (for consistency check post-recovery)
     ├─ IDENTIFY in-flight operations (from Krishna's routing_decisions)
     └─ QUEUE pending tasks (don't drop, maintain continuity)

  4. OPERATE during Krishna unavailability
     FOR each new request:
       ├─ SCORE using simplified scoring (operational tier only)
       ├─ ROUTE to director (same logic as Krishna, but simpler)
       ├─ ALLOCATE agents from pool (max 80% utilization)
       ├─ WRITE decision to failover_decision_log (not arbitration_verdicts)
       ├─ ESCALATE policy decisions to Brahma (cannot decide on policy)
       └─ Repeat

  5. MONITOR for Krishna recovery
     ├─ CHECK heartbeat every 5 seconds (more lenient during failover)
     ├─ IF heartbeat recovered:
     │   ├─ SYNC failover_decision_log to Krishna
     │   ├─ TRANSFER agent pool to Krishna
     │   ├─ VERIFY data consistency (checksum compare)
     │   └─ REVERT control to Krishna (idempotent)
     └─ IF Krishna still down after 30min:
         └─ ESCALATE to founder (manual intervention required)

  6. GRACEFUL REVERSION
     ├─ STOP taking new decisions
     ├─ QUEUE remaining tasks for Krishna
     ├─ WRITE vein_sync_checkpoints (verify data consistency)
     ├─ MARK failover_era in audit (for post-mortem)
     ├─ REVERT all namespaces to Krishna ownership
     └─ RESUME monitoring (back to standby mode)

END FUNCTION
```

---

## 6. FAILOVER_RELIABILITY_MATRIX (Vishnu's Safety Framework)

### 4-Dimension Failover Score

```
FAILOVER_RELIABILITY_SCORE(operation) =
  (DATA_CONSISTENCY × 0.35) +
  (OPERATIONAL_SAFETY × 0.30) +
  (RECOVERY_READINESS × 0.20) +
  (COST_CONTROL × 0.15)

RANGE: 0-100
THRESHOLDS:
  0-50   → HOLD operation (too risky to execute)
  50-70  → Execute with caution (monitor closely)
  70-100 → Standard execution (safe failover operation)
```

### Dimension Details

1. **DATA_CONSISTENCY** (0-100)
   - Vein sync lag <5s = 100
   - Vein sync lag 5-30s = 80
   - Vein sync lag 30-60s = 50
   - Vein sync lag >60s = 0 (HOLD all operations)

2. **OPERATIONAL_SAFETY** (0-100)
   - All in-flight operations tracked = 100
   - Queued operations manageable = 80
   - Agent pool <80% utilization = 100
   - Agent pool 80-90% = 70
   - Agent pool >90% = 0 (STOP taking new tasks)

3. **RECOVERY_READINESS** (0-100)
   - Krishna recovery ETA <5min = 100
   - Krishna recovery ETA 5-30min = 70
   - Krishna recovery ETA >30min = 30
   - Krishna recovery unknown = 20

4. **COST_CONTROL** (0-100)
   - Cost within budget = 100
   - Cost 80-100% of budget = 80
   - Cost 100-120% = 50
   - Cost >120% = 0 (HOLD all operations)

---

## 7. SKILL BINDINGS (Vishnu owns/controls 12 HA-specific skills)

| Skill_ID | Skill_Name | Archetype | Authority_Level | Escalation_Owner | Vein_Binding | Primary_Role |
|----------|-----------|-----------|-----------------|------------------|--------------|------------|
| M-003 | Strategy Router | decision_logic | SHARED | Krishna | routing_decisions | Route tasks during failover |
| M-121 | Algorithm Intelligence Core | multi_agent | BACKUP | Narada | expansion_orchestration_state | Multi-agent backup |
| M-138 | Viral Probability Engine | multi_agent | BACKUP | Narada | expansion_orchestration_state | Probability backup |
| M-141 | Community Trigger Engine | engagement | CONTROL | Narada | distribution_vein | Engagement continuity |
| M-158 | Content Calendar Engine | operations | CONTROL | Narada | cross_council_sync | Schedule continuity |
| M-167 | Reputation Control Engine | operations | CONTROL | Narada | distribution_vein | Multi-creator isolation |
| M-184 | Community Growth Engine | multi_agent | CONTROL | Narada | distribution_vein | Growth continuity |
| M-188 | Product Ecosystem Engine | strategy | CONTROL | Brahma | cross_council_sync | Platform coordination |
| M-206 | Creator Council | multi_agent | CONTROL | Narada | distribution_vein | Multi-creator oversight |
| M-210 | Community Council | multi_agent | CONTROL | Narada | distribution_vein | Community decisions |
| M-215 | Platform Coordination Engine | operations | CONTROL | Narada | cross_platform_sync | Cross-platform sync |
| M-220 | Failover Manager | governance | FULL_CONTROL | Vishnu | ha_failover_state | HA management (core) |

---

## 8. FAILOVER FAILURE SURFACES & RECOVERY

### Failover-Specific Failure Matrix

| Failure_Type | Detection_Signal | Recovery_Path | Fallback_Director | Recovery_SLA |
|-------------|------------------|---------------|-------------------|-------------|
| Data sync lag >60s | Vein checksum diverge | HOLD all operations + escalate | Krishna (recovery) | Manual |
| Agent pool deadlock | Agent allocation stall >30s | Clear stuck allocation, reassign | Narada | <60s |
| Krishna recovery partial | Heartbeat irregular | Stay in failover, monitor 5min | Vishnu (continue) | N/A |
| Failover cost overage | Failover ops >20% budget | Downgrade to TIER_3 (local ops only) | Kubera | <15s |
| Policy violation during failover | Brahma rejection | Stop operation, escalate to Brahma | Brahma | <30s |
| Multi-creator sync failure | Cross-platform lag >5min | Fallback to single-platform ops | Narada | <60s |
| Agent pool exhaustion | All agents allocated | Queue new tasks (no execution) | Vishnu (queue management) | Manual |
| Failover cascade (3+ simultaneous failures) | Multiple failures detected | ESCALATE to founder immediately | Founder tribunal | Manual |

---

## 9. EXECUTION TIERS (Failover-Degraded Modes)

### Failover Tier Definitions

**FAILOVER_TIER_A (OPERATIONAL)**
- All 12 HA-specific skills active
- Operations-scope routing only (no major strategic decisions)
- Agent pool: 80% maximum utilization
- Cost: 0.7× of TIER_1 (reserved budget)
- Execution modes: local, hybrid (no cloud during failover)
- Use case: Standard failover, expecting Krishna recovery <30min

**FAILOVER_TIER_B (DEGRADED)**
- 8/12 skills active (skip M-188, M-206, M-210 — governance-heavy)
- Local operations only (data ingestion, simple routing)
- Agent pool: 50% maximum utilization
- Cost: 0.4× of TIER_1
- Execution modes: local only
- Use case: Extended Krishna unavailability >30min

**FAILOVER_TIER_C (EMERGENCY)**
- 4/12 skills active (M-003, M-167, M-220, M-215 only)
- Maintenance mode (only critical operations)
- Agent pool: 20% maximum utilization
- Cost: 0.15× of TIER_1
- Execution modes: local only, minimal overhead
- Use case: Total system failure recovery, wait for manual intervention

### Degradation Triggers

```
IF failover_duration >30min OR
   vein_sync_lag >30s OR
   agent_pool >80% utilization:
   
   DEGRADE from FAILOVER_TIER_A → FAILOVER_TIER_B
   RE_PLAN operations on degraded tier
   ALERT founder + councils

IF failover_duration >60min OR
   data_inconsistency_detected OR
   agent_pool_exhaustion:
   
   DEGRADE from FAILOVER_TIER_B → FAILOVER_TIER_C
   HOLD all new operations
   ESCALATE to founder for manual recovery
```

---

## 10. MULTI-CREATOR ISOLATION (Vishnu's Special Responsibility)

### Multi-Creator Safety During Failover

When managing multiple creators' pipelines simultaneously, Vishnu MUST:

1. **MAINTAIN ISOLATION**: Each creator's dossier is separate, no cross-contamination
2. **FAIR_ALLOCATION**: Agent pool allocated fairly (e.g., 50/50 for 2 creators, 33/33/33 for 3, etc.)
3. **PRIORITY_RESPECTING**: Maintain creator priority tier (if creator A is PREMIUM, allocate 60% to them)
4. **ESCALATE_EARLY**: If any creator's operation fails, escalate immediately (don't retry at Vishnu level)

### Multi-Creator Routing During Failover

```
FOR each new request:
  1. IDENTIFY creator_id + priority_tier
  2. LOOK UP creator's current_agent_allocation
  3. CALCULATE fair_share = (total_agents × 0.8) / creator_count
  4. IF creator_allocation <fair_share AND available_agents >0:
       ├─ ALLOCATE agents fairly
       └─ PROCEED with routing
     ELSE:
       ├─ QUEUE operation (don't degrade other creator's share)
       └─ ESCALATE if queue grows >10 items

  5. ROUTE decision to appropriate director
     (same logic as Krishna, but simpler scoring)

  6. TRACK cost per creator (audit trail)
  7. IF any creator's cost exceeds threshold → escalate to founder
```

---

## 11. HITL TRIGGERS (Manual Intervention During Failover)

### When Vishnu Requires Manual Intervention

| Trigger_Type | Condition | Escalation_Path | Required_Action | Time_Limit |
|-------------|-----------|-----------------|-----------------|-----------|
| Failover Duration >30min | Krishna still unavailable | Founder + Kubera | Extend TIER_B duration or manual recovery | 30 min |
| Data Inconsistency Detected | Vein checksum mismatch | Founder + Chitragupta | Audit + data recovery | 60 min |
| Agent Pool Exhaustion | All agents allocated | Founder + Kubera | Emergency resource allocation | 15 min |
| Policy Violation During Failover | Brahma rejection | Founder + Brahma | Policy exception request | 10 min |
| Failover Cascade | ≥3 simultaneous failures | Founder + all councils | System diagnostics + recovery | Manual |
| Multi-Creator Conflict | Unfair allocation complaint | Founder + Narada | Priority adjustment | 20 min |
| Cost Overage in Failover | Failover ops >20% budget | Founder + Kubera | Emergency budget approval | 15 min |

---

## 12. DASHBOARD VISIBILITY & TELEMETRY

### Failover Status Fields
- **Failover Status**: INACTIVE | ACTIVE | RECOVERING | RECOVERED
- **Krishna Unavailability Reason**: (if ACTIVE)
- **Expected Krishna Recovery Time**: ETA
- **Current Failover Tier**: A | B | C
- **Agent Utilization** (during failover): % allocated
- **Failover Duration**: Elapsed time since activation
- **Operations Queued** (waiting for Krishna): Count

### Audit-Only Fields
- **Failover Decision Log**: All routing decisions made by Vishnu
- **Vein Sync Status**: Checksums, lag, consistency issues
- **Cost Tracking**: Failover operations cost vs budget
- **Multi-Creator Allocation**: Fair share per creator
- **Recovery Timeline**: When Vishnu detected Krishna unavailability + actions taken

---

## 13. ACCEPTANCE CRITERIA (DEPLOYMENT GATE)

✅ **READY FOR DEPLOYMENT IF**:
- [ ] Failover activation logic tested (<30s detection latency)
- [ ] All 12 HA-specific skills callable and tested
- [ ] Vein sync checkpoints working (no >5s lag)
- [ ] Agent pool rebalancing tested during failover
- [ ] Krishna recovery tested (graceful reversion)
- [ ] Multi-creator isolation tested (no cross-contamination)
- [ ] Data consistency checks post-failover tested
- [ ] All HITL triggers tested with manual overrides
- [ ] Failover duration >60min scenario tested
- [ ] Cost control during failover verified

---

## 14. RELEASE BLOCKING STATUS

**RELEASE_BLOCKING: TRUE**

Vishnu is critical for Phase-1 stability. Without failover capability:
- System cannot tolerate Krishna unavailability
- Multi-creator operations blocked
- Production cannot continue during Krishna failures

---

## 15. OPERATIONAL NOTES

- **Created**: 2026-04-21 (from PRD v34)
- **Status**: SPECIFICATION COMPLETE — HA layer ready
- **Next Step**: Integrate with Krishna + test failover scenarios
- **Testing Priority**: HIGH (HA is critical path)

