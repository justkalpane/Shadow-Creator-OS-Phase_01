# Dashboard / Control-Plane Contract Pack Law
## Shadow Empire / Creator OS
## Classification: Constitutional Machine Law — Dashboard Governance
## Status: Wave 00 Established

---

## PURPOSE

Dashboard work must be contract-first. No screen may be built, extended, or
referenced by a workflow without a declared contract in the canonical screen
and API contract registries.

This law prevents the common failure mode where dashboard features are invented
ad-hoc, lack permission models, have no DTO definitions, and cannot be audited.

---

## CANONICAL REGISTRY REFERENCES

- `registries/dashboard_screen_contract_pack.yaml` — screen definitions
- `registries/dashboard_api_contract_pack.yaml` — API/DTO layer behind screens

---

## SCREEN CONTRACT REQUIREMENTS

Every primary dashboard screen must declare:

| Field | What it governs |
|-------|----------------|
| `screen_id` | Unique identifier (SCR-001, SCR-002, etc.) |
| `name` | Human-readable screen name |
| `path` | URL path / route for the screen |
| `purpose` | What this screen shows and why |
| `target_roles` | Which operating modes can see this screen |
| `primary_widgets` | What UI components appear on this screen |
| `primary_data_sources` | Which Data Tables or APIs feed this screen |
| `deep_links` | Which other screens this screen links to |
| `action_rights` | What each role can do on this screen |
| `audit_writes` | What audit events this screen emits on action |
| `phase1_status` | Current implementation readiness |

A screen missing any of these fields is an incomplete contract.

---

## API CONTRACT REQUIREMENTS

Every dashboard API endpoint must declare:

| Field | What it governs |
|-------|----------------|
| `endpoint_id` | Unique identifier (API-001, API-002, etc.) |
| `screen_ref` | Which screen this API serves |
| `path` | REST path |
| `method` | HTTP method |
| `purpose` | What this endpoint does |
| `response_dto_fields` | Exact fields returned in the DTO |
| `auth_required` | Whether authentication is needed |
| `allowed_roles` | Which operating modes can invoke this endpoint |
| `phase1_status` | Current implementation readiness |

Endpoints that mutate state must also declare:
- `request_dto_fields` — what the caller must send
- `audit_write` — what audit event is emitted on mutation

---

## CANONICAL SCREEN FAMILY (Phase-1 and planned)

| Screen ID | Name | Phase-1 Status |
|-----------|------|----------------|
| SCR-001 | Overview | Stub defined |
| SCR-002 | Routes | Stub defined |
| SCR-003 | Dossiers | Stub defined |
| SCR-004 | Approvals | Stub defined |
| SCR-005 | Errors | Stub defined |
| SCR-006 | Mission Control | Deferred (P1/P2) |
| SCR-007 | Founder Governance | Deferred (P1/P2) |

"Stub defined" means: the contract exists in the registry with all required
fields. The implementation does not yet exist. Building the implementation
must conform to the contract.

---

## ROLE-BASED VISIBILITY LAW

| Screen | Founder | Creator | Operator | Builder |
|--------|---------|---------|----------|---------|
| Overview | ✓ | ✗ | ✓ | ✗ |
| Routes | ✓ | ✓ (own) | ✓ | ✗ |
| Dossiers | ✓ | ✓ (own) | ✗ | ✗ |
| Approvals | ✓ | ✓ (own) | ✗ | ✗ |
| Errors | ✓ | ✗ | ✓ | ✗ |
| Mission Control | ✓ | ✗ | ✗ | ✗ |
| Founder Governance | ✓ | ✗ | ✗ | ✗ |

"Own" means: creator can only see dossiers, routes, and approvals where
`creator_id` matches their identity. No cross-creator visibility.

---

## DATA TABLE MAPPING

Dashboard screens consume data from the live n8n Data Tables:

| Data Table | Screens |
|------------|---------|
| se_dossier_index | SCR-001, SCR-003 |
| se_route_runs | SCR-001, SCR-002 |
| se_approval_queue | SCR-004 |
| se_error_events | SCR-001, SCR-005 |
| se_packet_index | SCR-003 |

Note: These are the **live** table names per DP-002. The repo bootstrap CSV
names currently differ. DP-002 must be resolved in P0 before dashboard
implementation can proceed.

---

## DEEP-LINK AND RCA NAVIGATION

Every screen must support navigation to related screens:

- Error → Dossier → Approval → Route Run (the RCA chain)
- Dossier → Packets → Errors (the lineage chain)
- Approval → Dossier → Errors (the governance chain)

This navigation is defined in the `deep_links` field of each screen contract.
Implementation must honor the declared deep-link topology.

---

## ANTI-PATTERNS — FORBIDDEN

- Building a dashboard screen without a screen contract in the registry
- Adding an API endpoint without an endpoint contract in the API registry
- Showing data to a role not listed in `target_roles` for that screen
- Performing a mutation action not listed in `action_rights` for that role
- Building screens that read from Data Tables not listed in `primary_data_sources`

---

## RELATED FILES

- `registries/dashboard_screen_contract_pack.yaml`
- `registries/dashboard_api_contract_pack.yaml`
- `registries/mode_registry.yaml`
- `docs/01-architecture/founder_creator_mode_law.md`
- `docs/01-architecture/mission_control_chronos_law.md`
