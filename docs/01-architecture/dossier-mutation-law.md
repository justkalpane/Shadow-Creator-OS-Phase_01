# Dossier Mutation Law

The Content Dossier is the state spine of Phase 1.

## Mutation rules
- no blind overwrite
- namespace-aware writes only
- every workflow writes a delta
- approval decisions append status, they do not destroy history
- large payloads live on disk; Data Tables hold compact indexes

## Phase-1 namespaces
- system
- intake
- discovery
- research
- script
- context
- approval
- runtime
