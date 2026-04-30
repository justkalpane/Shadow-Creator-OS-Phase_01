import { useErrorEvents } from '../hooks/useErrorEvents';
import ScreenGate from '../components/ScreenGate';
import StatCard from '../components/widgets/StatCard';
import StatusBadge from '../components/widgets/StatusBadge';

function AlertCenterContent() {
  const { data: errorEvents, loading } = useErrorEvents(true);

  const severityDist = {
    critical: errorEvents.filter(e => e.severity === 'critical').length,
    high: errorEvents.filter(e => e.severity === 'high').length,
    medium: errorEvents.filter(e => e.severity === 'medium').length,
    low: errorEvents.filter(e => e.severity === 'low').length,
  };

  const activeAlerts = errorEvents.filter(e => e.status === 'active').length;
  const resolvedAlerts = errorEvents.filter(e => e.status === 'resolved').length;

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading alerts...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">🔔 Alert Center</h1>
      <p className="text-gray-400 text-sm">Real-time alerts and notifications</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Active Alerts"
          value={activeAlerts}
          icon="🔔"
          color={activeAlerts > 0 ? 'red' : 'green'}
        />
        <StatCard
          label="Critical"
          value={severityDist.critical}
          icon="🔴"
          color="red"
        />
        <StatCard
          label="High Priority"
          value={severityDist.high}
          icon="🟠"
          color="yellow"
        />
        <StatCard
          label="Resolved"
          value={resolvedAlerts}
          icon="✓"
          color="green"
        />
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">🚨 Active Alerts</h2>
        <div className="space-y-3">
          {errorEvents.filter(e => e.status === 'active').slice(0, 10).map(alert => (
            <div key={alert.error_id} className="bg-gray-800 p-4 rounded border border-gray-600 hover:border-red-400 cursor-pointer transition">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-semibold flex items-center gap-2">
                    {alert.severity === 'critical' ? '🔴' : alert.severity === 'high' ? '🟠' : '🟡'}
                    {alert.error_type}
                  </div>
                  <div className="text-xs text-gray-500">{alert.error_id}</div>
                </div>
                <StatusBadge status={alert.status} />
              </div>
              <div className="text-sm text-gray-300 mb-2">{alert.message || 'No details'}</div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{alert.dossier_ref}</span>
                <span>{new Date(alert.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">📊 Severity Distribution</h2>
          <div className="space-y-3">
            {Object.entries(severityDist).map(([severity, count]) => (
              <div key={severity} className="flex items-center justify-between">
                <span className="capitalize text-sm font-semibold">{severity}</span>
                <div className="flex-1 mx-3 bg-gray-700 rounded h-2">
                  <div
                    className={`h-2 rounded ${
                      severity === 'critical' ? 'bg-red-500' :
                      severity === 'high' ? 'bg-yellow-500' :
                      severity === 'medium' ? 'bg-blue-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(count / Math.max(1, errorEvents.length)) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">⚡ Top Error Types</h2>
          <div className="space-y-2">
            {Object.entries(
              errorEvents.reduce((acc, e) => {
                acc[e.error_type] = (acc[e.error_type] || 0) + 1;
                return acc;
              }, {})
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([type, count]) => (
                <div key={type} className="flex justify-between p-2 bg-gray-800 rounded">
                  <span className="text-sm">{type}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AlertCenter() {
  return (
    <ScreenGate screenId="SCR-014" fallback="Alert Center">
      <AlertCenterContent />
    </ScreenGate>
  );
}
