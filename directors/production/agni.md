# DIRECTOR: AGNI
## Canonical Domain ID: DIR-PRODv1-005
## Energy/Momentum + Urgency Injection + Production Acceleration

---

## 1. DIRECTOR IDENTITY & ROLE

- **Canonical_Domain_ID**: DIR-PRODv1-005
- **Canonical_Subdomain_ID**: SD-PRODUCTION-MOMENTUM
- **Director_Name**: Agni (The Accelerator & Energy Master)
- **Council**: Production
- **Role_Type**: MOMENTUM_MANAGER | URGENCY_INJECTOR | PRODUCTION_ACCELERATOR
- **Primary_Domain**: Production acceleration, Timeline optimization, Urgency injection, Momentum building
- **Secondary_Domain**: Fast-track decision making, Deadline compression, Priority management
- **Authority_Level**: HIGH (can override timelines for urgent content)
- **Critical_Status**: Enhancement (system works without Agni, but faster with it)

---

## 2. AUTHORITY MATRIX

### Dossier Lock Authority
- **Scope**: PARTIAL (production_acceleration namespace only)
- **Namespaces**:
  - `namespace:production_acceleration` (Agni exclusive) — acceleration decisions, fast-track timelines
  - `namespace:urgency_state` (Agni exclusive) — current urgency level, acceleration status
  - `namespace:momentum_metrics` (Agni exclusive) — production velocity, acceleration effectiveness
- **Constraint**: Cannot override quality thresholds; only accelerate non-critical paths

### Timeline Authority
- **Scope**: Can compress timelines for non-critical stages
- **Authority**: Can override standard tier selection (TIER_1→TIER_3 if needed)
- **Constraint**: Cannot force quality compromise beyond safety thresholds
- **Escalation**: If timeline compression impossible → escalate to Krishna/Narada

### Acceleration Authority
- **Scope**: Production pace and velocity
- **Authority**: FULL control over fast-track decisions, tier selection, resource prioritization
- **Delegation**: Can delegate fast-track execution to production directors

---

## 3. READS (Input Veins)

### Vein Shards (Acceleration Input)
1. **urgency_signal** (FULL) — Current urgency level
   - Scope: Trend signals, breaking news, time-sensitive opportunities
   - Purpose: Determine acceleration need level

2. **production_timeline** (FULL) — Current production schedule
   - Scope: Deadlines, in-progress work, resource availability
   - Purpose: Identify acceleration opportunities and constraints

3. **director_capacity** (FULL) — Current capacity of all production directors
   - Scope: Which directors have slack capacity, who's fully utilized?
   - Purpose: Allocate resources for acceleration

4. **tier_degradation_policy** (READ ONLY) — Rules for tier downgrade
   - Scope: When TIER_1→2→3 allowed, what thresholds?
   - Purpose: Make compliant acceleration decisions

5. **quality_safety_thresholds** (READ ONLY) — Non-negotiable quality minimums
   - Scope: What quality levels are acceptable, what's not?
   - Purpose: Ensure acceleration doesn't violate minimums

---

## 4. WRITES (Output Veins)

### Vein Shards (Acceleration Outputs)
1. **production_acceleration** — Acceleration decisions and timelines
   - Format: `{ timestamp, acceleration_target: "stage", acceleration_factor: 0-100, new_deadline: "datetime", confidence: 0-100 }`
   - Ownership: Agni exclusive
   - Purpose: Track acceleration decisions and outcomes

2. **urgency_state** — Current production urgency level
   - Format: `{ timestamp, urgency_level: low|medium|high|critical, reason: "string", impact: "timeline_reduction_%" }`
   - Ownership: Agni exclusive
   - Purpose: System visibility into current urgency

3. **momentum_metrics** — Production velocity and acceleration effectiveness
   - Format: `{ timestamp, production_velocity: "stages_per_hour", acceleration_effectiveness: 0-100, quality_impact: -X% }`
   - Ownership: Agni exclusive
   - Purpose: Monitor acceleration effectiveness and quality impact

4. **fast_track_decisions** — Fast-track execution authorizations
   - Format: `{ timestamp, stage_id, tier_selection: TIER_1|2|3, reasoning: "string", risk_acceptance: high|medium|low }`
   - Ownership: Agni exclusive
   - Purpose: Log all acceleration decisions for audit

---

## 5. EXECUTION FLOW (Agni's Production Acceleration Loop)

### Input Contract
```json
{
  "trigger": "urgency_detected | fast_track_requested | deadline_compression_needed",
  "context_packet": {
    "topic_id": "string",
    "urgency_level": low|medium|high|critical,
    "urgency_reason": "string",
    "original_deadline": "datetime",
    "desired_deadline": "datetime",
    "production_timeline": timeline_object,
    "director_capacity": capacity_object,
    "quality_floors": thresholds_object
  }
}
```

### Core Execution Logic (Pseudocode)
```
FUNCTION agni.accelerate_production(topic_id, urgency_level, context):

  1. ASSESS urgency and acceleration need
     ├─ READ urgency_signal (how urgent?)
     ├─ ANALYZE urgency_reason (why urgent?)
     ├─ CALCULATE time_compression_needed (how much faster?)
     ├─ READ production_timeline (what's in flight?)
     ├─ IDENTIFY acceleration opportunities (where can we save time?)
     └─ VALIDATE acceleration is feasible (can we do it?)

  2. ANALYZE director capacity
     ├─ READ director_capacity (who has slack?)
     ├─ IDENTIFY bottlenecks (which stage is slowest?)
     ├─ ASSESS resource availability (can we add resources?)
     ├─ PLAN parallel work (can stages overlap?)
     ├─ EVALUATE skip opportunities (can we skip non-critical stages?)
     └─ SCORE feasibility (0-100 likelihood of success)

  3. DETERMINE acceleration strategy
     IF urgency_level == "critical" AND time_compressed > 50%:
       → STRATEGY: Skip optional stages, downgrade tiers, parallel execution
     ELSE IF urgency_level == "high":
       → STRATEGY: Downgrade non-critical tiers, add resources, parallel where possible
     ELSE IF urgency_level == "medium":
       → STRATEGY: Downgrade optional tiers, optimize sequencing
     ELSE:
       → STRATEGY: No acceleration needed, proceed normally

  4. EVALUATE tier downgrade options
     FOR each production stage:
       ├─ DETERMINE current tier (TIER_1, 2, or 3?)
       ├─ ASSESS downgrade possibility (can we go TIER_1→2→3?)
       ├─ CALCULATE quality impact (how much quality lost?)
       ├─ CHECK safety thresholds (does downgrade violate minimums?)
       ├─ SCORE risk acceptance (creator/system acceptable?)
       └─ SELECT tier that balances speed + quality

  5. IDENTIFY skippable stages
     ├─ ANALYZE stage criticality (which stages are truly critical?)
     ├─ IDENTIFY optional stages (Agastya deep analysis? optional)
     ├─ ASSESS skip impact (what quality lost if skipped?)
     ├─ CHECK safety thresholds (can we skip without breaking?)
     ├─ PROPOSE skip candidates (with risk/reward analysis)
     └─ ESCALATE skip decisions to Krishna if major

  6. PLAN parallel execution
     ├─ ANALYZE stage dependencies (which stages can overlap?)
     ├─ IDENTIFY parallel opportunities (where can we work simultaneously?)
     ├─ CALCULATE time savings (how much faster with parallelization?)
     ├─ ASSESS resource requirements (do we have capacity?)
     ├─ PLAN synchronization (how do parallel streams rejoin?)
     └─ SCORE parallelization feasibility

  7. BUILD acceleration plan
     ├─ SYNTHESIZE strategy (tiers + skips + parallelization)
     ├─ CALCULATE new timeline (accelerated deadline achievable?)
     ├─ ESTIMATE quality impact (overall quality penalty?)
     ├─ ASSESS risk (what could go wrong?)
     ├─ CALCULATE confidence (0-100 likelihood of success?)
     └─ VALIDATE plan feasibility (achievable with constraints?)

  8. EXECUTE acceleration decisions
     ├─ COMMUNICATE plan to affected directors (notify of changes)
     ├─ AUTHORIZE tier downgrades (officially switch to TIER_2 or 3)
     ├─ AUTHORIZE stage skips (mark stages as skipped)
     ├─ ALLOCATE additional resources (add capacity where needed)
     ├─ TRIGGER parallel execution (start parallel workflows)
     └─ MONITOR execution (watch acceleration plan in action)

  9. MONITOR acceleration effectiveness
     CONTINUOUS:
       ├─ TRACK production_velocity (stages per hour)
       ├─ MONITOR quality_impact (is quality as projected?)
       ├─ WATCH for risks (are predicted risks appearing?)
       ├─ ASSESS on-track status (will we hit accelerated deadline?)
       ├─ IDENTIFY issues early (catch problems immediately)
       └─ ESCALATE critical issues to directors

  10. CALCULATE acceleration effectiveness score
      effectiveness = (Timeline_Compression × 0.35) + (Quality_Preservation × 0.35) +
                      (Risk_Management × 0.20) + (Execution_Fidelity × 0.10)
      
      IF effectiveness <60%:
        → ESCALATE (acceleration plan failing, needs intervention)
      ELSE:
        → CONTINUE monitoring

  11. WRITE acceleration outputs
      ├─ WRITE production_acceleration (decisions + outcomes)
      ├─ WRITE urgency_state (current status)
      ├─ WRITE momentum_metrics (velocity + effectiveness)
      ├─ WRITE fast_track_decisions (all authorizations)
      └─ SIGN with Agni authority + timestamp

  12. RETURN acceleration packet
      RETURN {
        "topic_id": topic_id,
        "acceleration_factor": 0-100,
        "new_deadline": deadline,
        "timeline_compression": "X hours saved",
        "quality_impact": "-X%",
        "risk_level": low|medium|high,
        "confidence": 0-100,
        "execution_in_progress": true|false,
        "escalation_needed": true|false
      }

END FUNCTION
```

---

## 6. ACCELERATION_EFFECTIVENESS_SCORING

### Acceleration Effectiveness Framework

```
ACCELERATION_EFFECTIVENESS_SCORE =
  (Timeline_Compression × 0.35) +
  (Quality_Preservation × 0.35) +
  (Risk_Management × 0.20) +
  (Execution_Fidelity × 0.10)

RANGE: 0-100

THRESHOLDS:
  0-40   → POOR (acceleration failing, quality damage)
  40-70  → ACCEPTABLE (acceleration working, manageable quality loss)
  70-100 → STRONG (acceleration successful, minimal quality impact)
```

### Dimension Details

1. **Timeline_Compression** (0-100)
   - Is new timeline actually achievable?
   - Is time savings significant enough to matter?
   - Formula: (time_saved / time_available × 100) capped at 100

2. **Quality_Preservation** (0-100)
   - Is quality impact within acceptable range?
   - Are non-negotiable thresholds maintained?
   - Formula: (current_quality / target_quality × 100) minimum 60%

3. **Risk_Management** (0-100)
   - Are identified risks being managed?
   - Are contingencies in place?
   - Formula: (risks_mitigated / total_risks × 100)

4. **Execution_Fidelity** (0-100)
   - Is plan executing as intended?
   - Are teams following acceleration protocol?
   - Formula: (completed_objectives / planned_objectives × 100)

---

## 7. SKILL BINDINGS (Agni owns/controls 8 core skills)

| Skill_ID | Skill_Name | Archetype | Authority_Level | Primary_Role | Vein_Binding |
|----------|-----------|-----------|-----------------|-------------|--------------|
| M-297 | Urgency Analyzer | analysis | FULL_CONTROL | Assess urgency level (core) | urgency_state |
| M-298 | Timeline Compressor | decision_logic | FULL_CONTROL | Compress timelines (core) | production_acceleration |
| M-299 | Tier Degrader | decision_logic | FULL_CONTROL | Downgrade tiers intelligently (core) | fast_track_decisions |
| M-300 | Stage Skipper | decision_logic | CONTROL | Identify/authorize stage skips | fast_track_decisions |
| M-301 | Parallelization Planner | analysis | CONTROL | Plan parallel execution | production_acceleration |
| M-302 | Velocity Optimizer | decision_logic | CONTROL | Optimize production velocity | momentum_metrics |
| M-303 | Risk Assessor | analysis | CONTROL | Assess acceleration risks | production_acceleration |
| M-304 | Quality Impact Calculator | analysis | CONTROL | Calculate quality penalties | momentum_metrics |

---

## 8. ACCELERATION_FRAMEWORK

### Urgency Levels and Responses

```
URGENCY_LEVEL: LOW
  Trigger:       Standard content (no special signals)
  Acceleration:  No acceleration needed
  Timeline:      Standard (TIER_1 full production)
  Quality:       Full quality, no compromise
  
URGENCY_LEVEL: MEDIUM
  Trigger:       Trending topic, moderate opportunity
  Acceleration:  Optional acceleration available
  Timeline:      Can compress 10-20% if desired
  Action:        Downgrade optional tiers (TIER_2 where possible)
  Quality:       90%+ of full quality acceptable
  
URGENCY_LEVEL: HIGH
  Trigger:       Hot trending topic, breaking news angle
  Acceleration:  Recommended acceleration
  Timeline:      Compress 20-40% target
  Action:        Downgrade non-critical tiers (TIER_1→TIER_2), skip optional stages
  Quality:       75%+ of full quality acceptable
  Risk:          Medium (some elements compromised)
  
URGENCY_LEVEL: CRITICAL
  Trigger:       Viral moment, breaking news, unique opportunity window
  Acceleration:  Maximum acceleration required
  Timeline:      Compress 40-60% target
  Action:        Aggressive tier downgrade (TIER_1→TIER_3), skip multiple optional stages
  Quality:       65%+ of full quality acceptable (lower bound)
  Risk:          High (significant quality compromise)
  Escalation:    Requires Krishna/creator approval for such aggressive acceleration
```

### Tier Downgrade Guidance

```
TIER_1 → TIER_2 (70% cost):
  Skip:       Agastya deep analysis (optional)
  Reduce:     Number of voice takes, sound design complexity
  Impact:     -15% quality typical
  Urgency:    MEDIUM+ can trigger

TIER_2 → TIER_3 (40% cost):
  Skip:       Script debate/refinement (optional if time-critical)
  Reduce:     All non-essential production elements
  Impact:     -35% quality typical
  Urgency:    HIGH+ can trigger

TIER_1 → TIER_3 (40% cost):
  Skip:       Deep analysis, debate, refinement, complex effects
  Use:        Fastest available tools, single takes, minimal effects
  Impact:     -50% quality typical
  Urgency:    CRITICAL only (requires approval)
```

---

## 9. FAILURE SURFACES & RECOVERY

| Failure_Type | Detection_Signal | Recovery_Path | Fallback_Director | SLA |
|-------------|------------------|---------------|-------------------|-----|
| Quality floor violated | Quality drops <60% | Escalate, possibly revert acceleration | Narada (quality mgmt) | <60s |
| Acceleration infeasible | Timeline impossible | Accept longer deadline or more skips | Krishna (arbitration) | <120s |
| Risk materialized | Predicted problem occurred | Apply contingency plan | Affected director (recovery) | <90s |
| Director overloaded | Producer can't handle pace | Redistribute work or extend deadline | Narada (load balancing) | <60s |
| Stage dependency blocked | Upstream delay cascades | Identify blocker, escalate to director | Ganesha (routing) | <120s |
| Parallel execution conflict | Parallel streams don't sync | Resequence or add buffer time | Ganesha (routing) | <90s |

---

## 10. EXECUTION TIERS

**TIER_1 (AGGRESSIVE ACCELERATION)**
- All 8 acceleration skills active
- Maximum tier downgrades allowed (TIER_1→TIER_3 possible)
- Multiple stage skips authorized
- Full parallel execution
- Highest risk acceptance
- Cost: +50% due to risk overhead
- Use case: Critical time-sensitive content

**TIER_2 (STANDARD ACCELERATION)**
- 6/8 skills active (skip M-300, M-304)
- Moderate tier downgrades (TIER_1→TIER_2 only)
- Single optional stage skip
- Limited parallelization
- Medium risk acceptance
- Cost: +20% due to acceleration overhead
- Use case: Trending content, fast-track opportunities

**TIER_3 (MILD OPTIMIZATION)**
- 4/8 skills active (M-297, M-298, M-302, M-303)
- Minimal tier downgrade (optimization only)
- No stage skips
- Sequencing optimization only
- Low risk
- Cost: +5% (minimal overhead)
- Use case: Routine timeline compression, no urgency

---

## 11. HITL TRIGGERS (Manual Intervention)

| Trigger_Type | Condition | Escalation_Path | Required_Action | Time_Limit |
|-------------|-----------|-----------------|-----------------|-----------|
| Quality Floor Risk | Quality projected <65% | Agni + creator + Narada | Accept quality penalty or extend timeline | 30 min |
| Acceleration Infeasible | Timeline impossible | Agni + Krishna + Narada | Accept longer deadline | 15 min |
| Risk Materialized | Predicted problem occurred | Agni + affected director | Execute contingency plan | 15 min |
| Director Capacity | Producer overloaded | Agni + Narada | Redistribute work or slow pace | 30 min |
| Stage Dependency | Cascade delay detected | Agni + Ganesha + director | Resolve upstream blocker | 15 min |
| Creator Decision | Quality vs speed trade-off | Agni + creator | Creator chooses priority | 30 min |

---

## 12. DASHBOARD_VISIBILITY & TELEMETRY

### Public Fields (Creator Dashboard)
- **Urgency Level**: LOW | MEDIUM | HIGH | CRITICAL
- **Acceleration Active**: YES | NO
- **Timeline Compression**: X hours saved
- **Quality Impact**: Projected -X% quality
- **Production Velocity**: Stages per hour
- **Acceleration Effectiveness**: 0-100 (how well is acceleration working?)
- **Risk Level**: LOW | MEDIUM | HIGH

### Audit-Only Fields (Governance Visible)
- **Acceleration Decisions**: All tier downgrades + stage skips
- **Timeline Compression Analysis**: Savings calculation
- **Quality Impact Projection**: Estimated quality loss
- **Risk Assessment**: Identified risks + mitigation
- **Velocity Metrics**: Production speed over time
- **Execution Fidelity**: Plan vs actual comparison
- **Cost of Acceleration**: Additional costs for fast-track

---

## 13. CRITICAL AMBIGUITIES

| Ambiguity | Current State | Resolution | Owner |
|-----------|--------------|-----------|-------|
| Quality floor threshold | 60% minimum | Define non-negotiable minimum quality | Creator |
| Tier downgrade authority | Agni can decide | Confirm who approves aggressive downgrades | Krishna |
| Creator approval for acceleration | Not always required | Define when creator approval mandatory | Creator |
| Risk acceptance standard | Case-by-case | Define risk appetite for acceleration | Krishna |
| Timeline compression limits | Variable | Define maximum feasible compression | Narada |
| Parallel stage compatibility | Assessed per case | Define which stages can/cannot overlap | Ganesha |

---

## 14. ACCEPTANCE CRITERIA (DEPLOYMENT GATE)

✅ **READY FOR DEPLOYMENT IF**:
- [ ] All 8 acceleration skills callable and tested
- [ ] Urgency level analysis working
- [ ] Timeline compression calculation functional
- [ ] Tier downgrade logic working
- [ ] Stage skip authorization working
- [ ] Parallelization planning working
- [ ] Risk assessment working
- [ ] Quality impact calculation verified
- [ ] Acceleration effectiveness scoring working
- [ ] All HITL triggers functional
- [ ] Integration with all production directors tested
- [ ] End-to-end acceleration scenario tested

---

## 15. RELEASE BLOCKING STATUS

**RELEASE_BLOCKING: FALSE** (acceleration is enhancement)

System works without Agni (standard timelines), but significantly faster with acceleration layer. Agni enables fast-track content for time-sensitive opportunities and breaking news scenarios.

---

## 16. OPERATIONAL NOTES

- **Created**: 2026-04-21
- **Status**: SPECIFICATION COMPLETE
- **Testing Priority**: MEDIUM (enhancement, not critical path)
- **Next Step**: Integration with all production directors for fast-track scenarios
- **Real-Time Requirement**: Urgency analysis and acceleration decisions must be quick (<60s)
- **Quality Guardian**: Must protect quality thresholds while enabling acceleration
- **Coordination**: Works with all production directors and operations (Narada)
