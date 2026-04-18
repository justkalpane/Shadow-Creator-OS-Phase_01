SKILL_ID: S-204
NAME: narrative_logic_audit
DNA_ARCHETYPE: Krishna
ROLE: Validate logical consistency and flow of the script.
DEPENDENCIES: S-202
ROUTE_MAP: WF-200 > CWF-220-script-debate
APPROVAL_GATE: none
VETO_POWER: yes
IMMUNE_SIGNATURE: Narrative must remain logically consistent with no contradictions.

INPUT_VARIABLES:
```json
{
  "script_draft": null
}
```

ACTION_TRIGGER: After initial draft generation.

PROCESS:
1. Analyze sequence of claims.
2. Detect logical gaps or contradictions.
3. Suggest fixes.

OUTPUT_FORMAT:
```json
{
  "skill_id": "S-204",
  "output_type": "logic_audit",
  "status": "success",
  "payload": {
    "issues": [],
    "fix_suggestions": []
  }
}
```