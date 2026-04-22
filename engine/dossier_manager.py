from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DOSSIER_DIR = ROOT / "data" / "dossiers"
DOSSIER_DIR.mkdir(parents=True, exist_ok=True)


class DossierManager:
    def create_dossier(self) -> str:
        dossier_id = str(uuid.uuid4())
        dossier = {
            "dossier_id": dossier_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "history": [],
            "context": {},
        }
        self._save(dossier_id, dossier)
        return dossier_id

    def load_dossier(self, dossier_id: str) -> dict[str, Any] | None:
        path = DOSSIER_DIR / f"{dossier_id}.json"
        if not path.exists():
            return None
        return json.loads(path.read_text(encoding="utf-8"))

    def update_dossier(self, dossier_id: str, step: str, input_data: Any, output_data: Any) -> None:
        dossier = self.load_dossier(dossier_id)
        if dossier is None:
            return

        entry = {
            "step": step,
            "input": input_data,
            "output": output_data,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        dossier["history"].append(entry)
        dossier["context"] = {"latest_input": input_data, "latest_output": output_data}
        self._save(dossier_id, dossier)

    def _save(self, dossier_id: str, payload: dict[str, Any]) -> None:
        path = DOSSIER_DIR / f"{dossier_id}.json"
        path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
