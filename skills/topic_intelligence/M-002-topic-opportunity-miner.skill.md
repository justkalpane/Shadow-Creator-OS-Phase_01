SKILL_ID: M-002

NAME: Topic Opportunity Miner

DNA_ARCHETYPE: Narada

ROLE:
Turn raw trend and audience signals into candidate topic opportunities suitable for qualification.

DEPENDENCIES:
M-001

ROUTE_MAP:
WF-100 -> CWF-110-topic-discovery -> CWF-120-topic-qualification

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
Returns a candidate list with clear topic wording and signal rationale.

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
Run after enough signal material exists to derive topic opportunities.

PROCESS:
1. Group related signals into opportunity clusters.
2. Convert clusters into candidate topic statements.
3. Attach rationale and initial discovery metadata.

OUTPUT_FORMAT:
{
  "skill_id": "M-002",
  "output_type": "topic_opportunity_set",
  "status": "created",
  "payload": {}
}
