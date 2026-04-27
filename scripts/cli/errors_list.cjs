#!/usr/bin/env node
/**
 * Errors List Script
 * Lists error events from data/se_error_events.json.
 * Usage: node errors_list.cjs [--dossier <id>] [--date <YYYY-MM-DD>]
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const errorsPath = path.join(repoRoot, 'data', 'se_error_events.json');

const dossierIdx = process.argv.indexOf('--dossier');
const dossierFilter = dossierIdx !== -1 ? process.argv[dossierIdx + 1] : null;
const dateIdx = process.argv.indexOf('--date');
const dateFilter = dateIdx !== -1 ? process.argv[dateIdx + 1] : null;

if (!fs.existsSync(errorsPath)) {
  console.log('No error log present (data/se_error_events.json not found).');
  console.log('This indicates either zero errors or runtime never executed.');
  process.exit(0);
}

let events;
try {
  events = JSON.parse(fs.readFileSync(errorsPath, 'utf8'));
} catch (error) {
  console.error(`Failed to parse error log: ${error.message}`);
  process.exit(1);
}

let rows = Array.isArray(events) ? events : (events.events || []);
if (dossierFilter) rows = rows.filter((r) => r.dossier_id === dossierFilter);
if (dateFilter) rows = rows.filter((r) => (r.timestamp || '').startsWith(dateFilter));

console.log(`Errors: ${rows.length}`);
console.log('='.repeat(80));
rows.forEach((r) => {
  console.log(`${r.timestamp || '?'} | ${r.workflow_id || '?'} | ${r.dossier_id || '?'} | ${r.error_message || r.error || '?'}`);
});
process.exit(0);
