# Local Secret Rotation Policy
## Shadow Empire / Creator OS
## Classification: Deployment Policy
## Status: Phase-1 Canonical

---

## PURPOSE

Phase-1 provider secrets are stored only in the local `.env` file and must
never be committed to Git. This policy defines how a local secret is rotated,
replaced, and revoked without introducing tracked-file drift.

---

## CANONICAL RULES

1. All provider secrets remain `local_env_only`.
2. Secret values are edited only in the local `.env` file.
3. The `.env` file remains untracked and ignored by Git.
4. Secret replacement is done by writing a new provider-issued value into `.env`.
5. Old provider secrets are revoked at the provider side after replacement.
6. Runtime services are restarted or reloaded after the local env update.
7. No secret value may be written into tracked docs, YAML, JSON, or workflow exports.

---

## ROTATION WORKFLOW

1. Confirm which provider secret is being replaced.
2. Generate the new secret in the provider console or local auth flow.
3. Update the matching key in the local `.env` file only.
4. Restart or reload the local runtime so it reads the new secret.
5. Validate the provider handshake or callback path.
6. Revoke the old secret after the new one is confirmed active.
7. Record the rotation in local operational notes outside the tracked repo if needed.

---

## REVOCATION WORKFLOW

1. Remove the obsolete secret from the provider console.
2. Clear the old value from the local `.env` file if it is no longer needed.
3. Restart or reload runtime services that consumed the old value.
4. Verify no tracked file contains the revoked value.

---

## SAFETY GUARDS

- Never place secret material into `.env.example`.
- Never commit provider keys into tracked files.
- Never rotate secrets by editing registries or manifests with live values.
- Never keep both old and new secrets in tracked repo content.

---

## RELATED FILES

- `docs/01-architecture/provider_auth_callback_closure_law.md`
- `registries/provider_auth_callback_matrix.yaml`
- `registries/release_blocker_matrix.yaml`
- `.env.example`
