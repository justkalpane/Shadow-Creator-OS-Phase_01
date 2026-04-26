/**
 * PHASE-3 FINAL VALIDATION RUNNER
 * Executes all validation test suites in sequence
 * Produces master validation report
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let validationLog = [];
let totalTestsPassed = 0;
let totalTestsFailed = 0;

function logPhase(phase, status) {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] ${phase}`);
  validationLog.push({ timestamp, phase, status });
}

function runTest(testName, testFile) {
  logPhase(`RUNNING: ${testName}`, 'START');
  try {
    const output = execSync(`node ${testFile}`, { encoding: 'utf8', stdio: 'pipe' });
    console.log(output);
    
    // Parse test results
    const passMatch = output.match(/RESULTS:\s+(\d+)\s+PASSED/);
    const failMatch = output.match(/(\d+)\s+FAILED/);
    
    const passed = passMatch ? parseInt(passMatch[1]) : 0;
    const failed = failMatch ? parseInt(failMatch[1]) : 0;
    
    totalTestsPassed += passed;
    totalTestsFailed += failed;
    
    if (failed === 0) {
      logPhase(`✅ ${testName}: ${passed} PASSED`, 'PASS');
      return true;
    } else {
      logPhase(`❌ ${testName}: ${passed} PASSED, ${failed} FAILED`, 'FAIL');
      return false;
    }
  } catch (error) {
    console.error(`❌ ERROR running ${testName}:`, error.message);
    logPhase(`❌ ${testName}: EXECUTION ERROR`, 'ERROR');
    totalTestsFailed++;
    return false;
  }
}

async function runPhase3Validation() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║          PHASE-3 FINAL VALIDATION - EXECUTION START             ║');
  console.log('║     All test suites will execute sequentially with results      ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  const startTime = Date.now();

  // Test Suite 1: Critical Blockers
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SUITE 1: CRITICAL BLOCKER FIXES (P0)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const blockersPassed = runTest('Blocker Fixes Unit Tests', 'tests/blocker_fixes_unit.js');

  // Test Suite 2: Agent Behavior
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SUITE 2: AGENT BEHAVIOR REGRESSION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const agentsPassed = runTest('Agent Behavior Regression Tests', 'tests/agent_behavior_regression.js');

  // Test Suite 3: Sub-Skill Integration
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SUITE 3: SUB-SKILL INTEGRATION VALIDATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const subskillsPassed = runTest('Sub-Skill Integration Tests', 'tests/subskill_integration_validation.js');

  // Test Suite 4: Sub-Agent Integration
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SUITE 4: SUB-AGENT INTEGRATION VALIDATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const subagentsPassed = runTest('Sub-Agent Integration Tests', 'tests/subagent_integration_validation.js');

  // Test Suite 5: End-to-End Runtime Verification
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SUITE 5: END-TO-END RUNTIME VERIFICATION (Full Pipeline)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const e2ePassed = runTest('End-to-End Verification', 'tests/run_phase1_end_to_end_verification.js');

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);

  // Final Summary
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║              PHASE-3 FINAL VALIDATION - SUMMARY                 ║');
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log(`║ Total Tests Executed:    ${totalTestsPassed + totalTestsFailed} tests`);
  console.log(`║ Total Tests Passed:      ${totalTestsPassed} tests ✅`);
  console.log(`║ Total Tests Failed:      ${totalTestsFailed} tests ${totalTestsFailed > 0 ? '❌' : ''}`);
  console.log(`║ Success Rate:            ${totalTestsFailed === 0 ? '100%' : Math.round((totalTestsPassed / (totalTestsPassed + totalTestsFailed)) * 100) + '%'}`);
  console.log(`║ Total Execution Time:    ${totalTime} seconds`);
  console.log('╠════════════════════════════════════════════════════════════════╣');
  console.log(`║ Blocker Fixes (P0):      ${blockersPassed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`║ Agent Behavior:          ${agentsPassed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`║ Sub-Skill Integration:   ${subskillsPassed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`║ Sub-Agent Integration:   ${subagentsPassed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`║ End-to-End Runtime:      ${e2ePassed ? '✅ PASS' : '❌ FAIL'}`);
  console.log('╚════════════════════════════════════════════════════════════════╝');

  if (totalTestsFailed === 0) {
    console.log('\n✅ PHASE-3 FINAL VALIDATION: ALL TESTS PASSED');
    console.log('✅ Phase-1 repository is DEPLOYMENT-READY');
    return true;
  } else {
    console.log(`\n❌ PHASE-3 FINAL VALIDATION: ${totalTestsFailed} TEST(S) FAILED`);
    console.log('⚠️  Review failures above before deployment');
    return false;
  }
}

runPhase3Validation().then((success) => {
  process.exit(success ? 0 : 1);
});
