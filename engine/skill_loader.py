from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = ROOT / "skills"


def load_skill_markdown(skill_id: str) -> str | None:
    target = skill_id.lower().replace(".", "/")
    for path in SKILLS_DIR.rglob("*.md"):
        normalized = f"{path.parent.name}/{path.stem.replace('.skill', '')}".lower().replace("-", "_")
        if normalized == target:
            return path.read_text(encoding="utf-8")
    return None
