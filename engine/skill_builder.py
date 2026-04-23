from __future__ import annotations

import json
from pathlib import Path

from engine.skill_catalog import ROOT, iter_skill_markdown_files, skill_id_from_path, skill_py_path


STUB = '''from __future__ import annotations


def run(input_payload):
    return {
        "status": "success",
        "output": "Executed {skill_id}",
        "input": input_payload,
    }
'''


def build() -> list[dict[str, str]]:
    report: list[dict[str, str]] = []
    for md_path in iter_skill_markdown_files():
        py_path = skill_py_path(md_path)
        skill_id = skill_id_from_path(md_path)
        if py_path.exists():
            report.append({"skill": skill_id, "status": "SKIPPED"})
            continue
        py_path.write_text(STUB.format(skill_id=skill_id), encoding="utf-8")
        report.append({"skill": skill_id, "status": "CREATED"})
    return report


if __name__ == "__main__":
    print(json.dumps(build(), indent=2))
