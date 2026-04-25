# Test Definition: M-212 Dark Mode Variant Generator

## Scope
- Skill file: skills/media_graphics/M-212-dark-mode-variant-generator.skill.md
- Packet family: dark_mode_packet
- Schema: schemas/packets/dark_mode_packet.schema.json
- Dossier target: dossier.media_vein.dark_mode_variant_generator

## Deterministic Test Matrix (18 Cases)
- TEST-PH3A-M-212-001: deterministic phase3a validation case 001
- TEST-PH3A-M-212-002: deterministic phase3a validation case 002
- TEST-PH3A-M-212-003: deterministic phase3a validation case 003
- TEST-PH3A-M-212-004: deterministic phase3a validation case 004
- TEST-PH3A-M-212-005: deterministic phase3a validation case 005
- TEST-PH3A-M-212-006: deterministic phase3a validation case 006
- TEST-PH3A-M-212-007: deterministic phase3a validation case 007
- TEST-PH3A-M-212-008: deterministic phase3a validation case 008
- TEST-PH3A-M-212-009: deterministic phase3a validation case 009
- TEST-PH3A-M-212-010: deterministic phase3a validation case 010
- TEST-PH3A-M-212-011: deterministic phase3a validation case 011
- TEST-PH3A-M-212-012: deterministic phase3a validation case 012
- TEST-PH3A-M-212-013: deterministic phase3a validation case 013
- TEST-PH3A-M-212-014: deterministic phase3a validation case 014
- TEST-PH3A-M-212-015: deterministic phase3a validation case 015
- TEST-PH3A-M-212-016: deterministic phase3a validation case 016
- TEST-PH3A-M-212-017: deterministic phase3a validation case 017
- TEST-PH3A-M-212-018: deterministic phase3a validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
