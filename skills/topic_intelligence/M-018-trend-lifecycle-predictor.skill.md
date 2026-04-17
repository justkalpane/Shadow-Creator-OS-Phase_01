SKILL_ID: M-018

NAME: Trend Lifecycle Predictor

DNA_ARCHETYPE: Narada

ROLE:
Estimate whether the trend is emerging, peaking, fading, or enduring.

DEPENDENCIES:
M-001, M-006, M-007

ROUTE_MAP:
WF-100 -> CWF-110-topic-discovery -> CWF-130-topic-scoring

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
Returns a lifecycle classification with forward-looking rationale.

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
Run when discovery and scoring need time-window evaluation.

PROCESS:
1. Compare signal age, acceleration, and saturation indicators.
2. Classify lifecycle phase.
3. Return lifecycle notes for ranking.

OUTPUT_FORMAT:
{
  "skill_id": "M-018",
  "output_type": "trend_lifecycle_packet",
  "status": "created",
  "payload": {}
}
