from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY_DIR = ROOT / 'registries'
ROUTES_CSV = ROOT / 'data/bootstrap/data_tables/routes.csv'
CANONICAL_REGISTER = REGISTRY_DIR / 'repo_present_workflow_family.yaml'


def read_text(path: Path) -> str:
    assert path.exists(), f'Missing file: {path}'
    return path.read_text(encoding='utf-8')


def extract_field_values(text: str, field_name: str) -> list[str]:
    values: list[str] = []
    prefix = f'{field_name}:'
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith(prefix):
            values.append(stripped.split(':', 1)[1].strip())
    return values


workflow_registry = read_text(REGISTRY_DIR / 'workflow_registry.yaml')
route_registry = read_text(REGISTRY_DIR / 'route_registry.yaml')
approval_registry = read_text(REGISTRY_DIR / 'approval_registry.yaml')
error_registry = read_text(REGISTRY_DIR / 'error_registry.yaml')
canonical_register = read_text(CANONICAL_REGISTER)

assert 'repo_present_workflows:' in canonical_register, 'Canonical workflow family register missing repo_present_workflows'
canonical_ids = extract_field_values(canonical_register, 'workflow_id')
assert canonical_ids == ['WF-000', 'WF-900', 'WF-001', 'WF-010'], f'Unexpected canonical workflow order: {canonical_ids}'

for token in [
    'repo_present_workflow_family_register: registries/repo_present_workflow_family.yaml',
    'lifecycle_status_model:',
    'artifact_status_values:',
    'runtime_status_values:',
    'validation_status_values:',
    'artifact_status:',
    'runtime_status:',
    'validation_status:',
]:
    assert token in workflow_registry, f'workflow_registry.yaml missing token: {token}'

workflow_ids = extract_field_values(workflow_registry, 'workflow_id')
assert workflow_ids == canonical_ids, f'Workflow registry IDs do not match canonical register: {workflow_ids} vs {canonical_ids}'

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

for line in error_registry.splitlines():
    stripped = line.strip()
    if stripped.startswith('owner:'):
        owner = stripped.split(':', 1)[1].strip()
        assert owner in canonical_ids, f'Error owner {owner} is not a repo-present workflow'

for token in ['version:', 'approval_states:']:
    assert token in approval_registry, f'approval_registry.yaml missing token: {token}'

print('Validated canonical workflow family register, lifecycle truth, route alignment, and error-owner integrity successfully.')
