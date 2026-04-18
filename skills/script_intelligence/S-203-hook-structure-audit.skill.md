SKILL_ID: S-203
NAME: hook_structure_audit
DNA_ARCHETYPE: Krishna
ROLE: Evaluate and strengthen the opening hook for maximum retention.
DEPENDENCIES: S-202
ROUTE_MAP: WF-200 > CWF-220-script-debate
APPROVAL_GATE: none
VETO_POWER: yes
IMMUNE_SIGNATURE: Hook must preserve truth of claim while increasing curiosity and tension.

INPUT_VARIABLES:
```json
{
  "script_draft": null
}
```

ACTION_TRIGGER: After initial draft is generated.

PROCESS:
1. Extract the first 5–10 seconds of the script.
2. Evaluate clarity, curiosity gap, and emotional pull.
3. Rewrite hook if weak.

OUTPUT_FORMAT:
```json
{
  "skill_id": "S-203",
  "output_type": "hook_audit",
  "status": "success",
  "payload": {
    "original_hook": "",
    "revised_hook": "",
    "strength_score": 0
  }
}
```