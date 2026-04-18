# SKILL DNA UPGRADE TEMPLATE

This template shows the exact structure for upgrading flat skill files to full DNA-injected skills.

## TEMPLATE STRUCTURE

Use this template for all remaining skill markdown files. Replace placeholders with actual values from the skill's role, dependencies, and manifest relationships.

```markdown
# SKL-PH1-[SKILL-NAME-UPPERCASE]

## 1. Skill Identity
- **Skill ID:** [M-XXX or S-XXX]
- **Skill Name:** [Full name from current file]
- **Version:** 1.0.0
- **Phase Scope:** PHASE_1_TOPIC_TO_SCRIPT
- **Classification:** github_source_of_truth
- **Owner Workflow:** SE-N8N-CWF-[workflow-id]-[workflow-name]
- **Consumer Workflows:** [list of workflows that consume this skill]
- **Vein/Route/Stage:** [discovery_vein|research_vein|narrative_vein] / topic_to_script / [Stage_B|Stage_C]

## 2. Purpose
[Existing ROLE text, expanded with context about downstream usage]

## 3. DNA Injection
- **Role Definition:** [one-line function descriptor]
- **DNA Archetype:** [Narada|Chanakya|Krishna|Vyasa|Saraswati|Durga|Chandra|etc]
- **Behavior Model:** [adjectives describing decision/execution style]
- **Operating Method:** [step1 → step2 → step3 → output]
- **Working Style:** [working approach descriptors]

## 4. Workflow Injection
- **Producer:** [which workflow produces input for this skill]
- **Direct Consumers:** [which workflows consume output from this skill]
- **Upstream Dependencies:** [which registries/files/packets must exist before this runs]
- **Downstream Handoff:** [what packet is emitted → which workflow/skill consumes it]
- **Escalation Path:** SE-N8N-WF-900 on [specific error type]
- **Fallback Path:** [what to do if primary execution path fails]
- **Replay Path:** SE-N8N-WF-021 if user requests [specific remodify condition]

## 5. Inputs
**Required:**
- `dossier_id` (string) — parent dossier identifier
- [other required inputs with types and descriptions]

**Optional:**
- [optional inputs with defaults]

## 6. Execution Logic
```
1. [High-level step 1]
2. [High-level step 2]
   a. [Sub-step a]
   b. [Sub-step b]
3. [Continue as needed]
4. Return [output packet type]
5. On error: escalate to WF-900
```

## 7. Outputs

**Primary Output Packet:**
```json
{
  "instance_id": "[PKT-PREFIX-timestamp]",
  "artifact_family": "[family name]",
  "schema_version": "1.0.0",
  "producer_workflow": "SE-N8N-CWF-XXX",
  "dossier_ref": "[dossier_id]",
  "created_at": "[ISO timestamp]",
  "status": "CREATED | PARTIAL | EMPTY",
  "payload": {
    [schema-specific fields]
  }
}
```

**Write Targets:**
- `dossier.[namespace].[field]` (patch-only append)
- `se_packet_index` (one row with file_path reference)

## 8. Governance
- **Director Binding:** [Director name] (owner), [other director] (strategic authority)
- **Veto Power:** [yes|no]
- **Approval Gate:** [yes with which director|none]
- **Policy Requirements:**
  - [Requirement 1]
  - [Requirement 2]

## 9. Tool / Runtime Usage

**Allowed:**
- [Tool/capability 1]
- [Tool/capability 2]

**Forbidden:**
- [Forbidden tool/capability 1]
- [Forbidden tool/capability 2]

## 10. Mutation Law

**Reads:**
- `dossier.[namespace].[fields]`
- [Registry files]
- [External sources if any]

**Writes:**
- `dossier.[namespace].[field]` (patch-only append, never overwrite)
- `se_packet_index` (one row)

**Forbidden Mutations:**
- Do NOT overwrite existing fields
- Do NOT mutate dossier identity fields
- Do NOT write to unauthorized namespaces

## 11. Best Practices
- [Best practice 1]
- [Best practice 2]
- [Handling of edge cases or partial data]

## 12. Validation / Done

**Acceptance Tests:**
- TEST-PH1-[SKL-ID]-001: [Test description]
- TEST-PH1-[SKL-ID]-002: [Test description]

**Done Criteria:**
- Packet schema matches family contract
- All outputs have proper types and structure
- Dossier patch is additive only
- se_packet_index row created with file_path
- Escalation to WF-900 works on critical error
```

## ARCHETYPE GUIDE

Use these DNA archetypes for skills (from director councils):

**Intelligence Gathering:**
- Narada — trend spotting, broad pattern recognition, signal discovery
- Chanakya — strategic analysis, evidence weighing, qualification logic
- Krishna — synthesis, orchestration, final decisions

**Research & Context:**
- Vyasa — narrative shaping, knowledge assembly, document building
- Saraswati — knowledge management, retrieval, graph building
- Durga — protection, risk assessment, safety checking

**Audience & Market:**
- Chandra — audience mood, demographic mapping, audience insights
- [Other specialists as needed]

## VEIN MAPPING

Skills belong to one of these veins:

- **discovery_vein:** M-001 through M-025 (topic intelligence)
- **qualification_vein:** M-016, M-023 (gatekeeping)
- **research_vein:** M-009 through M-022 (research synthesis)
- **narrative_vein:** S-201 through S-210 (script intelligence)

## NAMESPACE OWNERSHIP

Each skill should write to ONE primary dossier namespace:

- `dossier.discovery` — owned by discovery_vein skills (M-001 to M-024)
- `dossier.research` — owned by research synthesis skills (M-009 to M-022)
- `dossier.narrative` — owned by script intelligence skills (S-201 to S-210)
- `dossier.approval` — owned by approval workflow (WF-020)
- `dossier.runtime` — system metadata only

Do NOT write to namespaces you don't own.

## QUICK CHECKLIST FOR EACH SKILL

- [ ] Skill ID and name correct
- [ ] Producer/consumer workflows identified from manifests
- [ ] Upstream dependencies listed (from skill_registry, manifests)
- [ ] Output packet family named
- [ ] Governance owner (director) assigned
- [ ] Mutation law specifies only ONE namespace owner
- [ ] Escalation path to WF-900 defined
- [ ] Fallback behavior for partial/missing data defined
- [ ] Input/output schemas clear
- [ ] Test references follow pattern TEST-PH1-[SKL-ID]-NNN
- [ ] Best practices address edge cases
