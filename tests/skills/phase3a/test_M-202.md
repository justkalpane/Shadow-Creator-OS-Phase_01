# Test Definition: M-202 Color Palette Optimizer

## Scope
- Skill file: skills/media_graphics/M-202-color-palette-optimizer.skill.md
- Packet family: color_palette_packet
- Schema: schemas/packets/color_palette_packet.schema.json
- Dossier target: dossier.media_vein.color_palette_optimizer

## Deterministic Test Matrix (18 Cases)
- TEST-PH3A-M-202-001: deterministic phase3a validation case 001
- TEST-PH3A-M-202-002: deterministic phase3a validation case 002
- TEST-PH3A-M-202-003: deterministic phase3a validation case 003
- TEST-PH3A-M-202-004: deterministic phase3a validation case 004
- TEST-PH3A-M-202-005: deterministic phase3a validation case 005
- TEST-PH3A-M-202-006: deterministic phase3a validation case 006
- TEST-PH3A-M-202-007: deterministic phase3a validation case 007
- TEST-PH3A-M-202-008: deterministic phase3a validation case 008
- TEST-PH3A-M-202-009: deterministic phase3a validation case 009
- TEST-PH3A-M-202-010: deterministic phase3a validation case 010
- TEST-PH3A-M-202-011: deterministic phase3a validation case 011
- TEST-PH3A-M-202-012: deterministic phase3a validation case 012
- TEST-PH3A-M-202-013: deterministic phase3a validation case 013
- TEST-PH3A-M-202-014: deterministic phase3a validation case 014
- TEST-PH3A-M-202-015: deterministic phase3a validation case 015
- TEST-PH3A-M-202-016: deterministic phase3a validation case 016
- TEST-PH3A-M-202-017: deterministic phase3a validation case 017
- TEST-PH3A-M-202-018: deterministic phase3a validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
