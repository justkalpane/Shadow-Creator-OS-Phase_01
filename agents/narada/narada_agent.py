# Narada Data Ingestion Agent (v2)
# Production-hardened discovery agent with retry/backoff, timeout control,
# packetized output, governance envelope, and telemetry.

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
except ImportError:  # pragma: no cover - fallback path for minimal runtime
    requests = None


class NaradaAgent:
    def __init__(
        self,
        timeout_seconds: float = 8.0,
        max_retries: int = 3,
        backoff_seconds: float = 0.6,
    ) -> None:
        self.timeout_seconds = timeout_seconds
        self.max_retries = max_retries
        self.backoff_seconds = backoff_seconds
        self.sources = {
            "google_trends_daily_us": (
                "https://trends.google.com/trends/api/dailytrends?hl=en-US&geo=US"
            ),
        }
        self._status_retryable = {429, 500, 502, 503, 504}
        self.authority_profile = get_director_profile("Narada")

    def _utc_now(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    def _request_with_retry(self, url: str) -> dict[str, Any]:
        last_error = ""
        attempts = 0
        started_at = time.perf_counter()

        for attempt in range(1, self.max_retries + 2):
            attempts = attempt
            try:
                response = self._http_get(url)
                if response["status_code"] in self._status_retryable and attempt <= self.max_retries:
                    time.sleep(self.backoff_seconds * (2 ** (attempt - 1)))
                    continue
                elapsed_ms = int((time.perf_counter() - started_at) * 1000)
                if 200 <= response["status_code"] < 300:
                    return {
                        "status": "ok",
                        "http_status": response["status_code"],
                        "attempts": attempts,
                        "elapsed_ms": elapsed_ms,
                        "text": response["text"],
                    }
                return {
                    "status": "error",
                    "http_status": response["status_code"],
                    "attempts": attempts,
                    "elapsed_ms": elapsed_ms,
                    "error": f"http_status_{response['status_code']}",
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

    def _http_get(self, url: str) -> dict[str, Any]:
        if requests is not None:
            response = requests.get(url, timeout=self.timeout_seconds)
            return {"status_code": response.status_code, "text": response.text}

        req = urllib_request.Request(url, headers={"User-Agent": "ShadowEmpire-Narada/2.0"})
        try:
            with urllib_request.urlopen(req, timeout=self.timeout_seconds) as response:
                status_code = response.getcode()
                raw = response.read()
                return {"status_code": status_code, "text": raw.decode("utf-8", errors="replace")}
        except urllib_error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace") if exc.fp else ""
            return {"status_code": exc.code, "text": body}

    def fetch_google_trends(self) -> dict[str, Any]:
        result = self._request_with_retry(self.sources["google_trends_daily_us"])
        if result["status"] != "ok":
            return result

        text = result["text"]
        # Google Trends responses often contain an anti-XSSI prefix.
        cleaned = text[5:] if text.startswith(")]}',") else text
        try:
            parsed = json.loads(cleaned)
        except json.JSONDecodeError:
            parsed = None

        preview = text[:500]
        result_payload = {
            "status": "ok",
            "http_status": result["http_status"],
            "attempts": result["attempts"],
            "elapsed_ms": result["elapsed_ms"],
            "data_preview": preview,
            "json_detected": parsed is not None,
        }
        return result_payload

    def run(self, input_payload: dict[str, Any] | None = None) -> dict[str, Any]:
        payload = input_payload or {}
        started = time.perf_counter()

        dossier_id = payload.get("dossier_id") or f"NARADA-DOSSIER-{int(time.time())}"
        route_id = payload.get("route_id", "ROUTE_PHASE1_STANDARD")

        google_result = self.fetch_google_trends()
        any_success = google_result.get("status") == "ok"

        run_status = "success" if any_success else "failed"
        escalation_required = not any_success
        escalation = (
            {
                "escalation_required": True,
                "escalation_target_workflow": "WF-900",
                "reason_code": "NARADA_SOURCE_FETCH_FAILED",
            }
            if escalation_required
            else {"escalation_required": False}
        )

        total_elapsed_ms = int((time.perf_counter() - started) * 1000)
        instance_id = f"NARADA-{int(time.time())}"

        return {
            "status": run_status,
            "instance_id": instance_id,
            "artifact_family": "narada-discovery-packet",
            "schema_version": "1.0.0",
            "producer_agent": "narada_agent",
            "created_at": self._utc_now(),
            "dossier_ref": dossier_id,
            "route_id": route_id,
            "governance": {
                "director_binding": "Narada",
                "strategic_authority": "Krishna",
                "policy_mode": "governance_safe",
                "authority_mode": self.authority_profile.get("authority_mode", "general"),
                "can_veto": self.authority_profile.get("can_veto", False),
                "release_blocking": self.authority_profile.get("release_blocking", False),
                "authority_profile": self.authority_profile,
                "escalation": escalation,
            },
            "telemetry": {
                "timeout_seconds": self.timeout_seconds,
                "max_retries": self.max_retries,
                "run_elapsed_ms": total_elapsed_ms,
                "source_attempts": {
                    "google_trends_daily_us": google_result.get("attempts", 0),
                },
            },
            "sources": {
                "google_trends_daily_us": google_result,
            },
            "payload": {
                "summary": {
                    "source_count": 1,
                    "successful_sources": 1 if any_success else 0,
                    "failed_sources": 0 if any_success else 1,
                }
            },
        }


if __name__ == "__main__":
    agent = NaradaAgent()
    print(json.dumps(agent.run(), indent=2))
