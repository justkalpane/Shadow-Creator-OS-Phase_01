SKILL_ID: S-206
NAME: clarity_retention_refinement
DNA_ARCHETYPE: Saraswati
ROLE: Improve clarity and retention optimization.
DEPENDENCIES: S-205
ROUTE_MAP: WF-200 > CWF-230-script-refinement
APPROVAL_GATE: none
VETO_POWER: no
IMMUNE_SIGNATURE: Script must be easy to follow and engaging.

INPUT_VARIABLES:
```json
{
  "refined_script": null
}
```

ACTION_TRIGGER: After tone refinement.

PROCESS:
1. Simplify complex sentences.
2. Optimize pacing.

OUTPUT_FORMAT:
```json
{
  "skill_id": "S-206",
  "output_type": "clarity_optimized_script",
  "status": "success",
  "payload": {
    "optimized_text": ""
  }
}
```