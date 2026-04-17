SKILL_ID: M-004

NAME: Audience Demographic Mapper

DNA_ARCHETYPE: Chandra

ROLE:
Map the candidate topic to audience segments, context, and likely resonance.

DEPENDENCIES:
M-002

ROUTE_MAP:
WF-100 -> CWF-110-topic-discovery -> CWF-120-topic-qualification

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
At least one audience segment and one resonance rationale returned.

INPUT_VARIABLES:
{
  "dossier_id": "",
  "topic_seed": "",
  "candidate_id": "",
  "source_refs": [],
  "audience": "",
  "budget_profile": ""
}

ACTION_TRIGGER:
Run when discovery or qualification needs audience fit evidence.

PROCESS:
1. Infer audience segments from topic and source context.
2. Map relevance, familiarity, and likely interest.
3. Return audience-fit notes for qualification and scoring.

OUTPUT_FORMAT:
{
  "skill_id": "M-004",
  "output_type": "audience_mapping_packet",
  "status": "created",
  "payload": {}
}
