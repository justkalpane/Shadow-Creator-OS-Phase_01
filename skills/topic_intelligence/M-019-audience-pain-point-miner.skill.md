SKILL_ID: M-019

NAME: Audience Pain-Point Miner

DNA_ARCHETYPE: Chandra

ROLE:
Surface the most relevant frustrations, needs, and unresolved audience tensions tied to the topic.

DEPENDENCIES:
M-004, M-014

ROUTE_MAP:
WF-100 -> CWF-110-topic-discovery -> CWF-130-topic-scoring

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
Returns at least one audience pain-point cluster linked to topic relevance.

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
Run when discovery or scoring needs audience pain alignment.

PROCESS:
1. Review audience reaction and demographic evidence.
2. Extract recurring pains, needs, or unresolved tensions.
3. Return pain-point clusters for topic scoring.

OUTPUT_FORMAT:
{
  "skill_id": "M-019",
  "output_type": "audience_pain_packet",
  "status": "created",
  "payload": {}
}
