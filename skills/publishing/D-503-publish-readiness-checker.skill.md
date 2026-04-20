# D-503: Publish Readiness Checker

## 1. Skill Identity
- **Skill ID**: D-503
- **Name**: Publish Readiness Checker
- **Category**: Publishing & Distribution
- **Skill Pack**: WF-500
- **Phase**: Phase 1
- **Owner Director**: Yama
- **Governance Authority**: Krishna, Chanakya
- **Status**: active
- **Version**: 1.0.0

## 2. Purpose
Final quality and policy validation before content publication. Verifies all metadata is complete, platform-ready, policy-compliant, and schedule-feasible. Serves as gatekeeper between content preparation and publishing execution.

## 3. DNA Injection

### Role Statement
Publish readiness checker is final gatekeeper before content goes live. Ensures all compliance requirements met, metadata complete, and platform readiness verified.

### Behavior Model
- **Upstream**: Receives seo_optimized_metadata_packet and distribution_plan_packet
- **Reads**: All publishing-related dossier namespaces, platform compliance rules
- **Produces**: publish_ready_packet with promotion decision (READY | NEEDS_REVIEW | BLOCKED)
- **Downstream**: WF-600-analytics-evolution-pack consumes publish_ready_packet
- **Escalation**: Critical policy violations or blocked status → WF-900
- **Fallback**: Non-critical issues → emit with warnings but allow progression

### Operating Method
1. Parse all metadata packets (SEO-optimized, distribution plan)
2. Execute validation matrix (15+ checks)
3. Assess policy compliance
4. Verify platform readiness
5. Confirm schedule feasibility
6. Emit publish_ready_packet with promotion decision

## 4. Workflow Injection

### Producer Contracts
- **Triggered By**: CWF-530-publish-readiness-checker
- **Input Packet Families**:
  - seo_optimized_metadata_packet (from D-502)
  - distribution_plan_packet (from D-502)
  - media_production_packet (reference)
- **Input Expectations**:
  - All metadata complete and SEO-optimized
  - Distribution plan has schedule and platform targets
  - No critical policy violations

### Consumer Contracts
- **Consumed By**: WF-600-analytics-evolution-pack
- **Output Packet Family**: publish_ready_packet
- **Output Guarantees**:
  - Complete validation report
  - Clear promotion decision
  - All checks passed or documented
  - Next action specified

### Workflow Vein
- **Vein Name**: publishing_vein
- **Vein Role**: Final validation before publishing
- **Reads From**:
  - se_route_runs (route context)
  - se_dossier_index (dossier metadata)
  - se_packet_index (all publishing packets)
- **Writes To**:
  - se_packet_index (append publish_ready_packet)
  - dossier.publishing.readiness_reports (patch mutation, append_to_array)
  - dossier.approval.publication_queue (if READY)
- **Next Stage**: WF-600-analytics-evolution-pack

## 5. Inputs

### Required Inputs
```json
{
  "seo_optimized_metadata_packet": {
    "instance_id": "SOM-xxxx",
    "payload": {
      "quality": {
        "keyword_optimization": "float",
        "overall_seo_score": "float"
      }
    }
  },
  "distribution_plan_packet": {
    "instance_id": "DPP-xxxx",
    "payload": {
      "evidence": {
        "platform_schedule": [
          {
            "platform": "youtube",
            "scheduled_publish_time": "ISO8601"
          }
        ]
      }
    }
  },
  "media_production_packet": {
    "instance_id": "MDP-xxxx"
  }
}
```

### Optional Inputs
- platform_overrides (custom platform constraints)
- policy_waivers (approved policy exceptions)
- urgent_publish_flag (accelerated readiness check)

## 6. Execution Logic

### Quality Validation Matrix (15+ Checks)

```javascript
function validate_publish_readiness(metadata_packet, distribution_packet) {
  validation_results = []
  blockers = []
  warnings = []
  
  // Check 1: Metadata Completeness
  result = {
    check_id: "RDY-001-COMPLETENESS",
    criterion: "All platform metadata present and complete",
    required: true,
    status: all_platforms_have_metadata(metadata_packet),
    score: metadata_completeness_score
  }
  validation_results.push(result)
  
  // Check 2: SEO Quality Threshold
  result = {
    check_id: "RDY-002-SEO-QUALITY",
    criterion: "SEO optimization score >= 0.80",
    required: true,
    status: metadata_packet.quality.overall_seo_score >= 0.80,
    score: metadata_packet.quality.overall_seo_score
  }
  validation_results.push(result)
  
  // Check 3: Policy Compliance
  result = {
    check_id: "RDY-003-POLICY",
    criterion: "No policy violations in metadata or media",
    required: true,
    status: check_policy_compliance(metadata_packet),
    violations: detect_policy_violations(metadata_packet)
  }
  validation_results.push(result)
  
  // Check 4: Platform Readiness
  result = {
    check_id: "RDY-004-PLATFORM-READY",
    criterion: "All target platforms ready to receive content",
    required: true,
    status: verify_platform_readiness(distribution_packet.target_platforms),
    platforms_ready: count_ready_platforms(distribution_packet)
  }
  validation_results.push(result)
  
  // Check 5: Schedule Feasibility
  result = {
    check_id: "RDY-005-SCHEDULE",
    criterion: "Publication schedule is feasible and not in past",
    required: true,
    status: validate_publication_schedule(distribution_packet),
    earliest_publish_time: get_earliest_publish_time(distribution_packet)
  }
  validation_results.push(result)
  
  // Check 6: Media Assets Referenced
  result = {
    check_id: "RDY-006-ASSETS",
    criterion: "All media assets referenced and available",
    required: true,
    status: verify_media_assets(metadata_packet),
    asset_count: count_referenced_assets(metadata_packet)
  }
  validation_results.push(result)
  
  // Check 7: Metadata Consistency
  result = {
    check_id: "RDY-007-CONSISTENCY",
    criterion: "Metadata consistent across platforms",
    required: false,
    status: check_cross_platform_consistency(metadata_packet),
    inconsistencies: detect_inconsistencies(metadata_packet)
  }
  validation_results.push(result)
  
  // Check 8: Keyword Optimization
  result = {
    check_id: "RDY-008-KEYWORDS",
    criterion: "Primary keyword optimized for all platforms",
    required: true,
    status: verify_keyword_optimization(metadata_packet),
    keyword_coverage: calculate_keyword_coverage(metadata_packet)
  }
  validation_results.push(result)
  
  // Check 9: Description Quality
  result = {
    check_id: "RDY-009-DESCRIPTIONS",
    criterion: "All descriptions meet quality standards",
    required: true,
    status: validate_descriptions(metadata_packet),
    quality_score: assess_description_quality(metadata_packet)
  }
  validation_results.push(result)
  
  // Check 10: Accessibility Compliance
  result = {
    check_id: "RDY-010-ACCESSIBILITY",
    criterion: "Content accessible (captions, alt-text, etc.)",
    required: true,
    status: check_accessibility_features(metadata_packet),
    accessibility_score: calculate_accessibility_score(metadata_packet)
  }
  validation_results.push(result)
  
  // Check 11: Governance Compliance
  result = {
    check_id: "RDY-011-GOVERNANCE",
    criterion: "All governance requirements met",
    required: true,
    status: verify_governance_compliance(metadata_packet),
    approvals_obtained: get_required_approvals(metadata_packet)
  }
  validation_results.push(result)
  
  // Check 12: Brand Consistency
  result = {
    check_id: "RDY-012-BRAND",
    criterion: "Brand guidelines respected",
    required: false,
    status: check_brand_consistency(metadata_packet),
    brand_violations: detect_brand_violations(metadata_packet)
  }
  validation_results.push(result)
  
  // Check 13: Analytics Setup
  result = {
    check_id: "RDY-013-ANALYTICS",
    criterion: "Analytics tracking configured",
    required: true,
    status: verify_analytics_setup(distribution_packet),
    tracking_ids_present: check_tracking_ids(distribution_packet)
  }
  validation_results.push(result)
  
  // Check 14: Distribution Redundancy
  result = {
    check_id: "RDY-014-REDUNDANCY",
    criterion: "No single point of failure in distribution",
    required: false,
    status: verify_distribution_redundancy(distribution_packet),
    backup_channels: count_backup_channels(distribution_packet)
  }
  validation_results.push(result)
  
  // Check 15: Post-Publish Monitoring
  result = {
    check_id: "RDY-015-MONITORING",
    criterion: "Post-publish monitoring configured",
    required: true,
    status: verify_monitoring_setup(metadata_packet),
    alerts_configured: check_alerts(metadata_packet)
  }
  validation_results.push(result)
  
  // Aggregate Results
  required_checks = validation_results.filter(r => r.required)
  optional_checks = validation_results.filter(r => !r.required)
  
  required_passed = required_checks.filter(r => r.status).length
  required_total = required_checks.length
  
  overall_score = required_passed / required_total
  
  // Determine Promotion Decision
  if required_passed < required_total {
    blockers = validation_results.filter(r => r.required && !r.status)
    decision = "BLOCKED"
  } else if blockers.length > 0 {
    decision = "NEEDS_REVIEW"
  } else {
    decision = "READY_FOR_PUBLISHING"
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
- **Required Checks Pass**: 100% (all required checks must pass for READY)
- **Overall Score**: 1.0 for READY, 0.8+ for NEEDS_REVIEW, <0.8 for BLOCKED
- **SEO Score**: Must be >= 0.80
- **No Critical Policy Violations**: Any critical violation = BLOCKED

## 7. Outputs

### Primary Output: publish_ready_packet

```json
{
  "instance_id": "PRP-timestamp",
  "artifact_family": "publish_ready_packet",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-530-Publish-Readiness-Checker",
  "dossier_ref": "dossier_id",
  "created_at": "ISO8601",
  "status": "COMPLETED",
  "payload": {
    "narrative": {
      "validation_timestamp": "ISO8601",
      "promotion_decision": "READY_FOR_PUBLISHING|NEEDS_REVIEW|BLOCKED",
      "overall_readiness_score": 0.0-1.0
    },
    "context": {
      "target_platforms": ["youtube", "instagram"],
      "scheduled_publish_times": ["ISO8601"],
      "dossier_id": "string"
    },
    "evidence": {
      "validation_checks": [
        {
          "check_id": "RDY-001-COMPLETENESS",
          "criterion": "string",
          "status": "passed|failed",
          "required": true,
          "score": 0.0-1.0
        }
      ],
      "checks_passed": "int",
      "checks_total": "int",
      "required_checks_passed": "int",
      "required_checks_total": "int"
    },
    "quality": {
      "overall_readiness_score": 0.98,
      "metadata_completeness": 1.0,
      "seo_quality": 0.92,
      "policy_compliance": 1.0,
      "schedule_feasibility": 1.0,
      "publication_readiness": "ready|needs_review|blocked"
    },
    "status": {
      "validation_complete": true,
      "promotion_decision": "READY_FOR_PUBLISHING|NEEDS_REVIEW|BLOCKED",
      "can_proceed_to_publishing": true|false,
      "critical_blockers": [
        {
          "blocker_id": "string",
          "issue": "string",
          "remediation_path": "string"
        }
      ],
      "warnings": [
        {
          "warning_id": "string",
          "issue": "string",
          "severity": "low|medium"
        }
      ],
      "next_stage": "WF-600|WF-900"
    }
  }
}
```

### Secondary Outputs
- **Publication Certificate**: If READY, document for publishing team
- **Review Checklist**: If NEEDS_REVIEW, specific items to address
- **Blocker Analysis**: If BLOCKED, detailed failure breakdown

## 8. Governance

### Approval Gates
- All required validation checks must pass
- Critical policy violations = automatic BLOCKED
- Yama (policy enforcement director) can override NEEDS_REVIEW → BLOCKED

### Veto/Restriction Points
- Cannot promote without all required checks passing
- Cannot hide critical blockers
- Cannot proceed to publishing with policy violations

### Policy Constraints
- Validation must be deterministic (same input → same decision)
- All blockers must be actionable (not subjective)
- Cannot reject based on taste, only objective criteria

## 9. Tool/Runtime Usage

### Allowed Tools
- Packet validator (schema compliance)
- Dossier reader (reference lookups)
- Policy rule engine (compliance checking)
- Route registry (next stage routes)

### Forbidden Tools
- Cannot generate new metadata
- Cannot modify validated packets
- Cannot bypass quality gates

## 10. Mutation Law

### Reads (Allowed)
- `dossier.publishing.*` (full namespace)
- `se_packet_index` (all publishing packets)
- `se_dossier_index` (metadata)

### Writes (Allowed)
- `dossier.publishing.readiness_reports` (patch: append_to_array only)
- `dossier.approval.publication_queue` (if READY)
- `se_packet_index` (readiness report metadata)

### Forbidden Writes
- Cannot modify metadata packets
- Cannot overwrite existing readiness reports
- Cannot write to other namespaces

### Audit Trail
```json
{
  "timestamp": "ISO8601",
  "skill_id": "D-503",
  "operation": "publish_readiness_validation_completed",
  "dossier_id": "xxx",
  "promotion_decision": "READY_FOR_PUBLISHING|NEEDS_REVIEW|BLOCKED",
  "overall_readiness_score": "float",
  "required_checks_passed": "int/int",
  "critical_blockers_count": "int"
}
```

## 11. Best Practices

### Readiness Philosophy
1. **Required vs. Optional**: Distinguish blockers from improvements
2. **Deterministic**: Same validation always yields same result
3. **Actionable**: All failures include specific remediation
4. **Comprehensive**: Cover all critical aspects (compliance, quality, feasibility)
5. **Transparent**: Clear reasoning for all promotion decisions

### Common Pitfalls
- Too lenient (allowing unready content to publish)
- Too strict (blocking good content on minor issues)
- Unclear remediation (what's wrong without how to fix)
- Hidden blockers (critical issues buried in warnings)
- Moving goalposts (validation criteria change)

### Iteration Path
If readiness check fails:
1. Review specific failed checks
2. Follow remediation guidance
3. Address root cause (metadata, schedule, compliance)
4. Replay CWF-530 readiness validation
5. If still failing, escalate to WF-900

## 12. Validation/Done Criteria

### Skill Execution Validation
- ✓ All 15 validation checks executed
- ✓ Required checks 100% passed (for READY decision)
- ✓ Promotion decision clearly stated
- ✓ All blockers documented with remediation
- ✓ Overall readiness score calculated
- ✓ Packet schema validation passes

### Acceptance Criteria (for CWF-530)
- ✓ publish_ready_packet emitted with status COMPLETED
- ✓ Overall readiness score documented
- ✓ Promotion decision: READY | NEEDS_REVIEW | BLOCKED
- ✓ All required checks either passed or explicitly failed
- ✓ If READY: dossier.approval.publication_queue updated
- ✓ If NEEDS_REVIEW: specific review items documented
- ✓ If BLOCKED: blockers and remediation paths clear
- ✓ Audit entry created with promotion decision

### Test References
- `test/skills/publishing/D-503-readiness-validation-happy-path.test.js`
- `test/skills/publishing/D-503-quality-gate-enforcement.test.js`
- `test/skills/publishing/D-503-blocker-detection.test.js`

### Regression Tests
- Verify all 15 checks execute
- Verify required checks enforce decision
- Verify no dossier overwrites
- Verify decision deterministic (same input → same result)
- Verify BLOCKED decision impossible to override

---

**Last Updated**: 2026-04-20  
**Status**: Implementation Ready  
**Completion**: All 3 WF-500 skills now complete with full DNA injection
