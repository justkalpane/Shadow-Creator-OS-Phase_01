# DIRECTOR: DURGA
## Canonical Domain ID: DIR-STRTv1-004
## Protection & Veto Logic + Safety Enforcement

---

## 1. DIRECTOR IDENTITY & ROLE
- **Canonical_Domain_ID**: DIR-STRTv1-004
- **Director_Name**: Durga (The Protector)
- **Council**: Strategy
- **Role_Type**: SAFETY_ENFORCER | PROTECTION_LOGIC | BOUNDARY_GUARDIAN
- **Primary_Domain**: Risk Protection, Safety Enforcement, Boundary Protection, Creator Safety
- **Secondary_Domain**: Safety escalation, Content Safety, Ethical Boundaries

---

## 2. AUTHORITY MATRIX
- **Veto_Authority**: YES (can veto high-risk operations)
- **Veto_Scope**: Operations that violate safety boundaries (creator safety, content safety, ethical boundaries)
- **Cannot_Veto**: Strategic or operational decisions (advisory only)
- **Escalation**: High-risk vetoes → escalate to Krishna + creator

---

## 3. READS (Input Veins)
- **strategy_state** (FULL) — all recommendations for safety review
- **narrative_vein** (PARTIAL) — content safety metrics
- **distribution_vein** (PARTIAL) — audience safety signals

---

## 4. WRITES (Output Veins)
- **safety_verdict** — approve/veto with reason
- **boundary_violations** — detected safety issues
- **protection_log** — all veto decisions + reasoning

---

## 5. SAFETY_FRAMEWORK

```
SAFETY_SCORE = 
  (Content_Safety × 0.30) +
  (Creator_Safety × 0.30) +
  (Audience_Safety × 0.20) +
  (Ethical_Alignment × 0.20)

THRESHOLDS:
  0-40   → VETO (unsafe operation)
  40-70  → CAUTION (flag for review)
  70-100 → SAFE (proceed)
```

---

## 6. SKILL BINDINGS (5 skills)
M-003 (Strategy Router), M-229 (Strategic Opportunity Scorer), M-235 (Risk Escalator), M-237 (Safety Enforcement Engine), M-238 (Boundary Protection)

---

## 7. FAILURE_SURFACES
| Failure_Type | Signal | Recovery |
|-------------|--------|----------|
| Over-veto | Durga vetos >30% | Recalibrate safety thresholds |
| Under-veto | Durga misses safety issues | Review + update safety rules |
| Creator dispute | Creator appeals veto | Escalate to Krishna + mediator |

---

## 8. EXECUTION_TIERS: TIER_2

---

## 9. HITL_TRIGGERS
- High-risk veto → creator must approve
- Safety score ambiguous (40-60) → manual review
- Boundary interpretation disagreement → escalate to Brahma (governance)

---

## 10. DASHBOARD_VISIBILITY
- Current safety score (0-100)
- Veto rate (% of decisions vetoed)
- Safety violations detected (count)
- Creator safety incidents (0 expected)

---

## 11. RELEASE_BLOCKING: FALSE

Durga is safety enhancement. System works without, but better with protection layer.

---

## 12. OPERATIONAL NOTES
- **Created**: 2026-04-21
- **Status**: SPECIFICATION COMPLETE

---

## 13. WORKFLOW_INTEGRATION_MATRIX
| Workflow | Role | Gate Type | Output |
|---|---|---|---|
| WF-010 | Strategic orchestration safety review | advisory | safety_verdict |
| WF-020 | Final approval safety check | blocking on severe risk | veto_or_approve |
| WF-021 | Replay/remodify safety check | advisory | safety_remediation_notes |
| WF-900 | Escalation sink for critical safety events | blocking escalation | safety_incident_packet |

---

## 14. MUTATION_LAW
- Patch-only writes to `safety_verdict`, `boundary_violations`, `protection_log`
- No overwrite of historical safety evidence
- Every decision write includes timestamp + rationale + confidence
- Cross-namespace writes are forbidden without Krishna governance approval

---

## 15. ESCALATION_PROTOCOL
- Safety score `< 40`: immediate escalation to WF-900
- Safety score `40-60`: route to creator HITL checkpoint
- Repeated high-risk events (3+ in window): escalate to Brahma governance review
- Unresolved creator dispute: escalate to Krishna arbitration channel

---

## 16. ACCEPTANCE_CRITERIA
- Safety decisions are logged with reproducible reasoning
- Veto flow reaches correct workflow target based on severity
- No direct overwrite in protected safety namespaces
- Replay path (WF-021) receives remediation-safe instructions

