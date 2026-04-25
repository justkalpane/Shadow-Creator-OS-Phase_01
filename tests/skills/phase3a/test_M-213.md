# Test Definition: M-213 Print-Ready Format Converter

## Scope
- Skill file: skills/media_graphics/M-213-print-ready-format-converter.skill.md
- Packet family: print_adaptation_packet
- Schema: schemas/packets/print_adaptation_packet.schema.json
- Dossier target: dossier.media_vein.print_ready_format_converter

## Deterministic Test Matrix (18 Cases)
- TEST-PH3A-M-213-001: deterministic phase3a validation case 001
- TEST-PH3A-M-213-002: deterministic phase3a validation case 002
- TEST-PH3A-M-213-003: deterministic phase3a validation case 003
- TEST-PH3A-M-213-004: deterministic phase3a validation case 004
- TEST-PH3A-M-213-005: deterministic phase3a validation case 005
- TEST-PH3A-M-213-006: deterministic phase3a validation case 006
- TEST-PH3A-M-213-007: deterministic phase3a validation case 007
- TEST-PH3A-M-213-008: deterministic phase3a validation case 008
- TEST-PH3A-M-213-009: deterministic phase3a validation case 009
- TEST-PH3A-M-213-010: deterministic phase3a validation case 010
- TEST-PH3A-M-213-011: deterministic phase3a validation case 011
- TEST-PH3A-M-213-012: deterministic phase3a validation case 012
- TEST-PH3A-M-213-013: deterministic phase3a validation case 013
- TEST-PH3A-M-213-014: deterministic phase3a validation case 014
- TEST-PH3A-M-213-015: deterministic phase3a validation case 015
- TEST-PH3A-M-213-016: deterministic phase3a validation case 016
- TEST-PH3A-M-213-017: deterministic phase3a validation case 017
- TEST-PH3A-M-213-018: deterministic phase3a validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
