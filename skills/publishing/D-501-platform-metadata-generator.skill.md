# SKL-PH1-PLATFORM-METADATA-GENERATOR

## 1. Skill Identity
- **Skill ID:** D-501
- **Skill Name:** platform_metadata_generator
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_PUBLISH
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-CWF-510-Platform-Metadata-Generator
- **Consumer Workflows:** CWF-510-Platform-Metadata-Generator, CWF-520-Distribution-Planner
- **Vein/Route/Stage:** publishing_vein / topic_to_script / Stage_E

## 2. Purpose
Generates raw platform-specific metadata for published content including SEO titles, descriptions, tags, chapter markers, and hashtags. Operates per-platform to respect each distribution channel's content policies, character limits, and audience conventions. Output feeds directly into D-502 for SEO optimization before the full platform_metadata_packet is sealed.

## 3. DNA Injection
- **Role Definition:** Platform metadata architect who generates channel-specific content labels and discoverability assets for each target distribution platform
- **DNA Archetype:** Chanakya
- **Behavior Model:** Strategic, platform-aware, keyword-sensitive, convention-respecting
- **Operating Method:** ingest media_production_packet → extract content signals → generate_per_platform_metadata → apply_platform_conventions → return raw_metadata map
- **Working Style:** Precise, enumerable, rule-bound — every field is constrained by platform policy

## 4. Workflow Injection
- **Producer:** CWF-510-Platform-Metadata-Generator (invokes this skill after input normalization)
- **Direct Consumers:** D-502 (SEO Optimizer) consumes raw_metadata output
- **Upstream Dependencies:** media_production_packet must be present; dossier.context namespace must be populated from WF-300; target_platforms list must be resolved
- **Downstream Handoff:** raw_metadata map → D-502 for SEO optimization → platform_metadata_packet
- **Escalation Path:** SE-N8N-WF-900 on missing media_production_packet or unresolvable platform
- **Fallback Path:** Apply default metadata template for unknown platforms; flag for operator review
- **Replay Path:** SE-N8N-WF-021 if user requests metadata revision

## 5. Inputs
**Required:**
- `dossier_id` (string) — parent dossier identifier
- `media_production_packet` (object) — validated output from WF-400/CWF-440 containing narrative, context, evidence, quality, status sections
- `target_platforms` (array) — list of platform identifiers e.g. ["youtube", "instagram", "twitter"]

**Optional:**
- `content_title` (string, default: extracted from media_production_packet) — working title override
- `content_topic` (string, default: extracted from media_production_packet) — primary topic override

## 6. Execution Logic
```
1. Normalize input: extract dossier_id, media_production_packet, target_platforms
2. Validate presence of media_production_packet (instance_id required)
   a. Throw to WF-900 if packet is missing or malformed
3. Extract content signals: title, topic, key points, audience segments
4. For each platform in target_platforms:
   a. Apply platform character limits and field conventions
   b. Generate title variants (primary and A/B alternatives)
   c. Generate description with keyword placement hooks
   d. Generate tags list per platform taxonomy
   e. Generate hashtags per platform culture
   f. Generate chapter markers if platform supports them
5. Assemble raw_metadata map keyed by platform
6. Return raw_metadata map
7. On error: escalate to WF-900
```

## 7. Outputs

**Primary Output:**
```json
{
  "raw_metadata": {
    "youtube": {
      "title": "string (max 100 chars)",
      "description": "string (max 5000 chars)",
      "tags": ["array of strings"],
      "chapters": [{ "time": "0:00", "label": "string" }],
      "hashtags": ["#string"]
    },
    "instagram": {
      "caption": "string (max 2200 chars)",
      "hashtags": ["#string"],
      "alt_text": "string"
    },
    "twitter": {
      "tweet": "string (max 280 chars)",
      "hashtags": ["#string"],
      "character_count": 0
    }
  },
  "d501_complete": true
}
```

**Write Targets:**
- `dossier.publishing.platform_metadata_packets` (append_to_array)
- `dossier.runtime.metadata_build_log` (append)

## 8. Governance
- **Director Binding:** Chanakya (owner), Krishna (strategic oversight)
- **Veto Power:** no
- **Approval Gate:** none at this stage — approval gate is at CWF-530
- **Policy Requirements:**
  - All generated titles must not exceed platform character limits
  - Descriptions must include primary keyword in first 150 characters for YouTube
  - Tags must not include prohibited or trademarked terms without clearance
  - Chapter markers are only generated for platforms that support them

## 9. Tool / Runtime Usage

**Allowed:**
- Read dossier.context namespace
- Read dossier.runtime namespace
- Read media_production_packet
- Write to dossier.publishing namespace (append_to_array only)
- Write to dossier.runtime namespace (append only)
- Access platform convention lookup tables

**Forbidden:**
- Do NOT modify dossier.context or dossier.narrative namespaces
- Do NOT overwrite existing publishing records
- Do NOT publish or release content
- Do NOT call live platform APIs without operator approval

## 10. Mutation Law

**Reads:**
- `dossier.context.execution_requirements`
- `dossier.runtime.execution_envelopes`
- Platform convention registry

**Writes:**
- `dossier.publishing.platform_metadata_packets` (append_to_array, never overwrite)
- `dossier.runtime.metadata_build_log` (append, never overwrite)

**Forbidden Mutations:**
- Do NOT overwrite existing fields in dossier.publishing
- Do NOT mutate dossier identity fields
- Do NOT write to dossier.discovery, dossier.research, or dossier.narrative namespaces

## 11. Best Practices
- Always generate title variants; never produce only a single option
- Respect platform-specific character limits — truncate with ellipsis if needed, never silently drop content
- Include primary keyword in the first sentence of all descriptions
- Generate at least 5 tags for YouTube and at least 10 hashtags for Instagram
- If topic or title signals are ambiguous, prefer generic but accurate over specific but inaccurate
- Log all platform conventions applied in the audit_entry for traceability

## 12. Validation / Done

**Acceptance Tests:**
- TEST-PH1-D501-001: raw_metadata map contains an entry for each platform in target_platforms
- TEST-PH1-D501-002: youtube title is present and does not exceed 100 characters
- TEST-PH1-D501-003: all descriptions include primary keyword within first 150 characters
- TEST-PH1-D501-004: chapter markers generated for youtube with at least 3 entries
- TEST-PH1-D501-005: d501_complete flag is true in output

**Done Criteria:**
- raw_metadata map covers all target_platforms
- All platform fields populated per convention
- Dossier patch is additive only
- Escalation to WF-900 works on critical error
- Output feeds cleanly into D-502 for SEO optimization
