from __future__ import annotations

import importlib.util
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT_PATH = ROOT / "tmp_audit" / "unified_hierarchy_report.md"
GENERATOR_PATH = ROOT / "scripts" / "generate_unified_hierarchy_report.py"

if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _load_generator_module():
    spec = importlib.util.spec_from_file_location("generate_unified_hierarchy_report", GENERATOR_PATH)
    _assert(spec is not None and spec.loader is not None, f"Unable to load report generator from {GENERATOR_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _normalize_report(text: str) -> str:
    normalized = text.replace("\r\n", "\n").strip() + "\n"
    normalized = re.sub(r"^Generated: .+$", "Generated: <normalized>", normalized, flags=re.MULTILINE)
    return normalized


def main() -> None:
    _assert(REPORT_PATH.exists(), f"Missing unified hierarchy report: {REPORT_PATH}")
    _assert(GENERATOR_PATH.exists(), f"Missing report generator: {GENERATOR_PATH}")

    generator = _load_generator_module()
    generated_report = generator.build_report()
    current_report = REPORT_PATH.read_text(encoding="utf-8")

    normalized_generated = _normalize_report(generated_report)
    normalized_current = _normalize_report(current_report)

    _assert(
        normalized_current == normalized_generated,
        "Unified hierarchy report is out of sync with the generator output.",
    )

    for anchor in [
        "## Executive Summary",
        "## Scope",
        "## Routing Map",
        "## Pack Routing Tree",
        "## Agent Estate",
        "## Sub-agent Estate",
        "## Director Coverage Notes",
        "## Cross-Layer Observations",
    ]:
        _assert(anchor in current_report, f"Unified hierarchy report missing required section: {anchor}")

    _assert("| Director | Agent runtime | Sub-agent primary | Workflow primary IDs | Workflow support IDs | Escalation WF | Source packs |" in current_report,
            "Unified hierarchy report missing the routing summary table.")
    _assert("### ROOT" in current_report, "Unified hierarchy report missing the root pack section.")
    _assert("### WF-100" in current_report, "Unified hierarchy report missing the WF-100 pack section.")

    print("Validated unified hierarchy report successfully.")


if __name__ == "__main__":
    main()
