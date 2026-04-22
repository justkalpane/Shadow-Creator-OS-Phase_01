import os
import json
import re

SKILLS_PATH = "skills"

REQUIRED_FIELDS = [
    "director",
    "description"
]

class ValidatorRuntime:

    def __init__(self, skills_path=SKILLS_PATH):
        self.skills_path = skills_path
        self.errors = []
        self.valid_skills = []

    def validate_skill_file(self, filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        skill_name = os.path.basename(filepath)

        missing_fields = []

        for field in REQUIRED_FIELDS:
            pattern = rf"{field}:"
            if not re.search(pattern, content, re.IGNORECASE):
                missing_fields.append(field)

        if missing_fields:
            self.errors.append({
                "skill": skill_name,
                "missing_fields": missing_fields
            })
        else:
            self.valid_skills.append(skill_name)

    def run_validation(self):
        for root, _, files in os.walk(self.skills_path):
            for file in files:
                if file.endswith(".md"):
                    self.validate_skill_file(os.path.join(root, file))

        return {
            "valid_skills": self.valid_skills,
            "errors": self.errors
        }

if __name__ == "__main__":
    vr = ValidatorRuntime()
    result = vr.run_validation()

    os.makedirs("engine", exist_ok=True)

    with open("engine/validation_report.json", "w", encoding='utf-8') as f:
        json.dump(result, f, indent=2)

    print(json.dumps(result, indent=2))
