<<<<<<< HEAD
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
SKILLS = BASE / "skills"
DIRECTORS = BASE / "directors"

class RegistryRuntime:

    def __init__(self):
        self.skills = {}
        self.directors = {}

    def extract_metadata(self, file_path):
        data = {
            "id": file_path.stem,
            "path": str(file_path),
            "category": file_path.parent.name,
            "director": None,
            "valid": False
        }

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                lines = f.readlines()

            for line in lines[:25]:
                if line.lower().startswith("director:"):
                    data["director"] = line.split(":", 1)[1].strip()

        except Exception as e:
            data["error"] = str(e)

        return data

    def scan_skills(self):
        for file in SKILLS.rglob("*.md"):
            meta = self.extract_metadata(file)
            self.skills[meta["id"]] = meta

    def scan_directors(self):
        for file in DIRECTORS.rglob("*.md"):
            self.directors[file.stem] = {
                "id": file.stem,
                "path": str(file),
                "skills": []
            }

    def bind(self):
        for skill_id, skill in self.skills.items():
            director = skill.get("director")

            if director and director in self.directors:
                self.directors[director]["skills"].append(skill_id)
                self.skills[skill_id]["valid"] = True
                continue

            category = skill.get("category")
            for director_id in self.directors:
                if category.lower() in director_id.lower():
                    self.directors[director_id]["skills"].append(skill_id)
                    self.skills[skill_id]["director"] = director_id
                    self.skills[skill_id]["valid"] = True
                    break

    def validate(self):
        errors = []

        for skill_id, skill in self.skills.items():
            if not skill.get("director"):
                errors.append(f"Skill NOT mapped → {skill_id}")

        for director_id, director in self.directors.items():
            if len(director["skills"]) == 0:
                errors.append(f"Director EMPTY → {director_id}")

        return errors

    def build(self):
        self.scan_skills()
        self.scan_directors()
        self.bind()

        errors = self.validate()

        (BASE / "engine").mkdir(exist_ok=True)

        with open(BASE / "engine/skill_index.json", "w") as f:
            json.dump(self.skills, f, indent=2)

        with open(BASE / "engine/director_index.json", "w") as f:
            json.dump(self.directors, f, indent=2)

        return {
            "skills": len(self.skills),
            "directors": len(self.directors),
            "errors": errors
        }

if __name__ == "__main__":
    r = RegistryRuntime()
    result = r.build()
    print(json.dumps(result, indent=2))
=======
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = ROOT / "skills"
DIRECTORS_DIR = ROOT / "directors"
OUTPUT_SKILL_INDEX = ROOT / "engine" / "skill_index.json"
OUTPUT_DIRECTOR_INDEX = ROOT / "engine" / "director_index.json"

DIRECTOR_LINE = re.compile(r"^\s*director\s*:\s*(.+?)\s*$", re.IGNORECASE)
DESCRIPTION_LINE = re.compile(r"^\s*description\s*:\s*(.+?)\s*$", re.IGNORECASE)


def _read_first_lines(path: Path, limit: int = 120) -> list[str]:
    lines: list[str] = []
    with path.open("r", encoding="utf-8") as handle:
        for idx, line in enumerate(handle):
            lines.append(line.rstrip("\n"))
            if idx >= limit:
                break
    return lines


def _extract_metadata(path: Path) -> dict[str, str | None]:
    director = None
    description = None
    for line in _read_first_lines(path):
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

    return {
        "director": director,
        "description": description,
    }


def build_indexes() -> dict[str, object]:
    skills: dict[str, dict[str, object]] = {}
    directors: dict[str, dict[str, object]] = {}
    errors: list[str] = []

    for path in sorted(SKILLS_DIR.rglob("*.md")):
        rel = path.relative_to(ROOT).as_posix()
        category = path.parent.name
        stem = path.stem.replace(".skill", "")
        skill_id = f"{category}.{stem}".lower().replace("-", "_")
        meta = _extract_metadata(path)
        skills[skill_id] = {
            "id": skill_id,
            "category": category,
            "path": rel,
            "director": meta["director"],
            "description": meta["description"],
        }
        if not meta["director"]:
            errors.append(f"Skill missing director: {rel}")

    for path in sorted(DIRECTORS_DIR.rglob("*.md")):
        rel = path.relative_to(ROOT).as_posix()
        director_id = path.stem.lower().replace("-", "_")
        directors[director_id] = {
            "id": director_id,
            "path": rel,
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
>>>>>>> e07941e (sync: local changes before pull)
