# SKL-PH2C-M-127-EMAIL_SEQUENCE_GENERATOR

## 1. Skill Identity
- Skill ID: M-127
- Skill Name: Email Sequence Generator
- Legacy Alias (Filename Compatibility): Viral Pattern Library
- Vein Assignment: script_vein
- Phase Assignment: PHASE_2C_PLATFORM_VARIANTS
- Owner Director: Krishna
- Strategic Authority Director: Krishna

## 2. Purpose
Generate a 3-5 message email sequence with progressive revelation and controlled CTA escalation.

## 3. DNA Injection
- Archetype: Krishna (relationship builder)
- Behavior Model: deterministic, packet-typed, governance-bound, append-only
- Operating Pattern: ingest -> validate -> transform -> verify -> emit -> append -> route
- Platform Specifics: sequence cadence, subject and preview optimization, personalization zones, CTA progression

## 4. Workflow Injection
- Producer Workflow: CWF-230
- Consumer Workflows: CWF-240
- Upstream Dependencies: base_script (from M-110/M-120), audience_profile (from M-002), cta_packet (from M-109)
- Downstream Consumers: M-130 Multi-Format Coordinate Manager
- Escalation Path: WF-900
- Replay Path: WF-021
- Fallback Mode: emit status PARTIAL only when non-critical optional inputs are absent and core schema integrity remains valid

## 5. Inputs
**Required Inputs**
- dossier_id (string): target dossier identity
- route_id (string): active orchestration route
- instance_id (string): runtime execution instance
- base_script_packet (object): canonical source script artifact from M-110/M-120
- creator_profile (object): creator tone and audience constraints
- workflow_context (object): current workflow metadata and lineage context

**Optional Inputs**
- research_support_packet (object): supporting research claims and references
- platform_constraints (object): per-platform limits, style, policy constraints
- brand_guidelines (object): tonal, visual, lexical guardrails
- variant_count (integer, default 3): bounded variant generation count

## 6. Execution Logic
STEP 1: Validate input envelope and required fields against input_schema.
STEP 2: Resolve upstream lineage from base_script_packet and workflow context.
STEP 3: Load deterministic platform contract for Email Sequence Generator.
STEP 4: Transform source script into platform draft.
  A. Normalize lexical and structural pattern.
  B. Apply platform timing or length constraints.
  C. Preserve factual claims and CTA intent.
STEP 5: Generate platform-native cues for execution clarity.
STEP 6: Build bounded variants (1..variant_count) with deterministic ranking keys.
STEP 7: Run governance and safety checks.
  A. Policy-screen claims and CTA language.
  B. Validate creator-profile alignment.
  C. Reject forbidden mutations or untyped packet payloads.
STEP 8: Assemble typed output packet email_sequence_packet and validate against JSON schema.
STEP 9: Append packet to dossier.script_vein.email_sequence_generator and append lineage row to se_packet_index.
STEP 10: Emit routing decision (success, replay, escalate) with deterministic next-hop references.

## 7. Outputs
- Output Packet Family: email_sequence_packet
- JSON Schema Reference: schemas/packets/email_sequence_packet.schema.json
- Dossier Write Target: dossier.script_vein.email_sequence_generator
- se_packet_index Registration: required append row with lineage and audit metadata

~~~json
{
  "instance_id": "M-127-[timestamp]-[instance]",
  "artifact_family": "email_sequence_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "CWF-230",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO-8601]",
  "status": "CREATED|PARTIAL|FAILED",
  "payload": {
    "skill_id": "M-127",
    "skill_name": "Email Sequence Generator",
    "platform": "Email",
    "primary_output": {
      "email_templates": "[platform-adapted artifact]"
    },
    "variants": [
      {"variant_id": "V1", "rank": 1},
      {"variant_id": "V2", "rank": 2},
      {"variant_id": "V3", "rank": 3}
    ],
    "routing": {
      "on_success": "M-130",
      "on_error": "WF-900",
      "on_replay": "WF-021"
    }
  }
}
~~~

## 8. Governance
- Governance Owner: Krishna
- Strategic Authority: Krishna
- Approval Contract: deterministic execution; no untyped emissions; no destructive mutation
- Escalation Trigger Classes: input contract failure, schema failure, policy failure, mutation-law violation
- Mandatory Escalation Workflow: WF-900
- Replay or Remodify Workflow: WF-021

## 9. Tool/Runtime Usage
**Allowed**
- Deterministic text transforms and formatting engines
- Registered schema validation
- Registry lookups (skill_registry.yaml, workflow_bindings.yaml, schema_registry.yaml, director_binding.yaml)
- Append-only dossier and packet-index writers

**Forbidden**
- Non-deterministic generation branches
- Any randomization (random, Math.random, seedless stochastic pathing)
- Unregistered external tool calls
- Untyped packet emission
- Direct overwrite, delete, or replace mutation behavior

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
- Preserve source-script semantic intent before style adaptation.
- Keep all transformations deterministic and seedless.
- Apply platform limits before linguistic polish to avoid truncation defects.
- Maintain explicit lineage from source packet to emitted variant packet.
- Route all hard validation failures to WF-900 with typed error details.
- Route replay/remodify requests to WF-021 with stable replay metadata.
- Never mutate dossier fields outside dossier.script_vein.email_sequence_generator.
- Keep every variant auditable with stable variant identifiers.
- Run schema validation before dossier and index writes.
- Keep audience-voice alignment tied to provided creator profile inputs.
- Ensure CTA phrasing remains policy-safe and context-bound.
- Record every write with timestamp, writer_id, skill_id, and lineage_reference.

## 12. Validation/Done
**Test Cases**
- TEST-PH2C-M-127-001: Valid required inputs produce deterministic email_sequence_packet output
- TEST-PH2C-M-127-002: Missing dossier_id routes to WF-900 with explicit validation error
- TEST-PH2C-M-127-003: Missing base input payload routes to WF-900 without packet emission
- TEST-PH2C-M-127-004: Unsupported route_id resolves via deterministic fallback and logs route correction
- TEST-PH2C-M-127-005: Platform constraints are enforced without random branch selection
- TEST-PH2C-M-127-006: Primary output field email_templates is present and non-empty
- TEST-PH2C-M-127-007: Variant generation creates exactly 3 bounded variants when requested
- TEST-PH2C-M-127-008: Governance safety check blocks forbidden claims and routes to WF-900
- TEST-PH2C-M-127-009: Replay request envelope routes to WF-021 with replay-ready context
- TEST-PH2C-M-127-010: Schema validation rejects untyped payload before dossier mutation
- TEST-PH2C-M-127-011: Dossier write target uses dossier.script_vein.email_sequence_generator only
- TEST-PH2C-M-127-012: Mutation uses append_to_array and never overwrites prior packet history
- TEST-PH2C-M-127-013: se_packet_index row is appended with lineage_reference and instance_id
- TEST-PH2C-M-127-014: Output packet includes timestamp, writer_id, skill_id, instance_id, schema_version
- TEST-PH2C-M-127-015: Downstream routing hint is deterministic for identical input state
- TEST-PH2C-M-127-016: Forbidden mutation attempt is rejected and escalated to WF-900
- TEST-PH2C-M-127-017: Audit entry captures operation, route_id, source packet, and confidence markers
- TEST-PH2C-M-127-018: Acceptance gate fails closed when governance metadata is incomplete

**Acceptance Criteria**
- All 12 required sections are present in exact order.
- Execution logic has at least 10 deterministic steps.
- Output packet family is typed and schema-bound.
- Dossier mutation is append-only and restricted to dossier.script_vein namespace.
- se_packet_index append row includes full lineage metadata.
- Escalation path WF-900 and replay path WF-021 are explicitly wired.
- Minimum 18 tests are defined and traceable to requirements.
- Upstream and downstream contract references are complete and non-ambiguous.
