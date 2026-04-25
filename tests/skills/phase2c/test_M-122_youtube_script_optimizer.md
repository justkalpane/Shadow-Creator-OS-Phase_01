# Test Definition: M-122 YouTube Script Optimizer

## Scope
- Skill file: skills\swarm_expansion\M-122-data-signal-collector.skill.md
- Packet family: youtube_script_packet
- Schema: schemas/packets/youtube_script_packet.schema.json
- Dossier target: dossier.script_vein.youtube_script_optimizer

## Deterministic Test Matrix (18 Cases)
- TEST-PH2C-M-122-001: Valid required inputs produce deterministic youtube_script_packet output
- TEST-PH2C-M-122-002: Missing dossier_id routes to WF-900 with explicit validation error
- TEST-PH2C-M-122-003: Missing base input payload routes to WF-900 without packet emission
- TEST-PH2C-M-122-004: Unsupported route_id resolves via deterministic fallback and logs route correction
- TEST-PH2C-M-122-005: Platform constraints are enforced without random branch selection
- TEST-PH2C-M-122-006: Primary output field chapter_structured_script is present and non-empty
- TEST-PH2C-M-122-007: Variant generation creates exactly 3 bounded variants when requested
- TEST-PH2C-M-122-008: Governance safety check blocks forbidden claims and routes to WF-900
- TEST-PH2C-M-122-009: Replay request envelope routes to WF-021 with replay-ready context
- TEST-PH2C-M-122-010: Schema validation rejects untyped payload before dossier mutation
- TEST-PH2C-M-122-011: Dossier write target uses dossier.script_vein.youtube_script_optimizer only
- TEST-PH2C-M-122-012: Mutation uses append_to_array and never overwrites prior packet history
- TEST-PH2C-M-122-013: se_packet_index row is appended with lineage_reference and instance_id
- TEST-PH2C-M-122-014: Output packet includes timestamp, writer_id, skill_id, instance_id, schema_version
- TEST-PH2C-M-122-015: Downstream routing hint is deterministic for identical input state
- TEST-PH2C-M-122-016: Forbidden mutation attempt is rejected and escalated to WF-900
- TEST-PH2C-M-122-017: Audit entry captures operation, route_id, source packet, and confidence markers
- TEST-PH2C-M-122-018: Acceptance gate fails closed when governance metadata is incomplete

## Pass Condition
- All 18 test cases pass with deterministic outputs.
- Any contract violation routes to WF-900.
- Replay test path routes to WF-021.
