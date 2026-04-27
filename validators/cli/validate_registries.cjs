#!/usr/bin/env node
/**
 * CLI wrapper for RegistryValidator.
 * Runs runFullCheck() and exits non-zero on registry inconsistencies.
 */

const RegistryValidator = require('../registry_validator.cjs');

const v = new RegistryValidator();
const result = v.runFullCheck();

console.log('Registry Validator (runFullCheck)');
console.log('='.repeat(60));
console.log(`overall_valid: ${result.overall_valid}`);
console.log(`findings: ${result.findings.length}`);

if (result.findings.length > 0) {
  console.log('\nFindings:');
  result.findings.slice(0, 50).forEach((f) => {
    const severity = f.severity || 'unknown';
    const code = f.code || 'NO_CODE';
    const message = f.message || JSON.stringify(f);
    console.log(`  [${severity}] ${code}: ${message}`);
  });
  if (result.findings.length > 50) {
    console.log(`  ... and ${result.findings.length - 50} more`);
  }
}

console.log('='.repeat(60));
console.log(`STATUS: ${result.overall_valid ? 'PASS' : 'FAIL'}`);
process.exit(result.overall_valid ? 0 : 1);
