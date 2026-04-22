# SKL-PH1-VISUAL-ASSET-GENERATOR

## 1. Skill Identity
- **Skill ID:** M-174
- **Skill Name:** Visual Asset Generator
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-WF
- **Consumer Workflows:** WF-500, WF-600
- **Vein/Route/Stage:** operations_vein / topic_to_script / Stage_E_Operations

## 2. Purpose
Skill artifact for M-174 (Visual Asset Generator), generated using the latest repository skill DNA template and runtime contract. This skill preserves the same structure, routing semantics, escalation behavior, and mutation law as the current compliant skills.

## 3. DNA Injection
- **Role Definition:** visual-asset-generator_executor
- **DNA Archetype:** Narada
- **Behavior Model:** deterministic, registry-bound, escalation-safe
- **Operating Method:** ingest -> validate -> execute -> emit -> index
- **Working Style:** evidence-first, schema-locked, replay-aware

## 4. Workflow Injection
- **Producer:** WF
- **Direct Consumers:** WF-500, WF-600
- **Upstream Dependencies:** workflow_registry, skill_loader_registry, dossier packet context
- **Downstream Handoff:** visual-asset-generator_packet -> downstream workflow chain
- **Escalation Path:** SE-N8N-WF-900 on validation failure or critical runtime errors
- **Fallback Path:** return partial packet with status "PARTIAL" and explicit failure reasons
- **Replay Path:** SE-N8N-WF-021 when remodify/replay is requested

## 5. Inputs
**Required:**
- dossier_id (string) - parent dossier identifier
- input_payload (object) - upstream packet payload for this skill
- route_id (string) - active route context

**Optional:**
- constraints (object) - quality/cost/latency constraints
- hints (array) - execution hints from upstream steps

## 6. Execution Logic
```text
1. Validate dossier_id and input_payload schema
2. Resolve runtime context and routing envelope
3. Execute core transformation logic for M-174
4. Apply deterministic validation checks
5. Emit packet and write additive dossier patch
6. Register packet in se_packet_index
7. On critical error: escalate to WF-900
```
## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "M-174-[timestamp]",
  "artifact_family": "visual-asset-generator_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-WF",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO timestamp]",
  "status": "CREATED | PARTIAL | EMPTY",
  "payload": {
    "skill_id": "M-174",
    "skill_name": "Visual Asset Generator",
    "result": {}
  }
}
```
**Write Targets:**
- dossier.operations_vein.visual-asset-generator (append_to_array)
- se_packet_index (single index row)

## 8. Governance
- **Director Binding:** Narada (owner), Krishna (strategic authority)
- **Veto Power:** no
- **Approval Gate:** none unless downstream workflow requires explicit approval
- **Policy Requirements:**
  - Use patch-only mutation law
  - Never overwrite existing dossier fields
  - Maintain packet lineage and audit references

## 9. Tool / Runtime Usage

**Allowed:**
- deterministic transforms
- schema validation and packet shaping
- route-aware dossier patch appends

**Forbidden:**
- destructive mutations
- unauthorized namespace writes
- bypassing governance escalation paths

## 10. Mutation Law

**Reads:**
- dossier scoped context slices
- route/workflow registry contracts
- upstream packet payloads

**Writes:**
- dossier.operations_vein.visual-asset-generator (append_only)
- se_packet_index row for packet traceability

**Forbidden Mutations:**
- overwrite of prior dossier values
- write to unrelated namespaces
- mutation without packet metadata

## 11. Best Practices
- Keep transformations deterministic and replay-safe
- Preserve source evidence/provenance in packet payload
- Emit explicit partial status on non-critical source gaps
- Keep escalation payload machine-readable for WF-900

## 12. Validation / Done

**Acceptance Tests:**
- TEST-PH1-M174-001: valid input produces CREATED packet
- TEST-PH1-M174-002: invalid input escalates to WF-900
- TEST-PH1-M174-003: dossier patch is additive only

**Done Criteria:**
- Output packet schema conforms to family contract
- Additive dossier patch applied with no overwrite
- se_packet_index row produced
- Replay path and escalation path are defined





