# Test Definition: M-128 Social Media Caption Generator

## Scope
- Skill file: skills\swarm_expansion\M-128-viral-pattern-replicator.skill.md
- Packet family: social_media_packet
- Schema: schemas/packets/social_media_packet.schema.json
- Dossier target: dossier.script_vein.social_media_caption_generator

## Deterministic Test Matrix (18 Cases)
- TEST-PH2C-M-128-001: Valid required inputs produce deterministic social_media_packet output
- TEST-PH2C-M-128-002: Missing dossier_id routes to WF-900 with explicit validation error
- TEST-PH2C-M-128-003: Missing base input payload routes to WF-900 without packet emission
- TEST-PH2C-M-128-004: Unsupported route_id resolves via deterministic fallback and logs route correction
- TEST-PH2C-M-128-005: Platform constraints are enforced without random branch selection
- TEST-PH2C-M-128-006: Primary output field platform_captions is present and non-empty
- TEST-PH2C-M-128-007: Variant generation creates exactly 3 bounded variants when requested
- TEST-PH2C-M-128-008: Governance safety check blocks forbidden claims and routes to WF-900
- TEST-PH2C-M-128-009: Replay request envelope routes to WF-021 with replay-ready context
- TEST-PH2C-M-128-010: Schema validation rejects untyped payload before dossier mutation
- TEST-PH2C-M-128-011: Dossier write target uses dossier.script_vein.social_media_caption_generator only
- TEST-PH2C-M-128-012: Mutation uses append_to_array and never overwrites prior packet history
- TEST-PH2C-M-128-013: se_packet_index row is appended with lineage_reference and instance_id
- TEST-PH2C-M-128-014: Output packet includes timestamp, writer_id, skill_id, instance_id, schema_version
- TEST-PH2C-M-128-015: Downstream routing hint is deterministic for identical input state
- TEST-PH2C-M-128-016: Forbidden mutation attempt is rejected and escalated to WF-900
- TEST-PH2C-M-128-017: Audit entry captures operation, route_id, source packet, and confidence markers
- TEST-PH2C-M-128-018: Acceptance gate fails closed when governance metadata is incomplete

## Pass Condition
- All 18 test cases pass with deterministic outputs.
- Any contract violation routes to WF-900.
- Replay test path routes to WF-021.
