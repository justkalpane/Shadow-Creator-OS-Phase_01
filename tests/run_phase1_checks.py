from __future__ import annotations

import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parent
scripts = [
    ROOT / 'validate_schemas.py',
    ROOT / 'validate_registries.py',
    ROOT / 'validate_manifests.py',
    ROOT / 'validate_workflows.py',
]

for script in scripts:
    print(f'Running {script.name}...')
    runpy.run_path(str(script), run_name='__main__')

print('All Phase-1 validation checks passed.')
