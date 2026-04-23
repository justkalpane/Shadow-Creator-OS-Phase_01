from __future__ import annotations

import time
from typing import Any, Callable


class ExecutionContract:
    """Uniform execution wrapper for skill callables."""

    def __init__(self, skill_id: str | None = None, input_payload: dict[str, Any] | None = None) -> None:
        self.skill_id = skill_id
        self.input_payload = input_payload or {}

    def validate_input(self) -> None:
        if not self.skill_id:
            raise ValueError("Missing skill_id")
        if not isinstance(self.input_payload, dict):
            raise ValueError("input_payload must be dict")

    def execute(self, skill_callable: Callable[[dict[str, Any]], Any], input_payload: dict[str, Any] | None = None) -> dict[str, Any]:
        payload = self.input_payload if input_payload is None else input_payload
        started = time.perf_counter()
        try:
            if not isinstance(payload, dict):
                raise ValueError("input_payload must be dict")
            result = skill_callable(payload)
            return {
                "status": "success",
                "result": result,
                "error": None,
                "execution_time": round(time.perf_counter() - started, 6),
            }
        except Exception as exc:  # pragma: no cover - defensive runtime guard
            return {
                "status": "failed",
                "result": None,
                "error": str(exc),
                "execution_time": round(time.perf_counter() - started, 6),
            }
