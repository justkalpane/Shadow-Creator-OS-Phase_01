<<<<<<< HEAD
"""
Execution Contract Layer
Shadow Creator OS

Defines strict runtime execution schema for skills.
"""

from typing import Dict, Any
import time

REQUIRED_INPUT_FIELDS = ["skill_id", "input_payload"]
REQUIRED_OUTPUT_FIELDS = ["status", "result", "error", "execution_time"]

class ExecutionContract:
    def __init__(self, skill_id: str, input_payload: Dict[str, Any]):
        self.skill_id = skill_id
        self.input_payload = input_payload
        self.start_time = time.time()
        self.result = None
        self.error = None

    def validate_input(self):
        if not self.skill_id:
            raise ValueError("Missing skill_id")
        if not isinstance(self.input_payload, dict):
            raise ValueError("input_payload must be dict")

    def execute(self, skill_callable):
        try:
            self.validate_input()
            self.result = skill_callable(self.input_payload)
            status = "success"
        except Exception as e:
            self.error = str(e)
            status = "failed"
        execution_time = time.time() - self.start_time
        return {
            "status": status,
            "result": self.result,
            "error": self.error,
            "execution_time": execution_time
        }
=======
from __future__ import annotations

import time
from typing import Any, Callable


class ExecutionContract:
    """Uniform execution wrapper for skill callables."""

    def execute(self, skill_callable: Callable[[dict[str, Any]], Any], input_payload: dict[str, Any]) -> dict[str, Any]:
        started = time.perf_counter()
        try:
            result = skill_callable(input_payload)
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
>>>>>>> e07941e (sync: local changes before pull)
