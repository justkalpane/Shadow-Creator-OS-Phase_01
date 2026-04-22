<<<<<<< HEAD
import os
import json
import re

SKILLS_PATH = "skills"

REQUIRED_FIELDS = [
    "director",
    "description"
]

class ValidatorRuntime:

    def __init__(self, skills_path=SKILLS_PATH):
        self.skills_path = skills_path
        self.errors = []
        self.valid_skills = []

    def validate_skill_file(self, filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        skill_name = os.path.basename(filepath)

        missing_fields = []

        for field in REQUIRED_FIELDS:
            pattern = rf"{field}:"
            if not re.search(pattern, content, re.IGNORECASE):
                missing_fields.append(field)

        if missing_fields:
            self.errors.append({
                "skill": skill_name,
                "missing_fields": missing_fields
            })
        else:
            self.valid_skills.append(skill_name)

    def run_validation(self):
        for root, _, files in os.walk(self.skills_path):
            for file in files:
                if file.endswith(".md"):
                    self.validate_skill_file(os.path.join(root, file))

        return {
            "valid_skills": self.valid_skills,
            "errors": self.errors
        }

if __name__ == "__main__":
    vr = ValidatorRuntime()
    result = vr.run_validation()

    os.makedirs("engine", exist_ok=True)

    with open("engine/validation_report.json", "w", encoding='utf-8') as f:
        json.dump(result, f, indent=2)

    print(json.dumps(result, indent=2))
=======
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = ROOT / "skills"
REPORT_PATH = ROOT / "engine" / "validation_report.json"

DIRECTOR_LINE = re.compile(r"^\s*director\s*:\s*(.+?)\s*$", re.IGNORECASE)
DESCRIPTION_LINE = re.compile(r"^\s*description\s*:\s*(.+?)\s*$", re.IGNORECASE)


def _missing_fields(path: Path) -> list[str]:
    has_director = False
    has_description = False
    with path.open("r", encoding="utf-8") as handle:
        for idx, line in enumerate(handle):
            if idx > 120:
                break
            if DIRECTOR_LINE.match(line):
                has_director = True
            if DESCRIPTION_LINE.match(line):
                has_description = True
            if has_director and has_description:
                break
    missing: list[str] = []
    if not has_director:
        missing.append("director")
    if not has_description:
        missing.append("description")
    return missing


def validate() -> dict[str, object]:
    valid_skills: list[str] = []
    errors: list[dict[str, object]] = []
    for path in sorted(SKILLS_DIR.rglob("*.md")):
        missing = _missing_fields(path)
        rel = path.relative_to(ROOT).as_posix()
        if missing:
            errors.append({"skill": rel, "missing_fields": missing})
        else:
            valid_skills.append(rel)

    report = {
        "valid_count": len(valid_skills),
        "error_count": len(errors),
        "valid_skills": valid_skills,
        "errors": errors,
    }
    REPORT_PATH.write_text(json.dumps(report, indent=2), encoding="utf-8")
    return report


if __name__ == "__main__":
    print(json.dumps(validate(), indent=2))
>>>>>>> e07941e (sync: local changes before pull)
