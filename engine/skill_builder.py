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
