# n8n Data Tables Setup

## Phase-1 table set
Create exactly five Data Tables.

1. dossiers
2. routes
3. approvals
4. providers_deferred
5. runtime_index

## Intended use
- `dossiers`: high-level dossier/job index, not large payload storage
- `routes`: route availability and workflow routing hints
- `approvals`: approval queue and remodify/replay status
- `providers_deferred`: deferred provider bridge tasks
- `runtime_index`: active workflow/job pointers and health markers

## Source files in repo
Bootstrap CSVs are in `data/bootstrap/data_tables/`.
Schemas are in `schemas/data_tables/` if/when expanded.

## Rule
Large generated packets remain on disk as JSON/Markdown. Data Tables hold indexes, pointers, and compact operational state.
