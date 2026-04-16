from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY_DIR = ROOT / 'registries'
ROUTES_CSV = ROOT / 'data/bootstrap/data_tables/routes.csv'


def read_text(path: Path) -> str:
    assert path.exists(), f'Missing file: {path}'
    return path.read_text(encoding='utf-8')


def extract_workflow_ids(workflow_registry_text: str) -> list[str]:
    ids: list[str] = []
    for line in workflow_registry_text.splitlines():
        stripped = line.strip()
        if stripped.startswith('workflow_id:'):
            ids.append(stripped.split(':', 1)[1].strip())
    return ids


workflow_registry = read_text(REGISTRY_DIR / 'workflow_registry.yaml')
route_registry = read_text(REGISTRY_DIR / 'route_registry.yaml')
approval_registry = read_text(REGISTRY_DIR / 'approval_registry.yaml')
error_registry = read_text(REGISTRY_DIR / 'error_registry.yaml')

# 1. workflow_registry lifecycle model must exist and be used
for token in [
    'lifecycle_status_model:',
    'artifact_status_values:',
    'runtime_status_values:',
    'validation_status_values:',
    'artifact_status:',
    'runtime_status:',
    'validation_status:',
]:
    assert token in workflow_registry, f'workflow_registry.yaml missing token: {token}'

workflow_ids = extract_workflow_ids(workflow_registry)
assert workflow_ids == ['WF-000', 'WF-900', 'WF-001', 'WF-010'], f'Unexpected workflow IDs: {workflow_ids}'

# 2. route registry and routes.csv must stay aligned
route_ids_registry: list[str] = []
route_entries_registry: dict[str, str] = {}
current_route = None
for line in route_registry.splitlines():
    stripped = line.strip()
    if stripped.startswith('route_id:'):
        current_route = stripped.split(':', 1)[1].strip()
        route_ids_registry.append(current_route)
    elif stripped.startswith('entry_workflow:') and current_route:
        route_entries_registry[current_route] = stripped.split(':', 1)[1].strip()

with ROUTES_CSV.open(encoding='utf-8', newline='') as f:
    rows = list(csv.DictReader(f))

route_ids_csv = [row['route_id'] for row in rows]
route_entries_csv = {row['route_id']: row['entry_workflow'] for row in rows}

assert set(route_ids_registry) == set(route_ids_csv), (
    f'Route mismatch. registry={sorted(route_ids_registry)} csv={sorted(route_ids_csv)}'
)
for route_id, entry_workflow in route_entries_registry.items():
    assert route_entries_csv[route_id] == entry_workflow, (
        f'Entry workflow mismatch for {route_id}: registry={entry_workflow} csv={route_entries_csv[route_id]}'
    )

# 3. error owners must point only to repo-present workflows
for line in error_registry.splitlines():
    stripped = line.strip()
    if stripped.startswith('owner:'):
        owner = stripped.split(':', 1)[1].strip()
        assert owner in workflow_ids, f'Error owner {owner} is not a repo-present workflow'

# 4. approval registry must still have expected top-level structure
for token in ['version:', 'approval_states:']:
    assert token in approval_registry, f'approval_registry.yaml missing token: {token}'

print('Validated workflow lifecycle truth, route alignment, and error-owner integrity successfully.')
