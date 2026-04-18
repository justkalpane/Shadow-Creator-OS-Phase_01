# Skill Loader Repo-Loadability Contract
## Shadow Empire / Creator OS
## Classification: Constitutional Machine Law — Skill Execution Readiness
## Status: Wave 00 Established

---

## CORE LAW

The existence of many skill files in the repo is not enough.
A skill is only **repo-loadable** when it satisfies all of the following:

1. Appears in the canonical skill registry for its workflow pack
2. Has a corresponding `.skill.md` file at the declared path
3. Has all declared DEPENDENCIES resolvable to existing skill IDs
4. Has director binding in the workflow pack's director binding file
5. Can be parsed by the parser against the required field set
6. Has valid JSON blocks for INPUT_VARIABLES and OUTPUT_FORMAT

A skill that fails any of these conditions is NOT active. It is a ghost dependency.

---

## CANONICAL REGISTRY REFERENCE

`registries/skill_loader_registry.yaml`

---

## REQUIRED SKILL FILE FIELDS (all mandatory)

| Field | Description |
|-------|-------------|
| `SKILL_ID` | Unique skill identifier (e.g., M-001, S-201) |
| `NAME` | Human-readable skill name |
| `DNA_ARCHETYPE` | Director archetype (e.g., Narada, Krishna, Yama) |
| `ROLE` | What this skill does — explicit, not vague |
| `DEPENDENCIES` | Comma-separated list of SKILL_IDs this skill depends on |
| `ROUTE_MAP` | Workflow chain this skill operates within |
| `APPROVAL_GATE` | Which director must approve, or "none" |
| `VETO_POWER` | yes / no |
| `IMMUNE_SIGNATURE` | Quality benchmark for this skill's output |
| `INPUT_VARIABLES` | Valid JSON block of all input variable names and defaults |
| `ACTION_TRIGGER` | When exactly this skill activates |
| `PROCESS` | Numbered step-by-step execution logic |
| `OUTPUT_FORMAT` | Valid JSON block with at minimum: skill_id, output_type, status, payload |

---

## LOADING PROTOCOL

1. Route is selected by WF-010
2. Stage is identified (discovery / qualification / scoring / synthesis / generation / debate / refinement / shaping)
3. Skill registry for the workflow pack is consulted
4. Only skills required for the current stage are loaded (max 3 standard, 8 exception — Ganesha enforces)
5. Dependency tree is resolved before activation (pre-activation check)
6. Director binding is verified before skill receives director oversight
7. Skills from completed stages are deregistered before next stage begins

---

## CURRENT COMPLIANCE STATE

**Compliant (Phase-1):**
- All skills in `skills/topic_intelligence/` (M-001 through M-025) — full DNA present
- All skills in `skills/research_intelligence/` (M-009 through M-025) — full DNA present

**Non-Compliant — Requires P0 Hardening:**
- All skills in `skills/script_intelligence/` (S-201 through S-210) — flat stubs, missing required fields
- See build_blocker_matrix.yaml BB-018
- These skills exist as repo files but are NOT repo-loadable until P0 upgrages their DNA

---

## ANTI-PATTERNS — FORBIDDEN

- Loading all skills for a workflow pack globally at once
- Activating a skill not in the canonical registry for the active pack
- Guessing skill file paths by folder name without registry consultation
- Treating skill file presence as equivalent to skill activation legality
- Using a skill before its dependency chain is resolved

---

## IMMUNE SIGNATURE LAW

Every skill defines an IMMUNE_SIGNATURE — a quality benchmark statement.
If an evolved skill version scores below the previous version on its benchmark,
the loader must rollback to the previous version.

The IMMUNE_SIGNATURE is not optional decoration. It is the minimum output
quality contract for the skill. If the skill cannot produce output that satisfies
its IMMUNE_SIGNATURE, it has failed and must escalate via the error class protocol.

---

## GHOST DEPENDENCY DETECTION

A ghost dependency is a SKILL_ID declared in a skill's DEPENDENCIES field
that does not exist in the canonical skill registry for the active pack.

Ghost dependencies are **BUILD blockers**. They must be resolved before the
skill can be activated. Resolution options:
1. Add the missing skill to the repo and registry
2. Remove the ghost dependency from the skill's DEPENDENCIES field
3. Log to `registries/decision_packet_register.yaml` if the resolution requires a decision

---

## RELATED FILES

- `registries/skill_loader_registry.yaml`
- `registries/skill_registry_wf100.yaml`
- `registries/skill_registry_wf200.yaml`
- `registries/director_binding_wf100.yaml`
- `registries/director_binding_wf200.yaml`
- `registries/build_blocker_matrix.yaml` (BB-018)
- `docs/01-architecture/prompt_registry_interlock_law.md`
