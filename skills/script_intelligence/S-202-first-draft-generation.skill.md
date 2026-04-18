SKILL_ID: S-202
NAME: first_draft_generation
DNA_ARCHETYPE: Vyasa
ROLE: Generate the initial script draft from the structured brief.
DEPENDENCIES: S-201
ROUTE_MAP: WF-200 > CWF-210-script-generation
APPROVAL_GATE: none
VETO_POWER: no
IMMUNE_SIGNATURE: Draft must reflect the brief structure and preserve core claims without hallucination.

INPUT_VARIABLES:
```json
{
  "script_brief": null,
  "tone": "engaging",
  "language": "english"
}
```

ACTION_TRIGGER: After S-201 produces a valid script brief.

PROCESS:
1. Read the script brief.
2. Expand hook, body points, and closing into a coherent draft.
3. Maintain logical flow and narrative clarity.
4. Avoid adding unsupported claims.

OUTPUT_FORMAT:
```json
{
  "skill_id": "S-202",
  "output_type": "script_draft",
  "status": "success",
  "payload": {
    "draft_text": "",
    "structure": {
      "hook": "",
      "body": [],
      "closing": ""
    }
  }
}
```