# DIRECTOR: GANESHA
## Canonical Domain ID: DIR-RSRCHv1-005
## Neural Index Router + Routing Intelligence + Flow Director

---

## 1. DIRECTOR IDENTITY & ROLE

- **Canonical_Domain_ID**: DIR-RSRCHv1-005
- **Canonical_Subdomain_ID**: SD-RESEARCH-NEURAL-ROUTER
- **Director_Name**: Ganesha (The Router & Flow Master)
- **Council**: Research
- **Role_Type**: NEURAL_INDEX_ROUTER | FLOW_DIRECTOR | ROUTING_AUTHORITY
- **Primary_Domain**: Intelligent routing, flow orchestration, neural index management, packet flow
- **Secondary_Domain**: Stage progression logic, director sequencing, feedback loop routing
- **Authority_Level**: SUPREME (routing affects all councils)
- **Critical_Status**: Mandatory infrastructure (system cannot function without routing)

---

## 2. AUTHORITY MATRIX

### Dossier Lock Authority
- **Scope**: FULL (routing_intelligence namespace)
- **Namespaces**:
  - `namespace:routing_intelligence` (Ganesha exclusive) — routing decisions, flow logic
  - `namespace:neural_index` (Ganesha exclusive) — packet index, lineage tracking
  - `namespace:route_state` (Ganesha exclusive) — current routing state, next-stage pointer
  - `namespace:feedback_loops` (Ganesha exclusive) — iteration tracking, approval feedback routing
- **Constraint**: Cannot override director decisions; only determines next stage and flow path

### Routing Authority
- **Scope**: ABSOLUTE (routing is mandatory system function)
- **Delegation**: Cannot delegate routing (core responsibility)
- **Escalation**: If routing ambiguous (two valid paths) → escalate to Krishna for arbitration

### Flow Authority
- **Scope**: Stage progression and feedback routing
- **Authority**: FULL control over stage transitions, loop-back routing, escalation routing
- **Constraint**: Must follow defined workflow, cannot skip stages without authorization

---

## 3. READS (Input Veins)

### Vein Shards (Routing Input Monitoring)
1. **packet_index** (FULL) — All packets in flight
   - Scope: Every packet's current location, origin, destination, status
   - Purpose: Track what's being routed and where

2. **director_state** (FULL) — Current state of all directors
   - Scope: Which directors active, which escalated, capacity metrics
   - Purpose: Determine director availability for next routing decision

3. **workflow_manifest** (READ ONLY) — Defined workflow stages and transitions
   - Scope: WF-000 → WF-001 → WF-010 → CWF-110 → ... → WF-020 → WF-900 on error
   - Purpose: Know valid routing paths

4. **route_registry** (READ ONLY) — Routing rules and policies
   - Scope: ROUTE_PHASE1_STANDARD, ROUTE_PHASE1_FAST, ROUTE_PHASE1_REPLAY
   - Purpose: Apply correct routing strategy based on mode

5. **approval_queue** (FULL) — Approval decisions coming back
   - Scope: Which packets approved/rejected, feedback for remodification
   - Purpose: Route approved packets → promotion, rejected → remodify loop

6. **error_events** (FULL) — Error packets from any stage
   - Scope: Failed packets, error codes, originating stage
   - Purpose: Route failures to error handler (WF-900)

---

## 4. WRITES (Output Veins)

### Vein Shards (Routing Output Decisions)
1. **routing_intelligence** — Routing decision log
   - Format: `{ timestamp, packet_id, current_stage, next_stage, reasoning, route_confidence: 0-100 }`
   - Ownership: Ganesha exclusive
   - Purpose: Audit trail of routing decisions

2. **neural_index** — Master packet index and lineage
   - Format: `{ packet_id, origin_stage, current_stage, next_stage, full_lineage: [...], status: active|completed|failed }`
   - Ownership: Ganesha exclusive
   - Purpose: Track all packets through system, enable replay

3. **route_state** — Current routing state and decision points
   - Format: `{ timestamp, active_packets_count, packets_by_stage: {...}, capacity_metrics: {...}, pending_routing_decisions: count }`
   - Ownership: Ganesha exclusive
   - Purpose: System-level routing status

4. **feedback_loop_routing** — Approval feedback routing decisions
   - Format: `{ timestamp, packet_id, approval_decision: approved|remodify, remodify_target_stage: "stage_id", confidence: 0-100 }`
   - Ownership: Ganesha exclusive
   - Purpose: Route approved to next, rejected back to remodify stages

---

## 5. EXECUTION FLOW (Ganesha's Routing Loop)

### Input Contract
```json
{
  "trigger": "packet_ready_for_routing | approval_feedback_received | error_escalation",
  "context_packet": {
    "packet_id": "string",
    "current_stage": "stage_id",
    "packet_status": "status",
    "packet_data": {...},
    "route_mode": "ROUTE_PHASE1_STANDARD|ROUTE_PHASE1_FAST|ROUTE_PHASE1_REPLAY",
    "escalation_reason": "optional",
    "director_availability": {...}
  }
}
```

### Core Execution Logic (Pseudocode)
```
FUNCTION ganesha.route_packet(packet_id, context):

  1. READ packet state and history
     ├─ FETCH packet from packet_index
     ├─ READ full lineage (where has this packet been?)
     ├─ READ current_stage and status
     ├─ DETERMINE packet_type (research|narrative|production|etc)
     └─ READ route_mode (standard|fast|replay)

  2. VALIDATE packet readiness
     ├─ CHECK packet has required outputs from current stage
     ├─ VALIDATE packet schema (well-formed data?)
     ├─ ASSESS packet quality (meets quality thresholds?)
     ├─ CHECK for blocking errors (critical issues?)
     └─ ESCALATE if validation fails

  3. DETERMINE next stage
     SWITCH(current_stage):
       CASE "WF-000": next = "WF-001" (kickoff → discovery)
       CASE "WF-001": next = "WF-010" (discovery → strategy)
       CASE "WF-010": next = "CWF-110" (strategy → topic research)
       CASE "CWF-110": next = "CWF-120" (topic discovery → qualification)
       CASE "CWF-120": next = "CWF-130" (topic qualification → scoring)
       CASE "CWF-130": next = "CWF-140" (topic scoring → research synthesis)
       CASE "CWF-140": next = "CWF-210" (research → script generation)
       CASE "CWF-210": next = "CWF-220" (script generation → debate)
       CASE "CWF-220": next = "CWF-230" (script debate → refinement)
       CASE "CWF-230": next = "CWF-240" (script refinement → final shaping)
       CASE "CWF-240": next = "WF-020" (final shaping → approval)
       CASE "WF-020": 
         IF approval_decision == "approved":
           next = "WF-030" (approval → promotion/publishing) [future]
         ELSE IF approval_decision == "remodify":
           next = "WF-021" (approval → remodify loop)
       CASE "WF-021":
         IF remodify_target == "CWF-240":
           next = "CWF-240" (back to final shaping)
         ELSE IF remodify_target == "CWF-230":
           next = "CWF-230" (back to refinement)
         ELSE IF remodify_target == "CWF-210":
           next = "CWF-210" (back to script generation)
         ELSE IF remodify_target == "CWF-110":
           next = "CWF-110" (back to topic research)
       DEFAULT: ESCALATE to Krishna

  4. CHECK route mode and apply rules
     IF route_mode == "ROUTE_PHASE1_STANDARD":
       ├─ All stages executed
       ├─ Full validation at each stage
       ├─ Standard cost budgets
       └─ Normal SLA (no acceleration)
     
     ELSE IF route_mode == "ROUTE_PHASE1_FAST":
       ├─ Skip optional stages (Agastya deep analysis)
       ├─ Reduce validation depth
       ├─ Increase cost budget (acceleration fees)
       └─ Reduce SLA (faster progression)
     
     ELSE IF route_mode == "ROUTE_PHASE1_REPLAY":
       ├─ Only stages after last failure
       ├─ Minimal validation (re-validate only changed sections)
       ├─ Normal cost budget (no acceleration)
       └─ Normal SLA

  5. CHECK director capacity and availability
     ├─ READ director_state (which directors active?)
     ├─ CHECK load for target director (busy?)
     ├─ ASSESS queue depth (how many packets waiting?)
     ├─ DETERMINE if should queue or backpressure
     └─ ESCALATE if critical director unavailable >30s

  6. DECIDE: Route now or queue?
     IF director_available AND queue_depth < max_capacity:
       → ROUTE immediately to next director
     ELSE IF queue_depth >= max_capacity:
       → BACKPRESSURE (pause current stage, request flow control)
     ELSE:
       → QUEUE in director's input queue

  7. HANDLE error packets
     IF packet_status == "error":
       ├─ READ error_type and severity
       ├─ IF critical_error:
             → ROUTE immediately to WF-900 (error handler)
       ├─ IF recoverable_error:
             → REQUEUE to current stage (retry)
       └─ IF unrecoverable_error:
             → ROUTE to WF-900 with error escalation

  8. HANDLE approval feedback
     IF trigger == "approval_feedback_received":
       ├─ READ approval_decision (approved|remodify)
       ├─ IF approved:
             → ROUTE to next stage (promotion/publishing)
       ├─ IF remodify:
             → DETERMINE remodify_target (which stage back to?)
             → QUEUE to remodify_target
             → UPDATE packet_lineage (loop iteration +1)
       └─ UPDATE approval_queue status (feedback processed)

  9. UPDATE neural index
     ├─ WRITE to neural_index (update lineage)
     ├─ ADD routing decision log entry
     ├─ UPDATE packet location (current_stage → next_stage)
     ├─ RECORD timestamp and route_confidence
     └─ VERSION audit entry (routing audit trail)

  10. WRITE routing outputs
      ├─ WRITE routing_intelligence (decision + reasoning)
      ├─ WRITE neural_index (updated lineage)
      ├─ WRITE route_state (system-level status)
      ├─ IF feedback: WRITE feedback_loop_routing
      └─ SIGN with Ganesha authority + timestamp

  11. EMIT packet ready signal
      → Signal next stage director that packet ready
      → Include packet_id + priority

  12. RETURN routing verdict
      RETURN {
        "packet_id": packet_id,
        "routed_to_stage": next_stage,
        "route_confidence": 0-100,
        "queue_position": position,
        "estimated_processing_time": "duration",
        "route_mode": route_mode,
        "escalation_needed": true/false
      }

END FUNCTION
```

---

## 6. ROUTING_QUALITY_SCORING

### Route Quality Framework

```
ROUTE_QUALITY_SCORE =
  (Correctness × 0.30) +
  (Efficiency × 0.25) +
  (Reliability × 0.25) +
  (Lineage_Completeness × 0.20)

RANGE: 0-100

THRESHOLDS:
  0-60   → QUESTIONABLE (routing ambiguous or inefficient)
  60-80  → ACCEPTABLE (correct but may be slow)
  80-100 → OPTIMAL (correct, efficient, reliable)
```

### Dimension Details

1. **Correctness** (0-100)
   - Does next stage match workflow definition?
   - Is routing decision aligned with packet status?
   - Formula: (correct_routes / total_routes × 100)
   - RED LINE: Any incorrect routing scores 0

2. **Efficiency** (0-100)
   - Does routing minimize latency?
   - Are queues short (low backlog)?
   - Is director capacity used efficiently?
   - Formula: (average_latency_target / actual_latency × 100) capped at 100

3. **Reliability** (0-100)
   - How many routes completed successfully?
   - How many needed rerouting?
   - Formula: (successful_routes / total_routes × 100)

4. **Lineage_Completeness** (0-100)
   - Is full packet lineage tracked?
   - Can any packet be replayed from start?
   - Formula: (packets_with_full_lineage / total_packets × 100)

---

## 7. SKILL BINDINGS (Ganesha owns/controls 10 core skills)

| Skill_ID | Skill_Name | Archetype | Authority_Level | Primary_Role | Vein_Binding |
|----------|-----------|-----------|-----------------|-------------|--------------|
| M-250 | Neural Router | decision_logic | FULL_CONTROL | Stage progression logic (core) | routing_intelligence |
| M-251 | Flow Director | governance | FULL_CONTROL | Flow orchestration (core) | route_state |
| M-252 | Index Writer | analysis | FULL_CONTROL | Update neural index (core) | neural_index |
| M-253 | Packet Validator | analysis | CONTROL | Validate packet readiness | routing_intelligence |
| M-254 | Lineage Tracker | analysis | FULL_CONTROL | Track packet lineage (core) | neural_index |
| M-255 | Queue Manager | decision_logic | CONTROL | Manage director queues | route_state |
| M-256 | Capacity Optimizer | analysis | CONTROL | Optimize throughput | route_state |
| M-257 | Error Router | governance | FULL_CONTROL | Route failures to error handler (core) | routing_intelligence |
| M-258 | Approval Router | governance | FULL_CONTROL | Route approval feedback (core) | feedback_loop_routing |
| M-259 | Latency Monitor | analysis | CONTROL | Monitor routing latency | route_state |

---

## 8. ROUTING_FRAMEWORK

### Standard Routing Path (ROUTE_PHASE1_STANDARD)

```
COMPLETE_WORKFLOW_STAGES:
  1. WF-000: Kickoff initialization
  2. WF-001: Topic discovery kickoff
  3. WF-010: Strategy layer review
  4. CWF-110: Topic discovery detail
  5. CWF-120: Topic qualification
  6. CWF-130: Topic scoring
  7. CWF-140: Research synthesis (Valmiki, Vyasa, Agastya optional)
  8. CWF-210: Script generation
  9. CWF-220: Script debate (Vyasa, reviewers)
  10. CWF-230: Script refinement
  11. CWF-240: Final script shaping
  12. WF-020: Final approval (approval council)
  13. WF-021: Remodify loop (if rejected)
  14. WF-030: Promotion/Publishing [Future Phase-2]
  15. WF-900: Error handling [On failure anywhere]

PACKET_REQUIRED_OUTPUTS (each stage must produce for next):
  WF-000 → topic_context_packet
  WF-001 → topic_candidates_list
  WF-010 → filtered_opportunities_list
  CWF-110 → market_analysis_packet
  CWF-120 → qualified_topics_list
  CWF-130 → scored_opportunities_list
  CWF-140 → research_synthesis_packet
  CWF-210 → script_draft_packet
  CWF-220 → reviewed_script_packet
  CWF-230 → refined_script_packet
  CWF-240 → final_script_packet
  WF-020 → approval_decision_packet
```

### Fast-Track Routing (ROUTE_PHASE1_FAST)

```
ACCELERATED_WORKFLOW_STAGES (skip optional):
  1. WF-000: Kickoff
  2. WF-001: Discovery kickoff
  3. WF-010: Strategy (minimal review)
  4. CWF-120: Qualification (skip topic discovery detail)
  5. CWF-130: Scoring
  6. CWF-140: Research synthesis (skip Agastya deep analysis)
  7. CWF-210: Script generation
  8. CWF-240: Final shaping (skip debate + refinement)
  9. WF-020: Approval
  10. WF-900: Error handling

SKIPPED_STAGES:
  - CWF-110 (topic discovery detail) → use market signals only
  - CWF-220 (script debate) → reviewer feedback optional
  - CWF-230 (script refinement) → minimal polish

COST: +40% due to acceleration
TIMELINE: -50% compared to standard
CONFIDENCE_PENALTY: -20% due to skipped validation
```

### Replay/Remodify Routing (ROUTE_PHASE1_REPLAY)

```
REMODIFY_SCENARIOS:
  Approval → Remodify CWF-240: Redo final shaping (small changes)
  Approval → Remodify CWF-230: Redo refinement + shaping (moderate changes)
  Approval → Remodify CWF-210: Redo script generation (large changes)
  Approval → Remodify CWF-110: Redo research + script (fundamental changes)

REPLAY_RULES:
  - Only replay stages AFTER last failure point
  - Re-validate changed sections only
  - Preserve upstream outputs (research, topic selection)
  - Track iteration count (limit reruns to 3 max)
  - Escalate if >3 iterations needed

COST: Standard cost (no acceleration fees)
TIMELINE: Varies by remodify target
EFFICIENCY: Reuses upstream work, faster than full restart
```

---

## 9. FAILURE SURFACES & RECOVERY

| Failure_Type | Detection_Signal | Recovery_Path | Fallback_Director | SLA |
|-------------|------------------|---------------|-------------------|-----|
| Ambiguous routing (2+ valid paths) | Route decision unsure | Escalate to Krishna for arbitration | Krishna (arbitration) | <60s |
| Director unavailable | Target director offline >30s | Queue in waiting state, escalate to Vishnu (HA) | Vishnu (failover) | <120s |
| Queue overflow | Queue depth >max_capacity | Backpressure upstream, escalate to Narada | Narada (capacity mgmt) | <60s |
| Packet validation fail | Schema mismatch or missing data | Escalate to originating director | Originating director (retry) | <60s |
| Incorrect routing | Packet routed to wrong stage | Log error, reroute immediately | Ganesha (retry) | <30s |
| Lineage corruption | Lineage missing or incomplete | Rebuild from packet history | Ganesha (rebuild) | <90s |
| Cycle detection (infinite loop) | Packet routed twice to same stage | Break loop, escalate to Krishna | Krishna (deadlock resolution) | <30s |
| Latency violation | Routing takes >SLA | Escalate to Narada for optimization | Narada (optimization) | Varies |

---

## 10. EXECUTION TIERS

**TIER_1 (FULL ROUTING INTELLIGENCE)**
- All 10 routing skills active
- Real-time packet tracking
- Intelligent capacity management
- Full lineage tracking
- Optimization of flow
- Cost: Baseline (routing overhead ~5-10%)
- Use case: Standard production workflow

**TIER_2 (STANDARD ROUTING)**
- 8/10 skills active (skip M-256, M-259)
- Packet tracking with minor latency
- Basic capacity awareness
- Simplified lineage
- No flow optimization
- Cost: 90% of TIER_1
- Use case: Lower-volume workflows

**TIER_3 (BASIC ROUTING)**
- 6/10 skills active (core routing only: M-250, M-251, M-252, M-254, M-257, M-258)
- Minimal packet tracking
- No capacity management
- Basic lineage only (origin + current stage)
- No optimization
- Cost: 70% of TIER_1
- Use case: Emergency fallback routing

---

## 11. HITL TRIGGERS (Manual Intervention)

| Trigger_Type | Condition | Escalation_Path | Required_Action | Time_Limit |
|-------------|-----------|-----------------|-----------------|-----------|
| Ambiguous Route | Two equally valid next stages | Ganesha + Krishna | Arbitration decision | 30 min |
| Director Failure | Critical director offline >1min | Ganesha + Vishnu + Krishna | Failover or reroute | 60 sec |
| Queue Overload | Queue >max + backpressure triggered | Ganesha + Narada | Capacity increase or throttle | 15 min |
| Packet Validation | Packet schema invalid | Ganesha + originating director | Fix data or escalate | 30 min |
| Cycle Detected | Infinite loop detected | Ganesha + Krishna | Break cycle + investigate | 30 sec |
| SLA Violation | Routing latency >SLA | Ganesha + Narada | Optimize or acknowledge breach | 15 min |

---

## 12. DASHBOARD_VISIBILITY & TELEMETRY

### Public Fields (Creator Dashboard)
- **Packets_In_Flight**: Count of active packets
- **Current_Stage_Distribution**: Packets by stage
- **Average_Latency**: Routing latency per stage
- **Queue_Status**: Queued packets + wait time
- **Success_Rate**: % packets successfully routed
- **Remodify_Iteration_Count**: Loop iterations for current packet
- **Estimated_Completion_Time**: Time to final approval

### Audit-Only Fields (Governance Visible)
- **Full_Packet_Lineage**: Every stage each packet visited
- **Routing_Decision_Log**: Every routing decision + reasoning
- **Queue_Depth_History**: Queue size over time
- **Director_Availability**: Uptime per director
- **Latency_Breakdown**: Routing time vs director processing time
- **Reroute_Count**: How many times routed incorrectly
- **Cycle_Detections**: Infinite loops caught + resolved

---

## 13. CRITICAL AMBIGUITIES

| Ambiguity | Current State | Resolution | Owner |
|-----------|--------------|-----------|-------|
| Max queue depth per director | Not defined | Confirm max queue size before backpressure | Narada |
| Remodify iteration limit | Max 3 | Confirm whether 3 iterations acceptable or adjust | Creator |
| Latency SLA per stage | Not defined | Define target latency (seconds per stage) | Narada |
| Skip stage authorization | Requires Krishna | Confirm who can approve stage skipping (fast-track) | Krishna |
| Packet priority levels | Not defined | Define priority scheme (normal|high|critical) | Narada |
| Duplicate detection | Not implemented | Confirm handling of duplicate packets | Ganesha |

---

## 14. ACCEPTANCE CRITERIA (DEPLOYMENT GATE)

✅ **READY FOR DEPLOYMENT IF**:
- [ ] All 10 routing skills callable and tested
- [ ] Stage progression logic working for all 15 stages
- [ ] Packet validation functional
- [ ] Neural index writing/reading working
- [ ] Lineage tracking complete and auditable
- [ ] Queue management functional
- [ ] Error routing to WF-900 working
- [ ] Approval feedback routing working (approved → next, remodify → target stage)
- [ ] Cycle detection working
- [ ] Backpressure triggering when queue full
- [ ] Integration with all directors tested (packet ready signal received)
- [ ] End-to-end routing WF-000 → WF-020 tested with sample packet

---

## 15. RELEASE BLOCKING STATUS

**RELEASE_BLOCKING: CRITICAL** (routing is mandatory infrastructure)

Without Ganesha, packets cannot progress through workflow. Routing is the nervous system of the entire system. No content can move from discovery → strategy → research → script → approval without correct routing.

---

## 16. OPERATIONAL NOTES

- **Created**: 2026-04-21
- **Status**: SPECIFICATION COMPLETE
- **Testing Priority**: CRITICAL (blocks all workflows)
- **Next Step**: Integration testing with all workflow stages (WF-000 through WF-021)
- **Real-Time Requirement**: Must process routing decisions <500ms per packet
- **Monitoring**: Continuous monitoring of latency, queue depth, director availability
- **Failover**: If Ganesha fails, system cannot function; Vishnu must assume routing authority
