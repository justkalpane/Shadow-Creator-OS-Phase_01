#!/usr/bin/env node
/**
 * Dossier Validator CLI
 * Validates each dossier in dossiers/ against the dossier_writer runtime model.
 * The runtime model uses: dossier_id, _version, _created_at, _audit_trail, packets.
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const dossierDir = path.join(repoRoot, 'dossiers');

if (!fs.existsSync(dossierDir)) {
  console.log('No dossiers directory present. Nothing to validate.');
  process.exit(0);
}

const files = fs.readdirSync(dossierDir).filter((f) => f.endsWith('.json'));

const results = [];
files.forEach((file) => {
  const filepath = path.join(dossierDir, file);
  const errors = [];
  let content;
  try {
    content = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (error) {
    results.push({ file, valid: false, errors: [`JSON parse error: ${error.message}`] });
    return;
  }

  if (!content.dossier_id) errors.push('Missing dossier_id');
  if (typeof content._version !== 'number') errors.push('Missing or non-numeric _version');
  if (!content._created_at) errors.push('Missing _created_at');
  if (!Array.isArray(content._audit_trail)) errors.push('Missing or non-array _audit_trail');

  // Append-only invariant: _version must be >= length of _audit_trail entries that are mutations
  if (Array.isArray(content._audit_trail) && content._version < content._audit_trail.length) {
    errors.push(`_version (${content._version}) is less than audit_trail entry count (${content._audit_trail.length})`);
  }

  results.push({ file, valid: errors.length === 0, errors });
});

const passed = results.filter((r) => r.valid).length;
const failed = results.length - passed;

console.log('Dossier Runtime Model Validator');
console.log('='.repeat(60));
console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) {
  console.log('\nFailures:');
  results.filter((r) => !r.valid).forEach((r) => {
    console.log(`  ${r.file}:`);
    r.errors.forEach((e) => console.log(`    - ${e}`));
  });
}
console.log('='.repeat(60));
console.log(`STATUS: ${failed === 0 ? 'PASS' : 'FAIL'}`);
process.exit(failed === 0 ? 0 : 1);
