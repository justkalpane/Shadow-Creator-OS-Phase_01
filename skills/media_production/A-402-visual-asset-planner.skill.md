# A-402: Visual Asset Planner

## 1. Skill Identity
- **Skill ID**: A-402
- **Name**: Visual Asset Planner
- **Category**: Media Production
- **Skill Pack**: WF-400
- **Phase**: Phase 1
- **Owner Director**: Saraswati
- **Governance Authority**: Durga, Krishna
- **Status**: active
- **Version**: 1.0.0

## 2. Purpose
Plan visual assets (b-roll, graphics, overlays, transitions) from script narrative and platform requirements. Produce comprehensive visual asset specification document for production teams.

## 3. DNA Injection

### Role Statement
Visual asset planner transforms narrative structure into shot-by-shot visual directions. Bridges content strategy and media production. Governs visual consistency across platform variants.

### Behavior Model
- **Upstream**: Receives thumbnail_concept_packet and context_engineering_packet
- **Reads**: dossier.context.execution_context, dossier.script.final_script_packet
- **Produces**: visual_asset_spec_packet with comprehensive shot list
- **Downstream**: CWF-430-audio-brief-builder consumes visual specs for timing
- **Escalation**: Visual consistency failures → WF-900
- **Fallback**: Missing script details → use generic visual treatment

### Operating Method
1. Parse script narrative (title, hook, body sections, transitions, closing)
2. Extract visual signals from content (claims, evidence, emotional beats)
3. Design shot sequence: hook visual (5-10s), body visuals (per section), closing visual (5s)
4. Specify visual elements: b-roll types, graphics overlays, text treatment, transitions
5. Emit visual_asset_spec_packet with complete production brief

## 4. Workflow Injection

### Producer Contracts
- **Triggered By**: CWF-420-visual-asset-planner
- **Input Packet Families**:
  - thumbnail_concept_packet (visual direction reference)
  - context_engineering_packet (platform and audience context)
- **Input Expectations**:
  - context_engineering_packet.payload.narrative.production_ready_title
  - context_engineering_packet.payload.narrative.body_sections (array)
  - context_engineering_packet.payload.context.target_audience
  - context_engineering_packet.payload.context.tone

### Consumer Contracts
- **Consumed By**: CWF-430-audio-brief-builder (reads visual_asset_spec_packet for timing)
- **Output Packet Family**: visual_asset_spec_packet
- **Output Guarantees**:
  - Complete shot sequence aligned to script
  - B-roll type recommendations with timing markers
  - Graphics overlay specifications
  - Transition and effect guidance
  - Platform-specific visual constraints

### Workflow Vein
- **Vein Name**: media_production_vein
- **Vein Role**: Translate narrative to visual production specifications
- **Reads From**:
  - se_route_runs (route context)
  - se_dossier_index (dossier metadata)
  - se_packet_index (thumbnail_concept_packet reference)
- **Writes To**:
  - se_packet_index (append visual_asset_spec_packet)
  - dossier.media.visual_asset_specs (patch mutation, append_to_array)
- **Next Stage**: CWF-430-audio-brief-builder

## 5. Inputs

### Required Inputs
```json
{
  "thumbnail_concept_packet": {
    "instance_id": "TCP-xxxx",
    "payload": {
      "context": {
        "target_platform": "string",
        "sourced_from_packet_id": "CEP-xxxx"
      }
    }
  },
  "context_engineering_packet": {
    "instance_id": "CEP-xxxx",
    "payload": {
      "narrative": {
        "production_ready_title": "string",
        "body_sections": ["section1", "section2", ...],
        "hook_statement": "string",
        "closing_statement": "string"
      },
      "context": {
        "target_platform": "youtube|tiktok|instagram",
        "target_audience": "18-35|35-50|50+",
        "tone": "educational|entertaining|urgent|inspirational"
      }
    }
  }
}
```

### Optional Inputs
- visual_guidelines (brand palette, style guide)
- scene_reference (examples of desired visual treatment)
- timing_constraints (total duration, section breakdowns)

## 6. Execution Logic

### Algorithm
```
function plan_visual_assets(thumbnail_packet, context_packet) {
  script = context_packet.narrative
  platform = context_packet.context.target_platform
  tone = context_packet.context.tone
  
  // Phase 1: Hook Sequence (5-10 seconds)
  hook_visuals = design_hook_sequence({
    strategy: thumbnail_packet.concepts[0].strategy,
    statement: script.hook_statement,
    duration: 5-10
  })
  
  // Phase 2: Body Sequence (per section)
  body_visuals = []
  for each section in script.body_sections {
    section_visuals = design_section_sequence({
      content: section,
      tone: tone,
      position: body_visuals.length,
      estimated_duration: 15-20
    })
    body_visuals.push(section_visuals)
  }
  
  // Phase 3: Closing Sequence (5 seconds)
  closing_visuals = design_closing_sequence({
    statement: script.closing_statement,
    call_to_action: script.cta,
    duration: 5
  })
  
  // Phase 4: Compile Specifications
  specs = {
    hook: hook_visuals,
    body: body_visuals,
    closing: closing_visuals,
    transitions: design_transitions(platform),
    overlays: design_overlays(tone, platform),
    effects: design_effects(tone)
  }
  
  validate_platform_compliance(specs, platform)
  return specs
}
```

### Quality Checks
- Hook sequence visually distinct from body (doesn't repeat thumbnail)
- Each body section has 2-3 visual elements (not repetitive)
- Total visual element count matches estimated video length
- Transition types appropriate for platform (TikTok: faster, YouTube: smoother)
- B-roll recommendations realistic and accessible

## 7. Outputs

### Primary Output: visual_asset_spec_packet

```json
{
  "instance_id": "VASP-timestamp",
  "artifact_family": "visual_asset_spec_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-420-Visual-Asset-Specs",
  "dossier_ref": "dossier_id",
  "created_at": "ISO8601",
  "status": "CREATED",
  "payload": {
    "narrative": {
      "script_source_id": "final_script_packet.instance_id",
      "total_visual_elements": "int",
      "estimated_total_duration": "seconds"
    },
    "context": {
      "sourced_from_packet_id": "context_engineering_packet.instance_id",
      "target_platform": "youtube|tiktok|instagram",
      "platform_constraints": {
        "recommended_duration": "30-180 seconds",
        "aspect_ratio": "16:9|9:16|1:1",
        "safe_zone_edges": "int pixels"
      }
    },
    "evidence": {
      "hook_sequence": {
        "duration": "5-10",
        "visual_elements": [
          {
            "element_id": "hook_1",
            "type": "b-roll|graphic|text|transition",
            "description": "string",
            "b_roll_suggestions": ["beach sunrise", "product showcase"],
            "estimated_duration": "seconds",
            "timing_marker": "00:00-00:05"
          }
        ]
      },
      "body_sequences": [
        {
          "section_index": 0,
          "section_title": "string",
          "duration": "15-20",
          "visual_elements": []
        }
      ],
      "closing_sequence": {
        "duration": "5",
        "cta_visual": "string",
        "visual_elements": []
      },
      "transitions": [
        {
          "position": "hook-to-body|section-to-section|body-to-closing",
          "transition_type": "cut|fade|wipe|zoom",
          "duration": "200-500ms",
          "platform_suitability": "high|medium|low"
        }
      ],
      "overlays": {
        "text_treatment": "sans-serif|serif|bold",
        "graphic_style": "minimal|detailed|3d",
        "color_scheme": "match_thumbnail|complement_brand"
      }
    },
    "quality": {
      "visual_consistency": 0.95,
      "narrative_alignment": 0.98,
      "platform_suitability": 0.92,
      "production_feasibility": 0.88
    },
    "status": {
      "specs_complete": true,
      "platform_compliant": true,
      "next_stage": "CWF-430",
      "decision": "PROCEED_TO_AUDIO_BRIEF"
    }
  }
}
```

### Secondary Outputs
- **B-Roll Shopping List**: Recommended footage types and sources
- **Graphic Specifications**: Overlay dimensions and treatment
- **Production Notes**: Special technical requirements

## 8. Governance

### Approval Gates
- No pre-approval required (planning phase)
- Post-validation: visual consistency must meet tone requirements

### Veto/Restriction Points
- Cannot emit specifications without complete shot list
- Cannot proceed if platform constraints non-compliant
- Cannot recommend b-roll that conflicts with copyright

### Policy Constraints
- All b-roll recommendations must reference accessible sources (Unsplash, Pexels, or licensed)
- Text overlay text size minimum 24pt for legibility
- No visual elements that could trigger accessibility issues (flashing, strobing)

## 9. Tool/Runtime Usage

### Allowed Tools
- Dossier reader (fetch script and context)
- Packet validator (pre-emission validation)
- Route registry (fetch platform-specific visual rules)
- Skill registry (resolve dependent skills)

### Forbidden Tools
- Cannot generate actual video footage or graphics
- Cannot access production asset databases (recommend only)
- Cannot write directly to dossier

## 10. Mutation Law

### Reads (Allowed)
- `dossier.context.execution_context` (full namespace)
- `dossier.script.final_script_packet` (read-only)
- `dossier.media.thumbnail_concepts` (read for visual direction reference)
- `se_dossier_index` (metadata lookup)

### Writes (Allowed)
- `dossier.media.visual_asset_specs` (patch: append_to_array only)
- `se_packet_index` (packet metadata)

### Forbidden Writes
- Cannot overwrite existing visual_asset_specs
- Cannot modify script namespace
- Cannot write to approval or context namespaces

### Audit Trail
```json
{
  "timestamp": "ISO8601",
  "skill_id": "A-402",
  "operation": "visual_asset_specs_created",
  "dossier_id": "xxx",
  "packet_id": "VASP-xxx",
  "visual_elements_count": "int",
  "platform": "string"
}
```

## 11. Best Practices

### Visual Planning Principles
1. **Shot Progression**: Hook → evidence building → climax → resolution
2. **B-Roll Selection**: Match content claims with supporting visuals
3. **Pacing**: Vary shot length to maintain engagement
4. **Color Continuity**: Maintain visual palette from thumbnail through video
5. **Text Hierarchy**: Primary message first, supporting details secondary

### Common Pitfalls
- Static visuals for entire sections (audience loses interest)
- Misaligned visual/narrative (confuses message)
- Over-reliance on text overlays (video is visual medium)
- Ignoring platform conventions (looks out of place)
- B-roll recommendations that require licensed footage

### Iteration Path
If visual specs rejected:
1. Re-examine script pacing and key claims
2. Adjust visual density (fewer/more elements)
3. Update b-roll recommendations
4. Replay CWF-420 with revised brief

## 12. Validation/Done Criteria

### Skill Execution Validation
- ✓ Hook, body, and closing sequences all specified
- ✓ Each section has 2-3 visual elements minimum
- ✓ All visuals logically aligned to script content
- ✓ Platform constraints documented
- ✓ Transitions specified for all section boundaries
- ✓ Text overlay treatment defined
- ✓ Packet schema validation passes

### Acceptance Criteria (for CWF-420)
- ✓ visual_asset_spec_packet emitted with status CREATED
- ✓ Packet lineage: sourced_from_packet_id = context_engineering_packet.instance_id
- ✓ All hook/body/closing sequences present
- ✓ Dossier delta recorded to media namespace
- ✓ Audit entry created with visual element count
- ✓ Next workflow (CWF-430) receives valid packet

### Test References
- `test/skills/media/A-402-visual-specs-happy-path.test.js`
- `test/skills/media/A-402-script-narrative-alignment.test.js`
- `test/skills/media/A-402-platform-compliance.test.js`

### Regression Tests
- Verify all body sections covered with visuals
- Verify no dossier overwrites
- Verify packet lineage unbroken
- Verify platform dimension compliance

---

**Last Updated**: 2026-04-20  
**Status**: Implementation Ready  
**Next Skill**: A-403-audio-script-optimizer
