from __future__ import annotations

from typing import Any

from engine.chain_executor import ChainExecutor


def run(intent: str, context: dict[str, Any] | None = None) -> dict[str, Any]:
    """Unified runtime entrypoint for Shadow Empire execution."""
    ctx = context or {}
    text_intent = str(intent or "").strip()
    use_director = bool(ctx.get("use_director", False))
    if "use_hierarchy" in ctx:
        use_hierarchy = bool(ctx.get("use_hierarchy"))
    else:
        use_hierarchy = not use_director

    try:
        if use_hierarchy:
            from engine.hierarchical_runtime import HierarchicalRuntime

            result = HierarchicalRuntime().run_intent(text_intent, ctx)
            return {
                "status": "success" if result.get("status") == "success" else "failed",
                "mode": "hierarchy",
                "intent": text_intent,
                "result": result,
                "error": None if result.get("status") == "success" else "hierarchical_execution_failed",
            }

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
