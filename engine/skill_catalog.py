from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = ROOT / "skills"
DIRECTORS_DIR = ROOT / "directors"


def iter_skill_markdown_files() -> list[Path]:
    return sorted(path for path in SKILLS_DIR.rglob("*.skill.md") if path.is_file())


def iter_director_markdown_files() -> list[Path]:
    return sorted(path for path in DIRECTORS_DIR.rglob("*.md") if path.is_file())


def skill_id_from_path(path: Path) -> str:
    category = path.parent.name
    name = path.name[:-len(".skill.md")]
    return f"{category}.{name}".lower().replace("-", "_")


def skill_py_path(path: Path) -> Path:
    return path.with_name(path.name[:-len(".skill.md")] + ".py")


def relative_posix(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()

