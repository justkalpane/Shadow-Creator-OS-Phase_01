# A-405: Media Production QA Validator

## 1. Skill Identity
- **Skill ID**: A-405
- **Name**: Media Production QA Validator
- **Category**: Media Production
- **Skill Pack**: WF-400
- **Phase**: Phase 1
- **Owner Director**: Durga
- **Governance Authority**: Krishna, Kubera
- **Status**: active
- **Version**: 1.0.0

## 2. Purpose
Validate complete media production package against quality gates, feasibility criteria, and platform constraints before submission to publishing pipeline. Serve as final quality checkpoint.

## 3. DNA Injection

### Role Statement
Media QA validator is final quality gatekeeper. Assesses production feasibility, validates all specifications, confirms platform readiness. Escalates blockers to error handling.

### Behavior Model
- **Upstream**: Receives media_production_packet (already assembled)
- **Reads**: All component specifications within production packet
- **Produces**: Validation report and promotion decision
- **Downstream**: WF-500-publishing-distribution-pack receives promoted packet
- **Escalation**: Quality gate failures → detailed rejection with remediation path
- **Fallback**: Non-critical issues → emit with warnings but allow progression

### Operating Method
1. Parse media_production_packet components
2. Execute quality validation matrix (10+ checks)
3. Assess production feasibility
4. Validate platform compliance
5. Emit validation report and promotion decision

## 4. Workflow Injection

### Producer Contracts
- **Triggered By**: CWF-440-media-package-finalizer (receives assembled media_production_packet)
- **Input Packet Family**: media_production_packet
- **Input Expectations**:
  - Complete payload with thumbnail, visual, and audio specifications
  - Valid timing alignment report
  - Proper lineage documentation

### Consumer Contracts
- **Consumed By**: WF-500 on successful validation
- **Output Types**:
  - Validation Report (always emitted)
  - Promotion Decision (APPROVED | NEEDS_REVISION | CRITICAL_BLOCKER)
  - Remediation Guidance (if issues found)

### Workflow Vein
- **Vein Name**: media_production_vein
- **Vein Role**: Final quality validation before publishing
- **Reads From**:
  - se_route_runs (route context)
  - se_dossier_index (dossier metadata)
  - se_packet_index (media_production_packet reference)
- **Writes To**:
  - se_packet_index (validation report)
  - dossier.media.validation_reports (patch mutation, append_to_array)
  - If rejected: dossier.approval.rejection_queue
- **Next Stage**: 
  - On APPROVED: WF-500-publishing-distribution-pack
  - On NEEDS_REVISION: CWF-430 or CWF-420 (per remediation path)
  - On CRITICAL_BLOCKER: WF-900

## 5. Inputs

### Required Inputs
```json
{
  "media_production_packet": {
    "instance_id": "MDP-xxxx",
    "artifact_family": "media_production_packet",
    "payload": {
      "evidence": {
        "thumbnail_specifications": {},
        "visual_specifications": {},
        "audio_specifications": {},
        "timing_alignment": []
      }
    }
  }
}
```

### Optional Inputs
- validation_profile (strict|standard|lenient)
- platform_overrides (platform-specific constraints)
- quality_thresholds (custom minimum scores)

## 6. Execution Logic

### Quality Validation Matrix (10+ Checks)

```javascript
function validate_media_production(media_packet) {
  validation_results = []
  blockers = []
  warnings = []
  
  // Check 1: Packet Completeness
  result = {
    check_id: "QA-001-COMPLETENESS",
    criterion: "All 3 sub-components present",
    required: true,
    status: has_thumbnail(media_packet) && has_visual(media_packet) && has_audio(media_packet),
    score: 1.0 if passed else 0.0
  }
  validation_results.push(result)
  
  // Check 2: Lineage Integrity
  result = {
    check_id: "QA-002-LINEAGE",
    criterion: "All packets trace to same context_engineering_packet",
    required: true,
    status: verify_lineage_chain(media_packet),
    score: lineage_verification_score
  }
  validation_results.push(result)
  
  // Check 3: Timing Alignment
  result = {
    check_id: "QA-003-TIMING",
    criterion: "Visual and audio aligned within tolerance (±2 seconds)",
    required: true,
    status: all_timing_deviations_acceptable(media_packet),
    score: timing_alignment_score,
    details: max_deviation_seconds
  }
  validation_results.push(result)
  
  // Check 4: Thumbnail Validity
  result = {
    check_id: "QA-004-THUMBNAILS",
    criterion: "3 distinct thumbnail concepts with platform compliance",
    required: true,
    status: validate_thumbnail_specs(media_packet),
    score: 1.0 if 3_concepts && all_platform_compliant else 0.0
  }
  validation_results.push(result)
  
  // Check 5: Visual Asset Realism
  result = {
    check_id: "QA-005-VISUAL-FEASIBILITY",
    criterion: "Visual assets are production-achievable",
    required: false,
    status: assess_visual_production_feasibility(media_packet),
    score: feasibility_score,
    details: production_complexity_rating
  }
  validation_results.push(result)
  
  // Check 6: B-Roll Accessibility
  result = {
    check_id: "QA-006-BROLL-ACCESS",
    criterion: "Recommended b-roll is accessible (Unsplash, Pexels, licensed)",
    required: true,
    status: verify_broll_accessibility(media_packet),
    score: accessibility_percentage,
    warnings: unrecommended_sources
  }
  validation_results.push(result)
  
  // Check 7: Audio Script Feasibility
  result = {
    check_id: "QA-007-AUDIO-FEASIBILITY",
    criterion: "Audio script is voiceover-friendly",
    required: false,
    status: assess_audio_feasibility(media_packet),
    score: voiceover_feasibility_score,
    issues: breath_mark_density, emphasis_frequency
  }
  validation_results.push(result)
  
  // Check 8: Platform Compliance
  result = {
    check_id: "QA-008-PLATFORM-COMPLIANCE",
    criterion: "All specs comply with target platform requirements",
    required: true,
    status: validate_platform_compliance(media_packet),
    score: compliance_score,
    platform: media_packet.context.target_platform
  }
  validation_results.push(result)
  
  // Check 9: Accessibility Standards (WCAG AA)
  result = {
    check_id: "QA-009-ACCESSIBILITY",
    criterion: "Text contrast, font sizing meet WCAG AA standards",
    required: true,
    status: validate_accessibility_standards(media_packet),
    score: accessibility_compliance_score,
    issues: []
  }
  validation_results.push(result)
  
  // Check 10: Narrative Alignment
  result = {
    check_id: "QA-010-NARRATIVE",
    criterion: "All visuals and audio aligned to script narrative",
    required: true,
    status: verify_narrative_alignment(media_packet),
    score: alignment_score,
    issues: misalignments
  }
  validation_results.push(result)
  
  // Check 11: Content Governance
  result = {
    check_id: "QA-011-GOVERNANCE",
    criterion: "No policy violations in visual or audio direction",
    required: true,
    status: check_governance_compliance(media_packet),
    score: 1.0 if compliant else 0.0,
    violations: []
  }
  validation_results.push(result)
  
  // Aggregate Results
  required_checks = validation_results.filter(r => r.required)
  optional_checks = validation_results.filter(r => !r.required)
  
  required_passed = required_checks.filter(r => r.status).length
  required_total = required_checks.length
  optional_passed = optional_checks.filter(r => r.status).length
  optional_total = optional_checks.length
  
  overall_score = (required_passed / required_total) * 0.8 + (optional_passed / optional_total) * 0.2
  
  // Determine Promotion Decision
  if required_passed < required_total {
    blockers = validation_results.filter(r => r.required && !r.status)
    decision = "CRITICAL_BLOCKER"
  } else if optional_passed < optional_total * 0.6 {
    decision = "NEEDS_REVISION"
  } else {
    decision = "APPROVED_FOR_PUBLISHING"
  }
  
  return {
    validation_results: validation_results,
    overall_score: overall_score,
    promotion_decision: decision,
    blockers: blockers,
    warnings: warnings,
    remediation_guidance: generate_remediation(blockers)
  }
}
```

### Quality Thresholds
- **Required Checks Pass**: 100% (all required checks must pass)
- **Optional Checks Pass**: 60% minimum (encourages quality but allows progression)
- **Overall Score**: 0.75+ for APPROVED, 0.50-0.75 for NEEDS_REVISION, <0.50 for CRITICAL_BLOCKER

## 7. Outputs

### Primary Output: Media Validation Report

```json
{
  "instance_id": "MVR-timestamp",
  "artifact_family": "media_validation_report",
  "schema_version": "1.0.0",
  "produced_by": "SE-N8N-CWF-440-Media-QA-Validator",
  "media_packet_validated": "MDP-xxxx",
  "dossier_ref": "dossier_id",
  "created_at": "ISO8601",
  "status": "COMPLETED",
  "payload": {
    "narrative": {
      "validation_timestamp": "ISO8601",
      "promotion_decision": "APPROVED_FOR_PUBLISHING|NEEDS_REVISION|CRITICAL_BLOCKER",
      "overall_quality_score": 0.0-1.0
    },
    "context": {
      "target_platform": "youtube|tiktok|instagram",
      "dossier_id": "string",
      "validation_profile": "strict|standard|lenient"
    },
    "evidence": {
      "validation_checks": [
        {
          "check_id": "QA-001-COMPLETENESS",
          "criterion": "string",
          "status": "passed|failed",
          "required": true,
          "score": 0.0-1.0,
          "details": "optional details"
        }
      ],
      "checks_passed": "int",
      "checks_total": "int",
      "required_checks_passed": "int",
      "required_checks_total": "int"
    },
    "quality": {
      "overall_quality_score": 0.85,
      "completeness_score": 1.0,
      "feasibility_score": 0.88,
      "compliance_score": 0.92,
      "accessibility_score": 0.90,
      "production_readiness": "ready|needs_minor_adjustments|needs_major_revisions"
    },
    "status": {
      "validation_complete": true,
      "promotion_decision": "APPROVED_FOR_PUBLISHING|NEEDS_REVISION|CRITICAL_BLOCKER",
      "can_proceed_to_publishing": true|false,
      "critical_blockers": [
        {
          "blocker_id": "string",
          "issue": "string",
          "remediation_path": "return_to_CWF-420|return_to_CWF-430|escalate_to_WF-900"
        }
      ],
      "warnings": [
        {
          "warning_id": "string",
          "issue": "string",
          "severity": "low|medium",
          "suggestion": "string"
        }
      ],
      "next_stage": "WF-500|CWF-420|CWF-430|WF-900"
    }
  }
}
```

### Secondary Outputs
- **Promotion Certificate**: If APPROVED, document for publishing team
- **Remediation Playbook**: If NEEDS_REVISION, step-by-step fix guidance
- **Escalation Summary**: If CRITICAL_BLOCKER, detailed failure analysis

## 8. Governance

### Approval Gates
- All required QA checks must pass before promotion
- Optional checks encourage quality but allow some flexibility
- Critical accessibility violations = automatic CRITICAL_BLOCKER

### Veto/Restriction Points
- Cannot promote if required checks fail
- Cannot hide critical blockers in warnings
- Cannot proceed to publishing with policy violations

### Policy Constraints
- Validation must be deterministic (same input → same result)
- Remediation guidance must be actionable
- Cannot reject based on subjective taste, only objective criteria

## 9. Tool/Runtime Usage

### Allowed Tools
- Packet validator (schema compliance)
- Dossier reader (reference lookups)
- Route registry (next stage routes)
- Skill registry (skill resolution)

### Forbidden Tools
- Cannot generate new media specifications
- Cannot modify validated packet
- Cannot bypass quality gates programmatically

## 10. Mutation Law

### Reads (Allowed)
- `dossier.media.production_packets` (full read)
- `se_packet_index` (all media packets)
- `se_dossier_index` (metadata)

### Writes (Allowed)
- `dossier.media.validation_reports` (patch: append_to_array only)
- `dossier.approval.promotion_queue` (if APPROVED)
- `dossier.approval.revision_queue` (if NEEDS_REVISION)
- `se_packet_index` (validation report metadata)

### Forbidden Writes
- Cannot modify media_production_packet itself
- Cannot overwrite existing validation reports
- Cannot write to other namespaces

### Audit Trail
```json
{
  "timestamp": "ISO8601",
  "skill_id": "A-405",
  "operation": "media_qa_validation_completed",
  "dossier_id": "xxx",
  "media_packet_id": "MDP-xxx",
  "promotion_decision": "APPROVED_FOR_PUBLISHING|NEEDS_REVISION|CRITICAL_BLOCKER",
  "overall_quality_score": "float",
  "required_checks_passed": "int/int"
}
```

## 11. Best Practices

### QA Philosophy
1. **Required vs. Optional**: Distinguish critical blockers from improvement suggestions
2. **Remediation Clarity**: Always provide specific fix path, not just "redo this"
3. **Feasibility Focus**: Validate production can actually achieve the specs
4. **Platform Literacy**: Understand platform-specific constraints and conventions
5. **Accessibility First**: WCAG AA compliance is non-negotiable

### Common Pitfalls
- Too lenient (allowing poor quality through)
- Too strict (blocking good work on subjective grounds)
- Unclear remediation (tells what's wrong but not how to fix)
- Hidden blockers (critical issues buried in warnings)
- Platform ignorance (validating specs that platform doesn't support)

### Iteration Path
If validation fails:
1. Review specific failed check criteria
2. Follow remediation path to appropriate stage
3. Implement fix (video timeline, audio timing, visual assets)
4. Replay QA validation
5. If still failing, escalate to WF-900

## 12. Validation/Done Criteria

### Skill Execution Validation
- ✓ All 11 quality checks executed
- ✓ Results documented with specific scores
- ✓ Promotion decision clearly stated
- ✓ Remediation guidance provided (if needed)
- ✓ Packet schema validation passes

### Acceptance Criteria (for CWF-440)
- ✓ Media validation report emitted
- ✓ Overall quality score calculated and documented
- ✓ All required checks passed (if APPROVED) or explicitly failed (if NEEDS_REVISION/BLOCKER)
- ✓ Promotion decision clear and actionable
- ✓ If APPROVED: dossier.approval.promotion_queue updated
- ✓ If NEEDS_REVISION: remediation guidance documented
- ✓ If CRITICAL_BLOCKER: escalation path identified
- ✓ Audit entry created with promotion decision

### Test References
- `test/skills/media/A-405-qa-validation-happy-path.test.js`
- `test/skills/media/A-405-quality-gate-enforcement.test.js`
- `test/skills/media/A-405-remediation-guidance.test.js`

### Regression Tests
- Verify all 11 checks execute
- Verify required checks enforce promotion decision
- Verify no dossier overwrites
- Verify promotion decision deterministic (same input → same decision)

---

**Last Updated**: 2026-04-20  
**Status**: Implementation Ready  
**Completion**: All 5 WF-400 skills now complete with full DNA injection
