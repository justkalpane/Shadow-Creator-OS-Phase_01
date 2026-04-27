#!/usr/bin/env node
/**
 * Packet Inspect Script
 * Pretty-prints a single packet from packet index.
 * Usage: node packet_inspect.cjs <packet_id>
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const indexPath = path.join(repoRoot, 'data', 'se_packet_index.json');

const target = process.argv[2];
if (!target) {
  console.error('Usage: packet:inspect <packet_id>');
  process.exit(2);
}

if (!fs.existsSync(indexPath)) {
  console.error(`Packet index not found at ${indexPath}`);
  process.exit(1);
}

let index;
try {
  index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
} catch (error) {
  console.error(`Failed to parse packet index: ${error.message}`);
  process.exit(1);
}

const packets = Array.isArray(index) ? index : (index.packets || []);
const found = packets.find((p) => p.packet_id === target || p.id === target);

if (!found) {
  console.error(`Packet not found: ${target}`);
  process.exit(1);
}

console.log(JSON.stringify(found, null, 2));
process.exit(0);
