/**
 * Packet Index Writer Engine
 * Writes packet metadata to se_packet_index with full lineage tracking.
 * Canonical table: se_packet_index
 */

const fs = require('fs');
const path = require('path');

class PacketIndexWriter {
  constructor(config = {}) {
    this.config = {
      index_path: config.index_path || './data/se_packet_index.json',
      enable_dedup_check: config.enable_dedup_check !== false
    };
    this.write_log = [];
  }

  /**
   * Write packet entry to se_packet_index
   * @param {object} packet - Full packet
   * @param {string} dossier_id - Owning dossier
   * @returns {object} - { status, index_entry_id }
   */
  async writeIndex(packet, dossier_id) {
    const write_id = 'IDX-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

    try {
      this.validatePacketForIndex(packet);

      const index_entry = this.buildIndexEntry(packet, dossier_id, write_id);

      if (this.config.enable_dedup_check) {
        await this.checkDuplicate(packet.instance_id);
      }

      await this.appendToIndex(index_entry);

      this.log({ write_id, status: 'SUCCESS', instance_id: packet.instance_id, artifact_family: packet.artifact_family });

      return { status: 'SUCCESS', index_entry_id: write_id, instance_id: packet.instance_id };

    } catch (e) {
      this.log({ write_id, status: 'FAILED', error: e.message });
      throw e;
    }
  }

  /**
   * Build index entry from packet
   */
  buildIndexEntry(packet, dossier_id, write_id) {
    const status = packet.payload?.status || {};
    const context = packet.payload?.context || {};

    return {
      index_entry_id: write_id,
      instance_id: packet.instance_id,
      artifact_family: packet.artifact_family,
      schema_version: packet.schema_version || '1.0.0',
      producer_workflow: packet.producer_workflow,
      dossier_ref: dossier_id || packet.dossier_ref,
      created_at: packet.created_at || new Date().toISOString(),
      indexed_at: new Date().toISOString(),
      status: packet.status || 'CREATED',
      lineage: {
        sourced_from_packet_id: context.sourced_from_packet_id || context.sourced_from_debate_packet_id || context.sourced_from_refinement_packet_id || null,
        sourced_from_topic_id: context.sourced_from_topic_id || context.original_topic_id || null,
        sourced_from_research_id: context.sourced_from_research_id || context.original_research_id || null
      },
      next_workflow: status.next_workflow || null,
      escalation_needed: status.escalation_needed || false
    };
  }

  /**
   * Validate packet has minimum fields for indexing
   */
  validatePacketForIndex(packet) {
    const required = ['instance_id', 'artifact_family', 'producer_workflow'];
    const missing = required.filter(f => !packet[f]);
    if (missing.length > 0) {
      throw new Error(`Packet missing required index fields: ${missing.join(', ')}`);
    }
  }

  /**
   * Check for duplicate instance_id in index
   */
  async checkDuplicate(instance_id) {
    try {
      const index = await this.loadIndex();
      const exists = index.entries.some(e => e.instance_id === instance_id);
      if (exists) {
        throw new Error(`Duplicate packet in index: ${instance_id}`);
      }
    } catch (e) {
      if (e.message.includes('Duplicate')) throw e;
      // Index file not found = no duplicates
    }
  }

  /**
   * Append entry to index file
   */
  async appendToIndex(entry) {
    try {
      let index = { entries: [], last_updated: null };

      if (fs.existsSync(this.config.index_path)) {
        const content = fs.readFileSync(this.config.index_path, 'utf8');
        index = JSON.parse(content);
      } else {
        const dir = path.dirname(this.config.index_path);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      }

      index.entries.push(entry);
      index.last_updated = new Date().toISOString();
      index.total_entries = index.entries.length;

      fs.writeFileSync(this.config.index_path, JSON.stringify(index, null, 2));

    } catch (e) {
      throw new Error(`Failed to write packet index: ${e.message}`);
    }
  }

  /**
   * Load current index
   */
  async loadIndex() {
    if (!fs.existsSync(this.config.index_path)) {
      return { entries: [] };
    }
    const content = fs.readFileSync(this.config.index_path, 'utf8');
    return JSON.parse(content);
  }

  /**
   * Query index by dossier
   */
  async queryByDossier(dossier_id) {
    const index = await this.loadIndex();
    return index.entries.filter(e => e.dossier_ref === dossier_id);
  }

  /**
   * Query index by artifact_family
   */
  async queryByFamily(artifact_family) {
    const index = await this.loadIndex();
    return index.entries.filter(e => e.artifact_family === artifact_family);
  }

  log(entry) {
    this.write_log.push({ ...entry, timestamp: new Date().toISOString() });
    if (entry.status === 'FAILED') console.error('[INDEX_WRITE_FAILED]', entry.error);
  }

  getWriteLog() { return this.write_log; }
}

module.exports = PacketIndexWriter;
