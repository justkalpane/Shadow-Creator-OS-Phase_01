from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
manifest_files = [
    ROOT / 'n8n/manifests/WF-000-health-check.manifest.yaml',
    ROOT / 'n8n/manifests/WF-900-error-handler.manifest.yaml',
    ROOT / 'n8n/manifests/WF-001-dossier-create.manifest.yaml',
    ROOT / 'n8n/manifests/WF-010-parent-orchestrator.manifest.yaml',
]

required_tokens = [
    'producer_expectations:',
    'consumer_expectations:',
    'write_targets:',
    'fallback_behavior:',
    'done_criteria:',
    'output_packet_family:',
]

for file in manifest_files:
    assert file.exists(), f'Missing manifest file: {file}'
    text = file.read_text(encoding='utf-8')
    for token in required_tokens:
        assert token in text, f'{file}: missing token {token}'

wf010 = (ROOT / 'n8n/manifests/WF-010-parent-orchestrator.manifest.yaml').read_text(encoding='utf-8')
assert 'when_downstream_pack_not_repo_present:' in wf010, 'WF-010 manifest missing repo-truth fallback block'
assert 'next_workflow_pack null' in wf010, 'WF-010 manifest must preserve null downstream pack truth'
assert 'not_repo_present' in wf010, 'WF-010 manifest must preserve not_repo_present status'

print(f'Validated {len(manifest_files)} manifest contracts successfully.')
