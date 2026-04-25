# Test Definition: M-236 Noise Reduction Strategy

## Scope
- Skill file: skills/media_audio/M-236-noise-reduction-strategy.skill.md
- Packet family: noise_reduction_packet
- Schema: schemas/packets/noise_reduction_packet.schema.json
- Dossier target: dossier.media_vein.noise_reduction_strategy

## Deterministic Test Matrix (18 Cases)
- TEST-PH3C-M-236-001: deterministic phase3c validation case 001
- TEST-PH3C-M-236-002: deterministic phase3c validation case 002
- TEST-PH3C-M-236-003: deterministic phase3c validation case 003
- TEST-PH3C-M-236-004: deterministic phase3c validation case 004
- TEST-PH3C-M-236-005: deterministic phase3c validation case 005
- TEST-PH3C-M-236-006: deterministic phase3c validation case 006
- TEST-PH3C-M-236-007: deterministic phase3c validation case 007
- TEST-PH3C-M-236-008: deterministic phase3c validation case 008
- TEST-PH3C-M-236-009: deterministic phase3c validation case 009
- TEST-PH3C-M-236-010: deterministic phase3c validation case 010
- TEST-PH3C-M-236-011: deterministic phase3c validation case 011
- TEST-PH3C-M-236-012: deterministic phase3c validation case 012
- TEST-PH3C-M-236-013: deterministic phase3c validation case 013
- TEST-PH3C-M-236-014: deterministic phase3c validation case 014
- TEST-PH3C-M-236-015: deterministic phase3c validation case 015
- TEST-PH3C-M-236-016: deterministic phase3c validation case 016
- TEST-PH3C-M-236-017: deterministic phase3c validation case 017
- TEST-PH3C-M-236-018: deterministic phase3c validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
