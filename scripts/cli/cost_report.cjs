#!/usr/bin/env node
/**
 * Cost Report Script
 * Reports cost from dossier analytics namespaces.
 * Phase-1 Ollama-local default: $0.00.
 * Usage: node cost_report.cjs [--date YYYY-MM-DD]
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const dossierDir = path.join(repoRoot, 'dossiers');

const dateIdx = process.argv.indexOf('--date');
const dateFilter = dateIdx !== -1 ? process.argv[dateIdx + 1] : null;

if (!fs.existsSync(dossierDir)) {
  console.log('No dossiers found. Cost: $0.00');
  process.exit(0);
}

let totalCost = 0;
let dossierCount = 0;

const files = fs.readdirSync(dossierDir).filter((f) => f.endsWith('.json'));
files.forEach((file) => {
  try {
    const d = JSON.parse(fs.readFileSync(path.join(dossierDir, file), 'utf8'));
    if (dateFilter && d._created_at && !d._created_at.startsWith(dateFilter)) return;

    // Look for cost in canonical or legacy namespaces
    const cost =
      (d.namespaces && d.namespaces.analytics && d.namespaces.analytics.cost_usd) ||
      (d.analytics && d.analytics.cost_usd) ||
      0;
    totalCost += Number(cost) || 0;
    dossierCount += 1;
  } catch {
    // skip invalid
  }
});

console.log(`Cost Report${dateFilter ? ` for ${dateFilter}` : ''}`);
console.log('='.repeat(50));
console.log(`Dossiers: ${dossierCount}`);
console.log(`Total Cost: $${totalCost.toFixed(4)}`);
console.log(`Phase-1 default: Ollama local => $0.00`);
process.exit(0);
