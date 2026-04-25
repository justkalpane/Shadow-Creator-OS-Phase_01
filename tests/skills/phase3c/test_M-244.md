# Test Definition: M-244 Transcript Generator

## Scope
- Skill file: skills/media_audio/M-244-transcript-generator.skill.md
- Packet family: audio_accessibility_packet
- Schema: schemas/packets/audio_accessibility_packet.schema.json
- Dossier target: dossier.media_vein.transcript_generator

## Deterministic Test Matrix (18 Cases)
- TEST-PH3C-M-244-001: deterministic phase3c validation case 001
- TEST-PH3C-M-244-002: deterministic phase3c validation case 002
- TEST-PH3C-M-244-003: deterministic phase3c validation case 003
- TEST-PH3C-M-244-004: deterministic phase3c validation case 004
- TEST-PH3C-M-244-005: deterministic phase3c validation case 005
- TEST-PH3C-M-244-006: deterministic phase3c validation case 006
- TEST-PH3C-M-244-007: deterministic phase3c validation case 007
- TEST-PH3C-M-244-008: deterministic phase3c validation case 008
- TEST-PH3C-M-244-009: deterministic phase3c validation case 009
- TEST-PH3C-M-244-010: deterministic phase3c validation case 010
- TEST-PH3C-M-244-011: deterministic phase3c validation case 011
- TEST-PH3C-M-244-012: deterministic phase3c validation case 012
- TEST-PH3C-M-244-013: deterministic phase3c validation case 013
- TEST-PH3C-M-244-014: deterministic phase3c validation case 014
- TEST-PH3C-M-244-015: deterministic phase3c validation case 015
- TEST-PH3C-M-244-016: deterministic phase3c validation case 016
- TEST-PH3C-M-244-017: deterministic phase3c validation case 017
- TEST-PH3C-M-244-018: deterministic phase3c validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
