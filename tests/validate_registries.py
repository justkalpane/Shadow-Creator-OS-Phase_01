from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY_DIR = ROOT / 'registries'

required = {
    'workflow_registry.yaml': ['version:', 'workflows:'],
    'route_registry.yaml': ['version:', 'routes:'],
    'approval_registry.yaml': ['version:', 'approval_states:'],
    'error_registry.yaml': ['version:', 'errors:'],
}

for filename, expected_tokens in required.items():
    file = REGISTRY_DIR / filename
    assert file.exists(), f'Missing registry file: {filename}'
    text = file.read_text(encoding='utf-8')
    for token in expected_tokens:
        assert token in text, f'{filename}: missing token {token}'

print(f'Validated {len(required)} registry files successfully.')
