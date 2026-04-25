# Test Definition: M-229 Video Performance Predictor

## Scope
- Skill file: skills/media_video/M-229-video-performance-predictor.skill.md
- Packet family: performance_prediction_packet
- Schema: schemas/packets/performance_prediction_packet.schema.json
- Dossier target: dossier.media_vein.video_performance_predictor

## Deterministic Test Matrix (18 Cases)
- TEST-PH3B-M-229-001: deterministic phase3b validation case 001
- TEST-PH3B-M-229-002: deterministic phase3b validation case 002
- TEST-PH3B-M-229-003: deterministic phase3b validation case 003
- TEST-PH3B-M-229-004: deterministic phase3b validation case 004
- TEST-PH3B-M-229-005: deterministic phase3b validation case 005
- TEST-PH3B-M-229-006: deterministic phase3b validation case 006
- TEST-PH3B-M-229-007: deterministic phase3b validation case 007
- TEST-PH3B-M-229-008: deterministic phase3b validation case 008
- TEST-PH3B-M-229-009: deterministic phase3b validation case 009
- TEST-PH3B-M-229-010: deterministic phase3b validation case 010
- TEST-PH3B-M-229-011: deterministic phase3b validation case 011
- TEST-PH3B-M-229-012: deterministic phase3b validation case 012
- TEST-PH3B-M-229-013: deterministic phase3b validation case 013
- TEST-PH3B-M-229-014: deterministic phase3b validation case 014
- TEST-PH3B-M-229-015: deterministic phase3b validation case 015
- TEST-PH3B-M-229-016: deterministic phase3b validation case 016
- TEST-PH3B-M-229-017: deterministic phase3b validation case 017
- TEST-PH3B-M-229-018: deterministic phase3b validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
