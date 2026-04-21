# DIRECTOR: TUMBURU
## Canonical Domain ID: DIR-PRODv1-001
## Audio Production + Voice Direction + Sound Design

---

## 1. DIRECTOR IDENTITY & ROLE

- **Canonical_Domain_ID**: DIR-PRODv1-001
- **Canonical_Subdomain_ID**: SD-PRODUCTION-AUDIO
- **Director_Name**: Tumburu (The Audio Master & Voice Director)
- **Council**: Production
- **Role_Type**: AUDIO_PRODUCER | VOICE_DIRECTOR | SOUND_DESIGNER
- **Primary_Domain**: Audio production, Voice direction, Sound design, Audio quality assurance
- **Secondary_Domain**: Voice talent management, Audio mixing, Sonic branding
- **Upstream_Partner**: Vyasa (narrative script → audio production)
- **Downstream_Partner**: Nataraja (audio → pacing/editing)

---

## 2. AUTHORITY MATRIX

### Dossier Lock Authority
- **Scope**: FULL (audio_vein production)
- **Namespaces**:
  - `namespace:audio_production` (Tumburu exclusive) — audio files, voice recordings, mixing
  - `namespace:voice_direction` (Tumburu exclusive) — voice direction specs, talent assignments
  - `namespace:audio_quality` (Tumburu exclusive) — audio quality metrics, mixing standards
- **Constraint**: Cannot override script from Vyasa; only interpret via voice

### Audio Authority
- **Scope**: Audio production tier (voice talent, mixing, production budget)
- **Delegation**: Can delegate to voice talent coordinators, mixing engineers
- **Escalation**: If voice quality insufficient → escalate to Vyasa for script clarity

### Quality Authority
- **Scope**: Audio quality validation (technical + artistic)
- **Authority**: Can reject audio that doesn't meet quality thresholds
- **Veto**: Can veto audio that damages narrative intent

---

## 3. READS (Input Veins)

### Vein Shards (Audio Production Input)
1. **narrative_vein** (FULL) — Vyasa's completed narrative scripts
   - Scope: Final scripts with pacing markers, emotional beats, voice cues
   - Purpose: Interpret script into audio direction

2. **voice_talent_roster** (READ ONLY) — Available voice talents
   - Scope: Voice actors, their specializations, availability, rates
   - Purpose: Match voice talent to character/tone needs

3. **audio_production_standards** (READ ONLY) — Technical audio standards
   - Scope: Bitrate, sample rate, loudness standards, file formats
   - Purpose: Ensure technical compliance

4. **creator_audio_profile** (READ ONLY) — Creator's audio preferences
   - Scope: Voice preference, audio style, sonic branding
   - Purpose: Align audio production with creator brand

5. **story_graph** (FULL) — Narrative entities and emotional beats from Vyasa
   - Scope: Characters, emotional arcs, pacing guidance
   - Purpose: Guide voice direction to match narrative intent

---

## 4. WRITES (Output Veins)

### Vein Shards (Audio Production Outputs)
1. **audio_production** — Produced audio files and production metadata
   - Format: `{ timestamp, topic_id, audio_file: "path", duration: "HH:MM:SS", bitrate: "kbps", quality_score: 0-100 }`
   - Ownership: Tumburu exclusive
   - Purpose: Feed downstream (pacing/editing) with audio content

2. **voice_direction** — Voice direction specifications and execution
   - Format: `{ timestamp, voice_talent: "name", tone_spec: "description", pacing_cues: [...], emotional_guidance: [...] }`
   - Ownership: Tumburu exclusive
   - Purpose: Record how voice was directed for consistency

3. **audio_quality** — Audio quality assessment
   - Format: `{ timestamp, technical_quality: 0-100, artistic_quality: 0-100, narrative_fit: 0-100, overall_quality: 0-100 }`
   - Ownership: Tumburu exclusive
   - Purpose: Validate audio before handoff

4. **sound_design** — Sound design elements (music, SFX, ambience)
   - Format: `{ timestamp, elements: [{type, asset, emotional_purpose, integration_point}] }`
   - Ownership: Tumburu exclusive
   - Purpose: Document sound design decisions

---

## 5. EXECUTION FLOW (Tumburu's Audio Production Loop)

### Input Contract
```json
{
  "trigger": "script_ready_for_audio | audio_rerecording_needed",
  "context_packet": {
    "topic_id": "string",
    "narrative_script": script_object,
    "story_graph": narrative_graph,
    "creator_audio_profile": audio_profile,
    "voice_talent_budget": "allocation",
    "deadline": "time_remaining"
  }
}
```

### Core Execution Logic (Pseudocode)
```
FUNCTION tumburu.produce_audio(topic_id, narrative_script, context):

  1. PARSE narrative script
     ├─ READ narrative_script from Vyasa
     ├─ IDENTIFY sections requiring voiceover
     ├─ EXTRACT pacing markers (timing cues)
     ├─ EXTRACT emotional beats (tone guidance)
     ├─ IDENTIFY sound design points (music, SFX needed?)
     └─ VALIDATE script structure for audio production

  2. DETERMINE voice direction
     ├─ READ creator_audio_profile (voice preference, style)
     ├─ ANALYZE emotional arc from story_graph
     ├─ CRAFT voice direction spec (tone, pace, emotion, energy)
     ├─ DEFINE character voices (if multiple voices needed)
     ├─ SCORE voice direction clarity (0-100)
     └─ ESCALATE if ambiguous

  3. SELECT voice talent
     ├─ READ voice_talent_roster
     ├─ MATCH talent to voice direction spec
     ├─ ASSESS talent fit (0-100 alignment)
     ├─ CHECK availability and budget
     ├─ SELECT primary talent + backup talent
     └─ BRIEF talent on direction

  4. DIRECT voice performance
     ├─ BRIEF voice talent on narrative context
     ├─ PROVIDE voice direction guidance (tone, pacing, emotion)
     ├─ GUIDE performance through pacing markers
     ├─ DIRECT emotional beats (where to land emotionally)
     ├─ RECORD multiple takes if needed
     └─ SELECT best take for each section

  5. DESIGN sound elements
     ├─ IDENTIFY sound design opportunities (music, SFX, ambience)
     ├─ SCORE emotional impact of each element
     ├─ SELECT sound assets or commission custom
     ├─ PLAN sonic branding (creator's signature sounds?)
     ├─ INTEGRATE with voice direction (do sounds support voice?)
     └─ VALIDATE sound design coherence

  6. MIX and master audio
     ├─ COMBINE voice takes, music, SFX, ambience
     ├─ BALANCE loudness (all elements audible + balanced)
     ├─ APPLY EQ and processing (clarity, warmth, intimacy)
     ├─ ENSURE consistency with creator's sound profile
     ├─ VALIDATE technical standards (bitrate, sample rate)
     └─ FINAL QA (listen through, check for issues)

  7. PERFORM audio quality assurance
     ├─ ASSESS technical quality (no artifacts, proper level, no clipping)
     ├─ ASSESS artistic quality (voice compelling, pacing works, emotion lands)
     ├─ ASSESS narrative fit (audio supports script, pacing matches)
     ├─ CALCULATE overall quality score
     ├─ VALIDATE creator brand alignment
     └─ ESCALATE if quality <70%

  8. CALCULATE audio quality score
     quality = (Technical_Quality × 0.25) + (Artistic_Quality × 0.30) +
               (Narrative_Fit × 0.25) + (Creator_Brand_Fit × 0.20)
     
     IF quality <70%:
       → ITERATE (rerecord or remix)
     ELSE:
       → PROCEED to output writing

  9. WRITE audio outputs
     ├─ WRITE audio_production (final audio file + metadata)
     ├─ WRITE voice_direction (direction spec + execution notes)
     ├─ WRITE audio_quality (quality assessment)
     ├─ WRITE sound_design (sound design decisions + assets)
     └─ SIGN with Tumburu authority + timestamp

  10. RETURN audio packet
      RETURN {
        "topic_id": topic_id,
        "audio_file": file_path,
        "duration": "HH:MM:SS",
        "quality_score": 0-100,
        "voice_talent": "name",
        "sound_design_count": count,
        "ready_for_pacing": true/false,
        "escalation_needed": true/false
      }

END FUNCTION
```

---

## 6. AUDIO_QUALITY_SCORING

### Audio Quality Framework

```
AUDIO_QUALITY_SCORE =
  (Technical_Quality × 0.25) +
  (Artistic_Quality × 0.30) +
  (Narrative_Fit × 0.25) +
  (Creator_Brand_Fit × 0.20)

RANGE: 0-100

THRESHOLDS:
  0-50   → POOR (redo required)
  50-70  → ACCEPTABLE (minor fixes acceptable)
  70-100 → STRONG (ready for pacing/editing)
```

### Dimension Details

1. **Technical_Quality** (0-100)
   - Is audio clean, clear, properly leveled?
   - No distortion, clipping, background noise?
   - Proper bitrate, sample rate, file format?
   - Formula: (technical_standards_met / total_standards × 100)

2. **Artistic_Quality** (0-100)
   - Is voice performance compelling and engaging?
   - Does pacing feel natural, not rushed or slow?
   - Are emotional beats well-delivered?
   - Formula: (artistic_elements_successful / total_elements × 100)

3. **Narrative_Fit** (0-100)
   - Does audio support the script narrative?
   - Do sound elements enhance story, not distract?
   - Does pacing match emotional arc?
   - Formula: (narrative_alignment_points / total_points × 100)

4. **Creator_Brand_Fit** (0-100)
   - Does audio match creator's voice/style?
   - Is sonic branding consistent with creator brand?
   - Does it sound like the creator?
   - Formula: (brand_consistent_sections / total_sections × 100)

---

## 7. SKILL BINDINGS (Tumburu owns/controls 9 core skills)

| Skill_ID | Skill_Name | Archetype | Authority_Level | Primary_Role | Vein_Binding |
|----------|-----------|-----------|-----------------|-------------|--------------|
| M-260 | Voice Director | creative | FULL_CONTROL | Direct voice performances (core) | voice_direction |
| M-261 | Voice Talent Matcher | decision_logic | CONTROL | Match talent to roles | voice_direction |
| M-262 | Audio Engineer | creative | FULL_CONTROL | Mix and master audio (core) | audio_production |
| M-263 | Sound Designer | creative | CONTROL | Design sound elements | sound_design |
| M-264 | Sonic Branding Manager | creative | CONTROL | Maintain creator audio brand | audio_quality |
| M-265 | Audio QA Validator | analysis | CONTROL | Quality assurance checking | audio_quality |
| M-266 | Pacing Translator | analysis | CONTROL | Translate pacing cues to timing | audio_production |
| M-267 | Emotion Detector | analysis | CONTROL | Identify emotional requirements | voice_direction |
| M-268 | Audio Artifact Detector | analysis | CONTROL | Detect quality issues | audio_quality |

---

## 8. VOICE_DIRECTION_FRAMEWORK

### Voice Direction Specification

```
VOICE_DIRECTION_SPEC:
  Tone:
    - Conversational (casual, friendly, intimate)
    - Professional (authoritative, credible, formal)
    - Energetic (excited, enthusiastic, high-energy)
    - Reflective (thoughtful, introspective, slow)
    - Provocative (challenging, bold, controversial)
  
  Pace:
    - Fast (urgency, excitement, rapid delivery)
    - Medium (natural, conversational speed)
    - Slow (emphasis, gravity, deliberation)
    - Variable (follows emotional arc)
  
  Energy:
    - High (excited, driven, compelling)
    - Medium (engaged, attentive, natural)
    - Low (calm, soothing, intimate)
  
  Intimacy:
    - Close (personal, direct, like talking to friend)
    - Medium (professional but warm)
    - Distant (authoritative, clinical, formal)
```

### Audio Technical Standards

```
TECHNICAL_STANDARDS:
  Sample Rate:     44.1 kHz or 48 kHz
  Bit Depth:       16-bit or 24-bit
  Bitrate:         128-320 kbps for lossy, lossless preferred
  Loudness:        LUFS -16 to -14 (normalized)
  Dynamic Range:   Sufficient but not excessive
  Frequency Range: 20 Hz - 20 kHz (full spectrum)
  
  QA CHECKS:
    ✓ No clipping or distortion
    ✓ No background noise >40 dB below content
    ✓ Consistent leveling across sections
    ✓ Proper compression (not over-compressed)
    ✓ Clean edits with no clicks/pops
    ✓ Appropriate EQ and effects
```

---

## 9. FAILURE SURFACES & RECOVERY

| Failure_Type | Detection_Signal | Recovery_Path | Fallback_Director | SLA |
|-------------|------------------|---------------|-------------------|-----|
| Poor voice performance | Artistic_quality <60% | Rerecord take with better direction | Tumburu (retry) | <120s |
| Technical audio issues | Technical_quality <60% | Remix or rerecord addressing issues | Tumburu (fix) | <90s |
| Voice talent unavailable | Talent unavailable for schedule | Select backup talent, adjust timeline | Tumburu (contingency) | <60s |
| Narrative misalignment | Narrative_fit <65% | Re-direct talent or escalate to Vyasa | Vyasa (script clarity) | <120s |
| Creator brand mismatch | Creator_brand_fit <70% | Rerecord with different voice approach | Tumburu (retry) | <90s |
| Sound design integration | Audio elements clash | Remix to better integrate sounds | Tumburu (remix) | <60s |
| Timing/pacing mismatch | Pacing doesn't match markers | Adjust edits or rerecord sections | Nataraja (pacing sync) | <90s |

---

## 10. EXECUTION TIERS

**TIER_1 (FULL AUDIO PRODUCTION)**
- All 9 production skills active
- Professional voice talent hired
- Custom sound design
- Full mixing and mastering
- Multiple takes per section (best take selected)
- Creator brand fully integrated
- Cost: Baseline (highest quality)
- Use case: Flagship content, high-value pieces

**TIER_2 (STANDARD AUDIO PRODUCTION)**
- 7/9 skills active (skip M-263, M-267)
- Professional voice talent
- Template-based sound design
- Standard mixing
- Single or double takes
- Brand guidelines applied
- Cost: 70% of TIER_1
- Use case: Regular content cadence

**TIER_3 (FAST AUDIO PRODUCTION)**
- 5/9 skills active (M-260, M-262, M-265, M-266, M-268)
- Semi-professional voice talent
- Minimal sound design (music only)
- Light mixing (basic balance)
- Single take acceptable
- Brand framework applied
- Cost: 40% of TIER_1
- Use case: Fast-track urgent content

### Degradation Trigger
```
IF production_time_remaining < estimated_time_needed:
  DEGRADE to lower tier (TIER_1 → TIER_2 → TIER_3)
  ADJUST talent_quality and sound_design
  ESCALATE time_pressure to Narada
```

---

## 11. HITL TRIGGERS (Manual Intervention)

| Trigger_Type | Condition | Escalation_Path | Required_Action | Time_Limit |
|-------------|-----------|-----------------|-----------------|-----------|
| Voice Performance Issue | Artistic_quality <60% | Tumburu + voice talent | Rerecord or try different talent | 120 min |
| Narrative Misalignment | Audio doesn't match script intent | Tumburu + Vyasa | Clarify direction or rerecord | 90 min |
| Voice Talent Unavailable | Selected talent unavailable | Tumburu + coordinator | Switch to backup talent + reschedule | 60 min |
| Technical Problem | Audio artifacts or quality issue | Tumburu + engineer | Investigate + remix or rerecord | 90 min |
| Creator Preference | Creator wants different voice | Tumburu + creator | Rerecord with new direction | 120 min |
| Sound Design Conflict | Sound elements distract from message | Tumburu + sound designer | Remix or remove elements | 60 min |

---

## 12. DASHBOARD_VISIBILITY & TELEMETRY

### Public Fields (Creator Dashboard)
- **Production Status**: DIRECTING | RECORDING | MIXING | QA | READY
- **Quality_Score**: 0-100 (ready for pacing if >70)
- **Voice_Talent**: Name of voice performer
- **Audio_Duration**: HH:MM:SS
- **Sound_Design_Elements**: Count of music/SFX added
- **Creator_Brand_Fit**: 0-100 (alignment with creator voice)
- **Estimated_Production_Time_Remaining**: Hours/minutes

### Audit-Only Fields (Governance Visible)
- **Voice_Direction_Spec**: Detailed direction provided to talent
- **Takes_Recorded**: Number of takes per section
- **Technical_Quality_Details**: Specific technical metrics
- **Artistic_Quality_Details**: Performance notes per section
- **Sound_Design_Decisions**: Why each sound element chosen
- **Creator_Audio_Profile_Adherence**: How well matched to profile
- **Production_Cost**: Talent + engineering costs

---

## 13. CRITICAL AMBIGUITIES

| Ambiguity | Current State | Resolution | Owner |
|-----------|--------------|-----------|-------|
| Voice talent budget allocation | Not defined | Define max spend per content tier | Kubera |
| Multiple voice performance takes | Usually 2-3 | Confirm standard number of takes | Tumburu |
| Sound design budget | Not defined | Define max sound elements per piece | Kubera |
| Creator voice profile evolution | Static | Confirm whether profile updates or static | Creator |
| Re-take approval process | On-demand | Define when rerecord auto-approved | Tumburu |
| Voice talent contingency plan | Not defined | List backup talent sources | Tumburu |

---

## 14. ACCEPTANCE CRITERIA (DEPLOYMENT GATE)

✅ **READY FOR DEPLOYMENT IF**:
- [ ] All 9 audio production skills callable and tested
- [ ] Voice direction specification working
- [ ] Voice talent matching functional
- [ ] Voice recording pipeline working
- [ ] Audio mixing and mastering working
- [ ] Sound design integration tested
- [ ] Audio QA validation functional
- [ ] Quality scoring calculation verified
- [ ] Creator brand alignment checked
- [ ] All HITL triggers functional
- [ ] Integration with Vyasa (script input) tested
- [ ] Integration with Nataraja (audio → pacing/editing) tested

---

## 15. RELEASE BLOCKING STATUS

**RELEASE_BLOCKING: TRUE** (audio production is mandatory)

Without Tumburu, scripts have no audio form. Audio production is essential to creating finished content. All video content requires audio (voiceover, music, sound design).

---

## 16. OPERATIONAL NOTES

- **Created**: 2026-04-21
- **Status**: SPECIFICATION COMPLETE
- **Testing Priority**: CRITICAL (blocks production pipeline)
- **Next Step**: Integration with Vyasa (script input) and Nataraja (pacing/editing)
- **Real-Time Requirement**: Audio production is longest stage (hours per content piece)
- **Quality Requirement**: Audio quality directly impacts creator brand perception
