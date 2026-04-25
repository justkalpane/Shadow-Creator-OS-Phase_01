# Test Definition: M-235 Acoustic Environment Analyzer

## Scope
- Skill file: skills/media_audio/M-235-acoustic-environment-analyzer.skill.md
- Packet family: acoustics_packet
- Schema: schemas/packets/acoustics_packet.schema.json
- Dossier target: dossier.media_vein.acoustic_environment_analyzer

## Deterministic Test Matrix (18 Cases)
- TEST-PH3C-M-235-001: deterministic phase3c validation case 001
- TEST-PH3C-M-235-002: deterministic phase3c validation case 002
- TEST-PH3C-M-235-003: deterministic phase3c validation case 003
- TEST-PH3C-M-235-004: deterministic phase3c validation case 004
- TEST-PH3C-M-235-005: deterministic phase3c validation case 005
- TEST-PH3C-M-235-006: deterministic phase3c validation case 006
- TEST-PH3C-M-235-007: deterministic phase3c validation case 007
- TEST-PH3C-M-235-008: deterministic phase3c validation case 008
- TEST-PH3C-M-235-009: deterministic phase3c validation case 009
- TEST-PH3C-M-235-010: deterministic phase3c validation case 010
- TEST-PH3C-M-235-011: deterministic phase3c validation case 011
- TEST-PH3C-M-235-012: deterministic phase3c validation case 012
- TEST-PH3C-M-235-013: deterministic phase3c validation case 013
- TEST-PH3C-M-235-014: deterministic phase3c validation case 014
- TEST-PH3C-M-235-015: deterministic phase3c validation case 015
- TEST-PH3C-M-235-016: deterministic phase3c validation case 016
- TEST-PH3C-M-235-017: deterministic phase3c validation case 017
- TEST-PH3C-M-235-018: deterministic phase3c validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
