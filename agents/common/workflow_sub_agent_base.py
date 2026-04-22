from __future__ import annotations

from typing import Any

from agents.common.production_agent_base import ProductionAgentBase
from agents.common.workflow_binding_contracts import get_workflow_contract


class WorkflowSubAgentBase(ProductionAgentBase):
    def __init__(
        self,
        workflow_slug: str,
        timeout_seconds: float = 8.0,
        max_retries: int = 2,
        backoff_seconds: float = 0.4,
    ) -> None:
        self.workflow_slug = workflow_slug
        self.workflow_contract = get_workflow_contract(workflow_slug)
        super().__init__(
            agent_slug=workflow_slug,
            director_binding=self.workflow_contract.get("primary_director", "Krishna"),
            artifact_family=f"{workflow_slug}-sub-agent-packet",
            timeout_seconds=timeout_seconds,
            max_retries=max_retries,
            backoff_seconds=backoff_seconds,
        )

    def execute_core(self, input_payload: dict[str, Any]) -> dict[str, Any]:
        contract = self.workflow_contract
        gate = contract.get("gate_rules", {})
        required_inputs = contract.get("required_inputs", [])
        allowed_directors = contract.get("allowed_directors", [])

        errors: list[str] = []

        if gate.get("require_dossier_id", True) and not input_payload.get("dossier_id"):
            errors.append("missing_dossier_id")

        acting_director = str(input_payload.get("acting_director", contract.get("primary_director", "Krishna")))
        if gate.get("enforce_director_binding", True) and allowed_directors and acting_director not in allowed_directors:
            errors.append("invalid_director_binding")

        if gate.get("require_declared_inputs", True):
            missing_inputs = [k for k in required_inputs if k not in input_payload]
            if missing_inputs:
                errors.append("missing_required_inputs:" + ",".join(missing_inputs))

        if gate.get("require_governance_ack_on_release", False):
            release_candidate = bool(input_payload.get("release_candidate", False))
            governance_ack = bool(input_payload.get("governance_ack", False))
            if release_candidate and not governance_ack:
                errors.append("missing_governance_ack")

        if errors:
            return {
                "status": "error",
                "attempts": 0,
                "elapsed_ms": 0,
                "error": ";".join(errors),
                "result": {
                    "mode": "workflow_contract_enforced",
                    "workflow_contract": contract,
                    "acting_director": acting_director,
                    "decision": {
                        "decision": "escalate",
                        "reason": "workflow_contract_gate_failed",
                        "next_route": "ROUTE_PHASE1_REPLAY",
                    },
                    "escalation_workflow": gate.get("escalate_to", "WF-900"),
                },
            }

        return {
            "status": "ok",
            "attempts": 0,
            "elapsed_ms": 0,
            "result": {
                "mode": "workflow_contract_enforced",
                "workflow_contract": contract,
                "acting_director": acting_director,
                "decision": {
                    "decision": "approve",
                    "reason": "workflow_contract_gate_passed",
                    "next_route": input_payload.get("route_id", "ROUTE_PHASE1_STANDARD"),
                },
                "escalation_workflow": None,
            },
        }
