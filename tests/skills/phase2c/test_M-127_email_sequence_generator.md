# Test Definition: M-127 Email Sequence Generator

## Scope
- Skill file: skills\swarm_expansion\M-127-viral-pattern-library.skill.md
- Packet family: email_sequence_packet
- Schema: schemas/packets/email_sequence_packet.schema.json
- Dossier target: dossier.script_vein.email_sequence_generator

## Deterministic Test Matrix (18 Cases)
- TEST-PH2C-M-127-001: Valid required inputs produce deterministic email_sequence_packet output
- TEST-PH2C-M-127-002: Missing dossier_id routes to WF-900 with explicit validation error
- TEST-PH2C-M-127-003: Missing base input payload routes to WF-900 without packet emission
- TEST-PH2C-M-127-004: Unsupported route_id resolves via deterministic fallback and logs route correction
- TEST-PH2C-M-127-005: Platform constraints are enforced without random branch selection
- TEST-PH2C-M-127-006: Primary output field email_templates is present and non-empty
- TEST-PH2C-M-127-007: Variant generation creates exactly 3 bounded variants when requested
- TEST-PH2C-M-127-008: Governance safety check blocks forbidden claims and routes to WF-900
- TEST-PH2C-M-127-009: Replay request envelope routes to WF-021 with replay-ready context
- TEST-PH2C-M-127-010: Schema validation rejects untyped payload before dossier mutation
- TEST-PH2C-M-127-011: Dossier write target uses dossier.script_vein.email_sequence_generator only
- TEST-PH2C-M-127-012: Mutation uses append_to_array and never overwrites prior packet history
- TEST-PH2C-M-127-013: se_packet_index row is appended with lineage_reference and instance_id
- TEST-PH2C-M-127-014: Output packet includes timestamp, writer_id, skill_id, instance_id, schema_version
- TEST-PH2C-M-127-015: Downstream routing hint is deterministic for identical input state
- TEST-PH2C-M-127-016: Forbidden mutation attempt is rejected and escalated to WF-900
- TEST-PH2C-M-127-017: Audit entry captures operation, route_id, source packet, and confidence markers
- TEST-PH2C-M-127-018: Acceptance gate fails closed when governance metadata is incomplete

## Pass Condition
- All 18 test cases pass with deterministic outputs.
- Any contract violation routes to WF-900.
- Replay test path routes to WF-021.
