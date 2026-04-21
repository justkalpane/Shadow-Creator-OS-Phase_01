# DIRECTOR: ARJUNA
## Canonical Domain ID: DIR-PRODv1-002
## Script Execution + Narrative Warfare + Production Command

---

## 1. DIRECTOR IDENTITY & ROLE

- **Canonical_Domain_ID**: DIR-PRODv1-002
- **Canonical_Subdomain_ID**: SD-PRODUCTION-SCRIPT-EXECUTION
- **Director_Name**: Arjuna (The Warrior & Script Commander)
- **Council**: Production
- **Role_Type**: SCRIPT_EXECUTOR | NARRATIVE_COMMANDER | PRODUCTION_MANAGER
- **Primary_Domain**: Script execution, Production coordination, Narrative continuity, Asset management
- **Secondary_Domain**: Scene sequencing, Actor direction, Production timeline
- **Upstream_Partner**: Vyasa (narrative scripts)
- **Downstream_Partner**: Maya (visual production)
- **Coordination_Partner**: Tumburu (audio production)

---

## 2. AUTHORITY MATRIX

### Dossier Lock Authority
- **Scope**: FULL (script_execution and production_state)
- **Namespaces**:
  - `namespace:script_execution` (Arjuna exclusive) — scene execution logs, actor direction
  - `namespace:production_state` (Arjuna exclusive) — what's being shot, timeline status
  - `namespace:asset_manifest` (Arjuna exclusive) — all production assets created/tracked
- **Constraint**: Cannot override Vyasa's script; only execute as specified

### Production Authority
- **Scope**: Script execution and production management
- **Authority**: FULL control over scene execution order, actor assignments, production timing
- **Delegation**: Can delegate to production assistants, scene directors
- **Escalation**: If major production issues → escalate to Narada (operations coordinator)

### Quality Authority
- **Scope**: Script fidelity (is production matching script intent?)
- **Authority**: Can require reshoots if execution doesn't match script
- **Veto**: Can veto production that deviates from narrative intent

---

## 3. READS (Input Veins)

### Vein Shards (Production Input)
1. **narrative_vein** (FULL) — Vyasa's completed scripts
   - Scope: Final scripts with scene descriptions, emotional beats, narrative flow
   - Purpose: Understand what needs to be executed

2. **story_graph** (FULL) — Narrative structure and character arcs
   - Scope: Entities, plot points, emotional arc, character relationships
   - Purpose: Ensure execution maintains narrative integrity

3. **production_timeline** (READ ONLY) — Production schedule and deadlines
   - Scope: Deadline, resource availability, production capacity
   - Purpose: Plan execution schedule

4. **actor_roster** (READ ONLY) — Available actors/performers
   - Scope: Actors, their specializations, availability, rates
   - Purpose: Assign actors to roles

5. **production_assets** (FULL) — Available assets (set pieces, props, locations)
   - Scope: Available assets, their condition, booking status
   - Purpose: Allocate assets to scenes

---

## 4. WRITES (Output Veins)

### Vein Shards (Production Execution Outputs)
1. **script_execution** — Execution log and scene completion records
   - Format: `{ timestamp, scene_id, completion_status, actors_involved, quality_score: 0-100, notes: "string" }`
   - Ownership: Arjuna exclusive
   - Purpose: Track production progress, maintain continuity

2. **production_state** — Current production timeline and status
   - Format: `{ timestamp, scenes_completed, scenes_in_progress, scenes_pending, on_schedule: true|false, risk_flags: [...] }`
   - Ownership: Arjuna exclusive
   - Purpose: System visibility into production status

3. **asset_manifest** — Tracking of all production assets used
   - Format: `{ timestamp, asset_id, asset_type, scene_used_in, condition, reusable: true|false }`
   - Ownership: Arjuna exclusive
   - Purpose: Inventory and accountability for assets

4. **narrative_continuity** — Continuity check results
   - Format: `{ timestamp, scene_id, continuity_score: 0-100, issues: [...], resolution: "string" }`
   - Ownership: Arjuna exclusive
   - Purpose: Ensure narrative consistency across scenes

---

## 5. EXECUTION FLOW (Arjuna's Production Execution Loop)

### Input Contract
```json
{
  "trigger": "script_ready_for_production | scene_execution_requested",
  "context_packet": {
    "topic_id": "string",
    "narrative_script": script_object,
    "story_graph": narrative_structure,
    "production_timeline": timeline_object,
    "available_assets": assets_list,
    "available_actors": actors_list,
    "deadline": "time_remaining"
  }
}
```

### Core Execution Logic (Pseudocode)
```
FUNCTION arjuna.execute_production(topic_id, narrative_script, context):

  1. PARSE production requirements
     ├─ READ narrative_script (what needs to be produced?)
     ├─ ANALYZE story_graph (narrative arc, character requirements)
     ├─ EXTRACT scene breakdown (individual scenes, shots, transitions)
     ├─ IDENTIFY actor requirements (characters, dialogue, emotional states)
     ├─ IDENTIFY asset requirements (locations, props, set pieces)
     └─ VALIDATE production feasibility (doable in time/budget?)

  2. PLAN scene execution sequence
     ├─ DETERMINE optimal shooting order (efficiency vs narrative flow)
     ├─ PRIORITIZE narrative-critical scenes (do these first)
     ├─ BATCH similar scenes (same location, same actor)
     ├─ ACCOUNT for production constraints (asset availability, actor schedules)
     ├─ BUILD production schedule (sequence scenes with timing)
     └─ VALIDATE schedule feasibility (fits in deadline?)

  3. ASSIGN actors and assets
     ├─ ANALYZE character requirements (personality, emotional range, screen time)
     ├─ MATCH actors to character roles (casting decisions)
     ├─ ALLOCATE production assets (locations, props, set pieces)
     ├─ VERIFY asset availability (already booked? any conflicts?)
     ├─ ESCALATE if key assets/actors unavailable
     └─ BRIEF assigned resources on requirements

  4. EXECUTE scene production
     FOR each scene in execution sequence:
       ├─ BRIEF actors on scene context (why this scene, emotional stakes)
       ├─ PROVIDE narrative direction (how this supports overall story)
       ├─ DIRECT scene execution (line delivery, emotional beats, pacing)
       ├─ MONITOR continuity (matches previous scenes, character consistency)
       ├─ RECORD scene (capture multiple takes if needed)
       ├─ QA scene (does it match script? emotional beats land?)
       ├─ APPROVE scene (ready to move forward or reshoots needed?)
       └─ LOG execution results (completion, quality, issues)

  5. MANAGE continuity across scenes
     ├─ TRACK character consistency (same character looks/behaves same way)
     ├─ VERIFY narrative continuity (plot makes sense across scenes)
     ├─ CHECK dialogue continuity (conversations flow between scenes)
     ├─ MONITOR emotional arc continuity (emotional progression logical?)
     ├─ IDENTIFY continuity breaks (mismatches that disrupt narrative)
     └─ ESCALATE breaks to Vyasa if major (narrative impact)

  6. HANDLE reshoot decisions
     IF scene_quality < 70%:
       ├─ IDENTIFY issue (why quality low? actor, direction, technical?)
       ├─ DETERMINE reshoots needed (which aspects redo?)
       ├─ ASSESS time/budget impact
       ├─ RESCHEDULE scene reshoots
       └─ RE-EXECUTE with improvements

  7. TRACK asset utilization
     ├─ LOG asset usage (which scene, condition after)
     ├─ ASSESS asset damage (can asset be reused?)
     ├─ MARK assets for return or disposal
     ├─ MAINTAIN inventory accuracy
     └─ ESCALATE missing/damaged assets

  8. UPDATE production timeline
     ├─ RECORD scenes completed
     ├─ UPDATE schedule (adjust for delays/accelerations)
     ├─ ASSESS on-schedule status (will we hit deadline?)
     ├─ IDENTIFY timeline risks (potential blockers?)
     ├─ FLAG if timeline jeopardized (escalate to Narada)
     └─ PROVIDE updated ETA

  9. PERFORM narrative continuity QA
     ├─ VERIFY all scenes together (watch full sequence)
     ├─ CHECK overall narrative arc (does story track emotionally?)
     ├─ VALIDATE character consistency (characters behave consistently?)
     ├─ CHECK continuity errors (dialogue consistency, visual continuity)
     ├─ SCORE overall continuity (0-100)
     └─ ESCALATE if continuity <75%

  10. CALCULATE production quality score
      quality = (Script_Fidelity × 0.25) + (Narrative_Continuity × 0.25) +
                (Actor_Performance × 0.25) + (Production_Value × 0.25)
      
      IF quality <70%:
        → ESCALATE (reshoots or major revision needed)
      ELSE:
        → PROCEED to output writing

  11. WRITE production outputs
      ├─ WRITE script_execution (execution log + completion records)
      ├─ WRITE production_state (timeline status)
      ├─ WRITE asset_manifest (asset usage tracking)
      ├─ WRITE narrative_continuity (continuity check results)
      └─ SIGN with Arjuna authority + timestamp

  12. RETURN production packet
      RETURN {
        "topic_id": topic_id,
        "scenes_completed": count,
        "quality_score": 0-100,
        "on_schedule": true|false,
        "continuity_score": 0-100,
        "assets_used": count,
        "ready_for_visual_production": true|false,
        "escalation_needed": true/false
      }

END FUNCTION
```

---

## 6. PRODUCTION_QUALITY_SCORING

### Production Quality Framework

```
PRODUCTION_QUALITY_SCORE =
  (Script_Fidelity × 0.25) +
  (Narrative_Continuity × 0.25) +
  (Actor_Performance × 0.25) +
  (Production_Value × 0.25)

RANGE: 0-100

THRESHOLDS:
  0-50   → POOR (major reshoots needed)
  50-70  → ACCEPTABLE (minor reshoots acceptable)
  70-100 → STRONG (ready for visual post-production)
```

### Dimension Details

1. **Script_Fidelity** (0-100)
   - Is production matching the script as written?
   - Are scenes following the narrative structure?
   - Are emotional beats being hit?
   - Formula: (scenes_matching_script / total_scenes × 100)

2. **Narrative_Continuity** (0-100)
   - Does production maintain character consistency?
   - Is plot progression logical across scenes?
   - Are emotional arcs maintained?
   - Formula: (continuity_checks_passed / total_checks × 100)

3. **Actor_Performance** (0-100)
   - Are actors delivering compelling performances?
   - Are emotional beats landing correctly?
   - Is dialogue delivery natural?
   - Formula: (strong_performances / total_scenes × 100)

4. **Production_Value** (0-100)
   - Are assets/locations looking good?
   - Is technical execution quality (lighting, audio sync)?
   - Is overall production quality professional?
   - Formula: (quality_standards_met / total_standards × 100)

---

## 7. SKILL BINDINGS (Arjuna owns/controls 9 core skills)

| Skill_ID | Skill_Name | Archetype | Authority_Level | Primary_Role | Vein_Binding |
|----------|-----------|-----------|-----------------|-------------|--------------|
| M-269 | Scene Sequencer | decision_logic | FULL_CONTROL | Plan execution sequence (core) | script_execution |
| M-270 | Actor Director | creative | FULL_CONTROL | Direct actor performances (core) | script_execution |
| M-271 | Continuity Manager | analysis | FULL_CONTROL | Track narrative continuity (core) | narrative_continuity |
| M-272 | Asset Allocator | decision_logic | CONTROL | Assign assets to scenes | asset_manifest |
| M-273 | Production Timeline Manager | decision_logic | CONTROL | Manage production schedule | production_state |
| M-274 | Scene QA Validator | analysis | CONTROL | Quality check completed scenes | script_execution |
| M-275 | Character Consistency Checker | analysis | CONTROL | Verify character consistency | narrative_continuity |
| M-276 | Reshoots Decider | decision_logic | CONTROL | Determine if reshoots needed | script_execution |
| M-277 | Production Risk Assessor | analysis | CONTROL | Identify timeline/quality risks | production_state |

---

## 8. PRODUCTION_EXECUTION_FRAMEWORK

### Scene Execution Checklist

```
SCENE_EXECUTION_REQUIREMENTS:
  1. Scene Setup
     ✓ Correct location/asset setup
     ✓ Lighting appropriate for mood
     ✓ Audio recording ready
     ✓ Actors briefed on context
  
  2. Performance Direction
     ✓ Emotional state established
     ✓ Dialogue natural and audible
     ✓ Physical performance matches script
     ✓ Continuity with previous scenes
  
  3. Technical Execution
     ✓ Audio levels correct
     ✓ Camera framing appropriate
     ✓ Lighting correct for mood
     ✓ No technical artifacts
  
  4. Post-Scene QA
     ✓ Scene matches script intent
     ✓ Emotional beats landed
     ✓ Continuity with previous scenes maintained
     ✓ Actor performance strong
```

### Continuity Management Protocol

```
CONTINUITY_TRACKING:
  Character Continuity:
    - Same character appearance (costume, makeup, hair)
    - Same character behavior/mannerisms
    - Emotional state consistent with arc
    - Dialogue consistent with character voice
  
  Plot Continuity:
    - Scene sequencing makes narrative sense
    - Plot events consistent with story logic
    - Dialogue references make sense in context
    - Cause-effect relationships clear
  
  Emotional Continuity:
    - Overall emotional arc progresses logically
    - Character emotions match established states
    - Scene emotional beats support arc
    - Tone consistent throughout
```

---

## 9. FAILURE SURFACES & RECOVERY

| Failure_Type | Detection_Signal | Recovery_Path | Fallback_Director | SLA |
|-------------|------------------|---------------|-------------------|-----|
| Poor actor performance | Performance_quality <60% | Recast or provide additional direction | Arjuna (retry) | <120s |
| Continuity break | Continuity_score <65% | Identify break, reshoots needed | Arjuna (continuity fix) | <120s |
| Asset unavailable | Asset not available on set | Find substitute or reschedule | Arjuna (contingency) | <90s |
| Timeline slipping | Behind schedule >30min | Accelerate later scenes or compress | Narada (operations) | <60s |
| Script ambiguity | Can't execute scene as written | Escalate to Vyasa for clarification | Vyasa (script clarity) | <60s |
| Reshoots cascading | Multiple reshoots needed | Reschedule and prioritize critical scenes | Arjuna (prioritization) | Time-dependent |

---

## 10. EXECUTION TIERS

**TIER_1 (FULL PRODUCTION)**
- All 9 execution skills active
- Multiple takes per scene (best selected)
- Full continuity checking
- Professional actors
- Full asset utilization
- Director-level oversight
- Cost: Baseline (highest quality)
- Use case: Flagship content

**TIER_2 (STANDARD PRODUCTION)**
- 7/9 skills active (skip M-276, M-277)
- Single or double takes per scene
- Standard continuity checking
- Professional actors
- Basic asset utilization
- Supervisor-level oversight
- Cost: 70% of TIER_1
- Use case: Regular content

**TIER_3 (FAST PRODUCTION)**
- 5/9 skills active (M-269, M-270, M-271, M-273, M-274)
- Single take per scene
- Minimal continuity checking
- Semi-professional actors
- Essential assets only
- Basic oversight
- Cost: 40% of TIER_1
- Use case: Fast-track content

### Degradation Trigger
```
IF production_time_remaining < estimated_time_needed:
  DEGRADE to lower tier (TIER_1 → TIER_2 → TIER_3)
  ADJUST actor_quality and take_count
  ESCALATE time_pressure to Narada
```

---

## 11. HITL TRIGGERS (Manual Intervention)

| Trigger_Type | Condition | Escalation_Path | Required_Action | Time_Limit |
|-------------|-----------|-----------------|-----------------|-----------|
| Major Continuity Break | Continuity_score <60% | Arjuna + Vyasa | Determine fix: reshoots or narrative adjustment | 120 min |
| Actor Performance Issue | Performance <60% | Arjuna + casting | Recast or provide intensive direction | 90 min |
| Asset Unavailable | Critical asset not available | Arjuna + asset manager | Find substitute or reschedule | 60 min |
| Timeline Crisis | Behind >1 hour | Arjuna + Narada | Accelerate remaining scenes | 30 min |
| Script Ambiguity | Can't execute as written | Arjuna + Vyasa | Clarification or script modification | 45 min |
| Reshoots Impact | Reshoots impact timeline >30% | Arjuna + Narada + creator | Decide: accept delays or reduce quality | 60 min |

---

## 12. DASHBOARD_VISIBILITY & TELEMETRY

### Public Fields (Creator Dashboard)
- **Production Status**: PLANNING | EXECUTING | QA | READY
- **Scenes_Completed**: Count and % of total
- **Quality_Score**: 0-100 (ready if >70)
- **Timeline_Status**: ON_SCHEDULE | AT_RISK | DELAYED
- **Continuity_Score**: 0-100 (narrative integrity)
- **Actor_Performance**: Average performance quality
- **Estimated_Completion_Time**: Time to finish production

### Audit-Only Fields (Governance Visible)
- **Scene_Execution_Log**: Every scene + completion status
- **Actor_Assignments**: Who acted in which scenes
- **Asset_Utilization**: All assets used + condition
- **Continuity_Issues**: Breaks identified and resolution
- **Reshoots_Log**: Why and what was reshot
- **Timeline_Variance**: Actual vs planned schedule
- **Production_Cost**: Talent + asset + overhead costs

---

## 13. CRITICAL AMBIGUITIES

| Ambiguity | Current State | Resolution | Owner |
|-----------|--------------|-----------|-------|
| Takes per scene standard | 1-3 varies | Define standard takes per scene | Arjuna |
| Reshoots approval authority | Director decides | Confirm who authorizes reshoots | Narada |
| Continuity threshold | 75%+ | Confirm minimum continuity score | Arjuna |
| Actor casting authority | Limited | Confirm approved actor list | Narada |
| Scene execution order | Efficiency-based | Confirm whether narrative order matters | Vyasa |
| Cost authority for reshoots | Not defined | Define reshoots budget | Kubera |

---

## 14. ACCEPTANCE CRITERIA (DEPLOYMENT GATE)

✅ **READY FOR DEPLOYMENT IF**:
- [ ] All 9 production skills callable and tested
- [ ] Scene sequencing logic working
- [ ] Actor direction specification functional
- [ ] Continuity tracking working
- [ ] Asset allocation functional
- [ ] Production timeline management working
- [ ] Reshoots decision logic working
- [ ] Production QA validation functional
- [ ] Quality scoring calculation verified
- [ ] All HITL triggers functional
- [ ] Integration with Vyasa (script input) tested
- [ ] Integration with Maya (visual production) tested
- [ ] End-to-end scene execution tested

---

## 15. RELEASE BLOCKING STATUS

**RELEASE_BLOCKING: TRUE** (script execution is mandatory)

Without Arjuna, scripts cannot be executed into production. Script execution is critical to transforming narrative into visual/audio content.

---

## 16. OPERATIONAL NOTES

- **Created**: 2026-04-21
- **Status**: SPECIFICATION COMPLETE
- **Testing Priority**: CRITICAL (blocks production pipeline)
- **Next Step**: Integration with Vyasa (script input) and Maya (visual production)
- **Real-Time Requirement**: Production execution is highly time-dependent
- **Coordination Requirement**: Works closely with Tumburu (audio), Maya (visual), Narada (operations)
