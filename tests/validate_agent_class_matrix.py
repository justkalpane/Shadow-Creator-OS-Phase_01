from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from agents.common.director_authority_profiles import get_director_profile


REGISTRY_PATH = ROOT / "agents" / "AGENT_RUNTIME_REGISTRY.yaml"
MATRIX_PATH = ROOT / "registries" / "agent_class_matrix.json"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _parse_registry_agent_files(path: Path) -> list[str]:
    _assert(path.exists(), f"Missing registry file: {path}")
    files: list[str] = []
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if line.startswith("- file:"):
            files.append(line.split(":", 1)[1].strip())
    return files


def _import_module_from_path(path: Path, module_name: str):
    spec = importlib.util.spec_from_file_location(module_name, path)
    _assert(spec is not None and spec.loader is not None, f"Unable to load spec for {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main() -> None:
    _assert(MATRIX_PATH.exists(), f"Missing agent class matrix registry: {MATRIX_PATH}")
    matrix = json.loads(MATRIX_PATH.read_text(encoding="utf-8"))

    _assert(isinstance(matrix, dict), "Agent class matrix must be a JSON object.")
    _assert(matrix.get("matrix_name") == "agent_class_matrix", "Unexpected matrix name.")
    _assert(matrix.get("schema_version") == "1.0.0", "Unexpected matrix schema version.")
    _assert(matrix.get("source_registry") == "agents/AGENT_RUNTIME_REGISTRY.yaml", "Unexpected source registry.")
    entries = matrix.get("entries")
    _assert(isinstance(entries, list) and entries, "Agent class matrix entries must be a non-empty list.")
    _assert(matrix.get("total_agents") == len(entries), "Matrix total_agents does not match entries length.")

    registry_files = _parse_registry_agent_files(REGISTRY_PATH)
    _assert(len(registry_files) == len(entries), "Matrix entry count does not match runtime registry count.")

    registry_set = set(registry_files)
    matrix_paths = {entry.get("registry_path") for entry in entries}
    _assert(matrix_paths == registry_set, "Matrix registry paths do not match AGENT_RUNTIME_REGISTRY entries.")

    seen_slugs: set[str] = set()
    seen_classes: set[str] = set()
    family_counts: dict[str, int] = {}

    required_keys = {
        "agent_slug",
        "agent_class",
        "registry_path",
        "class_family",
        "director_binding",
        "director_id",
        "council",
        "role",
        "authority_mode",
        "can_veto",
        "release_blocking",
        "skill_bindings",
        "escalation_workflow",
        "artifact_family",
        "runtime_base",
        "binding_runtime_check",
    }

    for entry in entries:
        _assert(isinstance(entry, dict), "Matrix entry must be a dictionary.")
        missing = sorted(required_keys - set(entry.keys()))
        _assert(not missing, f"Matrix entry missing keys: {missing}")

        agent_slug = entry["agent_slug"]
        agent_class = entry["agent_class"]
        registry_path = entry["registry_path"]
        _assert(agent_slug not in seen_slugs, f"Duplicate matrix agent_slug: {agent_slug}")
        _assert(agent_class not in seen_classes, f"Duplicate matrix agent_class: {agent_class}")
        seen_slugs.add(agent_slug)
        seen_classes.add(agent_class)
        family_counts[entry["class_family"]] = family_counts.get(entry["class_family"], 0) + 1

        full_path = ROOT / registry_path
        _assert(full_path.exists(), f"Matrix references missing agent file: {registry_path}")

        module = _import_module_from_path(full_path, f"matrix_{agent_slug}_module")
        _assert(hasattr(module, agent_class), f"Missing runtime class {agent_class} in {registry_path}")
        klass = getattr(module, agent_class)
        agent = klass()
        result = agent.run({"dossier_id": "MATRIX-DOSSIER", "route_id": "ROUTE_PHASE1_STANDARD"})
        _assert(isinstance(result, dict), f"run() must return dict for {agent_class}")
        required_run_keys = {"status", "artifact_family", "producer_agent", "governance", "payload"}
        _assert(required_run_keys.issubset(result.keys()), f"run() output missing required keys for {agent_class}")
        _assert(result["producer_agent"].endswith("_agent"), f"Producer agent contract mismatch for {agent_class}")

        _assert(full_path.parent.name == agent_slug, f"Agent slug mismatch for {registry_path}")
        profile = get_director_profile(entry["director_binding"])
        for key in [
            "director_id",
            "council",
            "role",
            "authority_mode",
            "can_veto",
            "release_blocking",
            "skill_bindings",
            "escalation_workflow",
        ]:
            _assert(entry[key] == profile.get(key), f"Matrix field mismatch for {agent_class}: {key}")
        _assert(entry["artifact_family"] == result["artifact_family"], f"Artifact family mismatch for {agent_class}")
        _assert(entry["director_binding"] == result["governance"]["director_binding"], f"Director binding mismatch for {agent_class}")
        _assert(entry["authority_mode"] == result["governance"]["authority_mode"], f"Authority mode mismatch for {agent_class}")
        _assert(entry["can_veto"] == result["governance"]["can_veto"], f"Veto flag mismatch for {agent_class}")
        _assert(entry["release_blocking"] == result["governance"]["release_blocking"], f"Release-blocking mismatch for {agent_class}")
        _assert(
            entry["binding_runtime_check"] == ("ProductionAgentBase" if entry["runtime_base"] == "ProductionAgentBase" else "custom"),
            f"Runtime base marker mismatch for {agent_class}",
        )

    expected_family_counts = {
        "named_director": 32,
        "control_plane": 5,
        "evolution": 5,
        "governance": 10,
        "kernel": 12,
        "media": 20,
        "plugin_runtime": 4,
        "recovery": 8,
        "research": 18,
    }
    _assert(family_counts == expected_family_counts, f"Unexpected agent family counts: {family_counts}")

    print(f"Validated agent class matrix with {len(entries)} entries successfully.")


if __name__ == "__main__":
    main()
