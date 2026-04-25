# Test Definition: M-024 Meta-Analysis Synthesizer

## Scope
- Skill file: skills/topic_intelligence/M-024-topic-finalization-engine.skill.md
- Packet family: meta_analysis_packet
- Schema: schemas/packets/meta_analysis_packet.schema.json
- Dossier target: dossier.research_vein.meta_analysis_synthesizer

## Deterministic Test Matrix (18 Cases)
- TEST-PH1C-M-024-001: deterministic validation case 001
- TEST-PH1C-M-024-002: deterministic validation case 002
- TEST-PH1C-M-024-003: deterministic validation case 003
- TEST-PH1C-M-024-004: deterministic validation case 004
- TEST-PH1C-M-024-005: deterministic validation case 005
- TEST-PH1C-M-024-006: deterministic validation case 006
- TEST-PH1C-M-024-007: deterministic validation case 007
- TEST-PH1C-M-024-008: deterministic validation case 008
- TEST-PH1C-M-024-009: deterministic validation case 009
- TEST-PH1C-M-024-010: deterministic validation case 010
- TEST-PH1C-M-024-011: deterministic validation case 011
- TEST-PH1C-M-024-012: deterministic validation case 012
- TEST-PH1C-M-024-013: deterministic validation case 013
- TEST-PH1C-M-024-014: deterministic validation case 014
- TEST-PH1C-M-024-015: deterministic validation case 015
- TEST-PH1C-M-024-016: deterministic validation case 016
- TEST-PH1C-M-024-017: deterministic validation case 017
- TEST-PH1C-M-024-018: deterministic validation case 018

## Pass Condition
- All 18 tests pass with deterministic outputs.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
