# BLOCKER FIX LEDGER

| Blocker ID | Severity | Cause | Fix Applied | Proof | Remaining Risk |
|---|---|---|---|---|---|
| P0-CHAT-SPINE-MISSING | P0 | Missing backend/chat orchestration files | Added `server.js`, `engine/api/chat.js`, missing `engine/chat/*` modules | API boots and health endpoint 200 | None if server process runs |
| P0-WORKFLOW-UNKNOWN-ERROR | P0 | Chat returned generic unknown trigger failures | Hardened `n8n_workflow_client.js` + orchestration failure payloads with URL/status/body/fix | `/api/chat/message` now returns structured `workflow_trigger_failed` details | n8n still unreachable blocks success path |
| P0-HISTORY-MISSING | P1 | No persistent chat sessions | Added `chat_session_store` + sessions APIs + chat UI session list | `/api/chat/sessions` 200 | Session UX can be further polished |
| P0-LIBRARY-GALLERY-MISSING | P1 | No output retrieval API | Added `/api/library*` and `/api/gallery*` APIs + UI screens | `library_status:200`, `gallery_status:200` | Visual media remains planning-only until providers wired |
| P0-ROUTE-MAPPING-DRIFT | P1 | UI route inconsistencies and stale API proxy target | Rebuilt `useModeRouter`, `App.jsx` routes, Vite proxy -> 5002 | UI route map now aligns with core screens | Additional non-core screens still placeholders |
| P0-N8N-LIVE-UNREACHABLE | P0 | n8n host runtime not reachable at 5678 in current run | No code fix possible from repo only; diagnostics now exact | `n8n:status` reports NOT REACHABLE; direct webhook connect fails | Full PASS blocked until n8n process is up |
