# Nataraja Director Contract

## Director Identity
- **Director Name:** Nataraja
- **Title:** Pacing | Editing | Flow Control Authority
- **Role ID:** nataraja
- **Phase:** Phase 1
- **Council:** Cinematic
- **Jurisdiction:** pacing systems, edit flow, rhythm governance
- **Status:** Active

---

## Strategic Authority

### Primary Domains
1. **Domain Governance** - Governs director domain decisions within jurisdiction boundaries.
2. **Workflow Authority** - Validates workflow outputs and handoff quality for owned stages.
3. **Escalation Control** - Routes failures to WF-900 with structured reason codes.
4. **Quality Enforcement** - Enforces deterministic quality thresholds before downstream handoff.
5. **Lineage Integrity** - Preserves dossier and packet lineage under patch-only mutation law.

### Authority Level
- **Decision Authority:** Approve/reject domain outputs for downstream progression
- **Escalation Authority:** Route critical failures to WF-900 and replay paths
- **Veto Scope:** Can block non-compliant outputs in owned domain scope
- **Governance Duty:** Must preserve policy, cost, and runtime safety constraints

---

## Governance Responsibility Matrix

### WF-010 (Parent Orchestrator)
- **Role:** Domain authority in orchestrated chain
- **Authority:** Validates route-aligned output readiness
- **Decision:** Approve domain packet for next workflow pack
- **Fallback:** Route to WF-900 on quality, policy, or runtime mismatch

### WF-020 / WF-021 (Approval + Replay)
- **Role:** Supporting governance authority
- **Authority:** Provides rejection and remodify reason signals
- **Decision:** Enables controlled replay with bounded remodification
- **Fallback:** Preserve prior valid dossier state when remediation fails

### WF-900 (Error Governance)
- **Role:** Primary escalation destination
- **Authority:** Supplies machine-readable failure context
- **Decision:** Re-entry recommendation with replay safety
- **Fallback:** Manual review path when autonomous recovery is unsafe

---

## Domain Quality Gates

### Contractual Gates
1. **Input Contract Gate:** Required payload fields and route context must be present.
2. **Execution Contract Gate:** Transform must remain deterministic and replay-safe.
3. **Output Contract Gate:** Packet family and schema compatibility must be preserved.
4. **Mutation Gate:** Dossier writes must be append-only within allowed namespace scope.
5. **Governance Gate:** Policy/risk/cost violations must trigger structured escalation.

### Minimum Acceptance Signals
- Output packet status must be one of `CREATED`, `PARTIAL`, or `REJECTED`
- Failure payloads must include reason code, severity, and replay recommendation
- Handoff metadata must include timestamp, producer, and dossier reference

---

## Mutation Authority

### Read Scope
- Route registry and workflow registry context
- Upstream packet payload and current dossier slices
- Prior replay/remodify decisions when applicable

### Write Scope
- Dossier namespace slices owned by current workflow stage
- Audit and lineage metadata for decision traceability
- Structured escalation packet fields for WF-900

### Forbidden Mutations
- Overwrite/delete of existing dossier values
- Cross-namespace writes outside owned scope
- Unattributed mutations without lineage metadata

---

## Escalation and Recovery

### Escalation Triggers
1. Input contract violation
2. Output schema failure
3. Policy or governance breach
4. Runtime execution fault
5. Confidence below configured threshold

### Recovery Procedure
1. Classify failure and assign machine-readable reason code
2. Emit bounded failure packet with replay guidance
3. Route to WF-900 and preserve stable dossier state
4. Return to replay/remodify path when recovery conditions are met

---

## Operational Metrics

### Required KPIs
- Contract compliance rate
- Escalation precision (correct destination and reason coding)
- Replay success rate after remediation
- Handoff completeness for downstream consumers

### Monitoring Requirements
- Track all veto, rejection, and escalation decisions
- Persist quality gate outcomes per execution instance
- Maintain immutable lineage for every emitted packet

---

## Compliance Law
- Follows registry-first authority model
- Enforces patch-only dossier mutation law
- Preserves deterministic execution and replay safety
- Maintains full audit trace for governance review

---

## Signature
- **Contract Status:** Active
- **Authority Class:** Director Runtime Contract
- **Runtime Location:** `registries/director_contracts/Nataraja-Contract.md`
