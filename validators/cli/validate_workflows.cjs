#!/usr/bin/env node
/**
 * CLI wrapper for WorkflowValidator.
 * Runs runFullCheck() and exits non-zero if findings include errors.
 */

const WorkflowValidator = require('../workflow_validator.cjs');

const v = new WorkflowValidator();
const result = v.runFullCheck();

console.log('Workflow Validator (runFullCheck)');
console.log('='.repeat(60));
console.log(`overall_valid: ${result.overall_valid}`);
console.log(`findings: ${result.findings.length}`);

if (result.findings.length > 0) {
  console.log('\nFindings:');
  result.findings.forEach((f) => {
    console.log(`  [${f.severity}] ${f.code}: ${f.message}`);
  });
}

console.log('='.repeat(60));
console.log(`STATUS: ${result.overall_valid ? 'PASS' : 'FAIL'}`);
process.exit(result.overall_valid ? 0 : 1);
