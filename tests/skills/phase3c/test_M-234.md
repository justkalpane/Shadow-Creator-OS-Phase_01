# Test Definition: M-234 Podcast Audio Optimization

## Scope
- Skill file: skills/media_audio/M-234-podcast-audio-optimization.skill.md
- Packet family: podcast_audio_packet
- Schema: schemas/packets/podcast_audio_packet.schema.json
- Dossier target: dossier.media_vein.podcast_audio_optimization

## Deterministic Test Matrix (18 Cases)
- TEST-PH3C-M-234-001: deterministic phase3c validation case 001
- TEST-PH3C-M-234-002: deterministic phase3c validation case 002
- TEST-PH3C-M-234-003: deterministic phase3c validation case 003
- TEST-PH3C-M-234-004: deterministic phase3c validation case 004
- TEST-PH3C-M-234-005: deterministic phase3c validation case 005
- TEST-PH3C-M-234-006: deterministic phase3c validation case 006
- TEST-PH3C-M-234-007: deterministic phase3c validation case 007
- TEST-PH3C-M-234-008: deterministic phase3c validation case 008
- TEST-PH3C-M-234-009: deterministic phase3c validation case 009
- TEST-PH3C-M-234-010: deterministic phase3c validation case 010
- TEST-PH3C-M-234-011: deterministic phase3c validation case 011
- TEST-PH3C-M-234-012: deterministic phase3c validation case 012
- TEST-PH3C-M-234-013: deterministic phase3c validation case 013
- TEST-PH3C-M-234-014: deterministic phase3c validation case 014
- TEST-PH3C-M-234-015: deterministic phase3c validation case 015
- TEST-PH3C-M-234-016: deterministic phase3c validation case 016
- TEST-PH3C-M-234-017: deterministic phase3c validation case 017
- TEST-PH3C-M-234-018: deterministic phase3c validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
