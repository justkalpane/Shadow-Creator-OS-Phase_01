from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from agents.common.agent_class_matrix import iter_agent_class_entries
from agents.common.director_authority_profiles import DIRECTOR_AUTHORITY_PROFILES, get_director_profile
from agents.common.sub_agent_matrix import iter_sub_agent_entries
from agents.common.workflow_binding_contracts import WORKFLOW_BINDING_CONTRACTS


MATRIX_PATH = ROOT / "registries" / "director_binding_matrix.json"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _import_module_from_path(path: Path, module_name: str):
    spec = importlib.util.spec_from_file_location(module_name, path)
    _assert(spec is not None and spec.loader is not None, f"Unable to load spec for {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main() -> None:
    _assert(MATRIX_PATH.exists(), f"Missing director binding matrix registry: {MATRIX_PATH}")
    matrix = json.loads(MATRIX_PATH.read_text(encoding="utf-8"))
    _assert(isinstance(matrix, dict), "Director binding matrix must be a JSON object.")
    _assert(matrix.get("matrix_name") == "director_binding_matrix", "Unexpected matrix name.")
    _assert(matrix.get("schema_version") == "1.0.0", "Unexpected matrix schema version.")
    entries = matrix.get("entries")
    _assert(isinstance(entries, list) and entries, "Director binding matrix entries must be a non-empty list.")

    required_keys = {
        "director_name",
        "director_id",
        "council",
        "role",
        "authority_mode",
        "can_veto",
        "release_blocking",
        "escalation_workflow",
        "agent_runtime_count",
        "sub_agent_primary_count",
        "workflow_primary_count",
        "workflow_support_count",
        "workflow_primary_ids",
        "workflow_support_ids",
        "binding_source_packs",
        "binding_targets",
        "coverage_state",
    }

    agent_directors = {entry["director_binding"] for entry in iter_agent_class_entries()}
    sub_agent_directors = {entry["primary_director"] for entry in iter_sub_agent_entries()}
    workflow_primary_directors = {str(contract.get("primary_director")) for contract in WORKFLOW_BINDING_CONTRACTS.values()}
    workflow_support_directors = {
        str(director)
        for contract in WORKFLOW_BINDING_CONTRACTS.values()
        for director in (contract.get("supporting_directors", []) + contract.get("governance_authority", []))
    }
    expected_directors = (
        {profile["director_name"] for profile in DIRECTOR_AUTHORITY_PROFILES.values()}
        | agent_directors
        | sub_agent_directors
        | workflow_primary_directors
        | workflow_support_directors
    )
    matrix_directors = {entry["director_name"] for entry in entries}
    _assert(matrix_directors == expected_directors, f"Director binding matrix director coverage mismatch: {sorted(expected_directors ^ matrix_directors)}")

    for entry in entries:
        _assert(isinstance(entry, dict), "Matrix entry must be a dictionary.")
        missing = sorted(required_keys - set(entry.keys()))
        _assert(not missing, f"Director binding matrix entry missing keys: {missing}")
        profile = get_director_profile(entry["director_name"])
        for key in ["director_id", "council", "role", "authority_mode", "can_veto", "release_blocking", "escalation_workflow"]:
            _assert(entry[key] == profile.get(key), f"Profile mismatch for {entry['director_name']}: {key}")
        _assert(entry["agent_runtime_count"] >= 0, "Agent runtime count must be non-negative.")
        _assert(entry["sub_agent_primary_count"] >= 0, "Sub-agent count must be non-negative.")
        _assert(entry["workflow_primary_count"] >= 0, "Workflow primary count must be non-negative.")
        _assert(entry["workflow_support_count"] >= 0, "Workflow support count must be non-negative.")
        _assert(entry["coverage_state"] in {"covered", "uncovered"}, "Invalid coverage state.")

    count_map = {entry["director_name"]: entry for entry in entries}
    _assert(count_map["Krishna"]["workflow_primary_count"] >= 1, "Krishna must own at least one workflow.")
    _assert(count_map["Chandra"]["agent_runtime_count"] >= 1, "Chandra must have agent coverage.")
    _assert(count_map["Chitragupta"]["agent_runtime_count"] >= 1, "Chitragupta must have agent coverage.")
    _assert(count_map["Chandra"]["workflow_primary_count"] >= 1, "Chandra must own analytics workflows.")
    _assert("WF-600" in count_map["Chandra"]["binding_source_packs"], "Chandra must be bound to WF-600.")
    _assert("WF-600" in count_map["Chitragupta"]["binding_source_packs"], "Chitragupta must be bound to WF-600.")

    print(f"Validated director binding matrix with {len(entries)} entries successfully.")


if __name__ == "__main__":
    main()
