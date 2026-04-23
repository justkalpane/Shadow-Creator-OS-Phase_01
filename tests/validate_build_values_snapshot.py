from __future__ import annotations

import importlib.util
import json
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT_PATH = ROOT / "tmp_audit" / "build_values_snapshot.json"
GENERATOR_PATH = ROOT / "scripts" / "generate_build_values_snapshot.py"

if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _load_generator_module():
    spec = importlib.util.spec_from_file_location("generate_build_values_snapshot", GENERATOR_PATH)
    _assert(spec is not None and spec.loader is not None, f"Unable to load build values generator from {GENERATOR_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _normalize(snapshot: dict) -> dict:
    data = json.loads(json.dumps(snapshot))
    data["generated_at"] = "<normalized>"
    return data


def main() -> None:
    _assert(SNAPSHOT_PATH.exists(), f"Missing build values snapshot: {SNAPSHOT_PATH}")
    _assert(GENERATOR_PATH.exists(), f"Missing build values generator: {GENERATOR_PATH}")

    generator = _load_generator_module()
    generated_snapshot = generator.build_snapshot()
    current_snapshot = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))

    _assert(_normalize(current_snapshot) == _normalize(generated_snapshot), "Build values snapshot is out of sync with the generator output.")

    matrix_values = current_snapshot["matrix_values"]
    route_values = current_snapshot["route_values"]
    blocker_values = current_snapshot["blocker_values"]
    namespace_values = current_snapshot["route_namespace_values"]

    _assert(matrix_values["agent_total"] == 114, "Agent total must be 114.")
    _assert(matrix_values["sub_agent_total"] == 36, "Sub-agent total must be 36.")
    _assert(matrix_values["director_total"] == 32, "Director total must be 32.")
    _assert(route_values["route_count"] == 4, "Route count must be 4.")
    _assert(route_values["route_ids"] == ["ROUTE_PHASE1_FAST", "ROUTE_PHASE1_STANDARD", "ROUTE_PHASE1_REPLAY", "ROUTE_PHASE1_ANALYTICS"], "Route IDs must match canonical registry order.")
    _assert(route_values["route_ids_match"] is True, "Route registry and CSV route IDs must match.")
    _assert(blocker_values["blocker_count"] >= 1, "Blocker count must be present.")
    _assert("BB-019" not in blocker_values["open_blockers"], "BB-019 must not remain open.")
    _assert(namespace_values["canonical_namespace"] == "ROUTE_PHASE1_*", "Canonical route namespace must be ROUTE_PHASE1_*.")
    _assert(namespace_values["legacy_route_namespace_hits"] == [], "Legacy route namespace hits must be empty.")

    for fragment in [
        "unified_hierarchy_report.md",
        "route_registry_report.md",
        "audit_index.md",
    ]:
        _assert(current_snapshot["report_presence"][fragment.replace(".md", "")], f"Report presence missing: {fragment}")

    print("Validated build values snapshot successfully.")


if __name__ == "__main__":
    main()
