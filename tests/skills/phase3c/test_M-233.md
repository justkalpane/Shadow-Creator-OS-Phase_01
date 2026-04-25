# Test Definition: M-233 Music Selection Advisor

## Scope
- Skill file: skills/media_audio/M-233-music-selection-advisor.skill.md
- Packet family: music_packet
- Schema: schemas/packets/music_packet.schema.json
- Dossier target: dossier.media_vein.music_selection_advisor

## Deterministic Test Matrix (18 Cases)
- TEST-PH3C-M-233-001: deterministic phase3c validation case 001
- TEST-PH3C-M-233-002: deterministic phase3c validation case 002
- TEST-PH3C-M-233-003: deterministic phase3c validation case 003
- TEST-PH3C-M-233-004: deterministic phase3c validation case 004
- TEST-PH3C-M-233-005: deterministic phase3c validation case 005
- TEST-PH3C-M-233-006: deterministic phase3c validation case 006
- TEST-PH3C-M-233-007: deterministic phase3c validation case 007
- TEST-PH3C-M-233-008: deterministic phase3c validation case 008
- TEST-PH3C-M-233-009: deterministic phase3c validation case 009
- TEST-PH3C-M-233-010: deterministic phase3c validation case 010
- TEST-PH3C-M-233-011: deterministic phase3c validation case 011
- TEST-PH3C-M-233-012: deterministic phase3c validation case 012
- TEST-PH3C-M-233-013: deterministic phase3c validation case 013
- TEST-PH3C-M-233-014: deterministic phase3c validation case 014
- TEST-PH3C-M-233-015: deterministic phase3c validation case 015
- TEST-PH3C-M-233-016: deterministic phase3c validation case 016
- TEST-PH3C-M-233-017: deterministic phase3c validation case 017
- TEST-PH3C-M-233-018: deterministic phase3c validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
