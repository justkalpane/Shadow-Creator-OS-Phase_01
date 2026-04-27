# Deployment Requirements: Environment Preconditions

**Last Updated:** 2026-04-27
**Audience:** Deployment engineers, SRE, operators

This document lists every external environmental dependency that the Shadow Creator OS Phase-1 repository ASSUMES will be present at deployment. None of these can be fixed by code changes inside this repo - they must be installed and verified on the target host before runtime claims can be evaluated.

---

## 1. Required runtime: Node.js 18+

**Verify:**
```bash
node -v   # Must report v18.x or higher
npm -v    # Must report v8.x or higher
```

If missing: install from https://nodejs.org or via package manager.

---

## 2. Required runtime: n8n

**Status as of audit:** n8n is NOT installed in the repository's CI/test environment. All n8n claims are FILE-LEVEL VALIDATED ONLY. Live import / execution proof is REQUIRED before deployment.

**Install (Windows):**
```powershell
npm install -g n8n
n8n --version    # Must report 1.x or higher
```

**Install (Mac/Linux):**
```bash
npm install -g n8n
n8n --version
```

**Verify import readiness for the 32 canonical workflows:**
```bash
# Start n8n
n8n start

# In n8n UI (http://localhost:5678): Workflows > Import > select each .json file in n8n/workflows/
# Expected: 32 imports, 0 errors
```

If any workflow fails to import in a real n8n instance, mark it as a deployment blocker and route to repo for fix.

---

## 3. Required runtime: Ollama (Phase-1 default LLM)

**Verify:**
```bash
ollama list                                  # Must succeed and show available models
curl http://localhost:11434/api/tags         # Must return JSON with models
```

**Recommended models for Phase-1:**
- `llama3.2` (primary)
- `mistral` (fallback)

**Install reference:** https://ollama.ai/download

---

## 4. Optional runtime: SQLite or PostgreSQL

Phase-1 uses JSON file storage by default (in `data/`). Optional backend stores can mirror these.

If using PostgreSQL:
```bash
psql --version    # Must be 14.x or higher
```

If using SQLite (for local n8n state only):
```bash
sqlite3 --version   # Any modern version is fine
```

---

## 5. Pre-deployment validation gate

Before declaring the deployment ready, all the following must PASS:

```bash
npm install
npm run health:check                # PASS expected
npm run validate:all                # See current findings
npm run validate:workflows          # PASS expected (workflow_validator runFullCheck)
npm run validate:schemas            # PASS expected
npm run validate:registries         # See registry validator output
npm run validate:dossiers           # PASS expected (11/11)
npm run test:e2e                    # PASS expected (jest tests)
node tests/run_phase1_end_to_end_verification.js   # PASS expected (8/8 in current build)
node engine/directors/parent_orchestrator_runner.js   # SUCCESS expected
npm run db:verify                   # PASS expected
```

The repo cannot prove n8n live execution from CI. After the above pass, perform the n8n import test manually as the final gate.

---

## 6. Local artifacts and ignored paths

The following are git-ignored intentionally and must NOT be committed:

- `tmp_audit/` - local audit report scratch space
- `.claude/`, `.claude/settings.local.json` - local agent settings
- `n8n_user/`, `.n8n/`, `binaryData/`, `runtime/`, `logs/`, `cache/`, `artifacts/`
- `node_modules/`
- `*.env*` and `.env.local`

Verify before deployment:
```bash
git status --ignored | grep tmp_audit    # Should report tmp_audit as ignored, not staged
git status                               # Working tree should be clean of these
```

---

## 7. Known unproven claims (require live test)

The following are file-level/structural validated only. Live runtime proof is still required:

| Claim | Validation tier | Action required |
|---|---|---|
| n8n workflow import succeeds | FILE-LEVEL VALID ONLY | Manual import in real n8n |
| WF-020 director veto enforces in n8n | FILE-LEVEL VALID ONLY | Trigger rejection in n8n |
| WF-021 replay/remodify cycle | FILE-LEVEL VALID ONLY | Trigger reject and verify replay |
| WF-900 error catch in n8n | FILE-LEVEL VALID ONLY | Inject failure and observe |
| WF-901 recovery path | FILE-LEVEL VALID ONLY | Inject recoverable error |
| Topic→Script end-to-end | RUNTIME ENGINE PASSES | Run via n8n with real Ollama |
| Cost gate (KUBERA) at runtime | DOCUMENTED ONLY | Verify in n8n run |

Mark deployment as `READY FOR CONTROLLED REAL-TIME TESTING ONLY` until these are proven on a real n8n instance.
