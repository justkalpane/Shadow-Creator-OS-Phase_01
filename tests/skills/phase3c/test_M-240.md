# Test Definition: M-240 Audio Mixing Guide

## Scope
- Skill file: skills/media_audio/M-240-audio-mixing-guide.skill.md
- Packet family: mix_master_packet
- Schema: schemas/packets/mix_master_packet.schema.json
- Dossier target: dossier.media_vein.audio_mixing_guide

## Deterministic Test Matrix (18 Cases)
- TEST-PH3C-M-240-001: deterministic phase3c validation case 001
- TEST-PH3C-M-240-002: deterministic phase3c validation case 002
- TEST-PH3C-M-240-003: deterministic phase3c validation case 003
- TEST-PH3C-M-240-004: deterministic phase3c validation case 004
- TEST-PH3C-M-240-005: deterministic phase3c validation case 005
- TEST-PH3C-M-240-006: deterministic phase3c validation case 006
- TEST-PH3C-M-240-007: deterministic phase3c validation case 007
- TEST-PH3C-M-240-008: deterministic phase3c validation case 008
- TEST-PH3C-M-240-009: deterministic phase3c validation case 009
- TEST-PH3C-M-240-010: deterministic phase3c validation case 010
- TEST-PH3C-M-240-011: deterministic phase3c validation case 011
- TEST-PH3C-M-240-012: deterministic phase3c validation case 012
- TEST-PH3C-M-240-013: deterministic phase3c validation case 013
- TEST-PH3C-M-240-014: deterministic phase3c validation case 014
- TEST-PH3C-M-240-015: deterministic phase3c validation case 015
- TEST-PH3C-M-240-016: deterministic phase3c validation case 016
- TEST-PH3C-M-240-017: deterministic phase3c validation case 017
- TEST-PH3C-M-240-018: deterministic phase3c validation case 018

## Pass Condition
- All 18 tests pass under deterministic replay.
- Any contract violation routes to WF-900.
- Replay requests route to WF-021.
