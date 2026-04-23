from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
MATRIX_PATH = ROOT / "registries" / "agent_class_matrix.json"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


@lru_cache(maxsize=1)
def load_agent_class_matrix() -> dict[str, Any]:
    _assert(MATRIX_PATH.exists(), f"Missing agent class matrix registry: {MATRIX_PATH}")
    with MATRIX_PATH.open(encoding="utf-8") as handle:
        data = json.load(handle)

    _assert(isinstance(data, dict), "Agent class matrix must be a JSON object.")
    _assert("entries" in data, "Agent class matrix missing entries block.")
    _assert(isinstance(data["entries"], list), "Agent class matrix entries must be a list.")
    return data


def iter_agent_class_entries() -> list[dict[str, Any]]:
    return list(load_agent_class_matrix()["entries"])


def get_agent_class_entry(agent_slug: str) -> dict[str, Any]:
    for entry in iter_agent_class_entries():
        if entry.get("agent_slug") == agent_slug:
            return entry
    raise KeyError(agent_slug)


def get_agent_class_entries_by_family(class_family: str) -> list[dict[str, Any]]:
    return [entry for entry in iter_agent_class_entries() if entry.get("class_family") == class_family]
