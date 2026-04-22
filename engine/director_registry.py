from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIRECTORS_DIR = ROOT / "directors"
OUTPUT = ROOT / "engine" / "director_runtime_index.json"


def build_director_index() -> dict[str, dict[str, str]]:
    index: dict[str, dict[str, str]] = {}
    for path in sorted(DIRECTORS_DIR.rglob("*.md")):
        director_id = path.stem.lower().replace("-", "_")
        index[director_id] = {
            "id": director_id,
            "path": path.as_posix(),
            "council": path.parent.name,
        }
    OUTPUT.write_text(json.dumps(index, indent=2), encoding="utf-8")
    return index


if __name__ == "__main__":
    print(json.dumps({"directors": len(build_director_index())}, indent=2))
