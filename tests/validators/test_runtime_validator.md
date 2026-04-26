# Test Definition: Runtime Validator

## Scope
- Validator file: validators/runtime_validator.js
- Target runtime engines:
  - engine/skill_loader/*.js
  - engine/dossier/*.js
  - engine/packets/*.js
  - engine/approval/*.js
- Target dossiers: dossiers/*.json audit trails
- Required negative-case domains: non-append-only writes, namespace ownership violations, missing WF-900, non-deterministic logic

## Deterministic Negative-Case Matrix (18 Cases)
- TEST-VAL-RUNTIME-001: Dossier audit entry missing `mutation_id` is detected.
- TEST-VAL-RUNTIME-002: Dossier audit entry missing `workflow_id` is detected.
- TEST-VAL-RUNTIME-003: Dossier audit entry missing `namespace` is detected.
- TEST-VAL-RUNTIME-004: Dossier audit entry missing `operation` is detected.
- TEST-VAL-RUNTIME-005: Namespace ownership violation is detected.
- TEST-VAL-RUNTIME-006: `lineage_intact=false` is detected as error.
- TEST-VAL-RUNTIME-007: Missing `lineage_reference` is surfaced as warning.
- TEST-VAL-RUNTIME-008: Non-append operation `overwrite` is detected.
- TEST-VAL-RUNTIME-009: Non-append operation `replace_array` is detected.
- TEST-VAL-RUNTIME-010: Non-append operation `delete` is detected.
- TEST-VAL-RUNTIME-011: Runtime engine file missing `WF-900` route is detected.
- TEST-VAL-RUNTIME-012: Runtime engine file containing `Math.random` is detected.
- TEST-VAL-RUNTIME-013: Missing runtime engine file is detected.
- TEST-VAL-RUNTIME-014: Missing allowed mutation contract token in dossier writer is detected.
- TEST-VAL-RUNTIME-015: Unknown namespace in dossier payload is detected.
- TEST-VAL-RUNTIME-016: Packet lineage reference to unknown packet is detected.
- TEST-VAL-RUNTIME-017: Repository runtime scan reports non-append-only dossier writes.
- TEST-VAL-RUNTIME-018: Full runtime validation returns deterministic findings and stable error codes.

## Pass Condition
- All 18 cases execute with deterministic results.
- Non-append-only dossier writes are surfaced as errors.
- Missing `WF-900` and non-deterministic runtime logic are surfaced as errors.

