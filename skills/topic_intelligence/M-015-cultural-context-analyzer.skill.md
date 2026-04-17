SKILL_ID: M-015

NAME: Cultural Context Analyzer

DNA_ARCHETYPE: Saraswati

ROLE:
Assess cultural framing, sensitivity, and contextual interpretation risks for a topic.

DEPENDENCIES:
M-004

ROUTE_MAP:
WF-100 -> CWF-120-topic-qualification -> CWF-130-topic-scoring

APPROVAL_GATE:
Yama

VETO_POWER:
yes

IMMUNE_SIGNATURE:
Flags cultural sensitivity risk before promotion to scoring.

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
Run when a topic requires contextual and sensitivity review.

PROCESS:
1. Inspect cultural context and likely interpretation.
2. Identify sensitivity or framing risks.
3. Return contextual guidance and risk notes.

OUTPUT_FORMAT:
{
  "skill_id": "M-015",
  "output_type": "cultural_context_packet",
  "status": "created",
  "payload": {}
}
