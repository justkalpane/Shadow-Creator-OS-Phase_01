from __future__ import annotations

import importlib.util
import json
import re
import runpy
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from agents.common.workflow_binding_contracts import get_workflow_contract


SUB_AGENT_ROOT = ROOT / "sub_agents"
REGISTRY_PATH = SUB_AGENT_ROOT / "SUB_AGENT_RUNTIME_REGISTRY.yaml"
MATRIX_PATH = ROOT / "registries" / "sub_agent_matrix.json"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _parse_registry_sub_agent_files(path: Path) -> list[str]:
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


def _extract(pattern: str, text: str, label: str, path: Path) -> str:
    match = re.search(pattern, text, flags=re.MULTILINE)
    _assert(match is not None, f"Unable to extract {label} from {path}")
    return match.group(1)


def _camel_sub_agent_class(slug: str) -> str:
    return "".join(part.capitalize() for part in slug.split("_")) + "SubAgent"


def _workflow_family(workflow_id: str) -> str:
    if workflow_id.startswith("CWF-"):
        prefix = workflow_id.split("-", 1)[1]
        family_map = {
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
        return family_map.get(prefix, "child_pack")
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
    return "unclassified"


def build_matrix() -> dict[str, Any]:
    registry_files = _parse_registry_sub_agent_files(REGISTRY_PATH)
    entries: list[dict[str, Any]] = []

    for rel in registry_files:
        path = ROOT / rel
        _assert(path.exists(), f"Missing sub-agent file listed in registry: {rel}")
        slug = path.parent.name
        text = path.read_text(encoding="utf-8", errors="replace")
        class_name = _extract(r"^class\s+([A-Za-z0-9_]+)\b", text, "class name", path)
        workflow_contract = get_workflow_contract(slug)
        workflow_id = str(workflow_contract.get("workflow_id", "")).strip()
        _assert(workflow_id, f"Missing workflow_id for sub-agent slug: {slug}")

        entries.append(
            {
                "workflow_slug": slug,
                "workflow_id": workflow_id,
                "workflow_name": workflow_contract.get("workflow_name"),
                "workflow_class": workflow_contract.get("workflow_class"),
                "workflow_family": _workflow_family(workflow_id),
                "parent_pack": workflow_contract.get("parent_pack"),
                "primary_director": workflow_contract.get("primary_director"),
                "supporting_directors": workflow_contract.get("supporting_directors"),
                "governance_authority": workflow_contract.get("governance_authority"),
                "allowed_directors": workflow_contract.get("allowed_directors"),
                "required_inputs": workflow_contract.get("required_inputs"),
                "route_bindings": workflow_contract.get("route_bindings"),
                "gate_rules": workflow_contract.get("gate_rules"),
                "registry_path": rel,
                "sub_agent_class": class_name,
                "runtime_base": "WorkflowSubAgentBase",
                "artifact_family": f"{slug}-sub-agent-packet",
                "binding_runtime_check": "WorkflowSubAgentBase",
            }
        )

    family_totals = dict(Counter(entry["workflow_family"] for entry in entries))
    class_totals = dict(Counter(entry["workflow_class"] for entry in entries))
    return {
        "matrix_name": "sub_agent_matrix",
        "schema_version": "1.0.0",
        "source_registry": "sub_agents/SUB_AGENT_RUNTIME_REGISTRY.yaml",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_sub_agents": len(entries),
        "family_totals": family_totals,
        "workflow_class_totals": class_totals,
        "entries": entries,
    }


def write_matrix(refresh_report: bool = True) -> None:
    matrix = build_matrix()
    MATRIX_PATH.parent.mkdir(parents=True, exist_ok=True)
    MATRIX_PATH.write_text(json.dumps(matrix, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    if refresh_report:
        runpy.run_path(str(ROOT / "scripts" / "generate_unified_hierarchy_report.py"), run_name="__main__")
    print(f"Wrote {len(matrix['entries'])} sub-agent matrix entries to {MATRIX_PATH}")


if __name__ == "__main__":
    write_matrix()
