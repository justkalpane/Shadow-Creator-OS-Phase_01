from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
POLICY_PATH = ROOT / "docs" / "03-deployment" / "provider-quota-threshold-policy.md"
REGISTRY_PATH = ROOT / "registries" / "provider_quota_thresholds.yaml"
RELEASE_BLOCKER_PATH = ROOT / "registries" / "release_blocker_matrix.yaml"


def _assert(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def _extract_block(text: str, provider_id: str) -> list[str]:
    lines = text.splitlines()
    capture = False
    block: list[str] = []
    for line in lines:
        stripped = line.rstrip()
        if stripped.startswith(f"  - provider_id: {provider_id}"):
            capture = True
            block = [stripped]
            continue
        if capture:
            if stripped.startswith("  - provider_id: ") and not stripped.startswith(f"  - provider_id: {provider_id}"):
                break
            block.append(stripped)
    return block


def main() -> None:
    _assert(POLICY_PATH.exists(), f"Missing quota threshold policy: {POLICY_PATH}")
    _assert(REGISTRY_PATH.exists(), f"Missing quota threshold registry: {REGISTRY_PATH}")
    _assert(RELEASE_BLOCKER_PATH.exists(), f"Missing release blocker matrix: {RELEASE_BLOCKER_PATH}")

    policy_text = POLICY_PATH.read_text(encoding="utf-8")
    registry_text = REGISTRY_PATH.read_text(encoding="utf-8")
    release_text = RELEASE_BLOCKER_PATH.read_text(encoding="utf-8")

    for token in [
        "No numeric quota values are stored in this scaffold.",
        "The scaffold only records provider coverage and founder-waiting state.",
        "RB-004 stays open until founder values are supplied.",
    ]:
        _assert(token in policy_text, f"Policy missing token: {token}")

    _assert("status: locked_waiting_founder_values" in registry_text, "Quota registry must remain locked_waiting_founder_values")
    _assert("provider_id: elevenlabs_api" in registry_text, "Quota registry missing elevenlabs_api")
    _assert("provider_id: heygen_api" in registry_text, "Quota registry missing heygen_api")
    _assert("provider_id: youtube_data_api" in registry_text, "Quota registry missing youtube_data_api")

    for forbidden in [
        "monthly_budget_usd:",
        "per_run_spend_usd:",
        "daily_call_limit:",
        "monthly_call_limit:",
        "spend_ceiling:",
        "quota_ceiling:",
        "budget_ceiling:",
        "call_ceiling:",
    ]:
        _assert(forbidden not in registry_text, f"Quota registry must not contain concrete threshold field: {forbidden}")

    for provider_id in ["elevenlabs_api", "heygen_api", "youtube_data_api"]:
        block = _extract_block(registry_text, provider_id)
        _assert(block, f"Missing provider block for {provider_id}")
        block_text = "\n".join(block)
        _assert("value_state: awaiting_founder_values" in block_text, f"{provider_id} must remain awaiting_founder_values")
        _assert("budget_gate_required: true" in block_text, f"{provider_id} must remain budget gated")

    _assert("provider_quota_thresholds.yaml" in release_text, "RB-004 must reference the quota threshold registry")
    _assert("provider-quota-threshold-policy.md" in release_text, "RB-004 must reference the quota threshold policy")

    print("Validated provider quota threshold scaffold successfully.")


if __name__ == "__main__":
    main()
