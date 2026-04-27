# Architecture Scope Note: Phase-1 Reality vs Original Plan

**Last Updated:** 2026-04-27
**Status:** Canonical scope reconciliation

---

## Why this note exists

The earliest planning artifacts referenced "75 skills, 7 directors" as the Phase-1 scope. During build the scope was deliberately expanded. This note records what is in the repo today so audits do not interpret expansion as drift.

---

## Skills

**Original plan:** 75 skills (50 main + 25 sub)
**Actual repo:** 218 canonical skills, registered as M-001 through M-245 (gaps reserved for phase expansion)

### Why expanded
- Atomic, reusable skills give director-led routing more granular control.
- One-skill-per-decision keeps escalation paths small and audit-friendly.
- The 75-skill catalog is now an aggregation layer; each aggregate decomposes into 2-4 atomic M-skills.

### Where to look
- Master registry: `registries/skill_registry.yaml`
- Per-pack registries: `registries/skill_registry_wf100.yaml`, `skill_registry_wf200.yaml`, etc.
- Workflow-skill bindings: `bindings/workflow_skill_binding_wfXXX.yaml`

---

## Directors

**Original plan:** 7 directors (YAMA, KUBERA, Topic, Research, Script, Context, Media)
**Actual repo:** 30 director bindings

### Why expanded
- Original 7 governance authorities preserved.
- Added 23 domain-specific directors covering Phase-1 through Phase-6 governance, observability, learning, and safety.
- Directors gain finer veto granularity per workflow stage.

### Where to look
- Master binding: `registries/director_binding.yaml`
- Per-pack bindings: `registries/director_binding_wfXXX.yaml`
- Per-pack matrices: `bindings/workflow_director_binding_wfXXX.yaml`

---

## Workflows

**Plan:** 31 workflows
**Actual:** 31 root workflows + subdirectory canonical variants

### Coverage
- WF-000, WF-001, WF-010, WF-020, WF-021, WF-100, WF-200, WF-300, WF-400, WF-500, WF-600, WF-900, WF-901
- CWF-110 through CWF-140 (topic intelligence)
- CWF-210 through CWF-240 (script intelligence)
- CWF-310 through CWF-340 (context engineering)
- CWF-410 through CWF-440 (media production - Phase-2+ deferred)
- CWF-510 through CWF-530 (publishing - Phase-2+ deferred)
- CWF-610 through CWF-630 (analytics - in `n8n/workflows/analytics/`)

---

## Packet schemas

**Plan:** 318+ packet schemas
**Actual:** 313 packet schemas + 5 dossier-related schemas = 318 total under `schemas/`

---

## Veto / Governance authority

The original 7 governance authorities (YAMA, KUBERA, Topic, Research, Script, Context, Media) remain enforced. The expansion to 30 directors adds domain advisors that escalate to the original 7 - it does not redistribute veto authority.

---

## Reading the registries

Audit scripts that look for "75 skills" or "7 directors" will report mismatches. They should look for:

- `skills`: count entries with `skill_id: M-` prefix in `registries/skill_registry.yaml`
- `directors`: count entries in `registries/director_binding.yaml` directors block

Use:

```bash
grep -cE "^  - skill_id: M-" registries/skill_registry.yaml    # 218
node -e "const y=require('yaml'); const fs=require('fs'); console.log(y.parseAllDocuments(fs.readFileSync('registries/director_binding.yaml','utf8'))[0].toJSON().directors.length)"  # 30
```

This note replaces "75 / 7" claims everywhere in earlier user guidelines that did not match the build.
