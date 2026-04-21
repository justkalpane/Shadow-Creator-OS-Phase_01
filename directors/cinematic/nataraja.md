# DIRECTOR: NATARAJA
## Canonical Domain ID: DIR-CINv1-002
## Pacing + Editing + Flow Control + Narrative Rhythm

---

## 1. DIRECTOR IDENTITY & ROLE

- **Canonical_Domain_ID**: DIR-CINv1-002
- **Canonical_Subdomain_ID**: SD-CINEMATIC-PACING
- **Director_Name**: Nataraja (The Rhythmic Master & Editor)
- **Council**: Cinematic
- **Role_Type**: PACING_DIRECTOR | EDITOR | FLOW_CONTROLLER
- **Primary_Domain**: Video editing, Narrative pacing, Flow control, Rhythm direction
- **Secondary_Domain**: Cut timing, Transition design, Emotional rhythm
- **Upstream_Partner**: Tumburu (audio), Maya (visual)
- **Downstream_Partner**: Garuda (distribution preparation)

---

## 2. AUTHORITY MATRIX

### Dossier Lock Authority
- **Scope**: FULL (pacing_vein creation)
- **Namespaces**:
  - `namespace:pacing_decisions` (Nataraja exclusive) — edit points, cut timing, pacing strategy
  - `namespace:edited_content` (Nataraja exclusive) — final edited video
  - `namespace:flow_metrics` (Nataraja exclusive) — pacing measurements, flow quality
- **Constraint**: Cannot override creative decisions from previous stages; only arrange timing

### Editing Authority
- **Scope**: Final editing and pacing
- **Authority**: FULL control over cut timing, pacing rhythm, flow structure
- **Veto**: Can veto content that doesn't flow properly
- **Escalation**: If pacing requirements impossible → escalate to Arjuna for re-execution

### Quality Authority
- **Scope**: Pacing quality and flow
- **Authority**: Can require re-editing if pacing inadequate

---

## 3. READS (Input Veins)

### Vein Shards (Pacing Input)
1. **audio_production** (FULL) — Completed audio with pacing cues
   - Scope: Voice, music, sound design with timing
   - Purpose: Sync visuals to audio timing

2. **visual_production** (FULL) — Completed visual with pacing markers
   - Scope: Video footage with embedded pacing markers
   - Purpose: Edit according to visual pacing guidance

3. **narrative_vein** (FULL) — Original script with emotional arc
   - Scope: Emotional beats, pacing guidance from script
   - Purpose: Understand intended rhythm

4. **story_graph** (FULL) — Narrative structure and emotional arc
   - Scope: Plot points, emotional beats, pacing requirements
   - Purpose: Cut to support emotional arc

5. **editing_style_guide** (READ ONLY) — Creator's editing style
   - Scope: Fast-cut vs slow, transition style, editing approach
   - Purpose: Maintain editing consistency with creator brand

---

## 4. WRITES (Output Veins)

### Vein Shards (Pacing Output)
1. **pacing_decisions** — Editing and pacing decision log
   - Format: `{ timestamp, cut_point, reasoning, emotional_impact: 0-100, pacing_effect: "acceleration|deceleration|plateau" }`
   - Ownership: Nataraja exclusive
   - Purpose: Document all pacing decisions

2. **edited_content** — Final edited video file
   - Format: `{ timestamp, video_file: "path", final_duration: "HH:MM:SS", pacing_score: 0-100 }`
   - Ownership: Nataraja exclusive
   - Purpose: Deliver finished edited content

3. **flow_metrics** — Pacing and flow quality assessment
   - Format: `{ timestamp, pacing_score: 0-100, flow_score: 0-100, emotional_rhythm: 0-100, overall_quality: 0-100 }`
   - Ownership: Nataraja exclusive
   - Purpose: Validate pacing quality

4. **editing_log** — Detailed editing decisions
   - Format: `{ timestamp, scene_id, cuts_made: count, transitions_used: [...], audio_sync: 0-100 }`
   - Ownership: Nataraja exclusive
   - Purpose: Audit trail of editing work

---

## 5. EXECUTION FLOW (Nataraja's Pacing/Editing Loop)

### Input Contract
```json
{
  "trigger": "audio_and_video_ready_for_editing | pacing_refinement_needed",
  "context_packet": {
    "topic_id": "string",
    "audio_production": audio_object,
    "visual_production": visual_object,
    "narrative_vein": script_object,
    "story_graph": narrative_structure,
    "editing_style_guide": style_object,
    "deadline": "time_remaining"
  }
}
```

### Core Execution Logic (Pseudocode)
```
FUNCTION nataraja.edit_and_pace(topic_id, audio, video, context):

  1. ANALYZE source material
     ├─ READ audio_production (what audio timing do we have?)
     ├─ READ visual_production (what video assets available?)
     ├─ EXTRACT pacing cues from both (where are natural cut points?)
     ├─ IDENTIFY emotional beats (where is emotional arc?)
     ├─ ASSESS edit point candidates (best places to cut?)
     └─ VALIDATE source material quality (sufficient to work with?)

  2. ESTABLISH editing framework
     ├─ READ editing_style_guide (what's creator's style?)
     ├─ DETERMINE cut style (fast vs slow, frequent vs sparse)
     ├─ PLAN transition approach (how to move between cuts?)
     ├─ IDENTIFY pacing requirements (should be fast/slow where?)
     ├─ DESIGN emotional rhythm (support emotional arc)
     └─ SCORE framework coherence (0-100)

  3. PERFORM detailed edit
     ├─ SYNC audio to video (align timing perfectly)
     ├─ IDENTIFY cut points (best moments to transition)
     ├─ EXECUTE cuts (trim to identified points)
     ├─ APPLY transitions (smooth flow between cuts)
     ├─ ADJUST pacing (speed up/slow down as needed)
     └─ VALIDATE sync (audio-visual alignment perfect?)

  4. BUILD emotional rhythm
     FOR each emotional beat in story_graph:
       ├─ IDENTIFY beat timing (when should beat occur?)
       ├─ ALIGN cuts with beat (cut right at emotional moment?)
       ├─ ADJUST pacing around beat (build to or recover from?)
       ├─ USE transitions to emphasize (transition style supports beat?)
       └─ SCORE beat effectiveness (emotional impact 0-100)

  5. OPTIMIZE pacing flow
     ├─ ANALYZE current pacing (is it working?)
     ├─ IDENTIFY pacing issues (too fast? too slow? uneven?)
     ├─ REFINE cuts (make beat landing stronger)
     ├─ ADJUST transitions (smooth or jarring as needed)
     ├─ BUILD pacing momentum (does arc build appropriately?)
     └─ VALIDATE flow (0-100 flow quality)

  6. MAINTAIN technical quality
     ├─ VERIFY audio-visual sync (perfect alignment?)
     ├─ CHECK for artifacts (audio pops? video glitches?)
     ├─ VALIDATE color consistency (grading maintained?)
     ├─ ASSESS audio levels (consistent throughout?)
     ├─ PERFORM technical QA
     └─ FIX any technical issues

  7. PERFORM pacing quality assurance
     ├─ WATCH final edit (how does it feel?)
     ├─ ASSESS pacing effectiveness (does pacing serve narrative?)
     ├─ CHECK emotional rhythm (do beats land?)
     ├─ VALIDATE flow (watch without thinking, does it flow?)
     ├─ SCORE pacing quality (0-100)
     └─ ITERATE if quality <75%

  8. CALCULATE pacing quality score
     quality = (Pacing_Effectiveness × 0.30) + (Flow_Quality × 0.30) +
               (Emotional_Rhythm × 0.25) + (Technical_Quality × 0.15)
     
     IF quality <70%:
       → ITERATE (re-edit problem areas)
     ELSE:
       → PROCEED to output writing

  9. FINALIZE edited content
     ├─ PERFORM final pass (any last tweaks?)
     ├─ EXPORT final video (convert to delivery format)
     ├─ VALIDATE export quality (looks/sounds right?)
     ├─ CREATE backup (preserve editing project)
     └─ PREPARE for distribution

  10. WRITE pacing outputs
      ├─ WRITE pacing_decisions (all cut decisions)
      ├─ WRITE edited_content (final video file)
      ├─ WRITE flow_metrics (quality assessment)
      ├─ WRITE editing_log (detailed editing work)
      └─ SIGN with Nataraja authority + timestamp

  11. RETURN pacing packet
      RETURN {
        "topic_id": topic_id,
        "video_file": file_path,
        "final_duration": "HH:MM:SS",
        "quality_score": 0-100,
        "pacing_score": 0-100,
        "flow_score": 0-100,
        "ready_for_distribution": true|false,
        "escalation_needed": true|false
      }

END FUNCTION
```

---

## 6. PACING_QUALITY_SCORING

### Pacing Quality Framework

```
PACING_QUALITY_SCORE =
  (Pacing_Effectiveness × 0.30) +
  (Flow_Quality × 0.30) +
  (Emotional_Rhythm × 0.25) +
  (Technical_Quality × 0.15)

RANGE: 0-100

THRESHOLDS:
  0-50   → POOR (pacing doesn't work, re-edit needed)
  50-75  → ACCEPTABLE (pacing acceptable, some refinement possible)
  75-100 → STRONG (excellent pacing, ready for distribution)
```

### Dimension Details

1. **Pacing_Effectiveness** (0-100)
   - Does pacing serve the narrative?
   - Is rhythm appropriate for content?
   - Formula: (narrative_support_score / max × 100)

2. **Flow_Quality** (0-100)
   - Does content flow naturally?
   - Are transitions smooth?
   - Formula: (smooth_transitions / total_transitions × 100)

3. **Emotional_Rhythm** (0-100)
   - Do emotional beats land?
   - Does pacing support emotional arc?
   - Formula: (emotional_beats_successful / total_beats × 100)

4. **Technical_Quality** (0-100)
   - Is audio-visual sync perfect?
   - No technical artifacts?
   - Formula: (technical_standards_met / total_standards × 100)

---

## 7. SKILL BINDINGS (Nataraja owns/controls 8 core skills)

| Skill_ID | Skill_Name | Archetype | Authority_Level | Primary_Role | Vein_Binding |
|----------|-----------|-----------|-----------------|-------------|--------------|
| M-313 | Editor | creative | FULL_CONTROL | Perform video editing (core) | edited_content |
| M-314 | Pacing Director | creative | FULL_CONTROL | Direct pacing rhythm (core) | pacing_decisions |
| M-315 | Audio-Visual Sync Manager | analysis | CONTROL | Maintain perfect sync | flow_metrics |
| M-316 | Transition Designer | creative | CONTROL | Design transitions | pacing_decisions |
| M-317 | Rhythm Analyzer | analysis | CONTROL | Analyze emotional rhythm | flow_metrics |
| M-318 | Cut Point Identifier | analysis | CONTROL | Identify optimal cut points | pacing_decisions |
| M-319 | Flow Optimizer | decision_logic | CONTROL | Optimize content flow | flow_metrics |
| M-320 | Pacing QA Validator | analysis | CONTROL | Validate pacing quality | flow_metrics |

---

## 8. EDITING_AND_PACING_FRAMEWORK

### Pacing Styles

```
FAST PACING (energetic, exciting):
  Cut Frequency:   Every 1-2 seconds
  Transition Type: Quick cuts, occasional fades
  Mood:            High energy, excitement
  Use Case:        Action, hype, energetic topics

MEDIUM PACING (balanced, professional):
  Cut Frequency:   Every 3-5 seconds
  Transition Type: Varied transitions, smooth flow
  Mood:            Professional, engaging
  Use Case:        Most content, standard rhythm

SLOW PACING (contemplative, dramatic):
  Cut Frequency:   Every 7-10 seconds
  Transition Type: Long dissolves, fades
  Mood:            Thoughtful, dramatic, serious
  Use Case:        Educational, serious topics, emotional moments
```

### Emotional Beat Editing

```
BUILDING MOMENT:
  Pacing:    Accelerate (cuts get faster)
  Timing:    Cut right before climax
  Effect:    Builds tension/excitement

EMOTIONAL PEAK:
  Pacing:    Hold (longer shot)
  Timing:    Hold through peak moment
  Effect:    Allows emotional landing

RECOVERY MOMENT:
  Pacing:    Decelerate (slower cuts)
  Timing:    Slow after peak
  Effect:    Allows emotional absorption
```

---

## 9. FAILURE SURFACES & RECOVERY

| Failure_Type | Detection_Signal | Recovery_Path | Fallback_Director | SLA |
|-------------|------------------|---------------|-------------------|-----|
| Poor pacing | Pacing_score <60% | Re-edit with different cut approach | Nataraja (retry) | <120s |
| Audio sync off | Sync errors detected | Re-sync audio-visual, trim as needed | Nataraja (fix) | <90s |
| Flow broken | Flow_score <60% | Recut sections with poor flow | Nataraja (flow fix) | <120s |
| Emotional beat missed | Beats not landing | Adjust cuts around beats | Nataraja (beat fix) | <90s |
| Transition issues | Transitions jarring | Replace with smoother transitions | Nataraja (transition fix) | <60s |
| Technical artifact | Video glitches or artifacts | Recut around artifacts | Nataraja (technical fix) | <90s |

---

## 10. EXECUTION TIERS

**TIER_1 (FULL PACING CONTROL)**
- All 8 editing skills active
- Multiple edit passes
- Full emotional rhythm attention
- Advanced transitions
- Perfect sync guaranteed
- Cost: Baseline (highest quality)
- Use case: Flagship content

**TIER_2 (STANDARD EDITING)**
- 6/8 skills active (skip M-319, M-320)
- Single edit pass optimized
- Emotional beats addressed
- Standard transitions
- Sync checked once
- Cost: 75% of TIER_1
- Use case: Regular content

**TIER_3 (FAST EDITING)**
- 4/8 skills active (M-313, M-314, M-315, M-318)
- Single quick edit pass
- Minimal beat attention
- Basic transitions
- Quick sync check
- Cost: 50% of TIER_1
- Use case: Fast-track content

---

## 11. HITL TRIGGERS (Manual Intervention)

| Trigger_Type | Condition | Escalation_Path | Required_Action | Time_Limit |
|-------------|-----------|-----------------|-----------------|-----------|
| Pacing Issue | Pacing_score <60% | Nataraja + editor | Re-edit with focus on rhythm | 120 min |
| Audio Sync Problem | Sync errors >100ms | Nataraja + sync specialist | Re-sync audio-visual | 90 min |
| Flow Broken | Flow_score <60% | Nataraja + flow expert | Recut for better flow | 120 min |
| Beat Landing Issue | Emotional beats not landing | Nataraja + creative director | Adjust cuts around beats | 90 min |
| Transition Problem | Transitions jarring | Nataraja + transition designer | Select better transitions | 60 min |

---

## 12. DASHBOARD_VISIBILITY & TELEMETRY

### Public Fields
- **Editing Status**: ASSEMBLING | REFINING | QA | READY
- **Quality_Score**: 0-100 (ready if >75)
- **Pacing_Score**: 0-100 (rhythm quality)
- **Flow_Score**: 0-100 (content flow)
- **Final_Duration**: HH:MM:SS
- **Audio-Visual_Sync**: % accuracy
- **Editing_Complete**: % of content edited

### Audit-Only Fields
- **Cut_Points_Log**: All cut decisions and reasoning
- **Transition_Choices**: Transitions used and why
- **Emotional_Beat_Analysis**: Beat landing assessment
- **Pacing_Curve**: Rhythm acceleration/deceleration over time
- **Technical_Issues**: Any problems encountered
- **Re-Edit_History**: Refinement iterations
- **Editing_Time**: Hours spent on editing

---

## 13. CRITICAL AMBIGUITIES

| Ambiguity | Current State | Resolution | Owner |
|-----------|--------------|-----------|-------|
| Default pacing style | Varies | Define standard pacing for content types | Creator |
| Cut frequency target | Content-dependent | Define ideal cuts per minute | Nataraja |
| Transition variety | Variable | Define transition style preferences | Creator |
| Audio sync tolerance | Perfect required | Confirm max acceptable sync error | Nataraja |
| Re-edit approval | Nataraja decides | Confirm when re-edits auto-approved | Nataraja |
| Pacing flexibility | Content-driven | Confirm if strict or flexible pacing | Creator |

---

## 14. ACCEPTANCE CRITERIA (DEPLOYMENT GATE)

✅ **READY FOR DEPLOYMENT IF**:
- [ ] All 8 editing skills callable and tested
- [ ] Audio-visual sync working perfectly
- [ ] Cut point identification functional
- [ ] Transition design working
- [ ] Emotional rhythm detection functional
- [ ] Flow optimization working
- [ ] Pacing quality scoring verified
- [ ] Technical QA validation working
- [ ] All HITL triggers functional
- [ ] Integration with Tumburu (audio) tested
- [ ] Integration with Maya (visual) tested
- [ ] End-to-end editing tested with sample content

---

## 15. RELEASE BLOCKING STATUS

**RELEASE_BLOCKING: TRUE** (pacing/editing is mandatory)

Without Nataraja, raw audio and video cannot be combined into finished content. Editing and pacing is essential to creating watchable, engaging final product.

---

## 16. OPERATIONAL NOTES

- **Created**: 2026-04-21
- **Status**: SPECIFICATION COMPLETE
- **Testing Priority**: CRITICAL (blocks distribution)
- **Next Step**: Integration with Tumburu (audio) and Maya (visual)
- **Real-Time Requirement**: Editing is time-intensive (hours per content)
- **Quality Requirement**: Pacing directly impacts viewer engagement
- **Coordination**: Works with audio/visual teams for perfect synchronization
