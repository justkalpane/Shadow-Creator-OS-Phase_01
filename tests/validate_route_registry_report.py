from __future__ import annotations

import importlib.util
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT_PATH = ROOT / "tmp_audit" / "route_registry_report.md"
GENERATOR_PATH = ROOT / "scripts" / "generate_route_registry_report.py"

if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _load_generator_module():
    spec = importlib.util.spec_from_file_location("generate_route_registry_report", GENERATOR_PATH)
    _assert(spec is not None and spec.loader is not None, f"Unable to load report generator from {GENERATOR_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _normalize_report(text: str) -> str:
    normalized = text.replace("\r\n", "\n").strip() + "\n"
    normalized = re.sub(r"^Generated: .+$", "Generated: <normalized>", normalized, flags=re.MULTILINE)
    return normalized


def main() -> None:
    _assert(REPORT_PATH.exists(), f"Missing route registry report: {REPORT_PATH}")
    _assert(GENERATOR_PATH.exists(), f"Missing route report generator: {GENERATOR_PATH}")

    generator = _load_generator_module()
    generated_report = generator.build_report()
    current_report = REPORT_PATH.read_text(encoding="utf-8")

    _assert(
        _normalize_report(current_report) == _normalize_report(generated_report),
        "Route registry report is out of sync with the generator output.",
    )

    for anchor in [
        "## Route Inventory",
        "## Mode Legality",
        "## Consistency Notes",
    ]:
        _assert(anchor in current_report, f"Route registry report missing required section: {anchor}")

    _assert("| Route ID | Entry workflow | Purpose | Allowed modes | Blocked capabilities |" in current_report,
            "Route registry report missing the inventory table.")
    for route_id in [
        "ROUTE_PHASE1_STANDARD",
        "ROUTE_PHASE1_FAST",
        "ROUTE_PHASE1_REPLAY",
        "ROUTE_PHASE1_ANALYTICS",
    ]:
        _assert(route_id in current_report, f"Route registry report missing route: {route_id}")

    print("Validated route registry report successfully.")


if __name__ == "__main__":
    main()
