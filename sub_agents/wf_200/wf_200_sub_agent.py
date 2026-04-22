from __future__ import annotations

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from agents.common.workflow_sub_agent_base import WorkflowSubAgentBase
from agents.common.production_agent_base import print_run


class Wf200SubAgent(WorkflowSubAgentBase):
    def __init__(
        self,
        timeout_seconds: float = 8.0,
        max_retries: int = 2,
        backoff_seconds: float = 0.4,
    ) -> None:
        super().__init__(
            workflow_slug="wf_200",
            timeout_seconds=timeout_seconds,
            max_retries=max_retries,
            backoff_seconds=backoff_seconds,
        )


if __name__ == "__main__":
    print_run(Wf200SubAgent())
