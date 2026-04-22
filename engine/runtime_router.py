<<<<<<< HEAD
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
=======
from __future__ import annotations

import importlib.util
import time
from pathlib import Path
from typing import Any

from engine.execution_contract import ExecutionContract


class RuntimeRouter:
    def __init__(self, registry: dict[str, dict[str, str]]) -> None:
        self.registry = registry
        self.contract = ExecutionContract()

    def _load_callable(self, module_path: str, entrypoint: str):
        path = Path(module_path)
        if not path.exists():
            raise FileNotFoundError(f"Skill module not found: {module_path}")

        safe_name = "skill_" + path.stem.replace("-", "_").replace(".", "_")
        spec = importlib.util.spec_from_file_location(safe_name, path)
        if spec is None or spec.loader is None:
            raise RuntimeError(f"Unable to load module: {module_path}")

        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        if not hasattr(module, entrypoint):
            raise AttributeError(f"Entrypoint '{entrypoint}' not found in {module_path}")
        return getattr(module, entrypoint)

    def route(self, skill_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        started = time.perf_counter()
        if skill_id not in self.registry:
            return {
                "status": "failed",
                "error": f"Unknown skill_id: {skill_id}",
                "result": None,
                "routing": {"skill_id": skill_id, "resolved_to": None, "latency": 0.0},
            }

        target = self.registry[skill_id]
        callable_fn = self._load_callable(target["module_path"], target.get("entrypoint", "run"))
        outcome = self.contract.execute(callable_fn, payload)
        outcome["routing"] = {
            "skill_id": skill_id,
            "resolved_to": f"{target['module_path']}:{target.get('entrypoint', 'run')}",
            "latency": round(time.perf_counter() - started, 6),
        }
        return outcome
>>>>>>> e07941e (sync: local changes before pull)
