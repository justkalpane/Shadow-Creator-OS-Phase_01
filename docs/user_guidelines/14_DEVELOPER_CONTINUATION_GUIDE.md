# Developer Continuation Guide: Extending the System Safely

## Core Principle: PRESERVE ARCHITECTURE

When extending Shadow Creator OS, your changes must:
1. ✓ Preserve the 5-layer architecture
2. ✓ Maintain registry-first governance
3. ✓ Keep append-only dossier mutation
4. ✓ Enforce schema-binding for packets
5. ✓ Update all relevant registries
6. ✓ Pass all validators
7. ✓ Include test fixtures
8. ✓ Document in user guides

---

## Before You Code

**ALWAYS inspect before editing:**

```bash
# 1. Understand what exists
ls -la skills/context_media/
ls -la registries/
npm run validate:all

# 2. Check if artifact already exists
grep -r "my_new_feature" registries/
grep -r "my_new_skill" skills/

# 3. Read SYSTEM_MANIFEST.yaml
cat SYSTEM_MANIFEST.yaml | grep -A 5 "my_domain"
```

**NEVER:**
- Create skills without adding to registries
- Create workflows without updating workflow_registry.yaml
- Emit packets without defining schemas
- Overwrite existing dossier namespaces
- Delete any existing files

---

## Adding a New Skill (Example)

**Goal:** Add "script_context_analyzer" skill

**Step 1: Create Skill File**
```bash
touch skills/script_refinement/script_context_analyzer.skill.md
```

**Content:**
```markdown
# Skill: script_context_analyzer
skill_id: script_context_analyzer
skill_name: Script Context Analyzer
family: script_refinement
purpose: Analyze script context, style consistency, tone alignment

inputs:
  - script_draft: string
  - brand_guidelines: object
  - target_audience: string

outputs:
  - context_analysis: object
  - style_consistency_score: 0-1
  - tone_appropriateness_score: 0-1
  - recommendations: array

dossier_reads: [script.refined_draft, context.execution_context]
dossier_writes: [script.context_analysis]

escalation_director: script_director
quality_threshold: 0.80
fallback_mode: return_analysis_even_if_incomplete

validation:
  - all_output_fields_present
  - scores_between_0_and_1
  - recommendations_are_actionable
```

**Step 2: Add to Skill Registry**
```bash
# Edit: registries/skill_registry.yaml

- skill_id: script_context_analyzer
  skill_name: Script Context Analyzer
  family: script_refinement
  purpose: Analyze script context, style, tone
  inputs: [script_draft, brand_guidelines, target_audience]
  outputs: [context_analysis, style_consistency_score, tone_appropriateness_score, recommendations]
  escalation_director: script_director
  parent_workflow: CWF-230  # Bind to existing workflow
  status: new_skill_phase_1
  created_by: developer_name
  created_at: 2026-04-27
```

**Step 3: Update Workflow to Call Skill**
```bash
# Edit: n8n/workflows/CWF-230-script-refinement.json

# In the CWF-230 node that executes skills, add:
{
  "skill_call": {
    "skill_id": "script_context_analyzer",
    "inputs": {
      "script_draft": "{{ $json.script.draft }}",
      "brand_guidelines": "{{ $json.context.brand_guidelines }}",
      "target_audience": "{{ $json.context.target_audience }}"
    }
  }
}

# Update dossier write:
{
  "dossier_write": {
    "namespace": "script",
    "field": "context_analysis",
    "value": "{{ $json.skill_output.context_analysis }}"
  }
}
```

**Step 4: Create Packet Schema (if emitting)**
```bash
touch schemas/packets/script_context_analysis_packet.schema.json
```

**Content:**
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ScriptContextAnalysisPacket",
  "type": "object",
  "properties": {
    "packet_type": { "const": "script_context_analysis_packet" },
    "producer_workflow": { "const": "CWF-230" },
    "payload": {
      "type": "object",
      "properties": {
        "context_analysis": { "type": "object" },
        "style_consistency_score": { "type": "number" },
        "tone_appropriateness_score": { "type": "number" },
        "recommendations": { "type": "array" }
      }
    }
  },
  "required": ["packet_type", "producer_workflow", "payload"]
}
```

**Step 5: Test Validation**
```bash
npm run validate:workflows
npm run validate:schemas
npm run validate:registries

# All should pass, no orphans
```

**Step 6: Add to Test Fixtures**
```bash
# Create: tests/fixtures/script_context_analyzer.fixture.json

{
  "input": {
    "script_draft": "AI is transforming content...",
    "brand_guidelines": { "tone": "professional", "style": "conversational" },
    "target_audience": "tech creators"
  },
  "expected_output": {
    "context_analysis": { "detected_tone": "conversational", "alignment": "good" },
    "style_consistency_score": 0.88,
    "tone_appropriateness_score": 0.92,
    "recommendations": ["Add more examples"]
  }
}
```

**Step 7: Commit to Git**
```bash
git add skills/script_refinement/script_context_analyzer.skill.md
git add registries/skill_registry.yaml
git add n8n/workflows/CWF-230-script-refinement.json
git add schemas/packets/script_context_analysis_packet.schema.json
git add tests/fixtures/script_context_analyzer.fixture.json

git commit -m "feat: add script_context_analyzer skill to CWF-230

- New skill for analyzing script context, style, tone consistency
- Integrated into script refinement workflow
- Added packet schema and test fixtures
- All validators pass (registry, schema, workflow)

Skill ID: script_context_analyzer
Escalation: script_director
Quality Threshold: 0.80"
```

---

## Adding a New Workflow (Advanced)

**Goal:** Add WF-070 for new stage

**Steps:**
1. Create workflow JSON: `n8n/workflows/WF-070-new-stage.json`
2. Add to workflow_registry.yaml
3. Define parent/child relationships
4. Create packet schema if emitting new packets
5. Update WF-010 routing to include new stage
6. Test: `npm run validate:workflows`
7. Commit: Include clear description of what stage does

---

## Extending Dossier Namespaces

**⚠️ CAREFUL:** Adding new namespace is a major change.

**Before doing this, verify:**
- Current 12 namespaces are insufficient
- New namespace doesn't duplicate existing namespace
- New namespace has clear ownership (which workflow writes to it)

**If adding new namespace:**
1. Update `schemas/dossier/content_dossier.schema.json`
2. Add namespace definition with documentation
3. Update SYSTEM_MANIFEST.yaml
4. Add to all relevant workflow mutations
5. Update dossier_delta_log schema
6. Test: `npm run validate:schemas`

---

## Safe Extension Patterns

### Pattern 1: Add Skill to Existing Workflow
- Low risk
- Doesn't require workflow JSON changes (if workflow already calls skills)
- Just add skill file + registry entry

### Pattern 2: Add Workflow to Existing Pack
- Medium risk
- Requires updating parent workflow routing
- Create new workflow JSON, add to registry, test routing

### Pattern 3: Add New Pack (e.g., WF-700 Content Monetization)
- High risk
- Requires new parent workflow, child workflows, all infrastructure
- Better to do in future phase

---

## Code Style Guidelines

**Skill Files:**
- Use markdown for documentation
- YAML for metadata
- Include examples
- Document escalation and fallback

**Workflow JSONs:**
- Follow n8n best practices
- Include error handling (route to WF-900)
- Emit packet with schema version
- Update dossier with delta pattern
- Add comments for complex logic

**Registries:**
- One entry per artifact
- Include status field
- Reference creators/owners
- Update timestamps

---

## Testing Extensions

**Before committing:**
```bash
# 1. Validate all layers
npm run validate:all

# 2. Run tests
npm run test:e2e

# 3. Check no orphans
npm run validate:registries
# Result: 0 orphans

# 4. Manual test if possible
# In n8n: Execute workflow using new skill
# Inspect: Check dossier/packet outputs
```

---

## Documentation Requirements

**For each extension, update:**
1. Skill documentation (skills/.../skill.md)
2. Skill registry (registries/skill_registry.yaml)
3. Workflow registry if needed (registries/workflow_registry.yaml)
4. SYSTEM_MANIFEST.yaml (increment version, list changes)
5. User guides (docs/user_guidelines/ if relevant)
6. Tests/fixtures

---

## Getting Help

**If uncertain about extending:**
1. Check SYSTEM_MANIFEST.yaml for similar patterns
2. Look at existing skills as examples
3. Review validator output for guidance
4. Ask in code review (before committing)

---
