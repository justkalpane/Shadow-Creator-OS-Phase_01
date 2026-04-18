# Founder Mode / Creator Mode / Runtime Mode Law
## Shadow Empire / Creator OS
## Classification: Constitutional Machine Law — Runtime Operating Mode
## Status: Wave 00 Established

---

## CRITICAL NOTE — THIS IS NOT UX POLISH

Mode determines legal execution.
Mode filters which operations, routes, providers, and mutations are allowed.
Mode is enforced at the governance kernel level before any skill or workflow runs.

This document is the human-readable form of the machine-readable mode truth
captured in `registries/mode_registry.yaml` and `registries/mode_route_registry.yaml`.
The registries are authoritative. This document is explanatory.

---

## CANONICAL REGISTRY REFERENCE

- `registries/mode_registry.yaml` — definitions of all operating and runtime modes
- `registries/mode_route_registry.yaml` — legal route/mode mappings

---

## OPERATING MODES

### FOUNDER MODE

Governance, release, override, and cost approval authority.

**Allowed:**
- Approve system evolution
- Override routes within policy legality
- Inspect full route trace, RCA, blocker state
- Manage thresholds, registry, and deployment surfaces
- Approve premium providers through Kubera gate
- Access full telemetry
- Trigger replay from any stage (audited)
- Manage founder/creator permission matrix

**Blocked (hard non-overridable):**
- Cannot bypass policy illegality (Yama veto is absolute)
- Cannot bypass consent requirements
- Cannot bypass signature / integrity validation
- Cannot bypass Chitragupta audit continuity
- Cannot mutate signed canonical artifacts without commit trail

Founder mode is the most powerful operating surface but is NOT unlimited.
Hard guards remain above founder authority.

### CREATOR MODE

Safe content production surface. Most common daily-use mode.

**Allowed:**
- Create topic intake
- Run script pipeline
- Trigger approval review
- Request replay only within own active dossier
- View own channel analytics
- View own dossier state

**Blocked:**
- Cannot mutate constitutional registries
- Cannot bypass Kubera (budget gate)
- Cannot bypass Yama (policy gate)
- Cannot approve premium providers
- Cannot access RCA or full telemetry
- Cannot use `ROUTE_PHASE1_REPLAY` directly (must go through WF-900)
- Cannot trigger replay outside own active dossier

### BUILDER MODE

Repo-and-contract surface only. For system construction, not content production.

**Allowed:**
- Read all repo artifacts
- Create schemas, registries, workflow specs
- Run validators
- Generate skill files that comply with the skill loader contract

**Blocked:**
- Cannot trigger live workflow execution
- Cannot mutate live runtime state
- Cannot access live dossier data
- Has no route access (`legal_routes: []`)

### OPERATOR MODE

Support, recovery, bounded diagnostics surface.

**Allowed:**
- Inspect runtime state
- Trigger error recovery through WF-900
- Trigger replay for failed dossiers
- View audit log, queue state

**Blocked:**
- Cannot mutate registries
- Cannot approve providers
- Cannot release new workflow packs
- Cannot bypass governance gates
- Restricted to `ROUTE_PHASE1_REPLAY`

---

## RUNTIME MODES

Runtime mode is separate from operator mode. Runtime mode describes the
execution posture, not the user privilege level.

### local

Self-hosted, local-first, deterministic transforms, Ollama, no premium providers.
Phase-1 default. Hardware requirement: minimum (fits `WIN_MID_16G` class).

### hybrid

Local control plane with selective offload. Recommended long-term production
posture. Heavy media allowed with budget gate.

### cloud

Cloud-heavy execution for media, render, and scale. Later phases only.
Unattended release must pass all release blockers before cloud mode becomes
default for any lane.

### untrusted_local

Constrained local mode. Read-heavy and safe operations only.
No sensitive mutation, no secret-heavy execution, no provider calls.
Used when the operator cannot be verified as trusted (e.g., shared device).

---

## CREATOR FAST-TRACK LAW

When `creator_mode_id` is valid and the fast route is selected:

1. Ganesha loads the fixed route for that creator mode
2. Only **Yama**, **Kubera**, and **Vayu** remain as hard guards
3. No council review for known low-risk operations
4. Route chain is deterministic and pre-approved
5. Approval insertion points are pre-declared in the route manifest

This is the ONLY legal path for creators to bypass council debate.
Any route that tries to skip Yama, Kubera, or Vayu via fast-track is invalid.

---

## MODE-TO-ROUTE LEGALITY

See `registries/mode_route_registry.yaml` for the machine-readable mapping.

Summary for Phase-1:

| Mode     | ROUTE_PHASE1_STANDARD | ROUTE_PHASE1_FAST | ROUTE_PHASE1_REPLAY |
|----------|-----------------------|-------------------|---------------------|
| founder  | ✓ default             | ✓ manual          | ✓                   |
| creator  | ✓ default             | ✓ fast-track      | ✗ (via WF-900 only) |
| builder  | ✗                     | ✗                 | ✗                   |
| operator | ✗                     | ✗                 | ✓ default           |

---

## ENFORCEMENT DIRECTORS

- **Kubera** enforces cost gate.
- **Yama** enforces policy gate.
- **Vayu** enforces hardware / resource gate.

These three gates cannot be bypassed by any mode including founder mode for
operations that are policy-illegal, budget-illegal, or hardware-unsafe.

- **Ganesha** enforces the Three-Blade Doctrine (max 3 active skills per task
  standard, 8 exception).
- **Chitragupta** enforces audit continuity.
- **Krishna** is the orchestration authority within legal routes.

---

## RELATED FILES

- `registries/mode_registry.yaml`
- `registries/mode_route_registry.yaml`
- `registries/route_registry.yaml`
- `registries/empire_registry.instance.json`
- `docs/01-architecture/prompt_registry_interlock_law.md`
- `docs/01-architecture/worker_router_law.md`
