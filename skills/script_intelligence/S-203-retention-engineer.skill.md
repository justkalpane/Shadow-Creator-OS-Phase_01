# SKL-PH1-RETENTION-ENGINEER

## 1. Skill Identity
- **Skill ID:** S-203
- **Skill Name:** Retention Engineer
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-WF
- **Consumer Workflows:** WF-200, CWF-210, CWF-220, CWF-230, CWF-240
- **Vein/Route/Stage:** narrative_vein / topic_to_script / Stage_C_Script

## 2. Purpose
Runtime-ready canonical skill artifact for S-203 (Retention Engineer). This specification follows repository DNA law and enforces deterministic execution, packet lineage, governance-safe escalation, and patch-only mutation discipline.

## 3. DNA Injection
- **Role Definition:** retention-engineer_executor
- **DNA Archetype:** Saraswati
- **Behavior Model:** deterministic, registry-bound, escalation-safe
- **Operating Method:** ingest -> validate -> execute -> emit -> index
- **Working Style:** evidence-first, schema-locked, replay-aware

## 4. Workflow Injection
- **Producer:** WF
- **Direct Consumers:** WF-200, CWF-210, CWF-220, CWF-230, CWF-240
- **Upstream Dependencies:** workflow_registry, skill_loader_registry, dossier packet context
- **Downstream Handoff:** retention-engineer_packet -> downstream workflow chain
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
3. Execute core transformation logic for S-203
4. Apply deterministic validation checks
5. Emit packet and write additive dossier patch
6. Register packet in se_packet_index
7. On critical error: escalate to WF-900
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "S-203-[timestamp]",
  "artifact_family": "retention-engineer_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-WF",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO timestamp]",
  "status": "CREATED | PARTIAL | EMPTY",
  "payload": {
    "skill_id": "S-203",
    "skill_name": "Retention Engineer",
    "result": {}
  }
}
```

**Write Targets:**
- dossier.narrative_vein.retention-engineer (append_to_array)
- se_packet_index (single index row)

## 8. Governance
- **Director Binding:** Saraswati (owner), Krishna (strategic authority)
- **Authority Level:** CONTROL (runtime execution), ADVISORY (policy)
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
- dossier.narrative_vein.retention-engineer (append_only)
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
- TEST-PH1-S203-001: valid input produces CREATED packet
- TEST-PH1-S203-002: invalid input escalates to WF-900
- TEST-PH1-S203-003: dossier patch is additive only

**Done Criteria:**
- Output packet schema conforms to family contract
- Additive dossier patch applied with no overwrite
- se_packet_index row produced
- Replay path and escalation path are defined
