# Test Definition: M-123 Blog Article Generator

## Scope
- Skill file: skills\swarm_expansion\M-123-algorithm-pattern-analyzer.skill.md
- Packet family: blog_article_packet
- Schema: schemas/packets/blog_article_packet.schema.json
- Dossier target: dossier.script_vein.blog_article_generator

## Deterministic Test Matrix (18 Cases)
- TEST-PH2C-M-123-001: Valid required inputs produce deterministic blog_article_packet output
- TEST-PH2C-M-123-002: Missing dossier_id routes to WF-900 with explicit validation error
- TEST-PH2C-M-123-003: Missing base input payload routes to WF-900 without packet emission
- TEST-PH2C-M-123-004: Unsupported route_id resolves via deterministic fallback and logs route correction
- TEST-PH2C-M-123-005: Platform constraints are enforced without random branch selection
- TEST-PH2C-M-123-006: Primary output field full_article_text is present and non-empty
- TEST-PH2C-M-123-007: Variant generation creates exactly 3 bounded variants when requested
- TEST-PH2C-M-123-008: Governance safety check blocks forbidden claims and routes to WF-900
- TEST-PH2C-M-123-009: Replay request envelope routes to WF-021 with replay-ready context
- TEST-PH2C-M-123-010: Schema validation rejects untyped payload before dossier mutation
- TEST-PH2C-M-123-011: Dossier write target uses dossier.script_vein.blog_article_generator only
- TEST-PH2C-M-123-012: Mutation uses append_to_array and never overwrites prior packet history
- TEST-PH2C-M-123-013: se_packet_index row is appended with lineage_reference and instance_id
- TEST-PH2C-M-123-014: Output packet includes timestamp, writer_id, skill_id, instance_id, schema_version
- TEST-PH2C-M-123-015: Downstream routing hint is deterministic for identical input state
- TEST-PH2C-M-123-016: Forbidden mutation attempt is rejected and escalated to WF-900
- TEST-PH2C-M-123-017: Audit entry captures operation, route_id, source packet, and confidence markers
- TEST-PH2C-M-123-018: Acceptance gate fails closed when governance metadata is incomplete

## Pass Condition
- All 18 test cases pass with deterministic outputs.
- Any contract violation routes to WF-900.
- Replay test path routes to WF-021.
