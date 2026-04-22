from __future__ import annotations

import importlib.util
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from agents.common.workflow_binding_contracts import WORKFLOW_BINDING_CONTRACTS

SUBSKILL_REGISTRY = ROOT / "registries" / "subskill_runtime_registry.yaml"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _import_module_from_path(path: Path, module_name: str):
    spec = importlib.util.spec_from_file_location(module_name, path)
    _assert(spec is not None and spec.loader is not None, f"Unable to load spec for {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _parse_subskill_registry(path: Path) -> list[dict[str, object]]:
    _assert(path.exists(), f"Missing sub-skill registry: {path}")
    entries: list[dict[str, object]] = []
    current: dict[str, object] | None = None
    in_consumers = False

    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.rstrip()
        stripped = line.strip()
        if stripped.startswith("- subskill_id:"):
            if current is not None:
                entries.append(current)
            current = {
                "subskill_id": stripped.split(":", 1)[1].strip(),
                "consumer_workflows": [],
            }
            in_consumers = False
            continue

        if current is None:
            continue

        if stripped.startswith("name:"):
            current["name"] = stripped.split(":", 1)[1].strip()
        elif stripped.startswith("spec_file:"):
            current["spec_file"] = stripped.split(":", 1)[1].strip()
        elif stripped.startswith("runtime_file:"):
            current["runtime_file"] = stripped.split(":", 1)[1].strip()
        elif stripped.startswith("consumer_workflows:"):
            in_consumers = True
        elif in_consumers and stripped.startswith("- "):
            current["consumer_workflows"].append(stripped[2:].strip())
        elif stripped and not stripped.startswith("#"):
            in_consumers = False

    if current is not None:
        entries.append(current)
    return entries


def _check_subskill_entry(entry: dict[str, object], workflow_ids: set[str]) -> None:
    subskill_id = str(entry.get("subskill_id", "")).strip()
    spec_file = str(entry.get("spec_file", "")).strip()
    runtime_file = str(entry.get("runtime_file", "")).strip()
    consumers = entry.get("consumer_workflows", [])

    _assert(subskill_id, "subskill_id missing in sub-skill registry entry")
    _assert(spec_file, f"spec_file missing for subskill_id={subskill_id}")
    _assert(runtime_file, f"runtime_file missing for subskill_id={subskill_id}")
    _assert(isinstance(consumers, list) and consumers, f"consumer_workflows missing for subskill_id={subskill_id}")

    spec_path = ROOT / spec_file
    runtime_path = ROOT / runtime_file
    _assert(spec_path.exists(), f"Missing sub-skill spec file: {spec_file}")
    _assert(runtime_path.exists(), f"Missing sub-skill runtime file: {runtime_file}")

    spec_text = spec_path.read_text(encoding="utf-8", errors="replace")
    for token in [
        "## SECTION 1: SKILL IDENTITY & OWNERSHIP",
        "## SECTION 2: AUTHORITY MATRIX",
        "## SECTION 3: READS (INPUT VEINS)",
        "## SECTION 4: WRITES (OUTPUT VEINS)",
        "## SECTION 5: EXECUTION FLOW & ALGORITHM",
        "## SECTION 6: SCORING FRAMEWORK",
        "## SECTION 7: BEST PRACTICES",
        "## SECTION 8: EXECUTION RULES & CONSTRAINTS",
        "## SECTION 9: FAILURE MODES & RECOVERY",
        "## SECTION 10: TOOL POLICY",
        "## SECTION 11: N8N + OLLAMA PLUGGABILITY",
        "## SECTION 12: VALIDATION & ACCEPTANCE",
    ]:
        _assert(token in spec_text, f"Sub-skill spec missing required section '{token}' in {spec_file}")
    _assert(subskill_id in spec_text, f"Sub-skill ID {subskill_id} not declared in {spec_file}")
    _assert("ollama_reasoning_injection: true" in spec_text, f"Ollama pluggability token missing in {spec_file}")
    _assert("n8n_consumer_workflows:" in spec_text, f"n8n workflow linkage token missing in {spec_file}")

    module = _import_module_from_path(runtime_path, f"subskill_{subskill_id.lower()}_runtime")
    _assert(hasattr(module, "run"), f"Runtime file missing run() function: {runtime_file}")
    result = module.run({"dossier_id": "TEST-DOSSIER", "input_payload": {"alpha": " beta "}})
    _assert(isinstance(result, dict), f"run() must return dict in {runtime_file}")
    required_keys = {"status", "artifact_family", "payload", "provider_execution_summary"}
    missing = sorted(k for k in required_keys if k not in result)
    _assert(not missing, f"run() output missing keys {missing} in {runtime_file}")
    _assert(result.get("status") == "success", f"run() did not succeed for {runtime_file}")

    for workflow_id in consumers:
        _assert(workflow_id in workflow_ids, f"Unknown consumer workflow_id '{workflow_id}' for {subskill_id}")


def main() -> None:
    workflow_ids = {str(v.get("workflow_id", "")).strip() for v in WORKFLOW_BINDING_CONTRACTS.values()}
    workflow_ids.discard("")
    _assert(workflow_ids, "No workflow IDs available from workflow binding contracts")

    entries = _parse_subskill_registry(SUBSKILL_REGISTRY)
    _assert(entries, "No sub-skill entries discovered in subskill_runtime_registry.yaml")

    ids = [str(e.get("subskill_id", "")).strip() for e in entries]
    _assert(len(ids) == len(set(ids)), "Duplicate subskill_id values found in subskill_runtime_registry.yaml")

    for entry in entries:
        _check_subskill_entry(entry, workflow_ids)

    print(f"Validated {len(entries)} sub-skill integration entries successfully.")


if __name__ == "__main__":
    main()
