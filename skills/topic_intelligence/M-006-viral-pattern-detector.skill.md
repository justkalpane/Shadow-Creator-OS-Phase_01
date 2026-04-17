SKILL_ID: M-006

NAME: Viral Pattern Detector

DNA_ARCHETYPE: Narada

ROLE:
Identify repeatable viral structures or momentum patterns linked to the topic candidate.

DEPENDENCIES:
M-001

ROUTE_MAP:
WF-100 -> CWF-110-topic-discovery -> CWF-130-topic-scoring

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
At least one viral pattern or replicable traction indicator identified.

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
Run when discovery needs virality and momentum pattern analysis.

PROCESS:
1. Review pattern-bearing signals and content motifs.
2. Detect repeated structures tied to traction.
3. Return viral-pattern notes for discovery and scoring.

OUTPUT_FORMAT:
{
  "skill_id": "M-006",
  "output_type": "viral_pattern_packet",
  "status": "created",
  "payload": {}
}
