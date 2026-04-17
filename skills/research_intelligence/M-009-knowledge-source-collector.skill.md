SKILL_ID: M-009

NAME: Knowledge Source Collector

DNA_ARCHETYPE: Vyasa

ROLE:
Collect the initial body of relevant sources for the selected topic.

DEPENDENCIES:
M-024

ROUTE_MAP:
WF-100 -> CWF-140-research-synthesis -> WF-200

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
Returns at least one usable source set tied to the selected topic.

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
Run when the selected topic is ready for research assembly.

PROCESS:
1. Gather relevant sources and references.
2. Normalize source metadata.
3. Return the research source collection.

OUTPUT_FORMAT:
{
  "skill_id": "M-009",
  "output_type": "source_collection_packet",
  "status": "created",
  "payload": {}
}
