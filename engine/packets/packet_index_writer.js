/**
 * Packet Index Writer Engine
 * Appends lineage-safe rows to canonical se_packet_index.
 */

const fs = require('fs');
const path = require('path');

class PacketIndexWriter {
  constructor(config = {}) {
    this.config = {
      index_path: config.index_path || './data/se_packet_index.json',
      enable_dedup_check: config.enable_dedup_check !== false,
      strict_mode: config.strict_mode !== false
    };

    this.write_log = [];
    this.write_counter = 0;
  }

  async writeIndex(packet, dossierId, mutationMetadata = {}) {
    const writeId = this.buildWriteId(packet, dossierId);

    try {
      this.validatePacketForIndex(packet);
      const metadata = this.resolveMutationMetadata(packet, mutationMetadata);
      this.validateMutationMetadata(metadata);

      const indexEntry = this.buildIndexEntry(packet, dossierId, writeId, metadata);
      await this.appendToIndex(indexEntry);

      this.log({
        write_id: writeId,
        status: 'SUCCESS',
        instance_id: packet.instance_id,
        artifact_family: packet.artifact_family,
        route_to_workflow: null
      });

      return {
        status: 'SUCCESS',
        index_entry_id: writeId,
        instance_id: packet.instance_id,
        route_to_workflow: null
      };
    } catch (error) {
      const routed = this.buildRoutedError(error.message);
      this.log({
        write_id: writeId,
        status: 'FAILED',
        error: routed.message,
        route_to_workflow: routed.route_to_workflow
      });
      throw routed;
    }
  }

  buildIndexEntry(packet, dossierId, writeId, metadata) {
    const status = packet.payload?.status || {};
    const context = packet.payload?.context || {};

    return {
      index_entry_id: writeId,
      instance_id: packet.instance_id,
      artifact_family: packet.artifact_family,
      schema_version: packet.schema_version,
      producer_workflow: packet.producer_workflow,
      dossier_ref: dossierId || packet.dossier_ref,
      packet_created_at: packet.created_at || metadata.timestamp,
      indexed_at: metadata.timestamp,
      packet_status: packet.status || 'CREATED',
      next_workflow: status.next_workflow || null,
      escalation_needed: status.escalation_needed === true,
      lineage: {
        sourced_from_packet_id:
          context.sourced_from_packet_id ||
          context.sourced_from_debate_packet_id ||
          context.sourced_from_refinement_packet_id ||
          null,
        sourced_from_topic_id: context.sourced_from_topic_id || context.original_topic_id || null,
        sourced_from_research_id: context.sourced_from_research_id || context.original_research_id || null
      },
      timestamp: metadata.timestamp,
      writer_id: metadata.writer_id,
      skill_id: metadata.skill_id,
      schema_write_version: metadata.schema_version,
      lineage_reference: metadata.lineage_reference,
      audit_entry: metadata.audit_entry
    };
  }

  validatePacketForIndex(packet) {
    const required = ['instance_id', 'artifact_family', 'schema_version', 'producer_workflow'];
    const missing = required.filter((field) => !(field in (packet || {})) || !packet[field]);
    if (missing.length > 0) {
      throw new Error(`Packet missing required index fields: ${missing.join(', ')}`);
    }
  }

  resolveMutationMetadata(packet, provided) {
    const payload = packet.payload || {};
    const packetMeta = packet.mutation_metadata || payload.mutation_metadata || {};
    const auditEntry =
      provided.audit_entry ||
      packet.audit_entry ||
      payload.audit_entry ||
      packetMeta.audit_entry ||
      {
        workflow_id: packet.producer_workflow || 'UNKNOWN_WORKFLOW',
        operation: 'create_new_index_row',
        notes: 'append packet row to se_packet_index'
      };

    return {
      timestamp: provided.timestamp || packetMeta.timestamp || packet.created_at || new Date().toISOString(),
      writer_id:
        provided.writer_id ||
        packetMeta.writer_id ||
        packet.writer_id ||
        payload.writer_id ||
        packet.producer_workflow ||
        'UNKNOWN_WRITER',
      skill_id: provided.skill_id || packetMeta.skill_id || packet.skill_id || payload.skill_id || 'UNKNOWN_SKILL',
      instance_id: provided.instance_id || packetMeta.instance_id || packet.instance_id,
      schema_version: provided.schema_version || packetMeta.schema_version || packet.schema_version,
      lineage_reference:
        provided.lineage_reference ||
        packetMeta.lineage_reference ||
        packet.lineage_reference ||
        payload.lineage_reference ||
        payload.context?.sourced_from_packet_id ||
        packet.instance_id,
      audit_entry: auditEntry
    };
  }

  validateMutationMetadata(metadata) {
    const required = [
      'timestamp',
      'writer_id',
      'skill_id',
      'instance_id',
      'schema_version',
      'lineage_reference',
      'audit_entry'
    ];
    const missing = required.filter((field) => !(field in metadata) || !metadata[field]);
    if (missing.length > 0) {
      throw new Error(`Index write missing required mutation metadata: ${missing.join(', ')}`);
    }

    if (typeof metadata.audit_entry !== 'object' || Array.isArray(metadata.audit_entry)) {
      throw new Error('Index write audit_entry must be an object');
    }
  }

  async appendToIndex(entry) {
    const index = await this.loadIndex();

    if (!Array.isArray(index.entries)) {
      throw new Error('Invalid index format: entries must be an array');
    }

    if (this.config.enable_dedup_check) {
      const duplicate = index.entries.find((row) => row.instance_id === entry.instance_id);
      if (duplicate) {
        throw new Error(`Duplicate packet index row for instance_id: ${entry.instance_id}`);
      }
    }

    index.entries.push(entry);
    index.total_entries = index.entries.length;
    index.last_updated = entry.timestamp;

    const targetPath = path.resolve(this.config.index_path);
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(targetPath, JSON.stringify(index, null, 2));
  }

  async loadIndex() {
    const targetPath = path.resolve(this.config.index_path);
    if (!fs.existsSync(targetPath)) {
      return {
        entries: [],
        total_entries: 0,
        last_updated: null
      };
    }
    const parsed = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    return {
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      total_entries: Number(parsed.total_entries || 0),
      last_updated: parsed.last_updated || null
    };
  }

  async queryByDossier(dossierId) {
    const index = await this.loadIndex();
    return index.entries.filter((entry) => entry.dossier_ref === dossierId);
  }

  async queryByFamily(artifactFamily) {
    const index = await this.loadIndex();
    return index.entries.filter((entry) => entry.artifact_family === artifactFamily);
  }

  buildWriteId(packet, dossierId) {
    this.write_counter += 1;
    const signature = this.stableStringify({
      dossier_id: dossierId || packet?.dossier_ref || 'UNKNOWN_DOSSIER',
      instance_id: packet?.instance_id || 'UNKNOWN_INSTANCE',
      artifact_family: packet?.artifact_family || 'UNKNOWN_FAMILY',
      sequence: this.write_counter
    });
    return `IDX-${this.computeHash(signature).slice(0, 12)}`;
  }

  computeHash(text) {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  stableStringify(value) {
    if (value === null || typeof value !== 'object') {
      return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
      return `[${value.map((item) => this.stableStringify(item)).join(',')}]`;
    }
    const keys = Object.keys(value).sort();
    const entries = keys.map((key) => `${JSON.stringify(key)}:${this.stableStringify(value[key])}`);
    return `{${entries.join(',')}}`;
  }

  buildRoutedError(message) {
    const error = new Error(message);
    error.route_to_workflow = 'WF-900';
    return error;
  }

  log(entry) {
    this.write_log.push({
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString()
    });
    if (entry.status === 'FAILED') {
      console.error('[INDEX_WRITE_FAILED]', entry.error);
    }
  }

  getWriteLog() {
    return this.write_log;
  }
}

module.exports = PacketIndexWriter;
