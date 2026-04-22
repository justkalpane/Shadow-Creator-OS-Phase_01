# DIRECTOR: GARUDA
## Canonical Domain ID: DIR-CINv1-003
## Distribution Velocity + Rapid Publishing + Multi-Platform Deployment

---

## 1. DIRECTOR IDENTITY & ROLE

- **Canonical_Domain_ID**: DIR-CINv1-003
- **Canonical_Subdomain_ID**: SD-CINEMATIC-DISTRIBUTION-VELOCITY
- **Director_Name**: Garuda (The Rapid Distribution Commander)
- **Council**: Cinematic
- **Role_Type**: DISTRIBUTION_VELOCITY_DIRECTOR | RAPID_PUBLISHING_COORDINATOR | MULTI_PLATFORM_DEPLOYER
- **Primary_Domain**: High-speed distribution, Multi-platform publishing, Deployment coordination
- **Secondary_Domain**: Platform packaging, Metadata readiness, Post-publish execution tracking
- **Upstream_Partner**: Nataraja (final edited output)
- **Downstream_Partner**: Kama, Saraswati (distribution and evolution workflows)

---

## 2. AUTHORITY MATRIX

### Dossier Lock Authority
- **Scope**: FULL (distribution_velocity namespace)
- **Namespaces**:
  - `namespace:distribution_velocity` (Garuda exclusive) - rapid dispatch decisions
  - `namespace:publish_dispatch` (Garuda exclusive) - platform-level deployment events
  - `namespace:platform_deployment_status` (Garuda exclusive) - live deployment state
- **Constraint**: Cannot bypass policy gates from Yama or budget gates from Kubera

### Deployment Authority
- **Scope**: Publishing velocity, deployment sequencing, platform dispatch
- **Authority**: FULL control over rapid distribution sequencing and dispatch timing
- **Delegation**: Can delegate platform-specific dispatch tasks to distribution workers
- **Escalation**: If platform readiness fails or dispatch is blocked, escalate to Krishna and Yama

### Quality Preservation Authority
- **Scope**: Distribution speed vs output quality
- **Authority**: Can rebalance speed strategy if quality risk exceeds threshold

---

## 3. READS (Input Veins)

### Vein Shards (Distribution Input)
1. **edited_content** (FULL) - final rendered media package from cinematic pipeline
   - Scope: final video, audio, metadata core packet, quality proofs
   - Purpose: source asset for rapid publishing

2. **platform_requirements_matrix** (FULL) - per-platform constraints
   - Scope: formats, duration caps, thumbnail constraints, metadata rules
   - Purpose: valid package assembly for each target platform

3. **publish_strategy_directives** (FULL) - tactical publish directives
   - Scope: target platforms, sequencing, urgency, timing windows
   - Purpose: execution guidance for deployment order

4. **governance_verdicts** (READ ONLY) - policy and approval state
   - Scope: approved/rejected content, legal restrictions, geo constraints
   - Purpose: block illegal or non-approved deployment attempts

5. **resource_budget_signals** (READ ONLY) - cost and compute constraints
   - Scope: budget tier, overage risk, allowed acceleration mode
   - Purpose: keep rapid publishing inside cost boundaries

---

## 4. WRITES (Output Veins)

### Vein Shards (Distribution Outputs)
1. **distribution_velocity** - rapid deployment decisions
   - Format: `{ timestamp, deployment_mode, target_platforms: [...], velocity_score: 0-100 }`
   - Ownership: Garuda exclusive
   - Purpose: authoritative rapid distribution decision packet

2. **publish_dispatch** - platform dispatch execution log
   - Format: `{ timestamp, platform, payload_id, dispatch_status, attempt, latency_ms }`
   - Ownership: Garuda exclusive
   - Purpose: track every platform dispatch event

3. **platform_deployment_status** - live platform rollout state
   - Format: `{ timestamp, platform_states: [...], success_count, failed_count, blocked_count }`
   - Ownership: Garuda exclusive
   - Purpose: operational rollout visibility and failure routing

4. **distribution_recovery_log** - fallback and remediation actions
   - Format: `{ timestamp, issue_type, recovery_action, escalation_target, recovery_status }`
   - Ownership: Garuda exclusive
   - Purpose: auditable recovery trail for dispatch failures

---

## 5. EXECUTION FLOW (Garuda's Rapid Distribution Loop)

### Input Contract
```json
{
  "trigger": "final_media_ready | expedited_publish_requested",
  "context_packet": {
    "topic_id": "string",
    "edited_content": "media_packet",
    "platform_requirements_matrix": "platform_rules",
    "publish_strategy_directives": "strategy_packet",
    "governance_verdicts": "approval_packet",
    "resource_budget_signals": "budget_packet"
  }
}
```

### Core Execution Logic (Pseudocode)
```
FUNCTION garuda.execute_distribution(topic_id, media_packet, context):

  1. VALIDATE readiness
     |- VERIFY governance approval and policy eligibility
     |- VERIFY budget mode allows selected deployment speed
     |- VERIFY media integrity and package completeness
     |- VERIFY platform targets are valid and reachable
     `- IF invalid, route to recovery path

  2. BUILD deployment plan
     |- READ platform requirements matrix
     |- MAP media to platform-specific package variants
     |- ORDER targets by strategy priority and urgency
     |- DEFINE retries, fallback route, escalation path
     `- CALCULATE expected dispatch windows

  3. PREPARE platform payloads
     |- TRANSFORM media per platform format
     |- ATTACH metadata and thumbnail artifacts
     |- VALIDATE payload compliance per platform policy
     |- CHECK quality preservation threshold
     `- STAGE payloads for dispatch

  4. EXECUTE rapid dispatch
     FOR each platform in deployment order:
       |- SEND payload
       |- TRACK latency and delivery status
       |- RETRY within configured limits
       |- FALLBACK when platform rejects
       `- LOG dispatch result

  5. MONITOR rollout health
     |- TRACK success/failure ratio
     |- DETECT multi-platform failure patterns
     |- CLASSIFY issues (policy, formatting, auth, quota, transient)
     |- APPLY auto-recovery where safe
     `- ESCALATE unresolved blockers

  6. COMPUTE distribution effectiveness
     distribution_effectiveness =
       (Dispatch_Speed x 0.35) + (Coverage x 0.30) +
       (Compliance x 0.20) + (Quality_Preservation x 0.15)

     IF distribution_effectiveness < 70:
       |- mark deployment degraded
       `- escalate for intervention

  7. WRITE outputs
     |- WRITE distribution_velocity
     |- WRITE publish_dispatch
     |- WRITE platform_deployment_status
     `- WRITE distribution_recovery_log

  8. RETURN distribution packet
     RETURN {
       "topic_id": topic_id,
       "platforms_targeted": count,
       "platforms_successful": count,
       "distribution_effectiveness": 0-100,
       "escalation_needed": true|false
     }

END FUNCTION
```

---

## 6. DISTRIBUTION_EFFECTIVENESS_SCORING

### Distribution Quality Framework

```
DISTRIBUTION_EFFECTIVENESS_SCORE =
  (Dispatch_Speed x 0.35) +
  (Coverage x 0.30) +
  (Compliance x 0.20) +
  (Quality_Preservation x 0.15)

RANGE: 0-100

THRESHOLDS:
  0-50   -> POOR (deployment unstable, high failure risk)
  50-70  -> ACCEPTABLE (partial success, remediation needed)
  70-100 -> STRONG (rapid, compliant, broad deployment)
```

### Dimension Details

1. **Dispatch_Speed** (0-100)
   - Time-to-first-publish and total rollout time
   - Formula: `(target_time / actual_time x 100)` capped to 100

2. **Coverage** (0-100)
   - Ratio of successful platforms over planned platforms
   - Formula: `(successful_platforms / planned_platforms x 100)`

3. **Compliance** (0-100)
   - Policy and format compliance across all payloads
   - Formula: `(compliant_payloads / total_payloads x 100)`

4. **Quality_Preservation** (0-100)
   - Preservation of content quality after platform transformations
   - Formula: `(quality_passes / total_quality_checks x 100)`

---

## 7. SKILL BINDINGS (Garuda owns/controls 8 core skills)

| Skill_ID | Skill_Name | Archetype | Authority_Level | Primary_Role | Vein_Binding |
|----------|-----------|-----------|-----------------|-------------|--------------|
| M-321 | Distribution Velocity Planner | decision_logic | FULL_CONTROL | Build rapid publish sequence (core) | distribution_velocity |
| M-322 | Multi-Platform Packager | processing | FULL_CONTROL | Generate platform-specific payloads | publish_dispatch |
| M-323 | Metadata Sync Coordinator | processing | CONTROL | Attach and validate metadata | publish_dispatch |
| M-324 | Publish Dispatch Executor | system | FULL_CONTROL | Dispatch payloads to platforms | publish_dispatch |
| M-325 | Rollout Health Monitor | analysis | CONTROL | Monitor deployment state | platform_deployment_status |
| M-326 | Compliance Gate Checker | governance | CONTROL | Validate policy and format compliance | platform_deployment_status |
| M-327 | Dispatch Retry Orchestrator | optimization | CONTROL | Retry and fallback management | distribution_recovery_log |
| M-328 | Distribution Recovery Router | governance | CONTROL | Route unresolved failures to escalation | distribution_recovery_log |

---

## 8. RAPID_DISTRIBUTION_FRAMEWORK

### Deployment Modes

```
STANDARD_DEPLOY:
  Dispatch Pattern: sequenced rollout
  Speed Target: baseline
  Quality Mode: strict preservation
  Cost Profile: baseline

ACCELERATED_DEPLOY:
  Dispatch Pattern: partially parallel rollout
  Speed Target: 1.7x baseline
  Quality Mode: controlled optimization
  Cost Profile: medium

MAX_VELOCITY_DEPLOY:
  Dispatch Pattern: parallel rollout
  Speed Target: 2.5x baseline
  Quality Mode: constrained trade-off
  Cost Profile: high (requires budget gate)
```

### Recovery Routing

```
TRANSIENT_FAILURE -> retry via M-327 (bounded retries)
POLICY_FAILURE    -> route to Yama review
FORMAT_FAILURE    -> repack via M-322 and redispatch
AUTH_FAILURE      -> route to provider/auth remediation
MULTI_FAIL_EVENT  -> escalate to Krishna + WF-900
```

---

## 9. FAILURE SURFACES & RECOVERY

| Failure_Type | Detection_Signal | Recovery_Path | Fallback_Director | SLA |
|-------------|------------------|---------------|-------------------|-----|
| Platform reject | HTTP reject/policy response | Repackage and retry once | Garuda (self-recover) | <60s |
| Auth failure | Token or callback error | Route to auth remediation | Krishna (bridge owner) | <120s |
| Format mismatch | Payload validation fail | Transform payload variant | Garuda (repack) | <90s |
| Quota exhausted | Provider quota alert | Defer or reroute channel | Kubera + Krishna | <90s |
| Multi-platform outage | Concurrent failures >40% | Pause rollout, escalate WF-900 | Krishna | <120s |
| Quality degradation | Quality below threshold | Rollback to prior package profile | Nataraja + Garuda | <120s |

---

## 10. EXECUTION TIERS

**TIER_1 (FULL DISTRIBUTION VELOCITY)**
- All 8 distribution skills active
- Parallel dispatch with active monitoring
- Full retry and recovery handling
- Cost: High
- Use case: time-sensitive launch windows

**TIER_2 (STANDARD RAPID DEPLOY)**
- 6/8 skills active (skip advanced recovery optimization)
- Mixed parallel-sequenced rollout
- Cost: Medium
- Use case: normal priority publishing

**TIER_3 (CONTROLLED DEPLOY)**
- 4/8 skills active (core dispatch only)
- Sequential rollout with minimal retries
- Cost: Low
- Use case: low urgency publishing

---

## 11. HITL TRIGGERS (Manual Intervention)

| Trigger_Type | Condition | Escalation_Path | Required_Action | Time_Limit |
|-------------|-----------|-----------------|-----------------|-----------|
| Policy block | Compliance rejected | Garuda + Yama | approve/rewrite/reject route | 15 min |
| Budget conflict | Cost mode denied | Garuda + Kubera | choose lower tier rollout | 10 min |
| Dispatch collapse | >40% platform failures | Garuda + Krishna | halt and reroute plan | 5 min |
| Metadata conflict | invalid metadata pack | Garuda + Saraswati | metadata correction | 10 min |
| Quality drop | quality <70% post-transform | Garuda + Nataraja | restore quality-safe package | 10 min |

---

## 12. DASHBOARD_VISIBILITY & TELEMETRY

### Public Fields
- **Distribution_Mode**: STANDARD | ACCELERATED | MAX_VELOCITY
- **Platforms_Targeted**: count
- **Platforms_Successful**: count
- **Dispatch_Latency**: avg ms
- **Compliance_Status**: PASS | WARNING | BLOCKED
- **Distribution_Effectiveness**: 0-100

### Audit-Only Fields
- **Dispatch_Event_Log**: per-platform payload and status events
- **Retry_History**: retries and fallback decisions
- **Quality_Preservation_Log**: quality checks per platform package
- **Policy_Blocks**: blocked events and reasons
- **Escalation_Trace**: WF-900 routes and final outcomes

---

## 13. CRITICAL AMBIGUITIES

| Ambiguity | Current State | Resolution | Owner |
|-----------|--------------|-----------|-------|
| Parallel dispatch ceiling | Not fixed | Define safe max concurrent dispatches | Garuda |
| Max retries per platform | Partially defined | Standardize retry caps by platform type | Krishna |
| Quality downgrade tolerance | Not fixed | Lock minimum acceptable quality in policy | Yama |
| Budget acceleration bands | Dynamic | Define deterministic acceleration-cost matrix | Kubera |
| Failover channel strategy | Partial | Establish deterministic failover channel list | Kama |

---

## 14. ACCEPTANCE CRITERIA (DEPLOYMENT GATE)

Yes **READY FOR DEPLOYMENT IF**:
- [ ] All 8 distribution skills callable and tested
- [ ] Multi-platform payload packaging validated
- [ ] Dispatch and retry orchestration working
- [ ] Compliance gates functioning on all target channels
- [ ] Rollout health telemetry visible and accurate
- [ ] Recovery routing tested with failure simulation
- [ ] Budget and policy gate integrations verified
- [ ] End-to-end distribution run validated

---

## 15. RELEASE BLOCKING STATUS

**RELEASE_BLOCKING: FALSE** (enhancement for accelerated distribution)

System can publish through standard flow without Garuda acceleration, but loses rapid multi-platform velocity and recovery sophistication.

---

## 16. OPERATIONAL NOTES

- **Created**: 2026-04-23
- **Status**: SPECIFICATION COMPLETE
- **Testing Priority**: MEDIUM
- **Next Step**: Integrate with WF-500 and provider bridge WF-022
- **Operational Requirement**: Continuous rollout monitoring during active publish windows
- **Success Metric**: >=70 distribution effectiveness with compliant multi-platform deployment
