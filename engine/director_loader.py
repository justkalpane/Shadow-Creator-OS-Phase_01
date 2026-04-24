from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from engine.skill_catalog import ROOT


DIRECTORS_DIR = ROOT / "directors"


def _find_director_file(director_name: str) -> Path | None:
    token = str(director_name or "").strip().lower().replace(" ", "_")
    if not token:
        return None
    for ext in (".yaml", ".yml", ".md"):
        direct = DIRECTORS_DIR / f"{token}{ext}"
        if direct.exists():
            return direct
    for path in sorted(DIRECTORS_DIR.rglob("*")):
        if not path.is_file():
            continue
        if path.suffix.lower() not in {".yaml", ".yml", ".md"}:
            continue
        if path.stem.strip().lower() == token:
            return path
    return None


def _parse_markdown_rules(text: str) -> dict[str, Any]:
    constraints: list[str] = []
    priorities: list[str] = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        if re.search(r"\b(must|never|require|mandatory)\b", line, re.IGNORECASE):
            constraints.append(line.lstrip("-* ").strip())
        if re.search(r"\b(priority|authority|gate|routing|escalation)\b", line, re.IGNORECASE):
            priorities.append(line.lstrip("-* ").strip())
    return {
        "constraints": constraints[:25],
        "priorities": priorities[:25],
    }


@dataclass
class DirectorContract:
    director_id: str
    name: str
    source_file: str
    constraints: list[str]
    priorities: list[str]

    def evaluate(self, context: dict[str, Any]) -> dict[str, Any]:
        requested_agent = str(context.get("agent_slug") or "").strip()
        fallback_agent = f"{self.name.lower()}_agent"
        selected_agent = requested_agent or fallback_agent
        return {
            "director_id": self.director_id,
            "director_name": self.name,
            "selected_agent": selected_agent,
            "priority": "normal",
            "constraints": list(self.constraints),
            "source_file": self.source_file,
        }


def load_director(director_name: str, director_id: str = "") -> DirectorContract:
    path = _find_director_file(director_name)
    if path is None:
        return DirectorContract(
            director_id=director_id or f"DIR-{str(director_name).upper()}",
            name=str(director_name or "unknown"),
            source_file="",
            constraints=[],
            priorities=[],
        )

    text = path.read_text(encoding="utf-8", errors="replace")
    parsed = _parse_markdown_rules(text)
    return DirectorContract(
        director_id=director_id or f"DIR-{str(director_name).upper()}",
        name=str(director_name or path.stem),
        source_file=str(path.relative_to(ROOT).as_posix()),
        constraints=list(parsed.get("constraints", [])),
        priorities=list(parsed.get("priorities", [])),
    )
