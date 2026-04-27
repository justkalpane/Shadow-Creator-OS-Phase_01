#!/usr/bin/env node
/**
 * Dossier Inspect Script
 * Pretty-prints a dossier file by ID or filename.
 * Usage: node dossier_inspect.cjs <dossier_id_or_filename>
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const dossierDir = path.join(repoRoot, 'dossiers');

const target = process.argv[2];
if (!target) {
  console.error('Usage: dossier:inspect <dossier_id_or_filename>');
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
  console.error(`Available dossiers: ${files.length}`);
  process.exit(1);
}

const filepath = path.join(dossierDir, candidate);
try {
  const content = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  console.log(`File: ${candidate}`);
  console.log('='.repeat(80));
  console.log(JSON.stringify(content, null, 2));
  process.exit(0);
} catch (error) {
  console.error(`Failed to parse ${candidate}: ${error.message}`);
  process.exit(1);
}
