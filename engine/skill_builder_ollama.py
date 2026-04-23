from __future__ import annotations

import json

import requests

from engine.skill_catalog import ROOT, iter_skill_markdown_files, skill_id_from_path, skill_py_path


OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3.2:3b"

TEMPLATE = '''from __future__ import annotations

import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3.2:3b"
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


def build() -> list[dict[str, str]]:
    report: list[dict[str, str]] = []
    for md_path in iter_skill_markdown_files():
        py_path = skill_py_path(md_path)
        markdown = md_path.read_text(encoding="utf-8")
        py_path.write_text(TEMPLATE.format(prompt=_escape_triple_quotes(markdown)), encoding="utf-8")
        report.append({"skill": skill_id_from_path(md_path), "status": "UPDATED"})
    return report


if __name__ == "__main__":
    print(json.dumps(build(), indent=2))
