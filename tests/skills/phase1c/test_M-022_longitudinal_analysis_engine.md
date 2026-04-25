# Test Definition: M-022 Longitudinal Analysis Engine

## Scope
- Skill file: skills/research_intelligence/M-022-knowledge-graph-builder.skill.md
- Packet family: longitudinal_packet
- Schema: schemas/packets/longitudinal_packet.schema.json
- Dossier target: dossier.research_vein.longitudinal_analysis_engine

## Deterministic Test Matrix (18 Cases)
- TEST-PH1C-M-022-001: deterministic validation case 001
- TEST-PH1C-M-022-002: deterministic validation case 002
- TEST-PH1C-M-022-003: deterministic validation case 003
- TEST-PH1C-M-022-004: deterministic validation case 004
- TEST-PH1C-M-022-005: deterministic validation case 005
- TEST-PH1C-M-022-006: deterministic validation case 006
- TEST-PH1C-M-022-007: deterministic validation case 007
- TEST-PH1C-M-022-008: deterministic validation case 008
- TEST-PH1C-M-022-009: deterministic validation case 009
- TEST-PH1C-M-022-010: deterministic validation case 010
- TEST-PH1C-M-022-011: deterministic validation case 011
- TEST-PH1C-M-022-012: deterministic validation case 012
- TEST-PH1C-M-022-013: deterministic validation case 013
- TEST-PH1C-M-022-014: deterministic validation case 014
- TEST-PH1C-M-022-015: deterministic validation case 015
- TEST-PH1C-M-022-016: deterministic validation case 016
- TEST-PH1C-M-022-017: deterministic validation case 017
- TEST-PH1C-M-022-018: deterministic validation case 018

## Pass Condition
- All 18 tests pass with deterministic outputs.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
