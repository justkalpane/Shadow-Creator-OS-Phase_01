SKILL_ID: M-001

NAME: Global Trend Scanner

DNA_ARCHETYPE: Narada

ROLE:
Scan broad trend landscapes across sources and surface emerging topic movement worth deeper discovery.

DEPENDENCIES:
none

ROUTE_MAP:
WF-100 -> CWF-110-topic-discovery -> CWF-120-topic-qualification

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
At least 3 distinct trend signals captured with source provenance.

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
Start when topic discovery begins and broad trend scanning is required.

PROCESS:
1. Scan available trend feeds and source families.
2. Extract recurrent or rising thematic signals.
3. Return normalized trend observations with provenance.

OUTPUT_FORMAT:
{
  "skill_id": "M-001",
  "output_type": "trend_signal_set",
  "status": "created",
  "payload": {}
}
