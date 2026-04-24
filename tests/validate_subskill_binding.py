from __future__ import annotations

import json
import sys
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from engine.hierarchical_runtime import HierarchicalRuntime


REGISTRY_PATH = ROOT / "registries" / "skill_registry.json"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def main() -> None:
    _assert(REGISTRY_PATH.exists(), "registries/skill_registry.json is missing.")
    payload = json.loads(REGISTRY_PATH.read_text(encoding="utf-8"))
    skills = payload.get("skills", [])
    _assert(isinstance(skills, list) and skills, "skill_registry.json has no skill entries.")

    seen: set[str] = set()
    for entry in skills:
        _assert(isinstance(entry, dict), "skill_registry.json contains non-object entries.")
        skill_id = str(entry.get("skill_id", "")).strip().lower()
        _assert(skill_id, "skill_registry.json contains blank skill_id.")
        _assert(skill_id not in seen, f"Duplicate skill entry: {skill_id}")
        seen.add(skill_id)
        sub_skills = entry.get("sub_skills", [])
        _assert(isinstance(sub_skills, list) and sub_skills, f"Skill has no sub-skills: {skill_id}")
        _assert(all(str(item).strip() for item in sub_skills), f"Skill has blank sub-skill ID: {skill_id}")

    runtime = HierarchicalRuntime()
    dossier_id = f"TEST-SUBSKILL-BINDING-{int(time.time())}"
    result = runtime.run_intent(
        "validate deterministic subskill binding",
        {
            "route_id": "ROUTE_PHASE1_STANDARD",
            "workflow_plan": ["WF-300"],
            "dossier_id": dossier_id,
            "payload": {
                "final_script_packet": {"packet_id": "FSP-TEST", "dossier_id": dossier_id, "status": "created"},
                "publish_ready_packet": {"packet_id": "PRP-TEST", "dossier_id": dossier_id, "status": "created"},
            },
        },
    )
    _assert(result.get("status") == "success", "Runtime execution failed during sub-skill binding validation.")
    executions = result.get("executions", [])
    _assert(executions, "No workflow executions emitted in sub-skill binding validation.")
    skill_trace = []
    for item in executions:
        trace = item.get("trace", {})
        candidate = trace.get("skills", [])
        if isinstance(candidate, list) and candidate:
            skill_trace = candidate
            break
    _assert(skill_trace, "No skills recorded in trace.")
    for item in skill_trace:
        bound = item.get("bound_subskills", [])
        _assert(isinstance(bound, list) and bound, f"Skill missing bound sub-skills in trace: {item.get('skill_id')}")

    print("Validated deterministic sub-skill binding successfully.")


if __name__ == "__main__":
    main()
