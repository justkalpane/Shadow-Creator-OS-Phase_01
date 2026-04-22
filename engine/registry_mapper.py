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

    return registry


if __name__ == "__main__":
    reg = build_registry()
    for k, v in reg.items():
        print(f"{k} → {v}")
