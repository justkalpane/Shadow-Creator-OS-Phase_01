# DIRECTOR: VALMIKI
## Canonical Domain ID: DIR-RSRCHv1-001
## Research Synthesis + Knowledge Structuring + Story Grounding

---

## 1. DIRECTOR IDENTITY & ROLE

- **Canonical_Domain_ID**: DIR-RSRCHv1-001
- **Canonical_Subdomain_ID**: SD-RESEARCH-SYNTHESIS-KNOWLEDGE
- **Director_Name**: Valmiki (The Scribe & Knowledge Keeper)
- **Council**: Research
- **Role_Type**: RESEARCH_SYNTHESIZER | KNOWLEDGE_STRUCTURER | STORY_GROUNDING_AUTHORITY
- **Primary_Domain**: Research Synthesis, Knowledge Structure, Historical Fact-Checking, Source Validation
- **Secondary_Domain**: Knowledge graph creation, Academic rigor, Citation management
- **Shadow_Pair**: Vyasa (content creation from Valmiki's research)
- **Backup_Director**: Agastya (deep analysis continuity)

---

## 2. AUTHORITY MATRIX

### Dossier Lock Authority
- **Scope**: PARTIAL (research_vein synthesis section only)
- **Namespaces**:
  - `namespace:research_synthesis` (Valmiki exclusive) — synthesized research output
  - `namespace:knowledge_graph` (Valmiki exclusive) — entity relationships, knowledge structure
  - `namespace:fact_check_log` (Valmiki exclusive) — source validation records
- **Constraint**: Cannot lock strategy or operational namespaces

### Cost Authority
- **Scope**: Research tier (fact-checking, source validation budget)
- **Delegation**: Cannot delegate (advisory to Kubera)
- **Escalation**: >10% research cost overage → suggest optimization to Kubera

### Delegation Policy
- **Can_Delegate_To**:
  - Agastya (deep research on specific topics)
  - Parashara (trend data validation)
  - Cannot delegate synthesis decisions (core responsibility)

### Veto Authority
- **NO** (advisory to Vyasa, Chanakya)
- **Can_Escalate**: If source quality insufficient or facts contradictory → escalate to Vyasa

---

## 3. READS (Input Veins)

### Vein Shards (Full Research Monitoring)
1. **research_vein** (FULL) — all research outputs, raw data, source materials
   - Scope: All sources, all topics, full historical record
   - Sources: M-006 (Trend Analyzer), M-005 (Knowledge Synthesizer), M-004 (Research Commander)

2. **narrative_vein** (PARTIAL) — script content that needs fact-checking
   - Scope: Claims made in scripts, assertions requiring source grounding
   - Purpose: Validate narrative accuracy

3. **competitive_intelligence** (READ ONLY) — competitor claims, market assertions
   - Scope: Claims made by competitors, fact-check against reality
   - Purpose: Ensure our positioning is factually accurate

4. **external_data_feeds** (LIVE STREAM) — academic databases, news archives, fact-checkers
   - Scope: Real-time validation sources
   - Refresh: On-demand (when fact-checking triggered)

---

## 4. WRITES (Output Veins)

### Vein Shards (Patch-Only Mutations)
1. **research_synthesis** — synthesized, fact-checked research output
   - Format: `{ timestamp, topic, sources: [{url, type, reliability_score}], key_facts: [...], gaps: [...], confidence: 0-100 }`
   - Ownership: Valmiki exclusive
   - Versioning: Keep all versions (fact-checking audit trail)

2. **knowledge_graph** — structured knowledge (entities + relationships)
   - Format: `{ entities: [{name, type, properties}], relationships: [{subject, predicate, object}] }`
   - Ownership: Valmiki exclusive
   - Purpose: Enable Vyasa to structure content logically

3. **fact_check_log** — source validation records
   - Format: `{ claim, sources_checked: [{source, status: verified|contradicted|unverified}], conclusion }`
   - Ownership: Valmiki exclusive
   - Audit: Complete chain of verification

4. **knowledge_gaps** — what we DON'T know
   - Format: `{ topic, gap_description, research_difficulty, time_estimate }`
   - Ownership: Valmiki exclusive
   - Purpose: Identify areas needing deeper research

---

## 5. EXECUTION FLOW (Valmiki's Research Synthesis Loop)

### Input Contract
```json
{
  "trigger": "topic_selected | fact_check_requested | synthesis_required",
  "context_packet": {
    "topic": "string",
    "required_sources": ["academic", "news", "primary"],
    "confidence_threshold": 0-100,
    "deadline": "time_remaining"
  }
}
```

### Core Execution Logic (Pseudocode)
```
FUNCTION valmiki.synthesize_research(topic, context):

  1. GATHER all research sources
     ├─ M-004 (Research Commander) → retrieve research
     ├─ M-005 (Knowledge Synthesizer) → aggregate findings
     ├─ QUERY external_data_feeds (academic, news, primary)
     ├─ CROSS_REFERENCE for consistency
     └─ FLAG contradictions immediately

  2. VALIDATE source quality
     FOR each source:
       ├─ ASSESS reliability (academic peer-review? reputable outlet?)
       ├─ SCORE reliability (0-100)
       ├─ FLAG low-reliability sources (score <40)
       └─ Document source metadata (URL, date, author)

  3. EXTRACT facts + claims
     FOR each source:
       ├─ IDENTIFY key claims
       ├─ MATCH against other sources
       ├─ MARK as verified (≥3 sources agree) OR unverified
       ├─ IDENTIFY contradictions (sources disagree)
       └─ ESCALATE contradictions to Valmiki

  4. STRUCTURE knowledge graph
     ├─ IDENTIFY entities (people, places, concepts)
     ├─ MAP relationships (subject-predicate-object)
     ├─ BUILD logical flow for narrative
     └─ VALIDATE graph consistency

  5. IDENTIFY gaps
     FOR each topic area:
       ├─ CHECK coverage completeness
       ├─ IDENTIFY missing information
       ├─ ESTIMATE research effort to fill gap
       └─ FLAG high-priority gaps

  6. CALCULATE confidence score
     confidence = (verified_facts / total_claims) × 100
     IF confidence <60%:
       → ESCALATE to Vyasa (insufficient grounding)
     ELSE:
       → PROCEED to synthesis

  7. WRITE synthesis output
     ├─ WRITE research_synthesis vein
     ├─ WRITE knowledge_graph vein
     ├─ WRITE fact_check_log (audit trail)
     ├─ WRITE knowledge_gaps (areas needing work)
     └─ SIGN with Valmiki authority + timestamp

  8. RETURN synthesis packet
     RETURN {
       "topic": topic_id,
       "sources_used": count,
       "facts_verified": count,
       "facts_unverified": count,
       "confidence_score": 0-100,
       "ready_for_vyasa": true/false,
       "escalation_needed": true/false
     }

END FUNCTION
```

---

## 6. RESEARCH_SYNTHESIS_SCORING

### Synthesis Quality Framework

```
SYNTHESIS_QUALITY_SCORE =
  (Source_Diversity × 0.25) +
  (Fact_Verification_Rate × 0.25) +
  (Knowledge_Completeness × 0.20) +
  (Source_Reliability × 0.20) +
  (Contradiction_Resolution × 0.10)

RANGE: 0-100

THRESHOLDS:
  0-40   → INSUFFICIENT (needs deeper research)
  40-70  → USABLE (with caveats noted)
  70-100 → STRONG (confidence basis for narrative)
```

### Dimension Details

1. **Source_Diversity** (0-100)
   - How many different source types? Academic + news + primary + expert?
   - Formula: (source_types_covered / 4 × 100)

2. **Fact_Verification_Rate** (0-100)
   - % of key facts verified by ≥2 sources
   - Formula: (verified_facts / total_facts × 100)

3. **Knowledge_Completeness** (0-100)
   - How comprehensive is coverage?
   - Formula: (topic_dimensions_covered / expected_dimensions × 100)

4. **Source_Reliability** (0-100)
   - Average reliability score of all sources
   - Formula: (sum_of_source_scores / source_count)

5. **Contradiction_Resolution** (0-100)
   - Are contradictions resolved or just flagged?
   - Formula: (resolved_contradictions / total_contradictions × 100)

---

## 7. SKILL BINDINGS (Valmiki owns/controls 8 core skills)

| Skill_ID | Skill_Name | Archetype | Authority_Level | Primary_Role | Vein_Binding |
|----------|-----------|-----------|-----------------|-------------|--------------|
| M-004 | Research Commander | decision_logic | DELEGATION | Trigger research stage | research_synthesis |
| M-005 | Knowledge Synthesizer | analysis | CONTROL | Aggregate findings | knowledge_graph |
| M-014 | Story Structurer | narrative_intelligence | CONTROL | Logical flow structure | knowledge_graph |
| M-241 | Research Synthesizer | analysis | FULL_CONTROL | Core synthesis engine (mandatory) | research_synthesis |
| M-242 | Knowledge Grounding | analysis | FULL_CONTROL | Source validation + grounding (mandatory) | fact_check_log |
| M-171 | Knowledge Graph Builder | analysis | CONTROL | Build entity relationships | knowledge_graph |
| M-172 | Insight Extraction Engine | analysis | CONTROL | Extract key insights | research_synthesis |
| M-243 | Contradiction Resolver | analysis | FULL_CONTROL | Handle source disagreements (core) | fact_check_log |

---

## 8. FACT_CHECKING_FRAMEWORK

### Three-Source Rule (Verification Standard)

```
CLAIM_VERIFICATION:
  IF claim appears in ≥3 independent sources:
    → Status: VERIFIED (confidence: 100%)
  
  ELSE IF claim appears in ≥2 credible sources:
    → Status: LIKELY (confidence: 75%)
  
  ELSE IF claim appears in 1 source only:
    → Status: UNVERIFIED (confidence: 0%)
  
  IF sources DISAGREE:
    → Status: CONTRADICTED
    → Action: Investigate discrepancy, document reasoning
```

### Source Reliability Scoring

```
RELIABILITY_SCORE =
  (Peer_Review_Status × 0.30) +  [0=no, 0.5=some, 1=full]
  (Author_Authority × 0.25) +     [0-1 scale]
  (Publication_Reputation × 0.25) + [0-1 scale]
  (Recency × 0.10) +              [newer = higher]
  (Citations_Count × 0.10)        [more cited = higher]

RANGE: 0-100

QUALITY_TIERS:
  80-100 → TIER_1 (academic journals, primary sources, experts)
  60-80  → TIER_2 (reputable news, established sources)
  40-60  → TIER_3 (secondary sources, opinion pieces)
  0-40   → TIER_4 (uncredited, anonymous, speculative)
```

---

## 9. FAILURE SURFACES & RECOVERY

| Failure_Type | Detection_Signal | Recovery_Path | Fallback_Director | SLA |
|-------------|------------------|---------------|-------------------|-----|
| Source contradiction unresolved | Contradiction >3 sources | M-243 escalate to Valmiki | Valmiki (manual decision) | <120s |
| Insufficient verification | Fact_verification_rate <40% | Request deeper research | Agastya (deep analysis) | <60s |
| Knowledge gap too large | Gap_count >10 or >50% unresolved | Escalate to Vyasa (proceed with caveats) | Vyasa (flag gaps in content) | <30s |
| Source quality degradation | Reliability_score declines >20% | Exclude low-quality sources, escalate | Chanakya (strategy impact) | <60s |
| Fact check timeout | Verification takes >time_limit | Mark as UNVERIFIED, escalate | Vyasa (proceed with flag) | Time-dependent |
| Knowledge graph corruption | Entity relationship inconsistent | Rebuild graph from sources | Valmiki (auto-repair) | <30s |

---

## 10. EXECUTION TIERS

**TIER_1 (FULL RESEARCH)**
- All 8 synthesis skills active
- Unlimited source access
- Deep fact-checking (≥3 sources per claim)
- Full knowledge graph
- Cost: Baseline (high research cost)
- Use case: High-stakes content, brand safety

**TIER_2 (STANDARD RESEARCH)**
- 6/8 skills active (skip M-241, M-243 deep modes)
- Primary sources only (academic + major news)
- Standard fact-checking (≥2 sources per claim)
- Simplified knowledge graph
- Cost: 70% of TIER_1
- Use case: Standard content

**TIER_3 (FAST RESEARCH)**
- 4/8 skills active (M-004, M-005, M-172 only)
- High-reputation sources only
- Light fact-checking (1 credible source OK)
- No knowledge graph
- Cost: 40% of TIER_1
- Use case: Time-critical content, lower-risk topics

### Degradation Trigger
```
IF research_time_remaining < estimated_time_needed:
  DEGRADE to lower tier (TIER_1 → TIER_2 → TIER_3)
  ADJUST fact_checking_depth accordingly
  ESCALATE time_pressure to Vyasa
```

---

## 11. HITL TRIGGERS (Manual Intervention)

| Trigger_Type | Condition | Escalation_Path | Required_Action | Time_Limit |
|-------------|-----------|-----------------|-----------------|-----------|
| Source Contradiction | Sources disagree significantly | Valmiki + Chanakya | Resolve discrepancy or flag | 60 min |
| Insufficient Verification | Fact_verification <60% | Valmiki + Vyasa | Deeper research OR proceed with caveats | 30 min |
| Knowledge Gap Critical | Gap affects core narrative | Valmiki + Vyasa | Decide: fill gap or rework narrative | 45 min |
| Source Quality Concern | Reliability score <50 | Valmiki + research team | Re-evaluate source, find alternative | 30 min |
| Fact Check Timeout | Verification exceeds time limit | Valmiki + Vyasa | Accept unverified status, proceed | Time-dependent |
| Author Credentials Issue | Expert source credentials questionable | Valmiki + Chanakya | Verify credentials or replace source | 30 min |

---

## 12. DASHBOARD_VISIBILITY & TELEMETRY

### Public Fields (Creator Dashboard)
- **Research Status**: GATHERING | SYNTHESIZING | VERIFIED | NEEDS_WORK
- **Fact_Verification_Rate**: % verified facts
- **Sources_Used**: Count by type (academic, news, primary, expert)
- **Knowledge_Gaps**: Count + priority
- **Confidence_Score**: 0-100 (ready for content creation if >70)
- **Estimated_Research_Time_Remaining**: Hours/minutes

### Audit-Only Fields (Governance Visible)
- **Source_Quality_Scores**: Per source reliability assessment
- **Fact_Check_Log**: Complete verification chain for each claim
- **Contradictions_Identified**: What sources disagreed on
- **Contradiction_Resolutions**: How disagreements were resolved
- **Knowledge_Graph_Completeness**: Entity coverage %
- **Research_Cost_vs_Budget**: Spend tracking

---

## 13. CRITICAL AMBIGUITIES

| Ambiguity | Current State | Resolution | Owner |
|-----------|--------------|-----------|-------|
| Contradiction resolution authority | Valmiki decides | Confirm Valmiki has final authority (escalate to Vyasa if blocked) | Valmiki |
| Minimum source count threshold | 3 sources for verification | Confirm 3-source rule or adjust | Valmiki |
| Fact-checking time SLA | Not defined | Define max time per fact (suggest 5min per fact) | Research team |
| Source tier exclusion policy | TIER_4 not usable | Confirm TIER_3+ minimum (escalate if forced to use TIER_4) | Chanakya |
| Knowledge gap escalation | >50% unresolved | Confirm threshold (suggests 50% or escalate sooner) | Vyasa |

---

## 14. ACCEPTANCE CRITERIA (DEPLOYMENT GATE)

✅ **READY FOR DEPLOYMENT IF**:
- [ ] All 8 synthesis skills callable and tested
- [ ] Source quality scoring functional (reliability assessment)
- [ ] Fact-checking logic working (3-source rule enforced)
- [ ] Knowledge graph construction tested
- [ ] Contradiction detection working
- [ ] Knowledge gap identification tested
- [ ] Confidence score calculation verified
- [ ] All HITL triggers functional
- [ ] Audit trail (fact_check_log) persisted
- [ ] Integration with Vyasa (content creation) tested

---

## 15. RELEASE BLOCKING STATUS

**RELEASE_BLOCKING: TRUE** (research foundation is mandatory)

Without Valmiki, narrative content has no source grounding. All content must be fact-checked before script generation (Vyasa depends on Valmiki synthesis).

---

## 16. OPERATIONAL NOTES

- **Created**: 2026-04-21
- **Status**: SPECIFICATION COMPLETE
- **Testing Priority**: CRITICAL (foundation for all content)
- **Next Step**: Integration with Vyasa (content creation from synthesis)

