# Test Definition: M-216 Shot List Generator

## Scope
- Skill file: skills/media_video/M-216-shot-list-generator.skill.md
- Packet family: shot_list_packet
- Schema: schemas/packets/shot_list_packet.schema.json
- Dossier target: dossier.media_vein.shot_list_generator

## Deterministic Test Matrix (18 Cases)
- TEST-PH3B-M-216-001: deterministic phase3b validation case 001
- TEST-PH3B-M-216-002: deterministic phase3b validation case 002
- TEST-PH3B-M-216-003: deterministic phase3b validation case 003
- TEST-PH3B-M-216-004: deterministic phase3b validation case 004
- TEST-PH3B-M-216-005: deterministic phase3b validation case 005
- TEST-PH3B-M-216-006: deterministic phase3b validation case 006
- TEST-PH3B-M-216-007: deterministic phase3b validation case 007
- TEST-PH3B-M-216-008: deterministic phase3b validation case 008
- TEST-PH3B-M-216-009: deterministic phase3b validation case 009
- TEST-PH3B-M-216-010: deterministic phase3b validation case 010
- TEST-PH3B-M-216-011: deterministic phase3b validation case 011
- TEST-PH3B-M-216-012: deterministic phase3b validation case 012
- TEST-PH3B-M-216-013: deterministic phase3b validation case 013
- TEST-PH3B-M-216-014: deterministic phase3b validation case 014
- TEST-PH3B-M-216-015: deterministic phase3b validation case 015
- TEST-PH3B-M-216-016: deterministic phase3b validation case 016
- TEST-PH3B-M-216-017: deterministic phase3b validation case 017
- TEST-PH3B-M-216-018: deterministic phase3b validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
