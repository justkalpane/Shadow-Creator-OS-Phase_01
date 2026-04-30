const { readJsonSafe, writeJsonSafe, nowIso } = require('./_shared');

class AlertManager {
  constructor(n8nClient) {
    this.n8n = n8nClient;
    this.alertStatePath = 'data/se_operator_alert_state.json';
  }

  readAlertState() {
    return readJsonSafe(this.alertStatePath, {
      acknowledged_alert_ids: [],
      escalated_alert_ids: [],
      last_updated: nowIso(),
    });
  }

  writeAlertState(state) {
    state.last_updated = nowIso();
    writeJsonSafe(this.alertStatePath, state);
  }

  makeAlertId(parts = []) {
    const raw = parts.join('|');
    let h = 0;
    for (let i = 0; i < raw.length; i += 1) {
      h = (h << 5) - h + raw.charCodeAt(i);
      h |= 0;
    }
    return `ALERT-${Math.abs(h)}`;
  }

  async listAlerts() {
    const alerts = [];
    const state = this.readAlertState();
    const ackSet = new Set(state.acknowledged_alert_ids || []);
    const escSet = new Set(state.escalated_alert_ids || []);

    const n8nHealth = await this.n8n.health();
    if (!n8nHealth.healthy) {
      const alertId = this.makeAlertId(['n8n', n8nHealth.error || 'unknown']);
      alerts.push({
        alert_id: alertId,
        category: 'system_error',
        severity: 'high',
        source: 'n8n',
        message: `n8n unreachable: ${n8nHealth.error || 'unknown'}`,
        created_at: nowIso(),
        acknowledged: ackSet.has(alertId),
        escalated: escSet.has(alertId),
      });
    }

    const errors = readJsonSafe('data/se_error_events.json', { records: [] });
    const errorRecords = Array.isArray(errors.records) ? errors.records : [];
    errorRecords.slice(-25).forEach((e, i) => {
      const alertId = this.makeAlertId(['err', e.error_id || i, e.created_at || '', e.message || e.error || 'workflow error']);
      alerts.push({
        alert_id: alertId,
        category: 'workflow_failure',
        severity: 'medium',
        source: 'se_error_events',
        message: e.message || e.error || 'workflow error',
        created_at: e.created_at || nowIso(),
        acknowledged: ackSet.has(alertId),
        escalated: escSet.has(alertId),
      });
    });

    const approval = readJsonSafe('data/se_approval_queue.json', { entries: [] });
    const approvals = Array.isArray(approval.entries) ? approval.entries : [];
    approvals
      .filter((a) => String(a.status || '').toUpperCase() === 'PENDING')
      .slice(-25)
      .forEach((a, i) => {
        const alertId = this.makeAlertId(['approval', a.approval_id || i, a.dossier_id || 'unknown']);
        alerts.push({
          alert_id: alertId,
          category: 'approval_pending',
          severity: 'low',
          source: 'se_approval_queue',
          message: `Approval pending for dossier ${a.dossier_id || 'unknown'}`,
          created_at: a.created_at || nowIso(),
          acknowledged: ackSet.has(alertId),
          escalated: escSet.has(alertId),
        });
      });

    return {
      count: alerts.length,
      alerts: alerts.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))),
      generated_at: nowIso(),
    };
  }

  async detectAlerts() {
    return this.listAlerts();
  }

  acknowledgeAlert(alertId) {
    const state = this.readAlertState();
    if (!state.acknowledged_alert_ids.includes(alertId)) {
      state.acknowledged_alert_ids.push(alertId);
      this.writeAlertState(state);
    }
    return {
      status: 'success',
      alert_id: alertId,
      action: 'acknowledged',
      last_updated: state.last_updated,
    };
  }

  escalateAlert(alertId, note = null) {
    const state = this.readAlertState();
    if (!state.escalated_alert_ids.includes(alertId)) {
      state.escalated_alert_ids.push(alertId);
      this.writeAlertState(state);
    }
    return {
      status: 'success',
      alert_id: alertId,
      action: 'escalated',
      note,
      last_updated: state.last_updated,
    };
  }
}

module.exports = AlertManager;
