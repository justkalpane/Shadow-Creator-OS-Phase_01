from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from agents.common.agent_class_matrix import iter_agent_class_entries
from agents.common.sub_agent_matrix import iter_sub_agent_entries


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _normalize_name(value: str) -> str:
    return value.strip()


def main() -> None:
    agent_entries = iter_agent_class_entries()
    sub_agent_entries = iter_sub_agent_entries()

    _assert(agent_entries, "Agent class matrix is empty.")
    _assert(sub_agent_entries, "Sub-agent matrix is empty.")

    agent_directors = {_normalize_name(entry["director_binding"]) for entry in agent_entries}
    sub_workflow_ids = set()
    sub_workflow_directors = set()
    secondary_directors = set()

    for entry in sub_agent_entries:
        sub_workflow_ids.add(str(entry["workflow_id"]))
        primary = _normalize_name(str(entry["primary_director"]))
        sub_workflow_directors.add(primary)
        secondary_directors.update(_normalize_name(value) for value in entry.get("allowed_directors", []))
        secondary_directors.update(_normalize_name(value) for value in entry.get("governance_authority", []))
        secondary_directors.update(_normalize_name(value) for value in entry.get("supporting_directors", []))

    missing_directors = sorted(d for d in sub_workflow_directors if d not in agent_directors)
    _assert(
        not missing_directors,
        f"Sub-agent primary directors missing from agent matrix: {missing_directors}",
    )

    orphan_secondary_directors = sorted(d for d in secondary_directors if d not in agent_directors)

    escalation_workflows = {
        str(entry["escalation_workflow"])
        for entry in agent_entries
        if entry.get("escalation_workflow")
    }
    missing_escalations = sorted(wf for wf in escalation_workflows if wf not in sub_workflow_ids)
    _assert(
        not missing_escalations,
        f"Agent matrix escalation workflows missing from sub-agent matrix: {missing_escalations}",
    )

    agent_director_counts: dict[str, int] = {}
    for entry in agent_entries:
        director = _normalize_name(str(entry["director_binding"]))
        agent_director_counts[director] = agent_director_counts.get(director, 0) + 1

    routed_director_counts: dict[str, int] = {}
    for director in sub_workflow_directors:
        routed_director_counts[director] = routed_director_counts.get(director, 0) + 1

    uncovered_directors = sorted(
        director for director in routed_director_counts if director not in agent_director_counts
    )
    _assert(not uncovered_directors, f"Workflow-directed sub-agents lack agent coverage: {uncovered_directors}")

    expected_root_workflows = {"WF-000", "WF-001", "WF-010", "WF-020", "WF-021", "WF-022", "WF-023", "WF-100", "WF-200", "WF-300", "WF-400", "WF-500", "WF-600", "WF-900"}
    missing_root_workflows = sorted(wf for wf in expected_root_workflows if wf not in sub_workflow_ids)
    _assert(
        not missing_root_workflows,
        f"Sub-agent matrix missing canonical root workflows: {missing_root_workflows}",
    )

    print(
        "Validated cross-matrix routing consistency successfully: "
        f"{len(agent_entries)} agents, {len(sub_agent_entries)} sub-agents, "
        f"{len(agent_directors)} agent directors, {len(sub_workflow_directors)} primary routed directors."
    )
    if orphan_secondary_directors:
        print(
            "Secondary routing directors are not represented in agent runtime estate "
            f"(informational only): {orphan_secondary_directors}"
        )


if __name__ == "__main__":
    main()
