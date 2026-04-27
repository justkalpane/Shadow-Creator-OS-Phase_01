#!/usr/bin/env node
/**
 * CLI wrapper for SchemaValidator.
 * Runs runFullCheck() and exits non-zero on schema/binding errors.
 */

const SchemaValidator = require('../schema_validator.cjs');

const v = new SchemaValidator();
const result = v.runFullCheck();

console.log('Schema Validator (runFullCheck)');
console.log('='.repeat(60));
console.log(`overall_valid: ${result.overall_valid}`);
console.log(`schema_registry_valid: ${result.schema_registry_check.valid}`);
console.log(`binding_check_valid: ${result.binding_check.valid}`);
console.log(`findings: ${result.findings.length}`);

if (result.findings.length > 0) {
  console.log('\nFindings:');
  result.findings.slice(0, 30).forEach((f) => {
    console.log(`  [${f.severity}] ${f.code}: ${f.message}`);
  });
  if (result.findings.length > 30) {
    console.log(`  ... and ${result.findings.length - 30} more`);
  }
}

console.log('='.repeat(60));
console.log(`STATUS: ${result.overall_valid ? 'PASS' : 'FAIL'}`);
process.exit(result.overall_valid ? 0 : 1);
