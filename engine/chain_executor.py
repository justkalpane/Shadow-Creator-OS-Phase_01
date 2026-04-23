from __future__ import annotations

from typing import Any

from engine.registry_mapper import build_registry
from engine.runtime_router import RuntimeRouter


class ChainExecutor:
    def __init__(self) -> None:
        self.router = RuntimeRouter(build_registry())

    def execute_chain(self, chain: list[str], initial_input: str) -> dict[str, Any]:
        context_input: Any = initial_input
        trace: list[dict[str, Any]] = []

        for step in chain:
            result = self.router.route(step, {"input": context_input})
            trace.append({"step": step, "result": result})
            if isinstance(result, dict):
                context_input = result.get("result") or result.get("output") or result
            else:
                context_input = result

        return {"final_output": context_input, "trace": trace}
