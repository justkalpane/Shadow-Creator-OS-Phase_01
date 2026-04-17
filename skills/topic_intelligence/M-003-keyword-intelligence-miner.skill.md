SKILL_ID: M-003

NAME: Keyword Intelligence Miner

DNA_ARCHETYPE: Chanakya

ROLE:
Extract keyword and search-intent patterns that support or weaken topic opportunities.

DEPENDENCIES:
M-001

ROUTE_MAP:
WF-100 -> CWF-110-topic-discovery -> CWF-130-topic-scoring

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
Returns keyword clusters tied to discoverable audience intent.

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
Run when topic discovery needs keyword demand evidence.

PROCESS:
1. Expand keywords from topic seeds and signal phrases.
2. Group by search intent and demand relevance.
3. Return keyword clusters for downstream scoring.

OUTPUT_FORMAT:
{
  "skill_id": "M-003",
  "output_type": "keyword_intelligence_packet",
  "status": "created",
  "payload": {}
}
