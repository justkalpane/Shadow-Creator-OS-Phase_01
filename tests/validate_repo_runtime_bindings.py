from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRESENT_REGISTER = ROOT / 'registries/repo_present_workflow_family.yaml'
DATA_TABLE_BINDINGS = ROOT / 'bindings/workflow_data_table_binding.yaml'
DOSSIER_BINDINGS = ROOT / 'bindings/workflow_dossier_namespace_binding.yaml'
PACKET_BINDINGS = ROOT / 'bindings/workflow_packet_family_binding.yaml'
LOCAL_REPO_CONFIG = ROOT / 'configs/local_repo_integration.yaml'
WINDOWS_REPO_DOC = ROOT / 'docs/03-deployment/windows-local-repo-read-strategy.md'


def extract_ids(text: str, field_name: str) -> list[str]:
    values: list[str] = []
    prefix = f'{field_name}:'
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith(prefix):
            values.append(stripped.split(':', 1)[1].strip())
    return values

present_text = PRESENT_REGISTER.read_text(encoding='utf-8')
canonical_workflows = extract_ids(present_text, 'workflow_id')
assert canonical_workflows, 'No repo-present workflows found'

for required_file in [DATA_TABLE_BINDINGS, DOSSIER_BINDINGS, PACKET_BINDINGS, LOCAL_REPO_CONFIG, WINDOWS_REPO_DOC]:
    assert required_file.exists(), f'Missing required integration file: {required_file}'

data_table_text = DATA_TABLE_BINDINGS.read_text(encoding='utf-8')
dossier_text = DOSSIER_BINDINGS.read_text(encoding='utf-8')
packet_text = PACKET_BINDINGS.read_text(encoding='utf-8')
config_text = LOCAL_REPO_CONFIG.read_text(encoding='utf-8')
doc_text = WINDOWS_REPO_DOC.read_text(encoding='utf-8')

for workflow_id in canonical_workflows:
    assert f'{workflow_id}:' in data_table_text, f'Missing data table binding for {workflow_id}'
    assert f'{workflow_id}:' in dossier_text, f'Missing dossier namespace binding for {workflow_id}'
    assert f'{workflow_id}:' in packet_text, f'Missing packet family binding for {workflow_id}'

for child_id in ['CWF-110', 'CWF-120', 'CWF-130', 'CWF-140', 'CWF-210', 'CWF-220', 'CWF-230', 'CWF-240']:
    assert f'{child_id}:' in data_table_text, f'Missing child data table binding for {child_id}'
    assert f'{child_id}:' in dossier_text, f'Missing child dossier binding for {child_id}'
    assert f'{child_id}:' in packet_text, f'Missing child packet binding for {child_id}'

assert 'runtime_repo_access: local_clone_preferred' in config_text
assert 'expected_windows_repo_root:' in config_text
assert 'local filesystem read is the default integration mode' in doc_text

print('Validated repo runtime bindings, local repo config, and Windows repo read strategy successfully.')
