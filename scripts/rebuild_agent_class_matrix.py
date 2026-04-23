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

from agents.common.director_authority_profiles import get_director_profile


AGENTS_ROOT = ROOT / "agents"
REGISTRY_PATH = AGENTS_ROOT / "AGENT_RUNTIME_REGISTRY.yaml"
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


def _load_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def _extract(pattern: str, text: str, label: str, path: Path) -> str:
    match = re.search(pattern, text, flags=re.MULTILINE)
    _assert(match is not None, f"Unable to extract {label} from {path}")
    return match.group(1)


def _extract_first(text: str, path: Path, label: str, patterns: list[str]) -> str:
    for pattern in patterns:
        match = re.search(pattern, text, flags=re.MULTILINE)
        if match is not None:
            return match.group(1)
    raise AssertionError(f"Unable to extract {label} from {path}")


def _import_module_from_path(path: Path, module_name: str):
    spec = importlib.util.spec_from_file_location(module_name, path)
    _assert(spec is not None and spec.loader is not None, f"Unable to load spec for {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _class_family(agent_slug: str) -> str:
    if agent_slug in {
        "agastya",
        "agni",
        "arjuna",
        "aruna",
        "brahma",
        "chanakya",
        "chandra",
        "chitragupta",
        "durga",
        "ganesha",
        "garuda",
        "hanuman",
        "indra",
        "kama",
        "krishna",
        "kubera",
        "maya",
        "narada",
        "nataraja",
        "parashara",
        "ravana",
        "saraswati",
        "shakti",
        "shiva",
        "tumburu",
        "valmiki",
        "varuna",
        "vishnu",
        "vishwakarma",
        "vyasa",
        "yama",
        "yudhishthira",
    }:
        return "named_director"
    if agent_slug.startswith("agent_control_plane_"):
        return "control_plane"
    if agent_slug.startswith("agent_evolution_"):
        return "evolution"
    if agent_slug.startswith("agent_governance_"):
        return "governance"
    if agent_slug.startswith("agent_kernel_"):
        return "kernel"
    if agent_slug.startswith("agent_media_"):
        return "media"
    if agent_slug.startswith("agent_plugin_runtime_"):
        return "plugin_runtime"
    if agent_slug.startswith("agent_recovery_"):
        return "recovery"
    if agent_slug.startswith("agent_research_"):
        return "research"
    return "unclassified"


def _runtime_base(text: str) -> str:
    return "ProductionAgentBase" if "ProductionAgentBase" in text else "custom_director_runtime"


def build_matrix() -> dict[str, Any]:
    registry_files = _parse_registry_agent_files(REGISTRY_PATH)
    entries: list[dict[str, Any]] = []

    for rel in registry_files:
        path = ROOT / rel
        _assert(path.exists(), f"Missing agent file listed in registry: {rel}")
        agent_slug = path.parent.name
        text = _load_text(path)
        class_name = _extract(r"^class\s+([A-Za-z0-9_]+)\b", text, "class name", path)
        director_binding = _extract_first(
            text,
            path,
            "director binding",
            [
                r'director_binding="([^"]+)"',
                r'get_director_profile\("([^"]+)"\)',
            ],
        )
        artifact_family = _extract_first(
            text,
            path,
            "artifact family",
            [
                r'artifact_family="([^"]+)"',
                r'["\']artifact_family["\']:\s*["\']([^"\']+)["\']',
            ],
        )
        profile = get_director_profile(director_binding)

        entries.append(
            {
                "agent_slug": agent_slug,
                "agent_class": class_name,
                "registry_path": rel,
                "class_family": _class_family(agent_slug),
                "director_binding": director_binding,
                "director_id": profile.get("director_id"),
                "council": profile.get("council"),
                "role": profile.get("role"),
                "authority_mode": profile.get("authority_mode"),
                "can_veto": profile.get("can_veto"),
                "release_blocking": profile.get("release_blocking"),
                "skill_bindings": profile.get("skill_bindings"),
                "escalation_workflow": profile.get("escalation_workflow"),
                "artifact_family": artifact_family,
                "runtime_base": _runtime_base(text),
                "binding_runtime_check": "ProductionAgentBase" if "ProductionAgentBase" in text else "custom",
            }
        )

    family_totals = dict(Counter(entry["class_family"] for entry in entries))
    return {
        "matrix_name": "agent_class_matrix",
        "schema_version": "1.0.0",
        "source_registry": "agents/AGENT_RUNTIME_REGISTRY.yaml",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_agents": len(entries),
        "family_totals": family_totals,
        "entries": entries,
    }


def write_matrix(refresh_report: bool = True) -> None:
    matrix = build_matrix()
    MATRIX_PATH.parent.mkdir(parents=True, exist_ok=True)
    MATRIX_PATH.write_text(json.dumps(matrix, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    if refresh_report:
        runpy.run_path(str(ROOT / "scripts" / "generate_unified_hierarchy_report.py"), run_name="__main__")
    print(f"Wrote {len(matrix['entries'])} agent class matrix entries to {MATRIX_PATH}")


if __name__ == "__main__":
    write_matrix()
