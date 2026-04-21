# M-002 Context Analyzer
**A Shadow Empire Skill File**

---

## 1. SKILL IDENTITY
| Field | Value |
|-------|-------|
| **Skill ID** | M-002 |
| **Name** | Context Analyzer |
| **Archetype** | Intent Decomposition & Domain Classification |
| **Director Owner** | Vyasa |
| **Council** | Supreme Vision Council |
| **Vein Home** | meta.db, routing.db |
| **Execution Class** | synchronous/local |
| **Cost Tier** | FREE (kernel-layer) |

---

## 2. PURPOSE
**High-level mission**: Deconstruct raw creator intent into decomposed context domains (tone, scope, audience, constraints, format, emotional stance, platform suitability).

Context Analyzer accepts task_envelope from M-001 and extracts **structural understanding** of what the creator is asking for, beyond just the surface text.

It outputs:
- Intent domains (narrative, technical, entertainment, educational, etc.)
- Audience classification (demographic, psychographic, engagement level)
- Tone detection (formal, casual, urgent, creative, etc.)
- Format hints (short-form, long-form, episodic, series, standalone)
- Constraint extraction (platform, duration, budget, legal, content boundaries)

**Why it matters**: All downstream routing (which workflow pack, which director, which skills) depends on accurate context understanding, not raw text parsing.

---

## 3. DOMAIN & CATEGORY
| Dimension | Classification |
|-----------|-----------------|
| **Domain** | Research & Intelligence |
| **Subdomain** | Intent Decomposition |
| **Neuronal Layer** | N0-N1 (Intent → Governance-legal) |
| **Vein Class** | Context Engine |
| **Governance Depth** | Kernel-layer (high oversight) |

---

## 4. PRODUCER / CONSUMER VEIN CONTRACTS

### Reads From (Inputs)
| Vein | Field | Why | Format |
|------|-------|-----|--------|
| **meta.db** | task_envelope | Full normalized intent from M-001 | JSON |
| **external** | intent_text | Raw creator input | string |

### Writes To (Outputs)
| Vein | Field | Why | Format |
|--------|-------|-----|--------|
| **meta.db** | context_domains | Extracted intent domains | JSON object |
| **routing.db** | intent_classification_refined | Refined route hint | string enum |
| **audit.db** | context_event | Append-only context analysis record | JSON with timestamp |

### Context Domains Schema (core output)
```json
{
  "intent_domains": {
    "primary": "content_production",
    "secondary": ["educational", "entertainment"],
    "emotional_stance": "urgent_inspirational"
  },
  "audience": {
    "primary_segment": "tech_professionals",
    "demographic": "25-45, high_income",
    "psychographic": "innovation_adopters",
    "engagement_level": "high_attention"
  },
  "tone": {
    "primary": "conversational",
    "secondary": ["authoritative", "approachable"],
    "formality_level": 0.6
  },
  "format_hints": {
    "preferred_format": "short_video",
    "alternatives": ["thread", "blog"],
    "episode_structure": "standalone",
    "duration_estimate_minutes": 5
  },
  "constraints": {
    "platform_priority": ["youtube", "twitter"],
    "platform_forbidden": [],
    "content_boundaries": ["no_explicit", "no_misinformation"],
    "budget_tier": "standard",
    "legal_review_required": false
  },
  "routing_confidence": 0.88,
  "analysis_timestamp": "2026-04-21T10:35:00Z"
}
```

---

## 5. UPSTREAM DEPENDENCIES
| Upstream Skill | Reason | Dependency Met |
|----------------|--------|-----------------|
| **M-001 Intent Cortex** | Receives normalized task_envelope from M-001 | M-001 must complete successfully |
| **M-180 Clarification Agent** | If M-001 marked needs_clarification, may route there first | Optional, context-aware |

---

## 6. DOWNSTREAM CHAIN
| Downstream Skill | Reason | Handoff Envelope |
|------------------|--------|------------------|
| **M-003 Strategy Router** | Routes task to appropriate workflow pack (WF-100, WF-200, WF-300 etc.) based on intent domains | context_domains → strategy routing decision |
| **M-030 Governance Council** | If intent violates policy or triggers high-risk flags | escalation packet |

---

## 7. QUALITY GATE CRITERIA
**Before emitting context_domains:**

| Gate | Criterion | Action on Fail | Owner |
|------|-----------|----------------|-------|
| **Intent Completeness** | Extracted at least 3 domains from intent | Escalate to Clarification Agent | M-002 |
| **Audience Clarity** | Can classify audience with ≥ 0.7 confidence | Mark low_confidence, continue | M-002 |
| **Tone Consistency** | Primary + secondary tone coherent (not contradictory) | Warn + flag for review | M-002 |
| **Format Viability** | Proposed format is executable on declared platforms | Adjust format or escalate | M-002 |
| **Constraint Legality** | No contradictions between budget + legal + platform constraints | Escalate to Yama | Yama (veto) |

**Acceptance Criteria**: context_domains emitted with routing_confidence ≥ 0.75.

---

## 8. EXECUTION LOGIC

### Algorithm (Pseudocode)
```python
def context_analyzer(task_envelope: dict) -> dict:
    """
    Decompose intent into structured context domains.
    
    Inputs:
      - task_envelope: from M-001 (intent, constraints, metadata)
    
    Returns:
      - context_domains: structured JSON with domains, audience, tone, format, constraints
    """
    
    intent_text = task_envelope.get("intent", "")
    constraints = task_envelope.get("constraints", {})
    
    # Step 1: Intent domain extraction
    domains = extract_intent_domains(intent_text)
    
    # Step 2: Audience classification
    audience = classify_audience(intent_text, domains)
    
    # Step 3: Tone detection
    tone = detect_tone(intent_text)
    
    # Step 4: Format inference
    format_hints = infer_format(domains, audience, tone)
    
    # Step 5: Constraint merging (from intent + pre-declared)
    all_constraints = {
        **constraints,
        **extract_constraints_from_intent(intent_text)
    }
    
    # Step 6: Validate constraint legality
    legality_check = validate_constraints(all_constraints)
    if not legality_check["valid"]:
        escalate_to_yama(legality_check["violations"])
    
    # Step 7: Calculate routing confidence
    confidence = calculate_confidence(
        domains, audience, tone, format_hints, all_constraints
    )
    
    # Step 8: Build context_domains
    context_domains = {
        "intent_domains": domains,
        "audience": audience,
        "tone": tone,
        "format_hints": format_hints,
        "constraints": all_constraints,
        "routing_confidence": confidence,
        "analysis_timestamp": now_iso8601()
    }
    
    # Step 9: Emit to veins
    write_to_vein("meta.db", "context_domains", context_domains)
    write_to_vein("routing.db", "intent_classification_refined", domains["primary"])
    write_to_vein("audit.db", {
        "event_type": "context_analysis",
        "task_id": task_envelope.get("task_id"),
        "confidence": confidence,
        "timestamp": now_iso8601()
    })
    
    return context_domains
```

### Claude-Executor Invocation
```yaml
skill_executor:
  provider: claude
  model: claude-opus-4
  system_prompt: |
    You are Context Analyzer (M-002), the decomposition engine for creator intent.
    Your job: take raw intent + constraints, extract structural understanding.
    
    Always respond with JSON matching the context_domains schema.
    Be conservative in confidence scores; flag ambiguities.
  
  input_schema:
    type: object
    properties:
      intent_text:
        type: string
      constraints:
        type: object
  
  output_schema:
    $ref: schemas/context_domains.schema.json
  
  fallback_on_error:
    target_skill: M-180
    reason: "If context analysis fails, escalate to clarification"
```

---

## 9. GOVERNANCE & VETO POINTS

### Yama Policy Locks (Non-Overridable)
| Policy | Lock Type | Reason | Enforcement |
|--------|-----------|--------|------------|
| **Constraint Contradiction Detection** | HARD | If intent + constraints conflict (e.g., "10-min video" but platform only allows 60s), escalate | Yama rejects execution, escalates to human |
| **Platform Suitability Validation** | SOFT | If format not viable on chosen platform, warn but continue with fallback | Yama may warn or suggest alternative |
| **Audience Safety** | HARD | If audience classification involves minors + high-risk content, escalate | Yama blocks, escalates to policy review |

### Kubera Cost Gate (Budget-Aware)
| Cost Point | Tier | Budget Impact | Gate Action |
|-----------|------|--------------|------------|
| **Context Analysis** | FREE | 0 tokens | Always allowed (kernel-layer free) |
| **Advanced NLP** | FREE (local) or PAID (cloud) | 0-5 tokens | Use local if Vayu allows; cloud fallback available |

### Krishna Arbitration Points (Conflict Resolution)
| Conflict Scenario | Arbitration Rule | Owner |
|-------------------|------------------|-------|
| **Tone contradiction** (intent says "professional" but uses slang) | Flag + ask M-180 for clarification | Krishna |
| **Audience mismatch** (intent for "kids" but platform only allows 18+) | Escalate to Yama | Krishna |

---

## 10. ESCALATION PATHS

### Normal Escalation
| Scenario | Escalate To | Action |
|----------|------------|--------|
| **Intent domains < 0.75 confidence** | M-180 Clarification Agent | Request clarification, loop back |
| **Constraint contradiction detected** | Yama Policy Gate | Policy review, escalate to human |
| **Audience classification ambiguous** | Krishna Arbitration | Conflict resolution, binding decision |

### Emergency Escalation
| Scenario | Escalate To | Action |
|----------|------------|--------|
| **Intent text is malformed** | WF-900 Error Handler | Syntax error, return to user |
| **Domain extraction fails completely** | WF-900 Error Handler | System fallback |

---

## 11. TOOL & RUNTIME USAGE

### Allowed Tools
| Tool | Why | Sandbox | Secrets Scope |
|------|-----|---------|--------------|
| **NLP Library** (spacy, NLTK, or Claude) | Intent domain extraction | Low-sandbox (local) | none |
| **Config reads** | Load audience/tone classifiers | Read-only sandbox | none |
| **Vein writers** (meta.db, routing.db, audit.db) | Emit context_domains | Scoped sandbox (only 3 veins) | none |
| **Timestamp/UUID** | Audit trail, traceability | No sandbox (deterministic) | none |

### Forbidden Tools
- **No external API calls** (keep local)
- **No heavy ML models** (use lighter NLP)
- **No secrets access**
- **No file writes** (except vein writers)

---

## 12. TEST REFERENCES & ACCEPTANCE CRITERIA

### Test File Locations
- `tests/skills/M-002-context-analyzer.test.py` — Unit tests
- `tests/integration/wf001-m002-context.test.py` — Integration test with M-001 → M-002

### Unit Test Cases
1. **Valid professional intent**: "Make an informative video about machine learning for enterprise leaders"
   - Expected: domains include ["technical", "professional", "educational"], audience = "enterprise_leaders", confidence ≥ 0.9
   
2. **Casual intent with tone**: "make something fun and viral about trending AI memes"
   - Expected: domains include ["entertainment", "social"], tone = ["casual", "humorous"], confidence ≥ 0.85
   
3. **Conflicting constraints**: "make a 10-minute YouTube short"
   - Expected: constraint contradiction flagged, escalated to Yama
   
4. **Ambiguous audience**: "make a video"
   - Expected: confidence < 0.75, M-180 clarification requested
   
5. **High-risk content**: "make content for 8-year-olds about... [restricted topic]"
   - Expected: Escalated to Yama safety review

### Acceptance Criteria (Pre-Deployment)
✅ All 5 unit test cases pass  
✅ context_domains schema validated  
✅ Vein writes are idempotent  
✅ Audit trail events appended (never mutated)  
✅ Latency: analysis < 1000ms (local Claude or NLP)  
✅ Confidence scoring is honest (no inflated scores)

---

## 13. COST PROFILE

### Execution Cost by Tier
| Tier | Cost (tokens) | Latency | Hardware | Notes |
|------|---------------|---------|----------|-------|
| **Local (NLP)** | 0 | < 1000ms | CPU only | spacy/NLTK, pure local |
| **Local (Claude)** | 2–5 | < 2000ms | CPU only | Claude inference, good quality |
| **Hybrid** | 5–10 | < 3000ms | CPU + cloud optional | Cloud fallback if local fails |
| **Cloud** | 10–15 | < 2000ms | Cloud | Full cloud NLP, faster but costlier |
| **Untrusted Local** | 0 | < 1000ms | Browser JS sandbox | Read-only mode |

**Budget Impact**: FREE or low-cost (2–5 tokens). Does not consume creator's monthly token budget.

---

## 14. HARDWARE REQUIREMENTS & FALLBACK

### Hardware Class Support
| Class | Supported | Constraints | Fallback |
|-------|-----------|-------------|----------|
| **WIN_STD_8G** | ✅ Yes | NLP models < 500MB | Use lightweight classifier |
| **WIN_MID_16G** | ✅ Yes | Full NLP support | No fallback needed |
| **WIN_PRO_32G** | ✅ Yes | Full NLP + optional cloud | No fallback needed |
| **MAC_INTEL_16G** | ✅ Yes | Same as WIN_MID_16G | No fallback needed |
| **MAC_AS_M4** | ✅ Yes | Full support | No fallback needed |
| **UNTRUSTED_LOCAL** | ✅ Yes | Read-only mode; no vein writes | Cache-only, no persistence |

### Degradation Rules
- **Low RAM** (< 8GB): Use lightweight classifier, no transformers
- **Slow NLP**: Fall back to regex-based domain detection
- **Offline mode**: Use pre-trained models cached locally

---

## 15. BEST PRACTICES & OPERATIONAL NOTES

### For Builder/Operator
- **Keep confidence honest**: Don't over-score ambiguous intents
- **Escalate early**: If < 0.75 confidence, immediately send to M-180
- **Log everything**: Every context analysis should produce audit event
- **Reuse classifiers**: Cache NLP models to avoid reloading

### For Creator/Founder
- **Be specific about audience**: Narrower = higher confidence
- **Name your constraints**: Platform, duration, budget → better routing
- **Use examples**: "Like [popular video]" helps context extraction

### For Claude (if M-002 runs as Claude executor)
- Extract domains conservatively (list what's explicitly mentioned, not guessed)
- Flag ambiguities clearly (mark confidence accurately)
- Always output JSON (no prose in core path)
- Validate constraints against each other

---

## 16. VERSION & METADATA

| Field | Value |
|-------|-------|
| **Skill Version** | 1.0.0 |
| **Created** | 2026-04-21 |
| **Last Updated** | 2026-04-21 |
| **Status** | DRAFT (pending Vyasa + governance council) |
| **Author** | Shadow Empire Builder (Claude) |
| **Related Docs** | PRD v34 § Context Analysis, § Intent Decomposition |

---

## 17. RELATED SKILLS & CROSS-REFERENCES

- **Upstream**: M-001 (Intent Cortex)
- **Downstream**: M-003 (Strategy Router), M-030 (Governance Council)
- **Escalation Partners**: M-180 (Clarification Agent), Yama (Policy Gate), Krishna (Arbitration)
- **Vein Partners**: meta.db, routing.db, audit.db
- **Director**: Vyasa (Supreme Vision Council)

---

**END OF M-002 SKILL DEFINITION**
