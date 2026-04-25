# Test Definition: M-207 Accessibility Analyzer

## Scope
- Skill file: skills/media_graphics/M-207-accessibility-analyzer.skill.md
- Packet family: accessibility_packet
- Schema: schemas/packets/accessibility_packet.schema.json
- Dossier target: dossier.media_vein.accessibility_analyzer

## Deterministic Test Matrix (18 Cases)
- TEST-PH3A-M-207-001: deterministic phase3a validation case 001
- TEST-PH3A-M-207-002: deterministic phase3a validation case 002
- TEST-PH3A-M-207-003: deterministic phase3a validation case 003
- TEST-PH3A-M-207-004: deterministic phase3a validation case 004
- TEST-PH3A-M-207-005: deterministic phase3a validation case 005
- TEST-PH3A-M-207-006: deterministic phase3a validation case 006
- TEST-PH3A-M-207-007: deterministic phase3a validation case 007
- TEST-PH3A-M-207-008: deterministic phase3a validation case 008
- TEST-PH3A-M-207-009: deterministic phase3a validation case 009
- TEST-PH3A-M-207-010: deterministic phase3a validation case 010
- TEST-PH3A-M-207-011: deterministic phase3a validation case 011
- TEST-PH3A-M-207-012: deterministic phase3a validation case 012
- TEST-PH3A-M-207-013: deterministic phase3a validation case 013
- TEST-PH3A-M-207-014: deterministic phase3a validation case 014
- TEST-PH3A-M-207-015: deterministic phase3a validation case 015
- TEST-PH3A-M-207-016: deterministic phase3a validation case 016
- TEST-PH3A-M-207-017: deterministic phase3a validation case 017
- TEST-PH3A-M-207-018: deterministic phase3a validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
