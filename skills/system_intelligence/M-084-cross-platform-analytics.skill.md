# M-084 Cross Platform Analytics

## 1. Skill Identity
- Skill ID: M-084
- Skill Name: Cross Platform Analytics
- Vein Assignment: script_vein
- Phase Assignment: PHASE_2A_SCRIPT_CORE
- Owner Director: Nataraja
- Strategic Authority Director: Yama
- Upstream Dependencies: M-083
- Downstream Consumers: M-085
- Escalation Path: WF-900
- Replay Path: WF-021

## 2. Purpose
Deliver deterministic cross platform analytics outputs for governed workflow progression without dossier overwrite behavior.

## 3. DNA Injection
- Apply deterministic-first execution behavior.
- Preserve packet lineage continuity for replay and audit.
- Enforce governance escalation routing to WF-900 for contract failures.
- Enforce replay/remodify routing to WF-021 when rejection or remodify is requested.

## 4. Workflow Injection
- Producer Workflow: CWF-210
- Next Workflow Hint: CWF-220
- Runtime Contract: skill_loader -> packet_validator -> dossier_writer -> packet_index_writer

## 5. Inputs
- Required Inputs:
  - dossier_id
  - route_id
  - execution_context
  - upstream_packet_refs
- Optional Inputs:
  - replay_context
  - operator_notes
  - quality_override_flags

## 6. Execution Logic
1. Resolve skill registry row for M-084 and validate deterministic runtime prerequisites.
2. Load dossier namespace target dossier.script_vein.cross_platform_analytics with append-only write intent.
3. A. Validate required inputs are present and type-safe.
   B. Route missing-input failures to WF-900 with rejection metadata.
4. Resolve upstream lineage references and verify packet integrity before transformation.
5. Execute deterministic transformation graph for cross_platform_analytics.
6. A. Compute quality, governance, and confidence checks.
   B. Fail fast to WF-900 if any hard gate is violated.
7. Build typed output packet m084_packet with schema version lock.
8. Validate packet envelope and payload against schemas/packets/m084_packet.schema.json.
9. Append mutation to dossier target and append row to se_packet_index (no overwrite).
10. Emit completion state with next-workflow recommendation and replay-safe metadata.

## 7. Outputs
- Output Packet Family: m084_packet
- JSON Schema Reference: schemas/packets/m084_packet.schema.json
- Dossier Write Target: dossier.script_vein.cross_platform_analytics
- se_packet_index Registration: REQUIRED for every emitted packet instance.

## 8. Governance
- Error Escalation Workflow: WF-900
- Replay Workflow: WF-021
- Required Mutation Metadata:
  - timestamp
  - writer_id
  - skill_id
  - instance_id
  - schema_version
  - lineage_reference
  - audit_entry

## 9. Tool/Runtime Usage
- Allowed Runtime Components:
  - engine/skill_loader/skill_loader.js
  - engine/packets/packet_validator.js
  - engine/dossier/dossier_writer.js
  - engine/packets/packet_index_writer.js
- Forbidden Runtime Behavior:
  - untyped packet emission
  - non-deterministic branching without contract gates
  - bypassing WF-900 error routing

## 10. Mutation Law
- Allowed Mutations:
  - append_to_array
  - create_new_packet
  - create_new_index_row
  - append_audit_entry
- Forbidden Mutations:
  - overwrite existing dossier fields
  - replace arrays
  - delete prior data
  - mutate historical packets
  - mutate historical approval decisions
  - mutate existing se_packet_index rows

## 11. Best Practices
1. Keep execution deterministic and idempotent within the same input contract.
2. Never emit packets before schema validation passes.
3. Preserve lineage references for replay and audit.
4. Use append-only writes for dossier and packet index.
5. Route all unrecoverable errors to WF-900.
6. Route replay/remodify actions to WF-021.
7. Keep owner and strategic director references registry-valid.
8. Keep workflow routing metadata consistent with workflow_bindings.yaml.
9. Avoid destructive mutation keywords in runtime operations.
10. Preserve schema version in every output packet.
11. Maintain explicit input validation and failure reasons.
12. Record audit entries for every mutation event.

## 12. Validation/Done
- TEST-M-084-001: Deterministic contract case 001 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-002: Deterministic contract case 002 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-003: Deterministic contract case 003 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-004: Deterministic contract case 004 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-005: Deterministic contract case 005 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-006: Deterministic contract case 006 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-007: Deterministic contract case 007 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-008: Deterministic contract case 008 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-009: Deterministic contract case 009 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-010: Deterministic contract case 010 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-011: Deterministic contract case 011 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-012: Deterministic contract case 012 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-013: Deterministic contract case 013 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-014: Deterministic contract case 014 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-015: Deterministic contract case 015 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-016: Deterministic contract case 016 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-017: Deterministic contract case 017 passes with WF-900/WF-021 governance preserved.
- TEST-M-084-018: Deterministic contract case 018 passes with WF-900/WF-021 governance preserved.

Acceptance Criteria:
- 12-section template preserved in exact order.
- 18+ deterministic tests defined.
- WF-900 escalation path explicitly declared.
- WF-021 replay path explicitly declared.
- Output packet is schema-bound and append-only dossier mutation law is enforced.
