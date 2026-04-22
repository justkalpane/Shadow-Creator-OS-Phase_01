from __future__ import annotations

import importlib.util
from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from agents.common.workflow_binding_contracts import get_workflow_contract


SUB_AGENT_REGISTRY = ROOT / "sub_agents" / "SUB_AGENT_RUNTIME_REGISTRY.yaml"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _parse_sub_agent_files(path: Path) -> list[str]:
    _assert(path.exists(), f"Missing sub-agent registry file: {path}")
    files: list[str] = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if line.startswith("- file:"):
            files.append(line.split(":", 1)[1].strip())
    return files


def _import_module_from_path(path: Path, module_name: str):
    spec = importlib.util.spec_from_file_location(module_name, path)
    _assert(spec is not None and spec.loader is not None, f"Unable to load spec for {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _camel_sub_agent_class(slug: str) -> str:
    return "".join(part.capitalize() for part in slug.split("_")) + "SubAgent"


def _assert_output_contract(result: dict, slug: str, contract: dict) -> None:
    _assert(isinstance(result, dict), f"{slug}: run() output must be dict")

    top_fields = {
        "status": str,
        "instance_id": str,
        "artifact_family": str,
        "schema_version": str,
        "producer_agent": str,
        "dossier_ref": str,
        "route_id": str,
        "governance": dict,
        "telemetry": dict,
        "payload": dict,
    }
    for field, field_type in top_fields.items():
        _assert(field in result, f"{slug}: missing output field '{field}'")
        _assert(isinstance(result[field], field_type), f"{slug}: field '{field}' type mismatch")

    governance = result["governance"]
    _assert(governance.get("director_binding") == contract.get("primary_director"), f"{slug}: director binding mismatch")
    _assert("escalation" in governance and isinstance(governance["escalation"], dict), f"{slug}: missing escalation block")

    payload = result["payload"]
    _assert("summary" in payload and isinstance(payload["summary"], dict), f"{slug}: missing payload.summary")
    _assert("core_result" in payload and isinstance(payload["core_result"], dict), f"{slug}: missing payload.core_result")

    core_result = payload["core_result"]
    _assert("workflow_contract" in core_result, f"{slug}: missing core_result.workflow_contract")
    wf_contract = core_result["workflow_contract"]
    _assert(wf_contract.get("workflow_id") == contract.get("workflow_id"), f"{slug}: workflow_id mismatch in output")
    workflow_contract_fields = {
        "workflow_id": str,
        "workflow_name": str,
        "workflow_class": str,
        "parent_pack": str,
        "primary_director": str,
        "allowed_directors": list,
        "required_inputs": list,
        "gate_rules": dict,
    }
    for field, field_type in workflow_contract_fields.items():
        _assert(field in wf_contract, f"{slug}: workflow_contract missing field '{field}'")
        _assert(isinstance(wf_contract[field], field_type), f"{slug}: workflow_contract.{field} type mismatch")
    _assert("decision" in core_result and isinstance(core_result["decision"], dict), f"{slug}: missing decision block")
    for key in ("decision", "reason", "next_route"):
        _assert(key in core_result["decision"], f"{slug}: missing decision.{key}")


def _build_valid_payload(contract: dict) -> dict:
    payload = {
        "dossier_id": "TEST-DOSSIER",
        "route_id": "ROUTE_PHASE1_STANDARD",
        "acting_director": contract.get("primary_director", "Krishna"),
        "release_candidate": False,
        "governance_ack": True,
    }
    for req in contract.get("required_inputs", []):
        payload[req] = {"ok": True, "field": req}
    return payload


def _assert_failure_contract(result: dict, slug: str, expected_escalate_to: str) -> None:
    _assert(result.get("status") == "failed", f"{slug}: expected failed status on invalid payload")
    governance = result.get("governance", {})
    escalation = governance.get("escalation", {})
    _assert(escalation.get("escalation_required") is True, f"{slug}: escalation_required should be true on failure")
    _assert(
        escalation.get("escalation_target_workflow") == expected_escalate_to,
        f"{slug}: escalation target mismatch on failure",
    )
    summary = result.get("payload", {}).get("summary", {})
    _assert(summary.get("status") == "error", f"{slug}: payload.summary.status should be error on failure")


def _check_sub_agent_payload_contract(rel_path: str) -> None:
    parts = rel_path.split("/")
    _assert(len(parts) == 3, f"Invalid sub-agent path shape: {rel_path}")
    _, slug, filename = parts
    _assert(filename == f"{slug}_sub_agent.py", f"Filename mismatch for {slug}")

    contract = get_workflow_contract(slug)
    _assert(contract.get("workflow_class") != "unknown", f"{slug}: missing workflow binding contract")

    module = _import_module_from_path(ROOT.joinpath(*parts), f"wf_payload_{slug}")
    class_name = _camel_sub_agent_class(slug)
    _assert(hasattr(module, class_name), f"{slug}: missing class {class_name}")
    klass = getattr(module, class_name)
    instance = klass()

    valid_payload = _build_valid_payload(contract)
    success_result = instance.run(valid_payload)
    _assert_output_contract(success_result, slug, contract)
    _assert(success_result.get("status") == "success", f"{slug}: valid payload should succeed")

    bad_payload = dict(valid_payload)
    bad_payload.pop("dossier_id", None)
    failure_result = instance.run(bad_payload)
    expected_escalate_to = contract.get("gate_rules", {}).get("escalate_to", "WF-900")
    _assert_failure_contract(failure_result, slug, expected_escalate_to)

    # Field-by-field required input assertions.
    for req in contract.get("required_inputs", []):
        req_missing_payload = dict(valid_payload)
        req_missing_payload.pop(req, None)
        req_fail_result = instance.run(req_missing_payload)
        _assert_failure_contract(req_fail_result, slug, expected_escalate_to)


def main() -> None:
    entries = _parse_sub_agent_files(SUB_AGENT_REGISTRY)
    _assert(entries, "No sub-agent entries discovered")
    for entry in entries:
        _check_sub_agent_payload_contract(entry)
    print(f"Validated strict workflow payload contracts for {len(entries)} sub-agents successfully.")


if __name__ == "__main__":
    main()
