from __future__ import annotations

import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parent
scripts = [
    ROOT / 'validate_schemas.py',
    ROOT / 'validate_registries.py',
    ROOT / 'validate_repo_runtime_bindings.py',
    ROOT / 'validate_release_blocker_matrix.py',
    ROOT / 'validate_provider_quota_threshold_policy.py',
    ROOT / 'validate_runtime_core_execution.py',
    ROOT / 'validate_manifests.py',
    ROOT / 'validate_workflows.py',
    ROOT / 'validate_agents.py',
    ROOT / 'validate_agent_class_matrix.py',
    ROOT / 'validate_sub_agent_integrations.py',
    ROOT / 'validate_sub_agent_matrix.py',
    ROOT / 'validate_routing_matrix_consistency.py',
    ROOT / 'validate_director_binding_matrix.py',
    ROOT / 'validate_route_namespace.py',
    ROOT / 'validate_unified_hierarchy_report.py',
    ROOT / 'validate_route_registry_report.py',
    ROOT / 'validate_audit_index.py',
    ROOT / 'validate_build_values_snapshot.py',
    ROOT / 'validate_build_status.py',
    ROOT / 'validate_sub_skill_integrations.py',
    ROOT / 'validate_workflow_payload_contracts.py',
]

for script in scripts:
    print(f'Running {script.name}...')
    runpy.run_path(str(script), run_name='__main__')

print('All Phase-1 validation checks passed.')
