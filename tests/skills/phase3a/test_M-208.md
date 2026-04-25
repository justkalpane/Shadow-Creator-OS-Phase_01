# Test Definition: M-208 Image Asset Sourcing Advisor

## Scope
- Skill file: skills/media_graphics/M-208-image-asset-sourcing-advisor.skill.md
- Packet family: asset_library_packet
- Schema: schemas/packets/asset_library_packet.schema.json
- Dossier target: dossier.media_vein.image_asset_sourcing_advisor

## Deterministic Test Matrix (18 Cases)
- TEST-PH3A-M-208-001: deterministic phase3a validation case 001
- TEST-PH3A-M-208-002: deterministic phase3a validation case 002
- TEST-PH3A-M-208-003: deterministic phase3a validation case 003
- TEST-PH3A-M-208-004: deterministic phase3a validation case 004
- TEST-PH3A-M-208-005: deterministic phase3a validation case 005
- TEST-PH3A-M-208-006: deterministic phase3a validation case 006
- TEST-PH3A-M-208-007: deterministic phase3a validation case 007
- TEST-PH3A-M-208-008: deterministic phase3a validation case 008
- TEST-PH3A-M-208-009: deterministic phase3a validation case 009
- TEST-PH3A-M-208-010: deterministic phase3a validation case 010
- TEST-PH3A-M-208-011: deterministic phase3a validation case 011
- TEST-PH3A-M-208-012: deterministic phase3a validation case 012
- TEST-PH3A-M-208-013: deterministic phase3a validation case 013
- TEST-PH3A-M-208-014: deterministic phase3a validation case 014
- TEST-PH3A-M-208-015: deterministic phase3a validation case 015
- TEST-PH3A-M-208-016: deterministic phase3a validation case 016
- TEST-PH3A-M-208-017: deterministic phase3a validation case 017
- TEST-PH3A-M-208-018: deterministic phase3a validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
