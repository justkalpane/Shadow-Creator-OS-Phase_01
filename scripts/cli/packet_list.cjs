#!/usr/bin/env node
/**
 * Packet List Script
 * Lists packets from data/se_packet_index.json. Optional --dossier filter.
 * Usage: node packet_list.cjs [--dossier <dossier_id>]
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const indexPath = path.join(repoRoot, 'data', 'se_packet_index.json');

if (!fs.existsSync(indexPath)) {
  console.error(`Packet index not found at ${indexPath}`);
  process.exit(1);
}

let dossierFilter = null;
const dIdx = process.argv.indexOf('--dossier');
if (dIdx !== -1 && process.argv[dIdx + 1]) {
  dossierFilter = process.argv[dIdx + 1];
}

let index;
try {
  index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
} catch (error) {
  console.error(`Failed to parse packet index: ${error.message}`);
  process.exit(1);
}

let packets = Array.isArray(index) ? index : (index.packets || []);
if (dossierFilter) {
  packets = packets.filter((p) =>
    p.dossier_id === dossierFilter || p.dossier_ref === dossierFilter
  );
}

console.log(`Packets${dossierFilter ? ` for dossier ${dossierFilter}` : ''}: ${packets.length}`);
console.log('='.repeat(80));

packets.forEach((p) => {
  const id = p.packet_id || p.id || '<no-id>';
  const family = p.packet_family || p.packet_type || p.family || '<no-family>';
  const producer = p.producer_workflow || p.producer || '<no-producer>';
  const dossier = p.dossier_id || p.dossier_ref || '<no-dossier>';
  console.log(`${id} | ${family} | producer=${producer} | dossier=${dossier}`);
});

process.exit(0);
