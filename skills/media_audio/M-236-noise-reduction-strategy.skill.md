# SKL-PH3C-M-236-NOISE_REDUCTION_STRATEGY

## 1. Skill Identity
- Skill ID: M-236
- Skill Name: Noise Reduction Strategy
- Legacy Alias (Compatibility): Noise Reduction Specification
- Alias Names: Noise Reduction Specification
- Vein Assignment: media_vein
- Phase Assignment: PHASE_3C_AUDIO
- Owner Director: Shiva
- Strategic Authority Director: Krishna

## 2. Purpose
Specify deterministic noise reduction and cleanup operations.

## 3. DNA Injection
- Archetype: Shiva (signal cleanup and correction transformer)
- Behavior Model: deterministic, packet-typed, governance-bound, append-only
- Operating Pattern: ingest -> validate -> transform -> verify -> emit -> append -> route
- Operating Constraint: no randomization, no untyped packet emission, no destructive mutations

## 4. Workflow Injection
- Producer Workflow: CWF-430
- Consumer Workflows: CWF-430
- Upstream Dependencies: acoustics_analysis (from M-235), production_notes
- Upstream Skill IDs: M-235
- Downstream Consumers: M-237 Audio Levels and Normalization
- Downstream Skill IDs: M-237
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
- audio_environment_constraints (object): production environment and delivery constraints
- creator_brand_guidelines (object): brand and identity constraints
- prior_replay_packet (object): replay context from WF-021
- execution_hints (object): deterministic operator hints

## 6. Execution Logic
STEP 1: Validate input envelope and required fields against declared contract.
STEP 2: Resolve upstream packet lineage and dependency closure.
STEP 3: Load deterministic audio policy profile for Noise Reduction Strategy.
STEP 4: Build transformation frame.
  A. Normalize upstream specs and constraints.
  B. Apply deterministic audio sequencing and scoring rules.
  C. Preserve narrative and brand integrity boundaries.
STEP 5: Generate primary output payload field noise_profiles.
STEP 6: Generate bounded variants and ranking keys where applicable.
STEP 7: Run governance and safety checks.
  A. Validate schema and packet typing readiness.
  B. Validate append-only mutation compliance.
  C. Validate WF-900 and WF-021 routing completeness.
STEP 8: Assemble typed output packet noise_reduction_packet.
STEP 9: Append packet to dossier.media_vein.noise_reduction_strategy and append se_packet_index row.
STEP 10: Emit deterministic routing decision to M-237 or WF-900/WF-021.

## 7. Outputs
- Output Packet Family: noise_reduction_packet
- JSON Schema Reference: schemas/packets/noise_reduction_packet.schema.json
- Dossier Write Target: dossier.media_vein.noise_reduction_strategy
- se_packet_index Registration: required append row with lineage and audit metadata

~~~json
{
  "instance_id": "M-236-[timestamp]-[instance]",
  "artifact_family": "noise_reduction_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "CWF-430",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO-8601]",
  "status": "CREATED|PARTIAL|FAILED",
  "payload": {
    "skill_id": "M-236",
    "skill_name": "Noise Reduction Strategy",
    "primary_output": {
      "noise_profiles": "[artifact]"
    },
    "routing": {
      "on_success": "M-237",
      "on_error": "WF-900",
      "on_replay": "WF-021"
    }
  }
}
~~~

## 8. Governance
- Governance Owner: Shiva
- Strategic Authority: Krishna
- Approval Contract: deterministic execution, typed packets, append-only mutation enforcement
- Escalation Trigger Classes: validation failure, schema failure, lineage failure, mutation-law violation
- Mandatory Escalation Workflow: WF-900
- Replay or Remodify Workflow: WF-021

## 9. Tool/Runtime Usage
**Allowed**
- Deterministic audio analysis and transformation engines
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
- Keep all audio decisions deterministic and rule-based.
- Preserve lineage from script, video, and upstream audio packets into outputs.
- Enforce technical constraints before optimization and transformation.
- Validate accessibility and metadata contracts where applicable.
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
- TEST-PH3C-M-236-001: Valid required inputs produce deterministic noise_reduction_packet output
- TEST-PH3C-M-236-002: Missing dossier_id routes to WF-900 with explicit validation details
- TEST-PH3C-M-236-003: Missing route_id routes to WF-900 without packet emission
- TEST-PH3C-M-236-004: Missing required upstream packet fails closed and escalates to WF-900
- TEST-PH3C-M-236-005: Lineage references are preserved for all upstream dependencies
- TEST-PH3C-M-236-006: Primary output field noise_profiles is present and non-empty
- TEST-PH3C-M-236-007: Deterministic logic yields same output structure for identical input state
- TEST-PH3C-M-236-008: Schema validation rejects untyped payload prior to dossier mutation
- TEST-PH3C-M-236-009: Dossier writes target only dossier.media_vein.noise_reduction_strategy
- TEST-PH3C-M-236-010: Mutation uses append_to_array and never overwrites prior data
- TEST-PH3C-M-236-011: se_packet_index append row includes lineage_reference and instance_id
- TEST-PH3C-M-236-012: Replay branch routes to WF-021 for remodify requests
- TEST-PH3C-M-236-013: Escalation branch routes to WF-900 for validation or policy failures
- TEST-PH3C-M-236-014: Output packet includes timestamp, writer_id, skill_id, instance_id, schema_version
- TEST-PH3C-M-236-015: Forbidden mutation attempt is blocked and audited
- TEST-PH3C-M-236-016: Downstream routing hints are registry-bound and deterministic
- TEST-PH3C-M-236-017: Audit entry includes operation, route_id, source packet, and confidence markers
- TEST-PH3C-M-236-018: Acceptance gate fails closed when governance metadata is incomplete

**Acceptance Criteria**
- All 12 required sections are present in exact order.
- Execution logic has at least 10 deterministic steps.
- Output packet family is typed and schema-bound.
- Dossier mutation is append-only and restricted to dossier.media_vein namespace.
- se_packet_index append row includes full lineage metadata.
- Escalation path WF-900 and replay path WF-021 are explicitly wired.
- Minimum 18 tests are defined and traceable to requirements.
- Upstream and downstream contract references are complete and non-ambiguous.
