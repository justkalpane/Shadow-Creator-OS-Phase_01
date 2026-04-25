# Test Definition: M-225 Thumbnail Designer

## Scope
- Skill file: skills/media_video/M-225-thumbnail-designer.skill.md
- Packet family: thumbnail_packet
- Schema: schemas/packets/thumbnail_packet.schema.json
- Dossier target: dossier.media_vein.thumbnail_designer

## Deterministic Test Matrix (18 Cases)
- TEST-PH3B-M-225-001: deterministic phase3b validation case 001
- TEST-PH3B-M-225-002: deterministic phase3b validation case 002
- TEST-PH3B-M-225-003: deterministic phase3b validation case 003
- TEST-PH3B-M-225-004: deterministic phase3b validation case 004
- TEST-PH3B-M-225-005: deterministic phase3b validation case 005
- TEST-PH3B-M-225-006: deterministic phase3b validation case 006
- TEST-PH3B-M-225-007: deterministic phase3b validation case 007
- TEST-PH3B-M-225-008: deterministic phase3b validation case 008
- TEST-PH3B-M-225-009: deterministic phase3b validation case 009
- TEST-PH3B-M-225-010: deterministic phase3b validation case 010
- TEST-PH3B-M-225-011: deterministic phase3b validation case 011
- TEST-PH3B-M-225-012: deterministic phase3b validation case 012
- TEST-PH3B-M-225-013: deterministic phase3b validation case 013
- TEST-PH3B-M-225-014: deterministic phase3b validation case 014
- TEST-PH3B-M-225-015: deterministic phase3b validation case 015
- TEST-PH3B-M-225-016: deterministic phase3b validation case 016
- TEST-PH3B-M-225-017: deterministic phase3b validation case 017
- TEST-PH3B-M-225-018: deterministic phase3b validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
