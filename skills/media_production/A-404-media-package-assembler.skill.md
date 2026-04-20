# A-404: Media Package Assembler

## 1. Skill Identity
- **Skill ID**: A-404
- **Name**: Media Package Assembler
- **Category**: Media Production
- **Skill Pack**: WF-400
- **Phase**: Phase 1
- **Owner Director**: Krishna
- **Governance Authority**: Durga, Kubera
- **Status**: active
- **Version**: 1.0.0

## 2. Purpose
Assemble complete media production package from thumbnail concepts, visual specs, and audio briefs. Aggregate all media specification components into unified production packet ready for content creation workflows.

## 3. DNA Injection

### Role Statement
Media package assembler orchestrates all production specifications into coherent production directive. Serves as master specification document for production teams. Governs media production readiness.

### Behavior Model
- **Upstream**: Receives thumbnail_concept_packet, visual_asset_spec_packet, audio_brief_packet
- **Reads**: All three intermediate media production packets
- **Produces**: media_production_packet (final aggregate)
- **Downstream**: WF-500-publishing-distribution-pack consumes media_production_packet
- **Escalation**: Package integrity failures → WF-900
- **Fallback**: Missing components → requeue to incomplete stage

### Operating Method
1. Receive all three media specification packets
2. Validate packet completeness and lineage
3. Cross-reference timing between visuals and audio
4. Compile unified production brief
5. Emit media_production_packet with all specifications

## 4. Workflow Injection

### Producer Contracts
- **Triggered By**: CWF-440-media-package-finalizer
- **Input Packet Families**:
  - thumbnail_concept_packet
  - visual_asset_spec_packet
  - audio_brief_packet
- **Input Expectations**:
  - All three packets sourced from same context_engineering_packet lineage
  - All three packets share matching dossier_id
  - All timing markers aligned between visual and audio

### Consumer Contracts
- **Consumed By**: WF-500 when media_production_packet is assembled
- **Output Packet Family**: media_production_packet
- **Output Guarantees**:
  - Unified production specification
  - All sub-packets referenced with instance IDs
  - Complete timing coordinates
  - Production readiness status
  - Next workflow direction

### Workflow Vein
- **Vein Name**: media_production_vein
- **Vein Role**: Aggregate media specifications into production packet
- **Reads From**:
  - se_route_runs (route context)
  - se_dossier_index (dossier metadata)
  - se_packet_index (all three intermediate packets)
- **Writes To**:
  - se_packet_index (append media_production_packet)
  - dossier.media.production_packets (patch mutation, append_to_array)
- **Next Stage**: WF-500-publishing-distribution-pack

## 5. Inputs

### Required Inputs
```json
{
  "thumbnail_concept_packet": {
    "instance_id": "TCP-xxxx",
    "artifact_family": "thumbnail_concept_packet",
    "payload": {
      "evidence": {
        "concepts": [
          {
            "concept_id": "string",
            "strategy": "string",
            "visual_description": "string"
          }
        ]
      }
    }
  },
  "visual_asset_spec_packet": {
    "instance_id": "VASP-xxxx",
    "artifact_family": "visual_asset_spec_packet",
    "payload": {
      "evidence": {
        "hook_sequence": {
          "visual_elements": []
        },
        "body_sequences": [],
        "closing_sequence": {}
      }
    }
  },
  "audio_brief_packet": {
    "instance_id": "ABP-xxxx",
    "artifact_family": "audio_brief_packet",
    "payload": {
      "narrative": {
        "annotated_script": {
          "hook": "string",
          "body": "string",
          "closing": "string"
        },
        "reading_pace_wpm": "int"
      }
    }
  }
}
```

### Optional Inputs
- producer_notes (special instructions or constraints)
- platform_override (different platform than initial context)
- timeline_constraints (delivery deadline)

## 6. Execution Logic

### Algorithm
```
function assemble_media_package(thumbnail_packet, visual_packet, audio_packet) {
  // Phase 1: Validate packet presence
  packets = {
    thumbnail: validate_packet(thumbnail_packet, "thumbnail_concept_packet"),
    visual: validate_packet(visual_packet, "visual_asset_spec_packet"),
    audio: validate_packet(audio_packet, "audio_brief_packet")
  }
  
  if any_packet_invalid(packets) {
    throw PacketValidationError("One or more packets missing or invalid")
  }
  
  // Phase 2: Validate lineage alignment
  dossier_ids = [
    thumbnail_packet.dossier_ref,
    visual_packet.dossier_ref,
    audio_packet.dossier_ref
  ]
  
  if not all_equal(dossier_ids) {
    throw LineageError("Packets from different dossiers")
  }
  
  // Phase 3: Cross-reference timing
  timing_report = {
    hook: {
      visual_duration: visual_packet.hook_sequence.duration,
      audio_duration: audio_packet.hook_duration,
      alignment: compare_durations(visual, audio, tolerance: 1)
    },
    body: {
      visual_duration: sum(visual_packet.body_sequences),
      audio_duration: audio_packet.body_duration,
      alignment: compare_durations(visual, audio, tolerance: 2)
    },
    closing: {
      visual_duration: visual_packet.closing_sequence.duration,
      audio_duration: audio_packet.closing_duration,
      alignment: compare_durations(visual, audio, tolerance: 1)
    }
  }
  
  // Phase 4: Compile unified specification
  media_package = {
    thumbnail_specifications: thumbnail_packet.payload,
    visual_specifications: visual_packet.payload,
    audio_specifications: audio_packet.payload,
    timing_report: timing_report,
    production_readiness: assess_production_readiness(packets),
    next_stage: WF-500
  }
  
  return media_package
}
```

### Quality Checks
- All three packets present and non-null
- All packets share same dossier_id
- Timing alignment: hook ±1sec, body ±2sec, closing ±1sec
- No critical errors in any sub-packet
- Packet lineage traceable to context_engineering_packet

## 7. Outputs

### Primary Output: media_production_packet

```json
{
  "instance_id": "MDP-timestamp",
  "artifact_family": "media_production_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-440-Media-Package-Finalizer",
  "dossier_ref": "dossier_id",
  "created_at": "ISO8601",
  "status": "CREATED",
  "payload": {
    "narrative": {
      "primary_content_title": "string",
      "component_count": 3,
      "component_types": ["thumbnail_concepts", "visual_specifications", "audio_brief"]
    },
    "context": {
      "sourced_from_thumbnail_packet_id": "TCP-xxxx",
      "sourced_from_visual_packet_id": "VASP-xxxx",
      "sourced_from_audio_packet_id": "ABP-xxxx",
      "sourced_from_context_engineering_packet_id": "CEP-xxxx",
      "dossier_id": "string"
    },
    "evidence": {
      "thumbnail_specifications": {
        "concept_count": 3,
        "strategies": ["strategy1", "strategy2", "strategy3"]
      },
      "visual_specifications": {
        "total_visual_elements": "int",
        "hook_elements": "int",
        "body_elements": "int",
        "closing_elements": "int"
      },
      "audio_specifications": {
        "total_word_count": "int",
        "reading_pace_wpm": "int",
        "annotated_script_sections": 3
      },
      "timing_alignment": [
        {
          "section": "hook",
          "visual_duration_seconds": "float",
          "audio_duration_seconds": "float",
          "alignment_status": "matched|tight|loose",
          "deviation_seconds": "float"
        },
        {
          "section": "body",
          "visual_duration_seconds": "float",
          "audio_duration_seconds": "float",
          "alignment_status": "matched|tight|loose",
          "deviation_seconds": "float"
        },
        {
          "section": "closing",
          "visual_duration_seconds": "float",
          "audio_duration_seconds": "float",
          "alignment_status": "matched|tight|loose",
          "deviation_seconds": "float"
        }
      ]
    },
    "quality": {
      "packet_completeness": 1.0,
      "lineage_integrity": true,
      "timing_alignment_quality": 0.95,
      "all_components_valid": true,
      "production_readiness_score": 0.94
    },
    "status": {
      "media_package_assembled": true,
      "all_components_present": true,
      "timing_aligned": true,
      "lineage_verified": true,
      "next_stage": "WF-500",
      "decision": "PROCEED_TO_PUBLISHING_PIPELINE"
    }
  }
}
```

### Secondary Outputs
- **Production Checklist**: All media components ready for creation
- **Timing Variance Report**: Visual vs. audio alignment details
- **Component Reference Index**: All sub-packet instance IDs

## 8. Governance

### Approval Gates
- No pre-approval required (assembly phase)
- Post-validation: timing alignment must be within tolerance

### Veto/Restriction Points
- Cannot emit media_production_packet without all 3 sub-packets
- Cannot proceed if timing deviation exceeds tolerance (>2 seconds any section)
- Cannot assemble packets from different dossiers

### Policy Constraints
- Must preserve complete lineage chain
- Must reference all sub-packet instance IDs
- Must validate timing coherence before emission

## 9. Tool/Runtime Usage

### Allowed Tools
- Dossier reader (fetch packet references)
- Packet validator (pre-emission validation)
- Route registry (fetch next stage routes)
- Skill registry (resolve dependent skills)

### Forbidden Tools
- Cannot generate media files
- Cannot modify sub-packets
- Cannot write directly to dossier

## 10. Mutation Law

### Reads (Allowed)
- `dossier.media.thumbnail_concepts` (read for reference)
- `dossier.media.visual_asset_specs` (read for reference)
- `dossier.media.audio_briefs` (read for reference)
- `se_packet_index` (all packets with matching dossier_id)
- `se_dossier_index` (metadata lookup)

### Writes (Allowed)
- `dossier.media.production_packets` (patch: append_to_array only)
- `se_packet_index` (packet metadata)

### Forbidden Writes
- Cannot overwrite existing sub-packets
- Cannot modify or rewrite any component
- Cannot write to other namespaces

### Audit Trail
```json
{
  "timestamp": "ISO8601",
  "skill_id": "A-404",
  "operation": "media_package_assembled",
  "dossier_id": "xxx",
  "packet_id": "MDP-xxx",
  "component_packets": ["TCP-xxx", "VASP-xxx", "ABP-xxx"],
  "timing_alignment_status": "matched|tight|loose"
}
```

## 11. Best Practices

### Assembly Principles
1. **Completeness Check**: Never emit without all 3 components
2. **Lineage Verification**: All packets must trace to same context_engineering_packet
3. **Timing Validation**: Visual and audio must be within 2-second tolerance
4. **Reference Integrity**: All packet instance IDs preserved and traceable
5. **Production Readiness**: Explicit confirmation before downstream consumption

### Common Pitfalls
- Missing one packet (audio or visual)
- Timing misalignment causing audio to overrun or underrun video
- Broken lineage (packets from different dossiers mixed)
- Lost instance ID references
- Incomplete production readiness assessment

### Iteration Path
If media package assembly fails:
1. Check all three packets exist and are valid
2. Verify timing alignment (may need to go back to visual or audio stage)
3. Confirm dossier IDs match across all packets
4. Replay CWF-440 with validated components

## 12. Validation/Done Criteria

### Skill Execution Validation
- ✓ All 3 packets received and validated
- ✓ All 3 packets from same dossier_id
- ✓ Timing alignment within tolerance (±2 seconds max deviation)
- ✓ Lineage chain verified (all trace to context_engineering_packet)
- ✓ All instance IDs preserved
- ✓ Packet schema validation passes

### Acceptance Criteria (for CWF-440)
- ✓ media_production_packet emitted with status CREATED
- ✓ All three component packets referenced by instance_id
- ✓ Timing alignment report complete and accurate
- ✓ Lineage verification documented
- ✓ Dossier delta recorded to media namespace
- ✓ Audit entry created with all component references
- ✓ Next workflow (WF-500) receives unified production packet

### Test References
- `test/skills/media/A-404-assembly-happy-path.test.js`
- `test/skills/media/A-404-timing-alignment-validation.test.js`
- `test/skills/media/A-404-lineage-verification.test.js`

### Regression Tests
- Verify all 3 packets required (failure if any missing)
- Verify no dossier overwrites (append-only)
- Verify packet lineage unbroken
- Verify timing within tolerance

---

**Last Updated**: 2026-04-20  
**Status**: Implementation Ready  
**Next Skill**: A-405-media-qa-validator
