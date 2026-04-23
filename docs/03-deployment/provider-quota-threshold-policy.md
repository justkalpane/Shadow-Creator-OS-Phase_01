# Provider Quota Threshold Policy
## Shadow Empire / Creator OS
## Classification: Deployment Policy
## Status: Phase-1 Locked Scaffold

---

## PURPOSE

Phase-1 premium providers need explicit quota thresholds before unattended
activation. This policy defines the contract for collecting those values from
the founder without inventing any numbers in the repo.

---

## CANONICAL REGISTRY REFERENCE

`registries/provider_quota_thresholds.yaml`

---

## SCOPE

This policy applies only to premium providers that require Kubera budget
gating:

- `elevenlabs_api`
- `heygen_api`
- `youtube_data_api`

Local providers such as `ollama_local` do not use this quota scaffold because
they are not premium budget-gated in Phase-1.

---

## LOCKED SCAFFOLD RULES

1. No numeric quota values are stored in this scaffold.
2. No placeholder numbers such as `0`, `1`, `100`, or `TBD` are allowed.
3. The scaffold only records provider coverage and founder-waiting state.
4. Founder values are entered only when the actual limits are approved.
5. The scaffold remains locked until all required founder values exist.

---

## REQUIRED FOUNDER VALUES

Each provider must eventually define:

- monthly budget ceiling
- per-run spend ceiling
- daily call ceiling
- monthly call ceiling
- approval owner
- escalation owner
- enforcement notes

No threshold can be treated as real until all required fields are populated and
validated against the release blocker matrix.

---

## CLOSED-WORLD EXPECTATION

The scaffold must remain closed-world:

- only the listed premium providers may appear
- no extra provider IDs may be added without a registry update
- no provider may be marked active from this scaffold alone
- RB-004 stays open until founder values are supplied.

---

## RELATED FILES

- `registries/provider_quota_thresholds.yaml`
- `registries/provider_registry.yaml`
- `registries/provider_auth_callback_matrix.yaml`
- `registries/release_blocker_matrix.yaml`
- `docs/01-architecture/provider_auth_callback_closure_law.md`
