<<<<<<< HEAD
"""
skill_builder_ollama.py
Ollama-enabled version (non-destructive upgrade)
"""

import os

SKILLS_ROOT = "skills"

TEMPLATE = '''"""
AUTO-GENERATED SKILL MODULE (OLLAMA ENABLED)
Source: {md_path}
"""
=======
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = ROOT / "skills"

TEMPLATE = '''from __future__ import annotations
>>>>>>> e07941e (sync: local changes before pull)

import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3"
<<<<<<< HEAD


def load_prompt():
    with open(r"{md_path}", "r", encoding="utf-8") as f:
        return f.read()


def run(input_payload):
    prompt_template = load_prompt()
    user_input = input_payload.get("input", "")

    full_prompt = f"""
{prompt_template}

User Input:
{user_input}
"""

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL,
                "prompt": full_prompt,
                "stream": False
            }
        )

        data = response.json()

        return {
            "status": "success",
            "output": data.get("response"),
            "model": MODEL
        }

    except Exception as e:
        return {
            "status": "failed",
            "error": str(e)
        }
'''


def generate():
    for category in os.listdir(SKILLS_ROOT):
        category_path = os.path.join(SKILLS_ROOT, category)

        if not os.path.isdir(category_path):
            continue

        for file in os.listdir(category_path):
            if not file.endswith(".md"):
                continue

            skill_name = file.replace(".md", "")
            md_path = os.path.join(category_path, file)
            py_path = os.path.join(category_path, f"{skill_name}.py")

            with open(py_path, "w", encoding="utf-8") as f:
                f.write(TEMPLATE.format(md_path=md_path))

    print("Ollama skills generated")


if __name__ == "__main__":
    generate()
=======
PROMPT_TEMPLATE = """{prompt}"""


def run(input_payload):
    user_input = input_payload.get("input", "")
    prompt = PROMPT_TEMPLATE + "\\n\\nUser Input:\\n" + str(user_input)
    response = requests.post(
        OLLAMA_URL,
        json={{"model": MODEL, "prompt": prompt, "stream": False}},
        timeout=120,
    )
    response.raise_for_status()
    data = response.json()
    return {{
        "status": "success",
        "output": data.get("response", ""),
        "model": MODEL,
    }}
'''


def _escape_triple_quotes(text: str) -> str:
    return text.replace('"""', '\\"\\"\\"')


def _skill_id_from_path(path: Path) -> str:
    category = path.parent.name
    stem = path.stem.replace(".skill", "")
    return f"{category}.{stem}".lower().replace("-", "_")


def build() -> list[dict[str, str]]:
    report: list[dict[str, str]] = []
    for md_path in sorted(SKILLS_DIR.rglob("*.md")):
        py_path = md_path.with_suffix(".py")
        markdown = md_path.read_text(encoding="utf-8")
        py_path.write_text(TEMPLATE.format(prompt=_escape_triple_quotes(markdown)), encoding="utf-8")
        report.append({"skill": _skill_id_from_path(md_path), "status": "UPDATED"})
    return report


if __name__ == "__main__":
    print(json.dumps(build(), indent=2))
>>>>>>> e07941e (sync: local changes before pull)
