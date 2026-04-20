# SKL-PH1-CONTEXT-PACKET-FINALIZER

## 1. Skill Identity
- **Skill ID:** P-305
- **Skill Name:** context_packet_finalizer
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-CWF-340-Lineage-Validator
- **Consumer Workflows:** WF-400-Media-Production
- **Vein/Route/Stage:** context_engineering_vein / topic_to_script / Stage_D

## 2. Purpose
Seals and finalizes the context engineering packet after all validation checks pass. Assembles the complete payload from all four constituent context packets, calculates the final overall_readiness_score, sets the wf300_complete flag, and emits the sealed context_engineering_packet that grants entry to WF-400. This is the final output of WF-300 and the handoff artifact for all downstream media production.

## 3. DNA Injection
- **Role Definition:** Final assembly and sealing authority for the context engineering packet — certifies WF-300 is complete and WF-400 may begin
- **DNA Archetype:** Krishna
- **Behavior Model:** Decisive, synthesis-focused, gate-closing, authoritative on promotion decisions
- **Operating Method:** receive validated lineage and quality results → assemble final payload → calculate readiness scores → set wf300_complete → emit sealed packet → log completion
- **Working Style:** Conclusive, summary-oriented — aggregates all upstream work into a single authoritative packet that tells WF-400 exactly what to execute

## 4. Workflow Injection
- **Producer:** P-304-Lineage-Chain-Validator (all validation checks completed before P-305 runs)
- **Direct Consumers:** WF-400-Media-Production (first consumer of context_engineering_packet)
- **Upstream Dependencies:** All CWF-3XX packets validated; lineage chain confirmed; quality gates passed
- **Downstream Handoff:** context_engineering_packet → WF-400 for full media production pipeline execution
- **Escalation Path:** SE-N8N-WF-900 on any assembly failure after validation
- **Fallback Path:** If constituent packet assembly fails, emit PARTIAL status and route to WF-900
- **Replay Path:** SE-N8N-WF-021 if user requests context engineering revision

## 5. Inputs
**Required:**
- `dossier_id` (string) — parent dossier identifier
- `asset_brief_packet` (object) — validated output from CWF-330
- `execution_context_packet` (object) — validated output from CWF-310
- `platform_package_packet` (object) — validated output from CWF-320
- `final_script_packet` (object) — validated output from CWF-240
- `lineage_trace` (object) — lineage chain trace results from P-304
- `quality_gate_results` (array) — gate check results from P-304

**Optional:**
- `route_id` (string, default: "ROUTE-001") — active route identifier

## 6. Execution Logic
```
1. Receive all validated inputs from P-304 (lineage confirmed, gates passed)
2. Assemble payload.narrative
   a. Source content from execution_context_packet.payload.narrative.content
   b. Set platform from platform_package_packet.payload.context.target_platform
   c. Set asset_briefs_summary from asset_brief_packet.payload.narrative
3. Assemble payload.context
   a. Set sourced_from_packet_id to asset_brief_packet.instance_id
   b. Set execution_requirements from execution_context_packet
   c. Build constituent_packets reference map (all four packet IDs)
4. Assemble payload.evidence
   a. Build five-entry lineage_references list (ABP, PPP, ECP, FSP, dossier)
   b. Include validation_checks from P-304 results
   c. Embed lineage_trace object
5. Calculate quality scores
   a. lineage_integrity_score: 1.0 if lineage_valid, 0.0 otherwise
   b. quality_gate_score: 1.0 if all gates passed, 0.75 if lenient
   c. overall_readiness_score: composite of lineage + quality + governance
6. Set status: next_workflow = "WF-400", wf300_complete = true, decision_path = "PROCEED_TO_WF-400"
7. Assign instance_id: "CEP-{timestamp}"
8. Return sealed context_engineering_packet
9. Write dossier_delta and runtime_delta
10. On error: escalate to WF-900
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "CEP-{timestamp}",
  "artifact_family": "context_engineering_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-340-Lineage-Validator",
  "dossier_ref": "{dossier_id}",
  "created_at": "{ISO timestamp}",
  "status": "CREATED",
  "payload": {
    "narrative": {
      "content": {},
      "platform": "",
      "asset_briefs_summary": {}
    },
    "context": {
      "sourced_from_packet_id": "",
      "target_platform": "",
      "execution_requirements": {},
      "constituent_packets": {
        "final_script_packet_id": "",
        "execution_context_packet_id": "",
        "platform_package_packet_id": "",
        "asset_brief_packet_id": ""
      }
    },
    "evidence": {
      "lineage_references": [],
      "validation_checks": [],
      "lineage_trace": {}
    },
    "quality": {
      "lineage_integrity_score": 1.0,
      "quality_gate_score": 1.0,
      "overall_readiness_score": 0.97,
      "gate_checks": {
        "lineage_valid": true,
        "all_quality_gates_passed": true,
        "governance_compliant": true,
        "ready_for_wf400": true
      }
    },
    "status": {
      "decision_path": "PROCEED_TO_WF-400",
      "next_workflow": "WF-400",
      "escalation_needed": false,
      "wf300_complete": true
    }
  }
}
```

**Write Targets:**
- `dossier.context.context_engineering_packets` (append_to_array)
- `dossier.runtime.wf300_completion_log` (append)

## 8. Governance
- **Director Binding:** Krishna (owner), Yama (supporting), Kubera (supporting)
- **Veto Power:** no (P-304 holds veto power; P-305 only runs after P-304 approves)
- **Approval Gate:** This skill finalizes the gate — it does not add a new gate
- **Policy Requirements:**
  - wf300_complete must only be set to true when lineage_valid and quality_gates_passed are both true
  - overall_readiness_score must be derived from actual check results, not hardcoded
  - constituent_packets must reference all four upstream packet IDs — never partial

## 9. Tool / Runtime Usage

**Allowed:**
- Read all four CWF-3XX context packets
- Read P-304 validation results
- Write to dossier.context namespace (append_to_array only)
- Write to dossier.runtime namespace (append only)

**Forbidden:**
- Do NOT run this skill before P-304 validation completes
- Do NOT set wf300_complete = true if any check failed
- Do NOT modify upstream packets during assembly
- Do NOT write to dossier.script, dossier.research, or dossier.discovery namespaces

## 10. Mutation Law

**Reads:**
- `dossier.context.execution_context_packets`
- `dossier.context.platform_package_packets`
- `dossier.context.asset_brief_packets`
- `dossier.script.cwf240_final_output`

**Writes:**
- `dossier.context.context_engineering_packets` (append_to_array, never overwrite)
- `dossier.runtime.wf300_completion_log` (append, never overwrite)

**Forbidden Mutations:**
- Do NOT overwrite existing entries in dossier.context
- Do NOT mutate dossier identity fields
- Do NOT retroactively modify constituent packet contents

## 11. Best Practices
- Always compute overall_readiness_score from actual check values — never hardcode 0.97
- The constituent_packets map is the authoritative cross-reference for WF-400 — verify all four IDs are non-null before sealing
- Include promoted_to_wf400: true in the runtime_delta log entry
- Do NOT emit with wf300_complete: true if any quality gate result is FAILED in strict mode
- The audit_entry in dossier_delta must include lineage_intact: true and sourced_from the dossier_ref

## 12. Validation / Done

**Acceptance Tests:**
- TEST-PH1-P305-001: context_engineering_packet sealed with status CREATED and wf300_complete: true
- TEST-PH1-P305-002: constituent_packets map contains all four non-null upstream packet IDs
- TEST-PH1-P305-003: overall_readiness_score computed from lineage + quality + governance results
- TEST-PH1-P305-004: next_workflow set to WF-400 in status section
- TEST-PH1-P305-005: dossier.context.context_engineering_packets and dossier.runtime.wf300_completion_log updated
- TEST-PH1-P305-006: P-305 does not run when P-304 has thrown to WF-900

**Done Criteria:**
- Packet schema matches context_engineering_packet family contract
- All outputs have proper types and structure
- Dossier patch is additive only
- wf300_complete: true set in payload.status
- next_workflow: "WF-400" confirmed in payload.status
- Escalation to WF-900 works on critical assembly error
