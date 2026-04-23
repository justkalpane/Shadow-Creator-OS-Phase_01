from __future__ import annotations

import importlib.util
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT_PATH = ROOT / "tmp_audit" / "audit_index.md"
GENERATOR_PATH = ROOT / "scripts" / "generate_audit_index.py"

if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _load_generator_module():
    spec = importlib.util.spec_from_file_location("generate_audit_index", GENERATOR_PATH)
    _assert(spec is not None and spec.loader is not None, f"Unable to load audit index generator from {GENERATOR_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _normalize_report(text: str) -> str:
    normalized = text.replace("\r\n", "\n").strip() + "\n"
    normalized = re.sub(r"^Generated: .+$", "Generated: <normalized>", normalized, flags=re.MULTILINE)
    return normalized


def main() -> None:
    _assert(REPORT_PATH.exists(), f"Missing audit index: {REPORT_PATH}")
    _assert(GENERATOR_PATH.exists(), f"Missing audit index generator: {GENERATOR_PATH}")

    generator = _load_generator_module()
    generated_report = generator.build_report()
    current_report = REPORT_PATH.read_text(encoding="utf-8")

    _assert(
        _normalize_report(current_report) == _normalize_report(generated_report),
        "Audit index is out of sync with the generator output.",
    )

    for anchor in [
        "## Primary Entrypoints",
        "## Validators",
        "## Matrix Builders",
        "## Notes",
    ]:
        _assert(anchor in current_report, f"Audit index missing required section: {anchor}")

    for fragment in [
        "unified_hierarchy_report.md",
        "route_registry_report.md",
        "validate_unified_hierarchy_report.py",
        "validate_route_registry_report.py",
        "rebuild_all_matrices.py",
    ]:
        _assert(fragment in current_report, f"Audit index missing reference: {fragment}")

    print("Validated audit index successfully.")


if __name__ == "__main__":
    main()
