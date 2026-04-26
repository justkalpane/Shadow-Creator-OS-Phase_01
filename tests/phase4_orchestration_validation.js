/**
 * PHASE-4 ORCHESTRATION VALIDATION
 * Tests WF-300 (Execution Context), WF-400 (Publishing), WF-500 (Analytics) pipelines
 * Verifies director binding resolution and skill orchestration for Phase-4 workflows
 */

const DirectorRuntimeRouter = require('../engine/directors/director_runtime_router.js');

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

/**
 * Test WF-300 Orchestration
 */
async function testWF300_ExecutionContextOrchestration() {
  console.log('\n=== TEST 1: WF-300 EXECUTION CONTEXT ORCHESTRATION ===');
  try {
    const director = new DirectorRuntimeRouter();

    const result = await director.executeChildWorkflow({
      workflow_pack: 'WF-300',
      child_workflow_id: 'CWF-310-execution-context-builder',
      dossier_id: 'PHASE4-TEST-001',
      context_packet: {
        final_script_packet: { instance_id: 'PKT-001', artifact_family: 'm218_packet' }
      },
      dossier_state: {}
    });

    if (result.status !== 'SUCCESS') {
      const details = result.failure_reason_code || 'Unknown';
      throw new Error(`WF-300 execution failed: ${result.status} (${details}) - ${JSON.stringify(result).substring(0, 200)}`);
    }

    if (!result.packet || result.packet.artifact_family !== 'm310_packet') {
      const family = result.packet ? result.packet.artifact_family : 'NO_PACKET';
      throw new Error(`Expected m310_packet, got ${family}`);
    }

    logTest('WF-300: Execution Context Orchestration', 'PASS', `CWF-310 emitted ${result.packet.artifact_family}`);
    return true;
  } catch (error) {
    logTest('WF-300: Execution Context Orchestration', 'FAIL', error.message);
    return false;
  }
}

/**
 * Test WF-400 Orchestration
 */
async function testWF400_PublishingPipelineOrchestration() {
  console.log('\n=== TEST 2: WF-400 PUBLISHING PIPELINE ORCHESTRATION ===');
  try {
    const director = new DirectorRuntimeRouter();

    const result = await director.executeChildWorkflow({
      workflow_pack: 'WF-400',
      child_workflow_id: 'CWF-410-thumbnail-generator',
      dossier_id: 'PHASE4-TEST-002',
      context_packet: {
        context_engineering_packet: { instance_id: 'PKT-002', artifact_family: 'm340_packet' },
        final_script_packet: { instance_id: 'PKT-003', artifact_family: 'm218_packet' }
      },
      dossier_state: {}
    });

    if (result.status !== 'SUCCESS') {
      const details = result.failure_reason_code || 'Unknown';
      throw new Error(`WF-400 execution failed: ${result.status} (${details})`);
    }

    if (!result.packet || result.packet.artifact_family !== 'm410_packet') {
      const family = result.packet ? result.packet.artifact_family : 'NO_PACKET';
      throw new Error(`Expected m410_packet, got ${family}`);
    }

    logTest('WF-400: Publishing Pipeline Orchestration', 'PASS', `CWF-410 emitted ${result.packet.artifact_family}`);
    return true;
  } catch (error) {
    logTest('WF-400: Publishing Pipeline Orchestration', 'FAIL', error.message);
    return false;
  }
}

/**
 * Test WF-500 Orchestration
 */
async function testWF500_AnalyticsPipelineOrchestration() {
  console.log('\n=== TEST 3: WF-500 ANALYTICS PIPELINE ORCHESTRATION ===');
  try {
    const director = new DirectorRuntimeRouter();

    const result = await director.executeChildWorkflow({
      workflow_pack: 'WF-500',
      child_workflow_id: 'CWF-510-platform-metadata-generator',
      dossier_id: 'PHASE4-TEST-003',
      context_packet: {
        media_production_packet: { instance_id: 'PKT-004', artifact_family: 'm440_packet' }
      },
      dossier_state: {}
    });

    if (result.status !== 'SUCCESS') {
      const details = result.failure_reason_code || 'Unknown';
      throw new Error(`WF-500 execution failed: ${result.status} (${details})`);
    }

    if (!result.packet || result.packet.artifact_family !== 'm510_packet') {
      const family = result.packet ? result.packet.artifact_family : 'NO_PACKET';
      throw new Error(`Expected m510_packet, got ${family}`);
    }

    logTest('WF-500: Analytics Pipeline Orchestration', 'PASS', `CWF-510 emitted ${result.packet.artifact_family}`);
    return true;
  } catch (error) {
    logTest('WF-500: Analytics Pipeline Orchestration', 'FAIL', error.message);
    return false;
  }
}

/**
 * Test Director Contracts Coverage
 */
async function testDirectorContractsCoverage() {
  console.log('\n=== TEST 4: DIRECTOR CONTRACTS COVERAGE ===');
  try {
    const director = new DirectorRuntimeRouter();
    const contracts = director.childWorkflowContracts;

    const phase4Workflows = ['CWF-310-execution-context-builder', 'CWF-320-platform-packager', 'CWF-330-asset-brief-generator', 'CWF-340-lineage-validator',
      'CWF-410-thumbnail-generator', 'CWF-420-visual-asset-planner', 'CWF-430-audio-script-optimizer', 'CWF-440-media-package-finalizer',
      'CWF-510-platform-metadata-generator', 'CWF-520-distribution-planner', 'CWF-530-publish-readiness-checker'
    ];

    const missing = [];
    for (const workflow of phase4Workflows) {
      if (!contracts[workflow]) {
        missing.push(workflow);
      }
    }

    if (missing.length > 0) {
      throw new Error(`Missing contracts: ${missing.join(', ')}`);
    }

    logTest('Director Contracts Coverage', 'PASS', `All 11 Phase-4 workflows have contracts`);
    return true;
  } catch (error) {
    logTest('Director Contracts Coverage', 'FAIL', error.message);
    return false;
  }
}

/**
 * Test Binding File Resolution
 */
async function testBindingFileResolution() {
  console.log('\n=== TEST 5: BINDING FILE RESOLUTION ===');
  try {
    const director = new DirectorRuntimeRouter();

    // Test WF-300
    const path300 = director.resolveBindingPath('WF-300');
    if (!path300.includes('workflow_skill_binding_wf-300')) {
      throw new Error(`Invalid WF-300 path: ${path300}`);
    }

    // Test WF-400
    const path400 = director.resolveBindingPath('WF-400');
    if (!path400.includes('workflow_skill_binding_wf-400')) {
      throw new Error(`Invalid WF-400 path: ${path400}`);
    }

    // Test WF-500
    const path500 = director.resolveBindingPath('WF-500');
    if (!path500.includes('workflow_skill_binding_wf-500')) {
      throw new Error(`Invalid WF-500 path: ${path500}`);
    }

    logTest('Binding File Resolution', 'PASS', `All binding files resolve correctly`);
    return true;
  } catch (error) {
    logTest('Binding File Resolution', 'FAIL', error.message);
    return false;
  }
}

/**
 * Test Skill Registry Resolution
 */
async function testSkillRegistryResolution() {
  console.log('\n=== TEST 6: SKILL REGISTRY RESOLUTION ===');
  try {
    const director = new DirectorRuntimeRouter();

    // Test WF-300
    const reg300 = director.resolveRegistryPath('WF-300');
    if (!reg300.includes('skill_registry_wf-300')) {
      throw new Error(`Invalid WF-300 registry path: ${reg300}`);
    }

    // Test WF-400
    const reg400 = director.resolveRegistryPath('WF-400');
    if (!reg400.includes('skill_registry_wf-400')) {
      throw new Error(`Invalid WF-400 registry path: ${reg400}`);
    }

    // Test WF-500
    const reg500 = director.resolveRegistryPath('WF-500');
    if (!reg500.includes('skill_registry_wf-500')) {
      throw new Error(`Invalid WF-500 registry path: ${reg500}`);
    }

    logTest('Skill Registry Resolution', 'PASS', `All skill registries resolve correctly`);
    return true;
  } catch (error) {
    logTest('Skill Registry Resolution', 'FAIL', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  PHASE-4 ORCHESTRATION VALIDATION TESTS                       ║');
  console.log('║  Testing WF-300, WF-400, WF-500 director orchestration        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  try {
    await testDirectorContractsCoverage();
    await testBindingFileResolution();
    await testSkillRegistryResolution();
    await testWF300_ExecutionContextOrchestration();
    await testWF400_PublishingPipelineOrchestration();
    await testWF500_AnalyticsPipelineOrchestration();

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log(`║ RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED                                    ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝');

    if (testsFailed === 0) {
      console.log('\n✓ ALL PHASE-4 TESTS PASSED');
      console.log('✓ WF-300, WF-400, WF-500 are OPERATIONALLY READY');
      return true;
    } else {
      console.log(`\n✗ ${testsFailed} TEST(S) FAILED`);
      return false;
    }
  } catch (error) {
    console.error('\n✗ TEST SUITE FAILED:', error.message);
    return false;
  }
}

if (require.main === module) {
  runAllTests().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runAllTests };
