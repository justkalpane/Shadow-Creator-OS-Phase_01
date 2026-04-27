#!/usr/bin/env node
/**
 * Dossier Delete Script (DESTRUCTIVE - requires --confirm flag)
 * Removes a dossier from dossiers/ directory.
 * Usage: node dossier_delete.cjs <dossier_id_or_filename> --confirm
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const dossierDir = path.join(repoRoot, 'dossiers');

const target = process.argv[2];
const confirm = process.argv.includes('--confirm');

if (!target) {
  console.error('Usage: dossier:delete <dossier_id_or_filename> --confirm');
  process.exit(2);
}

if (!confirm) {
  console.error('REFUSED: --confirm flag required. This operation is destructive.');
  console.error(`Would delete a dossier matching: ${target}`);
  console.error('Re-run with --confirm to proceed.');
  process.exit(2);
}

if (!fs.existsSync(dossierDir)) {
  console.error('No dossiers directory found.');
  process.exit(1);
}

const files = fs.readdirSync(dossierDir).filter((f) => f.endsWith('.json'));
const candidate =
  files.find((f) => f === target) ||
  files.find((f) => f === `${target}.json`) ||
  files.find((f) => f.startsWith(target));

if (!candidate) {
  console.error(`Dossier not found matching: ${target}`);
  process.exit(1);
}

try {
  fs.unlinkSync(path.join(dossierDir, candidate));
  console.log(`Deleted: ${candidate}`);
  process.exit(0);
} catch (error) {
  console.error(`Delete failed: ${error.message}`);
  process.exit(1);
}
