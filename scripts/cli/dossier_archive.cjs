#!/usr/bin/env node
/**
 * Dossier Archive Script
 * Moves a dossier from dossiers/ to dossiers/_archive/ preserving content and audit trail.
 * Append-only: the archive copy is read-only intent. The source is removed only after successful copy.
 * Usage: node dossier_archive.cjs <dossier_id_or_filename>
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const dossierDir = path.join(repoRoot, 'dossiers');
const archiveDir = path.join(dossierDir, '_archive');

const target = process.argv[2];
if (!target) {
  console.error('Usage: dossier:archive <dossier_id_or_filename>');
  process.exit(2);
}

if (!fs.existsSync(dossierDir)) {
  console.error('No dossiers directory found.');
  process.exit(1);
}

if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir, { recursive: true });
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

const source = path.join(dossierDir, candidate);
const dest = path.join(archiveDir, candidate);

try {
  // Read-validate first
  const content = JSON.parse(fs.readFileSync(source, 'utf8'));
  // Write archive copy
  fs.writeFileSync(dest, JSON.stringify(content, null, 2));
  // Verify archive copy is readable
  JSON.parse(fs.readFileSync(dest, 'utf8'));
  // Remove source only after successful archive
  fs.unlinkSync(source);
  console.log(`Archived: ${candidate} -> dossiers/_archive/${candidate}`);
  process.exit(0);
} catch (error) {
  console.error(`Archive failed: ${error.message}`);
  process.exit(1);
}
