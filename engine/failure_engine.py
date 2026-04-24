from __future__ import annotations

from typing import Any, Callable


class FailureEngine:
    """Structured retry/fallback failure handler for runtime stages."""

    def handle(
        self,
        error: Exception | str,
        context: dict[str, Any],
        execute_fn: Callable[[], Any] | None = None,
        fallback_fn: Callable[[], Any] | None = None,
    ) -> dict[str, Any]:
        retry_count = int(context.get("retry_count", 0) or 0)
        stage = str(context.get("stage", "unknown"))
        message = str(error)

        if execute_fn is not None and retry_count > 0:
            for attempt in range(1, retry_count + 1):
                try:
                    result = execute_fn()
                    if not (isinstance(result, dict) and result.get("status") == "failed"):
                        return {
                            "status": "success",
                            "mode": "retry",
                            "attempt": attempt,
                            "stage": stage,
                            "result": result,
                        }
                except Exception as exc:  # pragma: no cover - runtime boundary
                    message = str(exc)

        if fallback_fn is not None:
            try:
                fallback = fallback_fn()
                return {
                    "status": "success" if not (isinstance(fallback, dict) and fallback.get("status") == "failed") else "failed",
                    "mode": "fallback",
                    "stage": stage,
                    "result": fallback,
                    "error": None if not (isinstance(fallback, dict) and fallback.get("status") == "failed") else str(fallback.get("error", "")),
                }
            except Exception as exc:  # pragma: no cover - runtime boundary
                message = str(exc)

        return {
            "status": "failed",
            "mode": "terminal",
            "stage": stage,
            "error": message,
        }
