from __future__ import annotations

import json
import re
import runpy
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from agents.common.agent_class_matrix import iter_agent_class_entries
from agents.common.director_authority_profiles import DIRECTOR_AUTHORITY_PROFILES, get_director_profile
from agents.common.sub_agent_matrix import iter_sub_agent_entries
from agents.common.workflow_binding_contracts import WORKFLOW_BINDING_CONTRACTS


REGISTRY_DIR = ROOT / "registries"
MATRIX_PATH = REGISTRY_DIR / "director_binding_matrix.json"

PACK_FILES = [
    REGISTRY_DIR / "director_binding_wf100.yaml",
    REGISTRY_DIR / "director_binding_wf200.yaml",
    REGISTRY_DIR / "director_binding_wf300.yaml",
    REGISTRY_DIR / "director_binding_wf400.yaml",
    REGISTRY_DIR / "director_binding_wf500.yaml",
    REGISTRY_DIR / "director_binding_wf600.yaml",
]


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _list_to_items(value: str) -> list[str]:
    inside = value.strip().strip("[]")
    if not inside:
        return []
    return [item.strip().strip('"').strip("'") for item in inside.split(",") if item.strip()]


def _parse_pack_targets(path: Path) -> dict[str, dict[str, Any]]:
    text = path.read_text(encoding="utf-8", errors="replace")
    lines = text.splitlines()
    data: dict[str, dict[str, Any]] = defaultdict(lambda: {"sources": [], "targets": [], "roles": set(), "packs": set()})
    pack_id_match = re.search(r"(?:workflow_pack|target_workflow_pack):\s*\"?([A-Z0-9-]+)\"?", text)
    pack_id = pack_id_match.group(1) if pack_id_match else path.stem.upper()

    if "director_assignments:" in text:
        current_director = None
        current_section = None
        in_assignments = False
        for raw in lines:
            line = raw.rstrip()
            stripped = line.strip()
            if stripped == "director_assignments:":
                in_assignments = True
                continue
            if not in_assignments:
                continue
            if stripped.startswith("---"):
                current_director = None
                current_section = None
                continue
            m = re.match(r"^\s*-\s+director_name:\s*\"?([^\"\n]+)\"?$", line)
            if m:
                current_director = m.group(1).strip()
                data[current_director]["packs"].add(pack_id)
                continue
            if current_director is None:
                continue
            if stripped.startswith("primary_role:"):
                data[current_director]["roles"].add(stripped.split(":", 1)[1].strip().strip('"'))
            elif stripped.startswith("authority_level:"):
                data[current_director]["roles"].add(stripped.split(":", 1)[1].strip().strip('"'))
            elif stripped.startswith("escalation_authority:"):
                data[current_director]["targets"].append(f"{pack_id}:{stripped.split(':', 1)[1].strip()}")
            elif stripped.startswith("responsibilities:") or stripped.startswith("assignments:"):
                current_section = stripped.split(":", 1)[0]
            elif stripped.startswith("- ") and current_section in {"responsibilities", "assignments"}:
                item = stripped[2:].strip().strip('"')
                if item:
                    data[current_director]["targets"].append(item)
            elif "workflows:" in stripped or "skills:" in stripped or "namespaces:" in stripped or "packets:" in stripped:
                value = stripped.split(":", 1)[1].strip()
                for item in _list_to_items(value):
                    data[current_director]["targets"].append(item)
        return data

    if "director_bindings:" in text:
        current_director = None
        current_section = None
        in_bindings = False
        for raw in lines:
            line = raw.rstrip()
            stripped = line.strip()
            if stripped == "director_bindings:":
                in_bindings = True
                continue
            if not in_bindings:
                continue
            if stripped.startswith("pack_orchestration:"):
                current_director = None
                current_section = None
                break
            m = re.match(r"^\s{2}([A-Za-z0-9_]+):\s*$", line)
            if m:
                current_director = m.group(1).strip()
                data[current_director]["packs"].add(pack_id)
                continue
            if current_director is None:
                continue
            if stripped.startswith("director_role:"):
                data[current_director]["roles"].add(stripped.split(":", 1)[1].strip().strip('"'))
            elif stripped.startswith("bind_level:"):
                data[current_director]["roles"].add(stripped.split(":", 1)[1].strip().strip('"'))
            elif stripped.startswith("governance_scope:"):
                current_section = "governance_scope"
            elif stripped.startswith("approval_gates_managed:"):
                current_section = "approval_gates_managed"
            elif stripped.startswith("responsibilities:"):
                current_section = "responsibilities"
            elif stripped.startswith("- ") and current_section in {"governance_scope", "approval_gates_managed", "responsibilities"}:
                data[current_director]["targets"].append(stripped[2:].strip().strip('"'))
        return data

    if "directors:" in text:
        current_director = None
        current_section = None
        in_directors = False
        for raw in lines:
            line = raw.rstrip()
            stripped = line.strip()
            if stripped == "directors:":
                in_directors = True
                continue
            if not in_directors:
                continue
            m = re.match(r"^\s{2}([A-Za-z0-9_]+):\s*$", line)
            if m:
                current_director = m.group(1).strip()
                data[current_director]["packs"].add(pack_id)
                continue
            if current_director is None:
                continue
            if stripped in {"owns:", "supports:"}:
                current_section = stripped[:-1]
            elif stripped.startswith("- ") and current_section in {"owns", "supports"}:
                data[current_director]["targets"].append(stripped[2:].strip().strip('"'))
        return data

    return data


def build_matrix() -> dict[str, Any]:
    profiles = DIRECTOR_AUTHORITY_PROFILES
    agent_entries = iter_agent_class_entries()
    sub_agent_entries = iter_sub_agent_entries()

    workflow_primary_counts: dict[str, int] = Counter()
    workflow_support_counts: dict[str, int] = Counter()
    workflow_ids_by_director: dict[str, list[str]] = defaultdict(list)
    support_workflow_ids_by_director: dict[str, list[str]] = defaultdict(list)

    for contract in WORKFLOW_BINDING_CONTRACTS.values():
        workflow_id = str(contract.get("workflow_id"))
        primary = str(contract.get("primary_director"))
        workflow_primary_counts[primary] += 1
        workflow_ids_by_director[primary].append(workflow_id)
        for support in contract.get("supporting_directors", []):
            workflow_support_counts[support] += 1
            support_workflow_ids_by_director[str(support)].append(workflow_id)
        for governance in contract.get("governance_authority", []):
            workflow_support_counts[str(governance)] += 1
            support_workflow_ids_by_director[str(governance)].append(workflow_id)

    agent_counts: dict[str, int] = Counter(entry["director_binding"] for entry in agent_entries)
    sub_agent_counts: dict[str, int] = Counter(entry["primary_director"] for entry in sub_agent_entries)

    pack_bindings: dict[str, dict[str, Any]] = defaultdict(lambda: {"targets": [], "roles": set()})
    for path in PACK_FILES:
        parsed = _parse_pack_targets(path)
        for director, meta in parsed.items():
            pack_bindings[director]["targets"].extend(meta["targets"])
            pack_bindings[director]["roles"].update(meta["roles"])
            pack_bindings[director].setdefault("packs", set()).update(meta["packs"])

    profile_names = {profile["director_name"] for profile in profiles.values()}
    all_directors = sorted(
        profile_names
        | set(agent_counts)
        | set(sub_agent_counts)
        | set(workflow_primary_counts)
        | set(workflow_support_counts)
        | set(pack_bindings)
    )
    entries: list[dict[str, Any]] = []

    for director in all_directors:
        profile = get_director_profile(director)
        entry = {
            "director_name": profile.get("director_name", director.title()),
            "director_id": profile.get("director_id"),
            "council": profile.get("council"),
            "role": profile.get("role"),
            "authority_mode": profile.get("authority_mode"),
            "can_veto": profile.get("can_veto"),
            "release_blocking": profile.get("release_blocking"),
            "escalation_workflow": profile.get("escalation_workflow"),
            "agent_runtime_count": agent_counts.get(profile.get("director_name", director.title()), 0),
            "sub_agent_primary_count": sub_agent_counts.get(profile.get("director_name", director.title()), 0),
            "workflow_primary_count": workflow_primary_counts.get(profile.get("director_name", director.title()), 0),
            "workflow_support_count": workflow_support_counts.get(profile.get("director_name", director.title()), 0),
            "workflow_primary_ids": sorted(set(workflow_ids_by_director.get(profile.get("director_name", director.title()), []))),
            "workflow_support_ids": sorted(set(support_workflow_ids_by_director.get(profile.get("director_name", director.title()), []))),
            "binding_source_packs": sorted(list(pack_bindings.get(profile.get("director_name", director.title()), {}).get("packs", set()))),
            "binding_targets": sorted(list(dict.fromkeys(pack_bindings.get(profile.get("director_name", director.title()), {}).get("targets", [])))),
        }
        entry["coverage_state"] = (
            "covered"
            if entry["workflow_primary_count"] or entry["workflow_support_count"] or entry["agent_runtime_count"] or entry["sub_agent_primary_count"]
            else "uncovered"
        )
        entries.append(entry)

    aggregate_counts = {
        "directors": len(entries),
        "agent_director_links": sum(agent_counts.values()),
        "sub_agent_primary_links": sum(sub_agent_counts.values()),
        "workflow_primary_links": sum(workflow_primary_counts.values()),
        "workflow_support_links": sum(workflow_support_counts.values()),
    }
    return {
        "matrix_name": "director_binding_matrix",
        "schema_version": "1.0.0",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "entries": entries,
        "aggregate_counts": aggregate_counts,
        "source_pack_files": [str(path.relative_to(ROOT)) for path in PACK_FILES],
    }


def write_matrix(refresh_report: bool = True) -> None:
    matrix = build_matrix()
    MATRIX_PATH.parent.mkdir(parents=True, exist_ok=True)
    MATRIX_PATH.write_text(json.dumps(matrix, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    if refresh_report:
        runpy.run_path(str(ROOT / "scripts" / "generate_unified_hierarchy_report.py"), run_name="__main__")
    print(f"Wrote {len(matrix['entries'])} director binding entries to {MATRIX_PATH}")


if __name__ == "__main__":
    write_matrix()
