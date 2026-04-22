from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CANONICAL_REGISTER = ROOT / 'registries/repo_present_workflow_family.yaml'

required_tokens = [
    'workflow_id:',
    'name:',
    'class:',
    'purpose:',
    'inputs:',
    'output_packet_family:',
    'write_targets:',
    'fallback_behavior:',
    'done_criteria:',
]

register_text = CANONICAL_REGISTER.read_text(encoding='utf-8')
manifest_files = []
for line in register_text.splitlines():
    stripped = line.strip()
    if stripped.startswith('manifest_file:') or stripped.startswith('- manifest_file:'):
        manifest_files.append(ROOT / stripped.split(':', 1)[1].strip())

assert manifest_files, 'No manifest files resolved from canonical workflow family register'

for file in manifest_files:
    assert file.exists(), f'Missing manifest file: {file}'
    text = file.read_text(encoding='utf-8')
    for token in required_tokens:
        assert token in text, f'{file}: missing token {token}'
    if 'class: parent_pack' in text:
        assert 'producer_expectations:' in text, f'{file}: parent_pack manifest missing producer_expectations'
        assert 'consumer_expectations:' in text, f'{file}: parent_pack manifest missing consumer_expectations'

wf010 = (ROOT / 'n8n/manifests/WF-010-parent-orchestrator.manifest.yaml').read_text(encoding='utf-8')
assert 'when_downstream_pack_not_repo_present:' in wf010, 'WF-010 manifest missing repo-truth fallback block'
assert 'next_workflow_pack null' in wf010, 'WF-010 manifest must preserve null downstream pack truth'
assert 'not_repo_present' in wf010, 'WF-010 manifest must preserve not_repo_present status'

print(f'Validated {len(manifest_files)} manifest contracts successfully.')
