from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
MATRIX_PATH = ROOT / "registries" / "director_binding_matrix.json"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


@lru_cache(maxsize=1)
def load_director_binding_matrix() -> dict[str, Any]:
    _assert(MATRIX_PATH.exists(), f"Missing director binding matrix registry: {MATRIX_PATH}")
    with MATRIX_PATH.open(encoding="utf-8") as handle:
        data = json.load(handle)
    _assert(isinstance(data, dict), "Director binding matrix must be a JSON object.")
    _assert("entries" in data, "Director binding matrix missing entries block.")
    _assert(isinstance(data["entries"], list), "Director binding matrix entries must be a list.")
    return data


def iter_director_binding_entries() -> list[dict[str, Any]]:
    return list(load_director_binding_matrix()["entries"])


def get_director_binding_entry(director_name: str) -> dict[str, Any]:
    for entry in iter_director_binding_entries():
        if entry.get("director_name") == director_name:
            return entry
    raise KeyError(director_name)
