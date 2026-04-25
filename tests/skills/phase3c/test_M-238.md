# Test Definition: M-238 Compression and EQ Specifications

## Scope
- Skill file: skills/media_audio/M-238-compression-eq-specifications.skill.md
- Packet family: compression_eq_packet
- Schema: schemas/packets/compression_eq_packet.schema.json
- Dossier target: dossier.media_vein.compression_eq_specifications

## Deterministic Test Matrix (18 Cases)
- TEST-PH3C-M-238-001: deterministic phase3c validation case 001
- TEST-PH3C-M-238-002: deterministic phase3c validation case 002
- TEST-PH3C-M-238-003: deterministic phase3c validation case 003
- TEST-PH3C-M-238-004: deterministic phase3c validation case 004
- TEST-PH3C-M-238-005: deterministic phase3c validation case 005
- TEST-PH3C-M-238-006: deterministic phase3c validation case 006
- TEST-PH3C-M-238-007: deterministic phase3c validation case 007
- TEST-PH3C-M-238-008: deterministic phase3c validation case 008
- TEST-PH3C-M-238-009: deterministic phase3c validation case 009
- TEST-PH3C-M-238-010: deterministic phase3c validation case 010
- TEST-PH3C-M-238-011: deterministic phase3c validation case 011
- TEST-PH3C-M-238-012: deterministic phase3c validation case 012
- TEST-PH3C-M-238-013: deterministic phase3c validation case 013
- TEST-PH3C-M-238-014: deterministic phase3c validation case 014
- TEST-PH3C-M-238-015: deterministic phase3c validation case 015
- TEST-PH3C-M-238-016: deterministic phase3c validation case 016
- TEST-PH3C-M-238-017: deterministic phase3c validation case 017
- TEST-PH3C-M-238-018: deterministic phase3c validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
