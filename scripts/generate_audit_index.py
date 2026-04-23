from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TMP_AUDIT_DIR = ROOT / "tmp_audit"
REPORT_PATH = TMP_AUDIT_DIR / "audit_index.md"


def build_report() -> str:
    hierarchy_report = TMP_AUDIT_DIR / "unified_hierarchy_report.md"
    route_report = TMP_AUDIT_DIR / "route_registry_report.md"

    lines: list[str] = []
    lines.append("# Audit Index")
    lines.append("")
    lines.append(f"Generated: {datetime.now(timezone.utc).isoformat()}")
    lines.append("")
    lines.append("## Primary Entrypoints")
    lines.append(f"- Top-level rebuild: [rebuild_all_matrices.py]({ROOT / 'scripts' / 'rebuild_all_matrices.py'})")
    lines.append(f"- Unified hierarchy report: [unified_hierarchy_report.md]({hierarchy_report})")
    lines.append(f"- Route registry report: [route_registry_report.md]({route_report})")
    lines.append("")
    lines.append("## Validators")
    lines.append(f"- [validate_unified_hierarchy_report.py]({ROOT / 'tests' / 'validate_unified_hierarchy_report.py'})")
    lines.append(f"- [validate_route_registry_report.py]({ROOT / 'tests' / 'validate_route_registry_report.py'})")
    lines.append(f"- [validate_route_namespace.py]({ROOT / 'tests' / 'validate_route_namespace.py'})")
    lines.append("")
    lines.append("## Matrix Builders")
    lines.append(f"- [rebuild_agent_class_matrix.py]({ROOT / 'scripts' / 'rebuild_agent_class_matrix.py'})")
    lines.append(f"- [rebuild_sub_agent_matrix.py]({ROOT / 'scripts' / 'rebuild_sub_agent_matrix.py'})")
    lines.append(f"- [rebuild_director_binding_matrix.py]({ROOT / 'scripts' / 'rebuild_director_binding_matrix.py'})")
    lines.append(f"- [generate_unified_hierarchy_report.py]({ROOT / 'scripts' / 'generate_unified_hierarchy_report.py'})")
    lines.append(f"- [generate_route_registry_report.py]({ROOT / 'scripts' / 'generate_route_registry_report.py'})")
    lines.append("")
    lines.append("## Notes")
    lines.append("- This index is derived, not hand-maintained.")
    lines.append("- It is refreshed automatically from `rebuild_all_matrices.py`.")
    lines.append("- The report links are intentionally human-first so the build surface has one obvious starting point.")

    return "\n".join(lines) + "\n"


def main() -> None:
    TMP_AUDIT_DIR.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(build_report(), encoding="utf-8")
    print(f"Wrote audit index to {REPORT_PATH}")


if __name__ == "__main__":
    main()
