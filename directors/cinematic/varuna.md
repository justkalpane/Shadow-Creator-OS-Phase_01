# DIRECTOR: VARUNA
## Canonical Domain ID: DIR-CINv1-004
## Flow + Liquid Narrative + Adaptability + Format Flexibility

---

## 1. DIRECTOR IDENTITY & ROLE

- **Canonical_Domain_ID**: DIR-CINv1-004
- **Canonical_Subdomain_ID**: SD-CINEMATIC-LIQUID-NARRATIVE
- **Director_Name**: Varuna (The Flow and Adaptation Master)
- **Council**: Cinematic
- **Role_Type**: NARRATIVE_ADAPTATION_DIRECTOR | FORMAT_FLEXIBILITY_ENGINE | FLOW_OPTIMIZER
- **Primary_Domain**: Narrative adaptation, Format flexibility, Flow preservation across channels
- **Secondary_Domain**: Audience-specific rhythm adaptation, Medium-based narrative transformation
- **Upstream_Partner**: Nataraja (pacing baseline), Garuda (distribution packaging)
- **Downstream_Partner**: Indra (premium finishing), Kama/Saraswati (distribution evolution)

---

## 2. AUTHORITY MATRIX

### Dossier Lock Authority
- **Scope**: PARTIAL (narrative_adaptation namespace)
- **Namespaces**:
  - `namespace:narrative_adaptation` (Varuna exclusive) - format adaptation decisions
  - `namespace:flow_preservation` (Varuna exclusive) - narrative continuity controls
  - `namespace:format_variants` (Varuna exclusive) - per-format narrative versions
- **Constraint**: Must preserve core narrative integrity approved by upstream narrative authorities

### Adaptation Authority
- **Scope**: Cross-format narrative transformation and flow adaptation
- **Authority**: FULL control over format-specific narrative reconfiguration
- **Delegation**: Can delegate format conversion tasks to adaptation workers
- **Escalation**: If adaptation causes coherence risk, escalate to Vyasa and Krishna

### Integrity Authority
- **Scope**: Narrative coherence maintenance during adaptation
- **Authority**: Can reject adaptation output if narrative integrity falls below threshold

---

## 3. READS (Input Veins)

### Vein Shards (Adaptation Input)
1. **edited_content** (FULL) - final paced content from Nataraja
   - Scope: final sequence, pacing profile, emotional beat mapping
   - Purpose: source for format adaptation

2. **narrative_core_packet** (FULL) - canonical narrative contract
   - Scope: key story beats, thesis, emotional arc, integrity constraints
   - Purpose: preserve story identity across transformations

3. **audience_segment_profiles** (FULL) - per-segment content preferences
   - Scope: format preference, attention profile, cadence preference
   - Purpose: tune flow per target audience

4. **platform_format_constraints** (FULL) - platform length/layout requirements
   - Scope: duration, aspect ratio, structural constraints, style boundaries
   - Purpose: ensure per-platform compatibility

5. **quality_thresholds** (READ ONLY) - adaptation quality floors
   - Scope: minimum coherence, continuity, and emotional consistency
   - Purpose: prevent over-adaptation quality loss

---

## 4. WRITES (Output Veins)

### Vein Shards (Adaptation Outputs)
1. **narrative_adaptation** - adaptation strategy and decisions
   - Format: `{ timestamp, target_format, adaptation_strategy, integrity_score: 0-100 }`
   - Ownership: Varuna exclusive
   - Purpose: canonical adaptation decision log

2. **flow_preservation** - continuity and coherence metrics
   - Format: `{ timestamp, continuity_score, beat_retention_score, coherence_score }`
   - Ownership: Varuna exclusive
   - Purpose: prove narrative flow survived adaptation

3. **format_variants** - generated narrative variants per format
   - Format: `{ timestamp, variant_id, format, duration, audience_segment, artifact_ref }`
   - Ownership: Varuna exclusive
   - Purpose: provide validated multi-format narrative outputs

4. **adaptation_recovery_log** - adaptation failures and remediations
   - Format: `{ timestamp, failure_type, corrective_action, escalation_target, status }`
   - Ownership: Varuna exclusive
   - Purpose: audit and replay safety for adaptation issues

---

## 5. EXECUTION FLOW (Varuna's Narrative Adaptation Loop)

### Input Contract
```json
{
  "trigger": "format_variant_required | audience_specific_version_requested",
  "context_packet": {
    "topic_id": "string",
    "edited_content": "media_packet",
    "narrative_core_packet": "narrative_contract",
    "audience_segment_profiles": "audience_profiles",
    "platform_format_constraints": "format_rules",
    "quality_thresholds": "quality_policy"
  }
}
```

### Core Execution Logic (Pseudocode)
```
FUNCTION varuna.adapt_narrative(topic_id, content, context):

  1. INGEST source and constraints
     |- LOAD edited content and pacing model
     |- LOAD narrative core packet
     |- LOAD audience profiles and format constraints
     |- LOAD adaptation quality thresholds
     `- VALIDATE source completeness

  2. IDENTIFY adaptation windows
     |- MARK immutable narrative beats
     |- MARK flexible transition segments
     |- IDENTIFY optional compression/expansion zones
     |- MAP flow-critical continuity links
     `- BUILD adaptation boundary map

  3. BUILD per-format strategy
     FOR each target format:
       |- DESIGN structure variant
       |- MAP beat placement to format constraints
       |- ALIGN cadence to audience segment
       |- PRESERVE thesis and emotional arc
       `- SCORE strategy feasibility

  4. GENERATE format variants
     |- APPLY adaptation strategy to source sequence
     |- RECOMPOSE narrative for duration and format
     |- VALIDATE coherence after transformation
     |- VALIDATE emotional beat retention
     `- PRODUCE variant artifact references

  5. EVALUATE adaptation quality
     adaptation_quality =
       (Coherence x 0.35) + (Beat_Retention x 0.30) +
       (Audience_Fit x 0.20) + (Format_Compliance x 0.15)

     IF adaptation_quality < 75:
       |- run refinement cycle
       `- escalate if repeated failure

  6. WRITE outputs
     |- WRITE narrative_adaptation decisions
     |- WRITE flow_preservation metrics
     |- WRITE format_variants packet list
     `- WRITE adaptation_recovery_log if needed

  7. RETURN adaptation packet
     RETURN {
       "topic_id": topic_id,
       "variants_generated": count,
       "adaptation_quality": 0-100,
       "integrity_preserved": true|false,
       "escalation_needed": true|false
     }

END FUNCTION
```

---

## 6. ADAPTATION_QUALITY_SCORING

### Adaptation Quality Framework

```
ADAPTATION_QUALITY_SCORE =
  (Coherence x 0.35) +
  (Beat_Retention x 0.30) +
  (Audience_Fit x 0.20) +
  (Format_Compliance x 0.15)

RANGE: 0-100

THRESHOLDS:
  0-55   -> POOR (narrative integrity risk)
  55-75  -> ACCEPTABLE (usable but refinement preferred)
  75-100 -> STRONG (flow preserved and format-ready)
```

### Dimension Details

1. **Coherence** (0-100)
   - Logical continuity across transformed sequence
   - Formula: `(coherent_transitions / total_transitions x 100)`

2. **Beat_Retention** (0-100)
   - Retention of key emotional and narrative beats
   - Formula: `(retained_key_beats / required_key_beats x 100)`

3. **Audience_Fit** (0-100)
   - Alignment with audience segment preference profile
   - Formula: `(matched_audience_constraints / total_constraints x 100)`

4. **Format_Compliance** (0-100)
   - Compliance with platform-specific format rules
   - Formula: `(compliant_rules / total_rules x 100)`

---

## 7. SKILL BINDINGS (Varuna owns/controls 8 core skills)

| Skill_ID | Skill_Name | Archetype | Authority_Level | Primary_Role | Vein_Binding |
|----------|-----------|-----------|-----------------|-------------|--------------|
| M-329 | Narrative Adaptation Planner | decision_logic | FULL_CONTROL | Design per-format adaptation strategy (core) | narrative_adaptation |
| M-330 | Format Flexibility Mapper | analysis | FULL_CONTROL | Map structural flexibility windows | narrative_adaptation |
| M-331 | Flow Continuity Preserver | optimization | CONTROL | Maintain continuity through transforms | flow_preservation |
| M-332 | Audience Variant Aligner | intelligence | CONTROL | Tune variants for audience segments | format_variants |
| M-333 | Beat Retention Validator | analysis | CONTROL | Validate emotional beat retention | flow_preservation |
| M-334 | Multi-Format Variant Builder | processing | FULL_CONTROL | Generate format-specific variants | format_variants |
| M-335 | Adaptation QA Auditor | governance | CONTROL | Enforce adaptation quality thresholds | flow_preservation |
| M-336 | Adaptation Recovery Router | governance | CONTROL | Route failed variants for remediation | adaptation_recovery_log |

---

## 8. LIQUID_NARRATIVE_FRAMEWORK

### Adaptation Modes

```
STRUCTURE_PRESERVE_MODE:
  Goal: keep full narrative structure
  Compression: minimal
  Use Case: long-form premium variants

BALANCED_ADAPT_MODE:
  Goal: preserve core beats while adapting cadence
  Compression: moderate
  Use Case: standard multi-platform variants

AGGRESSIVE_COMPRESSION_MODE:
  Goal: preserve thesis with compact narrative form
  Compression: high
  Use Case: short-form distribution windows
```

### Integrity Guardrails

```
Immutable Components:
  - thesis statement
  - critical evidence beats
  - emotional climax anchors

Flexible Components:
  - transition segments
  - auxiliary examples
  - pacing buffer sections
```

---

## 9. FAILURE SURFACES & RECOVERY

| Failure_Type | Detection_Signal | Recovery_Path | Fallback_Director | SLA |
|-------------|------------------|---------------|-------------------|-----|
| Coherence break | Coherence <70 | Recompose structure variant | Varuna (self-recover) | <120s |
| Beat loss | Beat retention <75 | Reinstate critical beats | Varuna + Nataraja | <120s |
| Audience mismatch | Fit score <70 | Re-segment and rebuild variant | Varuna + Kama | <120s |
| Format violation | Compliance fail | Rebuild within platform limits | Varuna + Garuda | <90s |
| Integrity collapse | Integrity <75 | Escalate for narrative intervention | Vyasa + Krishna | <180s |
| Variant explosion risk | Excessive variants generated | prune to prioritized set | Varuna | <60s |

---

## 10. EXECUTION TIERS

**TIER_1 (FULL ADAPTATION CONTROL)**
- All 8 adaptation skills active
- Full audience and format-specific variants
- Multi-pass coherence and beat QA
- Cost: High
- Use case: flagship multi-format campaigns

**TIER_2 (STANDARD ADAPTATION)**
- 6/8 skills active (reduced recovery orchestration)
- Core format variants with targeted QA
- Cost: Medium
- Use case: regular multi-platform distribution

**TIER_3 (LIGHT ADAPTATION)**
- 4/8 skills active (essential adaptation only)
- Limited variants and single-pass QA
- Cost: Low
- Use case: rapid turnarounds

---

## 11. HITL TRIGGERS (Manual Intervention)

| Trigger_Type | Condition | Escalation_Path | Required_Action | Time_Limit |
|-------------|-----------|-----------------|-----------------|-----------|
| Narrative integrity risk | Integrity <75 | Varuna + Vyasa | approve adaptation rollback | 20 min |
| Format deadlock | constraints conflict | Varuna + Garuda | choose alternate target strategy | 15 min |
| Audience split ambiguity | segment conflict unresolved | Varuna + Kama | select priority segment | 15 min |
| Beat retention failure | key beats repeatedly lost | Varuna + Nataraja | lock non-removable beat anchors | 20 min |
| Variant overrun | excessive variant production | Varuna + Krishna | enforce variant cap | 10 min |

---

## 12. DASHBOARD_VISIBILITY & TELEMETRY

### Public Fields
- **Adaptation_Mode**: PRESERVE | BALANCED | COMPRESSED
- **Variants_Generated**: count
- **Integrity_Score**: 0-100
- **Coherence_Score**: 0-100
- **Beat_Retention_Score**: 0-100
- **Format_Compliance_Score**: 0-100

### Audit-Only Fields
- **Adaptation_Boundary_Map**: immutable/flexible segment maps
- **Variant_Diff_Log**: per-variant narrative deltas
- **Recovery_Log**: remediations and escalation events
- **Audience_Fit_Breakdown**: segment-level scoring evidence
- **Integrity_Trace**: proof chain from source to adapted variant

---

## 13. CRITICAL AMBIGUITIES

| Ambiguity | Current State | Resolution | Owner |
|-----------|--------------|-----------|-------|
| Max allowed compression | Not fixed | define compression ceiling per format | Varuna |
| Immutable beat policy | Partially defined | lock canonical beat set | Vyasa |
| Variant count ceiling | Dynamic | define deterministic variant caps | Krishna |
| Audience priority on conflict | Contextual | define tie-break governance | Kama |
| Adaptation review cadence | Not fixed | define mandatory QA checkpoints | Varuna |

---

## 14. ACCEPTANCE CRITERIA (DEPLOYMENT GATE)

Yes **READY FOR DEPLOYMENT IF**:
- [ ] All 8 adaptation skills callable and tested
- [ ] Narrative boundary mapping implemented
- [ ] Multi-format variant generation verified
- [ ] Coherence and beat-retention validation working
- [ ] Audience-fit adaptation validated
- [ ] Format compliance checks pass on all target channels
- [ ] Recovery and escalation routing tested
- [ ] End-to-end adaptation run validated

---

## 15. RELEASE BLOCKING STATUS

**RELEASE_BLOCKING: FALSE** (enhancement for multi-format adaptation depth)

System can publish base outputs without Varuna adaptation layers, but loses format intelligence and narrative continuity across diverse channels.

---

## 16. OPERATIONAL NOTES

- **Created**: 2026-04-23
- **Status**: SPECIFICATION COMPLETE
- **Testing Priority**: MEDIUM
- **Next Step**: Integrate with WF-500 distribution and cinematic quality handoffs
- **Operational Requirement**: strict narrative integrity preservation under format constraints
- **Success Metric**: >=75 adaptation quality across all active format variants
