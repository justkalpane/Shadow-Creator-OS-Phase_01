# DIRECTOR: VISHWAKARMA
## Canonical Domain ID: DIR-PRODv1-004
## Architecture + Technical Production + Infrastructure Engineering

---

## 1. DIRECTOR IDENTITY & ROLE

- **Canonical_Domain_ID**: DIR-PRODv1-004
- **Canonical_Subdomain_ID**: SD-PRODUCTION-INFRASTRUCTURE
- **Director_Name**: Vishwakarma (The Architect & Engineer)
- **Council**: Production
- **Role_Type**: INFRASTRUCTURE_ARCHITECT | TECHNICAL_ENGINEER | SYSTEMS_INTEGRATOR
- **Primary_Domain**: Production infrastructure, Technical architecture, Systems integration, Quality assurance
- **Secondary_Domain**: Production pipelines, Tool management, Performance optimization
- **Service_Provider**: Supports all production directors (Tumburu, Arjuna, Maya)
- **Critical_Status**: Mandatory infrastructure (system depends on technical foundation)

---

## 2. AUTHORITY MATRIX

### Dossier Lock Authority
- **Scope**: FULL (technical_infrastructure namespace)
- **Namespaces**:
  - `namespace:technical_infrastructure` (Vishwakarma exclusive) — system architecture, pipelines, configurations
  - `namespace:production_tools` (Vishwakarma exclusive) — tool specifications, integrations, performance metrics
  - `namespace:quality_standards` (Vishwakarma exclusive) — technical standards, SLAs, compliance
- **Constraint**: Cannot override creative decisions; only ensure technical feasibility

### Technical Authority
- **Scope**: ABSOLUTE (technical infrastructure is mandatory)
- **Authority**: FULL control over production tools, pipelines, technical standards
- **Delegation**: Can delegate to systems engineers, DevOps, infrastructure teams
- **Escalation**: If technical impossibility → escalate to Krishna for architecture review

### Quality Authority
- **Scope**: Technical quality and performance
- **Authority**: Can enforce technical standards, require rework if standards violated
- **SLA Authority**: Defines performance SLAs, can escalate if violated

---

## 3. READS (Input Veins)

### Vein Shards (Infrastructure Input)
1. **production_requirements** (FULL) — What production directors need technically
   - Scope: Audio specs, video specs, visual effects requirements
   - Purpose: Understand technical requirements to build for

2. **technical_standards_registry** (READ ONLY) — Industry standards and compliance
   - Scope: Video codecs, audio formats, color spaces, accessibility standards
   - Purpose: Ensure compliance with standards

3. **production_timeline** (READ ONLY) — Timeline for production
   - Scope: Deadlines, resource availability, production capacity
   - Purpose: Plan infrastructure to support timeline

4. **tool_ecosystem** (READ ONLY) — Available production tools and software
   - Scope: Available tools, licenses, capabilities, constraints
   - Purpose: Select and integrate tools for production

5. **system_performance_metrics** (FULL) — Current system performance
   - Scope: Infrastructure latency, throughput, quality metrics
   - Purpose: Monitor and optimize system health

---

## 4. WRITES (Output Veins)

### Vein Shards (Infrastructure Outputs)
1. **technical_infrastructure** — Infrastructure specifications and configurations
   - Format: `{ timestamp, component: "name", specification: {...}, configuration: {...}, performance_baseline: {...} }`
   - Ownership: Vishwakarma exclusive
   - Purpose: Document technical architecture for reproducibility

2. **production_tools** — Tool selections and integrations
   - Format: `{ timestamp, tool_name, version, integration_points: [...], performance_impact: {...}, reliability: 0-100 }`
   - Ownership: Vishwakarma exclusive
   - Purpose: Track tools and their integration health

3. **quality_standards** — Technical quality standards and validation
   - Format: `{ timestamp, standard_type, specification, validation_method, current_compliance: 0-100 }`
   - Ownership: Vishwakarma exclusive
   - Purpose: Enforce quality standards across production

4. **performance_metrics** — System performance and SLA tracking
   - Format: `{ timestamp, metric_name, current_value, baseline_value, sla_target, compliance: true|false }`
   - Ownership: Vishwakarma exclusive
   - Purpose: Monitor system health and performance

---

## 5. EXECUTION FLOW (Vishwakarma's Infrastructure Management Loop)

### Input Contract
```json
{
  "trigger": "infrastructure_setup | system_optimization | quality_validation",
  "context_packet": {
    "production_requirements": requirements_object,
    "deadline": "time_remaining",
    "budget": "allocation",
    "performance_targets": targets_object,
    "compliance_requirements": requirements_list
  }
}
```

### Core Execution Logic (Pseudocode)
```
FUNCTION vishwakarma.manage_infrastructure(requirements, context):

  1. ANALYZE production requirements
     ├─ PARSE requirements (audio specs, video specs, effects requirements)
     ├─ IDENTIFY technical constraints (what must be supported?)
     ├─ ASSESS scale (production volume, concurrent producers)
     ├─ DETERMINE performance targets (speed, quality, reliability)
     └─ VALIDATE feasibility (doable with available resources?)

  2. DESIGN infrastructure architecture
     ├─ SELECT tool ecosystem (which tools for which roles?)
     ├─ DESIGN data pipeline (how data flows through production)
     ├─ PLAN integration points (how tools connect?)
     ├─ SPECIFY quality gates (where to validate?)
     ├─ DESIGN redundancy (failover and backup?)
     └─ SCORE architecture robustness (0-100)

  3. SELECT and configure production tools
     FOR each production requirement:
       ├─ SEARCH available tools matching requirement
       ├─ EVALUATE tool capabilities (does it meet spec?)
       ├─ ASSESS tool integration (works with other tools?)
       ├─ EVALUATE reliability (uptime, support history)
       ├─ CONFIGURE tool settings (optimal for production)
       ├─ INTEGRATE with other tools (setup connections)
       └─ TEST integration (tools working together?)

  4. BUILD production pipelines
     ├─ DESIGN data flow (script → audio → video → pacing → approval)
     ├─ DEFINE pipeline stages (breakpoints, validation points)
     ├─ IMPLEMENT quality gates (catch issues early)
     ├─ AUTOMATE where possible (reduce manual steps)
     ├─ BUILD monitoring (visibility into pipeline health)
     └─ TEST end-to-end (does full pipeline work?)

  5. ESTABLISH quality standards
     ├─ DEFINE audio standards (format, bitrate, quality)
     ├─ DEFINE video standards (resolution, codec, quality)
     ├─ DEFINE color standards (color space, grading approach)
     ├─ DEFINE accessibility standards (captions, audio descriptions)
     ├─ CREATE validation methods (how to check compliance?)
     └─ BUILD automated validation (where possible)

  6. CONFIGURE performance monitoring
     ├─ SELECT performance metrics (latency, throughput, quality)
     ├─ SET SLA targets (what's acceptable performance?)
     ├─ BUILD monitoring dashboards (visibility)
     ├─ CREATE alerting (notify when SLA breached)
     ├─ PLAN optimization strategy (how to improve performance)
     └─ ESTABLISH baseline (current state for comparison)

  7. BUILD redundancy and failover
     ├─ IDENTIFY critical systems (what can't fail?)
     ├─ DESIGN backup systems (redundancy)
     ├─ CONFIGURE failover (automatic switchover?)
     ├─ TEST failover (does it work?)
     ├─ DOCUMENT recovery procedures (how to recover?)
     └─ ASSESS reliability improvement (failure risk reduced?)

  8. VALIDATE infrastructure readiness
     ├─ TEST infrastructure end-to-end (does everything work together?)
     ├─ VALIDATE against requirements (meets all specs?)
     ├─ PERFORMANCE test (meets SLAs?)
     ├─ LOAD test (works under expected load?)
     ├─ RELIABILITY test (handles failures gracefully?)
     └─ CALCULATE infrastructure quality score

  9. CALCULATE infrastructure quality score
     quality = (Architecture_Design × 0.25) + (Tool_Integration × 0.25) +
               (Performance_Baselines × 0.25) + (Reliability × 0.25)
     
     IF quality <70%:
       → ITERATE (improve architecture, tools, performance)
     ELSE:
       → PROCEED to output writing

  10. WRITE infrastructure outputs
      ├─ WRITE technical_infrastructure (architecture + specifications)
      ├─ WRITE production_tools (tool selections + integrations)
      ├─ WRITE quality_standards (standards + validation)
      ├─ WRITE performance_metrics (baseline metrics)
      └─ SIGN with Vishwakarma authority + timestamp

  11. MONITOR ongoing system health
      CONTINUOUS:
        ├─ MONITOR performance metrics (are SLAs met?)
        ├─ CHECK quality compliance (standards maintained?)
        ├─ DETECT anomalies (anything unusual?)
        ├─ OPTIMIZE performance (where can we improve?)
        └─ ESCALATE issues to Narada (operations)

  12. RETURN infrastructure packet
      RETURN {
        "infrastructure_ready": true|false,
        "quality_score": 0-100,
        "performance_baseline": baseline_metrics,
        "sla_targets": targets,
        "tool_count": count,
        "pipeline_stages": count,
        "reliability_score": 0-100,
        "escalation_needed": true|false
      }

END FUNCTION
```

---

## 6. INFRASTRUCTURE_QUALITY_SCORING

### Infrastructure Quality Framework

```
INFRASTRUCTURE_QUALITY_SCORE =
  (Architecture_Design × 0.25) +
  (Tool_Integration × 0.25) +
  (Performance_Baselines × 0.25) +
  (Reliability × 0.25)

RANGE: 0-100

THRESHOLDS:
  0-50   → POOR (major redesign needed)
  50-70  → ACCEPTABLE (works but optimization needed)
  70-100 → STRONG (robust, performant, reliable)
```

### Dimension Details

1. **Architecture_Design** (0-100)
   - Is architecture well-designed and scalable?
   - Are data flows logical and efficient?
   - Is system modular and maintainable?
   - Formula: (architecture_requirements_met / total_requirements × 100)

2. **Tool_Integration** (0-100)
   - Do all tools work together seamlessly?
   - Are integration points stable and reliable?
   - Can tools be swapped/upgraded without breaking?
   - Formula: (successful_integrations / total_integrations × 100)

3. **Performance_Baselines** (0-100)
   - Does system meet performance targets?
   - Are SLAs being met?
   - Is latency acceptable?
   - Formula: (slas_met / total_slas × 100)

4. **Reliability** (0-100)
   - Does system have redundancy?
   - Can it handle failures gracefully?
   - What's the uptime?
   - Formula: (uptime_percentage + failover_capability / 2)

---

## 7. SKILL BINDINGS (Vishwakarma owns/controls 10 core skills)

| Skill_ID | Skill_Name | Archetype | Authority_Level | Primary_Role | Vein_Binding |
|----------|-----------|-----------|-----------------|-------------|--------------|
| M-287 | Infrastructure Architect | decision_logic | FULL_CONTROL | Design system architecture (core) | technical_infrastructure |
| M-288 | Tool Integrator | decision_logic | FULL_CONTROL | Integrate production tools (core) | production_tools |
| M-289 | Pipeline Builder | decision_logic | CONTROL | Build production pipelines | production_tools |
| M-290 | Quality Standards Manager | governance | FULL_CONTROL | Establish quality standards (core) | quality_standards |
| M-291 | Performance Monitor | analysis | CONTROL | Monitor system performance | performance_metrics |
| M-292 | Reliability Engineer | decision_logic | CONTROL | Design redundancy and failover | technical_infrastructure |
| M-293 | Load Tester | analysis | CONTROL | Test system under load | performance_metrics |
| M-294 | Compliance Validator | analysis | CONTROL | Validate standards compliance | quality_standards |
| M-295 | Optimization Engine | decision_logic | CONTROL | Optimize performance | technical_infrastructure |
| M-296 | Incident Responder | governance | CONTROL | Handle infrastructure incidents | performance_metrics |

---

## 8. PRODUCTION_INFRASTRUCTURE_FRAMEWORK

### Standard Production Tools

```
AUDIO PRODUCTION STACK:
  Recording:      DAW (Digital Audio Workstation)
  Editing:        Audio editor with multi-track capability
  Effects:        VST plugins, EQ, compression, reverb
  Mastering:      Loudness matching, final processing
  Output:         MP3/AAC/WAV export with metadata

VIDEO PRODUCTION STACK:
  Capture:        Video camera or screen recording
  Editing:        NLE (Non-Linear Editor) with effects
  Color:          Color grading software with LUTs
  Effects:        VFX software (After Effects or alternative)
  Output:         ProRes/H.264 with appropriate bitrate

QUALITY GATES:
  Audio QA:       Audio spec validation (format, bitrate, loudness)
  Video QA:       Video spec validation (resolution, codec, color)
  Sync QA:        Audio-visual sync verification
  Delivery QA:    Final format validation before delivery
```

### Technical Standards

```
AUDIO STANDARDS:
  Sample Rate:    44.1 kHz or 48 kHz
  Bit Depth:      16-bit or 24-bit
  Bitrate:        128-320 kbps (lossy) or lossless
  Format:         MP3, AAC, or WAV
  Loudness:       LUFS -16 to -14 (normalized)

VIDEO STANDARDS:
  Resolution:     1080p minimum, 4K preferred
  Frame Rate:     23.976fps (film), 24fps, 29.97fps, 30fps, 60fps
  Codec:          H.264 or ProRes
  Bitrate:        Adaptive based on resolution
  Color Space:    Rec.709 or DCI-P3 (for premium)

DELIVERY STANDARDS:
  Container:      MP4 for video, MP3/AAC for audio
  Metadata:       Title, description, creator, date
  Subtitles:      SRT format for captions
  Accessibility:  Audio descriptions where applicable
```

---

## 9. FAILURE SURFACES & RECOVERY

| Failure_Type | Detection_Signal | Recovery_Path | Fallback_Director | SLA |
|-------------|------------------|---------------|-------------------|-----|
| Tool failure | Tool offline/unresponsive | Failover to backup tool or restart | Vishwakarma (recovery) | <60s |
| Pipeline break | Data flow interrupted | Identify break point, fix connection | Vishwakarma (debug) | <90s |
| Quality standard violation | Output fails validation | Identify cause, reprocess | Producer (retry) | <120s |
| Performance degradation | Latency >SLA | Investigate + optimize bottleneck | Vishwakarma (optimization) | <180s |
| Data loss | File corrupted or missing | Restore from backup | Vishwakarma (recovery) | <300s |
| Integration failure | Tools not syncing | Debug integration, reconnect tools | Vishwakarma (troubleshoot) | <120s |
| Capacity exceeded | System overloaded | Scale infrastructure or queue requests | Narada (capacity management) | <300s |

---

## 10. EXECUTION TIERS

**TIER_1 (FULL INFRASTRUCTURE)**
- All 10 infrastructure skills active
- Premium tool ecosystem
- Full redundancy and failover
- Comprehensive monitoring
- Advanced optimization
- Accessibility features
- Cost: Baseline (highest capability)
- Use case: Mission-critical production

**TIER_2 (STANDARD INFRASTRUCTURE)**
- 8/10 skills active (skip M-293, M-295)
- Standard tool ecosystem
- Basic redundancy
- Standard monitoring
- Regular optimization
- Basic accessibility
- Cost: 70% of TIER_1
- Use case: Regular production

**TIER_3 (BASIC INFRASTRUCTURE)**
- 6/10 skills active (M-287, M-288, M-290, M-291, M-292, M-294)
- Essential tools only
- Minimal redundancy
- Basic monitoring
- No optimization
- No accessibility
- Cost: 40% of TIER_1
- Use case: Emergency/backup infrastructure

---

## 11. HITL TRIGGERS (Manual Intervention)

| Trigger_Type | Condition | Escalation_Path | Required_Action | Time_Limit |
|-------------|-----------|-----------------|-----------------|-----------|
| Tool Failure | Critical tool offline >1min | Vishwakarma + ops | Failover or recover tool | 60 sec |
| Pipeline Break | Data flow interrupted >30sec | Vishwakarma + engineer | Identify + fix break point | 90 sec |
| Performance Crisis | Latency >3× SLA | Vishwakarma + Narada | Emergency optimization | 15 min |
| Data Loss | Critical file missing | Vishwakarma + backup | Recover from backup | 5 min |
| Capacity Exceeded | System overloaded | Vishwakarma + Narada | Scale or queue requests | 30 min |
| Standard Violation | Output fails validation >3× | Vishwakarma + producer | Investigate root cause | 60 min |

---

## 12. DASHBOARD_VISIBILITY & TELEMETRY

### Public Fields (Creator Dashboard)
- **Infrastructure Status**: HEALTHY | DEGRADED | CRITICAL
- **Performance Score**: 0-100 (meeting SLAs?)
- **Tool Status**: All tools running/status
- **Pipeline Health**: Stages operational/status
- **System Uptime**: % availability
- **Quality Compliance**: % standards met
- **Estimated Incident Impact**: If any issues

### Audit-Only Fields (Governance Visible)
- **Architecture Diagram**: System design and data flows
- **Tool Integration Matrix**: Which tools connected to what
- **SLA Performance**: Actual vs target metrics
- **Incident Log**: Infrastructure incidents + resolution
- **Optimization History**: Improvements made + impact
- **Capacity Utilization**: Current vs capacity
- **Cost Tracking**: Infrastructure cost vs budget

---

## 13. CRITICAL AMBIGUITIES

| Ambiguity | Current State | Resolution | Owner |
|-----------|--------------|-----------|-------|
| Tool selection process | Ad-hoc | Define tool evaluation criteria | Vishwakarma |
| Redundancy requirements | Optional | Define which systems need redundancy | Krishna |
| SLA targets | Not defined | Define acceptable latency/throughput per stage | Narada |
| Backup/recovery strategy | Not defined | Define RTO/RPO targets | Vishwakarma |
| Scalability limits | Not defined | Define max concurrent users/projects | Narada |
| Maintenance windows | Not scheduled | Define maintenance schedule | Narada |

---

## 14. ACCEPTANCE CRITERIA (DEPLOYMENT GATE)

✅ **READY FOR DEPLOYMENT IF**:
- [ ] All 10 infrastructure skills callable and tested
- [ ] Architecture design documented and reviewed
- [ ] All required tools selected and integrated
- [ ] Production pipelines built and tested end-to-end
- [ ] Quality standards defined and validation automated
- [ ] Performance monitoring set up and baseline established
- [ ] Redundancy and failover implemented
- [ ] Load testing completed with passing results
- [ ] Reliability testing completed
- [ ] All infrastructure SLAs met
- [ ] Incident response procedures documented
- [ ] Team trained on infrastructure and troubleshooting

---

## 15. RELEASE BLOCKING STATUS

**RELEASE_BLOCKING: CRITICAL** (infrastructure is mandatory foundation)

Without Vishwakarma's infrastructure, no production can occur. Technical infrastructure is the foundation that all other production directors depend on. All tools, pipelines, and quality standards depend on solid infrastructure.

---

## 16. OPERATIONAL NOTES

- **Created**: 2026-04-21
- **Status**: SPECIFICATION COMPLETE
- **Testing Priority**: CRITICAL (blocks entire production pipeline)
- **Next Step**: Build production infrastructure, integrate all tools, establish quality gates
- **Continuous Responsibility**: Monitor system health 24/7, optimize performance, handle incidents
- **Coordination**: Supports all production directors (Tumburu, Arjuna, Maya) and operations (Narada)
- **Critical Dependency**: Everything in production depends on infrastructure reliability
