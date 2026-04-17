SKILL_ID: M-020

NAME: Knowledge Summarization Engine

DNA_ARCHETYPE: Vyasa

ROLE:
Summarize validated research into a concise script-ready synthesis.

DEPENDENCIES:
M-011

ROUTE_MAP:
WF-100 -> CWF-140-research-synthesis -> WF-200

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
Delivers a concise synthesis that preserves key evidence and nuance.

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
Run when a research dossier must be condensed into script-usable summary form.

PROCESS:
1. Distill validated findings into concise summary form.
2. Preserve key evidence-bearing insights.
3. Return synthesis text for downstream scripting.

OUTPUT_FORMAT:
{
  "skill_id": "M-020",
  "output_type": "knowledge_summary_packet",
  "status": "created",
  "payload": {}
}
