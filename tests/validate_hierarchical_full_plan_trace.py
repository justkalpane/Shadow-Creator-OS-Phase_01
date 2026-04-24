from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from engine.hierarchical_runtime import HierarchicalRuntime, HierarchyResolver


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _norm(workflow_id: str) -> str:
    return str(workflow_id).strip().upper().replace("_", "-")


def main() -> None:
    runtime = HierarchicalRuntime()
    resolver = HierarchyResolver()

    plan = ["WF-100", "WF-200", "WF-300", "WF-400", "WF-500", "WF-600"]
    result = runtime.run_intent(
        "validate full hierarchical runtime trace",
        {
            "route_id": "ROUTE_PHASE1_STANDARD",
            "workflow_plan": plan,
            "dossier_id": "TEST-HIER-FULL",
            "payload": {
                "final_script_packet": {"packet_id": "FSP-TEST", "dossier_id": "TEST-HIER-FULL", "status": "created"},
                "publish_ready_packet": {"packet_id": "PRP-TEST", "dossier_id": "TEST-HIER-FULL", "status": "created"},
                "runtime_context": {"mode": "test"},
            },
        },
    )

    _assert(result.get("status") == "success", "Hierarchical full-plan execution failed.")
    executions = result.get("executions", [])
    _assert(isinstance(executions, list) and executions, "Missing execution trace entries.")

    expected_expanded = resolver.expand_workflow_plan(plan)
    observed = [_norm(item.get("workflow_id", "")) for item in executions]
    _assert(observed == expected_expanded, "Expanded workflow execution order mismatch.")

    for item in executions:
        _assert(item.get("status") == "success", f"Workflow failed in full trace: {item.get('workflow_id')}")
        trace = item.get("trace", {})
        resolution = trace.get("resolution", {})
        _assert(resolution.get("director"), f"Missing director resolution for {item.get('workflow_id')}")
        _assert(isinstance(resolution.get("agent"), dict), f"Missing agent resolution for {item.get('workflow_id')}")
        _assert(isinstance(resolution.get("sub_agent"), dict), f"Missing sub-agent resolution for {item.get('workflow_id')}")

        skills = trace.get("skills", [])
        _assert(isinstance(skills, list), f"Invalid skill trace shape for {item.get('workflow_id')}")
        for skill_item in skills:
            _assert("bound_subskills" in skill_item, f"Missing skill->subskill binding trace for {item.get('workflow_id')}")
            result_block = skill_item.get("result", {})
            _assert(isinstance(result_block, dict), f"Invalid skill result block for {item.get('workflow_id')}")
            _assert(result_block.get("status") == "success", f"Skill failed for {item.get('workflow_id')}: {skill_item.get('skill_id')}")

        subskills = trace.get("subskills", [])
        _assert(isinstance(subskills, list), f"Invalid sub-skill trace shape for {item.get('workflow_id')}")
        for subskill_item in subskills:
            subskill_result = subskill_item.get("result", {})
            _assert(isinstance(subskill_result, dict), f"Invalid sub-skill result block for {item.get('workflow_id')}")
            _assert(subskill_result.get("status") == "success", f"Sub-skill failed for {item.get('workflow_id')}: {subskill_item.get('subskill_id')}")

    print("Validated strict hierarchical WF-100->WF-600 execution traces successfully.")


if __name__ == "__main__":
    main()
