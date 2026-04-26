# Test Definition: Workflow Validator

## Scope
- Validator file: validators/workflow_validator.js
- Target workflows: n8n/workflows/*.json
- Required negative-case domains: invalid JSON, dangling references, circular dependencies, missing WF-900 escalation

## Deterministic Negative-Case Matrix (18 Cases)
- TEST-VAL-WF-001: Invalid JSON file returns error `INVALID n8n JSON`.
- TEST-VAL-WF-002: Missing `meta.workflow_id` is detected.
- TEST-VAL-WF-003: Missing `nodes` array is detected.
- TEST-VAL-WF-004: Missing `connections` object is detected.
- TEST-VAL-WF-005: Node missing required field `id` is detected.
- TEST-VAL-WF-006: Duplicate node IDs are detected.
- TEST-VAL-WF-007: Connection source not present in node list is detected.
- TEST-VAL-WF-008: Connection target not present in node list is detected.
- TEST-VAL-WF-009: Circular node connection graph is detected.
- TEST-VAL-WF-010: Workflow missing `WF-900` escalation route is detected.
- TEST-VAL-WF-011: Canonical workflow JSON path missing from manifest is detected.
- TEST-VAL-WF-012: Canonical workflow JSON parse failure is detected.
- TEST-VAL-WF-013: `wf900_error_route` not equal to `WF-900` is detected.
- TEST-VAL-WF-014: `meta.next_workflow` dangling reference is detected.
- TEST-VAL-WF-015: Circular workflow dependency in next-workflow graph is detected.
- TEST-VAL-WF-016: Valid workflow with production-grade metadata passes.
- TEST-VAL-WF-017: Mixed valid/invalid directory scan reports correct totals.
- TEST-VAL-WF-018: Full check returns deterministic findings with stable error codes.

## Pass Condition
- All 18 cases execute with deterministic results.
- Invalid n8n JSON and dangling workflow references are surfaced as errors.
- Missing `WF-900` escalation path and circular dependencies are surfaced as errors.

