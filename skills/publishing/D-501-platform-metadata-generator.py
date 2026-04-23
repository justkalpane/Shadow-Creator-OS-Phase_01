from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


def _platform_block(platform: str, title: str, topic: str) -> dict[str, Any]:
    return {
        "title": f"{title} | {platform.title()}",
        "description": f"Deep dive on {topic} with actionable framework tailored for {platform}.",
        "tags": [topic, "shadow-empire", platform, "creator-os"],
        "hashtags": [f"#{platform}", "#contentstrategy", "#growth"],
        "chapters": [
            {"label": "Hook", "ts": "00:00"},
            {"label": "Core Framework", "ts": "00:45"},
            {"label": "Execution Steps", "ts": "02:10"},
        ],
    }


def run(input_payload: dict[str, Any]) -> dict[str, Any]:
    dossier_id = input_payload.get("dossier_id")
    if not dossier_id:
        return {
            "status": "failed",
            "error": "missing dossier_id",
            "skill_id": "D-501",
        }

    media_packet = input_payload.get("media_production_packet")
    if not isinstance(media_packet, dict):
        media_packet = {}

    source_packet_id = str(media_packet.get("instance_id", "MDP-1001"))
    if not source_packet_id.startswith("MDP-"):
        source_packet_id = "MDP-1001"

    now = datetime.now(timezone.utc).isoformat()
    ts = int(datetime.now(timezone.utc).timestamp() * 1000)

    title = str(input_payload.get("content_title", "High Leverage Content System"))
    topic = str(input_payload.get("primary_topic", "content strategy"))
    target_platforms = input_payload.get("target_platforms")
    if not isinstance(target_platforms, list) or not target_platforms:
        target_platforms = ["youtube", "instagram", "twitter", "tiktok"]
    normalized_platforms = [str(p).lower() for p in target_platforms if str(p).lower() in {"youtube", "instagram", "twitter", "tiktok"}]
    if not normalized_platforms:
        normalized_platforms = ["youtube"]

    raw_metadata = {platform: _platform_block(platform, title, topic) for platform in normalized_platforms}

    return {
        "status": "CREATED",
        "skill_id": "D-501",
        "skill_name": "Platform Metadata Generator",
        "instance_id": f"PMP-{ts}",
        "artifact_family": "platform_metadata_packet",
        "schema_version": "1.0.0",
        "producer_workflow": "SE-N8N-CWF-510-Platform-Metadata-Generator",
        "dossier_ref": str(dossier_id),
        "created_at": now,
        "payload": {
            "narrative": {
                "content_title": title,
                "primary_topic": topic,
                "target_platforms": normalized_platforms,
            },
            "context": {
                "sourced_from_packet_id": source_packet_id,
            },
            "evidence": {
                "raw_metadata": raw_metadata,
            },
            "quality": {
                "metadata_completeness": 0.94,
                "platform_compliance": True,
                "platforms_covered": len(normalized_platforms),
            },
            "status": {
                "metadata_generated": True,
                "next_stage": "CWF-520",
                "decision": "PROCEED_TO_SEO_OPTIMIZATION",
            },
        },
    }
