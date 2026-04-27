#!/usr/bin/env node
/**
 * Logs Clean Script (DESTRUCTIVE - requires --confirm)
 * Removes log files older than N days.
 * Usage: node logs_clean.cjs --days <N> --confirm
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const logsDir = path.join(repoRoot, 'logs');

const daysIdx = process.argv.indexOf('--days');
const days = daysIdx !== -1 ? parseInt(process.argv[daysIdx + 1], 10) : null;
const confirm = process.argv.includes('--confirm');

if (!days || isNaN(days)) {
  console.error('Usage: logs:clean --days <N> --confirm');
  process.exit(2);
}

if (!confirm) {
  console.error(`REFUSED: --confirm flag required. Would delete logs older than ${days} days.`);
  process.exit(2);
}

if (!fs.existsSync(logsDir)) {
  console.log('No logs directory present.');
  process.exit(0);
}

const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
const files = fs.readdirSync(logsDir);
let removed = 0;
files.forEach((file) => {
  const filePath = path.join(logsDir, file);
  const stat = fs.statSync(filePath);
  if (stat.mtimeMs < cutoff) {
    fs.unlinkSync(filePath);
    removed += 1;
  }
});

console.log(`Removed ${removed} log files older than ${days} days.`);
process.exit(0);
