from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNBOOK = ROOT / 'docs/03-deployment/import-export-runbook.md'
DEPLOYMENT_STAGE = ROOT / 'docs/00-project-state/current-deployment-stage.md'
CANONICAL_REGISTER = ROOT / 'registries/repo_present_workflow_family.yaml'
ABSENT_PACK_REGISTER = ROOT / 'registries/not_yet_repo_present_workflow_packs.yaml'

register_text = CANONICAL_REGISTER.read_text(encoding='utf-8')
absent_text = ABSENT_PACK_REGISTER.read_text(encoding='utf-8')
workflow_files = []
canonical_ids = []
repo_absent_packs = []
for line in register_text.splitlines():
    stripped = line.strip()
    if stripped.startswith('workflow_id:') or stripped.startswith('- workflow_id:'):
        canonical_ids.append(stripped.split(':', 1)[1].strip())
    elif stripped.startswith('workflow_file:') or stripped.startswith('- workflow_file:'):
        workflow_files.append(ROOT / stripped.split(':', 1)[1].strip())

for line in absent_text.splitlines():
    stripped = line.strip()
    if stripped.startswith('workflow_pack_id:') or stripped.startswith('- workflow_pack_id:'):
        repo_absent_packs.append(stripped.split(':', 1)[1].strip())

assert canonical_ids, f'Unexpected canonical workflow order: {canonical_ids}'
assert canonical_ids[:4] == ['WF-000', 'WF-900', 'WF-001', 'WF-010'], (
    f'Unexpected canonical workflow baseline order: {canonical_ids}'
)
assert 'WF-100' in canonical_ids and 'WF-200' in canonical_ids, (
    f'Canonical workflow register must include promoted packs WF-100 and WF-200: {canonical_ids}'
)
assert workflow_files, 'No workflow files resolved from canonical workflow family register'

parsed: dict[str, dict] = {}
missing_expected_workflow_files = []
for file in workflow_files:
    if not file.exists():
        missing_expected_workflow_files.append(str(file.relative_to(ROOT)))
        continue
    data = json.loads(file.read_text(encoding='utf-8'))
    parsed[file.name] = data
    assert data.get('name'), f'{file}: missing workflow name'
    assert isinstance(data.get('nodes'), list), f'{file}: nodes must be a list'
    assert len(data['nodes']) >= 1, f'{file}: expected at least 1 node'
    assert isinstance(data.get('connections'), dict), f'{file}: connections must be an object'
    assert 'meta' in data, f'{file}: missing meta block'

assert not missing_expected_workflow_files, f'Unexpected missing workflow files: {missing_expected_workflow_files}'

wf010 = parsed['WF-010-parent-orchestrator.json']
node_names = {node['name']: node for node in wf010['nodes']}
for required_node in [
    'Normalize Orchestration Input',
    'Resolve Route',
    'Route Is Replay?',
    'Route Is Fast?',
    'Prepare Replay Decision',
    'Prepare Fast Decision',
    'Prepare Standard Decision',
]:
    assert required_node in node_names, f'WF-010 missing node: {required_node}'

replay_js = node_names['Prepare Replay Decision']['parameters']['jsCode']
assert 'next_workflow_pack: null' in replay_js, 'Prepare Replay Decision: replay should not emit a downstream pack'
assert 'recommended_reentry_workflow' in replay_js and "'WF-900'" in replay_js, (
    'Prepare Replay Decision: replay should direct reentry through WF-900'
)

for decision_node_name in ['Prepare Fast Decision', 'Prepare Standard Decision']:
    js = node_names[decision_node_name]['parameters']['jsCode']
    assert "next_workflow_pack: 'WF-100'" in js, f'{decision_node_name}: must emit WF-100 as promoted downstream pack'
    assert "next_pack_status: 'repo_present'" in js, f'{decision_node_name}: must emit repo_present status'
    for absent_pack in repo_absent_packs:
        assert f"next_workflow_pack: '{absent_pack}'" not in js, (
            f'{decision_node_name}: must not emit absent pack {absent_pack} as repo-present'
        )

for doc in [RUNBOOK, DEPLOYMENT_STAGE]:
    text = doc.read_text(encoding='utf-8')
    assert 'registries/repo_present_workflow_family.yaml' in text, (
        f'{doc}: missing canonical workflow family register reference'
    )
    assert 'registries/not_yet_repo_present_workflow_packs.yaml' in text, (
        f'{doc}: missing canonical absent-pack register reference'
    )

runbook_text = RUNBOOK.read_text(encoding='utf-8')
assert 'Only workflows listed in `registries/repo_present_workflow_family.yaml` count as active repo import targets.' in runbook_text

deployment_text = DEPLOYMENT_STAGE.read_text(encoding='utf-8')
assert 'Use this file as the only ordered truth for intended workflow packs that are not yet repo-present:' in deployment_text

print('Validated promoted workflow family usage, absent-pack usage, workflow depth, and WF-010 promoted-routing outputs successfully.')
