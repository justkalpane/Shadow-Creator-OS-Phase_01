# Provider Auth / Callback / OAuth Closure Law
## Shadow Empire / Creator OS
## Classification: Constitutional Machine Law — Provider Readiness
## Status: Wave 00 Established

---

## PURPOSE

Provider registry entry (`registries/provider_registry.yaml`) is necessary but
not sufficient. A provider cannot be considered release-ready until its auth,
callback, refresh, and degraded-mode posture are explicitly declared in a
separate auth closure artifact.

This law exists because:
- Cost exposure from unauthorized provider calls is a real financial risk
- Callback failures without defined degraded modes produce silent data loss
- OAuth refresh token rotation without a declared policy produces credential rot
- Polling windows without defined ceilings produce infinite-hang workflows

---

## CANONICAL REGISTRY REFERENCE

`registries/provider_auth_callback_matrix.yaml`

---

## SEPARATION PRINCIPLE

The provider registry answers: **"What providers exist and what is their legal status?"**

The provider auth callback matrix answers: **"How does each provider authenticate,
how do callbacks work, what happens when they fail, and what is still unresolved?"**

These are distinct questions. Conflating them produces ambiguity. Both files must
exist and both must be consistent.

---

## AUTH STYLES RECOGNIZED

| Style | Description | Example |
|-------|-------------|---------|
| `none` | No authentication required | Ollama local |
| `api_key` | Static API key via environment variable | ElevenLabs, HeyGen |
| `oauth2_authorization_code` | Full OAuth2 authorization code flow | YouTube Data API |

---

## CALLBACK STYLES RECOGNIZED

| Style | Description | Example |
|-------|-------------|---------|
| `synchronous_local_http` | Direct HTTP call with synchronous response | Ollama |
| `synchronous_response` | Cloud API with synchronous response body | ElevenLabs |
| `polling_with_optional_webhook` | Long-running job with polling fallback | HeyGen |
| `redirect_uri` | OAuth redirect callback | YouTube |

---

## POLLING DISCIPLINE (for HeyGen and similar)

When a provider uses polling:
- `polling_interval_seconds` must be declared (Phase-1: 60s for HeyGen)
- `max_polling_cycles` must be declared (Phase-1: 40 cycles = 40 minutes max)
- If max polling cycles are exceeded, the task enters **render_timeout** state
- Render timeout escalates to WF-900 with the relevant error code
- No infinite polling. No silent timeout. No undeclared ceiling.

---

## SECRETS SCOPE LAW

| Scope | Meaning |
|-------|---------|
| `none_required` | No secrets needed (e.g., Ollama local) |
| `local_env_only` | Secrets stored in `.env` local file only. Never committed to Git. |
| `vault_required` | Secrets must be in a vault service (future phases only) |

Phase-1 rule: All provider secrets are `local_env_only`. The `.env` file is in
`.gitignore`. No secret may appear in any tracked file.

---

## DEGRADED MODE LAW

Every provider must declare what happens when it is unavailable:

| Provider | Degraded Mode |
|----------|--------------|
| Ollama local | Halt workflow → WF-900 → SE-P1-002 |
| ElevenLabs | Block voice stage entirely |
| HeyGen | Block avatar stage entirely |
| YouTube Data API | Block publish stage entirely |

"Block stage" means: do not attempt an alternative. Do not silently skip.
Do not fall back to a different provider without an explicit provider registry
entry and Kubera approval for the fallback.

---

## RELEASE BLOCKER ALIGNMENT

The following release blockers from `registries/release_blocker_matrix.yaml`
are directly governed by this law:

- **RB-002**: YouTube OAuth redirect URI not finalized
- **RB-003**: Secret rotation policy not finalized
- **RB-004**: Provider quota thresholds not finalized

These release blockers do not stop repo build. They stop unattended deployment.
Their exact values must be resolved before any provider transitions from
`status: deferred` to `status: active` in the provider registry.

---

## KUBERA GATE INTEGRATION

Before any provider call, Kubera must verify:
1. Provider has `status: active` in provider_registry.yaml
2. Provider has an auth entry in provider_auth_callback_matrix.yaml
3. Current runtime mode is listed in the provider's `runtime_modes`
4. Budget threshold for this provider has not been exceeded (RB-004 resolved)
5. Current operating mode has `provider_access_posture` that permits this provider

If any check fails, Kubera blocks the call and escalates.

---

## RELATED FILES

- `registries/provider_registry.yaml`
- `registries/provider_auth_callback_matrix.yaml`
- `registries/release_blocker_matrix.yaml`
- `registries/mode_registry.yaml`
- `docs/01-architecture/founder_creator_mode_law.md`
- `docs/01-architecture/worker_router_law.md`
