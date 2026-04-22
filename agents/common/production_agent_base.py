from __future__ import annotations

import json
import time
from datetime import datetime, timezone
from typing import Any
from urllib import error as urllib_error
from urllib import request as urllib_request

from agents.common.director_authority_profiles import get_director_profile

try:
    import requests  # type: ignore
except ImportError:  # pragma: no cover
    requests = None


class ProductionAgentBase:
    def __init__(
        self,
        agent_slug: str,
        director_binding: str,
        artifact_family: str,
        timeout_seconds: float = 8.0,
        max_retries: int = 2,
        backoff_seconds: float = 0.4,
    ) -> None:
        self.agent_slug = agent_slug
        self.director_binding = director_binding
        self.artifact_family = artifact_family
        self.timeout_seconds = timeout_seconds
        self.max_retries = max_retries
        self.backoff_seconds = backoff_seconds
        self.authority_profile = get_director_profile(director_binding)
        self._status_retryable = {429, 500, 502, 503, 504}

    def _utc_now(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    def _http_get(self, url: str) -> dict[str, Any]:
        if requests is not None:
            response = requests.get(url, timeout=self.timeout_seconds)
            return {"status_code": response.status_code, "text": response.text}

        req = urllib_request.Request(url, headers={"User-Agent": "ShadowEmpire-Agent/2.0"})
        try:
            with urllib_request.urlopen(req, timeout=self.timeout_seconds) as response:
                raw = response.read().decode("utf-8", errors="replace")
                return {"status_code": response.getcode(), "text": raw}
        except urllib_error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace") if exc.fp else ""
            return {"status_code": exc.code, "text": body}

    def _request_with_retry(self, url: str) -> dict[str, Any]:
        last_error = ""
        started_at = time.perf_counter()
        attempts = 0

        for attempt in range(1, self.max_retries + 2):
            attempts = attempt
            try:
                response = self._http_get(url)
                code = response["status_code"]
                if code in self._status_retryable and attempt <= self.max_retries:
                    time.sleep(self.backoff_seconds * (2 ** (attempt - 1)))
                    continue

                elapsed_ms = int((time.perf_counter() - started_at) * 1000)
                if 200 <= code < 300:
                    return {
                        "status": "ok",
                        "http_status": code,
                        "attempts": attempts,
                        "elapsed_ms": elapsed_ms,
                        "text": response["text"],
                    }
                return {
                    "status": "error",
                    "http_status": code,
                    "attempts": attempts,
                    "elapsed_ms": elapsed_ms,
                    "error": f"http_status_{code}",
                }
            except Exception as exc:
                last_error = str(exc)
                if attempt <= self.max_retries:
                    time.sleep(self.backoff_seconds * (2 ** (attempt - 1)))

        elapsed_ms = int((time.perf_counter() - started_at) * 1000)
        return {
            "status": "error",
            "http_status": None,
            "attempts": attempts,
            "elapsed_ms": elapsed_ms,
            "error": last_error or "request_failed",
        }

    def execute_core(self, input_payload: dict[str, Any]) -> dict[str, Any]:
        task_type = str(input_payload.get("task_type", "general")).lower()
        risk_score = float(input_payload.get("risk_score", 35))
        confidence = float(input_payload.get("confidence", 0.8))
        cost_tier = str(input_payload.get("cost_tier", "TIER_2")).upper()
        release_candidate = bool(input_payload.get("release_candidate", False))

        authority_mode = str(self.authority_profile.get("authority_mode", "general"))
        can_veto = bool(self.authority_profile.get("can_veto", False))
        release_blocking = bool(self.authority_profile.get("release_blocking", False))

        decision = "approve"
        reason = "within_authority_thresholds"
        next_route = "ROUTE_PHASE1_STANDARD"
        escalation_required = False
        escalation_workflow = str(self.authority_profile.get("escalation_workflow", "WF-900"))

        if can_veto and risk_score >= 85:
            decision = "veto"
            reason = "high_risk_block"
            escalation_required = True
        elif authority_mode in {"kernel_governance", "policy_gate"} and risk_score >= 70:
            decision = "escalate"
            reason = "governance_threshold_exceeded"
            escalation_required = True
        elif authority_mode == "cost_gate" and cost_tier in {"TIER_1", "PREMIUM", "ENTERPRISE"}:
            decision = "escalate"
            reason = "cost_gate_review_required"
            escalation_required = True
        elif authority_mode in {"orchestrator", "orchestration", "routing_gate"} and task_type in {
            "routing",
            "orchestration",
            "workflow_selection",
        }:
            decision = "route"
            reason = "routing_authority_engaged"
            next_route = "ROUTE_PHASE1_FAST" if confidence >= 0.9 else "ROUTE_PHASE1_STANDARD"
        elif authority_mode in {"analysis"} and task_type in {"trend_analysis", "research", "intelligence"}:
            decision = "analyze"
            reason = "analysis_authority_engaged"
        elif authority_mode in {"production"} and task_type in {"render", "edit", "media_production"}:
            decision = "produce"
            reason = "production_authority_engaged"
        elif authority_mode in {"distribution"} and task_type in {"publish", "distribution", "engagement"}:
            decision = "distribute"
            reason = "distribution_authority_engaged"

        if release_candidate and release_blocking and confidence < 0.75:
            decision = "escalate"
            reason = "release_blocking_low_confidence"
            escalation_required = True

        return {
            "status": "ok" if not escalation_required else "error",
            "attempts": 0,
            "elapsed_ms": 0,
            "error": None if not escalation_required else reason,
            "result": {
                "mode": "replica_runtime",
                "message": "Authority-profiled decision engine executed.",
                "input_keys": sorted(list(input_payload.keys())),
                "authority_profile": self.authority_profile,
                "decision": {
                    "decision": decision,
                    "reason": reason,
                    "risk_score": risk_score,
                    "confidence": confidence,
                    "release_candidate": release_candidate,
                    "next_route": next_route,
                },
                "escalation_workflow": escalation_workflow if escalation_required else None,
            },
        }

    def run(self, input_payload: dict[str, Any] | None = None) -> dict[str, Any]:
        payload = input_payload or {}
        started = time.perf_counter()

        dossier_id = payload.get("dossier_id") or f"{self.agent_slug.upper()}-DOSSIER-{int(time.time())}"
        route_id = payload.get("route_id", "ROUTE_PHASE1_STANDARD")

        core = self.execute_core(payload)
        run_status = "success" if core.get("status") == "ok" else "failed"
        escalation_required = run_status != "success"
        escalation_workflow = core.get("result", {}).get("escalation_workflow") or self.authority_profile.get(
            "escalation_workflow", "WF-900"
        )

        escalation = (
            {
                "escalation_required": True,
                "escalation_target_workflow": escalation_workflow,
                "reason_code": f"{self.agent_slug.upper()}_RUNTIME_FAILURE",
            }
            if escalation_required
            else {"escalation_required": False}
        )

        return {
            "status": run_status,
            "instance_id": f"{self.agent_slug.upper()}-{int(time.time())}",
            "artifact_family": self.artifact_family,
            "schema_version": "1.0.0",
            "producer_agent": f"{self.agent_slug}_agent",
            "created_at": self._utc_now(),
            "dossier_ref": dossier_id,
            "route_id": route_id,
            "governance": {
                "director_binding": self.director_binding,
                "strategic_authority": "Krishna",
                "policy_mode": "governance_safe",
                "authority_mode": self.authority_profile.get("authority_mode", "general"),
                "can_veto": self.authority_profile.get("can_veto", False),
                "release_blocking": self.authority_profile.get("release_blocking", False),
                "escalation": escalation,
            },
            "telemetry": {
                "timeout_seconds": self.timeout_seconds,
                "max_retries": self.max_retries,
                "run_elapsed_ms": int((time.perf_counter() - started) * 1000),
                "core_attempts": core.get("attempts", 0),
                "core_elapsed_ms": core.get("elapsed_ms", 0),
            },
            "payload": {
                "summary": {
                    "status": core.get("status"),
                    "error": core.get("error"),
                },
                "core_result": core.get("result", {}),
            },
        }


def print_run(agent: ProductionAgentBase) -> None:
    print(json.dumps(agent.run(), indent=2))
