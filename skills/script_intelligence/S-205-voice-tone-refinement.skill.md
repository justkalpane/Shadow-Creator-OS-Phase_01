SKILL_ID: S-205
NAME: voice_tone_refinement
DNA_ARCHETYPE: Saraswati
ROLE: Adjust tone, clarity, and linguistic flow.
DEPENDENCIES: S-202
ROUTE_MAP: WF-200 > CWF-230-script-refinement
APPROVAL_GATE: none
VETO_POWER: no
IMMUNE_SIGNATURE: Tone must align with audience and platform expectations.

INPUT_VARIABLES:
```json
{
  "script_draft": null
}
```

ACTION_TRIGGER: During refinement phase.

PROCESS:
1. Analyze tone.
2. Adjust phrasing.
3. Improve readability.

OUTPUT_FORMAT:
```json
{
  "skill_id": "S-205",
  "output_type": "tone_refined_script",
  "status": "success",
  "payload": {
    "refined_text": ""
  }
}
```