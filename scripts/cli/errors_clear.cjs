#!/usr/bin/env node
/**
 * Errors Clear Script (DESTRUCTIVE - requires --confirm)
 * Truncates error log older than N days.
 * Usage: node errors_clear.cjs --days <N> --confirm
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const errorsPath = path.join(repoRoot, 'data', 'se_error_events.json');

const daysIdx = process.argv.indexOf('--days');
const days = daysIdx !== -1 ? parseInt(process.argv[daysIdx + 1], 10) : null;
const confirm = process.argv.includes('--confirm');

if (!days || isNaN(days)) {
  console.error('Usage: errors:clear --days <N> --confirm');
  process.exit(2);
}

if (!confirm) {
  console.error(`REFUSED: --confirm flag required. Would clear errors older than ${days} days.`);
  process.exit(2);
}

if (!fs.existsSync(errorsPath)) {
  console.log('No error log present. Nothing to clear.');
  process.exit(0);
}

const events = JSON.parse(fs.readFileSync(errorsPath, 'utf8'));
const rows = Array.isArray(events) ? events : (events.events || []);
const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
const kept = rows.filter((r) => {
  if (!r.timestamp) return true;
  const ts = new Date(r.timestamp).getTime();
  return isNaN(ts) || ts >= cutoff;
});

const removed = rows.length - kept.length;
fs.writeFileSync(errorsPath, JSON.stringify({ events: kept }, null, 2));
console.log(`Cleared ${removed} errors older than ${days} days. Kept ${kept.length}.`);
process.exit(0);
