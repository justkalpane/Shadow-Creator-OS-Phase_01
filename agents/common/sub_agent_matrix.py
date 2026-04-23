from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
MATRIX_PATH = ROOT / "registries" / "sub_agent_matrix.json"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


@lru_cache(maxsize=1)
def load_sub_agent_matrix() -> dict[str, Any]:
    _assert(MATRIX_PATH.exists(), f"Missing sub-agent matrix registry: {MATRIX_PATH}")
    with MATRIX_PATH.open(encoding="utf-8") as handle:
        data = json.load(handle)
    _assert(isinstance(data, dict), "Sub-agent matrix must be a JSON object.")
    _assert("entries" in data, "Sub-agent matrix missing entries block.")
    _assert(isinstance(data["entries"], list), "Sub-agent matrix entries must be a list.")
    return data


def iter_sub_agent_entries() -> list[dict[str, Any]]:
    return list(load_sub_agent_matrix()["entries"])


def get_sub_agent_entry(workflow_slug: str) -> dict[str, Any]:
    for entry in iter_sub_agent_entries():
        if entry.get("workflow_slug") == workflow_slug:
            return entry
    raise KeyError(workflow_slug)


def get_sub_agent_entries_by_family(workflow_family: str) -> list[dict[str, Any]]:
    return [entry for entry in iter_sub_agent_entries() if entry.get("workflow_family") == workflow_family]
