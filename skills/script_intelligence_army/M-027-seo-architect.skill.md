# SKL-PHASE_1C_CONDITIONAL_RESEARCH-M-027-NUANCE_CAPTURE_ENGINE

## 1. Skill Identity
- Skill ID: M-027
- Skill Name: Nuance Capture Engine
- Legacy Alias (Filename Compatibility): SEO Architect
- Vein Assignment: research_vein
- Phase Assignment: PHASE_1C_CONDITIONAL_RESEARCH
- Owner Director: Narada
- Strategic Authority Director: Krishna

## 2. Purpose
Capture edge cases and contextual nuances omitted by baseline narratives.

## 3. DNA Injection
- Archetype: Narada (strategic information gatherer)
- Behavior Model: deterministic, packet-typed, governance-bound, append-only
- Operating Pattern: ingest -> validate -> transform -> verify -> emit -> append -> route
- Strategic Authority Context: Krishna arbitration for policy and replay paths

## 4. Workflow Injection
- Producer Workflow: CWF-140
- Consumer Workflows: CWF-140
- Upstream Dependencies: knowledge_gaps (M-026), research_narrative (M-018), expert_opinions (M-017)
- Upstream Skill IDs: M-026, M-018, M-017
- Downstream Consumers: M-028 Predictive Extrapolation
- Downstream Skill IDs: M-028
- Escalation Path: WF-900
- Replay Path: WF-021
- Runtime Condition: execute only if M-020 research_confidence_score < 0.85

## 5. Inputs
**Required Inputs**
- dossier_id (string): target dossier identity
- route_id (string): active orchestration route
- instance_id (string): runtime execution instance
- workflow_context (object): workflow metadata and lineage envelope
- upstream_packets (array): ordered packet set required by upstream dependencies
- governance_context (object): policy and mutation-law controls

**Optional Inputs**
- expert_feedback_packet (object): supplementary expert interpretation
- prior_replay_packet (object): replay context from WF-021
- confidence_threshold_override (number): governance-approved threshold override
- execution_hints (object): deterministic operator hints

## 6. Execution Logic
STEP 1: Validate input envelope and required fields against declared contract.
STEP 2: Resolve upstream packet lineage and dependency closure.
STEP 3: Enforce workflow condition and governance prechecks.
STEP 4: Build deterministic analysis frame for Nuance Capture Engine.
  A. Normalize upstream evidence artifacts.
  B. Apply fixed transformation and scoring rules.
  C. Preserve factual claims and dependency references.
STEP 5: Generate primary output payload field identified_nuances.
STEP 6: Assemble routing metadata and replay context markers.
STEP 7: Run governance and safety checks.
  A. Validate mutation-law compliance.
  B. Validate packet typing and schema binding.
  C. Validate escalation and replay path completeness.
STEP 8: Validate typed packet against schemas/packets/nuance_packet.schema.json.
STEP 9: Append packet to dossier.research_vein.nuance_capture_engine and append se_packet_index lineage row.
STEP 10: Emit deterministic routing decision to M-028 or WF-900/WF-021.

## 7. Outputs
- Output Packet Family: m027_packet
- JSON Schema Reference: schemas/packets/m027_packet.schema.json
- Dossier Write Target: dossier.research_vein.nuance_capture_engine
- se_packet_index Registration: required append row with lineage and audit metadata

~~~json
{
  "instance_id": "M-027-[timestamp]-[instance]",
  "artifact_family": "nuance_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "CWF-140",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO-8601]",
  "status": "CREATED|PARTIAL|FAILED",
  "payload": {
    "skill_id": "M-027",
    "skill_name": "Nuance Capture Engine",
    "execution_condition": "m020_confidence_score_lt_0_85",
    "primary_output": {
      "identified_nuances": "[artifact]"
    },
    "routing": {
      "on_success": "M-028",
      "on_error": "WF-900",
      "on_replay": "WF-021"
    }
  }
}
~~~

## 8. Governance
- Governance Owner: Narada
- Strategic Authority: Krishna
- Approval Contract: deterministic execution, no untyped packets, append-only mutation law
- Escalation Trigger Classes: validation failure, schema failure, lineage failure, mutation-law violation
- Mandatory Escalation Workflow: WF-900
- Replay or Remodify Workflow: WF-021

## 9. Tool/Runtime Usage
**Allowed**
- Deterministic text/analysis transforms
- Registered schema validation
- Registry lookups (skill_registry.yaml, workflow_bindings.yaml, schema_registry.yaml, director_binding.yaml)
- Append-only dossier and packet-index writers

**Forbidden**
- Non-deterministic or random logic paths
- Untyped packet emission
- Unregistered external tool calls
- Direct overwrite, delete, or replace mutation behavior
- Bypassing WF-900 or WF-021 routing obligations

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
- Keep transforms deterministic and replay-safe.
- Preserve upstream evidence and lineage references.
- Fail closed on missing required inputs.
- Validate schema before dossier writes.
- Keep writes append-only in the declared dossier namespace.
- Route critical errors to WF-900 with typed error payloads.
- Keep WF-021 replay path available for remodify flows.
- Never mutate historical packets or approval decisions.
- Emit only typed packets bound to schema registry entries.
- Keep confidence and scoring logic formula-bound and auditable.
- Record timestamp, writer_id, skill_id, and lineage_reference on every write.
- Keep downstream routing deterministic and registry-driven.

## 12. Validation/Done
**Test Cases**
- TEST-PH1C-M-027-001: Valid required inputs produce deterministic nuance_packet output
- TEST-PH1C-M-027-002: Missing dossier_id routes to WF-900 with explicit validation details
- TEST-PH1C-M-027-003: Missing route_id routes to WF-900 without packet emission
- TEST-PH1C-M-027-004: Missing required upstream packet fails closed and escalates to WF-900
- TEST-PH1C-M-027-005: Lineage references are preserved for all upstream dependencies
- TEST-PH1C-M-027-006: Primary output field identified_nuances is present and non-empty
- TEST-PH1C-M-027-007: Deterministic logic yields same output structure for identical input state
- TEST-PH1C-M-027-008: Schema validation rejects untyped payload prior to dossier mutation
- TEST-PH1C-M-027-009: Dossier writes target only dossier.research_vein.nuance_capture_engine
- TEST-PH1C-M-027-010: Mutation uses append_to_array and never overwrites prior data
- TEST-PH1C-M-027-011: se_packet_index append row includes lineage_reference and instance_id
- TEST-PH1C-M-027-012: Replay branch routes to WF-021 for remodify requests
- TEST-PH1C-M-027-013: Escalation branch routes to WF-900 for validation or policy failures
- TEST-PH1C-M-027-014: Output packet includes timestamp, writer_id, skill_id, instance_id, schema_version
- TEST-PH1C-M-027-015: Forbidden mutation attempt is blocked and audited
- TEST-PH1C-M-027-016: Downstream routing hints are registry-bound and deterministic
- TEST-PH1C-M-027-017: Audit entry includes operation, route_id, source packet, and confidence markers
- TEST-PH1C-M-027-018: Acceptance gate fails closed when governance metadata is incomplete

**Acceptance Criteria**
- All 12 required sections are present in exact order.
- Execution logic has at least 10 deterministic steps.
- Output packet family is typed and schema-bound.
- Dossier mutation is append-only and restricted to declared dossier namespace.
- se_packet_index append row includes full lineage metadata.
- Escalation path WF-900 and replay path WF-021 are explicitly wired.
- Minimum 18 tests are defined and traceable to requirements.
- Upstream and downstream contract references are complete and non-ambiguous.
