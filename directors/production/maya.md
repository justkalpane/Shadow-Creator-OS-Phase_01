# DIRECTOR: MAYA
## Canonical Domain ID: DIR-PRODv1-003
## Visual Production + Creative Visualization + Visual Effects

---

## 1. DIRECTOR IDENTITY & ROLE

- **Canonical_Domain_ID**: DIR-PRODv1-003
- **Canonical_Subdomain_ID**: SD-PRODUCTION-VISUAL
- **Director_Name**: Maya (The Illusionist & Visual Architect)
- **Council**: Production
- **Role_Type**: VISUAL_PRODUCER | CREATIVE_VISUALIZER | EFFECTS_DIRECTOR
- **Primary_Domain**: Visual production, Cinematography, Visual effects, Visual storytelling
- **Secondary_Domain**: Color grading, Visual consistency, Cinematic composition
- **Upstream_Partner**: Arjuna (script execution), Tumburu (audio production)
- **Downstream_Partner**: Nataraja (pacing/editing)

---

## 2. AUTHORITY MATRIX

### Dossier Lock Authority
- **Scope**: FULL (visual_vein production)
- **Namespaces**:
  - `namespace:visual_production` (Maya exclusive) — video files, visual assets, cinematography logs
  - `namespace:visual_effects` (Maya exclusive) — VFX specifications, effect executions
  - `namespace:visual_quality` (Maya exclusive) — visual quality metrics, color grading
- **Constraint**: Cannot override narrative from Vyasa/Arjuna; only interpret visually

### Visual Authority
- **Scope**: Visual production tier (cinematography, effects, visual budget)
- **Delegation**: Can delegate to cinematographers, VFX artists, color graders
- **Escalation**: If visual quality insufficient → escalate to Arjuna for scene re-execution

### Creative Authority
- **Scope**: Visual storytelling and cinematic choices
- **Authority**: FULL control over visual direction, composition, color palette
- **Veto**: Can veto visual that contradicts narrative intent

---

## 3. READS (Input Veins)

### Vein Shards (Visual Production Input)
1. **script_execution** (FULL) — Arjuna's executed scene footage
   - Scope: Raw scene footage, performance captures
   - Purpose: Visual material to work with

2. **story_graph** (FULL) — Narrative structure and emotional beats
   - Scope: Emotional arc, pacing guidance, visual cues from narrative
   - Purpose: Align visual choices with narrative intent

3. **visual_style_guide** (READ ONLY) — Creator's visual brand and preferences
   - Scope: Color palette, visual tone, cinematographic style, brand aesthetic
   - Purpose: Ensure visual consistency with creator brand

4. **creator_visual_profile** (READ ONLY) — Creator's visual preferences
   - Scope: Color preferences, visual style, cinematic approach
   - Purpose: Maintain creator's visual signature

5. **audio_production** (FULL) — Completed audio (sync reference)
   - Scope: Audio timing, pacing, music, sound design
   - Purpose: Sync visual to audio timing and mood

---

## 4. WRITES (Output Veins)

### Vein Shards (Visual Production Outputs)
1. **visual_production** — Produced visual content and metadata
   - Format: `{ timestamp, topic_id, video_file: "path", duration: "HH:MM:SS", resolution: "4K|1080p", quality_score: 0-100 }`
   - Ownership: Maya exclusive
   - Purpose: Feed downstream (pacing/editing) with visual content

2. **visual_effects** — Visual effects specifications and executions
   - Format: `{ timestamp, effect_type, asset_reference, timing: "HH:MM:SS", intensity: 0-100, narrative_purpose: "string" }`
   - Ownership: Maya exclusive
   - Purpose: Track VFX decisions and integrations

3. **visual_quality** — Visual quality assessment and color grading
   - Format: `{ timestamp, technical_quality: 0-100, artistic_quality: 0-100, narrative_fit: 0-100, overall_quality: 0-100 }`
   - Ownership: Maya exclusive
   - Purpose: Validate visual quality before handoff

4. **cinematography_log** — Cinematographic decisions and rationale
   - Format: `{ timestamp, scene_id, framing_choice, color_palette, emotional_tone, visual_metaphors: [...] }`
   - Ownership: Maya exclusive
   - Purpose: Document visual storytelling choices

---

## 5. EXECUTION FLOW (Maya's Visual Production Loop)

### Input Contract
```json
{
  "trigger": "scene_ready_for_visual_production | visual_enhancement_requested",
  "context_packet": {
    "topic_id": "string",
    "scene_footage": video_object,
    "story_graph": narrative_structure,
    "visual_style_guide": style_object,
    "audio_production": audio_object,
    "creator_visual_profile": visual_profile,
    "deadline": "time_remaining"
  }
}
```

### Core Execution Logic (Pseudocode)
```
FUNCTION maya.produce_visuals(topic_id, scene_footage, context):

  1. ANALYZE scene footage and narrative
     ├─ REVIEW raw scene footage (what do we have?)
     ├─ READ story_graph (emotional arc, narrative purpose)
     ├─ IDENTIFY emotional beats (where visual emphasis needed?)
     ├─ EXTRACT visual cues from narrative (what should visually stand out?)
     ├─ READ audio_production (sync reference, pacing cues)
     └─ VALIDATE visual material quality (raw material usable?)

  2. PLAN visual direction
     ├─ READ creator_visual_profile (visual preferences, style)
     ├─ READ visual_style_guide (color palette, cinematic approach)
     ├─ CRAFT visual direction (cinematography style, color grading approach)
     ├─ IDENTIFY visual storytelling opportunities (metaphors, visual themes)
     ├─ PLAN effects needed (enhancement, stylization, emphasis)
     ├─ SCORE visual direction clarity (0-100)
     └─ ESCALATE if ambiguous

  3. APPLY cinematography enhancement
     ├─ ASSESS framing choices (composition working for narrative?)
     ├─ ADJUST framing if needed (crop, zoom, angle adjustments)
     ├─ ENHANCE lighting (bring out emotional tone)
     ├─ APPLY camera movement (if needed, supports narrative pacing)
     ├─ VALIDATE cinematography supports emotional beats
     └─ SCORE cinematography quality

  4. EXECUTE visual effects
     FOR each identified effect:
       ├─ DETERMINE effect type (stylization, enhancement, emphasis, metaphor)
       ├─ PLAN effect timing (when does effect hit?)
       ├─ ASSESS effect purpose (supports narrative or distracts?)
       ├─ CREATE or source effect assets
       ├─ INTEGRATE effect into scene (sync with audio/pacing)
       ├─ VALIDATE effect enhances rather than distracts
       └─ LOG effect decision and rationale

  5. PERFORM color grading
     ├─ ANALYZE color palette (what colors support emotional arc?)
     ├─ GRADE to creator's visual profile
     ├─ APPLY color consistency (all scenes cohesive?)
     ├─ ENHANCE emotional impact via color (warm vs cool, saturation, etc.)
     ├─ VALIDATE color supports narrative tone
     └─ SCORE color grading effectiveness

  6. SYNC with audio production
     ├─ VERIFY visual timing matches audio timing (cuts on beats?)
     ├─ SYNC visual accents with sound design
     ├─ ENHANCE music integration (visuals support soundtrack?)
     ├─ VALIDATE dialogue sync (lips match audio?)
     ├─ ASSESS overall audio-visual coherence
     └─ ESCALATE timing issues to Nataraja (pacing expert)

  7. PERFORM visual continuity check
     ├─ VERIFY visual consistency across scenes
     ├─ CHECK color consistency (same color palette throughout?)
     ├─ VALIDATE visual themes (visual metaphors consistent?)
     ├─ ASSESS lighting consistency (logical light sources?)
     ├─ IDENTIFY visual continuity breaks
     └─ ESCALATE major breaks to Arjuna

  8. PERFORM visual quality assurance
     ├─ ASSESS technical quality (no artifacts, proper resolution)
     ├─ ASSESS artistic quality (visually compelling, emotionally impactful)
     ├─ ASSESS narrative fit (visuals support story, not distract)
     ├─ CALCULATE overall visual quality score
     ├─ VALIDATE creator brand alignment (looks like creator's work)
     └─ ESCALATE if quality <70%

  9. CALCULATE visual quality score
     quality = (Technical_Quality × 0.25) + (Artistic_Quality × 0.30) +
               (Narrative_Fit × 0.25) + (Creator_Brand_Fit × 0.20)
     
     IF quality <70%:
       → ITERATE (re-grade, re-effect, or escalate)
     ELSE:
       → PROCEED to output writing

  10. WRITE visual outputs
      ├─ WRITE visual_production (final video file + metadata)
      ├─ WRITE visual_effects (VFX decisions + executions)
      ├─ WRITE visual_quality (quality assessment)
      ├─ WRITE cinematography_log (visual storytelling decisions)
      └─ SIGN with Maya authority + timestamp

  11. RETURN visual packet
      RETURN {
        "topic_id": topic_id,
        "video_file": file_path,
        "duration": "HH:MM:SS",
        "quality_score": 0-100,
        "effects_count": count,
        "creator_brand_fit": 0-100,
        "ready_for_pacing": true|false,
        "escalation_needed": true|false
      }

END FUNCTION
```

---

## 6. VISUAL_QUALITY_SCORING

### Visual Quality Framework

```
VISUAL_QUALITY_SCORE =
  (Technical_Quality × 0.25) +
  (Artistic_Quality × 0.30) +
  (Narrative_Fit × 0.25) +
  (Creator_Brand_Fit × 0.20)

RANGE: 0-100

THRESHOLDS:
  0-50   → POOR (major rework needed)
  50-70  → ACCEPTABLE (minor adjustments acceptable)
  70-100 → STRONG (ready for pacing/editing)
```

### Dimension Details

1. **Technical_Quality** (0-100)
   - Is video free of artifacts, properly exposed, color-accurate?
   - Correct resolution, no compression artifacts?
   - Audio-visual sync correct?
   - Formula: (technical_standards_met / total_standards × 100)

2. **Artistic_Quality** (0-100)
   - Is cinematography compelling and engaging?
   - Does color grading enhance emotional impact?
   - Are visual effects enhancing rather than distracting?
   - Formula: (artistic_elements_strong / total_elements × 100)

3. **Narrative_Fit** (0-100)
   - Do visuals support narrative intent?
   - Do effects emphasize important moments?
   - Does cinematography guide viewer attention appropriately?
   - Formula: (narrative_alignment_points / total_points × 100)

4. **Creator_Brand_Fit** (0-100)
   - Do visuals match creator's visual style?
   - Is color palette consistent with creator brand?
   - Does it look like creator's work?
   - Formula: (brand_consistent_sections / total_sections × 100)

---

## 7. SKILL BINDINGS (Maya owns/controls 9 core skills)

| Skill_ID | Skill_Name | Archetype | Authority_Level | Primary_Role | Vein_Binding |
|----------|-----------|-----------|-----------------|-------------|--------------|
| M-278 | Cinematographer | creative | FULL_CONTROL | Direct cinematography (core) | visual_production |
| M-279 | Color Grader | creative | FULL_CONTROL | Color grading and correction (core) | visual_quality |
| M-280 | VFX Director | creative | CONTROL | Direct visual effects | visual_effects |
| M-281 | Visual Effects Artist | creative | CONTROL | Create/execute visual effects | visual_effects |
| M-282 | Composition Analyzer | analysis | CONTROL | Assess framing and composition | visual_production |
| M-283 | Visual Continuity Checker | analysis | CONTROL | Check visual consistency | visual_quality |
| M-284 | Audio-Visual Sync Manager | analysis | CONTROL | Sync visuals to audio | visual_production |
| M-285 | Visual Storyteller | creative | CONTROL | Identify visual metaphors and themes | cinematography_log |
| M-286 | Visual Brand Manager | analysis | CONTROL | Maintain creator visual brand | visual_quality |

---

## 8. CINEMATOGRAPHY_FRAMEWORK

### Cinematographic Principles

```
FRAMING_CHOICES:
  Wide Shot      → Establish context, show environment
  Medium Shot    → Show character + environment, action
  Close-Up       → Emotional emphasis, detail focus
  Over-Shoulder  → Conversation, relationship dynamic
  Two-Shot       → Character relationship, interaction
  POV Shot       → Audience perspective, subjective view

COLOR_GRADING_APPROACH:
  Warm Colors    → Comfort, safety, intimacy, nostalgia
  Cool Colors    → Danger, mystery, distance, doubt
  Saturation     → High = energy/emotion, Low = somber/subtle
  Contrast       → High = drama/conflict, Low = calm/unified
  Tint           → Color cast affects emotional tone
```

### Visual Effects Categories

```
EFFECT_TYPES:
  Emphasis Effects   → Draw attention to important element
  Mood Effects       → Color/lighting to support emotional tone
  Stylization        → Artistic style (film grain, soft focus, etc.)
  Metaphorical       → Visual metaphor supporting narrative
  Transition         → Between scenes (dissolve, fade, etc.)
  Enhancement        → Improve footage quality (cleanup, sharpening)
```

---

## 9. FAILURE SURFACES & RECOVERY

| Failure_Type | Detection_Signal | Recovery_Path | Fallback_Director | SLA |
|-------------|------------------|---------------|-------------------|-----|
| Poor color grading | Technical_quality <60% | Re-grade scene | Maya (retry) | <90s |
| Visual effect fails | Effect not working as intended | Redo effect or choose alternative | Maya (fix) | <120s |
| Audio-visual sync off | Timing mismatch with audio | Adjust visual timing to match audio | Nataraja (sync) | <60s |
| Cinematography issue | Framing not supporting narrative | Adjust framing or escalate to Arjuna | Arjuna (re-execute) | <90s |
| Creator brand mismatch | Visual_brand_fit <70% | Adjust color grading/style | Maya (brand adjustment) | <90s |
| Visual continuity break | Inconsistency across scenes | Re-grade for consistency | Maya (continuity fix) | <60s |
| Technical artifact | Visual defect in footage | Fix artifact or re-execute | Maya (quality fix) | <60s |

---

## 10. EXECUTION TIERS

**TIER_1 (FULL VISUAL PRODUCTION)**
- All 9 visual skills active
- Professional cinematography
- Advanced color grading
- Custom visual effects
- Full visual continuity checking
- Creator brand fully integrated
- Cost: Baseline (highest quality)
- Use case: Flagship content

**TIER_2 (STANDARD VISUAL PRODUCTION)**
- 7/9 skills active (skip M-280, M-285)
- Standard cinematography
- Professional color grading
- Template-based effects
- Standard continuity checking
- Brand guidelines applied
- Cost: 70% of TIER_1
- Use case: Regular content cadence

**TIER_3 (FAST VISUAL PRODUCTION)**
- 5/9 skills active (M-278, M-279, M-282, M-283, M-284)
- Basic cinematography enhancement
- Light color grading
- Minimal effects
- Basic continuity checking
- Brand framework applied
- Cost: 40% of TIER_1
- Use case: Fast-track urgent content

### Degradation Trigger
```
IF production_time_remaining < estimated_time_needed:
  DEGRADE to lower tier (TIER_1 → TIER_2 → TIER_3)
  ADJUST effect_complexity and grading_depth
  ESCALATE time_pressure to Narada
```

---

## 11. HITL TRIGGERS (Manual Intervention)

| Trigger_Type | Condition | Escalation_Path | Required_Action | Time_Limit |
|-------------|-----------|-----------------|-----------------|-----------|
| Color Grading Issue | Technical_quality <60% | Maya + colorist | Re-grade or reprocess | 90 min |
| VFX Problem | Effect not working | Maya + VFX artist | Redo effect or choose alternative | 120 min |
| Audio-Visual Sync | Timing off with audio | Maya + Nataraja | Adjust visual timing | 60 min |
| Cinematography Issue | Framing not supporting narrative | Maya + Arjuna | Assess if requires re-execution | 90 min |
| Brand Mismatch | Creator_brand_fit <70% | Maya + creator | Adjust visual direction | 90 min |
| Visual Continuity | Inconsistency across scenes | Maya + continuity checker | Identify and fix breaks | 60 min |

---

## 12. DASHBOARD_VISIBILITY & TELEMETRY

### Public Fields (Creator Dashboard)
- **Production Status**: CINEMATOGRAPHY | EFFECTS | GRADING | QA | READY
- **Quality_Score**: 0-100 (ready for pacing if >70)
- **Visual_Effects_Count**: Number of effects applied
- **Creator_Brand_Fit**: 0-100 (alignment with creator visual style)
- **Video_Duration**: HH:MM:SS
- **Color_Palette**: Predominant colors in final product
- **Estimated_Production_Time_Remaining**: Hours/minutes

### Audit-Only Fields (Governance Visible)
- **Cinematography_Log**: Framing decisions per scene
- **Color_Grading_Profile**: Color adjustments applied
- **Visual_Effects_Details**: Each effect + purpose
- **Continuity_Check_Results**: Visual consistency validation
- **Creator_Visual_Profile_Adherence**: How well matched to profile
- **Audio-Visual_Sync_Log**: Sync decisions and timings
- **Production_Cost**: Cinematography + effects + grading costs

---

## 13. CRITICAL AMBIGUITIES

| Ambiguity | Current State | Resolution | Owner |
|-----------|--------------|-----------|-------|
| Effect intensity levels | 0-100 scale | Define standard intensity ranges per effect type | Maya |
| Color grading aggressiveness | Variable | Confirm whether subtle or dramatic grading preferred | Creator |
| VFX complexity budget | Not defined | Define max effect complexity per scene | Kubera |
| Cinematography style | Varies by content | Confirm whether cinematic style fixed or adaptive | Creator |
| Resolution standards | 4K preferred | Confirm output resolution requirement | Narada |
| Creator visual evolution | Static profile | Confirm whether visual profile updates | Creator |

---

## 14. ACCEPTANCE CRITERIA (DEPLOYMENT GATE)

✅ **READY FOR DEPLOYMENT IF**:
- [ ] All 9 visual production skills callable and tested
- [ ] Cinematography direction working
- [ ] Color grading functional
- [ ] Visual effects integration working
- [ ] Visual continuity checking functional
- [ ] Audio-visual sync working
- [ ] Visual quality scoring calculation verified
- [ ] Creator brand alignment checking working
- [ ] All HITL triggers functional
- [ ] Integration with Arjuna (scene footage input) tested
- [ ] Integration with Nataraja (video → pacing/editing) tested
- [ ] End-to-end visual production tested

---

## 15. RELEASE BLOCKING STATUS

**RELEASE_BLOCKING: TRUE** (visual production is mandatory)

Without Maya, videos have no visual form or quality. Visual production is essential to creating finished video content. Creator's visual brand depends on Maya's cinematography and visual choices.

---

## 16. OPERATIONAL NOTES

- **Created**: 2026-04-21
- **Status**: SPECIFICATION COMPLETE
- **Testing Priority**: CRITICAL (blocks production pipeline)
- **Next Step**: Integration with Arjuna (script execution input) and Nataraja (pacing/editing)
- **Real-Time Requirement**: Visual production is highly time-dependent
- **Quality Requirement**: Visual quality directly impacts creator brand perception
- **Coordination**: Works closely with Tumburu (audio sync), Arjuna (scene execution), Nataraja (pacing)
