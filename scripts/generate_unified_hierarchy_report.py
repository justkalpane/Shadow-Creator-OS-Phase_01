from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TMP_AUDIT_DIR = ROOT / "tmp_audit"
REPORT_PATH = TMP_AUDIT_DIR / "unified_hierarchy_report.md"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _load_json(path: Path) -> dict:
    _assert(path.exists(), f"Missing matrix file: {path}")
    import json

    return json.loads(path.read_text(encoding="utf-8"))


def _format_list(value) -> str:
    if value is None:
        return "none"
    if isinstance(value, list):
        return ", ".join(str(v) for v in value) if value else "none"
    return str(value)


def _sorted_unique(values) -> list[str]:
    return sorted({str(value) for value in values if value not in (None, "")})


def _pack_sort_key(pack: str) -> tuple[int, int | str]:
    if pack == "ROOT":
        return (0, 0)
    if pack.startswith("WF-"):
        try:
            return (1, int(pack.split("-", 1)[1]))
        except ValueError:
            return (2, pack)
    return (3, pack)


def build_report() -> str:
    agent_matrix = _load_json(ROOT / "registries" / "agent_class_matrix.json")
    sub_agent_matrix = _load_json(ROOT / "registries" / "sub_agent_matrix.json")
    director_matrix = _load_json(ROOT / "registries" / "director_binding_matrix.json")

    agent_entries = agent_matrix["entries"]
    sub_agent_entries = sub_agent_matrix["entries"]
    director_entries = director_matrix["entries"]

    agent_by_director: dict[str, list[dict]] = defaultdict(list)
    for entry in agent_entries:
        agent_by_director[entry["director_binding"]].append(entry)

    sub_by_director: dict[str, list[dict]] = defaultdict(list)
    sub_by_pack: dict[str, list[dict]] = defaultdict(list)
    for entry in sub_agent_entries:
        sub_by_director[entry["primary_director"]].append(entry)
        sub_by_pack[entry["parent_pack"] or "ROOT"].append(entry)

    director_by_name = {entry["director_name"]: entry for entry in director_entries}
    pack_names = _sorted_unique(
        [entry["parent_pack"] or "ROOT" for entry in sub_agent_entries]
        + [pack for entry in director_entries for pack in entry["binding_source_packs"]]
    )

    lines: list[str] = []
    lines.append("# Unified Hierarchy Report")
    lines.append("")
    lines.append(f"Generated: {datetime.now(timezone.utc).isoformat()}")
    lines.append("")
    lines.append("## Executive Summary")
    lines.append(f"- Agents: {agent_matrix['total_agents']}")
    lines.append(f"- Sub-agents: {sub_agent_matrix['total_sub_agents']}")
    lines.append(f"- Directors: {len(director_entries)}")
    lines.append(f"- Primary routed directors: {sum(1 for row in director_entries if row['sub_agent_primary_count'] > 0 or row['workflow_primary_count'] > 0)}")
    lines.append(f"- Covered directors: {sum(1 for row in director_entries if row['coverage_state'] == 'covered')}")
    lines.append("")
    lines.append("## Scope")
    lines.append("- This report merges the agent runtime matrix, sub-agent matrix, and director binding matrix into one routing view.")
    lines.append("- `ROOT` denotes workflows with no declared parent pack in the sub-agent matrix.")
    lines.append("- Pack sections are ordered from root to higher workflow packs for easier navigation.")
    lines.append("")

    lines.append("## Routing Map")
    header = "| Director | Agent runtime | Sub-agent primary | Workflow primary IDs | Workflow support IDs | Escalation WF | Source packs |"
    separator = "|---|---:|---:|---|---|---|---|"
    lines.append(header)
    lines.append(separator)

    for entry in sorted(director_entries, key=lambda item: item["director_name"]):
        director = entry["director_name"]
        agent_runtime = len(agent_by_director.get(director, []))
        sub_runtime = len(sub_by_director.get(director, []))
        workflow_primary_ids = _format_list(entry["workflow_primary_ids"])
        workflow_support_ids = _format_list(entry["workflow_support_ids"])
        source_packs = _format_list(entry["binding_source_packs"])
        lines.append(
            f"| {director} | {agent_runtime} | {sub_runtime} | {workflow_primary_ids} | {workflow_support_ids} | {entry['escalation_workflow']} | {source_packs} |"
        )

    lines.append("")
    lines.append("## Pack Routing Tree")
    for pack in sorted(pack_names, key=_pack_sort_key):
        workflows = sorted(sub_by_pack.get(pack, []), key=lambda item: item["workflow_id"])
        pack_directors = _sorted_unique(
            [row["primary_director"] for row in workflows]
            + [director["director_name"] for director in director_entries if pack in director["binding_source_packs"]]
        )
        support_directors = _sorted_unique([support for row in workflows for support in row["supporting_directors"]])

        lines.append(f"### {pack}")
        lines.append(f"- Workflow count: {len(workflows)}")
        lines.append(f"- Primary directors: {_format_list(_sorted_unique([row['primary_director'] for row in workflows]))}")
        lines.append(f"- Supporting directors: {_format_list(support_directors)}")
        lines.append(f"- Director bindings: {_format_list(pack_directors)}")
        if not workflows:
            lines.append("- No sub-agent workflows are rooted here; this pack acts as a governance or binding boundary only.")
            lines.append("")
            continue

        lines.append("")
        lines.append("| Workflow ID | Workflow name | Class | Primary director | Supporting directors | Required inputs | Escalates to |")
        lines.append("|---|---|---|---|---|---|---|")
        for row in workflows:
            lines.append(
                f"| {row['workflow_id']} | {row['workflow_name']} | {row['workflow_class']} | {row['primary_director']} | "
                f"{_format_list(row['supporting_directors'])} | {_format_list(row['required_inputs'])} | {row['gate_rules']['escalate_to']} |"
            )
        lines.append("")

    lines.append("## Agent Estate")
    for director in sorted(agent_by_director):
        rows = agent_by_director[director]
        lines.append(f"### {director}")
        lines.append(f"- Runtime agents: {len(rows)}")
        lines.append(f"- Agent slugs: {_format_list([row['agent_slug'] for row in rows])}")
        lines.append(f"- Artifact families: {_format_list(sorted({row['artifact_family'] for row in rows}))}")
        lines.append(f"- Director binding: {director_by_name[director]['director_id']}")
        lines.append("")

    lines.append("## Sub-agent Estate")
    for director in sorted(sub_by_director):
        rows = sub_by_director[director]
        lines.append(f"### {director}")
        lines.append(f"- Primary sub-agents: {len(rows)}")
        lines.append(f"- Workflow IDs: {_format_list([row['workflow_id'] for row in rows])}")
        lines.append(f"- Workflow families: {_format_list(sorted({row['workflow_family'] for row in rows}))}")
        lines.append(f"- Required inputs: {_format_list(sorted({item for row in rows for item in row['required_inputs']}))}")
        lines.append("")

    lines.append("## Director Coverage Notes")
    for entry in sorted(director_entries, key=lambda item: item["director_name"]):
        notes: list[str] = []
        if entry["agent_runtime_count"]:
            notes.append(f"{entry['agent_runtime_count']} agent runtime node(s)")
        if entry["sub_agent_primary_count"]:
            notes.append(f"{entry['sub_agent_primary_count']} sub-agent primary node(s)")
        if entry["workflow_primary_count"]:
            notes.append(f"{entry['workflow_primary_count']} workflow primary binding(s)")
        if entry["workflow_support_count"]:
            notes.append(f"{entry['workflow_support_count']} workflow support binding(s)")
        if not notes:
            notes.append("coverage comes from profile-only registration")
        lines.append(f"- {entry['director_name']}: {', '.join(notes)}")

    lines.append("")
    lines.append("## Cross-Layer Observations")
    lines.append("- Agent runtime now includes explicit runtime nodes for every agent-binding director.")
    lines.append("- Sub-agent coverage is normalized by workflow primary director and reflected in the hierarchy map.")
    lines.append("- Director binding coverage surfaces both pack-level ownership and direct workflow support.")
    lines.append("- Secondary directors may appear in workflow support even when they do not have runtime agents; that is preserved as governance-only truth.")

    return "\n".join(lines) + "\n"


def main() -> None:
    TMP_AUDIT_DIR.mkdir(parents=True, exist_ok=True)
    report = build_report()
    REPORT_PATH.write_text(report, encoding="utf-8")
    print(f"Wrote unified hierarchy report to {REPORT_PATH}")


if __name__ == "__main__":
    main()
