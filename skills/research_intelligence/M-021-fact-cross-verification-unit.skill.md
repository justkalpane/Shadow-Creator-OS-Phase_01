SKILL_ID: M-021

NAME: Fact Cross-Verification Unit

DNA_ARCHETYPE: Durga

ROLE:
Cross-check research claims across sources and flag contradictions or uncertainty.

DEPENDENCIES:
M-010, M-011

ROUTE_MAP:
WF-100 -> CWF-140-research-synthesis -> WF-200

APPROVAL_GATE:
Yama

VETO_POWER:
yes

IMMUNE_SIGNATURE:
Each high-value claim is either supported, uncertain, or contradicted.

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
Run when claims require cross-source verification before promotion.

PROCESS:
1. Compare claims across validated source material.
2. Flag support, contradiction, or uncertainty.
3. Return cross-verification results for synthesis.

OUTPUT_FORMAT:
{
  "skill_id": "M-021",
  "output_type": "fact_verification_packet",
  "status": "created",
  "payload": {}
}
