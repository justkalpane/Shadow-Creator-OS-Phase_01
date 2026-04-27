# Shadow Creator OS Phase-1: User Guidelines & Knowledge Base

Welcome to Shadow Creator OS Phase-1 — an agentic content orchestration system that automates topic research, script generation, debate refinement, and publication preparation. This knowledge base contains everything you need to understand, deploy, operate, extend, and validate the system.

## What is Shadow Creator OS?

Shadow Creator OS is a **workflow orchestration engine** that:
- Accepts a content topic as input
- Runs topic discovery, qualification, and research
- Generates and debates scripts
- Refines outputs through multi-stage debate
- Packages content for publication across channels (YouTube, blog, email, social)
- Tracks cost, latency, quality, and policy compliance end-to-end
- Learns from execution feedback to improve future runs
- All without user intervention once started

**Current Phase:** Phase-1 (local Ollama text-only, no video/audio/images yet)

## How to Use This Knowledge Base

**Start here based on your role:**

| Role | Start with | Then read |
|------|-----------|-----------|
| **Beginner / First-Time User** | [00 START HERE](00_START_HERE.md) | System Overview → Installation → n8n Guide → Operator Runbook |
| **Operator (Running Workflows)** | [03 n8n Runtime Guide](03_N8N_RUNTIME_GUIDE.md) | Module Catalog → Workflow Usage → Operator Runbook → Troubleshooting |
| **Developer (Extending System)** | [04 Module Catalog](04_MODULE_CATALOG.md) | Director/Skill Guide → Dossier Guide → Continuation Guide → Testing |
| **Tester / Validator** | [11 Testing & Validation](11_TESTING_AND_VALIDATION_GUIDE.md) | System Overview → Operator Runbook → Knowledge Base → Troubleshooting |
| **SRE / Production** | [15 Production Readiness](15_PRODUCTION_READINESS_GUIDE.md) | System Overview → Deployment Status → Testing Guide |

## Complete Document Index

1. **[00 START HERE](00_START_HERE.md)** — What is Shadow Creator OS, why it exists, 5-minute first test
2. **[01 SYSTEM OVERVIEW](01_SYSTEM_OVERVIEW.md)** — Architecture, directors, skills, workflows, dossiers, packets, phases
3. **[02 INSTALLATION & SETUP](02_INSTALLATION_AND_SETUP.md)** — Windows local setup, Git, Node, n8n, environment config
4. **[03 n8n RUNTIME GUIDE](03_N8N_RUNTIME_GUIDE.md)** — Why n8n, what it controls, startup, first test, rules
5. **[04 MODULE CATALOG](04_MODULE_CATALOG.md)** — Folder breakdown, file purposes, status, related workflows
6. **[05 MODULE USE CASES](05_MODULE_USE_CASES.md)** — Practical examples: topic intake → publication
7. **[06 WORKFLOW USAGE GUIDE](06_WORKFLOW_USAGE_GUIDE.md)** — How to use each workflow (WF-000 through CWF-630)
8. **[07 DIRECTOR/SKILL/AGENT GUIDE](07_DIRECTOR_SKILL_AGENT_GUIDE.md)** — What directors do, skill contracts, binding, routing
9. **[08 DOSSIER & PACKET GUIDE](08_DOSSIER_AND_PACKET_GUIDE.md)** — Dossier creation, mutations, append-only law, packet schemas
10. **[09 KNOWLEDGE BASE](09_KNOWLEDGE_BASE.md)** — Core concepts, glossary, architecture terms, common questions
11. **[10 ARTICLES & LEARNING PATHS](10_ARTICLES_AND_LEARNING_PATHS.md)** — Educational deep dives on key concepts
12. **[11 TESTING & VALIDATION GUIDE](11_TESTING_AND_VALIDATION_GUIDE.md)** — Static, registry, schema, workflow validation
13. **[12 TROUBLESHOOTING GUIDE](12_TROUBLESHOOTING_GUIDE.md)** — Common issues and solutions
14. **[13 OPERATOR RUNBOOK](13_OPERATOR_RUNBOOK.md)** — Before-test checklist, run sequence, verification
15. **[14 DEVELOPER CONTINUATION GUIDE](14_DEVELOPER_CONTINUATION_GUIDE.md)** — How to safely extend the system
16. **[15 PRODUCTION READINESS GUIDE](15_PRODUCTION_READINESS_GUIDE.md)** — Pre-production checklist
17. **[16 GLOSSARY & QUICK REFERENCE](16_GLOSSARY_AND_QUICK_REFERENCE.md)** — Terms, URLs, ports, default credentials

## Key Concepts (5-Minute Read)

**Dossier:** Immutable execution state. Every topic-to-publication run creates one dossier. All workflow stages read/write to it. No overwrites — only append-only deltas with audit trail.

**Director:** Governance authority. YAMA enforces policy. KUBERA enforces budget. Domain directors (topic, script, research) make decisions.

**Skill:** Modular operation. "Topic Parsing" is a skill. "Script Drafting" is a skill. Skills carry DNA: identity, role, inputs, outputs, error handling.

**Workflow:** Orchestration. WF-010 is the parent orchestrator. CWF-110 is Topic Discovery. CWF-210 is Script Generation. Workflows call skills and emit packets.

**Packet:** Typed state transition. Every workflow emits a packet (schema-bound). Packets have lineage. You can replay from any packet.

**Registry:** Machine-readable source of truth. Model registry lists available LLMs. Mode registry defines operational modes. Skill registry lists all skills. Registries are YAML.

**n8n:** Live execution engine. Runs workflows. Reads/writes dossier. Manages state. Local instance only (Phase-1).

## Critical Safety Rules

1. **APPEND_ONLY:** Never overwrite dossier state. Only add deltas. Every change has a version number and owner.
2. **REGISTRY_FIRST:** No artifact exists in runtime unless it exists in registry first.
3. **SCHEMA_BOUND:** All outputs must match packet schemas. Validators enforce this.
4. **NO_FAKE_COMPLETION:** System tracks what's truly complete vs. what's in-progress or stub.

## Repository Status (Current)

- **Workflows:** 31 complete (7 system + 6 pack parents + 18 children)
- **Skills:** 75 complete (50 main + 25 sub)
- **Registries:** 11 complete (223 entries total)
- **Validators:** 5 complete (model, mode, UI, workflow, runtime)
- **Schemas:** 318 packet families defined
- **Dossier Namespaces:** 12 complete
- **n8n Workflows:** All JSONs generated and tested
- **Phase-1 Execution:** Ready for local testing

## What's NOT in Phase-1 (By Design)

- **Video generation:** Phase-6+
- **Image generation:** Phase-4+
- **Audio generation:** Phase-4+
- **Multiple LLM cloud providers:** Phase-2+ (Ollama is Phase-1 only)
- **Dashboard UI:** Phase-2+ (n8n UI is current interface)
- **Observability stack:** Phase-2+

## Next Steps

1. **New to the system?** → Start with [00 START HERE](00_START_HERE.md)
2. **Running workflows?** → Go to [03 n8n RUNTIME GUIDE](03_N8N_RUNTIME_GUIDE.md)
3. **Extending the system?** → Go to [14 DEVELOPER CONTINUATION GUIDE](14_DEVELOPER_CONTINUATION_GUIDE.md)
4. **Testing?** → Go to [11 TESTING & VALIDATION GUIDE](11_TESTING_AND_VALIDATION_GUIDE.md)
5. **Production ready?** → Go to [15 PRODUCTION READINESS GUIDE](15_PRODUCTION_READINESS_GUIDE.md)

---

**Last Updated:** 2026-04-27  
**Status:** Phase-1 Documentation Complete  
**Version:** 1.0.0

