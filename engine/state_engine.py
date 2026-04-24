from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from engine.skill_catalog import ROOT


DOSSIER_DIR = ROOT / "data" / "dossiers"


class DossierStore:
    """Append-only dossier event store for cross-workflow runtime continuity."""

    def __init__(self, base_dir: Path | None = None) -> None:
        self.base_dir = base_dir or DOSSIER_DIR
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def _path(self, dossier_id: str) -> Path:
        token = "".join(ch for ch in str(dossier_id) if ch.isalnum() or ch in {"-", "_"}).strip() or "DOSSIER"
        return self.base_dir / f"{token}.json"

    def load(self, dossier_id: str) -> dict[str, Any]:
        path = self._path(dossier_id)
        if not path.exists():
            return {"dossier_id": dossier_id, "events": []}
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            data = {}
        if not isinstance(data, dict):
            data = {}
        events = data.get("events", [])
        if not isinstance(events, list):
            events = []
        return {
            "dossier_id": str(data.get("dossier_id", dossier_id)),
            "events": events,
        }

    def save(self, dossier_id: str, state: dict[str, Any]) -> None:
        payload = {
            "dossier_id": str(state.get("dossier_id", dossier_id)),
            "events": list(state.get("events", [])),
        }
        self._path(dossier_id).write_text(json.dumps(payload, indent=2), encoding="utf-8")

    def append(self, dossier_id: str, data: dict[str, Any]) -> dict[str, Any]:
        state = self.load(dossier_id)
        events = list(state.get("events", []))
        entry = dict(data)
        entry.setdefault("timestamp", datetime.now(timezone.utc).isoformat())
        events.append(entry)
        state["events"] = events
        self.save(dossier_id, state)
        return entry
