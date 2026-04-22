from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


REQUIRED_FIELDS = ["dossier_id", "input_payload"]


def run(input_payload: dict[str, Any]) -> dict[str, Any]:
    missing = [field for field in REQUIRED_FIELDS if field not in input_payload]
    if missing:
        return {
            "status": "failed",
            "error_code": "missing_required_fields",
            "missing_fields": missing,
            "sub_skill_id": "SS-223",
            "artifact_family": "knowledge-synthesizer_packet",
            "payload": {},
            "provider_execution_summary": {},
        }

    dossier_id = input_payload.get("dossier_id")
    if not isinstance(dossier_id, str) or not dossier_id.strip():
        return {
            "status": "failed",
            "error_code": "invalid_dossier_id",
            "sub_skill_id": "SS-223",
            "artifact_family": "knowledge-synthesizer_packet",
            "payload": {},
            "provider_execution_summary": {},
        }

    now = datetime.now(timezone.utc).isoformat()
    provider_summary = {
        "selected_provider": input_payload.get("selected_provider", "auto"),
        "route_id": input_payload.get("route_id", "ROUTE_PHASE1_STANDARD"),
        "cost_tier": input_payload.get("cost_tier", "HYBRID_STANDARD"),
    }

    return {
        "status": "success",
        "sub_skill_id": "SS-223",
        "sub_skill_name": "Knowledge Synthesizer",
        "artifact_family": "knowledge-synthesizer_packet",
        "created_at": now,
        "provider_execution_summary": provider_summary,
        "payload": {
            "dossier_id": dossier_id,
            "input_payload": input_payload.get("input_payload", {}),
            "optimization_hints": input_payload.get("optimization_hints", []),
            "constraints": input_payload.get("constraints", {}),
        },
    }
