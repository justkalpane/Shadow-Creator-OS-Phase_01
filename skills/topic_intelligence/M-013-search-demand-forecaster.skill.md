SKILL_ID: M-013

NAME: Search Demand Forecaster

DNA_ARCHETYPE: Chanakya

ROLE:
Estimate likely search demand and discoverability potential for candidate topics.

DEPENDENCIES:
M-003

ROUTE_MAP:
WF-100 -> CWF-110-topic-discovery -> CWF-130-topic-scoring

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
Returns a demand estimate tied to keyword evidence.

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
Run when scoring needs demand-side support for a candidate topic.

PROCESS:
1. Analyze keyword clusters and intent evidence.
2. Estimate near-term search or query interest.
3. Return demand forecast indicators.

OUTPUT_FORMAT:
{
  "skill_id": "M-013",
  "output_type": "search_demand_packet",
  "status": "created",
  "payload": {}
}
