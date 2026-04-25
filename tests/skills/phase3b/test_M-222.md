# Test Definition: M-222 Video Transitions Optimizer

## Scope
- Skill file: skills/media_video/M-222-video-transitions-optimizer.skill.md
- Packet family: transition_packet
- Schema: schemas/packets/transition_packet.schema.json
- Dossier target: dossier.media_vein.video_transitions_optimizer

## Deterministic Test Matrix (18 Cases)
- TEST-PH3B-M-222-001: deterministic phase3b validation case 001
- TEST-PH3B-M-222-002: deterministic phase3b validation case 002
- TEST-PH3B-M-222-003: deterministic phase3b validation case 003
- TEST-PH3B-M-222-004: deterministic phase3b validation case 004
- TEST-PH3B-M-222-005: deterministic phase3b validation case 005
- TEST-PH3B-M-222-006: deterministic phase3b validation case 006
- TEST-PH3B-M-222-007: deterministic phase3b validation case 007
- TEST-PH3B-M-222-008: deterministic phase3b validation case 008
- TEST-PH3B-M-222-009: deterministic phase3b validation case 009
- TEST-PH3B-M-222-010: deterministic phase3b validation case 010
- TEST-PH3B-M-222-011: deterministic phase3b validation case 011
- TEST-PH3B-M-222-012: deterministic phase3b validation case 012
- TEST-PH3B-M-222-013: deterministic phase3b validation case 013
- TEST-PH3B-M-222-014: deterministic phase3b validation case 014
- TEST-PH3B-M-222-015: deterministic phase3b validation case 015
- TEST-PH3B-M-222-016: deterministic phase3b validation case 016
- TEST-PH3B-M-222-017: deterministic phase3b validation case 017
- TEST-PH3B-M-222-018: deterministic phase3b validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
