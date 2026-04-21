# M-001 Intent Cortex
**A Shadow Empire Skill File**

---

## 1. SKILL IDENTITY
| Field | Value |
|-------|-------|
| **Skill ID** | M-001 |
| **Name** | Intent Cortex |
| **Archetype** | Upstream Intake & Normalization |
| **Director Owner** | Brahma |
| **Council** | Supreme Vision Council |
| **Vein Home** | meta.db, routing.db |
| **Execution Class** | synchronous/local |
| **Cost Tier** | FREE (kernel-layer) |

---

## 2. PURPOSE
**High-level mission**: Normalize raw creator/founder input into a structured task envelope that the rest of Shadow Empire can route and execute lawfully.

Intent Cortex is the first-touch layer. It accepts:
- Creator command (intent string: "make a video about AI safety")
- Founder override request (with authorization token)
- Builder CLI input (direct workflow request)
- System diagnostic signal (from health checks)

It outputs:
- Normalized task envelope with intent, mode, constraints, metadata
- Route intent (which workflow pack should handle this?)
- Creator/Founder context binding (who is running this?)

**Why it matters**: All downstream governance (Kubera cost gates, Yama policy checks) depends on intent being normalized, not ad-hoc prose.

---

## 3. DOMAIN & CATEGORY
| Dimension | Classification |
|-----------|-----------------|
| **Domain** | Research & Intelligence |
| **Subdomain** | Intent Intake & Normalization |
| **Neuronal Layer** | N0 (Intent Layer) |
| **Vein Class** | Cortex / Entry Point |
| **Governance Depth** | Kernel-layer (high oversight) |

---

## 4. PRODUCER / CONSUMER VEIN CONTRACTS

### Reads From (Inputs)
| Vein | Field | Why | Format |
|------|-------|-----|--------|
| **meta.db** | creator_id, founder_id, mode_active, route_context (if re-entry) | Identity context for audit & governance | string/UUID |
| **external** | raw_user_input, command_string | Creator/founder intent | string (max 5000 chars) |
| **external** | authorization_token (if founder override) | Verify override legality | JWT or similar |

### Writes To (Outputs)
| Vein | Field | Why | Format |
|--------|-------|-----|--------|
| **meta.db** | task_envelope | Normalized intent + intent type + constraints | JSON (see schema below) |
| **routing.db** | intent_classification | Which lane (Fast/Standard/Tribunal/Premium)? | string enum |
| **audit.db** | intake_event | Append-only intake record | JSON with timestamp + provenance |

### Task Envelope Schema (core output)
```json
{
  "task_id": "TASK-2026-0001",
  "creator_id": "CREATOR-001",
  "founder_id": null,
  "mode": "creator",
  "intent": "make a video about AI safety with retention focus",
  "intent_type": "content_production",
  "constraints": {
    "duration_minutes": null,
    "platform": ["youtube"],
    "target_audience": ["tech-aware"],
    "budget_tier": "standard",
    "urgency": "normal"
  },
  "metadata": {
    "input_source": "web_form",
    "raw_input": "...",
    "parsing_confidence": 0.95,
    "clarification_needed": false,
    "timestamp": "2026-04-21T10:30:00Z"
  },
  "routing_hints": {
    "suggested_pack": "WF-100",
    "suggested_route": "ROUTE_PHASE1_STANDARD",
    "suggested_lane": "Standard"
  }
}
```

---

## 5. UPSTREAM DEPENDENCIES
| Upstream Skill | Reason | How Dependency Met |
|----------------|--------|-------------------|
| **NONE** | M-001 is first-touch; no skill upstream | N/A (entry point) |
| **System Health** | Should not accept input if system is unhealthy | WF-000 must complete successfully before WF-001 |

---

## 6. DOWNSTREAM CHAIN
| Downstream Skill | Reason | Handoff Envelope |
|------------------|--------|------------------|
| **M-002 Context Analyzer** | Deconstruct intent into context domains (tone, scope, audience, constraints) | task_envelope → context analysis request |
| **Escalation: M-180 Clarification Agent** | If intent is ambiguous (< 0.85 confidence), clarify before proceeding | clarification_request packet |

---

## 7. QUALITY GATE CRITERIA
**Before emitting task_envelope:**

| Gate | Criterion | Action on Fail | Owner |
|------|-----------|----------------|-------|
| **Syntax Gate** | Intent string is valid UTF-8, non-empty, < 5000 chars | Reject + return error message | M-001 |
| **Sanity Check** | Intent matches known task types (content, research, admin, diagnostic) | Route to Clarification Agent (M-180) or reject | M-001 |
| **Authorization Gate** | If founder_override flag set, JWT is valid and authorized | Reject + audit event, escalate to Yama | Yama (veto) |
| **Creator Context** | creator_id exists in auth store | Reject + auth error | M-001 |

**Acceptance Criteria**: All gates pass, task_envelope emitted with parsing_confidence ≥ 0.85.

---

## 8. EXECUTION LOGIC

### Algorithm (Pseudocode)
```python
def intent_cortex(raw_input: str, creator_id: str, founder_override: bool = False) -> TaskEnvelope:
    """
    Normalize creator/founder input into executable task envelope.
    
    Inputs:
      - raw_input: string intent (e.g., "make a video about AI safety")
      - creator_id: authenticated creator UUID
      - founder_override: bool, if true verify against authorization store
    
    Returns:
      - TaskEnvelope: structured JSON with intent, constraints, routing hints
    """
    
    # Step 1: Syntax check
    if not raw_input or len(raw_input) > 5000 or not is_utf8(raw_input):
        raise ValueError("Intent syntax invalid")
    
    # Step 2: Creator auth check
    creator = fetch_creator_from_store(creator_id)
    if not creator:
        raise PermissionError(f"Creator {creator_id} not found")
    
    # Step 3: If founder override, validate JWT
    if founder_override:
        token = extract_token_from_context()
        if not is_valid_founder_jwt(token):
            escalate_to_yama("unauthorized_founder_override", creator_id, token)
            raise PermissionError("Invalid founder authorization")
        mode = "founder"
    else:
        mode = creator.get("default_mode", "creator")
    
    # Step 4: Parse intent into components
    components = parse_intent(raw_input)
    confidence = components["confidence_score"]  # 0.0 to 1.0
    
    # Step 5: Extract constraints from intent or defaults
    constraints = extract_constraints(components, creator.get("constraints", {}))
    
    # Step 6: If confidence low, suggest clarification
    if confidence < 0.85:
        return {
            "task_id": generate_task_id(),
            "creator_id": creator_id,
            "mode": mode,
            "status": "awaiting_clarification",
            "needs_clarification": True,
            "clarification_request": {
                "ambiguity": components.get("ambiguity", "intent type unclear"),
                "clarify_questions": components.get("clarify_questions", [])
            }
        }
    
    # Step 7: Build task envelope
    task_envelope = {
        "task_id": generate_task_id(),
        "creator_id": creator_id,
        "founder_id": None if mode == "creator" else creator_id,  # founder override case
        "mode": mode,
        "intent": raw_input,
        "intent_type": components["intent_type"],
        "constraints": constraints,
        "metadata": {
            "input_source": "web_form",
            "raw_input": raw_input,
            "parsing_confidence": confidence,
            "clarification_needed": False,
            "timestamp": now_iso8601()
        },
        "routing_hints": {
            "suggested_pack": route_intent_to_pack(components),
            "suggested_route": route_intent_to_route(mode, constraints),
            "suggested_lane": route_intent_to_lane(mode)
        }
    }
    
    # Step 8: Emit to veins
    write_to_vein("meta.db", "task_envelope", task_envelope)
    write_to_vein("routing.db", "intent_classification", task_envelope["intent_type"])
    write_to_vein("audit.db", {
        "event_type": "intent_intake",
        "task_id": task_envelope["task_id"],
        "creator_id": creator_id,
        "mode": mode,
        "confidence": confidence,
        "timestamp": now_iso8601()
    })
    
    # Step 9: Return task envelope
    return task_envelope
```

### Claude-Executor Invocation (if using Claude as the execution engine)
```yaml
skill_executor:
  provider: claude
  model: claude-opus-4
  system_prompt: |
    You are Intent Cortex, the first-touch skill in Shadow Empire.
    Your job: normalize creator/founder raw input into a structured task envelope.
    
    Always respond with JSON matching the TaskEnvelope schema.
    Use strict validation; if intent is ambiguous, set needs_clarification=true.
  
  input_schema:
    type: object
    properties:
      raw_input:
        type: string
        description: Creator intent string
      creator_id:
        type: string
      founder_override:
        type: boolean
  
  output_schema:
    $ref: schemas/task_envelope.schema.json
  
  fallback_on_error:
    target_skill: M-180  # Clarification Agent
    reason: "If Claude fails to parse, escalate to clarification"
```

---

## 9. GOVERNANCE & VETO POINTS

### Yama Policy Locks (Non-Overridable)
| Policy | Lock Type | Reason | Enforcement |
|--------|-----------|--------|------------|
| **Founder Override Verification** | HARD | Only authorized founders can claim override | Yama verifies JWT, no bypass |
| **Creator Consent** | HARD | Intent must come from authenticated creator (no spoofing) | Yama checks creator_id against auth store, no bypass |
| **PII Filtering** | SOFT | If intent mentions PII (SSN, credit card), warn and redact | Yama may warn or escalate, but intent proceeds |

### Kubera Cost Gate (Budget-Aware)
| Cost Point | Tier | Budget Impact | Gate Action |
|-----------|------|--------------|------------|
| **Intent Intake** | FREE | 0 tokens | Always allowed (kernel-layer free) |
| **Clarification Needed** | FREE | 0 tokens | No cost to request clarification |

**Note**: M-001 does not consume budget. Cost gates are downstream (M-002 onwards may trigger researcher or cloud calls).

### Krishna Arbitration Points (Conflict Resolution)
| Conflict Scenario | Arbitration Rule | Owner |
|-------------------|------------------|-------|
| **Founder override + Creator safety policy conflict** | Founder can override; escalate to Tribunal for audit | Krishna + Yama |
| **Intent contradicts creator's allowed routes** | Reject intent, suggest alternative route | Krishna |

---

## 10. ESCALATION PATHS

### Normal Escalation
| Scenario | Escalate To | Action |
|----------|------------|--------|
| **Intent parsing confidence < 0.85** | M-180 Clarification Agent | Request clarification questions, loop back |
| **Invalid creator_id** | M-030 Governance Council | Auth failure event, audit & reject |
| **Unauthorized founder override** | Yama Policy Gate | Audit event, escalate to founder/security |

### Emergency Escalation
| Scenario | Escalate To | Action |
|----------|------------|--------|
| **Malformed input (not UTF-8)** | WF-900 Error Handler | Syntax error event, return to user |
| **Creator auth store unreachable** | WF-900 Error Handler | System failure, fallback to safe state |

---

## 11. TOOL & RUNTIME USAGE

### Allowed Tools
| Tool | Why | Sandbox | Secrets Scope |
|------|-----|---------|--------------|
| **Authentication API** | Verify creator_id, founder JWT | Low-sandbox (internal) | creator auth token |
| **Config/Registry reads** | Load creator constraints, default routes | Read-only sandbox | none |
| **Vein writers** (meta.db, routing.db, audit.db) | Emit task envelope | Scoped sandbox (only 3 veins) | none |
| **UUID Generator** | Create task_id | No sandbox (deterministic) | none |
| **ISO8601 Timestamp** | Audit trail timestamps | No sandbox (clock call) | none |

### Forbidden Tools
- **No external API calls** (keep local)
- **No file writes** (except vein writers)
- **No secrets access** (creator passwords, API keys stored elsewhere)
- **No heavy computation** (intent parsing is lightweight NLP/regex)

---

## 12. TEST REFERENCES & ACCEPTANCE CRITERIA

### Test File Locations
- `tests/skills/M-001-intent-cortex.test.py` — Unit tests
- `tests/integration/wf001-intake-m001.test.py` — Integration test with WF-001

### Unit Test Cases
1. **Valid creator input**: "make a 10-min video about AI safety"
   - Expected: task_envelope emitted with confidence ≥ 0.95
   
2. **Ambiguous input**: "make something"
   - Expected: status="awaiting_clarification", confidence < 0.85
   
3. **Founder override with valid JWT**: creator_input + founder_override=true + valid JWT
   - Expected: task_envelope with mode="founder", audit event logged
   
4. **Invalid creator_id**:
   - Expected: PermissionError raised, escalated to WF-900
   
5. **Malformed input** (non-UTF-8 bytes):
   - Expected: ValueError raised, escalated to WF-900
   
6. **Founder override with invalid JWT**:
   - Expected: PermissionError + escalation to Yama + audit event

### Acceptance Criteria (Pre-Deployment)
✅ All 6 unit test cases pass  
✅ task_envelope schema validated (matches `schemas/task_envelope.schema.json`)  
✅ Vein writes are idempotent (same input → same vein write)  
✅ Audit trail events are appended (never mutated/deleted)  
✅ Latency: intent parsing < 500ms (local only)  
✅ Zero external API dependencies (except auth store reads)

---

## 13. COST PROFILE

### Execution Cost by Tier
| Tier | Cost (tokens) | Latency | Hardware | Notes |
|------|---------------|---------|----------|-------|
| **Local (WIN/MAC 8GB+)** | 0 | < 500ms | CPU only | Pure local regex/NLP, no offload |
| **Hybrid** | 0 | < 500ms | CPU only | Cost-free even in hybrid mode |
| **Cloud** | 0 | < 500ms | Cloud CPU | No reason to run in cloud; keep local |
| **Untrusted Local** | 0 | < 500ms | Browser JS sandbox | Full read-only support |

**Budget Impact**: FREE (kernel-layer). Does not consume creator's monthly token budget.

---

## 14. HARDWARE REQUIREMENTS & FALLBACK

### Hardware Class Support
| Class | Supported | Constraints | Fallback |
|-------|-----------|-------------|----------|
| **WIN_STD_8G** | ✅ Yes | Single intent at a time; no parallel intents | None needed (runs locally) |
| **WIN_MID_16G** | ✅ Yes | Parallel intent intake allowed | None needed (runs locally) |
| **WIN_PRO_32G** | ✅ Yes | Parallel intent intake + pre-parsing allowed | None needed (runs locally) |
| **MAC_INTEL_16G** | ✅ Yes | Same as WIN_MID_16G | None needed (runs locally) |
| **MAC_AS_M4** | ✅ Yes | Full support, Metal acceleration not needed | None needed (runs locally) |
| **UNTRUSTED_LOCAL** | ✅ Yes | Read-only mode; no write to audit.db | Fallback to read-only vein view |

### Degradation Rules
- **Low RAM scenario** (< 4GB): Still works, but disable parallel intent parsing
- **Network latency** (if auth store remote): Retry 3x with exponential backoff
- **Offline mode** (untrusted): Cache last-known creator list, work read-only

---

## 15. BEST PRACTICES & OPERATIONAL NOTES

### For Builder/Operator
- **Keep this skill fast**: Don't add heavy ML models; use regex + pattern matching
- **Fallback early**: If parsing fails, escalate to M-180 immediately (don't guess)
- **Audit always**: Every intent intake should log an audit event, even on error
- **Re-entrancy safe**: M-001 can be called multiple times for the same task (idempotent); task_id generation is deterministic based on input hash

### For Creator/Founder
- **Be explicit**: Longer, clearer intents parse with higher confidence
- **Use templates**: ("make a video about [topic] with [tone] for [audience]") → higher confidence
- **Clarification is quick**: If M-001 asks for clarification, answer quickly to keep momentum

### For Claude (if M-001 runs as Claude executor)
- Normalize intent into canonical form (no slang, full sentences)
- Extract constraints conservatively (if not mentioned, don't guess)
- Flag ambiguities clearly (return needs_clarification=true + list of clarify_questions)
- Always output JSON (no prose explanations in the core path)

---

## 16. VERSION & METADATA

| Field | Value |
|-------|-------|
| **Skill Version** | 1.0.0 |
| **Created** | 2026-04-21 |
| **Last Updated** | 2026-04-21 |
| **Status** | DRAFT (pending approval) |
| **Author** | Shadow Empire Builder (Claude) |
| **Approved By** | (pending Brahma + governance council) |
| **Related Docs** | PRD v34 § Intent Cortex, § Kernel Spine, § Neural Layers |

---

## 17. RELATED SKILLS & CROSS-REFERENCES

- **Upstream**: None (first-touch)
- **Downstream**: M-002 (Context Analyzer), M-180 (Clarification Agent)
- **Escalation Partners**: M-030 (Governance Council), Yama (Policy Gate), WF-900 (Error Handler)
- **Vein Partners**: meta.db writer, routing.db writer, audit.db writer
- **Director**: Brahma (Supreme Vision Council)

---

**END OF M-001 SKILL DEFINITION**
