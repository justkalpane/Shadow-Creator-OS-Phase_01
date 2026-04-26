/**
 * SUB-AGENT INTEGRATION VALIDATION TESTS
 * Validates all 36+ sub-agents integrate with orchestration correctly
 */

const fs = require('fs');
const path = require('path');

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
 * A-001: Sub-Agent Directory Structure Valid
 */
async function testA001_DirectoryStructureValid() {
  console.log('\n=== TEST A-001: Sub-Agent Directory Structure Valid ===');
  try {
    const subagentsDir = path.resolve('sub_agents');
    if (!fs.existsSync(subagentsDir)) {
      throw new Error('sub_agents/ directory not found');
    }

    const subdirs = fs.readdirSync(subagentsDir).filter(f => {
      const stat = fs.statSync(path.join(subagentsDir, f));
      return stat.isDirectory() && f !== '__pycache__';
    });

    if (subdirs.length === 0) {
      throw new Error('No sub-agent directories found');
    }

    const invalidStructure = [];
    for (const agentDir of subdirs) {
      const agentPyPath = path.join(subagentsDir, agentDir, `${agentDir}_sub_agent.py`);
      if (!fs.existsSync(agentPyPath)) {
        invalidStructure.push(`${agentDir}: missing ${agentDir}_sub_agent.py`);
      }
    }

    if (invalidStructure.length > 0) {
      throw new Error(`Invalid structure: ${invalidStructure.slice(0, 3).join(', ')}`);
    }

    logTest('A-001: Sub-agent directory structure valid', 'PASS', `${subdirs.length} sub-agents with proper structure`);
    return true;
  } catch (error) {
    logTest('A-001: Sub-agent directory structure valid', 'FAIL', error.message);
    return false;
  }
}

/**
 * A-002: Sub-Agent Classes Extend WorkflowSubAgentBase
 */
async function testA002_SubAgentClassInheritance() {
  console.log('\n=== TEST A-002: Sub-Agent Class Inheritance ===');
  try {
    const subagentsDir = path.resolve('sub_agents');
    const subdirs = fs.readdirSync(subagentsDir).filter(f => {
      const stat = fs.statSync(path.join(subagentsDir, f));
      return stat.isDirectory() && f !== '__pycache__';
    });

    const invalidInheritance = [];
    for (const agentDir of subdirs) {
      const agentPyPath = path.join(subagentsDir, agentDir, `${agentDir}_sub_agent.py`);
      const content = fs.readFileSync(agentPyPath, 'utf8');

      if (!content.includes('WorkflowSubAgentBase')) {
        invalidInheritance.push(agentDir);
      }

      if (!content.includes('def __init__')) {
        invalidInheritance.push(`${agentDir}: missing __init__`);
      }
    }

    if (invalidInheritance.length > 0) {
      throw new Error(`Invalid inheritance: ${invalidInheritance.slice(0, 3).join(', ')}`);
    }

    logTest('A-002: Sub-agent class inheritance correct', 'PASS', `All sub-agents extend WorkflowSubAgentBase`);
    return true;
  } catch (error) {
    logTest('A-002: Sub-agent class inheritance correct', 'FAIL', error.message);
    return false;
  }
}

/**
 * A-003: Workflow Slugs Correctly Mapped
 */
async function testA003_WorkflowSlugsCorrect() {
  console.log('\n=== TEST A-003: Workflow Slugs Correctly Mapped ===');
  try {
    const subagentsDir = path.resolve('sub_agents');
    const subdirs = fs.readdirSync(subagentsDir).filter(f => {
      const stat = fs.statSync(path.join(subagentsDir, f));
      return stat.isDirectory() && f !== '__pycache__';
    });

    const workflowManifestsPath = path.resolve('n8n/workflows');
    const validWorkflowIds = fs.readdirSync(workflowManifestsPath)
      .filter(f => f.endsWith('.yaml') || f.endsWith('.json'))
      .map(f => f.replace(/\.(yaml|json)$/, '').toLowerCase());

    const missingWorkflows = [];
    for (const agentDir of subdirs) {
      const agentPyPath = path.join(subagentsDir, agentDir, `${agentDir}_sub_agent.py`);
      const content = fs.readFileSync(agentPyPath, 'utf8');

      const slugMatch = content.match(/workflow_slug\s*=\s*"([^"]+)"/);
      if (!slugMatch) {
        missingWorkflows.push(`${agentDir}: no workflow_slug declared`);
        continue;
      }

      const slug = slugMatch[1];
      // Verify workflow slug corresponds to a workflow
      if (!validWorkflowIds.includes(slug.toLowerCase()) &&
          !slug.match(/^(cwf|wf)_\d+$/i)) {
        missingWorkflows.push(`${agentDir}: invalid slug ${slug}`);
      }
    }

    if (missingWorkflows.length > 0) {
      throw new Error(`Invalid workflow slugs: ${missingWorkflows.slice(0, 3).join(', ')}`);
    }

    logTest('A-003: Workflow slugs correctly mapped', 'PASS', `All sub-agents map to valid workflows`);
    return true;
  } catch (error) {
    logTest('A-003: Workflow slugs correctly mapped', 'FAIL', error.message);
    return false;
  }
}

/**
 * A-004: Sub-Agent Timeout/Retry Configuration Valid
 */
async function testA004_SubAgentConfigValid() {
  console.log('\n=== TEST A-004: Sub-Agent Configuration Valid ===');
  try {
    const subagentsDir = path.resolve('sub_agents');
    const subdirs = fs.readdirSync(subagentsDir).filter(f => {
      const stat = fs.statSync(path.join(subagentsDir, f));
      return stat.isDirectory() && f !== '__pycache__';
    });

    const invalidConfig = [];
    for (const agentDir of subdirs) {
      const agentPyPath = path.join(subagentsDir, agentDir, `${agentDir}_sub_agent.py`);
      const content = fs.readFileSync(agentPyPath, 'utf8');

      // Check timeout_seconds is in reasonable range (0.5 to 30 seconds)
      const timeoutMatch = content.match(/timeout_seconds:\s*float\s*=\s*([\d.]+)/);
      if (timeoutMatch) {
        const timeout = parseFloat(timeoutMatch[1]);
        if (timeout < 0.5 || timeout > 30) {
          invalidConfig.push(`${agentDir}: timeout ${timeout}s out of range`);
        }
      }

      // Check max_retries is in reasonable range (0 to 5)
      const retriesMatch = content.match(/max_retries:\s*int\s*=\s*(\d+)/);
      if (retriesMatch) {
        const retries = parseInt(retriesMatch[1]);
        if (retries < 0 || retries > 5) {
          invalidConfig.push(`${agentDir}: retries ${retries} out of range`);
        }
      }

      // Check backoff is in reasonable range (0.1 to 2.0)
      const backoffMatch = content.match(/backoff_seconds:\s*float\s*=\s*([\d.]+)/);
      if (backoffMatch) {
        const backoff = parseFloat(backoffMatch[1]);
        if (backoff < 0.1 || backoff > 2.0) {
          invalidConfig.push(`${agentDir}: backoff ${backoff}s out of range`);
        }
      }
    }

    if (invalidConfig.length > 0) {
      throw new Error(`Invalid configs: ${invalidConfig.slice(0, 3).join(', ')}`);
    }

    logTest('A-004: Sub-agent configuration valid', 'PASS', `All sub-agents have valid timeout/retry ranges`);
    return true;
  } catch (error) {
    logTest('A-004: Sub-agent configuration valid', 'FAIL', error.message);
    return false;
  }
}

/**
 * A-005: Sub-Agent Registry Bindings Valid
 */
async function testA005_RegistryBindingsValid() {
  console.log('\n=== TEST A-005: Sub-Agent Registry Bindings Valid ===');
  try {
    const registryPath = path.resolve('sub_agents/SUB_AGENT_RUNTIME_REGISTRY.yaml');

    if (!fs.existsSync(registryPath)) {
      throw new Error('SUB_AGENT_RUNTIME_REGISTRY.yaml not found');
    }

    const registryContent = fs.readFileSync(registryPath, 'utf8');
    const subagentsDir = path.resolve('sub_agents');
    const subdirs = fs.readdirSync(subagentsDir).filter(f => {
      const stat = fs.statSync(path.join(subagentsDir, f));
      return stat.isDirectory() && f !== '__pycache__';
    });

    const unboundSubAgents = [];
    for (const agentDir of subdirs) {
      // Check if sub-agent is registered in registry
      if (!registryContent.includes(agentDir) && !registryContent.includes(`"${agentDir}"`)) {
        unboundSubAgents.push(agentDir);
      }
    }

    if (unboundSubAgents.length > 0) {
      throw new Error(`Unbound sub-agents in registry: ${unboundSubAgents.slice(0, 3).join(', ')}`);
    }

    logTest('A-005: Registry bindings valid', 'PASS', `All sub-agents registered in runtime registry`);
    return true;
  } catch (error) {
    logTest('A-005: Registry bindings valid', 'FAIL', error.message);
    return false;
  }
}

/**
 * A-006: Sub-Agent Main Entry Points Present
 */
async function testA006_MainEntryPointsPresent() {
  console.log('\n=== TEST A-006: Sub-Agent Main Entry Points Present ===');
  try {
    const subagentsDir = path.resolve('sub_agents');
    const subdirs = fs.readdirSync(subagentsDir).filter(f => {
      const stat = fs.statSync(path.join(subagentsDir, f));
      return stat.isDirectory() && f !== '__pycache__';
    });

    const missingMain = [];
    for (const agentDir of subdirs) {
      const agentPyPath = path.join(subagentsDir, agentDir, `${agentDir}_sub_agent.py`);
      const content = fs.readFileSync(agentPyPath, 'utf8');

      if (!content.includes('if __name__ == "__main__"')) {
        missingMain.push(agentDir);
      }

      if (!content.includes('print_run')) {
        missingMain.push(`${agentDir}: missing print_run call`);
      }
    }

    if (missingMain.length > 0) {
      throw new Error(`Missing entry points: ${missingMain.slice(0, 3).join(', ')}`);
    }

    logTest('A-006: Main entry points present', 'PASS', `All sub-agents have __main__ blocks`);
    return true;
  } catch (error) {
    logTest('A-006: Main entry points present', 'FAIL', error.message);
    return false;
  }
}

async function runAllSubAgentTests() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  SUB-AGENT INTEGRATION VALIDATION TESTS                        ║');
  console.log('║  Validate all sub-agents integrate with orchestration          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  try {
    await testA001_DirectoryStructureValid();
    await testA002_SubAgentClassInheritance();
    await testA003_WorkflowSlugsCorrect();
    await testA004_SubAgentConfigValid();
    await testA005_RegistryBindingsValid();
    await testA006_MainEntryPointsPresent();

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log(`║ RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED                                    ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝');

    if (testsFailed === 0) {
      console.log('\n✓ ALL SUB-AGENT TESTS PASSED');
      console.log('✓ All sub-agents integrate correctly');
      return true;
    } else {
      console.log(`\n✗ ${testsFailed} SUB-AGENT TEST(S) FAILED`);
      return false;
    }
  } catch (error) {
    console.error('\n✗ SUB-AGENT TEST SUITE FAILED:', error.message);
    return false;
  }
}

if (require.main === module) {
  runAllSubAgentTests().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runAllSubAgentTests };
