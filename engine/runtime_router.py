"""
Runtime Router
Routes skill_id -> loads skill -> validates -> executes via execution_contract
"""

import importlib
import time
from typing import Dict, Any

from engine.execution_contract import ExecutionContract
from engine.validator_runtime import validate_input


class RuntimeRouter:
    def __init__(self, registry: Dict[str, str]):
        """
        registry = {
            "skill_id": "module.path:function_name"
        }
        """
        self.registry = registry

    def resolve(self, skill_id: str):
        if skill_id not in self.registry:
            raise ValueError(f"Skill not found in registry: {skill_id}")

        module_path, func_name = self.registry[skill_id].split(":")
        module = importlib.import_module(module_path)
        return getattr(module, func_name)

    def route(self, skill_id: str, input_payload: Dict[str, Any]):
        start_time = time.time()

        # Step 1: Validate
        validate_input(skill_id, input_payload)

        # Step 2: Resolve
        skill_callable = self.resolve(skill_id)

        # Step 3: Execute via contract
        contract = ExecutionContract(skill_id, input_payload)
        result = contract.execute(skill_callable)

        # Step 4: Attach routing metadata
        result["routing"] = {
            "skill_id": skill_id,
            "resolved_to": self.registry.get(skill_id),
            "latency": round(time.time() - start_time, 4)
        }

        return result


# Example registry (to be replaced by registry layer)
DEFAULT_REGISTRY = {
    # "voice.generate": "skills.voice.generate:run"
}


if __name__ == "__main__":
    router = RuntimeRouter(DEFAULT_REGISTRY)

    # Example call
    # response = router.route("voice.generate", {"text": "Hello"})
    # print(response)
