# Repo to n8n Integration Bridge

## Purpose
This document defines how the Phase-1 GitHub estate is consumed by the local n8n runtime.

## Core operating model
- GitHub repository is the static source of truth.
- Local cloned repository is the runtime-readable asset source.
- n8n is the live execution engine.
- Data Tables hold runtime indexes and lightweight execution state.
- Dossier JSON / packet outputs remain runtime artifacts, not GitHub truth.

## Static assets consumed from repo
n8n workflows, manifests, schemas, rules, registries, skill files, director bindings, and validation scripts are maintained in GitHub and read from the local repo clone.

## Runtime assets produced outside repo
Dossier deltas, packet outputs, approval events, runtime logs, and Data Table state are generated during execution and remain outside Git tracking.

## Integration order
1. clone or pull latest repo locally
2. validate repo artifacts
3. import workflow JSONs into n8n
4. wire Data Tables and local runtime paths
5. execute starter-pack validation
6. only then promote new workflow packs into active runtime use

## Consumption principle
n8n should prefer local file reads from the cloned repo over direct GitHub API reads for Phase-1 local-first execution.

## Pack sequence currently supported
- WF-000
- WF-900
- WF-001
- WF-010
- WF-100
- WF-200

WF-300 and WF-400 remain future workflow packs until formally promoted.
