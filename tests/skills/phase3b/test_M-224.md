# Test Definition: M-224 Title Card Generator

## Scope
- Skill file: skills/media_video/M-224-title-card-generator.skill.md
- Packet family: title_text_packet
- Schema: schemas/packets/title_text_packet.schema.json
- Dossier target: dossier.media_vein.title_card_generator

## Deterministic Test Matrix (18 Cases)
- TEST-PH3B-M-224-001: deterministic phase3b validation case 001
- TEST-PH3B-M-224-002: deterministic phase3b validation case 002
- TEST-PH3B-M-224-003: deterministic phase3b validation case 003
- TEST-PH3B-M-224-004: deterministic phase3b validation case 004
- TEST-PH3B-M-224-005: deterministic phase3b validation case 005
- TEST-PH3B-M-224-006: deterministic phase3b validation case 006
- TEST-PH3B-M-224-007: deterministic phase3b validation case 007
- TEST-PH3B-M-224-008: deterministic phase3b validation case 008
- TEST-PH3B-M-224-009: deterministic phase3b validation case 009
- TEST-PH3B-M-224-010: deterministic phase3b validation case 010
- TEST-PH3B-M-224-011: deterministic phase3b validation case 011
- TEST-PH3B-M-224-012: deterministic phase3b validation case 012
- TEST-PH3B-M-224-013: deterministic phase3b validation case 013
- TEST-PH3B-M-224-014: deterministic phase3b validation case 014
- TEST-PH3B-M-224-015: deterministic phase3b validation case 015
- TEST-PH3B-M-224-016: deterministic phase3b validation case 016
- TEST-PH3B-M-224-017: deterministic phase3b validation case 017
- TEST-PH3B-M-224-018: deterministic phase3b validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
