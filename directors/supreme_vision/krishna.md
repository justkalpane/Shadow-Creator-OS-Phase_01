# DIRECTOR: KRISHNA
## Canonical Domain ID: DIR-ORCHv1-001
## Full Execution Specification — Supreme Vision Council

---

## 1. DIRECTOR IDENTITY & ROLE

- **Canonical_Domain_ID**: DIR-ORCHv1-001
- **Canonical_Subdomain_ID**: SD-ORCH-EXPANSION-STRAT
- **Director_Name**: Krishna (The Orchestrator)
- **Council**: Supreme Vision
- **Role_Type**: ORCHESTRATOR | DECISION_ARBITER | MULTI_DOMAIN_CONTROLLER
- **Primary_Domain**: Multi-Agent Orchestration, Swarm Coordination, Expansion Logic, Cross-Council Arbitration
- **Secondary_Domain**: Script Intelligence Refinement, Arbitration, Cross-Council Coordination
- **Shadow_Pair**: Vishnu (DIR-ORCHv1-002) — automatic failover if Krishna unavailable >30s
- **Backup_Director**: Brahma (for governance escalations)

---

## 2. AUTHORITY MATRIX

### Dossier Lock Authority
- **Scope**: FULL (cross-council, all namespaces except kernel-only)
- **Namespaces_Controlled**:
  - `namespace:orchestra` — central orchestration state (Krishna exclusive, Brahma co-owner)
  - `namespace:arbitration` — conflict resolution logs (Krishna + Krishna-only veto)
  - `namespace:expansion` — multi-agent swarm state (Krishna read/write, others read-only)
  - `namespace:cross_council_sync` — inter-council coordination (Krishna + council leads read/write)

### Cost Authority Scope
- **Global** — Krishna can approve/reject any expenditure
- **Override_Power**: Can escalate cost rejections to founder tribunal
- **Delegation**: Can delegate operational budget to Narada (operations tier only)

### Delegation Policy
- **Can_Delegate_To**:
  - Chanakya (strategy decisions)
  - Narada (operational execution)
  - Vyasa (research + content)
  - Shiva (autonomous intelligence loop)
  - Brahma (governance matters only)
- **Constraint**: Delegation creates audit trail, can be revoked instantly

### Veto Authority
- **YES** — Krishna has full veto power on any director decision
- **Constraint**: Must be documented with reason code + timestamp
- **Override**: Only founder can override Krishna's veto (with tribunal approval)

### Approval Authority
- **Cross-Council**: YES
- **Resource_Approval**: YES (budget, CPU, storage allocation)
- **Policy_Approval**: Shared with Brahma (Brahma can veto policy)
- **Escalation_Approval**: YES (can approve escalations to founder)

---

## 3. READS (Input Veins)

### Vein Shards (Full Read Access)
1. **research_vein** (FULL) — all research outputs, topic signals, trend data, knowledge graphs
   - Scope: Last 100 decisions, real-time metrics refresh (every 60s)
   - Sources: Narada (data ingestion), Vyasa (knowledge synthesis), all research skills
   
2. **narrative_vein** (FULL) — all script versions, content dossier, debate logs, iteration history
   - Scope: All script variants, A/B test results, creative destruction cycles
   - Sources: Vyasa (content creation), Shiva (autonomous loop), all narrative skills
   
3. **production_vein** (FULL) — asset pipelines, media status, quality gates, voice/audio/visual metrics
   - Scope: Asset inventory, production queue status, quality scores
   - Sources: Tumburu (audio), Maya (visual), Vishwakarma (architecture)
   
4. **distribution_vein** (FULL) — engagement metrics, platform signals, audience data, viral scores
   - Scope: Real-time engagement, platform APIs, audience sentiment
   - Sources: Narada (operations), Kama (engagement), all distribution skills
   
5. **governance_vein** (FULL, restricted) — policy verdicts, audit trail, tribunal decisions
   - Scope: Restricted to Krishna access (Yama/Krishna only for sensitive decisions)
   - Sources: Brahma (policy), Yama (legality), audit logs
   
6. **dossier_lock** (READ ONLY) — current lock status for arbitration decisions
   - Scope: All namespace locks, lock owners, expiration times
   - Purpose: Detect conflicts before they escalate

### Real-Time Monitoring
- **Decision_Packet_Feed**: Krishna monitors all director decisions in real-time
- **Escalation_Priority_Feeds**: Immediate alerts for conflicts, policy violations, cost overruns
- **Historical_State**: Last 50 decisions per director (for pattern analysis)

---

## 4. WRITES (Output Veins & Mutations)

### Vein Shards (Patch-Only Mutations)
1. **routing_decisions** — routes active workflows to directors/agents
   - Format: `{ timestamp, decision_id, from_director, to_director, reason, cost_budget }`
   - Versioning: Keep last 100 routing decisions
   - Ownership: Krishna exclusive

2. **arbitration_verdicts** — cross-council conflict resolution
   - Format: `{ timestamp, conflict_id, parties, ruling, reasoning, binding_force }`
   - Versioning: Keep last 50 verdicts
   - Ownership: Krishna exclusive

3. **expansion_orchestration_state** — multi-agent swarm coordination commands
   - Format: `{ timestamp, agent_id, task, resource_allocation, deadline, retry_budget }`
   - Versioning: Keep last 30 swarm states
   - Ownership: Krishna exclusive (read to Vishnu, Narada)

4. **skill_chain_binding** — dynamic skill allocation to executing agents
   - Format: `{ skill_id, agent_id, cost_budget, timeout_seconds, retry_count, escalation_director }`
   - Versioning: Immutable (no updates, only append new versions)
   - Ownership: Krishna exclusive

5. **performance_feedback** — learning memory updates (from WF-600 back to WF-100)
   - Format: `{ timestamp, metric_type, score, delta_from_last, recommendation }`
   - Versioning: Keep last 20 feedback cycles
   - Ownership: Krishna read/write, Shiva read, Narada read

### Lockable Namespaces

```yaml
namespace:orchestra:
  owner: Krishna (Brahma co-owner)
  lock_authority: Krishna only
  contained_state:
    - current_active_workflows
    - director_allocation_map
    - agent_pool_status
    - resource_availability
  mutation_law: patch-only, versioned, audit-append

namespace:arbitration:
  owner: Krishna (non-transferable)
  lock_authority: Krishna exclusive
  contained_state:
    - conflict_registry
    - veto_decisions
    - tribunal_escalations
  mutation_law: immutable logs, append-only, high audit

namespace:expansion:
  owner: Krishna
  readers: Vishnu, Brahma, Narada, Shiva
  lock_authority: Krishna only
  contained_state:
    - swarm_agent_count
    - parallel_workflow_count
    - resource_consumption
    - expansion_velocity
  mutation_law: patch-only, rate-limited (max 5 changes/min)

namespace:cross_council_sync:
  owner: Krishna (shared with council leads: Chanakya, Vyasa, Tumburu, Hanuman, Kama)
  lock_authority: Krishna + any council lead
  contained_state:
    - council_alignment_scores
    - inter_council_dependencies
    - approval_deadlines
  mutation_law: patch-only, consensus required for major changes
```

### Mutation Law (Immutable Rules)
- **NO DIRECT OVERWRITES** — Only versioned patches
- **Audit Trail**: Every write includes:
  - timestamp (ISO 8601)
  - change_diff (what changed)
  - reason_code (why changed)
  - authorized_by (which director/founder)
- **Versioning**: Keep last 50 versions of each namespace for replay
- **Namespace Ownership**: Krishna exclusive on `orchestra` + `arbitration`, shared on `cross_council_sync`
- **Replay Capability**: Any version can be restored if needed (with audit flag)

---

## 5. EXECUTION FLOW (Krishna's Decision Loop)

### Input Contract
```json
{
  "trigger": "decision_request | conflict_escalation | performance_feedback | policy_violation",
  "context_packet": {
    "current_stage": "WF-110 to WF-600",
    "competing_options": [
      {
        "option_id": "OPT-XXX",
        "director_id": "DIRECTOR-YY",
        "reasoning": "...",
        "estimated_cost": 500,
        "success_probability": 0.85
      }
    ],
    "council_recommendations": {
      "supreme_vision": "...",
      "strategy": "...",
      "research": "..."
    },
    "constraints": {
      "budget_available": 5000,
      "time_deadline": "2026-04-21T18:00:00Z",
      "policy_rules": [...]
    }
  }
}
```

### Core Execution Logic (Pseudocode)
```
FUNCTION krishna.orchestrate(context_packet):

  1. VALIDATE input against task_envelope schema
     ├─ Check all required fields present
     ├─ Verify signer (must come from registered director)
     └─ Confirm context completeness score >80%

  2. READ all input veins (async parallel):
     ├─ research_vein.read() → research_state
     ├─ narrative_vein.read() → narrative_state
     ├─ production_vein.read() → production_state
     ├─ distribution_vein.read() → distribution_state
     └─ governance_vein.read() → governance_state

  3. CHECK for active conflicts:
     IF conflict_detected:
       ├─ INVOKE arbitration_engine()
       ├─ LOCK disputed namespace
       └─ DETERMINE winner by EXPANSION_SCORING_MATRIX
     ELSE:
       └─ PROCEED to scoring

  4. SCORE each option using EXPANSION_SCORING_MATRIX (below)
     FOR each competing_option:
       score = (
         (STRATEGIC_FIT × 0.25) +
         (RESOURCE_EFFICIENCY × 0.20) +
         (RISK_MITIGATION × 0.15) +
         (SPEED_TO_EXECUTION × 0.15) +
         (MULTI_AGENT_LEVERAGE × 0.15) +
         (GOVERNANCE_ALIGNMENT × 0.05) +
         (LEARNING_OPPORTUNITY × 0.05)
       )
       ├─ IF score <40 → escalate to founder
       ├─ IF 40≤score<60 → flag as high-risk
       └─ IF score ≥75 → auto-approve

  5. SELECT top-scoring option
     ├─ IF top_score >20 points ahead of second → APPROVE
     ├─ ELSE IF top_score tied within 5 points → escalate to founder
     └─ Notify all stakeholders

  6. ROUTE decision to appropriate director/workflow
     ├─ INVOKE Ganesha router (neural index + routing decisions)
     ├─ DETERMINE next stage (WF-111, WF-201, escalation, etc.)
     └─ WRITE to routing_decisions vein

  7. BIND skills to executing agents
     FOR each skill required:
       ├─ LOOKUP skill_id in registry
       ├─ CHECK skill prerequisites (dependencies)
       ├─ ALLOCATE cost budget from Kubera gate
       ├─ CREATE skill_chain_binding record
       └─ ASSIGN to available agent

  8. WRITE decision to arbitration_verdicts
     ├─ Include full context, reasoning, metrics
     ├─ Sign with Krishna's authority
     ├─ Audit append to governance_vein
     └─ Set versioning timestamp

  9. RETURN routing decision packet
     RETURN {
       "decision_id": UUID,
       "selected_option": option_id,
       "next_director": director_id,
       "next_workflow": workflow_id,
       "cost_approved": amount,
       "confidence_score": 0-100,
       "timestamp": ISO_8601
     }

END FUNCTION
```

---

## 6. EXPANSION_SCORING_MATRIX (Krishna's Decision Framework)

### 7-Dimension Scoring System

```
EXPANSION_SCORE(option) = 
  (STRATEGIC_FIT × 0.25) +
  (RESOURCE_EFFICIENCY × 0.20) +
  (RISK_MITIGATION × 0.15) +
  (SPEED_TO_EXECUTION × 0.15) +
  (MULTI_AGENT_LEVERAGE × 0.15) +
  (GOVERNANCE_ALIGNMENT × 0.05) +
  (LEARNING_OPPORTUNITY × 0.05)
  
RANGE: 0-100
THRESHOLDS:
  0-40   → Escalate to founder (reject or replan)
  40-60  → Flag as high-risk, require human review
  60-75  → Approve with caution (monitor execution)
  75-100 → Auto-approve (standard execution path)
```

### Dimension Details

1. **STRATEGIC_FIT** (0-100)
   - Alignment with current empire strategy
   - Fit with creator's declared goals
   - Alignment with council recommendations
   - Formula: `(align_score × 0.4) + (goal_fit × 0.3) + (council_consensus × 0.3)`

2. **RESOURCE_EFFICIENCY** (0-100)
   - Cost per outcome metric
   - CPU/memory optimization score
   - Token budget optimization
   - Formula: `100 - (cost_percentile / 100 × 30) + (speed_percentile / 100 × 30) + (quality_percentile / 100 × 40)`

3. **RISK_MITIGATION** (0-100)
   - Failure surface coverage
   - Fallback plan quality
   - Escalation path clarity
   - Formula: `(failure_surfaces_covered / total_surfaces × 0.4) + (fallback_quality × 0.3) + (escalation_clarity × 0.3)`

4. **SPEED_TO_EXECUTION** (0-100)
   - Days to production-ready (inverted)
   - Dependency resolution time
   - Resource availability
   - Formula: `100 - (days_to_ready / 10 × 100)` (capped at 100)

5. **MULTI_AGENT_LEVERAGE** (0-100)
   - How many agents can parallelize
   - Skill dependency parallelism score
   - Swarm size optimization
   - Formula: `(agent_count_available / max_agents × 50) + (parallelism_score × 50)`

6. **GOVERNANCE_ALIGNMENT** (0-100)
   - Policy compliance score
   - Council approval likelihood
   - Audit trail completeness
   - Formula: `(policy_compliant ? 100 : 0) × 0.4 + (council_approval_likelihood × 60)`

7. **LEARNING_OPPORTUNITY** (0-100)
   - Future capability gain
   - Data collection value
   - Skill improvement potential
   - Formula: `(new_capability_value × 0.4) + (data_value × 0.3) + (skill_improvement × 0.3)`

---

## 7. SKILL BINDINGS (Krishna owns/controls 29 core skills)

| Skill_ID | Skill_Name | Archetype | Authority_Level | Escalation_Owner | Vein_Binding | Primary_Role |
|----------|-----------|-----------|-----------------|------------------|--------------|------------|
| M-003 | Strategy Router | decision_logic | FULL_CONTROL | Chanakya | routing_decisions | Route tasks to appropriate director |
| M-030 | Engagement Predictor | narrative_intelligence | CO_OWNER | Vyasa | narrative_vein | Predict engagement metrics |
| M-048 | Thumbnail A/B Tester | optimization | CONTROL | Shiva | production_vein | A/B test thumbnails |
| M-054 | Content Optimization Engine | narrative_intelligence | CONTROL | Vyasa | narrative_vein | Auto-optimize content |
| M-064 | Skill Priority Engine | governance | CO_OWNER | Brahma | orchestra | Determine skill execution order |
| M-072 | Pattern Recognition Engine | analysis | CONTROL | Narada | research_vein | Detect patterns in data |
| M-112 | Strategy Refinement Engine | decision_logic | FULL_CONTROL | Chanakya | expansion_orchestration_state | Refine strategies iteratively |
| M-121 | Algorithm Intelligence Core | multi_agent | FULL_CONTROL | Narada | expansion_orchestration_state | Core multi-agent algorithm |
| M-126 | Retention Repair Engine | optimization | CONTROL | Shiva | production_vein | Fix retention drops |
| M-130 | Thumbnail Optimization Engine | optimization | CONTROL | Shiva | production_vein | Optimize thumbnails |
| M-133 | Curiosity Trigger Engine | narrative_intelligence | CONTROL | Vyasa | narrative_vein | Inject curiosity gaps |
| M-134 | Psychological Hook Engine | narrative_intelligence | CO_OWNER | Shiva | narrative_vein | Psychological testing |
| M-138 | Viral Probability Engine | multi_agent | FULL_CONTROL | Narada | expansion_orchestration_state | Calculate viral probability |
| M-141 | Community Trigger Engine | engagement | CONTROL | Narada | distribution_vein | Trigger community engagement |
| M-148 | Channel Authority Builder | operations | CONTROL | Narada | distribution_vein | Build channel authority |
| M-156 | Audience Persona Generator | operations | CONTROL | Narada | distribution_vein | Generate audience personas |
| M-161 | Personality Mapping Engine | operations | CONTROL | Narada | distribution_vein | Map creator personality |
| M-163 | Speech Emotion Engine | production | CO_OWNER | Tumburu | production_vein | Analyze speech emotion |
| M-172 | Insight Extraction Engine | analysis | CONTROL | Vyasa | research_vein | Extract insights |
| M-180 | Strategy Adaptation Engine | strategy | FULL_CONTROL | Chanakya | expansion_orchestration_state | Adapt strategies dynamically |
| M-184 | Community Growth Engine | multi_agent | CONTROL | Narada | distribution_vein | Grow communities |
| M-188 | Product Ecosystem Engine | strategy | CONTROL | Brahma | cross_council_sync | Manage product ecosystem |
| M-195 | Emotional Council | narrative_intelligence | CONTROL | Vyasa | narrative_vein | Emotional impact assessment |
| M-199 | Strategy Council | strategy | FULL_CONTROL | Chanakya | cross_council_sync | Council oversight |
| M-210 | Community Council | multi_agent | CONTROL | Narada | distribution_vein | Community council decisions |
| M-220 | Failover Manager | governance | CO_OWNER | Vishnu | orchestra | HA failover management |
| M-227 | Audience Force Multiplier | engagement | CONTROL | Shakti | distribution_vein | Multiply audience force |
| M-228 | Viral Acceleration Governor | optimization | CONTROL | Shakti | distribution_vein | Control viral acceleration |
| M-229 | Strategic Opportunity Scorer | strategy | CONTROL | Chanakya | expansion_orchestration_state | Score opportunities |

---

## 8. FAILURE SURFACES & RECOVERY PATHS

### Failure Type Matrix

| Failure_Type | Detection_Signal | Recovery_Path | Fallback_Director | Recovery_Time_SLA |
|-------------|------------------|---------------|-------------------|------------------|
| Skill chain deadlock | Timeout >300s on skill execution | Invoke Chanakya re-route | Chanakya | <60s |
| Council disagreement >5min | Arbitration stall detected | Escalate to founder tribunal | Founder | N/A (manual) |
| Namespace lock conflict | Write conflict on shared namespace | Release older lock, re-queue write | Ganesha (router) | <30s |
| Cost overage detected | Kubera budget gate rejects task | Downgrade execution tier to TIER_3 | Narada (low-cost ops) | <15s |
| Policy veto from Yama | Policy_reject packet received | Replan with constraints, consult Yama | Chanakya + Yama | <120s |
| Multi-agent sync failure | Agent timeout in swarm >120s | Single-agent fallback execution | Shiva (serial executor) | <60s |
| Routing conflict | Multiple next-stages valid | Krishna arbitration, pick highest-score | Internal arbitration | <45s |
| Data ingestion failure | Narada signal timeout >60s | Fallback to cached data (24h old max) | Narada (backup data) | <30s |
| Governance violation | Brahma policy check fails | Stop execution, audit escalate, quarantine | Brahma + Tribunal | N/A (blocked) |
| Expansion overshoot | Agent_count >max_safe_limit | Auto-throttle new agent spawning | Kubera + Vishnu | <20s |

### Recovery Logic Example
```
IF skill_chain_deadlock_detected():
  1. Log incident (timestamp, context, cost so far)
  2. KILL stuck skill execution (with resource cleanup)
  3. Invoke Chanakya.re_route(context_state)
  4. Determine alternative director + workflow
  5. Resume with fresh context (no data loss)
  6. Escalate cost overrun to Kubera if >10% budget
  7. Create incident record for WF-900 (error handling)
ELSE IF council_disagreement_detected():
  1. HOLD routing decision
  2. Escalate to founder with full context
  3. AWAIT manual override + reason code
  4. Execute approved decision
  5. Audit record as tribunal decision
ELSE IF cost_overage_detected():
  1. PAUSE new skill executions
  2. DOWNGRADE execution tier (TIER_1 → TIER_2 → TIER_3)
  3. REPLAN remaining tasks on lower tier
  4. ALERT Kubera + founder (if overage >20%)
  5. RESUME execution on degraded tier
```

---

## 9. EXECUTION TIERS & DEGRADATION

### Tier Definitions

**TIER_1 (FULL EXECUTION)**
- All 29 skills active
- 100% resource budget available
- Execution modes: local, hybrid, cloud
- Hardware: GPU_HEAVY, CPU_LIGHT, MEMORY_INTENSIVE
- Cost per operation: 1.0× (baseline)
- Use case: High-value content, brand creators, time-critical

**TIER_2 (HYBRID EXECUTION)**
- 18/29 skills active (no GPU-heavy skills like media generation)
- 70% resource budget available
- Execution modes: local, hybrid (preferred), cloud (fallback)
- Hardware: CPU_LIGHT, MEMORY_LIGHT
- Cost per operation: 0.6× (60% of TIER_1)
- Use case: Standard content, budget-conscious, non-urgent

**TIER_3 (LOCAL ONLY)**
- 8/29 skills active (local-only subset: routing, decision, analytics only)
- 40% resource budget available
- Execution modes: local only
- Hardware: CPU_VERY_LIGHT
- Cost per operation: 0.25× (25% of TIER_1)
- Use case: Emergency execution, zero-budget, local-only environments

### Degradation Rules
```
IF cost_overage >15%:
  TRIGGER_DEGRADATION:
    TIER_1 → TIER_2 (automatic, log event)
    TIER_2 → TIER_3 (requires Narada approval)
    
  RE_PLAN remaining operations on lower tier
  ALERT stakeholders (creator, Kubera, Krishna)

IF cost_overage >30%:
  HARD_STOP: No new operations until budget resets
  ESCALATE to founder + Kubera for emergency approval
  
IF cost_normalized (back under 80%):
  AUTO_UPGRADE to previous tier (no manual approval needed)
  RESUME pending operations
```

---

## 10. HITL TRIGGERS (Human-In-The-Loop)

### When Krishna Requires Manual Intervention

| Trigger_Type | Condition | Escalation_Path | Required_Action | Time_Limit |
|-------------|-----------|-----------------|-----------------|-----------|
| Conflict Deadlock | Council disagreement >5min | Founder tribunal | Manual decision override | 30 min |
| Cost Overage Critical | Overage >30% of budget | Founder + Kubera | Approval for emergency funds | 15 min |
| Policy Violation Critical | Yama veto on core operation | Founder + Brahma | Policy exception request | 10 min |
| Multi-Director Disagreement | ≥3 directors dispute routing | Founder tribunal | Tiebreaker decision | 20 min |
| System Health Degradation | >3 concurrent failures | Founder + all councils | Diagnostics + recovery plan | N/A (immediate) |
| Governance Audit Failure | Audit trail corruption detected | Founder + Chitragupta | Forensic audit + recovery | 60 min |
| Expansion Overshoot | Agent count exceeds safety limit | Founder + Kubera | Resource adjustment decision | 10 min |
| Novel Conflict Type | Unrecognized failure pattern | Founder + R&D council | Pattern analysis + new rule | N/A (investigation) |

---

## 11. DASHBOARD VISIBILITY & TELEMETRY

### Public Fields (Creator Dashboard Visible)
- **Current Orchestration State**: Active workflows, director decisions, stage progress
- **Expansion Agent Count**: Real-time swarm size (0-Nmax)
- **Council Alignment Score**: 0-100 (how aligned are the 6 councils?)
- **Arbitration Incidents Last 24h**: Count of conflicts resolved
- **Cost Consumption**: % of budget used, projected overage
- **Routing Efficiency**: % of decisions auto-approved vs escalated

### Audit-Only Fields (Governance Visible)
- **Lock History**: All namespace locks (who, when, why, duration)
- **Veto Decisions**: Policy rejections by Yama (timestamp, reason, impact)
- **Escalation Events**: Conflicts requiring founder intervention
- **Cost Tracking**: Budget consumed per director, per skill, per workflow
- **Arbitration Audit Trail**: Full verbatim of all conflict resolutions
- **HITL Actions**: All manual overrides by founder (timestamp, action, outcome)

### Real-Time Metrics
- **Skill Execution Rate**: Skills/second currently executing
- **Agent Utilization**: % of available agents in use
- **Vein Mutation Rate**: Changes/minute to dossier
- **Routing Decision Latency**: Average time Krishna takes to decide (target <2s)
- **Conflict Detection Rate**: Conflicts found/hour

---

## 12. RUNTIME CRITICAL AMBIGUITIES (MUST RESOLVE BEFORE DEPLOYMENT)

| Ambiguity | Current State | Resolution | Owner | Status |
|-----------|--------------|-----------|-------|--------|
| Krishna vs Brahma authority on governance | Overlapping namespaces | Krishna: expansion + operations, Brahma: policy enforcement | Krishna + Brahma joint | ⚠️ PENDING |
| Multi-agent swarm size limits | No hard cap defined | Max agents = floor((available_compute / min_skill_cost) × 0.8) | Kubera budget gate | ⚠️ PENDING |
| Arbitration timeout before founder escalation | Not specified | 5 minutes before automatic escalation to tribunal | Tribunal | ⚠️ PENDING |
| Skill chain failure retry budget | Unbounded | 3 retries per skill, then escalate to Chanakya | Chanakya | ⚠️ PENDING |
| Shared namespace write priority | Not defined | Last-write-wins + audit trail (no overwrite, only append) | Ganesha (router) | ⚠️ PENDING |
| Cost overage escalation threshold | Varies by context | Automatic escalation >20% overage; hard stop >30% | Kubera | ⚠️ PENDING |
| Expansion velocity cap | No limit defined | Max new agents/second = available_resources / agent_cost | Kubera + Vishnu | ⚠️ PENDING |
| Inter-council decision conflict resolution | Not defined | Scoring matrix winner (highest score >75); if tied, escalate to founder | Krishna arbitration | ⚠️ PENDING |

---

## 13. ACCEPTANCE CRITERIA (DEPLOYMENT GATE)

✅ **READY FOR DEPLOYMENT IF**:
- [ ] All 29 skills registered in skill_registry and callable
- [ ] Arbitration_engine wired to founder override system
- [ ] Vein contracts (research, narrative, production, distribution, governance, expansion) operational
- [ ] Ganesha router functional (neural index + routing decisions)
- [ ] Kubera cost gates enforced on all operations
- [ ] Audit trail persisted to dossier (no data loss)
- [ ] Vishnu failover tested and working (<30s recovery)
- [ ] All 7 critical ambiguities resolved (not PENDING)
- [ ] HITL triggers tested with manual founder overrides
- [ ] End-to-end orchestration test passed (WF-000 → decision → WF-100 → Krishna routing → next stage)

---

## 14. RELEASE BLOCKING STATUS

**RELEASE_BLOCKING: TRUE**

This director **MUST** be operational before Phase-1 completion. All council coordination, cross-director arbitration, and expansion logic depend on Krishna's orchestration layer.

**Failure to deploy Krishna blocks**:
- Multi-council coordination
- Skill chaining across workflows
- Dynamic resource allocation
- Conflict resolution
- System-wide decision making

**Cannot proceed to Phase-2 (Media Production, WF-300+) without Krishna fully operational.**

---

## 15. OPERATIONAL NOTES

- **Created**: 2026-04-21 (from PRD v34)
- **Status**: SPECIFICATION COMPLETE — Ready for implementation
- **Next Step**: Wire to execution engine + test arbitration logic
- **Testing Priority**: CRITICAL PATH

