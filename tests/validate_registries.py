from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY_DIR = ROOT / 'registries'
ROUTES_CSV = ROOT / 'data/bootstrap/data_tables/routes.csv'
CANONICAL_PRESENT_REGISTER = REGISTRY_DIR / 'repo_present_workflow_family.yaml'
CANONICAL_ABSENT_REGISTER = REGISTRY_DIR / 'not_yet_repo_present_workflow_packs.yaml'
LINEAGE_MATRIX = REGISTRY_DIR / 'phase1_workflow_lineage_handoff_matrix.yaml'
DOSSIER_NAMESPACE_MATRIX = REGISTRY_DIR / 'phase1_dossier_namespace_ownership_matrix.yaml'


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
canonical_present_register = read_text(CANONICAL_PRESENT_REGISTER)
canonical_absent_register = read_text(CANONICAL_ABSENT_REGISTER)
lineage_matrix = read_text(LINEAGE_MATRIX)
dossier_namespace_matrix = read_text(DOSSIER_NAMESPACE_MATRIX)

assert 'repo_present_workflows:' in canonical_present_register, 'Canonical workflow family register missing repo_present_workflows'
canonical_ids = extract_field_values(canonical_present_register, 'workflow_id')
assert canonical_ids == ['WF-000', 'WF-900', 'WF-001', 'WF-010'], f'Unexpected canonical workflow order: {canonical_ids}'

assert 'not_yet_repo_present_workflow_packs:' in canonical_absent_register, 'Canonical absent-pack register missing not_yet_repo_present_workflow_packs'
absent_pack_ids = extract_field_values(canonical_absent_register, 'workflow_pack_id')
assert absent_pack_ids == ['WF-100', 'WF-200', 'WF-300', 'WF-400'], f'Unexpected absent-pack order: {absent_pack_ids}'
assert not (set(canonical_ids) & set(absent_pack_ids)), 'Present and absent workflow registers must not overlap'

assert 'primary_lineage:' in lineage_matrix, 'Lineage matrix missing primary_lineage'
assert 'workflow_handoffs:' in lineage_matrix, 'Lineage matrix missing workflow_handoffs'
lineage_ids = extract_field_values(lineage_matrix, 'workflow_id')
assert lineage_ids == ['WF-000', 'WF-001', 'WF-010', 'WF-900'], f'Unexpected lineage workflow order: {lineage_ids}'
for workflow_id in lineage_ids:
    assert workflow_id in canonical_ids, f'Lineage workflow {workflow_id} is not repo-present'
for token in [
    'input_packet_family:',
    'output_packet_family:',
    'data_table_write_targets:',
    'dossier_namespace_write_targets:',
    'fallback_workflow:',
    'replay_path:',
    'remodify_path:',
]:
    assert token in lineage_matrix, f'Lineage matrix missing token: {token}'

assert 'namespace_governance:' in dossier_namespace_matrix, 'Dossier namespace matrix missing namespace_governance'
namespace_ids = extract_field_values(dossier_namespace_matrix, 'namespace')
assert namespace_ids == ['system', 'intake', 'discovery', 'research', 'script', 'context', 'approval', 'runtime'], f'Unexpected namespace order: {namespace_ids}'
current_owners = extract_field_values(dossier_namespace_matrix, 'current_phase_owner_workflow')
future_pack_owners = extract_field_values(dossier_namespace_matrix, 'future_pack_owner')
for owner in current_owners:
    assert owner == 'none' or owner in canonical_ids, f'Invalid current owner workflow: {owner}'
for future_owner in future_pack_owners:
    assert future_owner == 'none' or future_owner in absent_pack_ids, f'Invalid future pack owner: {future_owner}'
for token in [
    'allowed_writers:',
    'read_only_workflows:',
    'approval_required_for_mutation:',
    'fallback_implication:',
    'replay_implication:',
]:
    assert token in dossier_namespace_matrix, f'Dossier namespace matrix missing token: {token}'
for line in dossier_namespace_matrix.splitlines():
    stripped = line.strip()
    if stripped.startswith('- WF-'):
        workflow = stripped[2:].strip()
        assert workflow in canonical_ids or workflow in absent_pack_ids, f'Unknown workflow reference in dossier namespace matrix: {workflow}'

for token in [
    'repo_present_workflow_family_register: registries/repo_present_workflow_family.yaml',
    'not_yet_repo_present_workflow_pack_register: registries/not_yet_repo_present_workflow_packs.yaml',
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

print('Validated canonical present/absent workflow registers, lineage matrix, dossier namespace governance matrix, lifecycle truth, route alignment, and error-owner integrity successfully.')
