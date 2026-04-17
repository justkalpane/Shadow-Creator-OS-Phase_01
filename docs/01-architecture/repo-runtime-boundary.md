# Repo Runtime Boundary

## Boundary law
The repository stores design truth. The runtime stores execution truth.

## Repository truth includes
- workflow JSON exports committed as source artifacts
- workflow manifests
- packet schemas
- registries
- rules
- skill files
- director bindings
- deployment and governance documents
- validation scripts

## Runtime truth includes
- live workflow executions
- Data Table contents
- approval queue state
- dossier deltas
- generated packets
- local logs
- local n8n storage
- transient debug state

## Non-negotiable rule
Runtime outputs must not be treated as GitHub truth unless deliberately normalized and committed as static artifacts.

## Practical implication
A workflow may exist in the repo before it is validated live in n8n.
A workflow may run in n8n before a newer runtime edit is synced back into the repo.
The repo remains authoritative for intended contract shape. Runtime remains authoritative for actual execution state.

## Phase-1 local-first rule
During Phase-1, n8n should read from the local cloned repo path whenever static assets are needed.
