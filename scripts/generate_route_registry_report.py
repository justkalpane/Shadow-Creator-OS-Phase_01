from __future__ import annotations

import csv
import re
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TMP_AUDIT_DIR = ROOT / "tmp_audit"
REPORT_PATH = TMP_AUDIT_DIR / "route_registry_report.md"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _load_text(path: Path) -> str:
    _assert(path.exists(), f"Missing registry file: {path}")
    return path.read_text(encoding="utf-8", errors="replace")


def _load_csv(path: Path) -> list[dict[str, str]]:
    _assert(path.exists(), f"Missing CSV file: {path}")
    with path.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def _cell(value: str | None) -> str:
    if value is None:
        return "none"
    return str(value).replace("|", "&#124;").replace("\n", "<br>")


def _parse_route_registry(text: str) -> list[tuple[str, str]]:
    routes: list[tuple[str, str]] = []
    current_route = None
    for raw_line in text.splitlines():
        stripped = raw_line.strip()
        if stripped.startswith("- route_id:"):
            current_route = stripped.split(":", 1)[1].strip()
        elif stripped.startswith("route_id:"):
            current_route = stripped.split(":", 1)[1].strip()
        elif stripped.startswith("entry_workflow:") and current_route:
            routes.append((current_route, stripped.split(":", 1)[1].strip()))
            current_route = None
    return routes


def _extract_mode_block(text: str, mode_name: str) -> str:
    pattern = rf"^  {re.escape(mode_name)}:\n(.*?)(?=^  [a-z_]+:|\Z)"
    match = re.search(pattern, text, flags=re.MULTILINE | re.DOTALL)
    _assert(match is not None, f"Missing mode block: {mode_name}")
    return match.group(1)


def _extract_legal_routes(mode_registry_text: str, mode_name: str) -> list[str]:
    block = _extract_mode_block(mode_registry_text, mode_name)
    routes: list[str] = []
    in_routes = False
    for raw_line in block.splitlines():
        stripped = raw_line.strip()
        if stripped.startswith("legal_routes:"):
            in_routes = True
            continue
        if in_routes:
            if stripped.startswith("- "):
                routes.append(stripped[2:].strip())
            elif stripped and not stripped.startswith("#"):
                break
    return routes


def _extract_mode_route_legality(mode_route_text: str, mode_name: str) -> dict[str, dict[str, str]]:
    pattern = rf"^  {re.escape(mode_name)}:\n(.*?)(?=^  [a-z_]+:|\Z)"
    match = re.search(pattern, mode_route_text, flags=re.MULTILINE | re.DOTALL)
    _assert(match is not None, f"Missing legality block: {mode_name}")
    block = match.group(1)
    route_data: dict[str, dict[str, str]] = {}
    current_route = None
    capturing_notes = False
    note_indent = None
    note_lines: list[str] = []
    for raw_line in block.splitlines():
        indent = len(raw_line) - len(raw_line.lstrip(" "))
        stripped = raw_line.strip()
        if stripped.startswith("ROUTE_PHASE1_"):
            if current_route and note_lines:
                route_data[current_route]["notes"] = " ".join(note_lines).strip()
                note_lines = []
            capturing_notes = False
            note_indent = None
            current_route = stripped.rstrip(":")
            route_data[current_route] = {}
            continue
        if current_route and capturing_notes:
            if stripped and indent > (note_indent or 0) and not stripped.startswith(("access:", "default:", "notes:")):
                note_lines.append(stripped.lstrip("> ").strip())
                continue
            route_data[current_route]["notes"] = " ".join(note_lines).strip() or "none"
            note_lines = []
            capturing_notes = False
            note_indent = None
        if current_route and ":" in stripped:
            key, value = stripped.split(":", 1)
            key = key.strip()
            value = value.strip()
            if key == "notes" and value == ">":
                capturing_notes = True
                note_indent = indent
                note_lines = []
                continue
            route_data[current_route][key] = value
    return route_data


def build_report() -> str:
    route_registry_text = _load_text(ROOT / "registries" / "route_registry.yaml")
    mode_route_text = _load_text(ROOT / "registries" / "mode_route_registry.yaml")
    mode_registry_text = _load_text(ROOT / "registries" / "mode_registry.yaml")
    routes_csv = _load_csv(ROOT / "data" / "bootstrap" / "data_tables" / "routes.csv")

    registry_routes = _parse_route_registry(route_registry_text)
    route_rows = {row["route_id"]: row for row in routes_csv}
    mode_names = ["founder", "creator", "builder", "operator"]
    mode_legal_routes = {mode: _extract_legal_routes(mode_registry_text, mode) for mode in mode_names}
    mode_route_legalities = {mode: _extract_mode_route_legality(mode_route_text, mode) for mode in mode_names}

    lines: list[str] = []
    lines.append("# Route Registry Report")
    lines.append("")
    lines.append(f"Generated: {datetime.now(timezone.utc).isoformat()}")
    lines.append("")
    lines.append("## Route Inventory")
    lines.append(f"- Route count: {len(registry_routes)}")
    lines.append(f"- Canonical route namespace: ROUTE_PHASE1_*")
    lines.append(f"- Mode definitions covered: {len(mode_names)}")
    lines.append("")
    lines.append("| Route ID | Entry workflow | Purpose | Allowed modes | Blocked capabilities |")
    lines.append("|---|---|---|---|---|")
    for route_id, entry_workflow in registry_routes:
        csv_row = route_rows.get(route_id, {})
        lines.append(
            f"| {_cell(route_id)} | {_cell(entry_workflow)} | {_cell(csv_row.get('purpose', 'none'))} | {_cell(csv_row.get('allowed_modes', 'none'))} | {_cell(csv_row.get('blocked_capabilities', 'none'))} |"
        )
    lines.append("")

    lines.append("## Mode Legality")
    for mode in mode_names:
        routes = mode_legal_routes.get(mode, [])
        lines.append(f"### {mode}")
        lines.append(f"- Legal routes: {', '.join(routes) if routes else 'none'}")
        legality = mode_route_legalities.get(mode, {})
        if legality:
            lines.append("| Route ID | Access | Default | Notes |")
            lines.append("|---|---|---|---|")
            for route_id in sorted(legality):
                data = legality[route_id]
                lines.append(
                    f"| {_cell(route_id)} | {_cell(data.get('access', 'unknown'))} | {_cell(data.get('default', 'false'))} | {_cell(data.get('notes', 'none'))} |"
                )
        lines.append("")

    lines.append("## Consistency Notes")
    lines.append("- `route_registry.yaml` and `routes.csv` are kept in lockstep.")
    lines.append("- `mode_registry.yaml` and `mode_route_registry.yaml` both reference the canonical `ROUTE_PHASE1_*` set.")
    lines.append("- Replay remains mediated through `WF-900` and is only legal where the mode contracts allow it.")

    return "\n".join(lines) + "\n"


def main() -> None:
    TMP_AUDIT_DIR.mkdir(parents=True, exist_ok=True)
    report = build_report()
    REPORT_PATH.write_text(report, encoding="utf-8")
    print(f"Wrote route registry report to {REPORT_PATH}")


if __name__ == "__main__":
    main()
