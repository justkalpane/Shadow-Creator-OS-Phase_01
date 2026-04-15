# Shadow Creator OS — Phase 1

This repo is the static source-of-truth for the current Phase-1 n8n-first build.

## Purpose
- hold workflow JSON shells
- hold workflow manifests
- hold registries and schemas
- hold Data Table bootstrap CSVs
- hold local setup scripts and validation files

## Current posture
- n8n-first
- local-first on Windows laptop
- one local n8n instance only
- one Ollama model at a time
- generic nodes first

## Current Phase-1 order
1. Runtime stabilization
2. Folder creation
3. Ollama verification
4. Five Data Tables
5. WF-000 Health Check
6. WF-900 Error Handler
7. WF-001 Dossier Create
8. WF-010 Parent Orchestrator

## Runtime boundary
Tracked here:
- docs
- registries
- schemas
- manifests
- workflow JSONs
- bootstrap CSVs
- validation files

Not tracked here:
- local secrets
- n8n runtime state
- generated packets
- logs
- binary media
