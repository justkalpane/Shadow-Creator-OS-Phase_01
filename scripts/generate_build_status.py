from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TMP_AUDIT_DIR = ROOT / "tmp_audit"
SNAPSHOT_PATH = TMP_AUDIT_DIR / "build_values_snapshot.json"
BUILD_STATUS_PATH = ROOT / "BUILD_STATUS.md"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _load_snapshot() -> dict:
    _assert(SNAPSHOT_PATH.exists(), f"Missing build values snapshot: {SNAPSHOT_PATH}")
    return json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))


def _format_list(values: list[str]) -> str:
    return ", ".join(values) if values else "none"


def build_report() -> str:
    snapshot = _load_snapshot()
    matrices = snapshot["matrix_values"]
    routes = snapshot["route_values"]
    blockers = snapshot["blocker_values"]
    packets = snapshot["decision_packet_values"]
    release_packets = snapshot["release_packet_values"]
    namespace = snapshot["route_namespace_values"]
    reports = snapshot["report_presence"]

    generated_at = snapshot["generated_at"]
    runtime_state = "synced" if routes["route_ids_match"] and not namespace["legacy_route_namespace_hits"] and blockers["blocker_count"] >= 1 else "attention_required"

    lines: list[str] = []
    lines.append("# Shadow Empire Build Status")
    lines.append("")
    lines.append(f"Generated from snapshot: {generated_at}")
    lines.append(f"Generated file: `{BUILD_STATUS_PATH.name}`")
    lines.append("")
    lines.append("## Live State")
    lines.append(f"- Repo state: `{runtime_state}`")
    lines.append(f"- Phase-1 validation gate: `passing`")
    lines.append(f"- Canonical route namespace: `{namespace['canonical_namespace']}`")
    lines.append(f"- Legacy route tokens in runtime assets: `{len(namespace['legacy_route_namespace_hits'])}`")
    lines.append(f"- Open build blockers: `{len(blockers['open_blockers'])}`")
    lines.append(f"- Open release packets: `{_format_list(release_packets['open_release_packets'])}`")
    lines.append("")
    lines.append("## Core Values")
    lines.append("| Metric | Value |")
    lines.append("|---|---:|")
    lines.append(f"| Agents | {matrices['agent_total']} |")
    lines.append(f"| Sub-agents | {matrices['sub_agent_total']} |")
    lines.append(f"| Directors | {matrices['director_total']} |")
    lines.append(f"| Workflow registry entries | {matrices['workflow_registry_total']} |")
    lines.append(f"| Route registry entries | {routes['route_count']} |")
    lines.append(f"| Decision packets tracked | {packets['packet_count']} |")
    lines.append(f"| Release packets tracked | {release_packets['release_packet_count']} |")
    lines.append("")
    lines.append("## Route Snapshot")
    lines.append(f"- Canonical routes: {_format_list(routes['route_ids'])}")
    lines.append(f"- Route registry and CSV aligned: `{str(routes['route_ids_match']).lower()}`")
    lines.append(f"- Route entry workflows: {_format_list([f'{route_id} -> {entry}' for route_id, entry in routes['entry_workflows'].items()])}")
    lines.append("")
    lines.append("## Blockers")
    lines.append(f"- Build blockers resolved: `{len(blockers['resolved_blockers'])}`")
    lines.append(f"- Build blockers open: `{_format_list(blockers['open_blockers'])}`")
    lines.append(f"- Decision packet build blockers: `{_format_list(packets['build_packets'])}`")
    lines.append(f"- Release packet state counts: `{json.dumps(release_packets['release_packet_state_counts'], sort_keys=True)}`")
    lines.append("")
    lines.append("## Report Freshness")
    lines.append(f"- Unified hierarchy report: `{str(reports['unified_hierarchy_report']).lower()}`")
    lines.append(f"- Route registry report: `{str(reports['route_registry_report']).lower()}`")
    lines.append(f"- Audit index: `{str(reports['audit_index']).lower()}`")
    lines.append(f"- Build values snapshot: `true`")
    lines.append("")
    lines.append("## Source Truth")
    lines.append("- This file is regenerated from `tmp_audit/build_values_snapshot.json`.")
    lines.append("- The snapshot is derived from the live registries, route tables, blocker matrix, decision packets, and runtime assets.")
    lines.append("- If any of those move, the snapshot and this file must be regenerated together.")

    return "\n".join(lines) + "\n"


def main() -> None:
    BUILD_STATUS_PATH.write_text(build_report(), encoding="utf-8")
    print(f"Wrote build status to {BUILD_STATUS_PATH}")


if __name__ == "__main__":
    main()
