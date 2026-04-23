from __future__ import annotations

import csv
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
TMP_AUDIT_DIR = ROOT / "tmp_audit"
SNAPSHOT_PATH = TMP_AUDIT_DIR / "build_values_snapshot.json"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _load_json(path: Path) -> dict[str, Any]:
    _assert(path.exists(), f"Missing JSON file: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def _load_text(path: Path) -> str:
    _assert(path.exists(), f"Missing text file: {path}")
    return path.read_text(encoding="utf-8", errors="replace")


def _load_csv(path: Path) -> list[dict[str, str]]:
    _assert(path.exists(), f"Missing CSV file: {path}")
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def _is_resolved_state(state: str) -> bool:
    return state.startswith("resolved")


def _parse_route_registry(text: str) -> list[dict[str, str]]:
    routes: list[dict[str, str]] = []
    current: dict[str, str] | None = None
    for raw_line in text.splitlines():
        stripped = raw_line.strip()
        if stripped.startswith("- route_id:") or stripped.startswith("route_id:"):
            if current and current.get("route_id"):
                routes.append(current)
            current = {"route_id": stripped.split(":", 1)[1].strip()}
        elif stripped.startswith("entry_workflow:") and current is not None:
            current["entry_workflow"] = stripped.split(":", 1)[1].strip()
    if current and current.get("route_id"):
        routes.append(current)
    return routes


def _parse_mode_routes(text: str) -> dict[str, list[str]]:
    result: dict[str, list[str]] = {}
    current_mode: str | None = None
    in_legal_routes = False
    for raw_line in text.splitlines():
        stripped = raw_line.strip()
        if stripped in {"founder:", "creator:", "builder:", "operator:"} and raw_line.startswith("  "):
            current_mode = stripped[:-1]
            result[current_mode] = []
            in_legal_routes = False
            continue
        if current_mode and stripped.startswith("legal_routes:"):
            in_legal_routes = True
            continue
        if current_mode and in_legal_routes:
            if stripped.startswith("- "):
                result[current_mode].append(stripped[2:].strip())
            elif stripped and not stripped.startswith("#"):
                in_legal_routes = False
    return result


def _parse_blockers(text: str) -> list[dict[str, str]]:
    blockers: list[dict[str, str]] = []
    current: dict[str, str] | None = None
    for raw_line in text.splitlines():
        stripped = raw_line.strip()
        if stripped.startswith("- blocker_id:"):
            if current:
                blockers.append(current)
            current = {"blocker_id": stripped.split(":", 1)[1].strip()}
        elif current is not None and ":" in stripped:
            key, value = stripped.split(":", 1)
            current[key.strip()] = value.strip()
    if current:
        blockers.append(current)
    return blockers


def _parse_decision_packets(text: str) -> list[dict[str, str]]:
    packets: list[dict[str, str]] = []
    current: dict[str, str] | None = None
    for raw_line in text.splitlines():
        stripped = raw_line.strip()
        if stripped.startswith("- packet_id:"):
            if current:
                packets.append(current)
            current = {"packet_id": stripped.split(":", 1)[1].strip()}
        elif current is not None and ":" in stripped:
            key, value = stripped.split(":", 1)
            current[key.strip()] = value.strip()
    if current:
        packets.append(current)
    return packets


def _parse_workflow_registry(text: str) -> list[dict[str, str]]:
    workflows: list[dict[str, str]] = []
    current: dict[str, str] | None = None
    for raw_line in text.splitlines():
        stripped = raw_line.strip()
        if stripped.startswith("- workflow_id:"):
            if current:
                workflows.append(current)
            current = {"workflow_id": stripped.split(":", 1)[1].strip()}
        elif current is not None and ":" in stripped:
            key, value = stripped.split(":", 1)
            current[key.strip()] = value.strip()
    if current:
        workflows.append(current)
    return workflows


def _scan_route_namespace_hits() -> list[str]:
    scan_roots = [
        ROOT / "agents" / "common",
        ROOT / "engine",
        ROOT / "n8n" / "workflows",
        ROOT / "data" / "bootstrap" / "data_tables",
    ]
    hits: list[str] = []
    legacy_dashed_route = re.compile(r"\bROUTE-\d+\b")
    non_canonical_route = re.compile(r"\bROUTE_(?!PHASE1_|MAP)[A-Z0-9_]+\b")
    allowed_route_ids = {
        "ROUTE_PHASE1_STANDARD",
        "ROUTE_PHASE1_FAST",
        "ROUTE_PHASE1_REPLAY",
        "ROUTE_PHASE1_ANALYTICS",
        "ROUTE_MAP",
    }

    for root in scan_roots:
        for path in root.rglob("*"):
            if not path.is_file():
                continue
            try:
                text = path.read_text(encoding="utf-8", errors="replace")
            except Exception:
                continue
            for match in legacy_dashed_route.findall(text):
                hits.append(f"{path}:{match}")
            for match in non_canonical_route.findall(text):
                if match not in allowed_route_ids:
                    hits.append(f"{path}:{match}")
    return sorted(set(hits))


def build_snapshot() -> dict[str, Any]:
    agent_matrix = _load_json(ROOT / "registries" / "agent_class_matrix.json")
    sub_agent_matrix = _load_json(ROOT / "registries" / "sub_agent_matrix.json")
    director_matrix = _load_json(ROOT / "registries" / "director_binding_matrix.json")
    route_registry = _parse_route_registry(_load_text(ROOT / "registries" / "route_registry.yaml"))
    routes_csv = _load_csv(ROOT / "data" / "bootstrap" / "data_tables" / "routes.csv")
    mode_registry_text = _load_text(ROOT / "registries" / "mode_registry.yaml")
    mode_route_text = _load_text(ROOT / "registries" / "mode_route_registry.yaml")
    workflow_registry = _parse_workflow_registry(_load_text(ROOT / "registries" / "workflow_registry.yaml"))
    blockers = _parse_blockers(_load_text(ROOT / "registries" / "build_blocker_matrix.yaml"))
    decision_packets = _parse_decision_packets(_load_text(ROOT / "registries" / "decision_packet_register.yaml"))

    route_ids = [entry["route_id"] for entry in route_registry]
    csv_route_ids = [row["route_id"] for row in routes_csv]
    route_ids_match = sorted(route_ids) == sorted(csv_route_ids)
    canonical_route_set = {"ROUTE_PHASE1_STANDARD", "ROUTE_PHASE1_FAST", "ROUTE_PHASE1_REPLAY", "ROUTE_PHASE1_ANALYTICS"}

    workflow_status_counts = Counter(entry.get("artifact_status", "unknown") for entry in workflow_registry)
    runtime_status_counts = Counter(entry.get("runtime_status", "unknown") for entry in workflow_registry)
    validation_status_counts = Counter(entry.get("validation_status", "unknown") for entry in workflow_registry)

    blocker_state_counts = Counter(entry.get("state", "unknown") for entry in blockers)
    decision_packet_state_counts = Counter(entry.get("current_state", "unknown") for entry in decision_packets)

    mode_routes = _parse_mode_routes(mode_registry_text)
    mode_route_counts = {mode: len(routes) for mode, routes in mode_routes.items()}

    mode_route_legality: dict[str, dict[str, dict[str, str]]] = {}
    for mode in ["founder", "creator", "builder", "operator"]:
        mode_route_legality[mode] = {}
        mode_block_match = re.search(
            rf"^  {mode}:\n(.*?)(?=^  [a-z_]+:|\Z)", mode_route_text, flags=re.MULTILINE | re.DOTALL
        )
        _assert(mode_block_match is not None, f"Missing mode legality block: {mode}")
        block = mode_block_match.group(1)
        current_route = None
        for raw_line in block.splitlines():
            stripped = raw_line.strip()
            if stripped.startswith("ROUTE_PHASE1_"):
                current_route = stripped.rstrip(":")
                mode_route_legality[mode][current_route] = {}
            elif current_route and ":" in stripped:
                key, value = stripped.split(":", 1)
                mode_route_legality[mode][current_route][key.strip()] = value.strip()

    snapshot = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_truth": {
            "agent_class_matrix": "registries/agent_class_matrix.json",
            "sub_agent_matrix": "registries/sub_agent_matrix.json",
            "director_binding_matrix": "registries/director_binding_matrix.json",
            "route_registry": "registries/route_registry.yaml",
            "routes_csv": "data/bootstrap/data_tables/routes.csv",
            "mode_registry": "registries/mode_registry.yaml",
            "mode_route_registry": "registries/mode_route_registry.yaml",
            "workflow_registry": "registries/workflow_registry.yaml",
            "build_blocker_matrix": "registries/build_blocker_matrix.yaml",
            "decision_packet_register": "registries/decision_packet_register.yaml",
        },
        "matrix_values": {
            "agent_total": agent_matrix["total_agents"],
            "sub_agent_total": sub_agent_matrix["total_sub_agents"],
            "director_total": len(director_matrix["entries"]),
            "workflow_registry_total": len(workflow_registry),
        },
        "route_values": {
            "route_count": len(route_registry),
            "route_ids": route_ids,
            "entry_workflows": {entry["route_id"]: entry["entry_workflow"] for entry in route_registry},
            "csv_route_ids": csv_route_ids,
            "route_ids_match": route_ids_match,
            "canonical_route_set": sorted(canonical_route_set),
        },
        "mode_values": {
            "mode_names": ["founder", "creator", "builder", "operator"],
            "mode_legal_routes": mode_routes,
            "mode_route_counts": mode_route_counts,
            "mode_route_legalities": mode_route_legality,
        },
        "workflow_registry_values": {
            "artifact_status_counts": dict(workflow_status_counts),
            "runtime_status_counts": dict(runtime_status_counts),
            "validation_status_counts": dict(validation_status_counts),
        },
        "blocker_values": {
            "blocker_count": len(blockers),
            "blocker_state_counts": dict(blocker_state_counts),
            "open_blockers": [entry["blocker_id"] for entry in blockers if not _is_resolved_state(entry.get("state", ""))],
            "resolved_blockers": [entry["blocker_id"] for entry in blockers if _is_resolved_state(entry.get("state", ""))],
        },
        "decision_packet_values": {
            "packet_count": len(decision_packets),
            "packet_state_counts": dict(decision_packet_state_counts),
            "build_packets": [entry["packet_id"] for entry in decision_packets if entry.get("blocking_level") == "build"],
        },
        "release_packet_values": {
            "release_packet_count": sum(1 for entry in decision_packets if entry.get("blocking_level") == "release"),
            "release_packet_state_counts": dict(
                Counter(entry.get("current_state", "unknown") for entry in decision_packets if entry.get("blocking_level") == "release")
            ),
            "open_release_packets": [
                entry["packet_id"]
                for entry in decision_packets
                if entry.get("blocking_level") == "release" and not _is_resolved_state(entry.get("current_state", ""))
            ],
        },
        "route_namespace_values": {
            "canonical_namespace": "ROUTE_PHASE1_*",
            "legacy_route_namespace_hits": _scan_route_namespace_hits(),
        },
        "report_presence": {
            "unified_hierarchy_report": (TMP_AUDIT_DIR / "unified_hierarchy_report.md").exists(),
            "route_registry_report": (TMP_AUDIT_DIR / "route_registry_report.md").exists(),
            "audit_index": (TMP_AUDIT_DIR / "audit_index.md").exists(),
        },
    }

    _assert(snapshot["matrix_values"]["agent_total"] > 0, "Agent matrix total must be positive.")
    _assert(snapshot["matrix_values"]["sub_agent_total"] > 0, "Sub-agent matrix total must be positive.")
    _assert(snapshot["matrix_values"]["director_total"] > 0, "Director matrix total must be positive.")
    _assert(snapshot["route_values"]["route_ids_match"], "Route registry and CSV route IDs must match.")
    _assert(set(snapshot["route_values"]["route_ids"]) == canonical_route_set, "Route registry must contain the canonical Phase-1 route set.")
    _assert("BB-019" not in snapshot["blocker_values"]["open_blockers"], "BB-019 must not remain open in the build snapshot.")
    _assert(not snapshot["route_namespace_values"]["legacy_route_namespace_hits"], "Legacy route namespace tokens must not exist in runtime assets.")
    _assert(snapshot["release_packet_values"]["release_packet_count"] >= 1, "At least one release packet should be tracked in the snapshot.")

    return snapshot


def main() -> None:
    TMP_AUDIT_DIR.mkdir(parents=True, exist_ok=True)
    snapshot = build_snapshot()
    SNAPSHOT_PATH.write_text(json.dumps(snapshot, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote build values snapshot to {SNAPSHOT_PATH}")


if __name__ == "__main__":
    main()
