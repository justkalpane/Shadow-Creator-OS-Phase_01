SKILL_ID: M-012

NAME: Audience Interest Predictor

DNA_ARCHETYPE: Chandra

ROLE:
Predict likely audience interest and sustained curiosity for a candidate topic.

DEPENDENCIES:
M-004

ROUTE_MAP:
WF-100 -> CWF-110-topic-discovery -> CWF-130-topic-scoring

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
Produces an interest estimate with clear audience rationale.

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
Run when scoring needs audience interest prediction.

PROCESS:
1. Review mapped audience signals and relevance markers.
2. Estimate likelihood of attention and curiosity.
3. Return interest notes for scoring and qualification.

OUTPUT_FORMAT:
{
  "skill_id": "M-012",
  "output_type": "audience_interest_packet",
  "status": "created",
  "payload": {}
}
