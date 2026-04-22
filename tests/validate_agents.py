from __future__ import annotations

import importlib.util
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
AGENTS_ROOT = REPO_ROOT / "agents"
REGISTRY_PATH = AGENTS_ROOT / "AGENT_RUNTIME_REGISTRY.yaml"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _parse_registry_agent_files(path: Path) -> list[str]:
    _assert(path.exists(), f"Missing registry file: {path}")
    files: list[str] = []
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if line.startswith("- file:"):
            files.append(line.split(":", 1)[1].strip())
    return files


def _import_module_from_path(path: Path, module_name: str):
    spec = importlib.util.spec_from_file_location(module_name, path)
    _assert(spec is not None and spec.loader is not None, f"Unable to load spec for {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _check_agent_file(agent_rel_path: str) -> None:
    _assert(
        agent_rel_path.startswith("agents/"),
        f"Registry entry must start with 'agents/': {agent_rel_path}",
    )

    path_parts = agent_rel_path.split("/")
    _assert(len(path_parts) == 3, f"Agent registry path must be 'agents/<slug>/<file>': {agent_rel_path}")
    _, slug, filename = path_parts
    expected_filename = f"{slug}_agent.py"
    _assert(filename == expected_filename, f"Filename mismatch: expected {expected_filename}, got {filename}")

    full_path = REPO_ROOT.joinpath(*path_parts)
    _assert(full_path.exists(), f"Missing agent file listed in registry: {agent_rel_path}")

    # Validate class existence and run() contract.
    class_name = "".join(part.capitalize() for part in slug.split("_")) + "Agent"
    module = _import_module_from_path(full_path, f"agent_{slug}_module")
    _assert(hasattr(module, class_name), f"Missing class '{class_name}' in {agent_rel_path}")
    klass = getattr(module, class_name)
    agent = klass()
    _assert(hasattr(agent, "run"), f"Agent class missing run() method: {class_name}")

    result = agent.run({"dossier_id": "TEST-DOSSIER", "route_id": "ROUTE_PHASE1_STANDARD"})
    _assert(isinstance(result, dict), f"run() must return dict: {class_name}")
    required_keys = {"status", "artifact_family", "producer_agent", "governance", "payload"}
    missing = sorted(k for k in required_keys if k not in result)
    _assert(not missing, f"run() output missing keys {missing} for {class_name}")


def main() -> None:
    files = _parse_registry_agent_files(REGISTRY_PATH)
    _assert(files, "No agents discovered in AGENT_RUNTIME_REGISTRY.yaml")

    seen: set[str] = set()
    for rel in files:
        _assert(rel not in seen, f"Duplicate registry agent entry: {rel}")
        seen.add(rel)
        _check_agent_file(rel)

    # Guard naming convention across directories.
    dir_slugs = sorted(
        p.name
        for p in AGENTS_ROOT.iterdir()
        if p.is_dir() and p.name not in {"common", "__pycache__"}
    )
    registry_slugs = sorted(rel.split("/")[1] for rel in files)
    _assert(
        dir_slugs == registry_slugs,
        "Agent directory set does not match AGENT_RUNTIME_REGISTRY entries",
    )

    print(f"Validated {len(files)} agent runtime entries successfully.")


if __name__ == "__main__":
    main()
