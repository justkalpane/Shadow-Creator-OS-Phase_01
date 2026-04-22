<<<<<<< HEAD
"""
skill_builder.py

Auto-generates executable Python skill modules from .md skill definitions.

Input:
  skills/<category>/<skill>.md

Output:
  skills/<category>/<skill>.py

Each generated file contains a standard run() function.
"""

import os

SKILLS_ROOT = "skills"

TEMPLATE = '''"""
AUTO-GENERATED SKILL MODULE
Source: {md_path}
"""

def run(input_payload):
    """
    Standard skill execution entrypoint
    """
    # TODO: Replace with actual logic / LLM call
    return {{
        "message": "Executed {skill_id}",
        "input": input_payload
    }}
'''


def build_skill(md_path, py_path, skill_id):
    if os.path.exists(py_path):
        return "SKIPPED"

    content = TEMPLATE.format(md_path=md_path, skill_id=skill_id)

    with open(py_path, "w", encoding="utf-8") as f:
        f.write(content)

    return "CREATED"


def generate():
    results = []

    for category in os.listdir(SKILLS_ROOT):
        category_path = os.path.join(SKILLS_ROOT, category)

        if not os.path.isdir(category_path):
            continue

        for file in os.listdir(category_path):
            if not file.endswith(".md"):
                continue

            skill_name = file.replace(".md", "")
            skill_id = f"{category}.{skill_name}"

            md_path = os.path.join(category_path, file)
            py_path = os.path.join(category_path, f"{skill_name}.py")

            status = build_skill(md_path, py_path, skill_id)

            results.append({
                "skill": skill_id,
                "status": status
            })

    return results


if __name__ == "__main__":
    output = generate()
    for item in output:
        print(item)
=======
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = ROOT / "skills"

STUB = '''def run(input_payload):
    return {
        "status": "success",
        "output": "Executed {skill_id}",
        "input": input_payload
    }
'''


def _skill_id_from_path(path: Path) -> str:
    category = path.parent.name
    stem = path.stem.replace(".skill", "")
    return f"{category}.{stem}".lower().replace("-", "_")


def build() -> list[dict[str, str]]:
    report: list[dict[str, str]] = []
    for md_path in sorted(SKILLS_DIR.rglob("*.md")):
        py_path = md_path.with_suffix(".py")
        skill_id = _skill_id_from_path(md_path)
        if py_path.exists():
            report.append({"skill": skill_id, "status": "SKIPPED"})
            continue
        py_path.write_text(STUB.format(skill_id=skill_id), encoding="utf-8")
        report.append({"skill": skill_id, "status": "CREATED"})
    return report


if __name__ == "__main__":
    print(json.dumps(build(), indent=2))
>>>>>>> e07941e (sync: local changes before pull)
