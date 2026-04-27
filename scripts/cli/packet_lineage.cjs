#!/usr/bin/env node
/**
 * Packet Lineage Script
 * Traces packet lineage chain (parent -> child) from packet index.
 * Usage: node packet_lineage.cjs <packet_id>
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const indexPath = path.join(repoRoot, 'data', 'se_packet_index.json');

const target = process.argv[2];
if (!target) {
  console.error('Usage: packet:lineage <packet_id>');
  process.exit(2);
}

if (!fs.existsSync(indexPath)) {
  console.error(`Packet index not found at ${indexPath}`);
  process.exit(1);
}

const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const packets = Array.isArray(index) ? index : (index.packets || []);

// Build lineage map
const byId = new Map();
packets.forEach((p) => {
  const id = p.packet_id || p.id;
  if (id) byId.set(id, p);
});

// Walk parent chain
const chain = [];
let current = byId.get(target);
let guard = 0;
while (current && guard < 100) {
  chain.push(current);
  const parentId = current.parent_packet_id || current.upstream_packet_id || null;
  if (!parentId) break;
  current = byId.get(parentId);
  guard += 1;
}

if (chain.length === 0) {
  console.error(`No packet found for: ${target}`);
  process.exit(1);
}

console.log(`Lineage for packet ${target} (depth=${chain.length}):`);
console.log('='.repeat(80));
chain.reverse().forEach((p, i) => {
  const id = p.packet_id || p.id;
  const family = p.packet_family || p.packet_type || '?';
  const producer = p.producer_workflow || p.producer || '?';
  console.log(`${'  '.repeat(i)}${id} (${family}) <- ${producer}`);
});

process.exit(0);
