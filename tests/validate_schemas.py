from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_DIR = ROOT / 'schemas'

required_keys = {'$schema', 'title', 'type'}

files = sorted(SCHEMA_DIR.rglob('*.json'))
assert files, 'No schema JSON files found.'

for file in files:
    data = json.loads(file.read_text(encoding='utf-8'))
    missing = required_keys - set(data.keys())
    assert not missing, f'{file}: missing keys {sorted(missing)}'

print(f'Validated {len(files)} schema files successfully.')
