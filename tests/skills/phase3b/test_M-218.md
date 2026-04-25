# Test Definition: M-218 Video Editing Script

## Scope
- Skill file: skills/media_video/M-218-video-editing-script.skill.md
- Packet family: editing_sequence_packet
- Schema: schemas/packets/editing_sequence_packet.schema.json
- Dossier target: dossier.media_vein.video_editing_script

## Deterministic Test Matrix (18 Cases)
- TEST-PH3B-M-218-001: deterministic phase3b validation case 001
- TEST-PH3B-M-218-002: deterministic phase3b validation case 002
- TEST-PH3B-M-218-003: deterministic phase3b validation case 003
- TEST-PH3B-M-218-004: deterministic phase3b validation case 004
- TEST-PH3B-M-218-005: deterministic phase3b validation case 005
- TEST-PH3B-M-218-006: deterministic phase3b validation case 006
- TEST-PH3B-M-218-007: deterministic phase3b validation case 007
- TEST-PH3B-M-218-008: deterministic phase3b validation case 008
- TEST-PH3B-M-218-009: deterministic phase3b validation case 009
- TEST-PH3B-M-218-010: deterministic phase3b validation case 010
- TEST-PH3B-M-218-011: deterministic phase3b validation case 011
- TEST-PH3B-M-218-012: deterministic phase3b validation case 012
- TEST-PH3B-M-218-013: deterministic phase3b validation case 013
- TEST-PH3B-M-218-014: deterministic phase3b validation case 014
- TEST-PH3B-M-218-015: deterministic phase3b validation case 015
- TEST-PH3B-M-218-016: deterministic phase3b validation case 016
- TEST-PH3B-M-218-017: deterministic phase3b validation case 017
- TEST-PH3B-M-218-018: deterministic phase3b validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
