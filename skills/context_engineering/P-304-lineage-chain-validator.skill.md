# SKL-PH1-LINEAGE-CHAIN-VALIDATOR

## 1. Skill Identity
- **Skill ID:** P-304
- **Skill Name:** lineage_chain_validator
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-CWF-340-Lineage-Validator
- **Consumer Workflows:** CWF-340-Lineage-Validator (internal), WF-400-Media-Production (gated by output)
- **Vein/Route/Stage:** context_engineering_vein / topic_to_script / Stage_D

## 2. Purpose
Validates the full lineage chain connecting the topic candidate board through research synthesis, final script packet, and all three context engineering packets (execution_context, platform_package, asset_brief). Ensures every sourced_from_packet_id reference is resolvable, all dossier references are consistent, and quality gates from across the pipeline are satisfied before the final context_engineering_packet is sealed. Failure at this skill blocks promotion to WF-400.

## 3. DNA Injection
- **Role Definition:** Lineage auditor and quality gate enforcer who certifies the full pipeline from topic to production-ready context packet is intact and traceable
- **DNA Archetype:** Krishna
- **Behavior Model:** Auditory, evidence-driven, trust-but-verify, zero-tolerance for lineage breaks
- **Operating Method:** ingest all four packets → check presence → trace sourced_from chain → evaluate quality gates → confirm governance → emit or escalate
- **Working Style:** Methodical, skeptical of missing references, authoritative on gate decisions — will escalate rather than proceed with unresolved lineage gaps

## 4. Workflow Injection
- **Producer:** CWF-330-Asset-Brief-Generator (final upstream packet before CWF-340)
- **Direct Consumers:** WF-400-Media-Production (consumes context_engineering_packet)
- **Upstream Dependencies:** asset_brief_packet, platform_package_packet, execution_context_packet, final_script_packet — all four must be present
- **Downstream Handoff:** context_engineering_packet → WF-400 for media production execution
- **Escalation Path:** SE-N8N-WF-900 on lineage break, quality gate failure, or governance failure
- **Fallback Path:** Lenient validation mode for stub/test packets; strict mode for production packets
- **Replay Path:** SE-N8N-WF-021 if user requests re-validation after upstream fix

## 5. Inputs
**Required:**
- `dossier_id` (string) — parent dossier identifier
- `asset_brief_packet` (object) — output from CWF-330
- `execution_context_packet` (object) — output from CWF-310
- `platform_package_packet` (object) — output from CWF-320
- `final_script_packet` (object) — output from CWF-240

**Optional:**
- `route_id` (string, default: "ROUTE-001") — active route identifier

## 6. Execution Logic
```
1. Normalize input: extract all four packets and dossier_id
2. Validate packet presence (all four must have instance_id or packet_id)
   a. Throw to WF-900 if any packet is missing
3. Trace lineage chain
   a. Verify ABP.sourced_from_packet_id resolves to PPP.instance_id (when both are real IDs)
   b. Verify PPP.sourced_from_packet_id resolves to ECP.instance_id
   c. Verify ECP.sourced_from_packet_id resolves to FSP.instance_id
   d. Verify dossier_ref is consistent across all four packets
4. Collect lineage breaks (array); lineage_valid = breaks.length === 0
5. Evaluate quality gates against available script quality scores
   a. grammar_score >= 0.95, seo_readiness >= 0.85, tone_consistency >= 0.90
   b. execution_context_complete, packaging_complete, asset_brief_ready_for_wf400 checks
   c. Lenient mode for test/stub packets (no real quality scores present)
6. If lineage_valid is false: throw to WF-900 with break details
7. If quality gates fail in strict mode: throw to WF-900 with failed gate names
8. Assemble context_engineering_packet with constituent_packets reference map
9. Return context_engineering_packet with next_workflow: WF-400
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
    "narrative": { "content": {}, "platform": "", "asset_briefs_summary": {} },
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
      "lineage_integrity_score": 0.0,
      "quality_gate_score": 0.0,
      "overall_readiness_score": 0.0,
      "gate_checks": { "lineage_valid": true, "all_quality_gates_passed": true, "governance_compliant": true, "ready_for_wf400": true }
    },
    "status": { "decision_path": "PROCEED_TO_WF-400", "next_workflow": "WF-400", "escalation_needed": false, "wf300_complete": true }
  }
}
```

**Write Targets:**
- `dossier.context.context_engineering_packets` (append_to_array)
- `dossier.runtime.wf300_completion_log` (append)

## 8. Governance
- **Director Binding:** Krishna (owner), Yama (supporting), Kubera (supporting)
- **Veto Power:** yes — can block promotion to WF-400 if lineage or quality gates fail
- **Approval Gate:** This skill IS the final gate check for WF-300
- **Policy Requirements:**
  - Lineage break of any kind must escalate to WF-900 — no exceptions
  - Quality gate failure in strict mode must escalate to WF-900
  - context_engineering_packet must reference all four constituent packet IDs
  - wf300_complete must be true only when all checks pass

## 9. Tool / Runtime Usage

**Allowed:**
- Read dossier.context namespace (all three CWF-3XX packets)
- Read dossier.script namespace (final_script_packet quality scores)
- Write to dossier.context namespace (append_to_array only)
- Write to dossier.runtime namespace (append only)

**Forbidden:**
- Do NOT approve or skip quality gates
- Do NOT emit context_engineering_packet with lineage breaks present
- Do NOT modify upstream packets
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
- Do NOT overwrite existing packets in dossier.context
- Do NOT mutate dossier identity fields
- Do NOT modify constituent packet content during validation

## 11. Best Practices
- Lineage tracing should be lenient for stub IDs (test mode) — apply LENIENT flag explicitly
- Always include the full lineage_trace object in evidence section for audit purposes
- Failed quality gates should list specific gate names and actual vs. minimum values in error
- constituent_packets reference map must include all four IDs — never emit partial reference map
- Set overall_readiness_score to reflect actual validation outcome, not a fixed value

## 12. Validation / Done

**Acceptance Tests:**
- TEST-PH1-P304-001: context_engineering_packet emitted with all 5 payload sections present
- TEST-PH1-P304-002: constituent_packets reference map includes all four upstream packet IDs
- TEST-PH1-P304-003: lineage break detected when ABP.sourced_from does not match PPP.instance_id
- TEST-PH1-P304-004: WF-900 escalation triggered on lineage break
- TEST-PH1-P304-005: quality gate failure in strict mode triggers WF-900 escalation
- TEST-PH1-P304-006: next_workflow set to WF-400 and wf300_complete set to true on success
- TEST-PH1-P304-007: dossier.context.context_engineering_packets and dossier.runtime.wf300_completion_log updated

**Done Criteria:**
- Packet schema matches context_engineering_packet family contract
- All outputs have proper types and structure
- Dossier patch is additive only
- Lineage chain validated end-to-end
- next_workflow set to WF-400
