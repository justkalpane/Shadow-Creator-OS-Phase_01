from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


def _is_strict_packet_mode(input_payload: dict[str, Any]) -> bool:
    child_workflow_id = str(input_payload.get("child_workflow_id", "")).upper()
    workflow_id = str(input_payload.get("workflow_id", "")).upper()
    return bool(input_payload.get("strict_packet_output", False)) or child_workflow_id == "CWF-210" or workflow_id == "CWF-210"


def run(input_payload: dict[str, Any]) -> dict[str, Any]:
    dossier_id = input_payload.get("dossier_id")
    if not dossier_id:
        return {
            "status": "failed",
            "error": "missing dossier_id",
            "skill_id": "S-202",
        }

    now = datetime.now(timezone.utc).isoformat()
    ts = int(datetime.now(timezone.utc).timestamp() * 1000)

    if _is_strict_packet_mode(input_payload):
        return {
            "packet_id": f"SDP-{ts}",
            "dossier_id": str(dossier_id),
            "title": str(input_payload.get("title", "Structured Draft v1")),
            "hook": str(input_payload.get("hook", "This method compresses months of trial-and-error into one repeatable flow.")),
            "section_plan": [
                "Opening Hook",
                "Problem Framing",
                "Method Breakdown",
                "Evidence & Proof",
                "Execution CTA",
            ],
            "created_at": now,
        }

    return {
        "status": "success",
        "skill_id": "S-202",
        "skill_name": "first_draft_generation",
        "artifact_family": "first-draft-generation_packet",
        "created_at": now,
        "payload": {
            "input": input_payload,
            "result": {
                "execution_mode": "replica_runtime",
                "route_context": input_payload.get("route_id", "unknown"),
            },
        },
    }
