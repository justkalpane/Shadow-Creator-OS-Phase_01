from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.append(str(ROOT))

from engine.registry_mapper import build_registry

CORE_FILES = [
    ROOT / "engine" / "runtime_router.py",
    ROOT / "engine" / "execution_contract.py",
    ROOT / "engine" / "registry_mapper.py",
    ROOT / "engine" / "registry_runtime.py",
    ROOT / "engine" / "chain_executor.py",
    ROOT / "engine" / "validator_runtime.py",
    ROOT / "engine" / "skill_builder.py",
    ROOT / "engine" / "skill_builder_ollama.py",
]


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _read(path: Path) -> str:
    _assert(path.exists(), f"Missing runtime core file: {path}")
    return path.read_text(encoding="utf-8")


def main() -> None:
    for path in CORE_FILES:
        text = _read(path)
        for marker in ("<<<<<<<", "=======", ">>>>>>>"):
            _assert(marker not in text, f"Merge conflict marker found in {path}: {marker}")

    registry = build_registry()
    _assert(registry, "Runtime registry build produced no entries")

    required_skill_ids = [
        "research_intelligence.m_011_knowledge_dossier_builder",
        "script_intelligence.s_202_first_draft_generation",
        "script_intelligence.s_210_final_script_packager",
        "topic_intelligence.m_001_global_trend_scanner",
    ]
    for skill_id in required_skill_ids:
        _assert(skill_id in registry, f"Missing required runtime skill id: {skill_id}")
        target = registry[skill_id]
        module_path = target["module_path"]
        _assert(Path(ROOT / module_path).exists(), f"Missing runtime module path for {skill_id}: {module_path}")

    _assert(all("." in skill_id for skill_id in registry), "Runtime registry contains malformed skill IDs")
    _assert(not any(skill_id.startswith("skills.") for skill_id in registry), "Runtime registry must not include root template pseudo-skills")

    director_engine = _read(ROOT / "engine" / "director_engine.py")
    _assert("llama3.2:3b" in director_engine, "Director engine must target the verified local Ollama model")

    env_text = _read(ROOT / ".env.example")
    _assert("OLLAMA_MODEL=llama3.2:3b" in env_text, ".env.example must target the verified local Ollama model")

    print("Validated runtime core execution wiring successfully.")


if __name__ == "__main__":
    main()
