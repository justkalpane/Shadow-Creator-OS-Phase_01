SKILL_ID: S-210
NAME: final_script_packager
DNA_ARCHETYPE: Chandra
ROLE: Package final script output.
DEPENDENCIES: S-209
ROUTE_MAP: WF-200 > CWF-240-final-script-shaping
APPROVAL_GATE: required
VETO_POWER: no
IMMUNE_SIGNATURE: Final output preserves all validated improvements.

INPUT_VARIABLES:
```json
{
  "final_script": null
}
```

ACTION_TRIGGER: End of WF-200.

PROCESS:
1. Assemble final script.
2. Validate completeness.

OUTPUT_FORMAT:
```json
{
  "skill_id": "S-210",
  "output_type": "final_script",
  "status": "success",
  "payload": {
    "final_text": ""
  }
}
```