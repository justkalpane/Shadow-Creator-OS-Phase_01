# Test Definition: Schema Validator

## Scope
- Validator file: validators/schema_validator.js
- Target registries: registries/schema_registry.yaml, registries/skill_registry.yaml
- Target schemas: schemas/packets/*.schema.json
- Required negative-case domains: missing schema refs, missing schema files, invalid schema JSON, invalid mutation delta

## Deterministic Negative-Case Matrix (18 Cases)
- TEST-VAL-SCHEMA-001: Missing schema registry file is detected.
- TEST-VAL-SCHEMA-002: Schema registry row missing `artifact_family` is detected.
- TEST-VAL-SCHEMA-003: Schema registry row missing `schema_path` is detected.
- TEST-VAL-SCHEMA-004: Duplicate `artifact_family` is detected.
- TEST-VAL-SCHEMA-005: Referenced schema file not found is detected.
- TEST-VAL-SCHEMA-006: Schema file with invalid JSON is detected.
- TEST-VAL-SCHEMA-007: Skill missing `schema_ref` is detected.
- TEST-VAL-SCHEMA-008: Skill `schema_ref` path not found is detected.
- TEST-VAL-SCHEMA-009: Skill missing `output_packet_family` is detected.
- TEST-VAL-SCHEMA-010: Skill packet family missing in schema registry is detected.
- TEST-VAL-SCHEMA-011: Packet envelope missing required field fails packet validation.
- TEST-VAL-SCHEMA-012: Packet with unknown `artifact_family` fails packet validation.
- TEST-VAL-SCHEMA-013: Dossier missing `dossier_id` fails dossier validation.
- TEST-VAL-SCHEMA-014: Dossier missing `_audit_trail` fails dossier validation.
- TEST-VAL-SCHEMA-015: Delta with forbidden `mutation_type` fails delta validation.
- TEST-VAL-SCHEMA-016: Delta missing mutation metadata fields fails delta validation.
- TEST-VAL-SCHEMA-017: Delta `audit_entry` missing `workflow_id` fails validation.
- TEST-VAL-SCHEMA-018: Full check returns deterministic findings with stable error codes.

## Pass Condition
- All 18 cases execute with deterministic results.
- Missing schema references and schema file defects surface as errors.
- Delta mutation contract violations are rejected under append-only law.

