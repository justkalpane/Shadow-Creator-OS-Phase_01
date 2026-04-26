/**
 * UNIT TESTS FOR EACH P0/P1 BLOCKER FIX
 * Verify each fix works independently
 */

const SkillLoader = require('../engine/skill_loader/skill_loader.js');
const RegistryValidator = require('../validators/registry_validator.js');
const PacketRouter = require('../engine/packets/packet_router.js');

let testsPassed = 0;
let testsFailed = 0;

function logTest(name, status, detail = '') {
  const icon = status === 'PASS' ? '✓' : '✗';
  console.log(`${icon} ${name}`);
  if (detail) console.log(`  └─ ${detail}`);
  if (status === 'PASS') {
    testsPassed++;
  } else {
    testsFailed++;
  }
}

async function testI001_SkillParserExtractsOutputPacketFamily() {
  console.log('\n=== TEST I-001: Skill Parser Extracts Output Packet Family ===');
  try {
    const loader = new SkillLoader();
    const contract = loader.loadSkillContract('./skills/topic_discovery/M-001.skill.md', 'M-001');

    if (!contract.output_packet_family) {
      throw new Error('Parser did not extract output_packet_family');
    }
    if (contract.output_packet_family !== 'm001_packet') {
      throw new Error(`Expected m001_packet, got ${contract.output_packet_family}`);
    }

    logTest('I-001: Parser extracts output_packet_family', 'PASS', `m001_packet = ${contract.output_packet_family}`);
    return true;
  } catch (error) {
    logTest('I-001: Parser extracts output_packet_family', 'FAIL', error.message);
    return false;
  }
}

async function testI002_RegistryValidatorNoFalseErrors() {
  console.log('\n=== TEST I-002: Registry Validator Has No False Parity Errors ===');
  try {
    const validator = new RegistryValidator();
    const results = await validator.runFullCheck();

    const purityErrors = results.findings.filter(f => f.code === 'OUTPUT_PACKET_FAMILY_PARITY_DRIFT');

    if (purityErrors.length > 0) {
      throw new Error(`Found ${purityErrors.length} false parity errors`);
    }

    logTest('I-002: Registry validator produces no false errors', 'PASS', `0 parity errors`);
    return true;
  } catch (error) {
    logTest('I-002: Registry validator produces no false errors', 'FAIL', error.message);
    return false;
  }
}

async function testI003_ExecutorOutputNormalized() {
  console.log('\n=== TEST I-003: Executor Output Normalization ===');
  try {
    const loader = new SkillLoader();
    await loader.initialize();

    const result = await loader.executeSkill('M-001', { dossier_id: 'TEST' }, {});

    if (result.status !== 'SUCCESS') {
      throw new Error(`Execution failed: ${result.status} - ${result.error}`);
    }

    if (result.output.artifact_family !== 'm001_packet') {
      throw new Error(`Expected m001_packet, got ${result.output.artifact_family}`);
    }

    if (!result.output.schema_version) {
      throw new Error('Missing schema_version');
    }

    logTest('I-003: Executor output normalized to mXXX_packet', 'PASS', `m001_packet with schema_version`);
    return true;
  } catch (error) {
    logTest('I-003: Executor output normalized to mXXX_packet', 'FAIL', error.message);
    return false;
  }
}

async function testI004_PacketRouterForwardRoutes() {
  console.log('\n=== TEST I-004: Packet Router Has Forward Routes ===');
  try {
    const loader = new SkillLoader();
    await loader.initialize();

    const skillResult = await loader.executeSkill('M-001', { dossier_id: 'TEST' }, {});
    const router = new PacketRouter();
    await router.loadBindings('registries/workflow_bindings.yaml');

    const route = router.route(skillResult.output);

    if (!route.next_workflow) {
      throw new Error('No next_workflow returned');
    }

    if (route.next_workflow === 'WF-900') {
      throw new Error('Incorrectly routed to WF-900 instead of forward workflow');
    }

    if (route.next_workflow !== 'CWF-110') {
      throw new Error(`Expected CWF-110, got ${route.next_workflow}`);
    }

    logTest('I-004: Packet router has valid forward routes', 'PASS', `M-001 → CWF-110`);
    return true;
  } catch (error) {
    logTest('I-004: Packet router has valid forward routes', 'FAIL', error.message);
    return false;
  }
}

async function testI005_WorkflowsCallRealSkillLoader() {
  console.log('\n=== TEST I-005: Workflows Call Real Skill Loader ===');
  try {
    const fs = require('fs');
    const path = require('path');

    const cwf110Path = path.resolve('n8n/workflows/CWF-110.json');
    const workflow = JSON.parse(fs.readFileSync(cwf110Path, 'utf8'));

    const skillExecNode = workflow.nodes.find(n => n.id === 'cwf-110_skill_execution_node');

    if (!skillExecNode) {
      throw new Error('Skill Execution Node not found');
    }

    const jsCode = skillExecNode.parameters.jsCode;

    if (!jsCode.includes('SkillLoader')) {
      throw new Error('Workflow does not call SkillLoader');
    }

    if (!jsCode.includes('executeSkill')) {
      throw new Error('Workflow does not call executeSkill method');
    }

    logTest('I-005: Workflows call real skill_loader', 'PASS', `CWF-110 calls SkillLoader.executeSkill()`);
    return true;
  } catch (error) {
    logTest('I-005: Workflows call real skill_loader', 'FAIL', error.message);
    return false;
  }
}

async function testI006_DirectorUsesCanonicalFamilies() {
  console.log('\n=== TEST I-006: Director Uses Canonical Packet Families ===');
  try {
    const DirectorRouter = require('../engine/directors/director_runtime_router.js');
    const director = new DirectorRouter();

    // Check childWorkflowContracts have canonical families
    const contracts = director.childWorkflowContracts;

    const invalidFamilies = [];
    for (const [workflow, contract] of Object.entries(contracts)) {
      if (!contract.artifact_family.match(/^m\d{3}_packet$/)) {
        invalidFamilies.push(`${workflow}: ${contract.artifact_family}`);
      }
    }

    if (invalidFamilies.length > 0) {
      throw new Error(`Non-canonical families found: ${invalidFamilies.join(', ')}`);
    }

    logTest('I-006: Director uses canonical packet families', 'PASS', `All 8+ workflows use mXXX_packet format`);
    return true;
  } catch (error) {
    logTest('I-006: Director uses canonical packet families', 'FAIL', error.message);
    return false;
  }
}

async function testI007_EndToEndTestIsRealRuntime() {
  console.log('\n=== TEST I-007: End-to-End Test Exercises Real Runtime ===');
  try {
    const fs = require('fs');
    const path = require('path');

    const testPath = path.resolve('tests/run_phase1_end_to_end_verification.js');
    const testContent = fs.readFileSync(testPath, 'utf8');

    // Verify test file uses real runtime components
    if (!testContent.includes('SkillLoader')) {
      throw new Error('Test does not use real SkillLoader');
    }

    if (!testContent.includes('RegistryValidator')) {
      throw new Error('Test does not use real RegistryValidator');
    }

    if (!testContent.includes('PacketRouter')) {
      throw new Error('Test does not use real PacketRouter');
    }

    if (!testContent.includes('DirectorRuntimeRouter')) {
      throw new Error('Test does not use real DirectorRuntimeRouter');
    }

    // Old test used inline code execution
    if (testContent.includes('new Function')) {
      throw new Error('Test still uses inline Function execution (old shallow test)');
    }

    logTest('I-007: End-to-end test exercises real runtime', 'PASS', `Tests use actual components`);
    return true;
  } catch (error) {
    logTest('I-007: End-to-end test exercises real runtime', 'FAIL', error.message);
    return false;
  }
}

async function testI008_RepositoryHygiene() {
  console.log('\n=== TEST I-008: Repository Hygiene ===');
  try {
    const fs = require('fs');
    const path = require('path');

    // Check local settings are removed from tracking
    const localSettingsPath = path.resolve('.claude/settings.local.json');
    const gitignorePath = path.resolve('.gitignore');
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');

    if (!gitignore.includes('.claude/settings.local.json')) {
      throw new Error('.claude/settings.local.json not in .gitignore');
    }

    if (!gitignore.includes('tmp_audit/')) {
      throw new Error('tmp_audit/ not in .gitignore');
    }

    // Check for duplicate *.backup entries
    const backupCount = (gitignore.match(/\*\.backup/g) || []).length;
    if (backupCount > 1) {
      throw new Error(`Duplicate *.backup entries in .gitignore (found ${backupCount})`);
    }

    logTest('I-008: Repository hygiene fixed', 'PASS', `Settings ignored, tmp_audit ignored, no duplicates`);
    return true;
  } catch (error) {
    logTest('I-008: Repository hygiene fixed', 'FAIL', error.message);
    return false;
  }
}

async function runAllUnitTests() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  UNIT TESTS FOR P0/P1 BLOCKER FIXES                           ║');
  console.log('║  Verify each fix works independently                          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  try {
    await testI001_SkillParserExtractsOutputPacketFamily();
    await testI002_RegistryValidatorNoFalseErrors();
    await testI003_ExecutorOutputNormalized();
    await testI004_PacketRouterForwardRoutes();
    await testI005_WorkflowsCallRealSkillLoader();
    await testI006_DirectorUsesCanonicalFamilies();
    await testI007_EndToEndTestIsRealRuntime();
    await testI008_RepositoryHygiene();

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log(`║ RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED                                    ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝');

    if (testsFailed === 0) {
      console.log('\n✓ ALL UNIT TESTS PASSED');
      console.log('✓ All blocker fixes verified independently');
      return true;
    } else {
      console.log(`\n✗ ${testsFailed} UNIT TEST(S) FAILED`);
      return false;
    }
  } catch (error) {
    console.error('\n✗ UNIT TEST SUITE FAILED:', error.message);
    return false;
  }
}

if (require.main === module) {
  runAllUnitTests().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runAllUnitTests };
