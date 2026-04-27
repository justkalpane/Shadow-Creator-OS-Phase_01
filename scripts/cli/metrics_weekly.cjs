#!/usr/bin/env node
/**
 * Metrics Weekly Script
 * Reports metrics for the last 7 days from dossiers.
 * Usage: node metrics_weekly.cjs [--metric <field>]
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const dossierDir = path.join(repoRoot, 'dossiers');

if (!fs.existsSync(dossierDir)) {
  console.log('No dossiers found.');
  process.exit(0);
}

const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
const files = fs.readdirSync(dossierDir).filter((f) => f.endsWith('.json'));

const stats = {
  dossiers_last_7d: 0,
  versions_total: 0,
  audit_entries_total: 0,
  packets_total: 0
};

files.forEach((file) => {
  try {
    const d = JSON.parse(fs.readFileSync(path.join(dossierDir, file), 'utf8'));
    if (d._created_at && new Date(d._created_at).getTime() >= cutoff) {
      stats.dossiers_last_7d += 1;
      stats.versions_total += d._version || 0;
      stats.audit_entries_total += Array.isArray(d._audit_trail) ? d._audit_trail.length : 0;
      stats.packets_total += Array.isArray(d.packets) ? d.packets.length : 0;
    }
  } catch {
    // skip invalid
  }
});

console.log('Weekly Metrics (last 7 days)');
console.log('='.repeat(50));
Object.entries(stats).forEach(([k, v]) => console.log(`${k}: ${v}`));
process.exit(0);
