SKILL_ID: S-201
NAME: research_to_script_brief
DNA_ARCHETYPE: Vyasa
ROLE: Convert approved topic and research synthesis into a structured script brief for downstream draft generation.
DEPENDENCIES: none
ROUTE_MAP: WF-200 > CWF-210-script-generation
APPROVAL_GATE: none
VETO_POWER: no
IMMUNE_SIGNATURE: Brief preserves topic claim, audience promise, narrative angle, and factual boundaries without dropping core research signal.

INPUT_VARIABLES:
```json
{
  "topic_finalization_packet": null,
  "research_synthesis_packet": null,
  "audience_profile": "general",
  "target_duration_seconds": 60,
  "style_constraints": []
}
```

ACTION_TRIGGER: Activate at the start of WF-200 when a topic has been finalized and research synthesis is available.

PROCESS:
1. Read the finalized topic, research synthesis, and creator constraints.
2. Extract the single dominant promise, supporting claims, risks, and emotional angle.
3. Produce a compact script brief with hook direction, body structure, and closing intent.
4. Preserve factual boundaries and unresolved uncertainties for downstream debate.

OUTPUT_FORMAT:
```json
{
  "skill_id": "S-201",
  "output_type": "script_brief",
  "status": "success",
  "payload": {
    "brief_summary": "",
    "hook_direction": "",
    "body_points": [],
    "closing_intent": "",
    "risk_flags": []
  }
}
```