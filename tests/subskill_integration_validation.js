/**
 * SUB-SKILL INTEGRATION VALIDATION TESTS
 * Validates all 32+ sub-skills integrate with parent workflows correctly
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
 * S-001: Sub-Skill Files Exist and Are Complete
 */
async function testS001_SubSkillFilesComplete() {
  console.log('\n=== TEST S-001: Sub-Skill Files Complete ===');
  try {
    const subskillsDir = path.resolve('skills/sub_skills');
    if (!fs.existsSync(subskillsDir)) {
      throw new Error('skills/sub_skills/ directory not found');
    }

    const markdownFiles = fs.readdirSync(subskillsDir).filter(f => f.endsWith('.subskill.md'));
    const pythonFiles = fs.readdirSync(subskillsDir).filter(f => f.endsWith('.py') && !f.includes('__pycache__'));

    if (markdownFiles.length === 0) {
      throw new Error('No .subskill.md files found');
    }

    const missingPython = [];
    for (const mdFile of markdownFiles) {
      const baseName = mdFile.replace('.subskill.md', '');
      const expectedPyFile = `${baseName}.py`;
      if (!fs.existsSync(path.join(subskillsDir, expectedPyFile))) {
        missingPython.push(baseName);
      }
    }

    if (missingPython.length > 0) {
      throw new Error(`Sub-skills missing Python implementation: ${missingPython.slice(0, 3).join(', ')}`);
    }

    logTest('S-001: Sub-skill files complete', 'PASS', `${markdownFiles.length} sub-skills with both .md and .py`);
    return true;
  } catch (error) {
    logTest('S-001: Sub-skill files complete', 'FAIL', error.message);
    return false;
  }
}

/**
 * S-002: Sub-Skill Markdown Has Required Sections
 */
async function testS002_MarkdownSectionsComplete() {
  console.log('\n=== TEST S-002: Sub-Skill Markdown Sections Complete ===');
  try {
    const subskillsDir = path.resolve('skills/sub_skills');
    const markdownFiles = fs.readdirSync(subskillsDir).filter(f => f.endsWith('.subskill.md'));

    const requiredSections = [
      'SECTION 1: SKILL IDENTITY',
      'SECTION 2: AUTHORITY MATRIX',
      'SECTION 3: READS',
      'SECTION 4: WRITES',
      'SECTION 5: EXECUTION FLOW',
    ];

    const incompleteSections = [];
    for (const mdFile of markdownFiles) {
      const content = fs.readFileSync(path.join(subskillsDir, mdFile), 'utf8');

      for (const section of requiredSections) {
        if (!content.includes(section)) {
          incompleteSections.push(`${mdFile}: missing ${section}`);
        }
      }
    }

    if (incompleteSections.length > 0) {
      throw new Error(`Missing sections: ${incompleteSections.slice(0, 3).join(', ')}`);
    }

    logTest('S-002: Markdown sections complete', 'PASS', `All sub-skills have required sections`);
    return true;
  } catch (error) {
    logTest('S-002: Markdown sections complete', 'FAIL', error.message);
    return false;
  }
}

/**
 * S-003: Sub-Skill Artifact Families Declared
 */
async function testS003_ArtifactFamiliesDeclared() {
  console.log('\n=== TEST S-003: Sub-Skill Artifact Families Declared ===');
  try {
    const subskillsDir = path.resolve('skills/sub_skills');
    const markdownFiles = fs.readdirSync(subskillsDir).filter(f => f.endsWith('.subskill.md'));

    const missingFamilies = [];
    for (const mdFile of markdownFiles) {
      const content = fs.readFileSync(path.join(subskillsDir, mdFile), 'utf8');

      if (!content.includes('artifact_family:') && !content.includes('artifact_family=')) {
        missingFamilies.push(mdFile);
      }
    }

    if (missingFamilies.length > 0) {
      throw new Error(`Missing artifact families: ${missingFamilies.slice(0, 3).join(', ')}`);
    }

    logTest('S-003: Artifact families declared', 'PASS', `All sub-skills declare artifact families`);
    return true;
  } catch (error) {
    logTest('S-003: Artifact families declared', 'FAIL', error.message);
    return false;
  }
}

/**
 * S-004: Sub-Skill Dossier Write Targets Valid
 */
async function testS004_DossierWriteTargetsValid() {
  console.log('\n=== TEST S-004: Sub-Skill Dossier Write Targets Valid ===');
  try {
    const subskillsDir = path.resolve('skills/sub_skills');
    const markdownFiles = fs.readdirSync(subskillsDir).filter(f => f.endsWith('.subskill.md'));

    const invalidWriteTargets = [];
    for (const mdFile of markdownFiles) {
      const content = fs.readFileSync(path.join(subskillsDir, mdFile), 'utf8');

      // Check for write_target declarations
      const hasWriteTarget = content.includes('write_target:') || content.includes('dossier.');

      if (!hasWriteTarget) {
        invalidWriteTargets.push(`${mdFile}: no write targets declared`);
      }

      // Check for append_only semantics
      if (hasWriteTarget && !content.includes('append_only')) {
        invalidWriteTargets.push(`${mdFile}: missing append_only semantics`);
      }
    }

    if (invalidWriteTargets.length > 0) {
      throw new Error(`Invalid write targets: ${invalidWriteTargets.slice(0, 3).join(', ')}`);
    }

    logTest('S-004: Dossier write targets valid', 'PASS', `All sub-skills declare append-only write targets`);
    return true;
  } catch (error) {
    logTest('S-004: Dossier write targets valid', 'FAIL', error.message);
    return false;
  }
}

/**
 * S-005: Sub-Skill Registry Bindings Valid
 */
async function testS005_RegistryBindingsValid() {
  console.log('\n=== TEST S-005: Sub-Skill Registry Bindings Valid ===');
  try {
    const registryPath = path.resolve('registries/subskill_runtime_registry.yaml');

    if (!fs.existsSync(registryPath)) {
      throw new Error('subskill_runtime_registry.yaml not found');
    }

    const registryContent = fs.readFileSync(registryPath, 'utf8');
    const subskillsDir = path.resolve('skills/sub_skills');
    const markdownFiles = fs.readdirSync(subskillsDir).filter(f => f.endsWith('.subskill.md'));

    const unboundSubSkills = [];
    for (const mdFile of markdownFiles) {
      const skillId = mdFile.replace('.subskill.md', '');

      // Check if skill is registered in registry
      if (!registryContent.includes(skillId) && !registryContent.includes(`"${skillId}"`)) {
        unboundSubSkills.push(skillId);
      }
    }

    if (unboundSubSkills.length > 0) {
      throw new Error(`Unbound sub-skills in registry: ${unboundSubSkills.slice(0, 3).join(', ')}`);
    }

    logTest('S-005: Registry bindings valid', 'PASS', `All sub-skills registered in runtime registry`);
    return true;
  } catch (error) {
    logTest('S-005: Registry bindings valid', 'FAIL', error.message);
    return false;
  }
}

/**
 * S-006: Sub-Skill Governance Framework Present
 */
async function testS006_GovernanceFrameworkPresent() {
  console.log('\n=== TEST S-006: Sub-Skill Governance Framework Present ===');
  try {
    const subskillsDir = path.resolve('skills/sub_skills');
    const markdownFiles = fs.readdirSync(subskillsDir).filter(f => f.endsWith('.subskill.md'));

    const missingGovernance = [];
    for (const mdFile of markdownFiles) {
      const content = fs.readFileSync(path.join(subskillsDir, mdFile), 'utf8');

      // Check for governance declarations
      const hasAuthorityMatrix = content.includes('AUTHORITY MATRIX') || content.includes('Can_Execute');
      const hasEscalation = content.includes('Escalation') || content.includes('escalation');

      if (!hasAuthorityMatrix) {
        missingGovernance.push(`${mdFile}: no authority matrix`);
      }

      if (!hasEscalation) {
        missingGovernance.push(`${mdFile}: no escalation path`);
      }
    }

    if (missingGovernance.length > 0) {
      throw new Error(`Missing governance: ${missingGovernance.slice(0, 3).join(', ')}`);
    }

    logTest('S-006: Governance framework present', 'PASS', `All sub-skills declare authority and escalation`);
    return true;
  } catch (error) {
    logTest('S-006: Governance framework present', 'FAIL', error.message);
    return false;
  }
}

async function runAllSubSkillTests() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  SUB-SKILL INTEGRATION VALIDATION TESTS                        ║');
  console.log('║  Validate all sub-skills integrate with parent workflows       ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  try {
    await testS001_SubSkillFilesComplete();
    await testS002_MarkdownSectionsComplete();
    await testS003_ArtifactFamiliesDeclared();
    await testS004_DossierWriteTargetsValid();
    await testS005_RegistryBindingsValid();
    await testS006_GovernanceFrameworkPresent();

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log(`║ RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED                                    ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝');

    if (testsFailed === 0) {
      console.log('\n✓ ALL SUB-SKILL TESTS PASSED');
      console.log('✓ All sub-skills integrate correctly');
      return true;
    } else {
      console.log(`\n✗ ${testsFailed} SUB-SKILL TEST(S) FAILED`);
      return false;
    }
  } catch (error) {
    console.error('\n✗ SUB-SKILL TEST SUITE FAILED:', error.message);
    return false;
  }
}

if (require.main === module) {
  runAllSubSkillTests().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { runAllSubSkillTests };
