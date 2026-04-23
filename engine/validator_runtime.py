from __future__ import annotations

import json
import re
from pathlib import Path

from engine.skill_catalog import ROOT, iter_skill_markdown_files


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
    for path in iter_skill_markdown_files():
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
