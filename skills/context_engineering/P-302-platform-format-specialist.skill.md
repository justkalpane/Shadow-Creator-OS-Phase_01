# SKL-PH1-PLATFORM-FORMAT-SPECIALIST

## 1. Skill Identity
- **Skill ID:** P-302
- **Skill Name:** platform_format_specialist
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-CWF-320-Platform-Packager
- **Consumer Workflows:** CWF-330-Asset-Brief-Generator
- **Vein/Route/Stage:** context_engineering_vein / topic_to_script / Stage_D

## 2. Purpose
Applies platform-specific format rules and generates platform metadata for the script content. Knows the structural, metadata, and delivery requirements for YouTube, blog, podcast, and email channels. Transforms an execution-context-wrapped script into a properly structured delivery package matched to the target platform's format specifications, ensuring downstream production teams receive clear packaging instructions.

## 3. DNA Injection
- **Role Definition:** Platform delivery specialist who restructures and annotates content according to channel-specific format requirements
- **DNA Archetype:** Saraswati
- **Behavior Model:** Format-precise, platform-knowledgeable, metadata-thorough, delivery-oriented
- **Operating Method:** ingest execution_context_packet → detect platform → apply format rules → generate platform metadata → assemble platform_package_packet
- **Working Style:** Systematic, format-aware, detail-oriented — every metadata field is populated to spec for the target platform

## 4. Workflow Injection
- **Producer:** CWF-310-Execution-Context-Builder (emits execution_context_packet)
- **Direct Consumers:** CWF-330-Asset-Brief-Generator (consumes platform_package_packet)
- **Upstream Dependencies:** execution_context_packet must be present; target_platform must be resolvable from context envelope
- **Downstream Handoff:** platform_package_packet → CWF-330 for asset brief generation
- **Escalation Path:** SE-N8N-WF-900 on missing execution_context_packet or format resolution failure
- **Fallback Path:** Apply youtube generic format defaults if platform is unrecognized; flag in packet status
- **Replay Path:** SE-N8N-WF-021 if user requests platform or format change

## 5. Inputs
**Required:**
- `dossier_id` (string) — parent dossier identifier
- `execution_context_packet` (object) — validated output from CWF-310 containing narrative, context, evidence, quality, status sections

**Optional:**
- `target_platform` (string, default: resolved from execution_context_packet.payload.context.target_platform) — platform override
- `route_id` (string, default: "ROUTE-001") — active route identifier

## 6. Execution Logic
```
1. Normalize input: extract dossier_id, execution_context_packet, target_platform
2. Validate execution_context_packet (instance_id, context, narrative required)
   a. Throw to WF-900 if packet is missing or malformed
3. Detect resolved_platform from packet or override
4. Apply platform format rules
   a. Load format specification for target_platform (format, optimal_length, structure, metadata_fields)
   b. Assign chapter_markers_required flag
5. Generate platform metadata
   a. Build title, description/show_notes/meta_description/subject_line up to platform char limits
   b. Build tags/categories/chapters as appropriate for platform
6. Assemble platform_package_packet with 5-section payload structure
7. Return platform_package_packet
8. On error: escalate to WF-900
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "PPP-{timestamp}",
  "artifact_family": "platform_package_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-320-Platform-Packager",
  "dossier_ref": "{dossier_id}",
  "created_at": "{ISO timestamp}",
  "status": "CREATED",
  "payload": {
    "narrative": {
      "content": {},
      "platform_structured_body": { "format": "", "structure": [], "estimated_delivery_length": "", "chapter_markers_required": false },
      "delivery_ready": true
    },
    "context": {
      "sourced_from_packet_id": "",
      "target_platform": "",
      "execution_requirements": {},
      "platform_metadata": {},
      "platform_format_rules": {}
    },
    "evidence": { "lineage_references": [], "validation_checks": [] },
    "quality": { "platform_readiness_score": 0.0, "gate_checks": {}, "packaging_complete": true },
    "status": { "decision_path": "", "next_workflow": "CWF-330", "escalation_needed": false }
  }
}
```

**Write Targets:**
- `dossier.context.platform_package_packets` (append_to_array)

## 8. Governance
- **Director Binding:** Saraswati (owner), Krishna (supporting)
- **Veto Power:** no
- **Approval Gate:** none — final approval gate is at CWF-340
- **Policy Requirements:**
  - Platform metadata must conform to platform character limits
  - Platform format rules must be sourced from the approved format specification table
  - All packaging must preserve script narrative integrity from upstream packets

## 9. Tool / Runtime Usage

**Allowed:**
- Read dossier.context namespace (execution_context_packets)
- Read platform format specification registry
- Write to dossier.context namespace (append_to_array only)

**Forbidden:**
- Do NOT modify script narrative content
- Do NOT overwrite existing context records
- Do NOT generate metadata that contradicts the script's governance-approved claims
- Do NOT publish or release content

## 10. Mutation Law

**Reads:**
- `dossier.context.execution_context_packets`
- Platform format specification registry

**Writes:**
- `dossier.context.platform_package_packets` (append_to_array, never overwrite)

**Forbidden Mutations:**
- Do NOT overwrite existing fields in dossier.context
- Do NOT mutate dossier identity fields
- Do NOT write to dossier.script, dossier.research, or dossier.discovery namespaces

## 11. Best Practices
- Always truncate title/description fields to platform char limits — never leave oversized metadata
- When platform is unrecognized, default to youtube format and flag in packet status with reason
- Log the exact format specification version applied in the audit_entry
- chapter_markers_required must be explicitly set (not null) — default false when platform doesn't support it
- platform_metadata should be complete enough for a production team to begin work without requesting clarification

## 12. Validation / Done

**Acceptance Tests:**
- TEST-PH1-P302-001: platform_package_packet emitted with all 5 payload sections present
- TEST-PH1-P302-002: platform_structured_body.format matches target_platform spec
- TEST-PH1-P302-003: platform_metadata contains all required fields for target_platform
- TEST-PH1-P302-004: title/description truncated to platform char limits
- TEST-PH1-P302-005: dossier.context.platform_package_packets array updated with new entry

**Done Criteria:**
- Packet schema matches platform_package_packet family contract
- All outputs have proper types and structure
- Dossier patch is additive only
- next_workflow set to CWF-330
