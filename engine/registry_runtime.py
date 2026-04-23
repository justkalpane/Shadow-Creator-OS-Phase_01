from __future__ import annotations

import json
import re
from pathlib import Path

from engine.skill_catalog import DIRECTORS_DIR, ROOT, iter_skill_markdown_files, relative_posix, skill_id_from_path


OUTPUT_SKILL_INDEX = ROOT / "engine" / "skill_index.json"
OUTPUT_DIRECTOR_INDEX = ROOT / "engine" / "director_index.json"

DIRECTOR_LINE = re.compile(r"^\s*director\s*:\s*(.+?)\s*$", re.IGNORECASE)
DESCRIPTION_LINE = re.compile(r"^\s*description\s*:\s*(.+?)\s*$", re.IGNORECASE)


def _extract_metadata(path: Path) -> dict[str, str | None]:
    director = None
    description = None
    with path.open("r", encoding="utf-8") as handle:
        for idx, line in enumerate(handle):
            if idx > 120:
                break
            if director is None:
                match = DIRECTOR_LINE.match(line)
                if match:
                    director = match.group(1).strip()
            if description is None:
                match = DESCRIPTION_LINE.match(line)
                if match:
                    description = match.group(1).strip()
            if director and description:
                break

    return {"director": director, "description": description}


def build_indexes() -> dict[str, object]:
    skills: dict[str, dict[str, object]] = {}
    directors: dict[str, dict[str, object]] = {}
    errors: list[str] = []

    for md_path in iter_skill_markdown_files():
        skill_id = skill_id_from_path(md_path)
        meta = _extract_metadata(md_path)
        skills[skill_id] = {
            "id": skill_id,
            "category": md_path.parent.name,
            "path": relative_posix(md_path),
            "director": meta["director"],
            "description": meta["description"],
        }
        if not meta["director"]:
            errors.append(f"Skill missing director: {relative_posix(md_path)}")

    for path in sorted(DIRECTORS_DIR.rglob("*.md")):
        if not path.is_file():
            continue
        director_id = path.stem.lower().replace("-", "_")
        directors[director_id] = {
            "id": director_id,
            "path": relative_posix(path),
            "council": path.parent.name,
        }

    OUTPUT_SKILL_INDEX.write_text(json.dumps(skills, indent=2), encoding="utf-8")
    OUTPUT_DIRECTOR_INDEX.write_text(json.dumps(directors, indent=2), encoding="utf-8")
    return {
        "skills": len(skills),
        "directors": len(directors),
        "errors": errors,
    }


if __name__ == "__main__":
    print(json.dumps(build_indexes(), indent=2))
