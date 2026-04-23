from __future__ import annotations

import importlib.util
import time
from pathlib import Path
from typing import Any

from engine.execution_contract import ExecutionContract
from engine.skill_catalog import ROOT


class RuntimeRouter:
    def __init__(self, registry: dict[str, dict[str, str] | str]) -> None:
        self.registry = registry
        self.contract = ExecutionContract()

    def _resolve_entry(self, skill_id: str) -> dict[str, str] | None:
        entry = self.registry.get(skill_id)
        if entry is None:
            return None
        if isinstance(entry, str):
            module_path, entrypoint = entry.split(":", 1)
            return {"module_path": module_path, "entrypoint": entrypoint}
        return entry

    def _load_callable(self, module_path: str, entrypoint: str):
        path = Path(module_path)
        if not path.is_absolute():
            path = ROOT / path
        if not path.exists():
            raise FileNotFoundError(f"Skill module not found: {path}")

        safe_name = "skill_" + path.stem.replace("-", "_").replace(".", "_")
        spec = importlib.util.spec_from_file_location(safe_name, path)
        if spec is None or spec.loader is None:
            raise RuntimeError(f"Unable to load module: {path}")

        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        if not hasattr(module, entrypoint):
            raise AttributeError(f"Entrypoint '{entrypoint}' not found in {path}")
        return getattr(module, entrypoint)

    def route(self, skill_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        started = time.perf_counter()
        target = self._resolve_entry(skill_id)
        if target is None:
            return {
                "status": "failed",
                "error": f"Unknown skill_id: {skill_id}",
                "result": None,
                "routing": {"skill_id": skill_id, "resolved_to": None, "latency": 0.0},
            }

        callable_fn = self._load_callable(target["module_path"], target.get("entrypoint", "run"))
        outcome = self.contract.execute(callable_fn, payload)
        outcome["routing"] = {
            "skill_id": skill_id,
            "resolved_to": f"{target['module_path']}:{target.get('entrypoint', 'run')}",
            "latency": round(time.perf_counter() - started, 6),
        }
        return outcome
