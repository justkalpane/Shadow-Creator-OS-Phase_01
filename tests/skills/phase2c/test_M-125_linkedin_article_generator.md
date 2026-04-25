# Test Definition: M-125 LinkedIn Article Generator

## Scope
- Skill file: skills\swarm_expansion\M-125-retention-drop-detector.skill.md
- Packet family: linkedin_packet
- Schema: schemas/packets/linkedin_packet.schema.json
- Dossier target: dossier.script_vein.linkedin_article_generator

## Deterministic Test Matrix (18 Cases)
- TEST-PH2C-M-125-001: Valid required inputs produce deterministic linkedin_packet output
- TEST-PH2C-M-125-002: Missing dossier_id routes to WF-900 with explicit validation error
- TEST-PH2C-M-125-003: Missing base input payload routes to WF-900 without packet emission
- TEST-PH2C-M-125-004: Unsupported route_id resolves via deterministic fallback and logs route correction
- TEST-PH2C-M-125-005: Platform constraints are enforced without random branch selection
- TEST-PH2C-M-125-006: Primary output field article_text is present and non-empty
- TEST-PH2C-M-125-007: Variant generation creates exactly 3 bounded variants when requested
- TEST-PH2C-M-125-008: Governance safety check blocks forbidden claims and routes to WF-900
- TEST-PH2C-M-125-009: Replay request envelope routes to WF-021 with replay-ready context
- TEST-PH2C-M-125-010: Schema validation rejects untyped payload before dossier mutation
- TEST-PH2C-M-125-011: Dossier write target uses dossier.script_vein.linkedin_article_generator only
- TEST-PH2C-M-125-012: Mutation uses append_to_array and never overwrites prior packet history
- TEST-PH2C-M-125-013: se_packet_index row is appended with lineage_reference and instance_id
- TEST-PH2C-M-125-014: Output packet includes timestamp, writer_id, skill_id, instance_id, schema_version
- TEST-PH2C-M-125-015: Downstream routing hint is deterministic for identical input state
- TEST-PH2C-M-125-016: Forbidden mutation attempt is rejected and escalated to WF-900
- TEST-PH2C-M-125-017: Audit entry captures operation, route_id, source packet, and confidence markers
- TEST-PH2C-M-125-018: Acceptance gate fails closed when governance metadata is incomplete

## Pass Condition
- All 18 test cases pass with deterministic outputs.
- Any contract violation routes to WF-900.
- Replay test path routes to WF-021.
