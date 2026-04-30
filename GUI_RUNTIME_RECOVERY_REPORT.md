# GUI RUNTIME RECOVERY REPORT

## What was broken
1. Missing runtime spine files (`server.js`, `engine/api/chat.js`, several `engine/chat/*` modules).
2. Chat orchestration could not reliably enforce `WF-001 -> WF-010` with real webhook diagnostics.
3. Route/UI mapping drift and stale environment assumptions.
4. No persistent chat session history API.
5. No usable output library/gallery API surface.

## What was fixed
- Added backend entrypoint and API server: `server.js`.
- Added chat API router: `engine/api/chat.js`.
- Added missing orchestration dependencies:
  - `engine/chat/task_intent_resolver.js`
  - `engine/chat/mode_guard.js`
  - `engine/chat/model_router.js`
  - `engine/chat/dossier_result_reader.js`
  - `engine/chat/packet_result_reader.js`
  - `engine/chat/chat_session_store.js`
- Rebuilt orchestration coordinator:
  - `engine/chat/chat_orchestration_service.js`
- Hardened n8n client telemetry and registry/fallback behavior:
  - `engine/chat/n8n_workflow_client.js`
- Added execution tree builder:
  - `engine/gui/gui_execution_tree_builder.js`
- Added/updated registries:
  - `registries/n8n_webhook_registry.yaml`
  - `registries/task_intent_registry.yaml`
- Reworked GUI runtime surfaces:
  - `ui/src/screens/Chat.jsx`
  - `ui/src/hooks/useModeRouter.js`
  - `ui/src/App.jsx`
  - `ui/src/components/TopBar.jsx`
  - `ui/src/screens/Library.jsx`
  - `ui/src/screens/Gallery.jsx`
  - `ui/vite.config.js` (API proxy to 5002)

## Before -> After behavior
- Before: missing backend spine + unreliable error detail + no session/library foundations.
- After: `/api/*` runtime APIs boot and respond, chat failures return exact fields (`workflow_id`, URL, status, body, likely fix), sessions persist, library/gallery endpoints live.

## Remaining blocker
- Live n8n at `localhost:5678` is currently unreachable; direct workflow execution proof remains blocked until n8n is up.
