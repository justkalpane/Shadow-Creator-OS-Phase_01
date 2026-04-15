from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
workflow_files = [
    ROOT / 'n8n/workflows/system/WF-000-health-check.json',
    ROOT / 'n8n/workflows/system/WF-900-error-handler.json',
    ROOT / 'n8n/workflows/parent/WF-001-dossier-create.json',
    ROOT / 'n8n/workflows/parent/WF-010-parent-orchestrator.json',
]

for file in workflow_files:
    assert file.exists(), f'Missing workflow file: {file}'
    data = json.loads(file.read_text(encoding='utf-8'))
    assert data.get('name'), f'{file}: missing workflow name'
    assert isinstance(data.get('nodes'), list), f'{file}: nodes must be a list'
    assert len(data['nodes']) >= 2, f'{file}: expected at least 2 nodes'
    assert isinstance(data.get('connections'), dict), f'{file}: connections must be an object'
    assert 'meta' in data, f'{file}: missing meta block'

print(f'Validated {len(workflow_files)} workflow files successfully.')
