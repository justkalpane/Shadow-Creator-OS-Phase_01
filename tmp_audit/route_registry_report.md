# Route Registry Report

Generated: 2026-04-23T09:26:36.381841+00:00

## Route Inventory
- Route count: 4
- Canonical route namespace: ROUTE_PHASE1_*
- Mode definitions covered: 4

| Route ID | Entry workflow | Purpose | Allowed modes | Blocked capabilities |
|---|---|---|---|---|
| ROUTE_PHASE1_FAST | WF-010 | creator-safe fast path for topic to script | local&#124;hybrid | heavy_media_render |
| ROUTE_PHASE1_STANDARD | WF-010 | governed path for topic to context packet | local&#124;hybrid | heavy_media_render |
| ROUTE_PHASE1_REPLAY | WF-900 | remodify and replay path | local&#124;hybrid | heavy_media_render |
| ROUTE_PHASE1_ANALYTICS | WF-600 | analytics evolution and feedback loop path | local&#124;hybrid | heavy_media_render |

## Mode Legality
### founder
- Legal routes: ROUTE_PHASE1_STANDARD, ROUTE_PHASE1_FAST, ROUTE_PHASE1_REPLAY
| Route ID | Access | Default | Notes |
|---|---|---|---|
| ROUTE_PHASE1_FAST | allowed | false | Founder may manually choose fast route, but standard remains default. |
| ROUTE_PHASE1_REPLAY | allowed | false | Founder may trigger replay directly or through WF-900. |
| ROUTE_PHASE1_STANDARD | allowed | true | Founder may run standard route with full telemetry and governance trace. |

### creator
- Legal routes: ROUTE_PHASE1_STANDARD, ROUTE_PHASE1_FAST
| Route ID | Access | Default | Notes |
|---|---|---|---|
| ROUTE_PHASE1_FAST | allowed | false | Allowed only when creator_mode_id resolves to a verified fast-track mode. Fast-track still passes Kubera, Yama, and Vayu. |
| ROUTE_PHASE1_REPLAY | denied_direct | false | Creator cannot directly invoke replay. Replay must be mediated by WF-900 after a recoverable error state. |
| ROUTE_PHASE1_STANDARD | allowed | true | Safe default for creator dossiers. |

### builder
- Legal routes: none
| Route ID | Access | Default | Notes |
|---|---|---|---|
| ROUTE_PHASE1_FAST | denied | false | Builder has no route access. |
| ROUTE_PHASE1_REPLAY | denied | false | Builder has no runtime replay access. |
| ROUTE_PHASE1_STANDARD | denied | false | Builder mode is repo-only and does not run live workflows. |

### operator
- Legal routes: ROUTE_PHASE1_REPLAY
| Route ID | Access | Default | Notes |
|---|---|---|---|
| ROUTE_PHASE1_FAST | denied | false | Operator has no content-production route access. |
| ROUTE_PHASE1_REPLAY | allowed | true | Operator may execute replay only through WF-900 mediation. |
| ROUTE_PHASE1_STANDARD | denied | false | Operator is for support and replay only. |

## Consistency Notes
- `route_registry.yaml` and `routes.csv` are kept in lockstep.
- `mode_registry.yaml` and `mode_route_registry.yaml` both reference the canonical `ROUTE_PHASE1_*` set.
- Replay remains mediated through `WF-900` and is only legal where the mode contracts allow it.
