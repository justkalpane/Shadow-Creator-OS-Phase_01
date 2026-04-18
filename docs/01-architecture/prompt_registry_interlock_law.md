# Prompt–Registry Interlock Law
## Shadow Empire / Creator OS
## Classification: Constitutional Machine Law — Anti-Hallucination Enforcement
## Status: Wave 00 Established

---

## THE LAW

**Prompt intent may REQUEST behavior.**
**Registry truth DETERMINES availability.**

These are not the same thing.
This distinction is non-negotiable and non-overridable.

---

## WHY THIS LAW EXISTS

Without this law, a prompt author or an AI agent can silently create the illusion
that a module, provider, route, or director is available by simply naming it.
This has concrete risks:

- Silent invocation of unauthorized providers (cost exposure)
- Execution of modules that were never governed (safety exposure)
- Workflow packs emitting `next_workflow_pack: null` for packs that actually exist
- Dashboard surfaces treated as operable when no contract has been defined
- Director assignments that appear in prose but have no binding registry row

Registry-first legality closes all of these.

---

## SPECIFIC RULES

### Rule 1 — Registry instance outranks prompt prose

If a prompt says "use provider X" but provider X is not in
`registries/provider_registry.yaml` with an active status, provider X is
unavailable. The prompt cannot create availability by naming something.

### Rule 2 — Workflow availability requires canonical register entry

A workflow may only be treated as active and importable if it appears in:
`registries/repo_present_workflow_family.yaml`

If a workflow is named in a prompt or a doc but is listed in:
`registries/not_yet_repo_present_workflow_packs.yaml`
it must be treated as absent from runtime, regardless of what the prompt says.

### Rule 3 — Route availability requires route registry entry

A route does not exist unless it is declared in `registries/route_registry.yaml`
and referenced in `data/bootstrap/data_tables/routes.csv`.

### Rule 4 — Director availability requires director binding entry

A director cannot be assigned to govern a workflow or skill unless they appear in
the relevant `registries/director_binding_wf*.yaml` file or in the canonical
`registries/director_registry.yaml` (once established).

### Rule 5 — Skill availability requires skill registry entry

A skill cannot be activated unless it appears in the relevant
`registries/skill_registry_wf*.yaml` AND has a corresponding `.skill.md` file
in the `skills/` folder that validates against the skill loader contract.

### Rule 6 — Provider paths require provider registry entry AND governance gate

No external provider call may be treated as active unless:
- The provider appears in `registries/provider_registry.yaml` with `status: active`
- The provider has an entry in `registries/provider_auth_callback_matrix.yaml`
- A budget gate check is available (Kubera / cost posture)
- A policy gate check is available (Yama / safety posture)

### Rule 7 — Dashboard surfaces require contract entry

A dashboard screen, widget, or API endpoint does not exist in the governed system
unless it appears in `registries/dashboard_screen_contract_pack.yaml` or
`registries/dashboard_api_contract_pack.yaml`.

### Rule 8 — Mode invocation requires mode registry entry

An operating mode (founder / creator / builder / operator) or runtime mode
(local / hybrid / cloud / untrusted_local) must be declared in
`registries/mode_registry.yaml` before any workflow may treat it as legal.

### Rule 9 — Packet families require schema

A packet family referenced in `bindings/workflow_packet_family_binding.yaml`
must have a schema in `schemas/packets/` before it is emitted at runtime.
If a schema is missing, the packet is invalid.

---

## FAILURE BEHAVIOR

When Claude, n8n, or any build agent cannot find a module, route, provider, or
authority row in the registry stack, it must do ONE of the following:

1. **Create the missing artifact deliberately** in the correct repo layer, OR
2. **Log it into `registries/decision_packet_register.yaml`** as an unresolved row
   with blocking class (BUILD / RELEASE) and owner.

**Claude must never fake availability.**
**Claude must never invent a provider path not in the registry.**
**Claude must never pretend a workflow pack is repo-present when it is not in the
canonical register.**

---

## VALIDATOR IMPLICATION

Any validation script that tests for module availability must derive its truth
from the canonical registries, not from hardcoded lists or prose docs.

Example correct validator pattern:
```python
canonical_ids = extract_workflow_ids(repo_present_workflow_family_yaml)
assert workflow_id in canonical_ids, f"{workflow_id} not in canonical register"
```

Example incorrect validator pattern:
```python
# BAD: hardcoded list drift will corrupt validator truth
assert canonical_ids == ['WF-000', 'WF-900', 'WF-001', 'WF-010']
```

When the canonical register grows (e.g., WF-100/WF-200 promotion), hardcoded
assertions become a lie. Validators must read the register as the source.

---

## AUDIT IMPLICATION

Every registry mutation must emit an `audit_event` per the schema at
`schemas/governance/audit_event.schema.json`.

Registry drift without audit is a governance failure.

---

## RELATED FILES

- `docs/01-architecture/canonical_authority_precedence.md`
- `registries/repo_present_workflow_family.yaml`
- `registries/not_yet_repo_present_workflow_packs.yaml`
- `registries/provider_registry.yaml`
- `registries/provider_auth_callback_matrix.yaml`
- `registries/route_registry.yaml`
- `registries/mode_registry.yaml`
- `registries/mode_route_registry.yaml`
- `registries/decision_packet_register.yaml`
- `registries/build_blocker_matrix.yaml`
- `registries/release_blocker_matrix.yaml`
