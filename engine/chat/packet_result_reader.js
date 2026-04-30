const fs = require('fs');
const path = require('path');

class PacketResultReader {
  constructor() {
    this.packetPath = path.join(__dirname, '../../data/se_packet_index.json');
    this.refresh();
  }

  refresh() {
    this.index = this.readJsonSafe(this.packetPath, { packets: [] });
  }

  readJsonSafe(file, fallback) {
    try {
      if (!fs.existsSync(file)) return fallback;
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      return fallback;
    }
  }

  getAllPackets() {
    this.refresh();
    const packets = Array.isArray(this.index?.packets) ? this.index.packets : [];
    const entries = Array.isArray(this.index?.entries) ? this.index.entries : [];

    if (packets.length === 0 && entries.length === 0) return [];
    if (packets.length === 0) return entries;
    if (entries.length === 0) return packets;

    // Merge both collections; runtime can populate either key depending on writer path.
    const merged = [...packets, ...entries];
    const map = new Map();
    for (const item of merged) {
      const key = item.packet_id || item.instance_id || item.id || JSON.stringify(item);
      map.set(key, item);
    }
    return Array.from(map.values());
  }

  getPacketsByDossier(dossierId) {
    return this.getAllPackets().filter((p) => {
      const ref = p.dossier_ref || p.dossier_id || p.dossierRef;
      return ref === dossierId;
    });
  }

  getArtifactFamiliesForDossier(dossierId) {
    return [...new Set(this.getPacketsByDossier(dossierId).map((p) => p.artifact_family || p.packet_family).filter(Boolean))];
  }

  writeJson(file, value) {
    try {
      fs.writeFileSync(file, JSON.stringify(value, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error('Error writing packet index:', err.message);
      return false;
    }
  }

  get indexPath() {
    return this.packetPath;
  }
}

module.exports = PacketResultReader;
