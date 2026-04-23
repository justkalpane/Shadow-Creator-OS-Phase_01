from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


def _is_strict_packet_mode(input_payload: dict[str, Any]) -> bool:
    child_workflow_id = str(input_payload.get("child_workflow_id", "")).upper()
    workflow_id = str(input_payload.get("workflow_id", "")).upper()
    return bool(input_payload.get("strict_packet_output", False)) or child_workflow_id == "CWF-310" or workflow_id == "CWF-310"


def run(input_payload: dict[str, Any]) -> dict[str, Any]:
    dossier_id = input_payload.get("dossier_id")
    if not dossier_id:
        return {
            "status": "failed",
            "error": "missing dossier_id",
            "skill_id": "P-301",
        }

    now = datetime.now(timezone.utc).isoformat()
    ts = int(datetime.now(timezone.utc).timestamp() * 1000)

    if _is_strict_packet_mode(input_payload):
        final_script_packet = input_payload.get("final_script_packet")
        if not isinstance(final_script_packet, dict):
            final_script_packet = {}
        source_packet_id = str(final_script_packet.get("packet_id", f"FSP-{ts}"))

        return {
            "packet_id": f"ECP-{ts}",
            "dossier_id": str(dossier_id),
            "context_type": "runtime",
            "intent": str(input_payload.get("intent", "Build execution context envelope for downstream runtime stages.")),
            "audience": str(input_payload.get("audience", "creator")),
            "tone": str(input_payload.get("tone", "strategic")),
            "evidence_standard": "standard",
            "constraints": [
                "Do not mutate dossier history entries",
                "Use approved provider callbacks only",
                "Preserve packet lineage references",
            ],
            "source_packet_refs": [source_packet_id],
            "target_module": "context_engineering",
            "context_version": 1,
            "payload": {
                "execution_requirements": {
                    "allowed_tools": ["n8n", "packet_validator", "runtime_router"],
                    "forbidden_tools": ["destructive_fs_ops"],
                    "execution_mode": "supervised",
                },
                "target_platform": str(input_payload.get("target_platform", "youtube")),
            },
            "status": "created",
        }

    return {
        "status": "success",
        "skill_id": "P-301",
        "skill_name": "execution_context_engineer",
        "artifact_family": "execution-context-engineer_packet",
        "created_at": now,
        "payload": {
            "input": input_payload,
            "result": {
                "execution_mode": "replica_runtime",
                "route_context": input_payload.get("route_id", "unknown"),
            },
        },
    }
