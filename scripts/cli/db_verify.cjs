#!/usr/bin/env node
/**
 * DB Verify Script
 * Verifies state stores: data/se_packet_index.json and dossiers/*.json
 * Phase-1 default uses JSON file storage; sqlite/postgres are optional.
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');

const checks = [];

// Check packet index
const indexPath = path.join(repoRoot, 'data', 'se_packet_index.json');
if (fs.existsSync(indexPath)) {
  try {
    JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    checks.push({ name: 'data/se_packet_index.json parses', ok: true });
  } catch (error) {
    checks.push({ name: 'data/se_packet_index.json parses', ok: false, error: error.message });
  }
} else {
  checks.push({ name: 'data/se_packet_index.json exists', ok: false, error: 'file missing' });
}

// Check dossiers
const dossierDir = path.join(repoRoot, 'dossiers');
if (fs.existsSync(dossierDir)) {
  const files = fs.readdirSync(dossierDir).filter((f) => f.endsWith('.json'));
  let invalid = 0;
  files.forEach((file) => {
    try {
      JSON.parse(fs.readFileSync(path.join(dossierDir, file), 'utf8'));
    } catch {
      invalid += 1;
    }
  });
  checks.push({
    name: `dossiers parse (${files.length} files)`,
    ok: invalid === 0,
    error: invalid > 0 ? `${invalid} invalid dossiers` : null
  });
} else {
  checks.push({ name: 'dossiers/ directory exists', ok: false, error: 'directory missing' });
}

// Check queue files
['se_dossier_index.json', 'se_route_runs.json', 'se_approval_queue.json', 'se_error_events.json'].forEach((name) => {
  const p = path.join(repoRoot, 'data', name);
  if (fs.existsSync(p)) {
    try {
      JSON.parse(fs.readFileSync(p, 'utf8'));
      checks.push({ name: `data/${name} parses`, ok: true });
    } catch (error) {
      checks.push({ name: `data/${name} parses`, ok: false, error: error.message });
    }
  } else {
    checks.push({ name: `data/${name} exists`, ok: false, error: 'file missing (optional)', warning: true });
  }
});

console.log('Database/State Verification');
console.log('='.repeat(60));
let failures = 0;
checks.forEach((c) => {
  const tag = c.ok ? '[OK]' : c.warning ? '[WARN]' : '[FAIL]';
  console.log(`${tag} ${c.name}${c.error ? ' - ' + c.error : ''}`);
  if (!c.ok && !c.warning) failures += 1;
});
console.log('='.repeat(60));
console.log(`${failures === 0 ? 'PASS' : 'FAIL'} (${failures} hard failures)`);
process.exit(failures === 0 ? 0 : 1);
