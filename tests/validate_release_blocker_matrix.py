from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
RELEASE_BLOCKER_MATRIX = ROOT / "registries" / "release_blocker_matrix.yaml"
SECRET_ROTATION_POLICY = ROOT / "docs" / "03-deployment" / "secret-rotation-policy.md"
PROVIDER_AUTH_LAW = ROOT / "docs" / "01-architecture" / "provider_auth_callback_closure_law.md"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _extract_block(text: str, blocker_id: str) -> list[str]:
    lines = text.splitlines()
    capture = False
    block: list[str] = []
    for line in lines:
        stripped = line.rstrip()
        if stripped.startswith(f"  - blocker_id: {blocker_id}"):
            capture = True
            block = [stripped]
            continue
        if capture:
            if stripped.startswith("  - blocker_id: ") and not stripped.startswith(f"  - blocker_id: {blocker_id}"):
                break
            block.append(stripped)
    return block


def _get_scalar(block: list[str], key: str) -> str:
    for line in block:
        stripped = line.strip()
        if stripped.startswith(f"{key}:"):
            return stripped.split(":", 1)[1].strip()
    raise AssertionError(f"Missing {key} in blocker block")


def main() -> None:
    _assert(RELEASE_BLOCKER_MATRIX.exists(), f"Missing release blocker matrix: {RELEASE_BLOCKER_MATRIX}")
    _assert(SECRET_ROTATION_POLICY.exists(), f"Missing secret rotation policy: {SECRET_ROTATION_POLICY}")
    _assert(PROVIDER_AUTH_LAW.exists(), f"Missing provider auth law: {PROVIDER_AUTH_LAW}")

    matrix_text = RELEASE_BLOCKER_MATRIX.read_text(encoding="utf-8")
    policy_text = SECRET_ROTATION_POLICY.read_text(encoding="utf-8")
    law_text = PROVIDER_AUTH_LAW.read_text(encoding="utf-8")

    rb003 = _extract_block(matrix_text, "RB-003")
    _assert(rb003, "RB-003 block not found in release blocker matrix")
    _assert(_get_scalar(rb003, "state") == "resolved_release", "RB-003 must be resolved_release")
    rb003_text = "\n".join(rb003)
    _assert("secret-rotation-policy.md" in rb003_text, "RB-003 must reference the secret rotation policy")

    for token in [
        "All provider secrets remain `local_env_only`.",
        "Secret replacement is done by writing a new provider-issued value into `.env`.",
        "Old provider secrets are revoked at the provider side after replacement.",
        "Never commit provider keys into tracked files.",
    ]:
        _assert(token in policy_text, f"Secret rotation policy missing token: {token}")

    for token in [
        "OAuth refresh token rotation without a declared policy produces credential rot",
        "RB-003",
    ]:
        _assert(token in law_text, f"Provider auth law missing token: {token}")

    print("Validated release blocker matrix and secret rotation policy successfully.")


if __name__ == "__main__":
    main()
