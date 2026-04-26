# SKL-PH3A-M-202-COLOR_PALETTE_OPTIMIZER

## 1. Skill Identity
- Skill ID: M-202
- Skill Name: Color Palette Optimizer
- Legacy Alias (Compatibility): Color Palette Optimizer
- Alias Names: none
- Vein Assignment: media_vein
- Phase Assignment: PHASE_3A_GRAPHICS
- Owner Director: Narada
- Strategic Authority Director: Krishna

## 2. Purpose
Select optimal color palette for audience, topic, and brand while enforcing accessibility constraints.

## 3. DNA Injection
- Archetype: Narada (strategic information gatherer)
- Behavior Model: deterministic, packet-typed, governance-bound, append-only
- Operating Pattern: ingest -> validate -> transform -> verify -> emit -> append -> route
- Operating Constraint: no randomization, no untyped packet emission, no destructive mutations

## 4. Workflow Injection
- Producer Workflow: CWF-310
- Consumer Workflows: CWF-310
- Upstream Dependencies: design_brief (from M-201), audience_profile, brand_guidelines
- Upstream Skill IDs: M-201
- Downstream Consumers: M-203 Typography Selector
- Downstream Skill IDs: M-203
- Escalation Path: WF-900
- Replay Path: WF-021
- Fallback Mode: emit status PARTIAL only when optional inputs are missing and schema integrity is preserved

## 5. Inputs
**Required Inputs**
- dossier_id (string): target dossier identity
- route_id (string): active orchestration route
- instance_id (string): runtime execution instance
- workflow_context (object): workflow metadata and lineage envelope
- upstream_packets (array): packet set required by upstream dependencies
- governance_context (object): policy and mutation-law controls

**Optional Inputs**
- creator_brand_guidelines (object): brand and identity constraints
- audience_profile_extension (object): additional demographic/psychographic hints
- prior_replay_packet (object): replay context from WF-021
- execution_hints (object): deterministic operator hints

## 6. Execution Logic
STEP 1: Validate input envelope and required fields against declared contract.
STEP 2: Resolve upstream packet lineage and dependency closure.
STEP 3: Load deterministic graphics policy profile for Color Palette Optimizer.
STEP 4: Build transformation frame.
  A. Normalize upstream assets and constraints.
  B. Apply deterministic scoring and selection rules.
  C. Preserve factual and brand integrity boundaries.
STEP 5: Generate primary output payload field primary_colors.
STEP 6: Generate bounded variants and ranking keys where applicable.
STEP 7: Run governance and safety checks.
  A. Validate schema and packet typing readiness.
  B. Validate append-only mutation compliance.
  C. Validate WF-900 and WF-021 routing completeness.
STEP 8: Assemble typed output packet color_palette_packet.
STEP 9: Append packet to dossier.media_vein.color_palette_optimizer and append se_packet_index row.
STEP 10: Emit deterministic routing decision to M-203 or WF-900/WF-021.

## 7. Outputs
- Output Packet Family: m202_packet
- JSON Schema Reference: schemas/packets/m202_packet.schema.json
- Dossier Write Target: dossier.media_vein.color_palette_optimizer
- se_packet_index Registration: required append row with lineage and audit metadata

~~~json
{
  "instance_id": "M-202-[timestamp]-[instance]",
  "artifact_family": "color_palette_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "CWF-310",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO-8601]",
  "status": "CREATED|PARTIAL|FAILED",
  "payload": {
    "skill_id": "M-202",
    "skill_name": "Color Palette Optimizer",
    "primary_output": {
      "primary_colors": "[artifact]"
    },
    "routing": {
      "on_success": "M-203",
      "on_error": "WF-900",
      "on_replay": "WF-021"
    }
  }
}
~~~

## 8. Governance
- Governance Owner: Narada
- Strategic Authority: Krishna
- Approval Contract: deterministic execution, typed packets, append-only mutation enforcement
- Escalation Trigger Classes: validation failure, schema failure, lineage failure, mutation-law violation
- Mandatory Escalation Workflow: WF-900
- Replay or Remodify Workflow: WF-021

## 9. Tool/Runtime Usage
**Allowed**
- Deterministic graphics analysis and transformation engines
- Registered schema validation
- Registry lookups (skill_registry.yaml, workflow_bindings.yaml, schema_registry.yaml, director_binding.yaml)
- Append-only dossier and packet-index writers

**Forbidden**
- Non-deterministic generation paths
- Randomized scoring or routing behavior
- Untyped packet emission
- Direct overwrite, delete, or replace mutation behavior
- Bypassing WF-900 or WF-021 obligations

## 10. Mutation Law
**Allowed Mutations**
- append_to_array
- create_new_packet
- create_new_index_row
- append_audit_entry

**Required Mutation Metadata**
- timestamp
- writer_id
- skill_id
- instance_id
- schema_version
- lineage_reference
- audit_entry

**Forbidden Mutations**
- overwrite existing dossier fields
- replace arrays
- delete prior data
- mutate historical packets
- mutate historical approval decisions
- mutate existing se_packet_index rows

## 11. Best Practices
- Keep all visual decisions deterministic and rule-based.
- Preserve lineage from M-130 through all graphics outputs.
- Enforce brand constraints before style polishing.
- Validate accessibility constraints before packet emission.
- Keep packet payloads schema-bound and typed.
- Route policy or validation failures to WF-900 immediately.
- Route replay and remodify requests to WF-021 with stable metadata.
- Keep dossier writes append-only under owned media namespace.
- Never overwrite historical packets or index rows.
- Keep downstream routing deterministic and registry-aligned.
- Record complete mutation metadata for every write.
- Keep alias naming in metadata for cross-section compatibility.

## 12. Validation/Done
**Test Cases**
- TEST-PH3A-M-202-001: Valid required inputs produce deterministic color_palette_packet output
- TEST-PH3A-M-202-002: Missing dossier_id routes to WF-900 with explicit validation details
- TEST-PH3A-M-202-003: Missing route_id routes to WF-900 without packet emission
- TEST-PH3A-M-202-004: Missing required upstream packet fails closed and escalates to WF-900
- TEST-PH3A-M-202-005: Lineage references are preserved for all upstream dependencies
- TEST-PH3A-M-202-006: Primary output field primary_colors is present and non-empty
- TEST-PH3A-M-202-007: Deterministic logic yields same output structure for identical input state
- TEST-PH3A-M-202-008: Schema validation rejects untyped payload prior to dossier mutation
- TEST-PH3A-M-202-009: Dossier writes target only dossier.media_vein.color_palette_optimizer
- TEST-PH3A-M-202-010: Mutation uses append_to_array and never overwrites prior data
- TEST-PH3A-M-202-011: se_packet_index append row includes lineage_reference and instance_id
- TEST-PH3A-M-202-012: Replay branch routes to WF-021 for remodify requests
- TEST-PH3A-M-202-013: Escalation branch routes to WF-900 for validation or policy failures
- TEST-PH3A-M-202-014: Output packet includes timestamp, writer_id, skill_id, instance_id, schema_version
- TEST-PH3A-M-202-015: Forbidden mutation attempt is blocked and audited
- TEST-PH3A-M-202-016: Downstream routing hints are registry-bound and deterministic
- TEST-PH3A-M-202-017: Audit entry includes operation, route_id, source packet, and confidence markers
- TEST-PH3A-M-202-018: Acceptance gate fails closed when governance metadata is incomplete

**Acceptance Criteria**
- All 12 required sections are present in exact order.
- Execution logic has at least 10 deterministic steps.
- Output packet family is typed and schema-bound.
- Dossier mutation is append-only and restricted to dossier.media_vein namespace.
- se_packet_index append row includes full lineage metadata.
- Escalation path WF-900 and replay path WF-021 are explicitly wired.
- Minimum 18 tests are defined and traceable to requirements.
- Upstream and downstream contract references are complete and non-ambiguous.
