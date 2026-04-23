# Shadow Empire Build Status

Generated from snapshot: 2026-04-23T08:52:06.455903+00:00
Generated file: `BUILD_STATUS.md`

## Live State
- Repo state: `synced`
- Phase-1 validation gate: `passing`
- Canonical route namespace: `ROUTE_PHASE1_*`
- Legacy route tokens in runtime assets: `0`
- Open build blockers: `0`
- Open release packets: `DP-001`

## Core Values
| Metric | Value |
|---|---:|
| Agents | 114 |
| Sub-agents | 36 |
| Directors | 32 |
| Workflow registry entries | 14 |
| Route registry entries | 4 |
| Decision packets tracked | 5 |
| Release packets tracked | 1 |

## Route Snapshot
- Canonical routes: ROUTE_PHASE1_FAST, ROUTE_PHASE1_STANDARD, ROUTE_PHASE1_REPLAY, ROUTE_PHASE1_ANALYTICS
- Route registry and CSV aligned: `true`
- Route entry workflows: ROUTE_PHASE1_FAST -> WF-010, ROUTE_PHASE1_STANDARD -> WF-010, ROUTE_PHASE1_REPLAY -> WF-900, ROUTE_PHASE1_ANALYTICS -> WF-600

## Blockers
- Build blockers resolved: `1`
- Build blockers open: `none`
- Decision packet build blockers: `DP-002, DP-005, DP-006, DP-007`
- Release packet state counts: `{"provisionally_resolved": 1}`

## Report Freshness
- Unified hierarchy report: `true`
- Route registry report: `true`
- Audit index: `true`
- Build values snapshot: `true`

## Source Truth
- This file is regenerated from `tmp_audit/build_values_snapshot.json`.
- The snapshot is derived from the live registries, route tables, blocker matrix, decision packets, and runtime assets.
- If any of those move, the snapshot and this file must be regenerated together.
