#!/usr/bin/env node
/**
 * Logs View Script
 * Reads logs from logs/ directory and prints to stdout.
 * Usage: node logs_view.cjs [--lines N]
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const logsDir = path.join(repoRoot, 'logs');

const linesIdx = process.argv.indexOf('--lines');
const limit = linesIdx !== -1 ? parseInt(process.argv[linesIdx + 1], 10) : 100;

if (!fs.existsSync(logsDir)) {
  console.log('No logs directory present at logs/. Runtime never wrote logs.');
  process.exit(0);
}

const files = fs.readdirSync(logsDir).filter((f) => f.endsWith('.log') || f.endsWith('.txt'));
if (files.length === 0) {
  console.log('No log files in logs/.');
  process.exit(0);
}

files.forEach((file) => {
  const fullPath = path.join(logsDir, file);
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  console.log(`--- ${file} (last ${limit} lines) ---`);
  console.log(lines.slice(-limit).join('\n'));
});
process.exit(0);
