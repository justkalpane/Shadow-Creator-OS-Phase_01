# Director, Skill, and Agent Guide: Governance & Operations

## What Directors Are

**Directors are governance authorities.** They make decisions, enforce rules, and have veto power.

### 7 Directors in Phase-1

#### 1. YAMA — Policy Enforcement Director
**Role:** Ensures content complies with organizational policy
**Veto Authority:** Can reject content for policy violation
**Checks:**
- Content policy compliance
- Legal boundaries
- Brand alignment
- Sensitive content rules
**Escalation Path:** Founder can override
**Example:** YAMA checks script doesn't violate brand guidelines

#### 2. KUBERA — Budget Governance Director
**Role:** Controls spending and cost limits
**Veto Authority:** Can reject workflow for exceeding budget
**Checks:**
- Cost per dossier
- Token usage
- Total monthly spend
- Budget remaining
**Escalation Path:** Founder can approve overspend
**Example:** KUBERA rejects execution that would exceed $50/month budget

#### 3. Topic Director — Domain Expert
**Role:** Qualifies topics for relevance and feasibility
**Veto Authority:** Can reject topic as out-of-scope
**Checks:**
- Topic relevance
- Scope appropriateness
- Novelty
- Platform fit
**Escalation Path:** Research Director for second opinion

#### 4. Research Director — Evidence Authority
**Role:** Validates research quality and source credibility
**Veto Authority:** Can reject research for weak evidence
**Checks:**
- Source quality
- Claim support
- Evidence validity
- Citation completeness
**Escalation Path:** Script Director for evidence-to-script mapping

#### 5. Script Director — Quality Authority
**Role:** Ensures script quality and coherence
**Veto Authority:** Can send script back for refinement
**Checks:**
- Script quality score
- Coherence
- Engagement
- Pacing
- Argument strength
**Threshold:** Quality must be ≥0.85 (or 0.70 in builder mode)
**Escalation Path:** Founder for override

#### 6. Context Director — Execution Planning
**Role:** Adjusts execution based on resource constraints
**Veto Authority:** Can reduce scope or defer features
**Checks:**
- Tool availability
- Resource constraints
- Timing feasibility
**Escalation Path:** KUBERA for resource budgeting

#### 7. Media Director — Asset Production (Phase-4+)
**Role:** Plans media asset generation
**Status:** Phase-1 text only; Media Director inactive until Phase-4
**Future Checks:** Video feasibility, audio generation capacity

---

## What Skills Are

**Skills are modular operations.** Every operation the system performs is a skill.

### Skill Structure

Each skill has:
- **skill_id:** Unique identifier
- **skill_name:** Human-readable name
- **purpose:** What the skill does
- **inputs:** What data it accepts
- **outputs:** What data it produces
- **dossier_reads:** Which namespaces it reads
- **dossier_writes:** Which namespaces it updates
- **escalation_path:** Which director oversees it
- **quality_threshold:** Minimum quality score required
- **fallback_mode:** What to do if it fails

### 75 Total Skills

**Topic Intelligence Family (6 skills):**
- Topic Parsing — Extract entities, themes, scope
- Topic Normalization — Standardize topic format
- Topic Disambiguation — Resolve ambiguous topics
- Topic Viability Scoring — Check feasibility
- Topic Novelty Analysis — Check originality
- Topic Trend Synthesis — Identify trend potential

**Research Family (4 skills):**
- Research Compression — Synthesize source material
- Research Evidence Mapping — Link claims to evidence
- Research Source Ranking — Score source credibility
- Research Fact Validation — Verify claim accuracy

**Script Generation Family (5 skills):**
- Script Outline Generator — Create structure
- Script Hook Generator — Create attention-grabbing opening
- Script Drafting — Write full script
- Script Debate Critic — Generate counterarguments
- Script Counterargument Generator — Strengthen weak points

**Script Refinement Family (3 skills):**
- Script Validator — Check quality
- Script Quality Fixer — Fix issues
- Script Metadata Generator — Create metadata

**Context & Media Family (4 skills):**
- Context Packet Builder — Define execution rules
- Thumbnail Planner — Plan visual assets
- Audio Planner — Plan audio elements
- Video Planner — Plan video elements

**System Operations Family (3 skills):**
- Workflow Router — Route to next workflow
- Error Classifier — Categorize errors
- Replay Safety Checker — Validate replay safety

**Sub-Skills (25 micro-skills):**
- Topic Entity Extractor
- Topic Theme Identifier
- Topic Scope Analyzer
- Research Claim Synthesizer
- Research Evidence Linker
- ... (20 more)

---

## Skill Registration

When creating a new skill:

1. **Add to skill_registry.yaml:**
   ```yaml
   - skill_id: my_new_skill
     skill_name: My New Skill
     family: context_media
     purpose: Description
     inputs: [input1, input2]
     outputs: [output1, output2]
     escalation_director: context_director
   ```

2. **Create skill file:** `skills/context_media/my_new_skill.skill.md`

3. **Define dossier interaction:**
   ```yaml
   dossier_reads: [context.execution_context]
   dossier_writes: [context.my_output]
   ```

4. **Add validation rules:**
   ```yaml
   validation:
     quality_threshold: 0.80
     error_handling: return_empty_if_fails
   ```

5. **Bind to workflow:**
   - Update workflow JSON to call skill
   - Update workflow_registry.yaml

6. **Test:** Run npm run validate:workflows

---

## What Agents Are (Future Concept)

**Agents** (Phase-2+) will be autonomous sub-systems that:
- Own specific domains (e.g., Research Agent owns research workflows)
- Make tactical decisions within their domain
- Escalate to directors for strategic decisions
- Learn from feedback to improve

**Phase-1 Status:** No agents yet. Directors handle all governance directly.

---

## Governance Enforcement

### Policy (YAMA)
YAMA checks every content decision:
- ✓ Policy compliant
- ✗ Rejects if policy violated
- → Escalates to founder if needed

### Budget (KUBERA)
KUBERA enforces cost limits:
- ✓ Within budget
- ✗ Rejects if over budget
- → Escalates to founder if needed

### Quality (Script Director)
Script Director enforces quality:
- ✓ Quality ≥ threshold
- ✗ Sends to refinement if below threshold
- → Can skip for founder approval

### Evidence (Research Director)
Research Director validates evidence:
- ✓ Evidence sufficient
- ✗ Rejects if evidence weak
- → Escalates for more research

---

## How Directors Work in Practice

**Example: Script Generation Workflow**

```
CWF-210: Script Generation
  ↓
Script generated (quality score: 0.82)
  ↓
Script Director check:
  Quality threshold: 0.85
  Actual quality: 0.82
  Result: ✗ BELOW THRESHOLD
  ↓
  Action: Send to CWF-220 (Script Debate)
  ↓
CWF-220: Script Debate (generates critiques)
  ↓
CWF-230: Script Refinement (fixes issues)
  ↓
Script quality now: 0.88
  ↓
Script Director check: ✓ PASS
  ↓
Continue to WF-020 (Approval)
```

---
