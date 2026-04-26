# RUNBOOK_PHASE1_EXECUTION

## 1. Purpose

This runbook defines the deterministic execution and validation procedure for the Phase-1 acceptance-closed canonical scope in `C:\ShadowEmpire-Git`.

Scope covered by this runbook:
- Required canonical workflow set: `CWF-110`, `CWF-120`, `CWF-130`, `CWF-140`, `CWF-210`, `CWF-220`, `CWF-230`, `CWF-240`, `WF-020`, `WF-021`
- Canonical skill registry scope currently bound: `218` skills
- Runtime engine modules: `skill_loader`, `dossier`, `packets`, `approval`
- Validators: `workflow_validator.js`, `schema_validator.js`, `registry_validator.js`, `runtime_validator.js`

This runbook reflects accepted closure for the authoritative 218-skill scope and 30-director binding target.

## 2. Preconditions

1. Repository checked out at `C:\ShadowEmpire-Git`.
2. Node.js available (`node -v`).
3. Required canonical registries present:
   - `registries/skill_registry.yaml`
   - `registries/workflow_bindings.yaml`
   - `registries/schema_registry.yaml`
   - `registries/director_binding.yaml`
   - `registries/provider_registry.yaml`
   - `registries/mode_registry.yaml`
   - `registries/governance_rules.yaml`
4. Required workflow JSONs present in `n8n/workflows/`.
5. Runtime engine and validator files present.

## 3. Governance and Mutation Controls

Mandatory controls for execution:
1. Append-only dossier writes only.
2. Typed packet emission only (schema-bound).
3. Error escalation route: `WF-900`.
4. Replay/remodify route: `WF-021`.
5. Deterministic execution only (no random runtime behavior in contract paths).

Mutation operations allowed:
- `append_to_array`
- `create_new_packet`
- `create_new_index_row`
- `append_audit_entry`

Forbidden mutation operations:
- overwrite
- replace
- delete
- remove
- historical packet mutation
- historical approval mutation

## 4. Canonical Flow Sequence

1. Intake/discovery stage:
   - `CWF-110` -> `CWF-120` -> `CWF-130`
2. Research gate stage:
   - Execute `CWF-140`.
   - Conditional gate by `M-020 research_confidence_score`:
     - if score `>= 0.85`, skip Phase-1C runtime branch and route toward script stage.
     - if score `< 0.85`, execute Phase-1C chain (`M-021..M-030`) before script stage continuation.
3. Script stage:
   - `CWF-210` -> `CWF-220` -> `CWF-230` -> `CWF-240`
4. Approval decision:
   - approve path -> `WF-020`
   - reject/remodify path -> `WF-021`
5. Error path from any stage:
   - route to `WF-900`

## 5. Operational Procedure

### Step 1: Preflight File Integrity

Run:

```powershell
node -e "const fs=require('fs');const req=['n8n/workflows/CWF-110.json','n8n/workflows/CWF-120.json','n8n/workflows/CWF-130.json','n8n/workflows/CWF-140.json','n8n/workflows/CWF-210.json','n8n/workflows/CWF-220.json','n8n/workflows/CWF-230.json','n8n/workflows/CWF-240.json','n8n/workflows/WF-020.json','n8n/workflows/WF-021.json'];const miss=req.filter(p=>!fs.existsSync(p));if(miss.length){console.error('Missing:',miss);process.exit(1)};console.log('Required workflows present:',req.length)"
```

### Step 2: Canonical Workflow Validation

Run:

```powershell
$code = @'
const WorkflowValidator=require('./validators/workflow_validator');
const path=require('path');
const v=new WorkflowValidator();
const ids=['CWF-110','CWF-120','CWF-130','CWF-140','CWF-210','CWF-220','CWF-230','CWF-240','WF-020','WF-021'];
const results=ids.map(id=>v.validateFile(path.resolve('n8n/workflows',`${id}.json`)));
const invalid=results.filter(r=>!r.valid);
if(invalid.length){console.error(JSON.stringify(invalid,null,2));process.exit(1)}
console.log(`Canonical workflow set valid: ${results.length}/${results.length}`);
'@; $code | node -
```

### Step 3: Registry + Schema Validation

Run:

```powershell
$code = @'
const RegistryValidator=require('./validators/registry_validator');
const SchemaValidator=require('./validators/schema_validator');
const reg=new RegistryValidator().runFullCheck();
const sch=new SchemaValidator().runFullCheck();
console.log(JSON.stringify({registry_overall_valid:reg.overall_valid,registry_findings:(reg.findings||[]).length,schema_overall_valid:sch.overall_valid,schema_findings:(sch.findings||[]).length},null,2));
'@; $code | node -
```

Interpretation:
- `schema_overall_valid` must be `true`.
- `registry_overall_valid` must be `true` for Phase-1 acceptance closure.

### Step 4: Runtime Contract Validation

Run:

```powershell
$code = @'
const RuntimeValidator=require('./validators/runtime_validator');
(async()=>{
  const v=new RuntimeValidator();
  const engine=v.scanRuntimeEngineContracts();
  const repo=await v.runRepositoryRuntimeCheck();
  console.log(JSON.stringify({engine_contract_valid:engine.valid,engine_findings:(engine.findings||[]).length,repo_runtime_valid:repo.overall_valid,repo_runtime_findings:(repo.findings||[]).length,scanned_dossiers:repo.scanned_dossiers},null,2));
})();
'@; $code | node -
```

Interpretation:
- `engine_contract_valid` must be `true`.
- Any `NON_APPEND_ONLY_DOSSIER_WRITE` must be treated as a release blocker and escalated to `WF-900` remediation.

### Step 5: n8n Import and Stage Execution

1. Import required workflow JSON files into n8n.
2. Wire credentials and environment values per existing n8n deployment policy.
3. Execute a controlled sample dossier through stage order in Section 4.
4. Confirm:
   - packet validation success at each stage,
   - dossier writes are append-only,
   - `se_packet_index` receives append rows,
   - error path reaches `WF-900` when forced failure is injected,
   - remodify path reaches `WF-021` on rejection.

## 6. Release Decision Rules

Do not mark Phase-1 complete unless all are true:
1. Skills accepted at required contract scope (`218` per handoff acceptance target).
2. Director bindings complete (`30`).
3. Full validator suite passes without critical findings.
4. Append-only mutation law passes repository runtime checks.
5. End-to-end sample run from intake to `WF-020` approval is validated.

Current canonical closure state satisfies these Phase-1 acceptance rules.

## 7. Incident and Rollback Handling

1. Any schema failure, routing failure, or mutation law violation: escalate to `WF-900`.
2. Any rejection/remodify decision: route to `WF-021`.
3. If deployment regression is introduced, revert the corresponding wave commit (do not perform destructive reset commands).

## 8. Environment Limitation Note

`python`/`py` commands are unavailable in the current shell environment, so Python `tests/validate_*.py` execution is blocked until Python runtime is installed or exposed.
