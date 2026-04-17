SKILL_ID: M-008

NAME: Topic Viability Scorer

DNA_ARCHETYPE: Krishna

ROLE:
Score candidate topics against the Phase-1 viability model and determine shortlist strength.

DEPENDENCIES:
M-002, M-003, M-004, M-006, M-007

ROUTE_MAP:
WF-100 -> CWF-120-topic-qualification -> CWF-130-topic-scoring

APPROVAL_GATE:
Krishna

VETO_POWER:
yes

IMMUNE_SIGNATURE:
Every scored topic includes a measurable total score and rationale by dimension.

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
Run when qualified candidates need numerical viability scoring.

PROCESS:
1. Aggregate evidence from qualification and discovery outputs.
2. Score each candidate against weighted viability dimensions.
3. Return scored candidates with threshold outcome.

OUTPUT_FORMAT:
{
  "skill_id": "M-008",
  "output_type": "topic_viability_score_packet",
  "status": "created",
  "payload": {}
}
