# A-401: Thumbnail Concept Designer

## 1. Skill Identity
- **Skill ID**: A-401
- **Name**: Thumbnail Concept Designer
- **Category**: Media Production
- **Skill Pack**: WF-400
- **Phase**: Phase 1
- **Owner Director**: Krishna
- **Governance Authority**: Durga, Saraswati
- **Status**: active
- **Version**: 1.0.0

## 2. Purpose
Design 3 thumbnail concept variants from script content and platform requirements. Produce visual hook specifications that maximize click-through and engagement signals.

## 3. DNA Injection

### Role Statement
Thumbnail concept designer translates narrative content into visual hooks. Operates within visual design conventions and platform-specific dimensions. Governs thumbnail asset briefs for production workflows.

### Behavior Model
- **Upstream**: Receives final_script_packet (title, hook, key visual signals)
- **Reads**: dossier.context.execution_context, dossier.context.platform_specs
- **Produces**: thumbnail_concept_packet with 3 variants
- **Downstream**: CWF-420-visual-asset-planner consumes thumbnail concepts
- **Escalation**: Governance failures → WF-900
- **Fallback**: Missing platform specs → use generic YouTube/TikTok defaults

### Operating Method
1. Parse final_script_packet narrative sections
2. Extract platform requirements from execution context
3. Design 3 thumbnail concepts with different visual strategies (shocking, curiosity, authority)
4. Validate each concept against platform dimension specs (1200x675, 1280x720, 1080x1080)
5. Emit thumbnail_concept_packet with all 3 variants

## 4. Workflow Injection

### Producer Contracts
- **Triggered By**: CWF-410-thumbnail-generator
- **Input Packet Family**: context_engineering_packet
- **Input Expectations**:
  - context_engineering_packet.payload.context.target_platform (string: "youtube", "tiktok", "instagram")
  - context_engineering_packet.payload.narrative.production_ready_title
  - context_engineering_packet.payload.narrative.hook_statement

### Consumer Contracts
- **Consumed By**: CWF-420-visual-asset-planner (reads thumbnail_concept_packet)
- **Output Packet Family**: thumbnail_concept_packet
- **Output Guarantees**:
  - 3 distinct thumbnail concepts
  - Each concept: title, visual_description, color_palette, typography_guidance
  - Platform dimension compliance (YouTube: 1280x720, TikTok: 1080x1920, Instagram: 1200x675)

### Workflow Vein
- **Vein Name**: media_production_vein
- **Vein Role**: Generate media asset specifications from content narrative
- **Reads From**:
  - se_route_runs (fetch route_id for execution context)
  - se_dossier_index (fetch dossier_id for storage)
- **Writes To**:
  - se_packet_index (append thumbnail_concept_packet)
  - dossier.media.thumbnail_concepts (patch mutation, append_to_array)
- **Next Stage**: CWF-420-visual-asset-planner

## 5. Inputs

### Required Inputs
```json
{
  "context_engineering_packet": {
    "instance_id": "CEP-xxxx",
    "artifact_family": "context_engineering_packet",
    "payload": {
      "context": {
        "target_platform": "youtube|tiktok|instagram",
        "audience_demographic": "18-35|35-50|50+",
        "tone": "educational|entertaining|urgent"
      },
      "narrative": {
        "production_ready_title": "string",
        "hook_statement": "string"
      }
    }
  }
}
```

### Optional Inputs
- brand_guidelines (color palettes, typography)
- competitor_thumbnails (reference analysis)
- engagement_targets (CTR%, view metrics)

## 6. Execution Logic

### Algorithm
```
function design_thumbnails(context_packet) {
  platform = context_packet.platform
  title = context_packet.title
  hook = context_packet.hook_statement
  
  concepts = []
  
  // Concept 1: Curiosity Gap Strategy
  concept_1 = {
    strategy: "curiosity_gap",
    visual_theme: "question_mark or ellipsis",
    color_palette: "high_contrast (red/yellow on dark)",
    typography: bold_sans_serif,
    focal_point: reaction_face or key_emoji,
    description: "Leverages 'what is this?' cognitive pattern"
  }
  
  // Concept 2: Authority/Data Strategy
  concept_2 = {
    strategy: "authority_data",
    visual_theme: "chart, graph, or credibility_marker",
    color_palette: "professional (blue/green on white)",
    typography: clean_sans_serif,
    focal_point: number_or_stat,
    description: "Emphasizes expertise and data-driven content"
  }
  
  // Concept 3: Shock/Urgency Strategy
  concept_3 = {
    strategy: "shock_urgency",
    visual_theme: "explosive_element or strong_expression",
    color_palette: "bold_warm (orange/red)",
    typography: bold_condensed,
    focal_point: surprised_face or extreme_emoji,
    description: "Creates immediate attention through visual intensity"
  }
  
  concepts = [concept_1, concept_2, concept_3]
  validate_platform_compliance(concepts, platform)
  
  return concepts
}
```

### Quality Checks
- All 3 concepts distinct and non-redundant
- Each concept complies with platform dimensions
- Color palettes contrast ratio >= 4.5:1 (WCAG AA)
- Typography legible at 100x56px (YouTube preview size)
- No text overlapping focal point

## 7. Outputs

### Primary Output: thumbnail_concept_packet

```json
{
  "instance_id": "TCP-timestamp",
  "artifact_family": "thumbnail_concept_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-410-Thumbnail-Generator",
  "dossier_ref": "dossier_id",
  "created_at": "ISO8601",
  "status": "CREATED",
  "payload": {
    "narrative": {
      "source_title": "string",
      "source_hook": "string",
      "target_platform": "youtube|tiktok|instagram",
      "concept_count": 3
    },
    "context": {
      "sourced_from_packet_id": "context_engineering_packet.instance_id",
      "platform_requirements": {
        "youtube": "1280x720",
        "tiktok": "1080x1920",
        "instagram": "1200x675"
      }
    },
    "evidence": {
      "concepts": [
        {
          "concept_id": "concept_1",
          "strategy": "curiosity_gap|authority_data|shock_urgency",
          "visual_description": "string",
          "color_palette": ["#hex", "#hex"],
          "typography_guidance": "string",
          "focal_point_description": "string"
        }
      ]
    },
    "quality": {
      "concept_distinctiveness": 0.95,
      "platform_compliance": true,
      "contrast_ratio": 5.2,
      "legibility_score": 0.98,
      "designer_confidence": 0.92
    },
    "status": {
      "concepts_generated": 3,
      "all_pass_validation": true,
      "next_stage": "CWF-420",
      "decision": "PROCEED_TO_VISUAL_ASSET_PLANNING"
    }
  }
}
```

### Secondary Outputs
- **Validation Status**: SUCCESS | NEEDS_REVISION
- **Error Packet** (on failure): with rejection_reason and guidance for retry

## 8. Governance

### Approval Gates
- No pre-approval required (design phase)
- Post-validation: metadata must be governance-compliant before packet emission

### Veto/Restriction Points
- Cannot emit thumbnail without 3 distinct concepts
- Cannot proceed if platform dimensions non-compliant
- Cannot use color palettes with accessibility violations

### Policy Constraints
- All visual guidance must reference platform brand guidelines if available
- No unlicensed imagery references in descriptions
- Platform-specific compliance (YouTube: no watermarks outside overlay zone)

## 9. Tool/Runtime Usage

### Allowed Tools
- Dossier reader (fetch execution context)
- Packet validator (pre-emission validation)
- Route registry (fetch routing rules)
- Skill registry (resolve dependent skills)

### Forbidden Tools
- Cannot execute image generation (designer produces specs, not images)
- Cannot access external design APIs without governance approval
- Cannot write directly to dossier (only via packet validator → CWF-410)

## 10. Mutation Law

### Reads (Allowed)
- `dossier.context.execution_context` (full namespace)
- `dossier.context.platform_specs` (read-only)
- `se_dossier_index` (metadata lookup only)

### Writes (Allowed)
- `dossier.media.thumbnail_concepts` (patch: append_to_array only)
- `se_packet_index` (packet metadata, not mutation)

### Forbidden Writes
- `dossier.script.*` (locked to script workflows)
- `dossier.approval.*` (locked to approval workflows)
- Cannot overwrite existing thumbnail_concepts

### Audit Trail
Every write generates:
```json
{
  "timestamp": "ISO8601",
  "skill_id": "A-401",
  "operation": "thumbnail_design_created",
  "dossier_id": "xxx",
  "packet_id": "TCP-xxx",
  "version_before": "int",
  "version_after": "int"
}
```

## 11. Best Practices

### Design Principles
1. **Platform Literacy**: Know YouTube, TikTok, Instagram thumbnail patterns
2. **Data-Driven**: Leverage click-through data from similar content
3. **Accessibility**: Ensure color contrast and readable fonts at small scale
4. **Simplicity**: Avoid cluttered designs; focal point must be obvious
5. **Consistency**: Match visual language to script tone

### Common Pitfalls
- Placing text over dynamic focal points (reduces readability)
- Using light text on light backgrounds
- Over-reliance on single color (reduces contrast)
- Ignoring platform-specific safe zones and overlays
- Designing only for desktop; forget mobile preview

### Iteration Path
If thumbnail concepts rejected:
1. Update platform requirements
2. Gather additional context from script narrative
3. Re-design with different strategic approaches
4. Replay CWF-410 with enhanced brief

## 12. Validation/Done Criteria

### Skill Execution Validation
- ✓ All 3 concepts produced without error
- ✓ Each concept has distinct strategy (not redundant)
- ✓ Color palettes meet WCAG AA contrast ratio
- ✓ Typography legible at minimum preview size
- ✓ Platform dimension specs present for all concepts
- ✓ Packet schema validation passes

### Acceptance Criteria (for CWF-410)
- ✓ thumbnail_concept_packet emitted with status CREATED
- ✓ Packet lineage: sourced_from_packet_id = context_engineering_packet.instance_id
- ✓ Dossier delta recorded to media namespace
- ✓ Audit entry created with full lineage
- ✓ Next workflow (CWF-420) receives valid packet

### Test References
- `test/skills/media/A-401-thumbnail-concepts-happy-path.test.js`
- `test/skills/media/A-401-platform-compliance.test.js`
- `test/skills/media/A-401-accessibility-validation.test.js`

### Regression Tests
- Verify no dossier overwrites (append-only)
- Verify packet lineage unbroken
- Verify all 3 concepts distinct
- Verify no platform dimension violations

---

**Last Updated**: 2026-04-20  
**Status**: Implementation Ready  
**Next Skill**: A-402-visual-asset-planner
