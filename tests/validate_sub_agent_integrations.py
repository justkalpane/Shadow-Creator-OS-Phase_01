from __future__ import annotations

import importlib.util
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from agents.common.workflow_binding_contracts import get_workflow_contract

SUB_AGENT_REGISTRY = ROOT / "sub_agents" / "SUB_AGENT_RUNTIME_REGISTRY.yaml"
WORKFLOW_ROOT = ROOT / "n8n" / "workflows"
MANIFEST_ROOT = ROOT / "n8n" / "manifests"


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


def _matches_workflow_artifact(file_name: str, workflow_id: str) -> bool:
    return file_name.startswith(f"{workflow_id}-")


def _assert_workflow_assets_exist(workflow_id: str) -> None:
    workflow_json_matches = [p for p in WORKFLOW_ROOT.glob("**/*.json") if _matches_workflow_artifact(p.name, workflow_id)]
    manifest_matches = [p for p in MANIFEST_ROOT.glob("*.yaml") if _matches_workflow_artifact(p.name, workflow_id)]
    _assert(workflow_json_matches, f"No workflow JSON found for {workflow_id}")
    _assert(manifest_matches, f"No workflow manifest found for {workflow_id}")


def _check_sub_agent_entry(rel_path: str) -> None:
    _assert(rel_path.startswith("sub_agents/"), f"Invalid sub-agent registry path: {rel_path}")
    parts = rel_path.split("/")
    _assert(len(parts) == 3, f"Sub-agent path must be sub_agents/<slug>/<file>: {rel_path}")
    _, slug, file_name = parts
    expected_file_name = f"{slug}_sub_agent.py"
    _assert(file_name == expected_file_name, f"Sub-agent filename mismatch for {slug}: {file_name}")

    full_path = ROOT.joinpath(*parts)
    _assert(full_path.exists(), f"Missing sub-agent file: {rel_path}")

    contract = get_workflow_contract(slug)
    _assert(
        contract.get("workflow_class") != "unknown",
        f"Missing workflow binding contract for sub-agent slug: {slug}",
    )
    workflow_id = str(contract.get("workflow_id", "")).strip()
    _assert(workflow_id, f"Workflow contract missing workflow_id for slug: {slug}")
    _assert_workflow_assets_exist(workflow_id)

    module = _import_module_from_path(full_path, f"sub_agent_{slug}_module")
    class_name = _camel_sub_agent_class(slug)
    _assert(hasattr(module, class_name), f"Missing class '{class_name}' in {rel_path}")
    klass = getattr(module, class_name)
    instance = klass()

    payload = {
        "dossier_id": "TEST-DOSSIER",
        "route_id": "ROUTE_PHASE1_STANDARD",
        "acting_director": contract.get("primary_director", "Krishna"),
        "release_candidate": True,
        "governance_ack": True,
    }
    for req in contract.get("required_inputs", []):
        payload[req] = {"placeholder": True}

    result = instance.run(payload)
    _assert(isinstance(result, dict), f"run() must return dict for {class_name}")
    required_keys = {"status", "artifact_family", "producer_agent", "governance", "payload"}
    missing = sorted(k for k in required_keys if k not in result)
    _assert(not missing, f"Sub-agent run() output missing keys {missing} for {class_name}")
    _assert(result.get("status") == "success", f"Sub-agent run() did not pass contract gates: {class_name}")


def main() -> None:
    entries = _parse_sub_agent_files(SUB_AGENT_REGISTRY)
    _assert(entries, "No sub-agent entries discovered in SUB_AGENT_RUNTIME_REGISTRY.yaml")
    _assert(len(entries) == len(set(entries)), "Duplicate entries found in SUB_AGENT_RUNTIME_REGISTRY.yaml")

    for entry in entries:
        _check_sub_agent_entry(entry)

    print(f"Validated {len(entries)} sub-agent integration entries successfully.")


if __name__ == "__main__":
    main()
