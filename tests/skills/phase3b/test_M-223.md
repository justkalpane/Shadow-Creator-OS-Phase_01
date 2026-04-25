# Test Definition: M-223 Pacing and Rhythm Editor

## Scope
- Skill file: skills/media_video/M-223-pacing-rhythm-editor.skill.md
- Packet family: pacing_optimization_packet
- Schema: schemas/packets/pacing_optimization_packet.schema.json
- Dossier target: dossier.media_vein.pacing_rhythm_editor

## Deterministic Test Matrix (18 Cases)
- TEST-PH3B-M-223-001: deterministic phase3b validation case 001
- TEST-PH3B-M-223-002: deterministic phase3b validation case 002
- TEST-PH3B-M-223-003: deterministic phase3b validation case 003
- TEST-PH3B-M-223-004: deterministic phase3b validation case 004
- TEST-PH3B-M-223-005: deterministic phase3b validation case 005
- TEST-PH3B-M-223-006: deterministic phase3b validation case 006
- TEST-PH3B-M-223-007: deterministic phase3b validation case 007
- TEST-PH3B-M-223-008: deterministic phase3b validation case 008
- TEST-PH3B-M-223-009: deterministic phase3b validation case 009
- TEST-PH3B-M-223-010: deterministic phase3b validation case 010
- TEST-PH3B-M-223-011: deterministic phase3b validation case 011
- TEST-PH3B-M-223-012: deterministic phase3b validation case 012
- TEST-PH3B-M-223-013: deterministic phase3b validation case 013
- TEST-PH3B-M-223-014: deterministic phase3b validation case 014
- TEST-PH3B-M-223-015: deterministic phase3b validation case 015
- TEST-PH3B-M-223-016: deterministic phase3b validation case 016
- TEST-PH3B-M-223-017: deterministic phase3b validation case 017
- TEST-PH3B-M-223-018: deterministic phase3b validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
