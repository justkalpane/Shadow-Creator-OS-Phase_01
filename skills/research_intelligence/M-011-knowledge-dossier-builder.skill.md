SKILL_ID: M-011

NAME: Knowledge Dossier Builder

DNA_ARCHETYPE: Vyasa

ROLE:
Build a coherent research dossier from validated source material.

DEPENDENCIES:
M-009, M-010

ROUTE_MAP:
WF-100 -> CWF-140-research-synthesis -> WF-200

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
Produces a structured research dossier with bounded provenance.

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
Run when validated source material must be organized into a usable research base.

PROCESS:
1. Organize validated source findings into sections.
2. Attach provenance to claims and observations.
3. Return a research-ready dossier structure.

OUTPUT_FORMAT:
{
  "skill_id": "M-011",
  "output_type": "knowledge_dossier_packet",
  "status": "created",
  "payload": {}
}
