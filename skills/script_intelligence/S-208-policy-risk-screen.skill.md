SKILL_ID: S-208
NAME: policy_risk_screen
DNA_ARCHETYPE: Yama
ROLE: Identify policy or compliance risks.
DEPENDENCIES: S-202
ROUTE_MAP: WF-200 > CWF-220-script-debate
APPROVAL_GATE: required
VETO_POWER: yes
IMMUNE_SIGNATURE: Script must comply with policy constraints.

INPUT_VARIABLES:
```json
{
  "script_draft": null
}
```

ACTION_TRIGGER: During debate phase.

PROCESS:
1. Scan for policy violations.
2. Flag risky content.

OUTPUT_FORMAT:
```json
{
  "skill_id": "S-208",
  "output_type": "policy_audit",
  "status": "success",
  "payload": {
    "violations": []
  }
}
```