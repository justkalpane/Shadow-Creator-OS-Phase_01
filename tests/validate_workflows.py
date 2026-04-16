from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNBOOK = ROOT / 'docs/03-deployment/import-export-runbook.md'
DEPLOYMENT_STAGE = ROOT / 'docs/00-project-state/current-deployment-stage.md'
CANONICAL_PRESENT_REGISTER = ROOT / 'registries/repo_present_workflow_family.yaml'
CANONICAL_ABSENT_REGISTER = ROOT / 'registries/not_yet_repo_present_workflow_packs.yaml'

present_text = CANONICAL_PRESENT_REGISTER.read_text(encoding='utf-8')
absent_text = CANONICAL_ABSENT_REGISTER.read_text(encoding='utf-8')
workflow_files = []
canonical_ids = []
repo_absent_packs = []
for line in present_text.splitlines():
    stripped = line.strip()
    if stripped.startswith('workflow_id:'):
        canonical_ids.append(stripped.split(':', 1)[1].strip())
    elif stripped.startswith('workflow_file:'):
        workflow_files.append(ROOT / stripped.split(':', 1)[1].strip())
for line in absent_text.splitlines():
    stripped = line.strip()
    if stripped.startswith('workflow_pack_id:'):
        repo_absent_packs.append(stripped.split(':', 1)[1].strip())

assert canonical_ids == ['WF-000', 'WF-900', 'WF-001', 'WF-010'], f'Unexpected canonical workflow order: {canonical_ids}'
assert repo_absent_packs == ['WF-100', 'WF-200', 'WF-300', 'WF-400'], f'Unexpected canonical absent-pack order: {repo_absent_packs}'
assert workflow_files, 'No workflow files resolved from canonical workflow family register'

parsed: dict[str, dict] = {}

for file in workflow_files:
    assert file.exists(), f'Missing workflow file: {file}'
    data = json.loads(file.read_text(encoding='utf-8'))
    parsed[file.name] = data
    assert data.get('name'), f'{file}: missing workflow name'
    assert isinstance(data.get('nodes'), list), f'{file}: nodes must be a list'
    assert len(data['nodes']) >= 4, f'{file}: expected at least 4 nodes for starter node-chain depth'
    assert isinstance(data.get('connections'), dict), f'{file}: connections must be an object'
    assert 'meta' in data, f'{file}: missing meta block'
    assert data['meta'].get('implementation_depth') == 'starter_node_chain', (
        f'{file}: implementation_depth should be starter_node_chain'
    )

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

for decision_node_name in [
    'Prepare Replay Decision',
    'Prepare Fast Decision',
    'Prepare Standard Decision',
]:
    js = node_names[decision_node_name]['parameters']['jsCode']
    assert 'next_workflow_pack: null' in js, f'{decision_node_name}: next_workflow_pack must be null'
    assert "next_pack_status: 'not_repo_present'" in js, f'{decision_node_name}: missing not_repo_present status'
    for absent_pack in repo_absent_packs:
        assert f"next_workflow_pack: '{absent_pack}'" not in js, (
            f'{decision_node_name}: must not emit absent pack {absent_pack} as repo-present'
        )

for doc in [RUNBOOK, DEPLOYMENT_STAGE]:
    text = doc.read_text(encoding='utf-8')
    assert 'registries/repo_present_workflow_family.yaml' in text, (
        f'{doc}: missing canonical present-workflow register reference'
    )
    assert 'registries/not_yet_repo_present_workflow_packs.yaml' in text, (
        f'{doc}: missing canonical absent-pack register reference'
    )

runbook_text = RUNBOOK.read_text(encoding='utf-8')
assert 'Only workflows listed in `registries/repo_present_workflow_family.yaml` count as active repo import targets.' in runbook_text
assert 'Packs listed in `registries/not_yet_repo_present_workflow_packs.yaml` remain non-importable roadmap items.' in runbook_text

deployment_text = DEPLOYMENT_STAGE.read_text(encoding='utf-8')
assert 'Use this file as the only ordered truth for active repo-present workflows:' in deployment_text
assert 'Use this file as the only ordered truth for intended packs that are still not repo-present:' in deployment_text

print('Validated canonical present/absent workflow register usage, workflow depth, WF-010 repo-truth outputs, and doc linkage successfully.')
