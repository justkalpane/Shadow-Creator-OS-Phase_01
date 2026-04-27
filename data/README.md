# Runtime Data Stores

This directory contains the Phase-1 canonical runtime state files. They are JSON-file-backed by default (Phase-1 local-first). Optional sqlite/postgres backends can mirror these stores for production deployment.

## Canonical State Stores

| File | Purpose | Writer |
|---|---|---|
| `se_dossier_index.json` | Dossier index (id, status, route, created_at) | `engine/dossier/dossier_writer.js` (via WF-001) |
| `se_route_runs.json` | Workflow execution runs (run_id, dossier, started, finished) | `engine/directors/director_runtime_router.js` |
| `se_error_events.json` | Error events captured by WF-900 | `engine/directors/error_handler.js` |
| `se_packet_index.json` | Packet emissions and lineage | `engine/packets/packet_index_writer.js` |
| `se_approval_queue.json` | Pending approvals from WF-020 | `engine/approval/approval_writer.js` |

## Bootstrap Tables

`data/bootstrap/data_tables/` contains CSV templates used for initial table seeding (approvals, dossiers, routes, runtime_index, providers_deferred). These are NOT runtime state - they are seed data for fresh deployments.

## Operational Commands

```bash
npm run db:verify          # Verify all stores parse and exist
npm run dossier:list       # List dossiers
npm run packet:list        # List packets (optional --dossier filter)
npm run errors:list        # List error events
```

## Append-Only Law

All runtime stores follow append-only semantics enforced by the `engine/dossier/dossier_writer.js`. Direct manual edits are not supported in Phase-1; use the engine APIs or runtime workflows.
