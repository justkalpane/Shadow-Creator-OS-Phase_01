from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


def run(input_payload: dict[str, Any]) -> dict[str, Any]:
    dossier_id = input_payload.get("dossier_id")
    if not dossier_id:
        return {
            "status": "failed",
            "error": "missing dossier_id",
            "skill_id": "M-021",
        }

    now = datetime.now(timezone.utc).isoformat()
    return {
        "status": "success",
        "skill_id": "M-021",
        "skill_name": "Fact Cross-Verification Unit",
        "artifact_family": "fact-cross-verification-unit_packet",
        "created_at": now,
        "payload": {
            "input": input_payload,
            "result": {
                "execution_mode": "replica_runtime",
                "route_context": input_payload.get("route_id", "unknown"),
            },
        },
    }
