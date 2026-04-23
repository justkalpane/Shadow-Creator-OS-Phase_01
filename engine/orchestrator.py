from __future__ import annotations

from typing import Any

from engine.chain_executor import ChainExecutor


def run(intent: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
    """Unified runtime entrypoint for Shadow Empire execution."""
    ctx = context or {}
    text_intent = str(intent or "").strip()
    use_director = bool(ctx.get("use_director", False))

    try:
        if use_director:
            from engine.director_engine import DirectorEngine

            result = DirectorEngine().execute(
                text_intent,
                dossier_id=ctx.get("dossier_id"),
            )
            return {
                "status": "success",
                "mode": "director",
                "intent": text_intent,
                "result": result,
                "error": None,
            }

        chain = ctx.get("chain")
        if not isinstance(chain, list) or not chain:
            chain = [
                "research_intelligence.m_011_knowledge_dossier_builder",
                "script_intelligence.s_202_first_draft_generation",
                "script_intelligence.s_210_final_script_packager",
            ]

        result = ChainExecutor().execute_chain(chain, text_intent)
        return {
            "status": "success",
            "mode": "chain",
            "intent": text_intent,
            "result": result,
            "error": None,
        }
    except Exception as exc:  # pragma: no cover - defensive runtime boundary
        return {
            "status": "failed",
            "mode": "director" if use_director else "chain",
            "intent": text_intent,
            "result": None,
            "error": str(exc),
        }
