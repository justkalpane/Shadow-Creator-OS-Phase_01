from __future__ import annotations

import importlib.util
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
STATUS_PATH = ROOT / "BUILD_STATUS.md"
GENERATOR_PATH = ROOT / "scripts" / "generate_build_status.py"

if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _load_generator_module():
    spec = importlib.util.spec_from_file_location("generate_build_status", GENERATOR_PATH)
    _assert(spec is not None and spec.loader is not None, f"Unable to load build status generator from {GENERATOR_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _normalize(text: str) -> str:
    normalized = text.replace("\r\n", "\n").strip() + "\n"
    normalized = re.sub(r"^Generated from snapshot: .+$", "Generated from snapshot: <normalized>", normalized, flags=re.MULTILINE)
    return normalized


def main() -> None:
    _assert(STATUS_PATH.exists(), f"Missing build status file: {STATUS_PATH}")
    _assert(GENERATOR_PATH.exists(), f"Missing build status generator: {GENERATOR_PATH}")

    generator = _load_generator_module()
    generated = generator.build_report()
    current = STATUS_PATH.read_text(encoding="utf-8")

    _assert(_normalize(current) == _normalize(generated), "BUILD_STATUS.md is out of sync with the snapshot-driven generator.")

    for anchor in [
        "## Live State",
        "## Core Values",
        "## Route Snapshot",
        "## Blockers",
        "## Report Freshness",
        "## Source Truth",
    ]:
        _assert(anchor in current, f"Build status missing section: {anchor}")

    for fragment in [
        "Agents",
        "Sub-agents",
        "Directors",
        "Route registry entries",
        "Open build blockers",
        "Open release packets",
    ]:
        _assert(fragment in current, f"Build status missing value: {fragment}")

    print("Validated BUILD_STATUS.md successfully.")


if __name__ == "__main__":
    main()
