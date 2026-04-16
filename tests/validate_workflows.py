from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RUNBOOK = ROOT / 'docs/03-deployment/import-export-runbook.md'
workflow_files = [
    ROOT / 'n8n/workflows/system/WF-000-health-check.json',
    ROOT / 'n8n/workflows/system/WF-900-error-handler.json',
    ROOT / 'n8n/workflows/parent/WF-001-dossier-create.json',
    ROOT / 'n8n/workflows/parent/WF-010-parent-orchestrator.json',
]
repo_present_workflows = ['WF-000', 'WF-900', 'WF-001', 'WF-010']
repo_absent_packs = ['WF-100', 'WF-200', 'WF-300', 'WF-400']

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

# WF-010 must not point to repo-absent packs as active outputs
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

# Runbook active import order must match repo-present workflow family
runbook_text = RUNBOOK.read_text(encoding='utf-8')
active_section_match = re.search(
    r'## Active import order for currently present repo artifacts\n(.*?)\n## Referenced but not yet present in this repo',
    runbook_text,
    flags=re.S,
)
assert active_section_match, 'Runbook active import section not found'
active_lines = [
    line.strip() for line in active_section_match.group(1).splitlines() if line.strip()
]
active_ids = []
for line in active_lines:
    match = re.match(r'\d+\.\s+(WF-\d+)', line)
    assert match, f'Unexpected active import line format: {line}'
    active_ids.append(match.group(1))
assert active_ids == repo_present_workflows, (
    f'Runbook active order mismatch. expected={repo_present_workflows} actual={active_ids}'
)

print('Validated workflow depth, WF-010 repo-truth outputs, and runbook import truth successfully.')
