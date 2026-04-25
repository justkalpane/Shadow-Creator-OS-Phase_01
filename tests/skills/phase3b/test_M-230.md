# Test Definition: M-230 Platform-Specific Video Adapter

## Scope
- Skill file: skills/media_video/M-230-platform-specific-video-adapter.skill.md
- Packet family: platform_video_packet
- Schema: schemas/packets/platform_video_packet.schema.json
- Dossier target: dossier.media_vein.platform_specific_video_adapter

## Deterministic Test Matrix (18 Cases)
- TEST-PH3B-M-230-001: deterministic phase3b validation case 001
- TEST-PH3B-M-230-002: deterministic phase3b validation case 002
- TEST-PH3B-M-230-003: deterministic phase3b validation case 003
- TEST-PH3B-M-230-004: deterministic phase3b validation case 004
- TEST-PH3B-M-230-005: deterministic phase3b validation case 005
- TEST-PH3B-M-230-006: deterministic phase3b validation case 006
- TEST-PH3B-M-230-007: deterministic phase3b validation case 007
- TEST-PH3B-M-230-008: deterministic phase3b validation case 008
- TEST-PH3B-M-230-009: deterministic phase3b validation case 009
- TEST-PH3B-M-230-010: deterministic phase3b validation case 010
- TEST-PH3B-M-230-011: deterministic phase3b validation case 011
- TEST-PH3B-M-230-012: deterministic phase3b validation case 012
- TEST-PH3B-M-230-013: deterministic phase3b validation case 013
- TEST-PH3B-M-230-014: deterministic phase3b validation case 014
- TEST-PH3B-M-230-015: deterministic phase3b validation case 015
- TEST-PH3B-M-230-016: deterministic phase3b validation case 016
- TEST-PH3B-M-230-017: deterministic phase3b validation case 017
- TEST-PH3B-M-230-018: deterministic phase3b validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
