const { readJsonSafe, repoPath, nowIso } = require('./_shared');
const path = require('path');

class OutputReader {
  listDossiers() {
    const idx = readJsonSafe('data/se_dossier_index.json', { dossiers: [] });
    const dossiers = Array.isArray(idx.dossiers) ? idx.dossiers : (Array.isArray(idx.records) ? idx.records : []);
    return {
      dossiers,
      count: dossiers.length,
      source: 'data/se_dossier_index.json',
      last_refreshed: nowIso(),
    };
  }

  listPackets() {
    const idx = readJsonSafe('data/se_packet_index.json', { entries: [], packets: [] });
    const packets = Array.isArray(idx.entries) ? idx.entries : [];
    const legacy = Array.isArray(idx.packets) ? idx.packets : [];
    const map = new Map();
    [...legacy, ...packets].forEach((p) => {
      const k = p.packet_id || p.instance_id || JSON.stringify(p);
      map.set(k, p);
    });
    return Array.from(map.values());
  }

  getDossier(dossierId) {
    const list = this.listDossiers().dossiers;
    const indexRecord = list.find((d) => d.dossier_id === dossierId) || null;
    const fileRecord = readJsonSafe(path.join('dossiers', `${dossierId}.json`), null);
    return {
      dossier_id: dossierId,
      index_record: indexRecord,
      dossier: fileRecord,
    };
  }

  getDossierOutputs(dossierId) {
    const packets = this.listPackets().filter(
      (p) => (p.dossier_id || p.dossier_ref || p.dossierRef) === dossierId
    );

    const byType = packets.reduce((acc, item) => {
      const key = item.artifact_family || item.packet_family || 'unknown';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    return {
      dossier_id: dossierId,
      packets_count: packets.length,
      packets,
      grouped_by_type: byType,
      media_status: {
        image_file: 'provider_bridge_required',
        audio_file: 'provider_bridge_required',
        video_file: 'provider_bridge_required',
      },
      provider_boundary_note: 'Planning packet generated. Actual provider execution is not enabled yet.',
      last_refreshed: nowIso(),
    };
  }

  getLibrary() {
    const dossiers = this.listDossiers();
    const packets = this.listPackets();
    const groupedByType = packets.reduce((acc, item) => {
      const key = item.artifact_family || item.packet_family || 'unknown';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
    return {
      dossiers_count: dossiers.count,
      packets_count: packets.length,
      dossiers: dossiers.dossiers,
      packets,
      grouped_by_type: groupedByType,
      last_refreshed: nowIso(),
    };
  }

  listRouteRuns() {
    const runs = readJsonSafe('data/se_route_runs.json', { records: [] });
    if (Array.isArray(runs.records)) return runs.records;
    if (Array.isArray(runs.entries)) return runs.entries;
    if (Array.isArray(runs)) return runs;
    return [];
  }

  getRunStatus(runId) {
    const runs = this.listRouteRuns();
    const direct = runs.find((r) => String(r.run_id || r.route_run_id || r.id) === String(runId));
    if (direct) {
      return {
        run_id: runId,
        status: direct.status || direct.execution_status || 'unknown',
        workflow_id: direct.workflow_id || null,
        dossier_id: direct.dossier_id || direct.dossier_ref || null,
        started_at: direct.started_at || direct.execution_timestamp || null,
        ended_at: direct.ended_at || null,
        source: 'data/se_route_runs.json',
      };
    }
    return {
      run_id: runId,
      status: 'not_found',
      source: 'data/se_route_runs.json',
    };
  }

  getDossierTimeline(dossierId) {
    const routeRuns = this.listRouteRuns()
      .filter((r) => (r.dossier_id || r.dossier_ref) === dossierId)
      .map((r) => ({
        type: 'route_run',
        timestamp: r.execution_timestamp || r.started_at || r.created_at || nowIso(),
        payload: r,
      }));

    const packets = this.listPackets()
      .filter((p) => (p.dossier_id || p.dossier_ref || p.dossierRef) === dossierId)
      .map((p) => ({
        type: 'packet',
        timestamp: p.created_at || nowIso(),
        payload: p,
      }));

    const errorsRaw = readJsonSafe('data/se_error_events.json', { records: [] });
    const errors = (errorsRaw.records || [])
      .filter((e) => (e.dossier_id || e.dossier_ref) === dossierId)
      .map((e) => ({
        type: 'error',
        timestamp: e.created_at || nowIso(),
        payload: e,
      }));

    const approvalsRaw = readJsonSafe('data/se_approval_queue.json', { entries: [] });
    const approvals = (approvalsRaw.entries || [])
      .filter((a) => (a.dossier_id || a.dossier_ref) === dossierId)
      .map((a) => ({
        type: 'approval',
        timestamp: a.updated_at || a.created_at || nowIso(),
        payload: a,
      }));

    const timeline = [...routeRuns, ...packets, ...errors, ...approvals]
      .sort((a, b) => String(a.timestamp).localeCompare(String(b.timestamp)));

    return {
      dossier_id: dossierId,
      timeline_count: timeline.length,
      timeline,
      generated_at: nowIso(),
    };
  }
}

module.exports = OutputReader;
