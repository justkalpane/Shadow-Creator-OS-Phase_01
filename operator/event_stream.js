const { readJsonSafe, nowIso } = require('./_shared');

class EventStream {
  getEvents(limit = 50) {
    const routeRuns = readJsonSafe('data/se_route_runs.json', { records: [] });
    const errors = readJsonSafe('data/se_error_events.json', { records: [] });
    const approvals = readJsonSafe('data/se_approval_queue.json', { entries: [] });

    const runEvents = (routeRuns.records || []).map((r) => ({
      type: 'route_run',
      timestamp: r.execution_timestamp || r.created_at || nowIso(),
      payload: r,
    }));
    const errorEvents = (errors.records || []).map((e) => ({
      type: 'error',
      timestamp: e.created_at || nowIso(),
      payload: e,
    }));
    const approvalEvents = (approvals.entries || []).map((a) => ({
      type: 'approval',
      timestamp: a.updated_at || a.created_at || nowIso(),
      payload: a,
    }));

    const events = [...runEvents, ...errorEvents, ...approvalEvents]
      .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)))
      .slice(0, Math.max(1, Number(limit) || 50));

    return {
      count: events.length,
      events,
      generated_at: nowIso(),
      mode: 'polling_event_stream',
    };
  }
}

module.exports = EventStream;

