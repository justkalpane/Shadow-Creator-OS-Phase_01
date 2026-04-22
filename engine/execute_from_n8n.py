from __future__ import annotations

import json
import sys

from engine.chain_executor import ChainExecutor
from engine.registry_mapper import build_registry
from engine.runtime_router import RuntimeRouter


def main() -> None:
    try:
        raw = sys.stdin.read() or "{}"
        data = json.loads(raw)

        user_input = data.get("input", "")
        skill = data.get("skill")
        use_chain = bool(data.get("use_chain", False))

        if use_chain:
            chain = data.get(
                "chain",
                [
                    "research_intelligence.m_011_knowledge_dossier_builder",
                    "script_intelligence.s_202_first_draft_generation",
                    "script_intelligence.s_210_final_script_packager",
                ],
            )
            result = ChainExecutor().execute_chain(chain, user_input)
        else:
            if not skill:
                raise ValueError("Missing 'skill' when use_chain is false")
            result = RuntimeRouter(build_registry()).route(skill, {"input": user_input})

        print(json.dumps({"status": "success", "result": result}))
    except Exception as exc:
        print(json.dumps({"status": "failed", "error": str(exc)}))


if __name__ == "__main__":
    main()
