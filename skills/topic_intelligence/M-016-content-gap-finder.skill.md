SKILL_ID: M-016

NAME: Content Gap Finder

DNA_ARCHETYPE: Chanakya

ROLE:
Detect exploitable whitespace between audience demand and existing content supply.

DEPENDENCIES:
M-002, M-003

ROUTE_MAP:
WF-100 -> CWF-110-topic-discovery -> CWF-120-topic-qualification

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
Returns at least one concrete content-gap signal tied to the candidate topic.

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
Run when qualification or scoring needs whitespace analysis.

PROCESS:
1. Compare known topic angles against existing content patterns.
2. Identify missing or under-served angles.
3. Return gap findings for ranking and finalization.

OUTPUT_FORMAT:
{
  "skill_id": "M-016",
  "output_type": "content_gap_packet",
  "status": "created",
  "payload": {}
}
