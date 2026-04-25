# Test Definition: M-237 Audio Levels and Normalization

## Scope
- Skill file: skills/media_audio/M-237-audio-levels-normalization.skill.md
- Packet family: levels_packet
- Schema: schemas/packets/levels_packet.schema.json
- Dossier target: dossier.media_vein.audio_levels_normalization

## Deterministic Test Matrix (18 Cases)
- TEST-PH3C-M-237-001: deterministic phase3c validation case 001
- TEST-PH3C-M-237-002: deterministic phase3c validation case 002
- TEST-PH3C-M-237-003: deterministic phase3c validation case 003
- TEST-PH3C-M-237-004: deterministic phase3c validation case 004
- TEST-PH3C-M-237-005: deterministic phase3c validation case 005
- TEST-PH3C-M-237-006: deterministic phase3c validation case 006
- TEST-PH3C-M-237-007: deterministic phase3c validation case 007
- TEST-PH3C-M-237-008: deterministic phase3c validation case 008
- TEST-PH3C-M-237-009: deterministic phase3c validation case 009
- TEST-PH3C-M-237-010: deterministic phase3c validation case 010
- TEST-PH3C-M-237-011: deterministic phase3c validation case 011
- TEST-PH3C-M-237-012: deterministic phase3c validation case 012
- TEST-PH3C-M-237-013: deterministic phase3c validation case 013
- TEST-PH3C-M-237-014: deterministic phase3c validation case 014
- TEST-PH3C-M-237-015: deterministic phase3c validation case 015
- TEST-PH3C-M-237-016: deterministic phase3c validation case 016
- TEST-PH3C-M-237-017: deterministic phase3c validation case 017
- TEST-PH3C-M-237-018: deterministic phase3c validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
