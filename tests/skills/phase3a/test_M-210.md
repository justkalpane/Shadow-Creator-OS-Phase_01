# Test Definition: M-210 Animation and Transition Specifier

## Scope
- Skill file: skills/media_graphics/M-210-animation-transition-specifier.skill.md
- Packet family: animation_spec_packet
- Schema: schemas/packets/animation_spec_packet.schema.json
- Dossier target: dossier.media_vein.animation_transition_specifier

## Deterministic Test Matrix (18 Cases)
- TEST-PH3A-M-210-001: deterministic phase3a validation case 001
- TEST-PH3A-M-210-002: deterministic phase3a validation case 002
- TEST-PH3A-M-210-003: deterministic phase3a validation case 003
- TEST-PH3A-M-210-004: deterministic phase3a validation case 004
- TEST-PH3A-M-210-005: deterministic phase3a validation case 005
- TEST-PH3A-M-210-006: deterministic phase3a validation case 006
- TEST-PH3A-M-210-007: deterministic phase3a validation case 007
- TEST-PH3A-M-210-008: deterministic phase3a validation case 008
- TEST-PH3A-M-210-009: deterministic phase3a validation case 009
- TEST-PH3A-M-210-010: deterministic phase3a validation case 010
- TEST-PH3A-M-210-011: deterministic phase3a validation case 011
- TEST-PH3A-M-210-012: deterministic phase3a validation case 012
- TEST-PH3A-M-210-013: deterministic phase3a validation case 013
- TEST-PH3A-M-210-014: deterministic phase3a validation case 014
- TEST-PH3A-M-210-015: deterministic phase3a validation case 015
- TEST-PH3A-M-210-016: deterministic phase3a validation case 016
- TEST-PH3A-M-210-017: deterministic phase3a validation case 017
- TEST-PH3A-M-210-018: deterministic phase3a validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
