from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from agents.common.workflow_binding_contracts import get_workflow_contract


SUB_AGENT_REGISTRY = ROOT / "sub_agents" / "SUB_AGENT_RUNTIME_REGISTRY.yaml"
MATRIX_PATH = ROOT / "registries" / "sub_agent_matrix.json"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _parse_sub_agent_files(path: Path) -> list[str]:
    _assert(path.exists(), f"Missing sub-agent registry file: {path}")
    files: list[str] = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if line.startswith("- file:"):
            files.append(line.split(":", 1)[1].strip())
    return files


def _import_module_from_path(path: Path, module_name: str):
    spec = importlib.util.spec_from_file_location(module_name, path)
    _assert(spec is not None and spec.loader is not None, f"Unable to load spec for {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _camel_sub_agent_class(slug: str) -> str:
    return "".join(part.capitalize() for part in slug.split("_")) + "SubAgent"


def _expected_family(workflow_id: str) -> str:
    if workflow_id.startswith("CWF-"):
        mapping = {
            "110": "topic",
            "120": "topic",
            "130": "topic",
            "140": "topic",
            "210": "script",
            "220": "script",
            "230": "script",
            "240": "script",
            "310": "context",
            "320": "context",
            "330": "context",
            "340": "context",
            "410": "media",
            "420": "media",
            "430": "media",
            "440": "media",
            "510": "publishing",
            "520": "publishing",
            "530": "publishing",
            "610": "analytics",
            "620": "analytics",
            "630": "analytics",
        }
        return mapping[workflow_id.split("-", 1)[1]]
    if workflow_id in {"WF-000", "WF-001", "WF-010"}:
        return "system_foundation"
    if workflow_id in {"WF-020", "WF-021"}:
        return "governance"
    if workflow_id in {"WF-022", "WF-023"}:
        return "system_bridge"
    if workflow_id in {"WF-100", "WF-200", "WF-300", "WF-400", "WF-500", "WF-600"}:
        return "parent_pack"
    if workflow_id == "WF-900":
        return "system_error"
    raise AssertionError(f"Unexpected workflow id for family mapping: {workflow_id}")


def main() -> None:
    _assert(MATRIX_PATH.exists(), f"Missing sub-agent matrix registry: {MATRIX_PATH}")
    matrix = json.loads(MATRIX_PATH.read_text(encoding="utf-8"))
    _assert(isinstance(matrix, dict), "Sub-agent matrix must be a JSON object.")
    _assert(matrix.get("matrix_name") == "sub_agent_matrix", "Unexpected sub-agent matrix name.")
    _assert(matrix.get("schema_version") == "1.0.0", "Unexpected sub-agent matrix schema version.")
    _assert(matrix.get("source_registry") == "sub_agents/SUB_AGENT_RUNTIME_REGISTRY.yaml", "Unexpected source registry.")

    entries = matrix.get("entries")
    _assert(isinstance(entries, list) and entries, "Sub-agent matrix entries must be a non-empty list.")
    _assert(matrix.get("total_sub_agents") == len(entries), "Matrix total_sub_agents does not match entries length.")

    registry_files = _parse_sub_agent_files(SUB_AGENT_REGISTRY)
    _assert(len(registry_files) == len(entries), "Matrix entry count does not match sub-agent registry count.")
    _assert({entry.get("registry_path") for entry in entries} == set(registry_files), "Registry path mismatch.")

    required_keys = {
        "workflow_slug",
        "workflow_id",
        "workflow_name",
        "workflow_class",
        "workflow_family",
        "parent_pack",
        "primary_director",
        "supporting_directors",
        "governance_authority",
        "allowed_directors",
        "required_inputs",
        "route_bindings",
        "gate_rules",
        "registry_path",
        "sub_agent_class",
        "runtime_base",
        "artifact_family",
        "binding_runtime_check",
    }

    seen_slugs: set[str] = set()
    seen_workflow_ids: set[str] = set()
    family_counts: dict[str, int] = {}
    class_counts: dict[str, int] = {}

    for entry in entries:
        _assert(isinstance(entry, dict), "Sub-agent matrix entry must be a dictionary.")
        missing = sorted(required_keys - set(entry.keys()))
        _assert(not missing, f"Sub-agent matrix entry missing keys: {missing}")

        workflow_slug = entry["workflow_slug"]
        workflow_id = entry["workflow_id"]
        sub_agent_class = entry["sub_agent_class"]
        registry_path = entry["registry_path"]

        _assert(workflow_slug not in seen_slugs, f"Duplicate workflow_slug entry: {workflow_slug}")
        _assert(workflow_id not in seen_workflow_ids, f"Duplicate workflow_id entry: {workflow_id}")
        seen_slugs.add(workflow_slug)
        seen_workflow_ids.add(workflow_id)

        expected_family = _expected_family(workflow_id)
        _assert(entry["workflow_family"] == expected_family, f"Workflow family mismatch for {workflow_id}")

        family_counts[entry["workflow_family"]] = family_counts.get(entry["workflow_family"], 0) + 1
        class_counts[entry["workflow_class"]] = class_counts.get(entry["workflow_class"], 0) + 1

        contract = get_workflow_contract(workflow_slug)
        for key in [
            "workflow_id",
            "workflow_name",
            "workflow_class",
            "parent_pack",
            "primary_director",
            "supporting_directors",
            "governance_authority",
            "allowed_directors",
            "required_inputs",
            "route_bindings",
            "gate_rules",
        ]:
            _assert(entry[key] == contract.get(key), f"Matrix field mismatch for {workflow_id}: {key}")

        full_path = ROOT / registry_path
        _assert(full_path.exists(), f"Sub-agent file listed in matrix does not exist: {registry_path}")
        module = _import_module_from_path(full_path, f"sub_matrix_{workflow_slug}_module")
        _assert(hasattr(module, sub_agent_class), f"Missing class {sub_agent_class} in {registry_path}")
        klass = getattr(module, sub_agent_class)
        instance = klass()
        _assert(instance.__class__.__name__ == sub_agent_class, f"Runtime class mismatch for {workflow_id}")

        payload = {
            "dossier_id": "MATRIX-DOSSIER",
            "route_id": "ROUTE_PHASE1_STANDARD",
            "acting_director": contract.get("primary_director", "Krishna"),
            "release_candidate": True,
            "governance_ack": True,
        }
        for req in contract.get("required_inputs", []):
            payload[req] = {"placeholder": True}

        result = instance.run(payload)
        _assert(isinstance(result, dict), f"run() must return dict for {sub_agent_class}")
        required_run_keys = {"status", "artifact_family", "producer_agent", "governance", "payload"}
        _assert(required_run_keys.issubset(result.keys()), f"run() output missing required keys for {sub_agent_class}")
        _assert(result["status"] == "success", f"Sub-agent run must succeed for matrix validation: {sub_agent_class}")
        _assert(result["artifact_family"] == entry["artifact_family"], f"Artifact family mismatch for {workflow_id}")
        _assert(result["governance"]["director_binding"] == entry["primary_director"], f"Director binding mismatch for {workflow_id}")
        _assert(result["governance"]["policy_mode"] == "governance_safe", f"Policy mode mismatch for {workflow_id}")

        core_result = result["payload"]["core_result"]
        _assert(core_result["workflow_contract"]["workflow_id"] == workflow_id, f"Core workflow contract mismatch for {workflow_id}")
        _assert(core_result["acting_director"] == entry["primary_director"], f"Acting director mismatch for {workflow_id}")
        _assert(core_result["decision"]["decision"] == "approve", f"Decision mismatch for {workflow_id}")
        _assert(core_result["escalation_workflow"] is None, f"Unexpected escalation workflow for {workflow_id}")
        _assert(entry["runtime_base"] == "WorkflowSubAgentBase", f"Runtime base mismatch for {workflow_id}")
        _assert(entry["binding_runtime_check"] == "WorkflowSubAgentBase", f"Binding runtime check mismatch for {workflow_id}")

    expected_family_counts = {
        "system_foundation": 3,
        "governance": 2,
        "system_bridge": 2,
        "parent_pack": 6,
        "topic": 4,
        "script": 4,
        "context": 4,
        "media": 4,
        "publishing": 3,
        "analytics": 3,
        "system_error": 1,
    }
    _assert(family_counts == expected_family_counts, f"Unexpected sub-agent family counts: {family_counts}")

    expected_class_counts = {
        "child": 19,
        "child_workflow": 3,
        "system": 2,
        "parent": 2,
        "governance": 2,
        "system_bridge": 1,
        "planning": 1,
        "parent_pack": 6,
    }
    _assert(class_counts == expected_class_counts, f"Unexpected sub-agent workflow_class counts: {class_counts}")

    print(f"Validated sub-agent matrix with {len(entries)} entries successfully.")


if __name__ == "__main__":
    main()
