SKILL_ID: M-022

NAME: Knowledge Graph Builder

DNA_ARCHETYPE: Saraswati

ROLE:
Link entities, claims, and relationships into a structured knowledge map for the topic.

DEPENDENCIES:
M-011, M-021

ROUTE_MAP:
WF-100 -> CWF-140-research-synthesis -> WF-200

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
Relationships between entities and claims are represented clearly enough for downstream use.

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
Run when synthesis needs structured relationship mapping.

PROCESS:
1. Identify major entities, claims, and links.
2. Build a simple knowledge map of relationships.
3. Return graph-ready structure for synthesis and later reuse.

OUTPUT_FORMAT:
{
  "skill_id": "M-022",
  "output_type": "knowledge_graph_packet",
  "status": "created",
  "payload": {}
}
