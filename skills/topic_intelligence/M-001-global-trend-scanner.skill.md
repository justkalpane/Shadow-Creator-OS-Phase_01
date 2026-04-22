# SKL-PH1-GLOBAL-TREND-SCANNER

## 1. Skill Identity
- **Skill ID:** M-001
- **Skill Name:** Global Trend Scanner
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-CWF-110-Topic-Discovery
- **Consumer Workflows:** SE-N8N-CWF-110-Topic-Discovery, SE-N8N-CWF-120-Topic-Qualification
- **Vein/Route/Stage:** discovery_vein / topic_to_script / Stage_B_Discovery

## 2. Purpose
Runtime-ready canonical skill artifact for M-001 (Global Trend Scanner). This specification follows repository DNA law and enforces deterministic execution, packet lineage, governance-safe escalation, and patch-only mutation discipline.

## 3. DNA Injection
- **Role Definition:** global-trend-scanner_executor
- **DNA Archetype:** Narada (seer of broad pattern landscapes)
- **Behavior Model:** deterministic, registry-bound, escalation-safe
- **Operating Method:** ingest -> validate -> execute -> emit -> index
- **Working Style:** evidence-first, schema-locked, replay-aware

## 4. Workflow Injection
- **Producer:** WF
- **Direct Consumers:** SE-N8N-CWF-110-Topic-Discovery, SE-N8N-CWF-120-Topic-Qualification
- **Upstream Dependencies:** workflow_registry, skill_loader_registry, dossier packet context
- **Downstream Handoff:** global-trend-scanner_packet -> downstream workflow chain
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
3. Execute core transformation logic for M-001
4. Apply deterministic validation checks
5. Emit packet and write additive dossier patch
6. Register packet in se_packet_index
7. On critical error: escalate to WF-900
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "M-001-[timestamp]",
  "artifact_family": "global-trend-scanner_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-110-Topic-Discovery",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO timestamp]",
  "status": "CREATED | PARTIAL | EMPTY",
  "payload": {
    "skill_id": "M-001",
    "skill_name": "Global Trend Scanner",
    "result": {}
  }
}
```

**Write Targets:**
- dossier.discovery_vein.global-trend-scanner (append_to_array)
- se_packet_index (single index row)

## 8. Governance
- **Director Binding:** Narada (seer of broad pattern landscapes) (owner), Krishna (strategic authority)
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
- dossier.discovery_vein.global-trend-scanner (append_only)
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
- TEST-PH1-M001-001: valid input produces CREATED packet
- TEST-PH1-M001-002: invalid input escalates to WF-900
- TEST-PH1-M001-003: dossier patch is additive only

**Done Criteria:**
- Output packet schema conforms to family contract
- Additive dossier patch applied with no overwrite
- se_packet_index row produced
- Replay path and escalation path are defined
