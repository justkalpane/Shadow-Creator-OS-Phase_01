SKILL_ID: M-007

NAME: Algorithm Signal Monitor

DNA_ARCHETYPE: Narada

ROLE:
Track algorithm-facing distribution signals that may improve or weaken topic traction.

DEPENDENCIES:
M-001

ROUTE_MAP:
WF-100 -> CWF-110-topic-discovery -> CWF-130-topic-scoring

APPROVAL_GATE:
none

VETO_POWER:
no

IMMUNE_SIGNATURE:
Returns at least one platform-signal insight tied to topic discoverability.

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
Run when discovery or scoring needs algorithm-facing signal assessment.

PROCESS:
1. Review platform-distribution indicators from source inputs.
2. Detect whether the candidate aligns with active signal patterns.
3. Return algorithm-signal observations for scoring.

OUTPUT_FORMAT:
{
  "skill_id": "M-007",
  "output_type": "algorithm_signal_packet",
  "status": "created",
  "payload": {}
}
