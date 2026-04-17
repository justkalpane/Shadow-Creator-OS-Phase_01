SKILL_ID: M-023

NAME: Trend Risk Evaluator

DNA_ARCHETYPE: Chanakya

ROLE:
Measure downside risk, instability, and reversal potential in a candidate trend.

DEPENDENCIES:
M-018

ROUTE_MAP:
WF-100 -> CWF-120-topic-qualification -> CWF-130-topic-scoring

APPROVAL_GATE:
Kubera

VETO_POWER:
yes

IMMUNE_SIGNATURE:
Flags critical risk before a topic is promoted.

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
Run when qualification needs risk posture assessment.

PROCESS:
1. Review lifecycle instability and governance exposure.
2. Estimate reversal, volatility, or fragility risk.
3. Return risk grade and recommendation.

OUTPUT_FORMAT:
{
  "skill_id": "M-023",
  "output_type": "trend_risk_packet",
  "status": "created",
  "payload": {}
}
