from __future__ import annotations

import importlib.util
import json
import re
from functools import lru_cache
from pathlib import Path
from typing import Any

from engine.dag_engine import DAGExecutor, Task
from engine.director_loader import load_director
from engine.failure_engine import FailureEngine
from engine.registry_mapper import build_registry
from engine.runtime_router import RuntimeRouter
from engine.skill_catalog import ROOT
from engine.state_engine import DossierStore
from agents.common.workflow_binding_contracts import get_workflow_contract


REGISTRIES_DIR = ROOT / "registries"
BINDINGS_DIR = ROOT / "bindings"
PACKET_SCHEMAS_DIR = ROOT / "schemas" / "packets"

AGENT_CLASS_MATRIX_PATH = REGISTRIES_DIR / "agent_class_matrix.json"
SUB_AGENT_MATRIX_PATH = REGISTRIES_DIR / "sub_agent_matrix.json"
SUBSKILL_REGISTRY_PATH = REGISTRIES_DIR / "subskill_runtime_registry.yaml"
SKILL_SUBSKILL_REGISTRY_PATH = REGISTRIES_DIR / "skill_registry.json"
PHASE1_REGISTRY_PATH = REGISTRIES_DIR / "route_registry.yaml"

WORKFLOW_BINDING_FILES = [
    BINDINGS_DIR / "workflow_skill_binding_wf100.yaml",
    BINDINGS_DIR / "workflow_skill_binding_wf200.yaml",
    BINDINGS_DIR / "workflow_skill_binding_wf300.yaml",
    BINDINGS_DIR / "workflow_skill_binding_wf400.yaml",
    BINDINGS_DIR / "workflow_skill_binding_wf500.yaml",
    BINDINGS_DIR / "workflow_skill_binding_wf600.yaml",
]

DEFAULT_WORKFLOW_PLAN = ["WF-010", "WF-100", "WF-200", "WF-300", "WF-400", "WF-500", "WF-600"]


def _normalize_workflow_id(value: str) -> str:
    return str(value or "").strip().upper().replace("_", "-")


def _workflow_slug(value: str) -> str:
    return _normalize_workflow_id(value).lower().replace("-", "_")


def _load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def _workflow_expected_categories(workflow_id: str) -> list[str]:
    normalized = _normalize_workflow_id(workflow_id)
    if normalized.startswith("WF-1") or normalized.startswith("CWF-1"):
        return ["topic_intelligence", "research_intelligence"]
    if normalized.startswith("WF-2") or normalized.startswith("CWF-2"):
        return ["script_intelligence", "script_intelligence_army"]
    if normalized.startswith("WF-3") or normalized.startswith("CWF-3"):
        return ["context_engineering"]
    if normalized.startswith("WF-4") or normalized.startswith("CWF-4"):
        return ["media_production"]
    if normalized.startswith("WF-5") or normalized.startswith("CWF-5"):
        return ["publishing"]
    if normalized.startswith("WF-6") or normalized.startswith("CWF-6"):
        return ["analytics"]
    return []


@lru_cache(maxsize=128)
def _load_packet_schema(packet_name: str) -> dict[str, Any] | None:
    aliases = {
        "audio_optimized_script_packet": "audio_brief_packet",
        "visual_asset_plan_packet": "visual_asset_spec_packet",
        "execution_context_packet": "context_packet",
        "research_synthesis_packet": "research_synthesis",
    }
    normalized = str(packet_name or "").strip().lower()
    for candidate in (normalized, aliases.get(normalized, "")):
        if not candidate:
            continue
        path = PACKET_SCHEMAS_DIR / f"{candidate}.schema.json"
        if path.exists():
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
                if isinstance(data, dict):
                    return data
            except Exception:
                return None
    return None


def _placeholder_from_schema(schema: dict[str, Any], field_name: str) -> Any:
    if "const" in schema:
        return schema.get("const")

    schema_type = schema.get("type")
    if isinstance(schema_type, list):
        non_null = [item for item in schema_type if item != "null"]
        schema_type = non_null[0] if non_null else "string"
    if not isinstance(schema_type, str):
        if isinstance(schema.get("properties"), dict):
            schema_type = "object"
        elif isinstance(schema.get("items"), dict):
            schema_type = "array"
        else:
            schema_type = "string"

    if schema_type == "object":
        out: dict[str, Any] = {}
        properties = schema.get("properties", {})
        required = schema.get("required", [])
        if not isinstance(properties, dict):
            properties = {}
        if not isinstance(required, list):
            required = []
        for required_field in required:
            child_schema = properties.get(required_field, {"type": "string"})
            if not isinstance(child_schema, dict):
                child_schema = {"type": "string"}
            out[str(required_field)] = _placeholder_from_schema(child_schema, str(required_field))
        return out

    if schema_type == "array":
        min_items = int(schema.get("minItems", 0) or 0)
        item_schema = schema.get("items", {"type": "string"})
        if not isinstance(item_schema, dict):
            item_schema = {"type": "string"}
        if min_items > 0:
            return [_placeholder_from_schema(item_schema, field_name) for _ in range(min_items)]
        return []

    if schema_type in {"number", "integer"}:
        return 0
    if schema_type == "boolean":
        return False
    if schema_type == "null":
        return None
    if schema_type == "string":
        if isinstance(schema.get("enum"), list) and schema.get("enum"):
            return str(schema["enum"][0])
        format_hint = str(schema.get("format", "")).strip().lower()
        if format_hint == "date-time":
            return "2026-01-01T00:00:00Z"
        if format_hint == "date":
            return "2026-01-01"
        token = re.sub(r"[^A-Z0-9]+", "-", field_name.upper()).strip("-") or "VALUE"
        pattern = str(schema.get("pattern", ""))
        if pattern.startswith("^"):
            prefix_match = re.match(r"^\^([A-Za-z0-9]+-)", pattern)
            if prefix_match:
                return f"{prefix_match.group(1)}TEST"
            if token not in {"PACKET-ID", "VALUE"}:
                return f"{token}-TEST"
        return "TEST"
    return "TEST"


def _placeholder_packet(field: str, dossier_id: str = "DOSSIER-PLACEHOLDER") -> dict[str, Any]:
    token = re.sub(r"[^A-Z0-9]+", "-", str(field or "").upper()).strip("-") or "PACKET"
    schema = _load_packet_schema(field)
    if isinstance(schema, dict):
        generated = _placeholder_from_schema(schema, field)
        if isinstance(generated, dict):
            return _apply_packet_defaults(field, generated, dossier_id)
    return {
        "packet_id": f"{token}-TEST",
        "instance_id": f"{token}-TEST",
        "dossier_id": dossier_id,
        "status": "created",
    }


def _apply_packet_defaults(field: str, packet_value: dict[str, Any], dossier_id: str) -> dict[str, Any]:
    packet = dict(packet_value)
    schema = _load_packet_schema(field)
    token = re.sub(r"[^A-Z0-9]+", "-", str(field or "").upper()).strip("-") or "PACKET"

    if not isinstance(schema, dict):
        packet.setdefault("packet_id", f"{token}-TEST")
        packet.setdefault("instance_id", f"{token}-TEST")
        packet.setdefault("dossier_id", dossier_id)
        packet.setdefault("status", "created")
        return packet

    properties = schema.get("properties", {})
    if not isinstance(properties, dict):
        properties = {}

    def _set_if_declared(key: str, default_field: str) -> None:
        if key in properties and key not in packet:
            prop_schema = properties.get(key)
            if isinstance(prop_schema, dict):
                packet[key] = _placeholder_from_schema(prop_schema, default_field)

    _set_if_declared("packet_id", "packet_id")
    _set_if_declared("instance_id", "instance_id")
    _set_if_declared("status", "status")
    if "dossier_id" in properties and "dossier_id" not in packet:
        packet["dossier_id"] = dossier_id
    if "dossier_ref" in properties and "dossier_ref" not in packet:
        packet["dossier_ref"] = dossier_id

    return packet


def _summarize_output_for_dossier(output: Any) -> Any:
    if isinstance(output, dict):
        summary: dict[str, Any] = {}
        for key in ("status", "error", "artifact_family", "packet_id", "instance_id", "sub_skill_id", "skill_id"):
            if key in output:
                summary[key] = output.get(key)
        if "result" in output:
            result = output.get("result")
            if isinstance(result, dict):
                summary["result"] = {
                    k: result.get(k)
                    for k in ("status", "artifact_family", "packet_id", "instance_id", "sub_skill_id")
                    if k in result
                }
        if not summary:
            summary["type"] = "dict"
            summary["keys"] = sorted(list(output.keys()))[:12]
        return summary
    if isinstance(output, list):
        return {"type": "list", "length": len(output)}
    return {"type": type(output).__name__, "value": str(output)[:200]}


class HierarchyResolver:
    """Registry-driven resolver for director->agent->sub-agent->skill->sub-skill."""

    def __init__(self) -> None:
        self.skill_registry = build_registry()
        self.router = RuntimeRouter(self.skill_registry)
        self.failure_engine = FailureEngine()
        self.dossier_store = DossierStore()
        self.agent_matrix = _load_json(AGENT_CLASS_MATRIX_PATH)
        self.sub_agent_matrix = _load_json(SUB_AGENT_MATRIX_PATH)

        self.workflow_entries_by_id: dict[str, dict[str, Any]] = {}
        for entry in self.sub_agent_matrix.get("entries", []):
            workflow_id = _normalize_workflow_id(entry.get("workflow_id", ""))
            if workflow_id:
                self.workflow_entries_by_id[workflow_id] = entry

        self.skill_id_by_code = self._build_skill_code_index()
        self.workflow_skill_codes = self._build_workflow_skill_code_index()
        self.subskills_by_workflow = self._build_subskill_workflow_index()
        self.subskills_by_skill = self._build_subskill_skill_index()
        self.route_entry_workflow = self._build_route_entry_index()
        self.parent_to_children = self._build_parent_children_index()

    @staticmethod
    def _build_parent_children_index_from_entries(entries: list[dict[str, Any]]) -> dict[str, list[str]]:
        mapping: dict[str, list[str]] = {}
        for entry in entries:
            workflow_id = _normalize_workflow_id(entry.get("workflow_id", ""))
            parent_pack = _normalize_workflow_id(entry.get("parent_pack", ""))
            if not workflow_id.startswith("CWF-") or not parent_pack.startswith("WF-"):
                continue
            mapping.setdefault(parent_pack, []).append(workflow_id)
        for key in list(mapping.keys()):
            mapping[key] = sorted(set(mapping[key]), key=lambda value: int(re.sub(r"\D+", "", value) or "0"))
        return mapping

    def _build_parent_children_index(self) -> dict[str, list[str]]:
        entries = self.sub_agent_matrix.get("entries", [])
        if not isinstance(entries, list):
            return {}
        return self._build_parent_children_index_from_entries(entries)

    def _build_route_entry_index(self) -> dict[str, str]:
        if not PHASE1_REGISTRY_PATH.exists():
            return {}
        mapping: dict[str, str] = {}
        current_route = ""
        for raw in PHASE1_REGISTRY_PATH.read_text(encoding="utf-8", errors="replace").splitlines():
            stripped = raw.strip()
            if stripped.startswith("- route_id:"):
                current_route = _normalize_workflow_id(stripped.split(":", 1)[1].strip())
                continue
            if stripped.startswith("entry_workflow:") and current_route:
                mapping[current_route] = _normalize_workflow_id(stripped.split(":", 1)[1].strip())
                current_route = ""
        return mapping

    def resolve_route_plan(self, route_id: str) -> list[str]:
        normalized_route = str(route_id or "").strip().upper()
        if not normalized_route.startswith("ROUTE_PHASE1_"):
            normalized_route = "ROUTE_PHASE1_STANDARD"
        if normalized_route in self.route_entry_workflow:
            entry = self.route_entry_workflow[normalized_route]
        else:
            entry = self.route_entry_workflow.get("ROUTE_PHASE1_STANDARD", "WF-010")

        if entry == "WF-900":
            return ["WF-900"]
        if entry == "WF-600":
            return ["WF-600"]
        if entry == "WF-010":
            return list(DEFAULT_WORKFLOW_PLAN)
        return [entry]

    def expand_workflow_plan(self, workflow_plan: list[str]) -> list[str]:
        expanded: list[str] = []
        for item in workflow_plan:
            normalized = _normalize_workflow_id(item)
            if not normalized:
                continue
            expanded.append(normalized)
            for child in self.parent_to_children.get(normalized, []):
                expanded.append(child)
        return expanded

    def _build_skill_code_index(self) -> dict[str, list[str]]:
        mapping: dict[str, list[str]] = {}
        pattern = re.compile(r"\.([a-z]{1,2})_(\d{3})_")
        for skill_id in sorted(self.skill_registry.keys()):
            match = pattern.search(skill_id)
            if not match:
                continue
            code = f"{match.group(1).upper()}-{match.group(2)}"
            mapping.setdefault(code, []).append(skill_id)
        return mapping

    def _build_workflow_skill_code_index(self) -> dict[str, list[str]]:
        output: dict[str, set[str]] = {}
        for binding_file in WORKFLOW_BINDING_FILES:
            if not binding_file.exists():
                continue
            current_workflow = ""
            for raw in binding_file.read_text(encoding="utf-8", errors="replace").splitlines():
                stripped = raw.strip()
                if not stripped or stripped.startswith("#"):
                    continue

                workflow_key_match = re.match(r"^([A-Z]+-\d+)[^:]*:$", stripped)
                if workflow_key_match:
                    current_workflow = _normalize_workflow_id(workflow_key_match.group(1))
                    output.setdefault(current_workflow, set())
                    continue

                workflow_id_match = re.match(r'^workflow_id:\s*"?([A-Z]+-\d+)"?$', stripped)
                if workflow_id_match:
                    current_workflow = _normalize_workflow_id(workflow_id_match.group(1))
                    output.setdefault(current_workflow, set())
                    continue

                if not current_workflow:
                    continue

                if "skill" not in stripped.lower():
                    if stripped.startswith("- "):
                        # Some bindings store skills as list items under "skills:".
                        pass
                    else:
                        continue

                for code in re.findall(r"\b([A-Z]{1,2}-\d{3})\b", stripped):
                    output.setdefault(current_workflow, set()).add(code)

                if stripped.startswith("- "):
                    for code in re.findall(r"\b([A-Z]{1,2}-\d{3})\b", stripped):
                        output.setdefault(current_workflow, set()).add(code)

        return {workflow_id: sorted(codes) for workflow_id, codes in output.items()}

    def _build_subskill_workflow_index(self) -> dict[str, list[dict[str, str]]]:
        output: dict[str, list[dict[str, str]]] = {}
        if not SUBSKILL_REGISTRY_PATH.exists():
            return output

        current: dict[str, Any] | None = None
        in_consumers = False

        for raw in SUBSKILL_REGISTRY_PATH.read_text(encoding="utf-8", errors="replace").splitlines():
            stripped = raw.strip()
            if stripped.startswith("- subskill_id:"):
                if current:
                    for workflow_id in current.get("consumer_workflows", []):
                        output.setdefault(_normalize_workflow_id(workflow_id), []).append(
                            {
                                "subskill_id": current["subskill_id"],
                                "runtime_file": current["runtime_file"],
                            }
                        )
                current = {
                    "subskill_id": stripped.split(":", 1)[1].strip(),
                    "runtime_file": "",
                    "consumer_workflows": [],
                }
                in_consumers = False
                continue

            if current is None:
                continue

            if stripped.startswith("runtime_file:"):
                current["runtime_file"] = stripped.split(":", 1)[1].strip()
            elif stripped.startswith("consumer_workflows:"):
                in_consumers = True
            elif in_consumers and stripped.startswith("- "):
                current["consumer_workflows"].append(stripped[2:].strip())
            elif stripped and not stripped.startswith("#"):
                in_consumers = False

        if current:
            for workflow_id in current.get("consumer_workflows", []):
                output.setdefault(_normalize_workflow_id(workflow_id), []).append(
                    {
                        "subskill_id": current["subskill_id"],
                        "runtime_file": current["runtime_file"],
                    }
                )

        for workflow_id in list(output.keys()):
            output[workflow_id] = sorted(output[workflow_id], key=lambda item: item["subskill_id"])
        return output

    def _build_subskill_skill_index(self) -> dict[str, list[dict[str, str]]]:
        mapping: dict[str, list[dict[str, str]]] = {}
        if not SKILL_SUBSKILL_REGISTRY_PATH.exists():
            return mapping
        try:
            payload = json.loads(SKILL_SUBSKILL_REGISTRY_PATH.read_text(encoding="utf-8"))
        except Exception:
            return mapping
        entries = payload.get("skills", [])
        if not isinstance(entries, list):
            return mapping

        registry_subskills: dict[str, dict[str, str]] = {}
        for items in self.subskills_by_workflow.values():
            for item in items:
                registry_subskills[item["subskill_id"]] = item

        for entry in entries:
            if not isinstance(entry, dict):
                continue
            skill_id = str(entry.get("skill_id", "")).strip().lower()
            subskill_ids = entry.get("sub_skills", [])
            if not skill_id or not isinstance(subskill_ids, list):
                continue
            resolved: list[dict[str, str]] = []
            for subskill_id in subskill_ids:
                item = registry_subskills.get(str(subskill_id))
                if item:
                    resolved.append(dict(item))
            if resolved:
                mapping[skill_id] = resolved
        return mapping

    def resolve_workflow(self, workflow_id: str) -> dict[str, Any]:
        normalized = _normalize_workflow_id(workflow_id)
        workflow_entry = self.workflow_entries_by_id.get(normalized, {})
        director_name = str(workflow_entry.get("primary_director", "Krishna"))

        agent_entries = [
            entry
            for entry in self.agent_matrix.get("entries", [])
            if str(entry.get("director_binding", "")).strip().lower() == director_name.lower()
        ]
        agent_entries = sorted(
            agent_entries,
            key=lambda entry: (
                0 if str(entry.get("agent_slug", "")).lower() == director_name.lower() else 1,
                0 if str(entry.get("class_family", "")) == "named_director" else 1,
                str(entry.get("agent_slug", "")),
            ),
        )
        agent_entry = agent_entries[0] if agent_entries else None

        sub_agent_slug = _workflow_slug(normalized)
        sub_agent_entry = None
        for entry in self.sub_agent_matrix.get("entries", []):
            if str(entry.get("workflow_slug", "")).strip().lower() == sub_agent_slug:
                sub_agent_entry = entry
                break

        skill_codes = self.workflow_skill_codes.get(normalized, [])
        expected_categories = _workflow_expected_categories(normalized)
        resolved_skills: list[str] = []
        for code in skill_codes:
            candidates = list(self.skill_id_by_code.get(code, []))
            if not candidates:
                continue
            if expected_categories:
                category_matches = [skill_id for skill_id in candidates if skill_id.split(".", 1)[0] in expected_categories]
                if category_matches:
                    candidates = category_matches
            resolved_skills.append(sorted(candidates)[0])

        skill_subskills: dict[str, list[dict[str, str]]] = {}
        for skill_id in resolved_skills:
            explicit = self.subskills_by_skill.get(skill_id, [])
            if explicit:
                skill_subskills[skill_id] = explicit
                continue
            # Backward-compatible fallback to workflow-level mapping.
            fallback = self.subskills_by_workflow.get(normalized, [])
            if fallback:
                skill_subskills[skill_id] = list(fallback)

        return {
            "workflow_id": normalized,
            "director": director_name,
            "agent": agent_entry,
            "sub_agent": sub_agent_entry,
            "skills": resolved_skills,
            "subskills": self.subskills_by_workflow.get(normalized, []),
            "skill_subskills": skill_subskills,
        }

    @staticmethod
    def _load_class_from_registry(registry_path: str, class_name: str):
        module_path = ROOT / registry_path
        spec = importlib.util.spec_from_file_location(f"runtime_{module_path.stem}", module_path)
        if spec is None or spec.loader is None:
            raise RuntimeError(f"Unable to load module spec: {module_path}")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        if not hasattr(module, class_name):
            raise AttributeError(f"Class {class_name} not found in {module_path}")
        return getattr(module, class_name)

    @staticmethod
    def _load_callable_from_path(runtime_file: str):
        module_path = ROOT / runtime_file
        spec = importlib.util.spec_from_file_location(f"runtime_{module_path.stem}", module_path)
        if spec is None or spec.loader is None:
            raise RuntimeError(f"Unable to load module spec: {module_path}")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        if not hasattr(module, "run"):
            raise AttributeError(f"run() not found in {module_path}")
        return getattr(module, "run")

    def execute_workflow(self, workflow_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        resolution = self.resolve_workflow(workflow_id)
        normalized = resolution["workflow_id"]

        base_payload = dict(payload)
        dossier_id = str(base_payload.get("dossier_id", f"DOSSIER-{_workflow_slug(normalized)}"))
        route_id = str(base_payload.get("route_id", "ROUTE_PHASE1_STANDARD"))
        base_payload.setdefault("dossier_id", dossier_id)
        base_payload.setdefault("route_id", route_id)
        previous_state = self.dossier_store.load(dossier_id)
        previous_events = list(previous_state.get("events", []))
        base_payload.setdefault(
            "dossier_history",
            [
                {
                    "stage": event.get("stage"),
                    "timestamp": event.get("timestamp"),
                    "output": _summarize_output_for_dossier(event.get("output")),
                }
                for event in previous_events[-10:]
                if isinstance(event, dict)
            ],
        )

        trace: dict[str, Any] = {"resolution": resolution}
        dossier_writes: list[dict[str, Any]] = []

        agent_entry = resolution.get("agent")
        director_name = str(resolution.get("director", "Krishna"))
        director_id = str(agent_entry.get("director_id", "")) if isinstance(agent_entry, dict) else ""
        director_contract = load_director(director_name, director_id)
        director_decision = director_contract.evaluate(
            {
                "workflow_id": normalized,
                "route_id": route_id,
                "dossier_id": dossier_id,
                "agent_slug": str(agent_entry.get("agent_slug", "")) if isinstance(agent_entry, dict) else "",
            }
        )
        trace["director"] = {
            "director_name": director_name,
            "director_id": director_decision.get("director_id", director_id),
            "source_file": director_decision.get("source_file", ""),
            "decision": director_decision,
        }

        agent_result = None
        if isinstance(agent_entry, dict):
            agent_class = self._load_class_from_registry(str(agent_entry["registry_path"]), str(agent_entry["agent_class"]))
            def _run_agent() -> Any:
                return agent_class().run(
                    {
                        **base_payload,
                        "task_type": str(normalized).lower(),
                        "acting_director": resolution["director"],
                        "director_decision": director_decision,
                    }
                )
            try:
                agent_result = _run_agent()
            except Exception as exc:
                handled = self.failure_engine.handle(
                    exc,
                    {"stage": "agent", "retry_count": 2},
                    execute_fn=_run_agent,
                )
                agent_result = handled.get("result") if handled.get("status") == "success" else {"status": "failed", "error": handled.get("error")}
        trace["agent"] = agent_result
        dossier_writes.append(
            self.dossier_store.append(
                dossier_id,
                {
                    "stage": f"{normalized}:agent",
                    "director_id": trace["director"]["director_id"],
                    "output": _summarize_output_for_dossier(agent_result),
                },
            )
        )

        sub_agent_result = None
        sub_agent_entry = resolution.get("sub_agent")
        required_inputs = []
        contract_workflow_id = normalized
        contract_required_inputs: list[str] = []
        if isinstance(sub_agent_entry, dict):
            required_inputs = list(sub_agent_entry.get("required_inputs", []))
            parent_pack = _normalize_workflow_id(sub_agent_entry.get("parent_pack", ""))
            if normalized.startswith("CWF-") and parent_pack.startswith("WF-"):
                contract_workflow_id = parent_pack
            contract = get_workflow_contract(_workflow_slug(contract_workflow_id))
            contract_required_inputs = list(contract.get("required_inputs", []))
            for field in required_inputs:
                key = str(field)
                if key not in base_payload or not isinstance(base_payload.get(key), dict):
                    base_payload[key] = _placeholder_packet(key, dossier_id)
                else:
                    base_payload[key] = _apply_packet_defaults(key, base_payload[key], dossier_id)

            sub_agent_class = self._load_class_from_registry(
                str(sub_agent_entry["registry_path"]),
                str(sub_agent_entry["sub_agent_class"]),
            )
            def _run_sub_agent() -> Any:
                return sub_agent_class().run(
                    {
                        **base_payload,
                        "acting_director": resolution["director"],
                        "governance_ack": True,
                        "release_candidate": False,
                    }
                )
            try:
                sub_agent_result = _run_sub_agent()
            except Exception as exc:
                handled = self.failure_engine.handle(
                    exc,
                    {"stage": "sub_agent", "retry_count": 2},
                    execute_fn=_run_sub_agent,
                )
                sub_agent_result = handled.get("result") if handled.get("status") == "success" else {"status": "failed", "error": handled.get("error")}
        trace["sub_agent"] = sub_agent_result
        dossier_writes.append(
            self.dossier_store.append(
                dossier_id,
                {
                    "stage": f"{normalized}:sub_agent",
                    "director_id": trace["director"]["director_id"],
                    "output": _summarize_output_for_dossier(sub_agent_result),
                },
            )
        )

        current_output: Any = sub_agent_result
        skill_trace: list[dict[str, Any]] = []
        subskill_trace: list[dict[str, Any]] = []
        skill_subskills = resolution.get("skill_subskills", {})
        for skill_id in resolution.get("skills", []):
            bound_subskills = list(skill_subskills.get(skill_id, []))
            if not bound_subskills:
                skill_trace.append(
                    {
                        "skill_id": skill_id,
                        "result": {"status": "failed", "error": "missing_explicit_subskills"},
                        "bound_subskills": [],
                    }
                )
                current_output = {"status": "failed", "error": f"Missing explicit sub-skills for {skill_id}"}
                break
            skill_payload = {
                **base_payload,
                "input": current_output,
                "intent": str(base_payload.get("intent", "")),
                "workflow_id": contract_workflow_id,
                "dossier_id": dossier_id,
                "route_id": route_id,
                "enforce_workflow_contract": True,
                "strict_packet_output": False,
            }
            for field in required_inputs:
                key = str(field)
                if key not in skill_payload or not isinstance(skill_payload.get(key), dict):
                    skill_payload[key] = _placeholder_packet(key, dossier_id)
                else:
                    skill_payload[key] = _apply_packet_defaults(key, skill_payload[key], dossier_id)
            for field in contract_required_inputs:
                key = str(field)
                if key not in skill_payload:
                    if key == "dossier_id":
                        skill_payload[key] = dossier_id
                    else:
                        skill_payload[key] = _placeholder_packet(key, dossier_id)

            allow_degraded_execution = bool(base_payload.get("allow_degraded_execution", True))
            enforce_live_skill_execution = bool(base_payload.get("enforce_live_skill_execution", False))

            def _degraded_skill_result(reason: str) -> dict[str, Any]:
                return {
                    "status": "success",
                    "result": current_output if isinstance(current_output, dict) else {"input": current_output},
                    "degraded_execution": True,
                    "degraded_reason": reason,
                    "skill_id": skill_id,
                }

            if allow_degraded_execution and not enforce_live_skill_execution:
                skill_result = _degraded_skill_result("degraded_execution_policy")
            else:
                def _run_skill() -> Any:
                    return self.router.route(skill_id, skill_payload)
                try:
                    skill_result = _run_skill()
                except Exception as exc:
                    handled = self.failure_engine.handle(
                        exc,
                        {"stage": f"skill:{skill_id}", "retry_count": 2},
                        execute_fn=_run_skill,
                        fallback_fn=lambda: _degraded_skill_result("runtime_exception_fallback"),
                    )
                    skill_result = handled.get("result") if handled.get("status") == "success" else {"status": "failed", "error": handled.get("error")}
            skill_trace.append(
                {
                    "skill_id": skill_id,
                    "result": skill_result,
                    "bound_subskills": [item["subskill_id"] for item in bound_subskills],
                }
            )
            dossier_writes.append(
                self.dossier_store.append(
                    dossier_id,
                    {
                        "stage": f"{normalized}:skill:{skill_id}",
                        "director_id": trace["director"]["director_id"],
                        "output": _summarize_output_for_dossier(skill_result),
                    },
                )
            )
            if isinstance(skill_result, dict) and skill_result.get("status") == "failed":
                current_output = skill_result
                break
            current_output = skill_result.get("result") if isinstance(skill_result, dict) else skill_result
            if not (isinstance(current_output, dict) and current_output.get("status") == "failed"):
                for subskill in bound_subskills:
                    run_fn = self._load_callable_from_path(subskill["runtime_file"])

                    def _run_subskill() -> Any:
                        return run_fn(
                            {
                                "dossier_id": dossier_id,
                                "route_id": route_id,
                                "input_payload": current_output if isinstance(current_output, dict) else {"input": current_output},
                            }
                        )

                    try:
                        subskill_result = _run_subskill()
                    except Exception as exc:
                        handled = self.failure_engine.handle(
                            exc,
                            {"stage": f"subskill:{subskill['subskill_id']}", "retry_count": 2},
                            execute_fn=_run_subskill,
                        )
                        subskill_result = handled.get("result") if handled.get("status") == "success" else {"status": "failed", "error": handled.get("error")}
                    subskill_trace.append({"skill_id": skill_id, "subskill_id": subskill["subskill_id"], "result": subskill_result})
                    dossier_writes.append(
                        self.dossier_store.append(
                            dossier_id,
                            {
                                "stage": f"{normalized}:subskill:{subskill['subskill_id']}",
                                "skill_id": skill_id,
                                "director_id": trace["director"]["director_id"],
                                "output": _summarize_output_for_dossier(subskill_result),
                            },
                        )
                    )
                    if isinstance(subskill_result, dict) and subskill_result.get("status") == "failed":
                        current_output = subskill_result
                        break
                    current_output = subskill_result
        trace["subskills"] = subskill_trace
        trace["skills"] = skill_trace
        trace["dossier_writes"] = dossier_writes

        enforce_agent_success = bool(base_payload.get("enforce_agent_success", False))
        failed = False
        failure_stage = ""
        stage_results = [("sub_agent", sub_agent_result)]
        if enforce_agent_success:
            stage_results.insert(0, ("agent", agent_result))

        for stage_name, result in stage_results:
            if isinstance(result, dict) and result.get("status") == "failed":
                failed = True
                failure_stage = stage_name
                break

        if not failed:
            for item in skill_trace:
                result = item.get("result", {})
                if isinstance(result, dict) and result.get("status") == "failed":
                    failed = True
                    failure_stage = f"skill:{item.get('skill_id')}"
                    break

        if not failed:
            for item in subskill_trace:
                result = item.get("result", {})
                if isinstance(result, dict) and result.get("status") == "failed":
                    failed = True
                    failure_stage = f"subskill:{item.get('subskill_id')}"
                    break

        return {
            "status": "failed" if failed else "success",
            "workflow_id": normalized,
            "failure_stage": failure_stage or None,
            "agent_status_enforced": enforce_agent_success,
            "director_id": trace["director"]["director_id"],
            "agent_id": str(agent_entry.get("agent_slug", "")) if isinstance(agent_entry, dict) else "",
            "sub_agent_id": str(sub_agent_entry.get("workflow_slug", "")) if isinstance(sub_agent_entry, dict) else "",
            "trace": trace,
            "final_output": current_output,
        }

    def execute_plan(self, workflow_plan: list[str], payload: dict[str, Any]) -> dict[str, Any]:
        plan = [_normalize_workflow_id(item) for item in workflow_plan if str(item).strip()]
        if not plan:
            plan = list(DEFAULT_WORKFLOW_PLAN)
        plan = self.expand_workflow_plan(plan)

        tasks: list[Task] = []
        previous = ""
        for workflow_id in plan:
            dependencies = [previous] if previous else []
            tasks.append(Task(id=workflow_id, dependencies=dependencies, payload={}, retry_count=3))
            previous = workflow_id

        executions: list[dict[str, Any]] = []
        current_payload = dict(payload)
        current_output: Any = current_payload.get("input", current_payload.get("intent", ""))

        def _execute_task(task: Task, context_map: dict[str, Any]) -> dict[str, Any]:
            nonlocal current_output, current_payload, executions
            current_payload["input"] = current_output
            workflow_result = self.execute_workflow(task.id, current_payload)
            executions.append(workflow_result)
            if workflow_result.get("status") != "success":
                return {"status": "failed", "error": workflow_result.get("failure_stage", "workflow_failed"), "workflow_result": workflow_result}
            current_output = workflow_result.get("final_output")
            current_payload["input"] = current_output
            return {"status": "success", "workflow_result": workflow_result}

        dag_results = DAGExecutor().run(tasks, _execute_task, initial_context={})
        failed_entry = next((item for item in dag_results if item.get("status") != "success"), None)
        if failed_entry:
            failed_workflow = str(failed_entry.get("task_id", ""))
            failed_payload = failed_entry.get("result", {}).get("workflow_result", {})
            return {
                "status": "failed",
                "workflow_plan": plan,
                "failed_workflow": failed_workflow,
                "executions": executions,
                "dag_results": dag_results,
                "final_output": failed_payload.get("final_output"),
            }

        return {
            "status": "success",
            "workflow_plan": plan,
            "executions": executions,
            "dag_results": dag_results,
            "final_output": current_output,
        }


class HierarchicalRuntime:
    """High-level execution wrapper for registry-backed hierarchical orchestration."""

    def __init__(self) -> None:
        self.resolver = HierarchyResolver()

    def run_intent(self, intent: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
        ctx = context or {}
        route_id = str(ctx.get("route_id", "ROUTE_PHASE1_STANDARD"))
        workflow_plan = ctx.get("workflow_plan")
        if not isinstance(workflow_plan, list):
            workflow_plan = self.resolver.resolve_route_plan(route_id)
        payload = dict(ctx.get("payload", {})) if isinstance(ctx.get("payload"), dict) else {}
        payload.setdefault("intent", intent)
        payload.setdefault("route_id", route_id)
        payload.setdefault("dossier_id", str(ctx.get("dossier_id", "DOSSIER-HIERARCHY")))
        return self.resolver.execute_plan(workflow_plan, payload)
