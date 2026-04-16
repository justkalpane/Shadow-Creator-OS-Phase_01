# Dossier Mutation Law

The Content Dossier is the state spine of Phase 1.

## Mutation rules
- no blind overwrite
- namespace-aware writes only
- every workflow writes a delta
- approval decisions append status, they do not destroy history
- large payloads live on disk; Data Tables hold compact indexes

## Canonical mutation authority artifacts
Use these files as the authoritative governance layer for dossier mutation:
- `schemas/dossier/content_dossier_patch.schema.json`
- `schemas/governance/audit_event.schema.json`
- `registries/phase1_dossier_namespace_ownership_matrix.yaml`

## Phase-1 namespaces
- system
- intake
- discovery
- research
- script
- context
- approval
- runtime

## Ownership authority
The canonical dossier namespace matrix defines, for each namespace:
- current owner workflow
- future pack owner when the namespace is not yet live in the repo
- allowed writers
- read-only workflows
- whether approval is required for mutation
- fallback implications
- replay or remodify implications

Do not treat prose summaries as stronger than the canonical matrix.
