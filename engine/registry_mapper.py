from __future__ import annotations

import json
from pathlib import Path

from engine.skill_catalog import ROOT, iter_skill_markdown_files, relative_posix, skill_id_from_path, skill_py_path


REGISTRY_OUT = ROOT / "engine" / "runtime_registry.json"


def build_registry() -> dict[str, dict[str, str]]:
    registry: dict[str, dict[str, str]] = {}
    for md_path in iter_skill_markdown_files():
        py_path = skill_py_path(md_path)
        skill_id = skill_id_from_path(md_path)
        registry[skill_id] = {
            "skill_markdown": relative_posix(md_path),
            "module_path": relative_posix(py_path),
            "entrypoint": "run",
        }

    REGISTRY_OUT.write_text(json.dumps(registry, indent=2), encoding="utf-8")
    return registry


if __name__ == "__main__":
    print(json.dumps({"mapped": len(build_registry())}, indent=2))
