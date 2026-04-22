<<<<<<< HEAD
import json

from engine.runtime_router import RuntimeRouter
from engine.registry_mapper import build_registry


class ChainExecutor:

    def __init__(self):
        self.router = RuntimeRouter(build_registry())

    def execute_chain(self, chain, initial_input):
        context = {
            "input": initial_input,
            "history": []
        }

        for step in chain:
            result = self.router.route(
                step,
                {"input": context["input"]}
            )

            context["history"].append({
                "step": step,
                "output": result
            })

            if isinstance(result, dict):
                context["input"] = result.get("output")
            else:
                context["input"] = result

        return {
            "final_output": context["input"],
            "trace": context["history"]
        }
=======
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
>>>>>>> e07941e (sync: local changes before pull)
