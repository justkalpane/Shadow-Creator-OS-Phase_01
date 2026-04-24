from __future__ import annotations

import json
import sys
from typing import Any

from engine.orchestrator import run


def _read_cli_payload() -> tuple[str, dict[str, Any]]:
    raw_stdin = (sys.stdin.read() or "").strip()
    if raw_stdin:
        try:
            data = json.loads(raw_stdin)
            if isinstance(data, dict):
                intent = str(data.get("intent", data.get("input", "")))
                context = data.get("context", {})
                if not isinstance(context, dict):
                    context = {}
                if "use_director" in data and "use_director" not in context:
                    context["use_director"] = bool(data.get("use_director"))
                if "use_hierarchy" in data and "use_hierarchy" not in context:
                    context["use_hierarchy"] = bool(data.get("use_hierarchy"))
                if "chain" in data and "chain" not in context:
                    context["chain"] = data.get("chain")
                if "dossier_id" in data and "dossier_id" not in context:
                    context["dossier_id"] = data.get("dossier_id")
                if "route_id" in data and "route_id" not in context:
                    context["route_id"] = data.get("route_id")
                if "workflow_plan" in data and "workflow_plan" not in context:
                    context["workflow_plan"] = data.get("workflow_plan")
                if "payload" in data and "payload" not in context:
                    context["payload"] = data.get("payload")
                return intent, context
        except Exception:
            return raw_stdin, {}

    if len(sys.argv) > 1:
        return " ".join(sys.argv[1:]), {}
    return "", {}


def main() -> None:
    intent, context = _read_cli_payload()
    result = run(intent, context)
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
