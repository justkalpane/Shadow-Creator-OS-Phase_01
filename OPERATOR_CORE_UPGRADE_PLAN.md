# SHADOW OPERATOR CORE UPGRADE PLAN (NO-COMPRESSION)

## Mission Lock
- Keep logic in Operator Core, not in fragile GUI components.
- Keep Local-first default (`Ollama + n8n + repo runtime state`).
- Keep cloud/media provider bridges as explicit deferred layers unless enabled.
- Keep dossier/packet truth as the runtime source.

## What Is Implemented In This Upgrade

### Operator Core Modules
- `operator/n8n_client.js`
- `operator/mode_manager.js`
- `operator/route_manager.js`
- `operator/task_router.js`
- `operator/output_reader.js`
- `operator/review_manager.js`
- `operator/alert_manager.js`
- `operator/troubleshoot_manager.js`
- `operator/event_stream.js`
- `operator/provider_router.js`
- `operator/ollama_tool_runner.js`
- `operator/mcp/shadow_operator_mcp_server.js` (facade scaffold)

### Operator API Layer
- `engine/api/operator.js` exposes:
  - `GET /operator/health`
  - `GET /operator/modes`
  - `GET /operator/routes`
  - `POST /operator/new-content-job`
  - `POST /operator/run`
  - `GET /operator/dossier/:id`
  - `GET /operator/outputs/:id`
  - `GET /operator/library`
  - `POST /operator/approve/:id`
  - `POST /operator/remodify/:id`
  - `POST /operator/replay/:id`
  - `GET /operator/alerts`
  - `GET /operator/events`
  - `GET /operator/troubleshoot/dossier/:id`
  - `GET /operator/troubleshoot/packet/:id`
  - `GET /operator/providers`
  - `GET /operator/providers/:id`
  - `GET /operator/tasks`

### Server Wiring
- `server.js` now mounts Operator API at `/operator`.

### Startup Scripts
- `scripts/windows/start_shadow_operator_api.ps1`
- `scripts/windows/start_shadow_stack.ps1`
- `package.json` scripts:
  - `npm run operator:start:windows`
  - `npm run stack:start:windows`

## Operator Capability Map

### Modes
- Read from `registries/mode_registry.yaml`.
- Route legality from `registries/mode_route_registry.yaml`.
- Validate task-mode eligibility via `gui_task_routing_matrix`.

### Routing
- Intent resolution via `task_intent_registry + gui_task_routing_matrix`.
- Route defaults/legality from mode and route registries.
- Workflow trigger through `n8n_webhook_registry`.

### Review / Replay
- Approval path: `WF-020`.
- Change request and replay path: `WF-021`.
- All actions are API-first and interface-agnostic.

### Alerts / Troubleshooting / Event stream
- Alerts built from:
  - n8n health
  - `se_error_events`
  - `se_approval_queue`
- Troubleshooting traces:
  - dossier timeline
  - packet trace
  - error correlation
- Event stream mode:
  - polling snapshots from route/errors/approval stores.

### Provider Boundary
- Provider status from `provider_registry`.
- Explicit "deferred provider required" posture preserved.
- Planning packets are treated separately from real media file outputs.

## Interface Model (Blended Operator)
- PowerShell can call `/operator/*`.
- GUI can call `/operator/*`.
- MCP facade can call same core functions.
- Future Open WebUI adapter can call same endpoints.
- No logic duplication across interfaces.

## Production-Safe Integration Order (Locked)
1. Operator Core + `/operator` endpoints.
2. Review operations (`approve/remodify/replay`) hardening.
3. Polling event stream hardening.
4. Search provider bridge.
5. OpenRouter cloud reasoning bridge.
6. Image bridge.
7. Voice/TTS bridge.
8. Local render bridge.
9. Publishing bridge.
10. Analytics bridge.

## Live Runtime Truth Constraints
- Do not mark media output as generated unless file/object exists.
- Do not mark approval-ready unless output evidence exists.
- Do not claim workflow success from UI-only state.
- Keep `WF-900` as canonical failure route.
- Keep `WF-901` controlled-test only.

## Immediate Validation Steps
1. Ensure `n8n` is up:
   - `npm run n8n:status`
2. Start operator API:
   - `npm run operator:start:windows`
3. Verify:
   - `GET http://localhost:5002/operator/health`
   - `GET http://localhost:5002/operator/modes`
   - `GET http://localhost:5002/operator/tasks`
4. Run operator job:
   - `POST http://localhost:5002/operator/new-content-job`
5. Review results:
   - `GET /operator/dossier/:id`
   - `GET /operator/outputs/:id`
   - `GET /operator/events`

## Upgrade Notes
- This is an upgrade path, not a compressed redesign.
- Existing GUI can remain as a viewer/client, while operator core owns truth logic.
- Remaining work should focus on stabilization and evidence gates, not cosmetic screens.

