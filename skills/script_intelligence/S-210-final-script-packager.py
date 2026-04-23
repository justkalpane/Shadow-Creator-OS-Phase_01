from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


def _is_strict_packet_mode(input_payload: dict[str, Any]) -> bool:
    child_workflow_id = str(input_payload.get("child_workflow_id", "")).upper()
    workflow_id = str(input_payload.get("workflow_id", "")).upper()
    return bool(input_payload.get("strict_packet_output", False)) or child_workflow_id == "CWF-240" or workflow_id == "CWF-240"


def run(input_payload: dict[str, Any]) -> dict[str, Any]:
    dossier_id = input_payload.get("dossier_id")
    if not dossier_id:
        return {
            "status": "failed",
            "error": "missing dossier_id",
            "skill_id": "S-210",
        }

    now = datetime.now(timezone.utc).isoformat()
    ts = int(datetime.now(timezone.utc).timestamp() * 1000)

    if _is_strict_packet_mode(input_payload):
        refinement_packet = input_payload.get("script_refinement_packet")
        if not isinstance(refinement_packet, dict):
            refinement_packet = {}
        sections = refinement_packet.get("final_sections")
        if not isinstance(sections, list) or not sections:
            sections = ["Hook", "Core Argument", "Evidence Layer", "Closing CTA"]
        sections = [str(s) for s in sections]

        return {
            "packet_id": f"FSP-{ts}",
            "dossier_id": str(dossier_id),
            "final_title": str(input_payload.get("final_title", "Production Ready Script v1")),
            "final_hook": str(input_payload.get("final_hook", "This one structure changes your outcomes fast.")),
            "final_sections": sections,
            "created_at": now,
        }

    return {
        "status": "success",
        "skill_id": "S-210",
        "skill_name": "final_script_packager",
        "artifact_family": "final-script-packager_packet",
        "created_at": now,
        "payload": {
            "input": input_payload,
            "result": {
                "execution_mode": "replica_runtime",
                "route_context": input_payload.get("route_id", "unknown"),
            },
        },
    }
