from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


def _visual_element(
    element_id: str,
    element_type: str,
    description: str,
    duration_seconds: str,
    timing_marker: str,
) -> dict[str, Any]:
    return {
        "element_id": element_id,
        "type": element_type,
        "description": description,
        "b_roll_suggestions": ["high contrast motion", "close-up reaction", "screen highlight"],
        "estimated_duration": duration_seconds,
        "timing_marker": timing_marker,
    }


def run(input_payload: dict[str, Any]) -> dict[str, Any]:
    dossier_id = input_payload.get("dossier_id")
    if not dossier_id:
        return {
            "status": "failed",
            "error": "missing dossier_id",
            "skill_id": "A-402",
        }

    now = datetime.now(timezone.utc).isoformat()
    ts = int(datetime.now(timezone.utc).timestamp() * 1000)

    thumbnail_packet = input_payload.get("thumbnail_concept_packet")
    if not isinstance(thumbnail_packet, dict):
        thumbnail_packet = {}

    sourced_from = str(thumbnail_packet.get("context", {}).get("sourced_from_packet_id", "CEP-1001"))
    if not sourced_from.startswith("CEP-"):
        sourced_from = "CEP-1001"

    target_platform = str(input_payload.get("target_platform", "youtube")).lower()
    if target_platform not in {"youtube", "tiktok", "instagram"}:
        target_platform = "youtube"

    script_source_id = str(input_payload.get("script_source_id", "FSP-1001"))
    if not script_source_id.startswith("FSP-"):
        script_source_id = "FSP-1001"

    body_elements = [
        _visual_element(
            "graphic_1",
            "graphic",
            "Data-backed visual card introducing the first core insight with animated highlight band.",
            "8.0",
            "00:08-00:16",
        ),
        _visual_element(
            "b_roll_2",
            "b-roll",
            "Contextual office movement and product usage montage to support execution framing.",
            "10.5",
            "00:16-00:27",
        ),
    ]

    return {
        "status": "CREATED",
        "skill_id": "A-402",
        "skill_name": "Visual Asset Planner",
        "instance_id": f"VASP-{ts}",
        "artifact_family": "visual_asset_spec_packet",
        "schema_version": "1.0.0",
        "producer_workflow": "SE-N8N-CWF-420-Visual-Asset-Specs",
        "dossier_ref": str(dossier_id),
        "created_at": now,
        "payload": {
            "narrative": {
                "script_source_id": script_source_id,
                "total_visual_elements": 6,
                "estimated_total_duration": "95",
            },
            "context": {
                "sourced_from_packet_id": sourced_from,
                "target_platform": target_platform,
                "platform_constraints": {
                    "recommended_duration": "30-180 seconds",
                    "aspect_ratio": "16:9" if target_platform == "youtube" else "9:16",
                    "safe_zone_edges": 40,
                },
            },
            "evidence": {
                "hook_sequence": {
                    "duration": "0-8",
                    "visual_elements": [
                        _visual_element(
                            "text_1",
                            "text",
                            "High-contrast hook headline with motion entrance synced to opening beat.",
                            "4.0",
                            "00:00-00:04",
                        )
                    ],
                },
                "body_sequences": [
                    {
                        "section_index": 0,
                        "section_title": "Core Insight",
                        "duration": "8-45",
                        "visual_elements": body_elements,
                    }
                ],
                "closing_sequence": {
                    "duration": "12",
                    "visual_elements": [
                        _visual_element(
                            "transition_1",
                            "transition",
                            "Final CTA transition with end-screen emphasis and actionable prompt.",
                            "3.0",
                            "01:32-01:35",
                        )
                    ],
                },
                "transitions": [
                    {
                        "position": "hook-to-body",
                        "transition_type": "cut",
                        "duration": "250ms",
                        "platform_suitability": "high",
                    },
                    {
                        "position": "body-to-closing",
                        "transition_type": "fade",
                        "duration": "300ms",
                        "platform_suitability": "high",
                    },
                ],
                "overlays": {
                    "text_treatment": "sans-serif",
                    "graphic_style": "minimal",
                    "color_scheme": "match_thumbnail",
                },
            },
            "quality": {
                "visual_consistency": 0.9,
                "narrative_alignment": 0.91,
                "platform_suitability": 0.94,
                "production_feasibility": 0.88,
            },
            "status": {
                "specs_complete": True,
                "platform_compliant": True,
                "next_stage": "CWF-430",
                "decision": "PROCEED_TO_AUDIO_BRIEF",
            },
        },
    }
