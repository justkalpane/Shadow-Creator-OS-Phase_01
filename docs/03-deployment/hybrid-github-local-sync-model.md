# Hybrid GitHub Local Sync Model

GitHub = source of truth  
Local repo = runtime mirror  
n8n = execution layer  

## Sync Model

Manual command-based sync only.

No background sync.

## Flow

1. User requests update
2. Agent reads GitHub
3. Local repo is updated
4. n8n uses local mirror

## Rule

Runtime never writes back to GitHub automatically.
