# Test Definition: M-214 Social Media Graphics Optimizer

## Scope
- Skill file: skills/media_graphics/M-214-social-media-graphics-optimizer.skill.md
- Packet family: social_asset_packet
- Schema: schemas/packets/social_asset_packet.schema.json
- Dossier target: dossier.media_vein.social_media_graphics_optimizer

## Deterministic Test Matrix (18 Cases)
- TEST-PH3A-M-214-001: deterministic phase3a validation case 001
- TEST-PH3A-M-214-002: deterministic phase3a validation case 002
- TEST-PH3A-M-214-003: deterministic phase3a validation case 003
- TEST-PH3A-M-214-004: deterministic phase3a validation case 004
- TEST-PH3A-M-214-005: deterministic phase3a validation case 005
- TEST-PH3A-M-214-006: deterministic phase3a validation case 006
- TEST-PH3A-M-214-007: deterministic phase3a validation case 007
- TEST-PH3A-M-214-008: deterministic phase3a validation case 008
- TEST-PH3A-M-214-009: deterministic phase3a validation case 009
- TEST-PH3A-M-214-010: deterministic phase3a validation case 010
- TEST-PH3A-M-214-011: deterministic phase3a validation case 011
- TEST-PH3A-M-214-012: deterministic phase3a validation case 012
- TEST-PH3A-M-214-013: deterministic phase3a validation case 013
- TEST-PH3A-M-214-014: deterministic phase3a validation case 014
- TEST-PH3A-M-214-015: deterministic phase3a validation case 015
- TEST-PH3A-M-214-016: deterministic phase3a validation case 016
- TEST-PH3A-M-214-017: deterministic phase3a validation case 017
- TEST-PH3A-M-214-018: deterministic phase3a validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
