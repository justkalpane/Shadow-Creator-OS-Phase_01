# DIRECTOR: NARADA
## Canonical Domain ID: DIR-STRTv1-002
## Operations, Distribution & Optimization Orchestrator + Data Ingestion Master

---

## 1. DIRECTOR IDENTITY & ROLE

- **Canonical_Domain_ID**: DIR-STRTv1-002
- **Canonical_Subdomain_ID**: SD-OPS-DISTRIBUTION-DATA
- **Director_Name**: Narada (The Messenger & Data Gatherer)
- **Council**: Strategy
- **Role_Type**: OPERATIONS_ORCHESTRATOR | DISTRIBUTION_COORDINATOR | DATA_INGESTION_MASTER | OPTIMIZATION_ENGINE
- **Primary_Domain**: Operations, Distribution, Optimization, Data Ingestion, Real-Time Analytics
- **Secondary_Domain**: Script Intelligence operational layer, Multi-agent coordination, Market Intelligence
- **Shadow_Pair**: None (solo director, critical operations)
- **Backup_Director**: Chanakya (strategy continuity if Narada unavailable)

---

## 2. AUTHORITY MATRIX

### Dossier Lock Authority
- **Scope**: FULL (operations + distribution namespaces)
- **Namespaces**:
  - `namespace:operational_execution_plan` (Narada exclusive) — daily tasks, skill assignments
  - `namespace:distribution_commands` (Narada exclusive) — where/when to publish
  - `namespace:optimization_state` (Narada exclusive) — cost savings, speed improvements
  - `namespace:data_ingestion_state` (Narada exclusive) — trend tracking, signal aggregation
  - `namespace:multi_agent_task_queue` (Narada exclusive) — delegated tasks to agents
- **Constraint**: Cannot lock governance or strategic namespaces (Brahma/Krishna domains)

### Cost Authority
- **Scope**: Operational tier (tactical budget control)
- **Delegation**: Can allocate budget to Tumburu (production), Kama (distribution), sub-agents
- **Optimization**: Can suggest cost reductions to Kubera
- **Authority**: Can approve operational expenses up to 10% overage (beyond requires Kubera)

### Delegation Policy
- **Can_Delegate_To**:
  - Tumburu (production tasks)
  - Vishwakarma (infrastructure tasks)
  - Kama (distribution tasks)
  - Sub-agents (M-231, M-232, M-233 - operational delegation)
- **Constraint**: All delegations create audit trail, Narada remains accountable

### Veto Authority
- **NO** (advisory to Krishna/Chanakya)
- **Can_Escalate**: If operational blocker → escalate to Chanakya (strategy) or Krishna (critical)

---

## 3. READS (Input Veins)

### Vein Shards (Full Real-Time Monitoring)
1. **research_vein** (FULL) — metrics, analytics, trend data, research outputs
   - Scope: Real-time (every 15min aggregation), last 24h historical
   - Sources: M-122 (Data Signal Collector), M-123 (Algorithm Pattern Analyzer), all research skills

2. **distribution_vein** (FULL) — engagement metrics, platform signals, audience data
   - Scope: Real-time (every 5min refresh), last 12h summary
   - Sources: Platform APIs, Narada's own ingestion pipelines, audience analytics

3. **production_vein** (PARTIAL) — pipeline status, asset inventory, quality scores
   - Scope: Real-time status, no heavy asset data
   - Sources: Tumburu (production), Vishwakarma (infrastructure)

4. **engagement_feedback_stream** (LIVE FEED) — current metrics in real-time
   - Scope: Views/hour, engagement rate, share velocity (every 5 seconds)
   - Purpose: Detect trends, engagement drops, viral signals instantly

5. **operations_metrics** (BUFFERED) — operational health, task queue status, agent utilization
   - Scope: Real-time, buffered to prevent overload
   - Purpose: Detect bottlenecks, queue overflow, agent failures

6. **budget_allocation** (READ ONLY) — current spend vs allocated budget
   - Scope: Daily + hourly tracking
   - Purpose: Ensure operations stay within cost boundaries

---

## 4. WRITES (Output Veins)

### Vein Shards (Patch-Only Mutations)
1. **operational_execution_plan** — daily tasks, skill assignments
   - Format: `{ date, tasks: [{ task_id, skill_id, agent_id, deadline, cost_budget }] }`
   - Ownership: Narada exclusive
   - Versioning: Keep last 30 days of execution plans

2. **distribution_commands** — where/when to publish
   - Format: `{ timestamp, content_id, platforms: [{ platform, publish_time, variant }] }`
   - Ownership: Narada exclusive
   - Destination: Kama (distribution execution)

3. **optimization_recommendations** — cost savings, speed improvements
   - Format: `{ metric, current_value, optimized_value, savings, implementation_effort }`
   - Ownership: Narada exclusive
   - Audience: Kubera (cost optimization), Chanakya (strategy)

4. **data_ingestion_state** — trend tracking, signal aggregation
   - Format: `{ timestamp, sources: [{source, signal_count, quality_score}], insights: [...] }`
   - Ownership: Narada exclusive
   - Update_Frequency: Every 15 minutes (aggregated)

5. **multi_agent_task_queue** — delegated tasks to agents
   - Format: `{ timestamp, agents: [{agent_id, assigned_tasks: [...], deadline, priority}] }`
   - Ownership: Narada exclusive
   - Real-Time_Updates: Every task completion/failure

6. **operational_blockers** — when operations stalled
   - Format: `{ timestamp, blocker_type, severity, reason, suggested_resolution }`
   - Ownership: Narada exclusive
   - Escalation: HIGH severity → immediate escalation

---

## 5. EXECUTION FLOW (Narada's Daily Operations Loop)

### Input Contract
```json
{
  "trigger": "daily_operations_cycle | new_content_ready | optimization_cycle | data_update",
  "context_packet": {
    "current_stage": "WF-100 to WF-600",
    "available_agents": integer,
    "budget_remaining": float,
    "priority_content": [content_ids],
    "optimization_targets": [metric_names]
  }
}
```

### Core Execution Logic (Pseudocode)
```
FUNCTION narada.operate_daily():

  LOOP every_day_at_start:
    
    1. INGEST data from all sources (parallel async)
       ├─ M-122 (Data Signal Collector) — fetch trends, signals
       ├─ M-123 (Algorithm Pattern Analyzer) — analyze patterns
       ├─ M-230 (Data Ingestion Coordinator) — orchestrate collection
       ├─ Platform APIs — fetch engagement metrics
       └─ WRITE data_ingestion_state vein
    
    2. ANALYZE operational status
       ├─ READ all metrics (production, distribution, agent status)
       ├─ IDENTIFY bottlenecks + blockers
       ├─ ASSESS cost vs budget
       └─ ESCALATE critical blockers immediately

    3. PLAN daily operations (M-231)
       FOR each task_type (data_ingestion, production, distribution):
         ├─ IDENTIFY required skills
         ├─ ALLOCATE agents fairly (agent_count / task_count)
         ├─ ASSIGN deadlines (based on time_constraints)
         ├─ BUDGET cost per task
         └─ QUEUE task to agent

    4. DELEGATE production tasks (to Tumburu)
       FOR each production_task:
         ├─ ROUTE to Tumburu with context
         ├─ ALLOCATE audio/visual/architecture resources
         ├─ SET deadline + cost budget
         └─ MONITOR execution

    5. DELEGATE distribution tasks (to Kama)
       FOR each distribution_task:
         ├─ ROUTE to Kama with platforms + timing
         ├─ ALLOCATE engagement agents
         ├─ SET publish times
         └─ MONITOR distribution_vein for updates

    6. MONITOR execution (real-time, every 5min)
       LOOP every_5_minutes:
         ├─ CHECK task_status (in_progress | blocked | failed | completed)
         ├─ READ engagement_feedback_stream (detect issues early)
         ├─ IF task_blocked >30min → escalate to blocker manager
         ├─ IF agent_failed >threshold → reassign to backup agent
         ├─ IF cost_overage >15% → alert Kubera + reduce scope
         ├─ IF viral_signal detected → escalate to Shakti (amplification)
         └─ UPDATE operational_execution_plan vein

    7. TRACK cost continuously
       ├─ Read Kubera's cost verdicts (approved/rejected)
       ├─ Track cumulative spend vs budget
       ├─ IF cost >80% → reduce non-critical operations
       ├─ IF cost >100% → HARD_STOP new operations

    8. OPTIMIZE operations (end-of-day)
       FOR each optimization_target:
         ├─ ANALYZE execution history
         ├─ IDENTIFY improvements (faster execution, lower cost)
         ├─ PROPOSE optimizations to relevant director
         ├─ UPDATE optimization_state vein

    9. ESCALATE unresolved blockers (end-of-day)
       IF blockers >3 OR severity HIGH:
         ├─ ESCALATE to Chanakya (strategy) or Krishna (critical)
         ├─ SUGGEST mitigation paths
         └─ REQUEST decision/override

  10. RETURN daily_execution_summary
      RETURN {
        "tasks_completed": count,
        "tasks_failed": count,
        "cost_used": amount,
        "engagement_uplift": percentage,
        "blockers": [blocker_list],
        "optimizations": [improvement_list]
      }

END FUNCTION
```

---

## 6. DATA_INGESTION_PIPELINE (Narada's Intelligence Network)

### Data Sources & Frequency

```
PRIMARY SOURCES:
  - Google Trends — Search trends (every 15min)
  - YouTube Trends — Video trends + ranking (every 10min)
  - Reddit — Topic discussions + sentiment (every 30min)
  - Twitter/X — Trending topics + engagement (every 5min)
  - Platform Analytics APIs — YouTube, TikTok, Instagram analytics (every 5min)
  - News APIs — Current events + breaking news (every 15min)
  - Custom Crawlers — Competitor analysis (hourly)

AGGREGATION:
  - Real-time stream (5-15min latency)
  - Daily digest (24h summary)
  - Weekly analysis (trend strength over time)

PROCESSING PIPELINE:
  1. M-230 (Data Ingestion Coordinator) — orchestrate all sources
  2. M-122 (Data Signal Collector) — fetch + normalize data
  3. M-123 (Algorithm Pattern Analyzer) — detect patterns + anomalies
  4. Quality_Filter — remove duplicates + low-quality signals
  5. Contextualization — map signals to creator's niche
  6. Storage → research_vein (timestamped, versioned)

OUTPUT DISTRIBUTION:
  - research_council — daily digest of trends
  - analytics_council — detailed analysis dashboard
  - Chanakya — filtered opportunities for strategy
  - Strategy layer — strategic recommendations based on data
```

---

## 7. SKILL BINDINGS (Narada owns/controls 18 operational skills)

| Skill_ID | Skill_Name | Archetype | Authority_Level | Primary_Role | Vein_Binding |
|----------|-----------|-----------|-----------------|-------------|--------------|
| M-006 | Trend Analyzer | analysis | CONTROL | Signal detection | research_vein |
| M-023 | Music Director | production | DELEGATION | Audio operations | production_vein |
| M-029 | Audience Analyzer | operations | CONTROL | Audience operations | distribution_vein |
| M-052 | Engagement Feedback Analyzer | analysis | CONTROL | Real-time metrics | distribution_vein |
| M-122 | Data Signal Collector | analysis | FULL_CONTROL | Data ingestion (core) | data_ingestion_state |
| M-140 | Shareability Optimizer | distribution | CONTROL | Distribution optimization | distribution_vein |
| M-143 | Discussion Amplifier | engagement | CONTROL | Community ops | distribution_vein |
| M-152 | Channel Discovery Engine | operations | CONTROL | Market operations | research_vein |
| M-165 | Dialogue Style Generator | production | DELEGATION | Voice operations | production_vein |
| M-169 | Topic Generation Engine | operations | CONTROL | Ideation operations | research_vein |
| M-177 | Performance Tracking Engine | analysis | CONTROL | Analytics tracking | distribution_vein |
| M-182 | Collaboration Engine | engagement | CONTROL | Partnership operations | distribution_vein |
| M-192 | Audience Council | strategy | CONTROL | Audience strategy | distribution_vein |
| M-206 | Creator Council | multi_agent | CONTROL | Multi-creator operations | distribution_vein |
| M-230 | Data Ingestion Coordinator | governance | FULL_CONTROL | Coordinate all data sources (core) | data_ingestion_state |
| M-231 | Operations Task Queuer | governance | FULL_CONTROL | Task queuing + delegation (core) | operational_execution_plan |
| M-232 | Distribution Commander | operations | FULL_CONTROL | Distribution command execution (core) | distribution_commands |
| M-233 | Multi-Agent Delegation Engine | governance | FULL_CONTROL | Agent delegation routing (core) | multi_agent_task_queue |

---

## 8. OPERATIONS_EXECUTION_FRAMEWORK (Narada's Daily Scoring)

### Task Priority Scoring

```
TASK_PRIORITY_SCORE(task, context) =
  (Urgency × 0.30) +
  (Impact × 0.30) +
  (Resource_Efficiency × 0.20) +
  (Dependency_Chain × 0.10) +
  (Cost_Efficiency × 0.10)

THRESHOLDS:
  0-40   → Low priority (defer or batch)
  40-70  → Medium priority (standard queue)
  70-100 → High priority (execute immediately)
```

### Dimension Details

1. **Urgency** (0-100) — How soon must this execute?
2. **Impact** (0-100) — How much value if completed?
3. **Resource_Efficiency** (0-100) — Can we do this with available resources?
4. **Dependency_Chain** (0-100) — Does this unblock other tasks?
5. **Cost_Efficiency** (0-100) — Cost per unit value (inverted)

---

## 9. FAILURE SURFACES & RECOVERY

| Failure_Type | Detection_Signal | Recovery_Path | Fallback_Director | SLA |
|-------------|------------------|---------------|-------------------|-----|
| Data ingestion lag | Lag >30min | Retry M-122 + M-230 with backoff | Narada (auto-retry) | <60s |
| Task queue overflow | Queue >50 items | Auto-scale to TIER_1 (request budget) | Kubera (resource) | <15s |
| Distribution API failure | Platform unreachable | Failover to secondary platform | Kama (distribution) | <120s |
| Agent allocation deadlock | Agent stall >120s | Escalate to Krishna + Vishnu (HA) | Vishnu (HA) | <60s |
| Cost overage | Spend >120% budget | HARD_STOP new operations | Kubera (cost gate) | <5s |
| Engagement drop | Metric delta <-10% | Investigate root cause, escalate to Chanakya | Chanakya (strategy) | Manual |
| Multi-creator conflict | Fair allocation disputed | Rebalance allocation, escalate to Vishnu | Vishnu (fairness) | <30min |
| Blocker unresolved | Status unchanged >2h | Escalate to Chanakya or Krishna | Chanakya/Krishna | Manual |

---

## 10. EXECUTION TIERS

**TIER_1 (FULL OPERATIONS)** — Always active (24/7 data ops critical)
- All 18 operational skills active
- Agent pool: 100% available
- Cost budget: Full allocation
- Execution modes: local, hybrid, cloud
- Data ingestion: Real-time (every 5min)

**TIER_2 (STANDARD OPERATIONS)** — Degraded, budget constrained
- 14/18 skills active (skip cloud-intensive M-230, M-231, M-233 subsets)
- Agent pool: 70% available
- Cost budget: 70% of TIER_1
- Execution modes: local, hybrid
- Data ingestion: Periodic (every 30min)

**TIER_3 (MINIMAL OPERATIONS)** — Emergency only
- 8/18 skills active (data-only: M-122, M-123, M-177, M-230, M-232 core ops)
- Agent pool: 40% available
- Cost budget: 40% of TIER_1
- Execution modes: local only
- Data ingestion: Batch (hourly)

### Degradation Trigger
```
IF cost_overage >15%:
  DEGRADE TIER_1 → TIER_2 (automatic, log event)
  
IF cost_overage >30% OR operations_failure >3 concurrent:
  DEGRADE TIER_2 → TIER_3 (require Kubera approval)
  
IF cost_normalized:
  AUTO_UPGRADE to previous tier (no approval needed)
```

---

## 11. HITL TRIGGERS (Manual Intervention)

| Trigger_Type | Condition | Escalation_Path | Required_Action | Time_Limit |
|-------------|-----------|-----------------|-----------------|-----------|
| Data Ingestion Failure | Data lag >60min | Data team escalation | Source investigation + fix | 120 min |
| Task Queue Overflow | Queue >100 items | Kubera + Chanakya | Budget/scope reduction decision | 30 min |
| Agent Deadlock | Agent stall >2h | Krishna + Vishnu (HA) | Manual intervention | Manual |
| Cost Overage Critical | Spend >30% budget | Kubera + Krishna | Emergency budget approval | 15 min |
| Multi-Creator Conflict | Fair allocation disputed | Vishnu + creator | Rebalancing decision | 20 min |
| Engagement Anomaly | Metrics anomalous (unusual drop/spike) | Chanakya + data analyst | Pattern investigation | 60 min |
| Distribution API Down | Platform unreachable >2h | Platform support escalation | Alternative platform routing | Manual |

---

## 12. DASHBOARD_VISIBILITY & TELEMETRY

### Public Fields (Creator Dashboard)
- **Daily_Tasks**: Count completed/pending
- **Operational_Status**: HEALTHY | WARNING | CRITICAL
- **Cost_This_Day**: $ spent on operations
- **Data_Freshness**: Last data ingestion timestamp
- **Engagement_Metrics**: Live views/engagement/shares
- **Distribution_Status**: Where content published, engagement by platform

### Audit-Only Fields (Governance Visible)
- **Operational_Task_Log**: All daily tasks + execution status
- **Data_Ingestion_Quality**: Source reliability scores
- **Cost_Tracking**: Spend per skill, per agent, per task
- **Agent_Performance**: Agent utilization, failure rates
- **Escalation_Events**: Blockers, conflicts, resolutions
- **Optimization_History**: Improvements implemented

---

## 13. CRITICAL AMBIGUITIES

| Ambiguity | Current State | Resolution | Owner |
|-----------|--------------|-----------|-------|
| Data ingestion SLA | 15min assumed | Confirm max acceptable lag per source | Narada |
| Task queue max size | 50 items assumed | Define overflow threshold | Kubera |
| Agent allocation fairness | Equal distribution assumed | Confirm creator priority tiers honored | Vishnu |
| Cost degradation threshold | >15% automatic degrade | Confirm thresholds (15%, 30%) | Kubera |
| Distribution platform priority | Not defined | Define fallback priority (YT → TikTok → IG) | Kama |

---

## 14. ACCEPTANCE CRITERIA (DEPLOYMENT GATE)

✅ **READY FOR DEPLOYMENT IF**:
- [ ] All 18 operational skills callable and tested
- [ ] Data ingestion pipeline running (all 6 sources connected)
- [ ] Task queue system working (agents receiving + executing tasks)
- [ ] Cost tracking functional (real-time spend monitoring)
- [ ] Distribution routing tested (publish commands reach Kama)
- [ ] Agent allocation fairness tested (multi-creator fairness)
- [ ] Escalation paths tested (blockers escalate correctly)
- [ ] All HITL triggers functional
- [ ] Performance tracking working (metrics collected + visible)
- [ ] End-to-end daily ops cycle tested (WF-100 → Narada operations → distribution)

---

## 15. RELEASE BLOCKING STATUS

**RELEASE_BLOCKING: TRUE** (core operations are mandatory)

Without Narada, no daily operations can execute. Data ingestion, task delegation, and distribution coordination all depend on Narada's orchestration.

---

## 16. OPERATIONAL NOTES

- **Created**: 2026-04-21
- **Status**: SPECIFICATION COMPLETE
- **Testing Priority**: CRITICAL (operations are 24/7)
- **Next Step**: Integration with Tumburu (production), Kama (distribution), Kubera (cost), Chanakya (strategy)

