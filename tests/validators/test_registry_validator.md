# Test Definition: Registry Validator

## Scope
- Validator file: validators/registry_validator.js
- Target registries:
  - registries/skill_registry.yaml
  - registries/workflow_bindings.yaml
  - registries/director_binding.yaml
  - registries/schema_registry.yaml
  - registries/provider_registry.yaml
  - registries/mode_registry.yaml
  - registries/governance_rules.yaml
- Required negative-case domains: duplicate IDs, missing bindings, missing schema refs, missing tests, template violations

## Deterministic Negative-Case Matrix (18 Cases)
- TEST-VAL-REG-001: Missing required registry file is detected.
- TEST-VAL-REG-002: Empty registry file is detected.
- TEST-VAL-REG-003: Duplicate `skill_id` in skill registry is detected.
- TEST-VAL-REG-004: Skill file present on disk but missing in registry is detected.
- TEST-VAL-REG-005: Skill registry entry with missing `file_path` is detected.
- TEST-VAL-REG-006: Skill file path not found is detected.
- TEST-VAL-REG-007: Skill owner director missing in director binding is detected.
- TEST-VAL-REG-008: Skill strategic authority director missing in director binding is detected.
- TEST-VAL-REG-009: Skill missing workflow binding entry is detected.
- TEST-VAL-REG-010: Workflow binding `on_error` not equal to `WF-900` is detected.
- TEST-VAL-REG-011: Skill `output_packet_family` mismatched against workflow binding emission is detected.
- TEST-VAL-REG-012: Skill missing `schema_ref` is detected.
- TEST-VAL-REG-013: Skill schema reference file missing is detected.
- TEST-VAL-REG-014: Skill packet family missing in schema registry is detected.
- TEST-VAL-REG-015: Unresolved upstream skill dependency is detected.
- TEST-VAL-REG-016: Unresolved downstream skill dependency is detected.
- TEST-VAL-REG-017: Skill missing 12-section template order is detected.
- TEST-VAL-REG-018: Skill with fewer than 18 tests or missing tests/skills definition is detected.

## Pass Condition
- All 18 cases execute with deterministic results.
- Registry referential closure failures are surfaced as errors.
- Skill template, WF-900 escalation, and test-coverage violations are surfaced as errors.

