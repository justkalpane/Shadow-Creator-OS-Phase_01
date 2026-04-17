SKILL_ID: M-014

NAME: Comment Sentiment Analyzer

DNA_ARCHETYPE: Chandra

ROLE:
Extract audience sentiment and response tone from conversational signals around the topic.

DEPENDENCIES:
M-004

ROUTE_MAP:
WF-100 -> CWF-110-topic-discovery -> CWF-120-topic-qualification

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
Returns sentiment clusters with at least one actionable audience insight.

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
Run when conversational audience tone must be assessed.

PROCESS:
1. Review audience comment or reaction signals.
2. Classify supportive, resistant, or uncertain patterns.
3. Return sentiment insights for qualification and scoring.

OUTPUT_FORMAT:
{
  "skill_id": "M-014",
  "output_type": "audience_sentiment_packet",
  "status": "created",
  "payload": {}
}
