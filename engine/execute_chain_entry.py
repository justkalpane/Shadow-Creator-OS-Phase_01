from __future__ import annotations

import json
import sys

from engine.chain_executor import ChainExecutor
from engine.director_engine import DirectorEngine


def main() -> None:
    try:
        data = json.loads(sys.stdin.read() or "{}")
        user_input = data.get("input", "")
        dossier_id = data.get("dossier_id")
        use_director = bool(data.get("use_director", False))
        use_chain = bool(data.get("use_chain", True))

        if use_director:
            result = DirectorEngine().execute(user_input, dossier_id=dossier_id)
        elif use_chain:
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
            result = {"status": "noop", "message": "Neither use_director nor use_chain enabled"}

        print(json.dumps({"status": "success", "result": result}))
    except Exception as exc:
        print(json.dumps({"status": "failed", "error": str(exc)}))


if __name__ == "__main__":
    main()
