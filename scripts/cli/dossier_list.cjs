#!/usr/bin/env node
/**
 * Dossier List Script
 * Lists all dossiers in dossiers/ directory with version, audit count, and creation date.
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const dossierDir = path.join(repoRoot, 'dossiers');

if (!fs.existsSync(dossierDir)) {
  console.error('No dossiers directory found at', dossierDir);
  process.exit(1);
}

const files = fs.readdirSync(dossierDir).filter((f) => f.endsWith('.json'));

console.log(`Dossiers (${files.length} total):`);
console.log('='.repeat(80));
console.log('ID'.padEnd(48) + 'VERSION'.padEnd(10) + 'AUDIT'.padEnd(8) + 'CREATED');
console.log('-'.repeat(80));

const rows = [];
files.forEach((file) => {
  try {
    const content = JSON.parse(fs.readFileSync(path.join(dossierDir, file), 'utf8'));
    const dossierId = content.dossier_id || file.replace('.json', '');
    const version = content._version !== undefined ? content._version : 'n/a';
    const auditCount = Array.isArray(content._audit_trail) ? content._audit_trail.length : 0;
    const created = content._created_at || 'unknown';
    rows.push({ dossierId, version, auditCount, created });
  } catch (error) {
    rows.push({ dossierId: file, version: 'INVALID', auditCount: 0, created: error.message });
  }
});

rows.forEach((row) => {
  const id = String(row.dossierId).slice(0, 46).padEnd(48);
  const version = String(row.version).padEnd(10);
  const audit = String(row.auditCount).padEnd(8);
  console.log(id + version + audit + row.created);
});

console.log('='.repeat(80));
console.log(`Total: ${files.length}`);
process.exit(0);
