# Test Definition: M-226 Video SEO Optimizer

## Scope
- Skill file: skills/media_video/M-226-video-seo-optimizer.skill.md
- Packet family: video_seo_packet
- Schema: schemas/packets/video_seo_packet.schema.json
- Dossier target: dossier.media_vein.video_seo_optimizer

## Deterministic Test Matrix (18 Cases)
- TEST-PH3B-M-226-001: deterministic phase3b validation case 001
- TEST-PH3B-M-226-002: deterministic phase3b validation case 002
- TEST-PH3B-M-226-003: deterministic phase3b validation case 003
- TEST-PH3B-M-226-004: deterministic phase3b validation case 004
- TEST-PH3B-M-226-005: deterministic phase3b validation case 005
- TEST-PH3B-M-226-006: deterministic phase3b validation case 006
- TEST-PH3B-M-226-007: deterministic phase3b validation case 007
- TEST-PH3B-M-226-008: deterministic phase3b validation case 008
- TEST-PH3B-M-226-009: deterministic phase3b validation case 009
- TEST-PH3B-M-226-010: deterministic phase3b validation case 010
- TEST-PH3B-M-226-011: deterministic phase3b validation case 011
- TEST-PH3B-M-226-012: deterministic phase3b validation case 012
- TEST-PH3B-M-226-013: deterministic phase3b validation case 013
- TEST-PH3B-M-226-014: deterministic phase3b validation case 014
- TEST-PH3B-M-226-015: deterministic phase3b validation case 015
- TEST-PH3B-M-226-016: deterministic phase3b validation case 016
- TEST-PH3B-M-226-017: deterministic phase3b validation case 017
- TEST-PH3B-M-226-018: deterministic phase3b validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
