const { readJsonSafe, nowIso } = require('./_shared');

class TroubleshootManager {
  traceDossier(dossierId) {
    const dossierIndex = readJsonSafe('data/se_dossier_index.json', { dossiers: [] });
    const dossiers = Array.isArray(dossierIndex.dossiers) ? dossierIndex.dossiers : [];
    const dossier = dossiers.find((d) => d.dossier_id === dossierId) || null;

    const routeRuns = readJsonSafe('data/se_route_runs.json', { records: [] });
    const runs = (Array.isArray(routeRuns.records) ? routeRuns.records : [])
      .filter((r) => (r.dossier_id || r.dossier_ref) === dossierId);

    const packetIndex = readJsonSafe('data/se_packet_index.json', { entries: [], packets: [] });
    const packets = [...(packetIndex.entries || []), ...(packetIndex.packets || [])]
      .filter((p) => (p.dossier_id || p.dossier_ref || p.dossierRef) === dossierId);

    const errorEvents = readJsonSafe('data/se_error_events.json', { records: [] });
    const errors = (Array.isArray(errorEvents.records) ? errorEvents.records : [])
      .filter((e) => (e.dossier_id || e.dossier_ref) === dossierId);

    return {
      dossier_id: dossierId,
      dossier,
      route_runs: runs,
      packets,
      errors,
      diagnosis: {
        has_dossier: Boolean(dossier),
        packet_count: packets.length,
        run_count: runs.length,
        error_count: errors.length,
      },
      traced_at: nowIso(),
    };
  }

  tracePacket(packetId) {
    const packetIndex = readJsonSafe('data/se_packet_index.json', { entries: [], packets: [] });
    const all = [...(packetIndex.entries || []), ...(packetIndex.packets || [])];
    const packet = all.find((p) => (p.packet_id || p.instance_id) === packetId) || null;
    return {
      packet_id: packetId,
      packet,
      traced_at: nowIso(),
    };
  }
}

module.exports = TroubleshootManager;

