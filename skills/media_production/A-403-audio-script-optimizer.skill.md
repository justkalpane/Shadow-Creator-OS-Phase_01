# A-403: Audio/Voiceover Script Optimizer

## 1. Skill Identity
- **Skill ID**: A-403
- **Name**: Audio/Voiceover Script Optimizer
- **Category**: Media Production
- **Skill Pack**: WF-400
- **Phase**: Phase 1
- **Owner Director**: Saraswati
- **Governance Authority**: Krishna, Kubera
- **Status**: active
- **Version**: 1.0.0

## 2. Purpose
Optimize script for audio delivery and voiceover synthesis. Produce timing-marked, phonetically-optimized audio brief with section breakdowns, pacing cues, and voice direction specifications.

## 3. DNA Injection

### Role Statement
Audio script optimizer prepares narrative for vocal performance. Handles pacing, breath marks, emphasis cues, and voiceover talent direction. Governs audio specification for production.

### Behavior Model
- **Upstream**: Receives final_script_packet and visual_asset_spec_packet
- **Reads**: dossier.script.final_script_packet, dossier.media.visual_asset_specs
- **Produces**: audio_brief_packet with timing markers and vocal direction
- **Downstream**: CWF-440-media-package-finalizer consumes audio brief
- **Escalation**: Audio pacing failures → WF-900
- **Fallback**: Missing visual timing → calculate from script word count

### Operating Method
1. Parse final_script_packet with precise word counts
2. Align with visual_asset_spec_packet timing markers
3. Calculate optimal reading pace (150-160 WPM for narrative)
4. Insert breath marks, emphasis cues, and tone shifts
5. Emit audio_brief_packet with annotated script and voiceover direction

## 4. Workflow Injection

### Producer Contracts
- **Triggered By**: CWF-430-audio-brief-builder
- **Input Packet Families**:
  - final_script_packet (script content)
  - visual_asset_spec_packet (timing alignment reference)
  - context_engineering_packet (platform and tone)
- **Input Expectations**:
  - final_script_packet.payload.narrative (complete script sections)
  - visual_asset_spec_packet.payload.evidence.hook_sequence[].timing_marker
  - context_engineering_packet.payload.context.tone

### Consumer Contracts
- **Consumed By**: CWF-440-media-package-finalizer
- **Output Packet Family**: audio_brief_packet
- **Output Guarantees**:
  - Timing-aligned voiceover script
  - Breath marks and pause positions
  - Emphasis cues and vocal direction
  - Phonetic notes for challenging terms
  - Total duration estimate

### Workflow Vein
- **Vein Name**: media_production_vein
- **Vein Role**: Prepare script for audio production
- **Reads From**:
  - se_route_runs (route context)
  - se_dossier_index (dossier metadata)
  - se_packet_index (script and visual packet references)
- **Writes To**:
  - se_packet_index (append audio_brief_packet)
  - dossier.media.audio_briefs (patch mutation, append_to_array)
- **Next Stage**: CWF-440-media-package-finalizer

## 5. Inputs

### Required Inputs
```json
{
  "final_script_packet": {
    "instance_id": "FSP-xxxx",
    "payload": {
      "narrative": {
        "production_ready_title": "string",
        "hook": "string",
        "body": "string",
        "closing": "string"
      }
    }
  },
  "visual_asset_spec_packet": {
    "instance_id": "VASP-xxxx",
    "payload": {
      "evidence": {
        "hook_sequence": {
          "estimated_duration": "5-10"
        },
        "body_sequences": [
          {
            "duration": "15-20"
          }
        ]
      }
    }
  },
  "context_engineering_packet": {
    "instance_id": "CEP-xxxx",
    "payload": {
      "context": {
        "tone": "educational|entertaining|urgent|inspirational"
      }
    }
  }
}
```

### Optional Inputs
- voiceover_talent_profile (accent, voice characteristics)
- target_audience_reading_level (8th grade, college, etc.)
- accent_pronunciation_guide (regional or foreign terms)

## 6. Execution Logic

### Algorithm
```
function optimize_audio_script(script_packet, visual_packet, context_packet) {
  script = script_packet.narrative
  tone = context_packet.context.tone
  
  // Phase 1: Parse and measure
  sections = [
    { name: "hook", content: script.hook, duration: visual_packet.hook_sequence.duration },
    { name: "body", content: script.body, duration: sum(visual_packet.body_sequences.duration) },
    { name: "closing", content: script.closing, duration: visual_packet.closing_sequence.duration }
  ]
  
  // Phase 2: Calculate timing
  word_counts = sections.map(s => count_words(s.content))
  reading_pace = 150-160 // words per minute for engaging tone
  calculated_durations = word_counts.map(wc => (wc / reading_pace) * 60)
  
  // Phase 3: Insert timing markers
  annotated_script = []
  for each section in sections {
    annotated_section = insert_breath_marks(section.content, reading_pace)
    annotated_section = add_emphasis_cues(annotated_section, section.name, tone)
    annotated_section = add_timing_markers(annotated_section, calculated_durations[section.name])
    annotated_script.push(annotated_section)
  }
  
  // Phase 4: Voice direction
  voice_direction = {
    overall_tone: map_tone_to_voice(tone),
    pacing: "brisk|moderate|measured",
    emphasis_points: identify_key_claims(script),
    emotional_beats: map_tone_transitions(script)
  }
  
  // Phase 5: Phonetic notes
  phonetic_notes = identify_challenging_terms(script)
  
  return {
    annotated_script: annotated_script,
    voice_direction: voice_direction,
    phonetic_notes: phonetic_notes,
    total_duration: sum(calculated_durations),
    reading_pace: reading_pace
  }
}
```

### Quality Checks
- Hook duration matches visual spec (±1 second tolerance)
- Body sections align with visual sequences
- Breath marks placed at natural sentence breaks
- Emphasis cues correspond to important claims
- Total duration realistic for platform (YouTube: 3-15min, TikTok: 15-60sec)
- No sections lacking voiceover direction

## 7. Outputs

### Primary Output: audio_brief_packet

```json
{
  "instance_id": "ABP-timestamp",
  "artifact_family": "audio_brief_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-430-Audio-Brief-Builder",
  "dossier_ref": "dossier_id",
  "created_at": "ISO8601",
  "status": "CREATED",
  "payload": {
    "narrative": {
      "annotated_script": {
        "hook": "Script with [breath] and **emphasis** markers",
        "body": "Script with [breath] and **emphasis** markers",
        "closing": "Script with [breath] and **emphasis** markers"
      },
      "total_word_count": "int",
      "reading_pace_wpm": 155
    },
    "context": {
      "sourced_from_script_packet_id": "final_script_packet.instance_id",
      "sourced_from_visual_packet_id": "visual_asset_spec_packet.instance_id",
      "source_tone": "educational|entertaining|urgent|inspirational"
    },
    "evidence": {
      "timing_alignment": [
        {
          "section": "hook",
          "visual_duration": "5-10",
          "script_word_count": "int",
          "calculated_audio_duration": "seconds",
          "alignment_status": "matched|tight|loose"
        }
      ],
      "voice_direction": {
        "overall_tone": "friendly|authoritative|urgent|inspirational",
        "pacing": "brisk|moderate|measured",
        "emphasis_points": [
          {
            "claim": "string",
            "emphasis_type": "voice_rise|dramatic_pause|repetition",
            "position_in_script": "seconds"
          }
        ],
        "emotional_beats": [
          {
            "moment": "hook|transition|climax|closing",
            "emotional_shift": "curiosity→engagement|tension→resolution"
          }
        ]
      },
      "phonetic_notes": [
        {
          "term": "difficult_word",
          "pronunciation": "phonetic_spelling",
          "alternate_options": ["option1", "option2"]
        }
      ]
    },
    "quality": {
      "timing_accuracy": 0.96,
      "pacing_suitability": 0.93,
      "voice_direction_clarity": 0.94,
      "phonetic_coverage": 0.98
    },
    "status": {
      "audio_script_optimized": true,
      "timing_aligned": true,
      "voice_direction_complete": true,
      "next_stage": "CWF-440",
      "decision": "PROCEED_TO_MEDIA_FINALIZATION"
    }
  }
}
```

### Secondary Outputs
- **Voiceover Talent Brief**: Summary of voice requirements and character
- **Timing Spreadsheet**: Detailed section-by-section timing breakdown
- **Pronunciation Guide**: Challenging terms with audio examples

## 8. Governance

### Approval Gates
- No pre-approval required (audio planning phase)
- Post-validation: timing alignment must match visual specs within 1 second

### Veto/Restriction Points
- Cannot emit audio brief without timing markers
- Cannot proceed if total duration incompatible with platform
- Cannot recommend reading pace outside 140-180 WPM range

### Policy Constraints
- Voice direction must be non-discriminatory and professional
- Phonetic notes must use standard IPA or common pronunciation guides
- No offensive or culturally insensitive pronunciation guidance

## 9. Tool/Runtime Usage

### Allowed Tools
- Dossier reader (fetch script and visual specs)
- Packet validator (pre-emission validation)
- Route registry (fetch platform audio constraints)
- Skill registry (resolve dependent skills)

### Forbidden Tools
- Cannot generate audio files (produces brief only)
- Cannot access voiceover talent databases
- Cannot write directly to dossier

## 10. Mutation Law

### Reads (Allowed)
- `dossier.script.final_script_packet` (full namespace)
- `dossier.media.visual_asset_specs` (read for timing reference)
- `dossier.context.execution_context` (read-only)
- `se_dossier_index` (metadata lookup)

### Writes (Allowed)
- `dossier.media.audio_briefs` (patch: append_to_array only)
- `se_packet_index` (packet metadata)

### Forbidden Writes
- Cannot overwrite existing audio_briefs
- Cannot modify script namespace
- Cannot write timing changes back to visual specs

### Audit Trail
```json
{
  "timestamp": "ISO8601",
  "skill_id": "A-403",
  "operation": "audio_brief_created",
  "dossier_id": "xxx",
  "packet_id": "ABP-xxx",
  "word_count": "int",
  "estimated_duration_seconds": "float"
}
```

## 11. Best Practices

### Audio Direction Principles
1. **Natural Pacing**: 150-160 WPM feels conversational, not rushed
2. **Breath Management**: Marks at clause/sentence boundaries, not mid-phrase
3. **Emphasis Strategy**: 2-3 key claims per section, not every point
4. **Tone Consistency**: Match opening tone through closing
5. **Transition Markers**: Clear beats between hook, body, closing

### Common Pitfalls
- Breath marks mid-sentence (sounds choppy)
- Overstuffed script (voiceover talks over visuals)
- Misaligned timing (voiceover ends before visuals)
- Monotone direction (no tonal variation guidance)
- Unrealistic reading pace (110 WPM is too slow, 200+ is rushed)

### Iteration Path
If audio brief rejected:
1. Check visual alignment (may need to adjust visual length)
2. Reduce script word count (trim non-essential content)
3. Adjust reading pace (may be too fast or too slow)
4. Replay CWF-430 with revised pacing

## 12. Validation/Done Criteria

### Skill Execution Validation
- ✓ All script sections annotated with breath marks
- ✓ Emphasis cues placed on key claims (2-3 per section)
- ✓ Timing markers present for all sections
- ✓ Voice direction specified for tone
- ✓ Phonetic notes for challenging terms
- ✓ Total duration within platform requirements
- ✓ Packet schema validation passes

### Acceptance Criteria (for CWF-430)
- ✓ audio_brief_packet emitted with status CREATED
- ✓ Packet lineage: sourced_from_script_packet_id = final_script_packet.instance_id
- ✓ Annotated script complete with timing markers
- ✓ Voice direction includes tone, pacing, and emphasis
- ✓ Dossier delta recorded to media namespace
- ✓ Audit entry created with word count and duration
- ✓ Next workflow (CWF-440) receives valid packet

### Test References
- `test/skills/media/A-403-audio-optimization-happy-path.test.js`
- `test/skills/media/A-403-timing-alignment.test.js`
- `test/skills/media/A-403-voice-direction.test.js`

### Regression Tests
- Verify all sections have breath marks
- Verify no dossier overwrites
- Verify packet lineage unbroken
- Verify timing alignment within 1 second

---

**Last Updated**: 2026-04-20  
**Status**: Implementation Ready  
**Next Skill**: A-404-media-package-assembler
