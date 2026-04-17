SKILL_ID: M-024

NAME: Topic Finalization Engine

DNA_ARCHETYPE: Krishna

ROLE:
Select the final promotable topic from the scored shortlist and package it for research synthesis.

DEPENDENCIES:
M-008, M-023

ROUTE_MAP:
WF-100 -> CWF-130-topic-scoring -> CWF-140-research-synthesis

APPROVAL_GATE:
Krishna

VETO_POWER:
yes

IMMUNE_SIGNATURE:
Only one final selected topic is emitted with explicit promotion rationale.

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
Run after scorecard generation when a final topic must be promoted.

PROCESS:
1. Review shortlist ranking, risk, and strategic fit.
2. Select the promotable final topic.
3. Emit a finalization packet for research synthesis.

OUTPUT_FORMAT:
{
  "skill_id": "M-024",
  "output_type": "topic_finalization_packet",
  "status": "created",
  "payload": {}
}
