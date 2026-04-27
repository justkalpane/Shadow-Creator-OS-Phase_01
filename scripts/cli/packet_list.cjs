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

const getPackets = (packetIndex) =>
  Array.isArray(packetIndex) ? packetIndex : (packetIndex.entries || packetIndex.packets || []);
const getPacketId = (packet) => packet.packet_id || packet.instance_id || packet.id;
const getPacketFamily = (packet) =>
  packet.packet_family || packet.packet_type || packet.artifact_family || packet.family;
const getDossierRef = (packet) => packet.dossier_id || packet.dossier_ref;

let packets = getPackets(index);
if (dossierFilter) {
  packets = packets.filter((p) =>
    getDossierRef(p) === dossierFilter
  );
}

console.log(`Packets${dossierFilter ? ` for dossier ${dossierFilter}` : ''}: ${packets.length}`);
console.log('='.repeat(80));

packets.forEach((p) => {
  const id = getPacketId(p) || '<no-id>';
  const family = getPacketFamily(p) || '<no-family>';
  const producer = p.producer_workflow || p.producer || '<no-producer>';
  const dossier = getDossierRef(p) || '<no-dossier>';
  console.log(`${id} | ${family} | producer=${producer} | dossier=${dossier}`);
});

process.exit(0);
