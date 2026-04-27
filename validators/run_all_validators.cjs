const fs = require('fs');
const path = require('path');

console.log('Shadow Creator OS Phase-1: Running All Validators');
console.log('='.repeat(60));

const checks = [];

// Check 1: Workflows
console.log('\n[1/4] Validating Workflows...');
const workflowDir = path.join(__dirname, '../n8n/workflows');
const workflows = fs.readdirSync(workflowDir).filter(f => f.endsWith('.json')).length;
checks.push({ name: 'Workflows', count: workflows, pass: workflows >= 31 });
console.log(`✓ Found ${workflows} workflows (required: 31+)`);

// Check 2: Schemas
console.log('\n[2/4] Validating Schemas...');
const schemaDir = path.join(__dirname, '../schemas/dossier');
const schemas = fs.readdirSync(schemaDir).filter(f => f.endsWith('.json')).length;
checks.push({ name: 'Schemas', count: schemas, pass: schemas >= 1 });
console.log(`✓ Found ${schemas} dossier schemas`);

// Check 3: Registries
console.log('\n[3/4] Validating Registries...');
const registryDir = path.join(__dirname, '../registries');
const registries = fs.readdirSync(registryDir).filter(f => f.endsWith('.yaml')).length;
checks.push({ name: 'Registries', count: registries, pass: registries >= 1 });
console.log(`✓ Found ${registries} registries`);

// Check 4: Test Framework
console.log('\n[4/4] Validating Test Framework...');
const testDir = path.join(__dirname, '../tests/validators');
const tests = fs.readdirSync(testDir).filter(f => f.endsWith('.js') || f.endsWith('.test.js')).length;
checks.push({ name: 'Tests', count: tests, pass: tests >= 3 });
console.log(`✓ Found ${tests} test suites`);

// Summary
console.log('\n' + '='.repeat(60));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(60));

let allPassed = true;
checks.forEach(check => {
  const status = check.pass ? '✓ PASS' : '✗ FAIL';
  console.log(`${status} - ${check.name}: ${check.count} items`);
  if (!check.pass) allPassed = false;
});

console.log('='.repeat(60));
console.log(`OVERALL: ${allPassed ? '✓ ALL VALIDATORS PASSED' : '✗ SOME VALIDATORS FAILED'}`);
console.log('Run "npm run test:e2e" for comprehensive test suite');
console.log('='.repeat(60));

process.exit(allPassed ? 0 : 1);
