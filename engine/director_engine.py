from __future__ import annotations

import json
from typing import Any

import requests

from engine.chain_executor import ChainExecutor
from engine.dossier_manager import DossierManager

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3.2:3b"


class DirectorEngine:
    def __init__(self) -> None:
        self.executor = ChainExecutor()
        self.dossiers = DossierManager()

    def _default_chain(self) -> list[str]:
        return [
            "research_intelligence.m_011_knowledge_dossier_builder",
            "script_intelligence.s_202_first_draft_generation",
            "script_intelligence.s_210_final_script_packager",
        ]

    def decide_chain(self, user_input: str, dossier: dict[str, Any]) -> list[str]:
        prompt = f"""
You are the Director Orchestrator.
Return ONLY a JSON array of skill IDs.
Context:
{json.dumps(dossier.get("history", [])[-5:], ensure_ascii=False)}
User Input:
{user_input}
"""
        try:
            response = requests.post(
                OLLAMA_URL,
                json={"model": MODEL, "prompt": prompt, "stream": False},
                timeout=30,
            )
            response.raise_for_status()
            raw = response.json().get("response", "[]").strip()
            data = json.loads(raw)
            if isinstance(data, list) and all(isinstance(item, str) for item in data):
                return data
        except Exception:
            pass
        return self._default_chain()

    def execute(self, user_input: str, dossier_id: str | None = None) -> dict[str, Any]:
        if not dossier_id:
            dossier_id = self.dossiers.create_dossier()
        dossier = self.dossiers.load_dossier(dossier_id) or {"history": []}
        chain = self.decide_chain(user_input, dossier)
        result = self.executor.execute_chain(chain, user_input)
        for entry in result.get("trace", []):
            self.dossiers.update_dossier(
                dossier_id,
                entry.get("step", "unknown"),
                user_input,
                entry.get("result"),
            )
        return {
            "dossier_id": dossier_id,
            "chain_used": chain,
            "final_output": result.get("final_output"),
            "trace": result.get("trace"),
        }
