from __future__ import annotations

import time
from typing import Any, Callable


class ExecutionContract:
    """Uniform execution wrapper for skill callables."""

    def __init__(self, skill_id: str | None = None, input_payload: dict[str, Any] | None = None) -> None:
        self.skill_id = skill_id
        self.input_payload = input_payload or {}

    def validate_input(self) -> None:
        if not self.skill_id:
            raise ValueError("Missing skill_id")
        if not isinstance(self.input_payload, dict):
            raise ValueError("input_payload must be dict")

    @staticmethod
    def _type_matches(value: Any, expected_type: str) -> bool:
        if expected_type == "string":
            return isinstance(value, str)
        if expected_type == "number":
            return isinstance(value, (int, float)) and not isinstance(value, bool)
        if expected_type == "integer":
            return isinstance(value, int) and not isinstance(value, bool)
        if expected_type == "boolean":
            return isinstance(value, bool)
        if expected_type == "object":
            return isinstance(value, dict)
        if expected_type == "array":
            return isinstance(value, list)
        if expected_type == "null":
            return value is None
        if expected_type == "any":
            return True
        raise ValueError(f"Unsupported schema type '{expected_type}'")

    def _validate_schema(self, value: Any, schema: dict[str, Any], path: str) -> None:
        expected_type = schema.get("type")
        if expected_type:
            if not self._type_matches(value, str(expected_type)):
                actual = type(value).__name__
                raise ValueError(f"{path} expected type '{expected_type}' but got '{actual}'")

        if expected_type == "object":
            if not isinstance(value, dict):
                raise ValueError(f"{path} expected object")
            required = schema.get("required", [])
            if required and not isinstance(required, list):
                raise ValueError(f"{path}.required must be a list")
            for field in required or []:
                if field not in value:
                    raise ValueError(f"{path} missing required field '{field}'")

            properties = schema.get("properties", {})
            if properties and not isinstance(properties, dict):
                raise ValueError(f"{path}.properties must be an object")
            for field, field_schema in properties.items():
                if field not in value:
                    continue
                if not isinstance(field_schema, dict):
                    raise ValueError(f"{path}.properties.{field} must be an object")
                self._validate_schema(value[field], field_schema, f"{path}.{field}")

            allow_additional = bool(schema.get("additionalProperties", True))
            if not allow_additional and isinstance(properties, dict):
                allowed = set(properties.keys())
                extras = [k for k in value.keys() if k not in allowed]
                if extras:
                    raise ValueError(f"{path} has unexpected fields: {extras}")

        if expected_type == "array":
            if not isinstance(value, list):
                raise ValueError(f"{path} expected array")
            item_schema = schema.get("items")
            if item_schema is not None:
                if not isinstance(item_schema, dict):
                    raise ValueError(f"{path}.items must be an object")
                for idx, item in enumerate(value):
                    self._validate_schema(item, item_schema, f"{path}[{idx}]")

    def _validate_input_payload(self, payload: Any, input_schema: dict[str, Any] | None) -> dict[str, Any]:
        if not isinstance(payload, dict):
            raise ValueError("input_payload must be dict")
        if input_schema is not None:
            if not isinstance(input_schema, dict):
                raise ValueError("input_schema must be a dict")
            self._validate_schema(payload, input_schema, "input_payload")
        return payload

    def _validate_output_payload(self, result: Any, output_schema: dict[str, Any] | None) -> None:
        if not isinstance(result, dict):
            actual = type(result).__name__
            raise ValueError(f"output_payload must be dict, got '{actual}'")
        if output_schema is not None:
            if not isinstance(output_schema, dict):
                raise ValueError("output_schema must be a dict")
            self._validate_schema(result, output_schema, "output_payload")

    @staticmethod
    def _extract_contract(payload: dict[str, Any]) -> tuple[dict[str, Any] | None, dict[str, Any] | None]:
        contract = payload.get("__contract__")
        if contract is None:
            return None, None
        if not isinstance(contract, dict):
            raise ValueError("__contract__ must be an object")
        return contract.get("input_schema"), contract.get("output_schema")

    def execute(self, skill_callable: Callable[[dict[str, Any]], Any], input_payload: dict[str, Any] | None = None) -> dict[str, Any]:
        payload = self.input_payload if input_payload is None else input_payload
        started = time.perf_counter()
        try:
            if not isinstance(payload, dict):
                raise ValueError("input_payload must be dict")
            input_schema, output_schema = self._extract_contract(payload)
            validated_payload = self._validate_input_payload(payload, input_schema)
            result = skill_callable(validated_payload)
            self._validate_output_payload(result, output_schema)
            return {
                "status": "success",
                "result": result,
                "error": None,
                "execution_time": round(time.perf_counter() - started, 6),
            }
        except Exception as exc:  # pragma: no cover - defensive runtime guard
            return {
                "status": "failed",
                "result": None,
                "error": str(exc),
                "execution_time": round(time.perf_counter() - started, 6),
            }
