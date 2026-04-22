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
