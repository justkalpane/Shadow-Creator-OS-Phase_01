# Test Definition: M-206 Brand Consistency Validator

## Scope
- Skill file: skills/media_graphics/M-206-brand-consistency-validator.skill.md
- Packet family: brand_consistency_packet
- Schema: schemas/packets/brand_consistency_packet.schema.json
- Dossier target: dossier.media_vein.brand_consistency_validator

## Deterministic Test Matrix (18 Cases)
- TEST-PH3A-M-206-001: deterministic phase3a validation case 001
- TEST-PH3A-M-206-002: deterministic phase3a validation case 002
- TEST-PH3A-M-206-003: deterministic phase3a validation case 003
- TEST-PH3A-M-206-004: deterministic phase3a validation case 004
- TEST-PH3A-M-206-005: deterministic phase3a validation case 005
- TEST-PH3A-M-206-006: deterministic phase3a validation case 006
- TEST-PH3A-M-206-007: deterministic phase3a validation case 007
- TEST-PH3A-M-206-008: deterministic phase3a validation case 008
- TEST-PH3A-M-206-009: deterministic phase3a validation case 009
- TEST-PH3A-M-206-010: deterministic phase3a validation case 010
- TEST-PH3A-M-206-011: deterministic phase3a validation case 011
- TEST-PH3A-M-206-012: deterministic phase3a validation case 012
- TEST-PH3A-M-206-013: deterministic phase3a validation case 013
- TEST-PH3A-M-206-014: deterministic phase3a validation case 014
- TEST-PH3A-M-206-015: deterministic phase3a validation case 015
- TEST-PH3A-M-206-016: deterministic phase3a validation case 016
- TEST-PH3A-M-206-017: deterministic phase3a validation case 017
- TEST-PH3A-M-206-018: deterministic phase3a validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
