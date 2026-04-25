# Test Definition: M-227 Captions and Subtitle Generator

## Scope
- Skill file: skills/media_video/M-227-captions-subtitle-generator.skill.md
- Packet family: caption_packet
- Schema: schemas/packets/caption_packet.schema.json
- Dossier target: dossier.media_vein.captions_subtitle_generator

## Deterministic Test Matrix (18 Cases)
- TEST-PH3B-M-227-001: deterministic phase3b validation case 001
- TEST-PH3B-M-227-002: deterministic phase3b validation case 002
- TEST-PH3B-M-227-003: deterministic phase3b validation case 003
- TEST-PH3B-M-227-004: deterministic phase3b validation case 004
- TEST-PH3B-M-227-005: deterministic phase3b validation case 005
- TEST-PH3B-M-227-006: deterministic phase3b validation case 006
- TEST-PH3B-M-227-007: deterministic phase3b validation case 007
- TEST-PH3B-M-227-008: deterministic phase3b validation case 008
- TEST-PH3B-M-227-009: deterministic phase3b validation case 009
- TEST-PH3B-M-227-010: deterministic phase3b validation case 010
- TEST-PH3B-M-227-011: deterministic phase3b validation case 011
- TEST-PH3B-M-227-012: deterministic phase3b validation case 012
- TEST-PH3B-M-227-013: deterministic phase3b validation case 013
- TEST-PH3B-M-227-014: deterministic phase3b validation case 014
- TEST-PH3B-M-227-015: deterministic phase3b validation case 015
- TEST-PH3B-M-227-016: deterministic phase3b validation case 016
- TEST-PH3B-M-227-017: deterministic phase3b validation case 017
- TEST-PH3B-M-227-018: deterministic phase3b validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
