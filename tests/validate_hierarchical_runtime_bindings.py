from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from engine.hierarchical_runtime import HierarchyResolver


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    resolver = HierarchyResolver()

    _assert(resolver.skill_registry, "Skill registry is empty.")
    _assert(resolver.workflow_entries_by_id, "Workflow registry map is empty.")
    _assert(resolver.workflow_skill_codes, "Workflow->skill binding map is empty.")

    resolved = resolver.resolve_workflow("CWF-310")
    _assert(resolved["workflow_id"] == "CWF-310", "Workflow normalization mismatch for CWF-310.")
    _assert(resolved["director"] == "Krishna", "CWF-310 director must resolve to Krishna.")
    _assert(isinstance(resolved["agent"], dict), "CWF-310 did not resolve to an agent binding.")
    _assert(isinstance(resolved["sub_agent"], dict), "CWF-310 did not resolve to a sub-agent binding.")
    _assert("context_engineering.p_301_execution_context_engineer" in resolved["skills"], "CWF-310 skill binding missing P-301 runtime skill.")
    _assert(any(item["subskill_id"] == "SS-001" for item in resolved["subskills"]), "CWF-310 sub-skill binding missing SS-001.")

    execution = resolver.execute_workflow(
        "CWF-310",
        {
            "dossier_id": "TEST-HIERARCHY-CWF310",
            "route_id": "ROUTE_PHASE1_STANDARD",
            "intent": "validate hierarchy bindings",
            "final_script_packet": {"placeholder": True},
        },
    )
    _assert(execution["status"] == "success", f"CWF-310 hierarchical execution failed: {execution.get('failure_stage')}")
    _assert(isinstance(execution.get("trace", {}).get("skills"), list), "Skill trace missing in hierarchical execution.")
    _assert(isinstance(execution.get("trace", {}).get("subskills"), list), "Sub-skill trace missing in hierarchical execution.")

    print("Validated hierarchical runtime bindings and execution successfully.")


if __name__ == "__main__":
    main()
