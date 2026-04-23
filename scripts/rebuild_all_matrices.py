from __future__ import annotations

import runpy
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPTS_DIR = ROOT / "scripts"
REPORT_GENERATOR = SCRIPTS_DIR / "generate_unified_hierarchy_report.py"
ROUTE_REPORT_GENERATOR = SCRIPTS_DIR / "generate_route_registry_report.py"
AUDIT_INDEX_GENERATOR = SCRIPTS_DIR / "generate_audit_index.py"
BUILD_VALUES_GENERATOR = SCRIPTS_DIR / "generate_build_values_snapshot.py"
BUILD_STATUS_GENERATOR = SCRIPTS_DIR / "generate_build_status.py"


def _load_write_matrix(script_name: str):
    namespace = runpy.run_path(str(SCRIPTS_DIR / script_name), run_name=f"matrix_loader_{script_name}")
    write_matrix = namespace.get("write_matrix")
    if write_matrix is None:
        raise RuntimeError(f"Missing write_matrix() in {script_name}")
    return write_matrix


def main() -> None:
    build_agent_matrix = _load_write_matrix("rebuild_agent_class_matrix.py")
    build_sub_agent_matrix = _load_write_matrix("rebuild_sub_agent_matrix.py")
    build_director_binding_matrix = _load_write_matrix("rebuild_director_binding_matrix.py")

    build_agent_matrix(refresh_report=False)
    build_sub_agent_matrix(refresh_report=False)
    build_director_binding_matrix(refresh_report=False)

    runpy.run_path(str(REPORT_GENERATOR), run_name="__main__")
    runpy.run_path(str(ROUTE_REPORT_GENERATOR), run_name="__main__")
    runpy.run_path(str(AUDIT_INDEX_GENERATOR), run_name="__main__")
    runpy.run_path(str(BUILD_VALUES_GENERATOR), run_name="__main__")
    runpy.run_path(str(BUILD_STATUS_GENERATOR), run_name="__main__")
    print("Rebuilt all matrices and refreshed the unified hierarchy, route registry, audit index, build values snapshot, and build status.")


if __name__ == "__main__":
    main()
