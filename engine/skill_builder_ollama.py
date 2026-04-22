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

import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3"


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
