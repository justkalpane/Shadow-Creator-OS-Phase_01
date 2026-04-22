<<<<<<< HEAD
"""
registry_mapper.py

Purpose:
---------
Convert .md skill files into executable registry mappings
for runtime_router.

This is the bridge between:
- skills/<category>/<skill>.md  (design layer)
- engine runtime execution layer

Output:
--------
{
  "voice.generate": "skills.voice.generate:run"
}
"""

import os
import re
from typing import Dict

SKILLS_ROOT = "skills"


def normalize_skill_id(category: str, filename: str) -> str:
    """Convert file path → skill_id"""
    name = filename.replace(".md", "")
    return f"{category}.{name}"


def resolve_module_path(category: str, filename: str) -> str:
    """Convert to python module path"""
    name = filename.replace(".md", "")
    return f"skills.{category}.{name}:run"


def build_registry(skills_root: str = SKILLS_ROOT) -> Dict[str, str]:
    """
    Scan skills directory and build mapping
    """
    registry = {}

    if not os.path.exists(skills_root):
        raise FileNotFoundError(f"Skills directory not found: {skills_root}")

    for category in os.listdir(skills_root):
        category_path = os.path.join(skills_root, category)

        if not os.path.isdir(category_path):
            continue

        for file in os.listdir(category_path):
            if not file.endswith(".md"):
                continue

            skill_id = normalize_skill_id(category, file)
            module_path = resolve_module_path(category, file)

            registry[skill_id] = module_path

=======
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = ROOT / "skills"
REGISTRY_OUT = ROOT / "engine" / "runtime_registry.json"


def _skill_id_from_path(path: Path) -> str:
    category = path.parent.name
    stem = path.stem.replace(".skill", "")
    return f"{category}.{stem}".lower().replace("-", "_")


def build_registry() -> dict[str, dict[str, str]]:
    registry: dict[str, dict[str, str]] = {}
    for md_path in sorted(SKILLS_DIR.rglob("*.md")):
        py_path = md_path.with_suffix(".py")
        skill_id = _skill_id_from_path(md_path)
        registry[skill_id] = {
            "skill_markdown": md_path.as_posix(),
            "module_path": py_path.as_posix(),
            "entrypoint": "run",
        }
    REGISTRY_OUT.write_text(json.dumps(registry, indent=2), encoding="utf-8")
>>>>>>> e07941e (sync: local changes before pull)
    return registry


if __name__ == "__main__":
<<<<<<< HEAD
    reg = build_registry()
    for k, v in reg.items():
        print(f"{k} → {v}")
=======
    print(json.dumps({"mapped": len(build_registry())}, indent=2))
>>>>>>> e07941e (sync: local changes before pull)
