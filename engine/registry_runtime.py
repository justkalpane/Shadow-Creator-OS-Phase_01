import json
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
SKILLS = BASE / "skills"
DIRECTORS = BASE / "directors"

class RegistryRuntime:

    def __init__(self):
        self.skills = {}
        self.directors = {}

    def extract_metadata(self, file_path):
        data = {
            "id": file_path.stem,
            "path": str(file_path),
            "category": file_path.parent.name,
            "director": None,
            "valid": False
        }

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                lines = f.readlines()

            for line in lines[:25]:
                if line.lower().startswith("director:"):
                    data["director"] = line.split(":", 1)[1].strip()

        except Exception as e:
            data["error"] = str(e)

        return data

    def scan_skills(self):
        for file in SKILLS.rglob("*.md"):
            meta = self.extract_metadata(file)
            self.skills[meta["id"]] = meta

    def scan_directors(self):
        for file in DIRECTORS.rglob("*.md"):
            self.directors[file.stem] = {
                "id": file.stem,
                "path": str(file),
                "skills": []
            }

    def bind(self):
        for skill_id, skill in self.skills.items():
            director = skill.get("director")

            if director and director in self.directors:
                self.directors[director]["skills"].append(skill_id)
                self.skills[skill_id]["valid"] = True
                continue

            category = skill.get("category")
            for director_id in self.directors:
                if category.lower() in director_id.lower():
                    self.directors[director_id]["skills"].append(skill_id)
                    self.skills[skill_id]["director"] = director_id
                    self.skills[skill_id]["valid"] = True
                    break

    def validate(self):
        errors = []

        for skill_id, skill in self.skills.items():
            if not skill.get("director"):
                errors.append(f"Skill NOT mapped → {skill_id}")

        for director_id, director in self.directors.items():
            if len(director["skills"]) == 0:
                errors.append(f"Director EMPTY → {director_id}")

        return errors

    def build(self):
        self.scan_skills()
        self.scan_directors()
        self.bind()

        errors = self.validate()

        (BASE / "engine").mkdir(exist_ok=True)

        with open(BASE / "engine/skill_index.json", "w") as f:
            json.dump(self.skills, f, indent=2)

        with open(BASE / "engine/director_index.json", "w") as f:
            json.dump(self.directors, f, indent=2)

        return {
            "skills": len(self.skills),
            "directors": len(self.directors),
            "errors": errors
        }

if __name__ == "__main__":
    r = RegistryRuntime()
    result = r.build()
    print(json.dumps(result, indent=2))
