from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Callable


@dataclass
class Task:
    id: str
    dependencies: list[str] = field(default_factory=list)
    payload: dict[str, Any] = field(default_factory=dict)
    retry_count: int = 3


class DAGExecutor:
    """Dependency-aware executor with topological ordering and retries."""

    @staticmethod
    def _topological_sort(tasks: list[Task]) -> list[Task]:
        task_by_id = {task.id: task for task in tasks}
        in_degree = {task.id: 0 for task in tasks}
        adjacency: dict[str, list[str]] = {task.id: [] for task in tasks}

        for task in tasks:
            for dep in task.dependencies:
                if dep not in task_by_id:
                    raise ValueError(f"Task '{task.id}' depends on missing task '{dep}'.")
                adjacency[dep].append(task.id)
                in_degree[task.id] += 1

        ready = sorted([task_id for task_id, degree in in_degree.items() if degree == 0])
        ordered_ids: list[str] = []

        while ready:
            current = ready.pop(0)
            ordered_ids.append(current)
            for child in sorted(adjacency[current]):
                in_degree[child] -= 1
                if in_degree[child] == 0:
                    ready.append(child)
                    ready.sort()

        if len(ordered_ids) != len(tasks):
            raise ValueError("Cycle detected in DAG task dependencies.")

        return [task_by_id[task_id] for task_id in ordered_ids]

    def run(
        self,
        tasks: list[Task],
        execute_fn: Callable[[Task, dict[str, Any]], dict[str, Any]],
        initial_context: dict[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        ordered = self._topological_sort(tasks)
        context = dict(initial_context or {})
        results: list[dict[str, Any]] = []

        for task in ordered:
            attempt = 0
            max_attempts = max(1, int(task.retry_count or 1))
            last_error = ""
            while attempt < max_attempts:
                attempt += 1
                try:
                    output = execute_fn(task, context)
                except Exception as exc:  # pragma: no cover - runtime boundary
                    output = {"status": "failed", "error": str(exc)}

                if output.get("status") == "success":
                    results.append(
                        {
                            "task_id": task.id,
                            "status": "success",
                            "attempt": attempt,
                            "result": output,
                        }
                    )
                    context[task.id] = output
                    break

                last_error = str(output.get("error", f"task '{task.id}' failed"))
                if attempt >= max_attempts:
                    results.append(
                        {
                            "task_id": task.id,
                            "status": "failed",
                            "attempt": attempt,
                            "error": last_error,
                            "result": output,
                        }
                    )
                    return results

        return results
