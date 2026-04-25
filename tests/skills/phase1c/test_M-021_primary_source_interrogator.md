# Test Definition: M-021 Primary Source Interrogator

## Scope
- Skill file: skills/research_intelligence/M-021-fact-cross-verification-unit.skill.md
- Packet family: primary_source_interrogation_packet
- Schema: schemas/packets/primary_source_interrogation_packet.schema.json
- Dossier target: dossier.research_vein.primary_source_interrogator

## Deterministic Test Matrix (18 Cases)
- TEST-PH1C-M-021-001: deterministic validation case 001
- TEST-PH1C-M-021-002: deterministic validation case 002
- TEST-PH1C-M-021-003: deterministic validation case 003
- TEST-PH1C-M-021-004: deterministic validation case 004
- TEST-PH1C-M-021-005: deterministic validation case 005
- TEST-PH1C-M-021-006: deterministic validation case 006
- TEST-PH1C-M-021-007: deterministic validation case 007
- TEST-PH1C-M-021-008: deterministic validation case 008
- TEST-PH1C-M-021-009: deterministic validation case 009
- TEST-PH1C-M-021-010: deterministic validation case 010
- TEST-PH1C-M-021-011: deterministic validation case 011
- TEST-PH1C-M-021-012: deterministic validation case 012
- TEST-PH1C-M-021-013: deterministic validation case 013
- TEST-PH1C-M-021-014: deterministic validation case 014
- TEST-PH1C-M-021-015: deterministic validation case 015
- TEST-PH1C-M-021-016: deterministic validation case 016
- TEST-PH1C-M-021-017: deterministic validation case 017
- TEST-PH1C-M-021-018: deterministic validation case 018

## Pass Condition
- All 18 tests pass with deterministic outputs.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
