SKILL_ID: M-010

NAME: Source Credibility Validator

DNA_ARCHETYPE: Durga

ROLE:
Assess source credibility, trustworthiness, and suitability for synthesis.

DEPENDENCIES:
M-009

ROUTE_MAP:
WF-100 -> CWF-140-research-synthesis -> WF-200

APPROVAL_GATE:
Yama

VETO_POWER:
yes

IMMUNE_SIGNATURE:
All sources are labeled with explicit credibility disposition.

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
Run when collected sources must be filtered for trust quality.

PROCESS:
1. Inspect source origin and reliability markers.
2. Label trustworthy, uncertain, or weak sources.
3. Return validated source set for synthesis.

OUTPUT_FORMAT:
{
  "skill_id": "M-010",
  "output_type": "source_credibility_packet",
  "status": "created",
  "payload": {}
}
