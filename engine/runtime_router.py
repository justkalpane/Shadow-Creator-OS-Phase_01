from __future__ import annotations

import importlib.util
import json
import re
import time
from pathlib import Path
from typing import Any

try:
    from agents.common.workflow_binding_contracts import WORKFLOW_BINDING_CONTRACTS
except Exception:  # pragma: no cover - contracts are optional at runtime
    WORKFLOW_BINDING_CONTRACTS = {}

from engine.execution_contract import ExecutionContract
from engine.skill_catalog import ROOT

MANIFESTS_DIR = ROOT / "n8n" / "manifests"
PACKET_SCHEMAS_DIR = ROOT / "schemas" / "packets"


class RuntimeRouter:
    def __init__(self, registry: dict[str, dict[str, str] | str]) -> None:
        self.registry = registry
        self.contract = ExecutionContract()
        self.default_intent_chain = [
            "research_intelligence.m_011_knowledge_dossier_builder",
            "script_intelligence.s_202_first_draft_generation",
            "script_intelligence.s_210_final_script_packager",
        ]
        self.intent_chain_hints: list[tuple[set[str], list[str]]] = [
            (
                {"topic", "research", "discover"},
                [
                    "topic_intelligence.m_001_global_trend_scanner",
                    "research_intelligence.m_011_knowledge_dossier_builder",
                    "script_intelligence.s_202_first_draft_generation",
                ],
            ),
            (
                {"script", "draft", "narrative"},
                [
                    "research_intelligence.m_011_knowledge_dossier_builder",
                    "script_intelligence.s_202_first_draft_generation",
                    "script_intelligence.s_210_final_script_packager",
                ],
            ),
            (
                {"pipeline", "content", "production", "publish"},
                [
                    "research_intelligence.m_011_knowledge_dossier_builder",
                    "script_intelligence.s_202_first_draft_generation",
                    "script_intelligence.s_210_final_script_packager",
                ],
            ),
        ]
        self.workflow_category_map = {
            "topic_intelligence": "WF-100",
            "research_intelligence": "WF-100",
            "script_intelligence": "WF-200",
            "script_intelligence_army": "WF-200",
            "context_engineering": "WF-300",
            "media_production": "WF-400",
            "sub_skills": "WF-400",
            "publishing": "WF-500",
            "analytics": "WF-600",
        }
        self._packet_schema_aliases = {
            "audio_optimized_script_packet": "audio_brief_packet",
            "visual_asset_plan_packet": "visual_asset_spec_packet",
            "research_synthesis_packet": "research_synthesis",
            "script_draft_packet": "script_draft_packet",
            "execution_context_packet": "context_packet",
        }
        self._cwf_packet_contracts = self._load_child_workflow_packet_contracts()
        self._cwf_skill_map = self._build_cwf_skill_map(self._cwf_packet_contracts)

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

        payload_for_execution = self._inject_route_contract(skill_id, payload)
        callable_fn = self._load_callable(target["module_path"], target.get("entrypoint", "run"))
        outcome = self.contract.execute(callable_fn, payload_for_execution)
        outcome["routing"] = {
            "skill_id": skill_id,
            "resolved_to": f"{target['module_path']}:{target.get('entrypoint', 'run')}",
            "latency": round(time.perf_counter() - started, 6),
        }
        return outcome

    @staticmethod
    def _workflow_contract_map() -> dict[str, dict[str, Any]]:
        contracts: dict[str, dict[str, Any]] = {}
        if not isinstance(WORKFLOW_BINDING_CONTRACTS, dict):
            return contracts
        for data in WORKFLOW_BINDING_CONTRACTS.values():
            if not isinstance(data, dict):
                continue
            workflow_id = str(data.get("workflow_id", "")).strip().upper()
            if workflow_id:
                contracts[workflow_id] = data
        return contracts

    def _infer_workflow_id(self, skill_id: str) -> str | None:
        category = (skill_id or "").split(".", 1)[0].strip().lower()
        return self.workflow_category_map.get(category)

    @staticmethod
    def _property_type_for_field(field: str) -> str:
        normalized = (field or "").strip().lower()
        if normalized.endswith("_packet") or normalized.endswith("_record") or normalized.endswith("_context"):
            return "object"
        if normalized.endswith("_id"):
            return "string"
        return "any"

    @staticmethod
    def _extract_skill_codes(text: str) -> list[str]:
        if not isinstance(text, str):
            return []
        return sorted(set(re.findall(r"\b([A-Z]{1,2}-\d{3})\b", text.upper())))

    @staticmethod
    def _normalize_scalar_token(token: Any) -> str:
        return str(token or "").strip().strip("'\"")

    def _load_child_workflow_packet_contracts(self) -> dict[str, dict[str, list[str]]]:
        contracts: dict[str, dict[str, list[str]]] = {}
        if not MANIFESTS_DIR.exists():
            return contracts

        for manifest in sorted(MANIFESTS_DIR.glob("CWF-*.manifest.yaml")):
            workflow_id = ""
            inputs: list[str] = []
            outputs: list[str] = []
            skill_codes: list[str] = []
            section = ""

            for raw in manifest.read_text(encoding="utf-8", errors="replace").splitlines():
                stripped = raw.strip()
                if not stripped or stripped.startswith("#"):
                    continue

                if stripped.startswith("workflow_id:"):
                    workflow_id = self._normalize_scalar_token(stripped.split(":", 1)[1]).upper()
                    section = ""
                    continue
                if stripped.startswith("inputs:"):
                    section = "inputs"
                    continue
                if stripped.startswith("output_packet_family:"):
                    section = "outputs"
                    continue
                if stripped.startswith("skills_invoked:") or stripped == "skills:" or stripped.startswith("skills:"):
                    section = "skills"
                    continue
                if stripped.startswith("skill_id:"):
                    skill_codes.extend(self._extract_skill_codes(stripped))
                    continue

                if stripped.startswith("- "):
                    item = self._normalize_scalar_token(stripped[2:].strip())
                    if section == "inputs":
                        inputs.append(item.split()[0])
                    elif section == "outputs":
                        outputs.append(item.split()[0])
                    elif section == "skills":
                        skill_codes.extend(self._extract_skill_codes(item))
                    continue

                if ":" in stripped and not stripped.startswith("-"):
                    section = ""

            if not workflow_id:
                continue
            contracts[workflow_id] = {
                "inputs": sorted(set(inputs)),
                "outputs": sorted(set(outputs)),
                "skill_codes": sorted(set(skill_codes)),
            }

        return contracts

    @staticmethod
    def _build_cwf_skill_map(contracts: dict[str, dict[str, list[str]]]) -> dict[str, list[str]]:
        skill_map: dict[str, list[str]] = {}
        for workflow_id, data in contracts.items():
            for code in data.get("skill_codes", []):
                skill_map.setdefault(code, []).append(workflow_id)
        for code in list(skill_map.keys()):
            skill_map[code] = sorted(set(skill_map[code]))
        return skill_map

    @staticmethod
    def _skill_code_from_skill_id(skill_id: str) -> str | None:
        if not isinstance(skill_id, str) or "." not in skill_id:
            return None
        leaf = skill_id.split(".", 1)[1]
        match = re.match(r"^([a-z]{1,2})_(\d{3})_", leaf)
        if not match:
            return None
        return f"{match.group(1).upper()}-{match.group(2)}"

    def _resolve_packet_schema_path(self, packet_name: str) -> Path | None:
        normalized = self._normalize_scalar_token(packet_name).lower()
        candidates = [normalized, self._packet_schema_aliases.get(normalized, "")]
        for name in candidates:
            if not name:
                continue
            path = PACKET_SCHEMAS_DIR / f"{name}.schema.json"
            if path.exists():
                return path
        return None

    def _json_schema_to_contract_schema(self, schema: dict[str, Any]) -> dict[str, Any]:
        schema_type = schema.get("type")
        if isinstance(schema_type, list):
            non_null = [s for s in schema_type if s != "null"]
            schema_type = non_null[0] if non_null else "any"

        if not isinstance(schema_type, str):
            if isinstance(schema.get("properties"), dict):
                schema_type = "object"
            elif isinstance(schema.get("items"), dict):
                schema_type = "array"
            else:
                schema_type = "any"

        if schema_type == "object":
            properties = schema.get("properties", {})
            out_props: dict[str, Any] = {}
            if isinstance(properties, dict):
                for key, child in properties.items():
                    if isinstance(child, dict):
                        out_props[key] = self._json_schema_to_contract_schema(child)
            return {
                "type": "object",
                "required": schema.get("required", []) if isinstance(schema.get("required", []), list) else [],
                "properties": out_props,
                "additionalProperties": bool(schema.get("additionalProperties", True)),
            }

        if schema_type == "array":
            out = {"type": "array"}
            if isinstance(schema.get("items"), dict):
                out["items"] = self._json_schema_to_contract_schema(schema["items"])
            return out

        if schema_type in {"string", "number", "integer", "boolean", "null"}:
            return {"type": schema_type}
        return {"type": "any"}

    def _packet_contract_schema(self, packet_name: str) -> dict[str, Any] | None:
        schema_path = self._resolve_packet_schema_path(packet_name)
        if schema_path is None:
            return None
        try:
            schema = json.loads(schema_path.read_text(encoding="utf-8"))
            if not isinstance(schema, dict):
                return None
            return self._json_schema_to_contract_schema(schema)
        except Exception:
            return None

    def _resolve_child_workflow_id(self, skill_id: str, payload: dict[str, Any]) -> tuple[str | None, bool]:
        explicit_cwf = self._normalize_scalar_token(payload.get("child_workflow_id", "")).upper()
        if explicit_cwf.startswith("CWF-"):
            return explicit_cwf, True

        workflow_id = self._normalize_scalar_token(payload.get("workflow_id", "")).upper()
        if workflow_id.startswith("CWF-"):
            return workflow_id, True

        if not bool(payload.get("enforce_workflow_contract", False)):
            return None, False

        skill_code = self._skill_code_from_skill_id(skill_id)
        if not skill_code:
            return None, False
        candidates = self._cwf_skill_map.get(skill_code, [])
        if len(candidates) == 1:
            return candidates[0], False
        return None, False

    def _build_workflow_contract(
        self,
        skill_id: str,
        payload: dict[str, Any],
    ) -> dict[str, Any] | None:
        existing = payload.get("__contract__")
        if isinstance(existing, dict):
            return None

        explicit_workflow_id = str(payload.get("workflow_id", "")).strip().upper()
        enforce_workflow_contract = bool(payload.get("enforce_workflow_contract", False))
        child_workflow_id, explicit_child = self._resolve_child_workflow_id(skill_id, payload)

        workflow_id = explicit_workflow_id or child_workflow_id or (self._infer_workflow_id(skill_id) if enforce_workflow_contract else "")
        if not workflow_id:
            return None

        contract_map = self._workflow_contract_map()
        wf_contract = contract_map.get(workflow_id, {})
        required_inputs = wf_contract.get("required_inputs", []) if isinstance(wf_contract, dict) else []
        gate_rules = wf_contract.get("gate_rules", {}) if isinstance(wf_contract, dict) else {}

        input_required: list[str] = ["input"]
        properties: dict[str, dict[str, Any]] = {"input": {"type": "any"}}

        # Enforce full declared inputs only for explicit workflow context.
        if (explicit_workflow_id or explicit_child) and isinstance(required_inputs, list):
            for field in required_inputs:
                if not isinstance(field, str) or not field.strip():
                    continue
                input_required.append(field)
                properties[field] = {"type": self._property_type_for_field(field)}

        if isinstance(gate_rules, dict) and bool(gate_rules.get("require_dossier_id", False)):
            input_required.append("dossier_id")
            properties["dossier_id"] = {"type": "string"}

        output_required = ["status"]
        output_properties: dict[str, dict[str, Any]] = {"status": {"type": "string"}}
        if skill_id.startswith("sub_skills."):
            output_required.extend(["artifact_family", "payload", "provider_execution_summary"])
            output_properties.update(
                {
                    "artifact_family": {"type": "string"},
                    "payload": {"type": "object"},
                    "provider_execution_summary": {"type": "object"},
                }
            )

        if child_workflow_id:
            cwf = self._cwf_packet_contracts.get(child_workflow_id, {})
            for packet_name in cwf.get("inputs", []):
                packet_schema = self._packet_contract_schema(packet_name)
                if packet_schema is None:
                    continue
                properties[packet_name] = packet_schema
                if explicit_child:
                    input_required.append(packet_name)

            strict_output = bool(payload.get("strict_packet_output", explicit_child))
            if strict_output:
                for packet_name in cwf.get("outputs", []):
                    packet_schema = self._packet_contract_schema(packet_name)
                    if packet_schema is None:
                        continue
                    return {
                        "input_schema": {
                            "type": "object",
                            "required": sorted(set(input_required)),
                            "properties": properties,
                            "additionalProperties": True,
                        },
                        "output_schema": packet_schema,
                    }

        return {
            "input_schema": {
                "type": "object",
                "required": sorted(set(input_required)),
                "properties": properties,
                "additionalProperties": True,
            },
            "output_schema": {
                "type": "object",
                "required": sorted(set(output_required)),
                "properties": output_properties,
                "additionalProperties": True,
            },
        }

    def _inject_route_contract(self, skill_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        if not isinstance(payload, dict):
            return payload
        generated = self._build_workflow_contract(skill_id, payload)
        if generated is None:
            return payload
        cloned = dict(payload)
        cloned["__contract__"] = generated
        return cloned

    def _chain_from_intent(self, intent: str) -> list[str]:
        normalized = (intent or "").lower()
        for keywords, chain in self.intent_chain_hints:
            if any(keyword in normalized for keyword in keywords):
                return chain
        return self.default_intent_chain

    def build_dag(self, intent: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        ctx = context or {}
        requested_chain = ctx.get("chain")
        chain = requested_chain if isinstance(requested_chain, list) and requested_chain else self._chain_from_intent(intent)

        nodes: list[dict[str, Any]] = []
        edges: list[dict[str, str]] = []
        for idx, skill_id in enumerate(chain):
            node_id = f"task_{idx + 1:03d}"
            depends_on = [] if idx == 0 else [f"task_{idx:03d}"]
            node = {
                "id": node_id,
                "skill_id": skill_id,
                "depends_on": depends_on,
            }
            nodes.append(node)
            if depends_on:
                edges.append({"from": depends_on[0], "to": node_id})

        return {
            "intent": intent,
            "nodes": nodes,
            "edges": edges,
            "entry_nodes": [n["id"] for n in nodes if not n["depends_on"]],
            "metadata": {"planner": "heuristic_keyword_dag_v1"},
        }

    @staticmethod
    def _extract_routed_output(routed_result: dict[str, Any]) -> Any:
        if not isinstance(routed_result, dict):
            return routed_result
        if "result" in routed_result:
            return routed_result.get("result")
        if "output" in routed_result:
            return routed_result.get("output")
        return routed_result

    def execute_dag(
        self,
        dag: dict[str, Any],
        initial_payload: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        payload = initial_payload or {}
        nodes = dag.get("nodes", [])
        if not isinstance(nodes, list) or not nodes:
            return {
                "status": "failed",
                "error": "DAG has no executable nodes",
                "dag": dag,
                "trace": [],
                "final_output": None,
            }

        node_map: dict[str, dict[str, Any]] = {}
        dependents: dict[str, list[str]] = {}
        indegree: dict[str, int] = {}
        for node in nodes:
            node_id = str(node.get("id", "")).strip()
            if not node_id:
                continue
            deps = node.get("depends_on", [])
            if not isinstance(deps, list):
                deps = []
            node_map[node_id] = {"id": node_id, "skill_id": node.get("skill_id"), "depends_on": deps}
            indegree[node_id] = len(deps)
            for dep in deps:
                dependents.setdefault(dep, []).append(node_id)

        ready = sorted([node_id for node_id, deg in indegree.items() if deg == 0])
        trace: list[dict[str, Any]] = []
        outputs: dict[str, Any] = {}
        execution_order: list[str] = []

        while ready:
            node_id = ready.pop(0)
            execution_order.append(node_id)
            node = node_map[node_id]
            deps = node.get("depends_on", [])
            if deps:
                upstream_values = [outputs.get(dep) for dep in deps]
                routed_payload = {**payload, "input": upstream_values[-1] if len(upstream_values) == 1 else upstream_values}
            else:
                routed_payload = {**payload}
                routed_payload.setdefault("input", dag.get("intent", ""))

            step_result = self.route(str(node.get("skill_id")), routed_payload)
            outputs[node_id] = self._extract_routed_output(step_result)
            trace.append(
                {
                    "node_id": node_id,
                    "skill_id": node.get("skill_id"),
                    "depends_on": deps,
                    "result": step_result,
                }
            )

            if step_result.get("status") != "success":
                return {
                    "status": "failed",
                    "error": f"Node execution failed at {node_id}",
                    "dag": dag,
                    "execution_order": execution_order,
                    "trace": trace,
                    "final_output": outputs.get(node_id),
                }

            for dep_id in dependents.get(node_id, []):
                indegree[dep_id] -= 1
                if indegree[dep_id] == 0:
                    ready.append(dep_id)
            ready.sort()

        if len(execution_order) != len(node_map):
            return {
                "status": "failed",
                "error": "DAG cycle or unresolved dependency detected",
                "dag": dag,
                "execution_order": execution_order,
                "trace": trace,
                "final_output": None,
            }

        final_node_id = execution_order[-1]
        return {
            "status": "success",
            "error": None,
            "dag": dag,
            "execution_order": execution_order,
            "trace": trace,
            "final_output": outputs.get(final_node_id),
        }

    def run_intent(self, intent: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        ctx = context or {}
        dag = self.build_dag(intent, ctx)
        initial_payload = ctx.get("payload", {})
        if not isinstance(initial_payload, dict):
            initial_payload = {}
        initial_payload.setdefault("intent", intent)
        initial_payload.setdefault("enforce_workflow_contract", True)
        return self.execute_dag(dag, initial_payload)
