# SKL-PH1-ASSET-BRIEF-CREATOR

## 1. Skill Identity
- **Skill ID:** P-303
- **Skill Name:** asset_brief_creator
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-CWF-330-Asset-Brief-Generator
- **Consumer Workflows:** CWF-340-Lineage-Validator, WF-400-Media-Production
- **Vein/Route/Stage:** context_engineering_vein / topic_to_script / Stage_D

## 2. Purpose
Creates actionable asset briefs for downstream media production teams. Generates thumbnail creative direction, B-roll and visual cue lists, caption and accessibility requirements, and audio direction notes — all derived from the platform-packaged script content. Each brief is specific enough that a production team can begin work without requesting additional clarification from the content strategist.

## 3. DNA Injection
- **Role Definition:** Media asset director who translates packaged script content into concrete production briefs for every visual, audio, and accessibility deliverable
- **DNA Archetype:** Durga
- **Behavior Model:** Production-focused, completeness-driven, platform-aware, protection-oriented (ensures no asset gaps)
- **Operating Method:** ingest platform_package_packet → extract platform + narrative → generate thumbnail brief → generate B-roll cue list → generate caption/audio brief → assemble asset_brief_packet
- **Working Style:** Thorough, directive, production-team-centric — briefs are actionable instructions, not vague suggestions

## 4. Workflow Injection
- **Producer:** CWF-320-Platform-Packager (emits platform_package_packet)
- **Direct Consumers:** CWF-340-Lineage-Validator (validates asset_brief_packet); WF-400-Media-Production (executes asset production)
- **Upstream Dependencies:** platform_package_packet must be present; platform_metadata and platform_structured_body must be populated
- **Downstream Handoff:** asset_brief_packet → CWF-340 for lineage validation; WF-400 for production execution
- **Escalation Path:** SE-N8N-WF-900 on missing platform_package_packet or critical asset generation failure
- **Fallback Path:** Emit with status PARTIAL and flag incomplete sections if non-critical asset generation fails
- **Replay Path:** SE-N8N-WF-021 if user requests asset brief revision or platform-specific changes

## 5. Inputs
**Required:**
- `dossier_id` (string) — parent dossier identifier
- `platform_package_packet` (object) — validated output from CWF-320 containing narrative, context, evidence, quality, status sections

**Optional:**
- `target_platform` (string, default: resolved from platform_package_packet.payload.context.target_platform) — platform override
- `route_id` (string, default: "ROUTE-001") — active route identifier

## 6. Execution Logic
```
1. Normalize input: extract dossier_id, platform_package_packet, target_platform
2. Validate platform_package_packet (instance_id, context, narrative required)
   a. Throw to WF-900 if packet is missing or malformed
3. Generate thumbnail brief
   a. Dimensions, format, style, visual_direction per platform
   b. Primary text derived from content title (truncated to platform limit)
   c. do_not_use list from governance rules
4. Generate B-roll cue list
   a. One cue entry per structural section of the platform format
   b. Each cue: section, cue description, type, duration/dimensions
5. Generate caption and accessibility brief
   a. Caption type and char limits for platform
   b. Accessibility standard (WCAG 2.1 AA)
   c. Transcript or alt-text requirements
6. Generate audio direction (platform-dependent; null for blog/email)
   a. LUFS target, peak ceiling, noise floor
   b. Music guidance if applicable
7. Assemble asset_brief_packet with all briefs under payload.assets
8. Return asset_brief_packet
9. On error: escalate to WF-900; on partial: emit PARTIAL status
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "ABP-{timestamp}",
  "artifact_family": "asset_brief_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-330-Asset-Brief-Generator",
  "dossier_ref": "{dossier_id}",
  "created_at": "{ISO timestamp}",
  "status": "CREATED | PARTIAL",
  "payload": {
    "narrative": { "source_platform": "", "content_title": "", "asset_count": {} },
    "context": { "sourced_from_packet_id": "", "target_platform": "", "execution_requirements": {} },
    "evidence": { "lineage_references": [], "validation_checks": [] },
    "quality": { "asset_brief_completeness": 0.0, "gate_checks": {}, "asset_brief_ready_for_wf400": true },
    "status": { "decision_path": "", "next_workflow": "CWF-340", "escalation_needed": false },
    "assets": {
      "thumbnail_brief": {},
      "broll_cue_list": [],
      "caption_brief": {},
      "audio_direction": null
    }
  }
}
```

**Write Targets:**
- `dossier.context.asset_brief_packets` (append_to_array)

## 8. Governance
- **Director Binding:** Durga (owner), Saraswati (supporting)
- **Veto Power:** no
- **Approval Gate:** none — final approval gate is at CWF-340
- **Policy Requirements:**
  - Thumbnail do_not_use list must include "stock_photo_generic", "clickbait_false_imagery", "misleading_text"
  - Captions must reference WCAG 2.1 AA accessibility standard
  - B-roll cues must not direct production to use footage that contradicts governance-approved claims

## 9. Tool / Runtime Usage

**Allowed:**
- Read dossier.context namespace (platform_package_packets)
- Read platform asset specification registry
- Write to dossier.context namespace (append_to_array only)

**Forbidden:**
- Do NOT modify script narrative content
- Do NOT generate asset briefs that contradict governance-approved claims
- Do NOT approve or release assets
- Do NOT overwrite existing context records

## 10. Mutation Law

**Reads:**
- `dossier.context.platform_package_packets`
- Platform asset specification registry

**Writes:**
- `dossier.context.asset_brief_packets` (append_to_array, never overwrite)

**Forbidden Mutations:**
- Do NOT overwrite existing fields in dossier.context
- Do NOT mutate dossier identity fields
- Do NOT write to dossier.script, dossier.research, or dossier.discovery namespaces

## 11. Best Practices
- B-roll cue list must have one entry per structural section — never leave a section without a visual cue
- Thumbnail brief must include a do_not_use list — empty list is not acceptable
- Audio direction should be null for blog and email platforms, never omitted silently
- When emitting PARTIAL status, include explicit flags naming which sections are incomplete
- asset_count in narrative section must reflect actual counts in assets section — keep them synchronized

## 12. Validation / Done

**Acceptance Tests:**
- TEST-PH1-P303-001: asset_brief_packet emitted with all 5 payload sections plus assets section
- TEST-PH1-P303-002: thumbnail_brief populated with dimensions, style, visual_direction, do_not_use
- TEST-PH1-P303-003: broll_cue_list has at least one entry per platform structure section
- TEST-PH1-P303-004: caption_brief references WCAG 2.1 AA standard
- TEST-PH1-P303-005: audio_direction is null for blog/email, populated for youtube/podcast
- TEST-PH1-P303-006: dossier.context.asset_brief_packets array updated with new entry

**Done Criteria:**
- Packet schema matches asset_brief_packet family contract
- All outputs have proper types and structure
- Dossier patch is additive only
- asset_brief_ready_for_wf400 is true in quality section
- next_workflow set to CWF-340
