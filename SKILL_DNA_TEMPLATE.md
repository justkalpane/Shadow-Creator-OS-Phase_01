# SKILL DNA TEMPLATE
## Complete Specification Blueprint for All 218 Skills
### Reference: Use this template for all skills - NO COMPRESSION, STRICT MODE

---

## SECTION 1: SKILL IDENTITY & OWNERSHIP

### 1.1 Canonical Identity
```
Skill_ID:              M-XXX (e.g., M-004)
Canonical_Name:        [Skill Name in canonical form]
Archetype:            decision_logic | analysis | creative | governance | integration
Role_Type:            [PRIMARY_ROLE | SECONDARY_ROLE]
```

### 1.2 Ownership & Authority
```
Owner_Director:       [Which director owns this skill]
Secondary_Directors:  [Other directors who may use this skill]
Authority_Level:      FULL_CONTROL | CONTROL | ADVISORY | SHARED
Can_Delegate_To:      [Which other skills/directors]
Cannot_Delegate:      [Mandatory responsibilities]
```

### 1.3 Purpose & Intent
```
Primary_Purpose:      [Why this skill exists, what problem it solves]
Secondary_Purpose:    [Additional uses]
Use_Cases:           [Specific scenarios where this skill is needed]
Domain:              [Which domain/council primary function]
```

---

## SECTION 2: AUTHORITY MATRIX (Detailed)

### 2.1 Execution Authority
```
Can_Execute:         [What this skill can do]
Cannot_Execute:      [What this skill cannot do]
Requires_Approval:   [What needs approval before execution]
Escalation_Required: [When to escalate]
Veto_Authority:      YES | NO [Can this skill veto decisions?]
Veto_Scope:          [What can it veto? What can't it?]
```

### 2.2 Data Authority
```
Can_Read:            [Which veins/namespaces can read]
Can_Write:           [Which veins/namespaces can write]
Cannot_Read:         [Forbidden reads]
Cannot_Write:        [Forbidden writes]
Requires_Validation: [What outputs require validation]
```

### 2.3 Cost Authority
```
Cost_Tier:           TIER_1 | TIER_2 | TIER_3 [Budget tier]
Cost_Per_Execution:  [Estimated cost]
Cost_Authority:      [Who controls cost budget for this skill]
Budget_Escalation:   >X% cost overrun triggers escalation to [Director]
```

### 2.4 Delegation Authority
```
Can_Delegate_To:     [Skills/directors this skill can delegate to]
Cannot_Delegate:     [What cannot be delegated]
Delegation_Rules:    [Rules for delegating work]
Sub_Skill_Authority: [Authority over sub-skills]
```

---

## SECTION 3: READS (Input Veins) - COMPLETE

### 3.1 Primary Input Veins
```
Vein_Name:           [vein_name]
Scope:               [What data from this vein]
Read_Authority:      FULL | PARTIAL | READ_ONLY | FORBIDDEN
Required:            YES | NO
Frequency:           on_demand | continuous | scheduled
Source:              [Which director/skill provides this]
Validation:          [Any validation needed before reading]
Fallback:            [What if vein unavailable]
```

### 3.2 Secondary Input Veins
[Additional veins as needed]

### 3.3 Input Data Model
```
Input_Structure:     {
  field1: type,
  field2: type,
  nested: {
    subfield: type
  }
}
Validation_Rules:    [Schema validation, range checks, type checks]
Required_Fields:     [Which fields are mandatory]
Optional_Fields:     [Which fields are optional]
```

---

## SECTION 4: WRITES (Output Veins) - COMPLETE

### 4.1 Primary Output Veins
```
Vein_Name:           [vein_name]
Scope:               [What data written to this vein]
Write_Authority:     FULL (exclusive) | SHARED (with other skills) | APPENDED
Ownership:           [Skill exclusive ownership]
Versioning:          Keep_All | Latest_Only | Time_Windowed
Retention:           [How long to keep data]
Audit:               YES | NO [Is this audit-logged?]
```

### 4.2 Secondary Output Veins
[Additional veins as needed]

### 4.3 Output Data Model
```
Output_Structure:    {
  field1: type,
  field2: type,
  metadata: {
    timestamp: datetime,
    skill_id: string,
    version: integer
  }
}
Schema_Reference:    [Link to schema file if exists]
Validation:          [Output validation before write]
```

---

## SECTION 5: EXECUTION FLOW & ALGORITHM

### 5.1 Input Contract
```
Trigger_Types:      [What events trigger this skill]
Context_Packet:     {
  field1: description,
  field2: description
}
Input_Validation:   [What must be validated before execution]
Timeout:            [Max execution time]
```

### 5.2 Core Execution Logic (Pseudocode)
```
FUNCTION skill_name.execute(input, context):

  1. VALIDATE input
     ├─ Check all required fields present
     ├─ Validate field types and ranges
     ├─ Verify authorization
     └─ Escalate if validation fails

  2. PREPARE execution context
     ├─ Load required data from veins
     ├─ Initialize state
     ├─ Set up monitoring
     └─ Prepare for logging

  3. EXECUTE core logic
     ├─ [Main algorithm steps]
     ├─ [Decision points]
     ├─ [Sub-skill calls if needed]
     └─ [Output generation]

  4. VALIDATE output
     ├─ Check output against schema
     ├─ Verify completeness
     ├─ Perform quality checks
     └─ Escalate if invalid

  5. WRITE outputs
     ├─ Write to primary vein
     ├─ Write to secondary veins
     ├─ Log execution
     └─ Update metrics

  6. RETURN result
     RETURN {
       status: success|failure|escalation,
       output: result_object,
       metrics: execution_metrics,
       escalation_needed: true|false
     }

END FUNCTION
```

### 5.3 Sub-Skills Called
```
Sub_Skill_ID:       [M-XXX]
When_Called:        [Under what conditions]
Authority:          [Authority relationship]
Output_Used_As:     [How output is used]
Fallback:           [If sub-skill fails]
```

---

## SECTION 6: SCORING FRAMEWORK (If Applicable)

### 6.1 Multi-Dimensional Scoring
```
PRIMARY_SCORE = 
  (Dimension_1 × weight1) +
  (Dimension_2 × weight2) +
  (Dimension_3 × weight3) +
  (Dimension_4 × weight4)

RANGE: 0-100
FORMULA: [Mathematical expression]

THRESHOLDS:
  0-40   → [Action_1] (e.g., REJECT, ESCALATE)
  40-70  → [Action_2] (e.g., CAUTION, REVIEW)
  70-100 → [Action_3] (e.g., APPROVE, PROCEED)
```

### 6.2 Dimension Definitions
```
Dimension_1: [Name] (weight X%)
  Definition:    [What this measures]
  Formula:       [How to calculate]
  Min_Value:     0
  Max_Value:     100
  Interpretation: [What score means]

[Additional dimensions as needed]
```

---

## SECTION 7: APPROVAL & ESCALATION GATES

### 7.1 Approval Gate Matrix
```
Trigger_Condition:    [When approval needed]
Approval_Authority:   [Who can approve: Director/Founder/System]
Approval_SLA:         [Time allowed for approval]
Auto_Approve_If:      [Conditions for auto-approval]
Auto_Reject_If:       [Conditions for auto-rejection]
Escalation_If:        [When to escalate beyond approver]
```

### 7.2 Escalation Paths
```
ESCALATION_LEVEL_1:
  Trigger:           [What triggers escalation]
  Escalate_To:       [Which director]
  SLA:               [Time to respond]
  Authority:         [Can they override?]
  Fallback:          [If they also escalate]

ESCALATION_LEVEL_2:
  Trigger:           [Higher-level escalation]
  Escalate_To:       Krishna | Founder | Emergency Protocol
  SLA:               [Critical response time]
  Authority:         OVERRIDE | ADVISORY
```

### 7.3 Approval Conditions
```
APPROVE_IF:
  - Condition_1 AND
  - Condition_2 AND
  - Score >= threshold

REJECT_IF:
  - Violation_1 OR
  - Violation_2 OR
  - Score < min_threshold

ESCALATE_IF:
  - Ambiguous AND
  - High_Impact
```

---

## SECTION 8: VEIN BINDING & WORKFLOW ROUTING

### 8.1 Read Vein Bindings
```
Vein_ID:             [vein_name]
Data_Contract:       [What exactly needed from vein]
Binding_Type:        PUSH (vein sends) | PULL (skill requests)
Latency_SLA:         [Max time to get data]
Fallback_Data:       [What if vein unavailable]
Cache_Policy:        [Can this be cached? For how long?]
```

### 8.2 Write Vein Bindings
```
Vein_ID:             [vein_name]
Data_Contract:       [What exactly written to vein]
Binding_Type:        EXCLUSIVE (only this skill writes) | SHARED
Versioning:          [How output versions managed]
Audit:               [What gets logged to vein]
Downstream:          [Which skills read this output]
```

### 8.3 Workflow Routing
```
UPSTREAM_WORKFLOWS:
  [Workflow_ID]: {
    Input_From:     [Which stage provides input]
    Data_Format:    [Expected input format]
    Validation:     [Input validation needed]
  }

DOWNSTREAM_WORKFLOWS:
  [Workflow_ID]: {
    Output_To:      [Which stage receives output]
    Data_Format:    [Output format provided]
    Synchronization: [Timing requirements]
  }

SIBLING_SKILLS:
  [Skill_ID]: {
    Interaction:    [How they interact]
    Dependency:     [Dependencies between them]
    Ordering:       [Must execute before/after]
  }
```

---

## SECTION 9: DELEGATION & SUB-SKILLS

### 9.1 Delegation Authority
```
Can_Delegate_To:     [Skills this can delegate to]
Delegation_Rules:    {
  condition_1: delegate_to_skill_X,
  condition_2: delegate_to_skill_Y,
  default: handle_internally
}
Supervision:         [How delegated work supervised]
Fallback:            [If delegated skill fails]
```

### 9.2 Sub-Skill Composition
```
Sub_Skill_1:
  Skill_ID:          [M-XXX]
  When_Called:       [Conditions for calling]
  Input:             [What passed to sub-skill]
  Output_Used_As:    [How output used]
  Failure_Handling:  [If sub-skill fails]
  Authority_Over:    [Authority relationship]

[Additional sub-skills as needed]

Sub_Skill_Ordering:  [Order sub-skills executed]
Parallelization:     [Can sub-skills run in parallel?]
```

---

## SECTION 10: BEST PRACTICES & PATTERNS

### 10.1 Standard Patterns
```
Pattern_1: [Name]
  Description:    [What this pattern does]
  When_Used:      [When to apply this pattern]
  Implementation: [Step-by-step approach]
  Pitfalls:       [Common mistakes]
  Example:        [Concrete example]

[Additional patterns as needed]
```

### 10.2 Anti-Patterns (What NOT To Do)
```
Anti_Pattern_1: [Name]
  Description:   [What this does wrong]
  Why_Bad:       [Why this is problematic]
  Correct_Way:   [How to do it right]

[Additional anti-patterns as needed]
```

### 10.3 Optimization Strategies
```
Optimization_1: [Name]
  Benefit:       [What improves]
  Implementation: [How to implement]
  Trade_Offs:    [What's sacrificed]
  When_Apply:    [Under what conditions]
```

---

## SECTION 11: FAILURE SURFACES & RECOVERY

### 11.1 Failure Mode Analysis
```
Failure_Type_1: [Name]
  Detection_Signal:  [How to detect this failure]
  Root_Causes:       [Why it happens]
  Impact:            [What breaks]
  Recovery_Path:     [How to recover]
  Fallback_Skill:    [Which skill/director takes over]
  SLA:               [Time to recover]
  Prevention:        [How to prevent]

[Additional failure modes as needed]
```

### 11.2 Error Handling
```
Error_Code_1: [Name]
  Meaning:       [What this error means]
  Severity:      CRITICAL | HIGH | MEDIUM | LOW
  Handling:      [How to handle]
  Escalation:    [When to escalate]
  User_Message:  [What to tell user]

[Additional error codes as needed]
```

---

## SECTION 12: TASK & OUTPUT SPECIFICATION

### 12.1 Task Definition
```
Task_ID:           [Unique identifier]
Task_Name:         [What this task is]
Preconditions:     [Must be true before task executes]
Input_Data:        [Required input]
Processing:        [Steps to execute]
Output:            [Expected output]
Postconditions:    [Should be true after execution]
SLA:               [Time to complete]
```

### 12.2 Output Specification
```
Output_Type:       [JSON | CSV | Binary | Stream | etc.]
Output_Schema:     {
  field1: { type, validation, description },
  field2: { type, validation, description }
}
Output_Quality:    [Checks before considering output valid]
Output_Versioning: [How versions managed]
Output_Retention:  [How long to keep]
```

---

## SECTION 13: CONTEXT ENGINEERING & BEST PRACTICES

### 13.1 Context Requirements
```
Context_Packet_Structure:
{
  skill_id: "M-XXX",
  topic_id: "string",
  creator_context: {...},
  workflow_context: {...},
  director_context: {...},
  deadline: "ISO8601",
  budget: {...}
}
```

### 13.2 Context Validation
```
Required_Context:     [What must be in context]
Optional_Context:     [What's nice to have]
Context_Validation:   [How to validate context]
Missing_Context_Handling: [What if context missing]
```

### 13.3 Execution Best Practices
```
Practice_1: [Name]
  Description:   [What to do]
  Rationale:     [Why this matters]
  Implementation: [How to do it]
  Example:       [Concrete example]

[Additional practices as needed]
```

---

## SECTION 14: MONITORING & OBSERVABILITY

### 14.1 Metrics to Track
```
Metric_1: [Name]
  What_Measures:    [What this tracks]
  Calculation:      [How to calculate]
  Normal_Range:     [Expected values]
  Alert_Threshold:  [When to alert]
  Dashboard_Field:  [What field on dashboard]

[Additional metrics as needed]
```

### 14.2 Logging & Audit Trail
```
Log_Level_1: DEBUG
  What_Logged:      [What debug info to log]
  Format:           [Log message format]
  Retention:        [How long to keep]

Log_Level_2: INFO
  [Similar structure]

Log_Level_3: WARN
Log_Level_4: ERROR

Audit_Trail:
  What_Audited:     [What requires audit trail]
  Audit_Format:     [Structure of audit record]
  Retention:        [How long to keep]
  Access:           [Who can access audit log]
```

---

## SECTION 15: INTEGRATION & DEPENDENCIES

### 15.1 Director Dependencies
```
Owner_Director:      [Primary director]
Secondary_Directors: [Other using directors]
Dependent_Skills:    [Skills that depend on this]
Depended_On_By:      [Skills that use outputs]
```

### 15.2 Workflow Integration
```
Workflows_Using:     [Which workflows use this skill]
Stage_In_Workflow:   [Which stage of workflow]
Input_From_Stage:    [Previous workflow stage]
Output_To_Stage:     [Next workflow stage]
```

### 15.3 Cross-Skill Coordination
```
Coordinates_With:    [Other skills for coordination]
Conflict_Resolution: [If multiple skills compete]
Priority_Rules:      [Which skill has priority if conflict]
Synchronization:     [How to synchronize execution]
```

---

## SECTION 16: TESTING & VALIDATION

### 16.1 Unit Test Cases
```
Test_Case_1: [Name]
  Input:            [Test input]
  Expected_Output:  [What should be returned]
  Assertions:       [Conditions that must be true]
  Test_Type:        HAPPY_PATH | ERROR_PATH | EDGE_CASE

[Additional test cases as needed]
```

### 16.2 Integration Test Cases
```
Test_Case_1: [Name]
  Setup:            [How to set up test]
  Execution:        [Steps to execute]
  Verification:     [How to verify correctness]
  Cleanup:          [How to clean up after]

[Additional test cases as needed]
```

### 16.3 Acceptance Criteria
```
Criterion_1: [Name]
  Definition:       [What must be true]
  Verification:     [How to verify]
  Pass_Condition:   [What passes]
  Fail_Condition:   [What fails]

[Additional criteria as needed]
```

---

## SECTION 17: RELEASE & DEPLOYMENT

### 17.1 Release Criteria
```
READY_FOR_RELEASE_IF:
  - All unit tests pass
  - All integration tests pass
  - All acceptance criteria met
  - Code reviewed
  - Documentation complete
  - [Additional criteria]
```

### 17.2 Deployment Strategy
```
Deployment_Method:   [How deployed to production]
Rollback_Strategy:   [How to rollback if issues]
Monitoring_Required: [What must be monitored post-deploy]
SLA_Post_Deploy:     [Performance SLA after deployment]
```

---

## SECTION 18: OPERATIONAL NOTES

### 18.1 Known Limitations
```
Limitation_1: [What this skill cannot do]
  Workaround:     [How to work around]
  Future_Plan:    [Plan to fix]

[Additional limitations as needed]
```

### 18.2 Future Enhancements
```
Enhancement_1: [Proposed improvement]
  Rationale:    [Why beneficial]
  Effort:       [Estimated effort]
  Priority:     [Priority level]

[Additional enhancements as needed]
```

### 18.3 Support & Troubleshooting
```
Common_Issues:
  Issue_1: [Description]
    Cause:        [Why it happens]
    Solution:     [How to fix]

Support_Contact:  [Who to contact for help]
Escalation_Path:  [How to escalate issues]
```

---

## SECTION 19: METADATA & VERSIONING

```
Skill_Version:        1.0
Last_Updated:         2026-04-21
Created_Date:         2026-04-21
Status:                SPECIFICATION_COMPLETE | IN_DEVELOPMENT | DEPRECATED
Maturity_Level:       ALPHA | BETA | STABLE | PRODUCTION
Release_Blocking:     TRUE | FALSE [Is this mandatory for release?]
Critical_Skill:       YES | NO [Is this critical to system?]
```

---

## SECTION 20: COMPLIANCE & GOVERNANCE

```
Policy_Compliance:    [Which policies must be followed]
Legal_Requirements:   [Any legal/regulatory requirements]
Security_Requirements: [Security controls needed]
Privacy_Requirements: [Privacy/data handling requirements]
Audit_Requirements:   [Audit trails and logging needed]
```

---

## USING THIS TEMPLATE

**For each of the 218 skills, populate ALL sections above with NO COMPRESSION.**

**Expected output per skill:**
- 25-35 KB per skill file (comprehensive)
- All sections filled in (even if "N/A")
- Complete pseudocode for execution flow
- Concrete examples where applicable
- Full test cases defined
- Clear governance and authority specified

**Template not optional:**
- Every skill must have identical structure
- Consistency across all 218 skills
- Enables automated validation and testing
- Supports full system integration

---

**This template ensures every skill is FULLY SPECIFIED with all governance, routing, delegation, and operational details needed for production deployment.**

