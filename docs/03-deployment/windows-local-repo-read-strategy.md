# Windows Local Repo Read Strategy

## Purpose
This document defines how the local n8n runtime should consume the Phase-1 estate repository on Windows.

## Recommended local path
Clone the repository under a stable local root such as:
- C:\ShadowEmpire\Shadow-Creator-OS-Phase_01

## Why local read is preferred
- avoids GitHub API dependency during local-first Phase-1 runtime
- keeps workflow, schema, rule, and skill reads deterministic
- allows n8n file-read nodes or code nodes to consume repo assets directly

## Recommended operator sequence
1. pull latest repository changes locally
2. run repo validation scripts
3. import or refresh workflow JSONs in n8n
4. use local file paths for manifests, schemas, rules, bindings, and skills
5. keep runtime outputs outside the cloned repo tree

## What n8n may read from repo
- n8n/workflows
- n8n/manifests
- schemas
- rules
- registries
- bindings
- skills

## What n8n should not write into repo during runtime
- packet outputs
- dossier deltas
- Data Table exports
- runtime logs
- temporary debug artifacts

## Practical note
For Phase-1 on the Windows laptop, local filesystem read is the default integration mode.
GitHub remains the authoritative source, but the local clone is the runtime-readable mirror.
