from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCAN_ROOTS = [
    ROOT / "agents" / "common",
    ROOT / "engine",
    ROOT / "n8n" / "workflows",
    ROOT / "data" / "bootstrap" / "data_tables",
]

ALLOWED_ROUTE_IDS = {
    "ROUTE_PHASE1_STANDARD",
    "ROUTE_PHASE1_FAST",
    "ROUTE_PHASE1_REPLAY",
    "ROUTE_PHASE1_ANALYTICS",
    "ROUTE_MAP",
}

LEGACY_DASHED_ROUTE = re.compile(r"\bROUTE-\d+\b")
NON_CANONICAL_ROUTE = re.compile(r"\bROUTE_(?!PHASE1_|MAP)[A-Z0-9_]+\b")


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _iter_scan_files() -> list[Path]:
    files: list[Path] = []
    for root in SCAN_ROOTS:
        if root.is_file():
            files.append(root)
            continue
        files.extend(sorted(p for p in root.rglob("*") if p.is_file()))
    return files


def main() -> None:
    violations: list[str] = []

    for path in _iter_scan_files():
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except Exception:
            continue

        for match in LEGACY_DASHED_ROUTE.findall(text):
            violations.append(f"{path}: {match}")

        for match in NON_CANONICAL_ROUTE.findall(text):
            if match not in ALLOWED_ROUTE_IDS:
                violations.append(f"{path}: {match}")

    _assert(
        not violations,
        "Non-canonical route identifiers found in runtime assets:\n" + "\n".join(sorted(set(violations))),
    )

    print("Validated canonical Phase-1 route namespace successfully.")


if __name__ == "__main__":
    main()
