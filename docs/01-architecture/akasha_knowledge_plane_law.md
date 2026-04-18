# Akasha Knowledge Plane Law
## Shadow Empire / Creator OS
## Classification: Constitutional Machine Law — Knowledge Governance
## Status: Wave 00 Established

---

## PURPOSE

Akasha is the namespaced knowledge plane owner for the Shadow Empire runtime.
It governs how knowledge is organized, loaded, isolated, and consumed across
workflows. It prevents cross-domain knowledge contamination and enforces the
principle that each workflow pack operates in its own knowledge domain.

---

## CANONICAL REGISTRY REFERENCE

`registries/knowledge_plane_registry.yaml`

---

## CORE PRINCIPLES

### 1. Namespace Isolation (No Cross-Domain Bleed)

Each knowledge namespace is owned by a specific workflow pack.
Cross-domain retrieval is **forbidden by default** unless explicitly declared
in the knowledge_plane_registry.yaml as an allowed consumer relationship.

Example forbidden pattern:
- Script Intelligence (WF-200) writing back into the Topic Intelligence namespace
- Context Engineering reading from the Script namespace without a declared contract

### 2. Immutable Activation

When a knowledge namespace is loaded for a workflow stage:
- The namespace content is frozen at load time
- No updates to the namespace occur during that stage's execution
- Updates only become visible after an atomic swap with smoke test

### 3. Atomic Swap

Knowledge updates are committed atomically, not incrementally.
An in-progress update does not become visible to consumers until the full
update passes the smoke test.

If the smoke test fails, the previous namespace version remains active.
Partial updates never enter production knowledge.

### 4. Smoke Test Before Activation

Every namespace version change requires a smoke test before it becomes active.
The smoke test validates:
- Namespace contains all required document types for its consumers
- No critical retrieval paths return empty
- Token budget is respected (retrieval_cap_tokens)
- Domain isolation is preserved (no bleed)

### 5. Retrieval Token Budget

Each namespace has a `retrieval_cap_tokens` value in the registry.
No single retrieval call may exceed this budget.
If retrieval exceeds the budget, compression is required before the
content is passed to the Ollama context window.

---

## NAMESPACE GOVERNANCE TABLE

| Namespace | Owner Pack | Cap Tokens | Cross-Domain | Phase-1 |
|-----------|-----------|------------|-------------|---------|
| topic_intelligence | WF-100 | 8,000 | WF-200 reads | Active |
| script_intelligence | WF-200 | 12,000 | None | Active |
| governance_rules | system | 4,000 | All workflows | Active |
| system_config | system | 2,000 | All workflows | Active |
| context_engineering | WF-300 | 16,000 | None | Deferred |
| approval_governance | WF-400 | 4,000 | WF-900 reads | Deferred |

---

## PHASE-1 KNOWLEDGE POSTURE

Phase-1 does not implement a full Akasha vector database or retrieval engine.
The Phase-1 knowledge posture is:

**Effective knowledge loading** occurs when n8n Code nodes embed relevant
context directly into the Ollama prompt. The structure mirrors Akasha's
namespace discipline:
- Topic intelligence context → CWF-110/120/130/140 prompts
- Script intelligence context → CWF-210/220/230/240 prompts
- Governance rules → embedded in all workflow system prompts

**Token budget compliance** is enforced by the workflow design:
- Discovery prompts must stay under 8,000 tokens of retrieved context
- Script prompts must stay under 12,000 tokens of retrieved context
- Compression of prior stage outputs is required before injection

The formal Akasha retrieval engine (vector DB, semantic search) is a Phase-2
or Phase-3 capability. The laws and contracts are established now so Phase-2
implementation has a governed contract to fulfill.

---

## GOVERNANCE DIRECTOR

Akasha governance authority: **Saraswati**

Saraswati governs the quality and structure of knowledge ingestion.
Any knowledge namespace update that changes the domain boundary must
receive Saraswati's approval before atomic swap.

---

## RELATED FILES

- `registries/knowledge_plane_registry.yaml`
- `registries/skill_loader_registry.yaml`
- `registries/mode_registry.yaml`
- `docs/01-architecture/prompt_registry_interlock_law.md`
