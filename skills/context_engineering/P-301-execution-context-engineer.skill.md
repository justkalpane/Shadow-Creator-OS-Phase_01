# SKL-PH1-EXECUTION-CONTEXT-ENGINEER

## 1. Skill Identity
- **Skill ID:** P-301
- **Skill Name:** execution_context_engineer
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-CWF-310-Execution-Context-Builder
- **Consumer Workflows:** CWF-320-Platform-Packager
- **Vein/Route/Stage:** context_engineering_vein / topic_to_script / Stage_D

## 2. Purpose
Engineers the runtime context envelope for a final script packet. Determines which tools are allowed for downstream execution, which operations are forbidden, what constraints apply for the target platform, and what quality gates must be satisfied before the content is released to media production. Ensures the execution environment is governed, supervised, and traceable.

## 3. DNA Injection
- **Role Definition:** Runtime context architect who defines the execution envelope surrounding a finalized script for platform-specific media production
- **DNA Archetype:** Krishna
- **Behavior Model:** Precise, governance-first, execution-aware, constraint-conscious
- **Operating Method:** ingest final_script_packet → detect platform → resolve tool set → enumerate constraints → assemble quality gates → emit execution_context_packet
- **Working Style:** Methodical, defensive, traceable — every constraint is justified by platform policy or governance rules

## 4. Workflow Injection
- **Producer:** CWF-240-Final-Script-Shaping (emits final_script_packet)
- **Direct Consumers:** CWF-320-Platform-Packager (consumes execution_context_packet)
- **Upstream Dependencies:** final_script_packet must be present; dossier.script namespace must be populated; quality scores from CWF-240 must be accessible
- **Downstream Handoff:** execution_context_packet → CWF-320 for platform format application
- **Escalation Path:** SE-N8N-WF-900 on missing final_script_packet or quality gate failure
- **Fallback Path:** Apply default constraint set for youtube if platform is unresolvable; flag for operator review
- **Replay Path:** SE-N8N-WF-021 if user requests context constraint revision

## 5. Inputs
**Required:**
- `dossier_id` (string) — parent dossier identifier
- `final_script_packet` (object) — validated output from CWF-240 containing narrative, context, evidence, quality, status sections

**Optional:**
- `target_platform` (string, default: "youtube") — platform override; if absent, read from final_script_packet.payload.context.target_platform
- `route_id` (string, default: "ROUTE-001") — active route identifier

## 6. Execution Logic
```
1. Normalize input: extract dossier_id, final_script_packet, target_platform
2. Validate presence of final_script_packet (instance_id, narrative, quality, status required)
   a. Throw to WF-900 if packet is missing or malformed
3. Resolve tool set based on target_platform
   a. Map platform → allowed_tools + forbidden_tools
   b. Default to youtube tool set if platform unknown
4. Build execution constraints list for target_platform
   a. Add governance constraints (approval_required_before_publishing)
   b. Add platform technical constraints
5. Evaluate quality gates against script quality scores
   a. grammar_score >= 0.95
   b. seo_readiness >= 0.85
   c. tone_consistency >= 0.90
6. Assemble execution_context_packet with 5-section payload structure
7. Return execution_context_packet
8. On error: escalate to WF-900
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "ECP-{timestamp}",
  "artifact_family": "execution_context_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-310-Execution-Context-Builder",
  "dossier_ref": "{dossier_id}",
  "created_at": "{ISO timestamp}",
  "status": "CREATED",
  "payload": {
    "narrative": { "content": {}, "source_script_id": "" },
    "context": {
      "sourced_from_packet_id": "",
      "target_platform": "",
      "execution_requirements": {
        "allowed_tools": [],
        "forbidden_tools": [],
        "constraints": [],
        "execution_mode": "supervised",
        "approval_required_before": "publishing"
      }
    },
    "evidence": { "lineage_references": [], "validation_checks": [] },
    "quality": { "context_build_readiness": 0.0, "gate_checks": {}, "execution_context_complete": true },
    "status": { "decision_path": "", "next_workflow": "CWF-320", "escalation_needed": false }
  }
}
```

**Write Targets:**
- `dossier.context.execution_context_packets` (append_to_array)
- `dossier.runtime.context_build_log` (append)

## 8. Governance
- **Director Binding:** Krishna (owner), Durga (supporting)
- **Veto Power:** no
- **Approval Gate:** none at this stage — approval gate is at CWF-340
- **Policy Requirements:**
  - execution_mode must always be "supervised"
  - approval_required_before must always be "publishing"
  - forbidden_tools list must include "content_modifier" and "unsupervised_publisher" at minimum

## 9. Tool / Runtime Usage

**Allowed:**
- Read dossier.script namespace
- Read dossier.runtime namespace
- Read platform tool configuration
- Write to dossier.context namespace (append_to_array only)
- Write to dossier.runtime namespace (append only)

**Forbidden:**
- Do NOT modify dossier.script namespace
- Do NOT overwrite existing context records
- Do NOT bypass quality gate checks
- Do NOT publish or release content

## 10. Mutation Law

**Reads:**
- `dossier.script.cwf240_final_output`
- `dossier.runtime.execution_envelopes`
- Platform tool configuration registry

**Writes:**
- `dossier.context.execution_context_packets` (append_to_array, never overwrite)
- `dossier.runtime.context_build_log` (append, never overwrite)

**Forbidden Mutations:**
- Do NOT overwrite existing fields in dossier.context
- Do NOT mutate dossier identity fields
- Do NOT write to dossier.script or dossier.discovery namespaces

## 11. Best Practices
- Always resolve tool set from platform lookup table, never hardcode inline
- When quality gates fail, include specific failed gate names in the escalation error
- Log all constraint decisions in the audit_entry for traceability
- If final_script_packet is a stub (test/dev mode), allow lenient validation with explicit flag
- Default platform is youtube — never leave target_platform undefined in output

## 12. Validation / Done

**Acceptance Tests:**
- TEST-PH1-P301-001: execution_context_packet emitted with all 5 payload sections present
- TEST-PH1-P301-002: allowed_tools and forbidden_tools populated based on target_platform
- TEST-PH1-P301-003: quality gates evaluated against script quality scores; failure triggers WF-900 escalation
- TEST-PH1-P301-004: dossier.context.execution_context_packets array updated with new entry
- TEST-PH1-P301-005: execution_mode is "supervised" in all output packets

**Done Criteria:**
- Packet schema matches execution_context_packet family contract
- All outputs have proper types and structure
- Dossier patch is additive only
- Escalation to WF-900 works on critical error
- next_workflow set to CWF-320
