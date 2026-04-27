#!/usr/bin/env node
/**
 * Metrics Daily Script
 * Aggregates metrics across dossiers for the current day.
 * Usage: node metrics_daily.cjs [--metric <field>]
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const dossierDir = path.join(repoRoot, 'dossiers');

const metricIdx = process.argv.indexOf('--metric');
const metricFilter = metricIdx !== -1 ? process.argv[metricIdx + 1] : null;

if (!fs.existsSync(dossierDir)) {
  console.log('No dossiers found.');
  process.exit(0);
}

const today = new Date().toISOString().slice(0, 10);
const files = fs.readdirSync(dossierDir).filter((f) => f.endsWith('.json'));

const stats = {
  dossiers_today: 0,
  versions_total: 0,
  audit_entries_total: 0,
  packets_total: 0
};

files.forEach((file) => {
  try {
    const d = JSON.parse(fs.readFileSync(path.join(dossierDir, file), 'utf8'));
    if (d._created_at && d._created_at.startsWith(today)) {
      stats.dossiers_today += 1;
    }
    stats.versions_total += d._version || 0;
    stats.audit_entries_total += Array.isArray(d._audit_trail) ? d._audit_trail.length : 0;
    stats.packets_total += Array.isArray(d.packets) ? d.packets.length : 0;
  } catch {
    // skip invalid
  }
});

console.log(`Daily Metrics for ${today}`);
console.log('='.repeat(50));
if (metricFilter && stats[metricFilter] !== undefined) {
  console.log(`${metricFilter}: ${stats[metricFilter]}`);
} else {
  Object.entries(stats).forEach(([k, v]) => console.log(`${k}: ${v}`));
}
process.exit(0);
