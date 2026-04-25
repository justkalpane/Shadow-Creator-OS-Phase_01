# Test Definition: M-228 Multi-Angle Cut Strategy

## Scope
- Skill file: skills/media_video/M-228-multi-angle-cut-strategy.skill.md
- Packet family: multiangle_packet
- Schema: schemas/packets/multiangle_packet.schema.json
- Dossier target: dossier.media_vein.multi_angle_cut_strategy

## Deterministic Test Matrix (18 Cases)
- TEST-PH3B-M-228-001: deterministic phase3b validation case 001
- TEST-PH3B-M-228-002: deterministic phase3b validation case 002
- TEST-PH3B-M-228-003: deterministic phase3b validation case 003
- TEST-PH3B-M-228-004: deterministic phase3b validation case 004
- TEST-PH3B-M-228-005: deterministic phase3b validation case 005
- TEST-PH3B-M-228-006: deterministic phase3b validation case 006
- TEST-PH3B-M-228-007: deterministic phase3b validation case 007
- TEST-PH3B-M-228-008: deterministic phase3b validation case 008
- TEST-PH3B-M-228-009: deterministic phase3b validation case 009
- TEST-PH3B-M-228-010: deterministic phase3b validation case 010
- TEST-PH3B-M-228-011: deterministic phase3b validation case 011
- TEST-PH3B-M-228-012: deterministic phase3b validation case 012
- TEST-PH3B-M-228-013: deterministic phase3b validation case 013
- TEST-PH3B-M-228-014: deterministic phase3b validation case 014
- TEST-PH3B-M-228-015: deterministic phase3b validation case 015
- TEST-PH3B-M-228-016: deterministic phase3b validation case 016
- TEST-PH3B-M-228-017: deterministic phase3b validation case 017
- TEST-PH3B-M-228-018: deterministic phase3b validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
