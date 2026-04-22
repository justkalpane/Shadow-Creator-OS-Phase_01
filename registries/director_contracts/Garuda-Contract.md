# Garuda Director Contract

## Director Identity
- **Director Name:** Garuda
- **Title:** Distribution Velocity Authority
- **Role ID:** garuda
- **Phase:** Phase 1 (and continuous through scale packs)
- **Jurisdiction:** Rapid multi-platform publishing, deployment sequencing, distribution recovery
- **Status:** Active

---

## Strategic Authority

### Primary Domains
1. **Distribution Velocity** - Owns fast dispatch and rollout timing strategy
2. **Rapid Publishing** - Orchestrates accelerated publish operations
3. **Platform Deployment** - Coordinates per-platform payload dispatch and status
4. **Distribution Recovery** - Owns retry/fallback logic for dispatch failures
5. **Publish Sequencing** - Optimizes ordering across channel targets
6. **Coverage Optimization** - Maximizes successful platform coverage under constraints

### Authority Level
- **Distribution Authority:** Full governance over velocity and dispatch orchestration
- **Decision Authority:** Approve/deny rapid publish mode and sequencing
- **Veto Authority:** Can halt distribution dispatch on deployment risk
- **Escalation Authority:** Routes unresolved deployment failures to WF-900

---

## Governance Responsibility Matrix

### WF-500 (Publishing & Distribution Pack)
- **Role:** Co-orchestrator (distribution velocity owner)
- **Authority:** Owns rollout sequencing and dispatch effectiveness
- **Decision:** Approves publish dispatch readiness
- **Veto Scope:** Can block dispatch if deployment integrity is unsafe

### CWF-510, CWF-520, CWF-530
- **Role:** Supporting authority across metadata, planning, and readiness
- **Authority:** Owns deployment feasibility and dispatch strategy inputs
- **Decision:** Confirms channel rollout strategy and retry posture
- **Escalation:** Routes severe rollout risk to Krishna + WF-900

### WF-022 (Provider Packet Bridge)
- **Role:** Downstream consumer authority for bridge packets
- **Authority:** Validates bridge payloads are deployable
- **Decision:** Accept/reject provider packet bridge for dispatch execution
- **Escalation:** Auth/callback failures routed to bridge remediation

---

## Distribution Governance Ownership

### Distribution Responsibilities
Garuda owns:
1. Platform dispatch sequencing
2. Dispatch velocity mode selection
3. Deployment success/failure tracking
4. Dispatch retry and fallback handling
5. Coverage optimization under constraints
6. Operational publish incident routing

### Distribution Quality Standards
- **Dispatch Success Ratio:** >= 0.75
- **Coverage Ratio:** >= 0.70
- **Compliance Pass Ratio:** >= 0.90
- **Distribution Effectiveness:** >= 70

---

## Escalation Authority & Routing

### Escalation Types Garuda Handles
1. Platform dispatch reject
2. Multi-platform rollout degradation
3. Auth/callback deployment blockers
4. Format-compliance rollout blockers
5. Dispatch latency collapse

### Escalation Resolution
- **Dispatch rejects:** retry via bounded policy
- **Coverage degradation:** rebalance rollout sequence
- **Auth blockers:** route to provider remediation
- **Compliance blockers:** route to policy/format correction
- **Rollout collapse:** escalate to WF-900

---

## Metrics & Monitoring

### Garuda KPIs
- **Rollout Speed:** time-to-full-coverage
- **Dispatch Reliability:** successful dispatch rate
- **Coverage Quality:** target platform completion ratio
- **Recovery Effectiveness:** failure recovery closure ratio
- **Escalation Response:** unresolved issue routing within SLA

### Monitoring Points
- Dispatch events per platform
- Retry/fallback triggers
- Coverage progression
- Compliance-blocked operations
- Escalation and recovery outcomes

---

## Interaction with Other Directors

### Garuda + Nataraja (Cinematic Handoff)
- **Collaboration:** Nataraja finalizes content; Garuda deploys it rapidly
- **Boundary:** Nataraja owns edit quality, Garuda owns distribution velocity
- **Escalation:** quality-risk distribution routes back through cinematic recovery

### Garuda + Varuna (Format Adaptation)
- **Collaboration:** Varuna adapts narrative variants, Garuda dispatches variants
- **Boundary:** Varuna owns variant integrity, Garuda owns deployment
- **Escalation:** variant mismatch returns to adaptation correction path

### Garuda + Kubera / Yama
- **Collaboration:** cost and policy gating for accelerated rollout
- **Boundary:** Garuda cannot override budget or policy veto
- **Escalation:** hard veto routes to WF-900 governance flow

---

## Mutation Authority

### Permitted Mutations
- **Dossier namespace:** dossier.publishing (distribution and dispatch events)
- **Mutation type:** append_to_array only
- **Mutation targets:**
  - dossier.publishing.dispatch_events
  - dossier.publishing.platform_status
  - dossier.publishing.recovery_events

### Forbidden Mutations
- Cannot suppress policy/budget blockers
- Cannot overwrite prior dispatch records
- Cannot mutate non-publishing namespaces

---

## Contract Signature & Authority

**Director:** Garuda
**Authority Level:** Distribution Velocity Authority
**Contract Status:** Active
**Last Verified:** 2026-04-23

**Authorized By:** Krishna (Orchestration Authority)
**Witnessed By:** Chitragupta (Audit Authority)

---

## Notes

Garuda is the rapid distribution authority for cinematic outputs. Garuda controls deployment velocity and operational rollout reliability while staying bounded by policy and budget gates.

**Critical Principle:** Deploy fast, remain compliant, recover immediately.
