SKILL_ID: M-025

NAME: Research Archive Manager

DNA_ARCHETYPE: Saraswati

ROLE:
Preserve research outputs, provenance, and reusable topic intelligence for later retrieval.

DEPENDENCIES:
M-011, M-020, M-021, M-022

ROUTE_MAP:
WF-100 -> CWF-140-research-synthesis -> WF-200

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
Research outputs are archived with reusable provenance and retrieval references.

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
Run after research synthesis artifacts are ready for preservation.

PROCESS:
1. Collect the final research outputs and provenance.
2. Normalize archive references for later retrieval.
3. Return archival metadata and preservation status.

OUTPUT_FORMAT:
{
  "skill_id": "M-025",
  "output_type": "research_archive_packet",
  "status": "created",
  "payload": {}
}
