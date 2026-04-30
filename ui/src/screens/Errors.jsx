import { useAppStore } from '../store/useAppStore';
import ScreenGate from '../components/ScreenGate';
import DataTable from '../components/widgets/DataTable';
import StatusBadge from '../components/widgets/StatusBadge';
import { useErrorEvents } from '../hooks/useErrorEvents';
import { useRouteRuns } from '../hooks/useRouteRuns';

export default function Errors() {
  const { selectedMode } = useAppStore();
  const errors = useErrorEvents(false);
  const routes = useRouteRuns(false);

  const isFounder = selectedMode === 'founder';

  const columns = [
    { key: 'error_id', label: 'Error ID', sortable: true },
    { key: 'dossier_ref', label: 'Dossier', sortable: true },
    { key: 'workflow_id', label: 'Workflow', sortable: true },
    { key: 'error_type', label: 'Type', sortable: true },
    { key: 'severity', label: 'Severity', sortable: true, render: (val) => <StatusBadge status={val || 'low'} /> },
    {
      key: 'timestamp',
      label: 'Occurred',
      sortable: true,
      render: (val) => new Date(val).toLocaleString()
    },
    { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val || 'active'} /> },
  ];

  const activeErrors = errors.getByStatus('active');
  const resolvedErrors = errors.getByStatus('resolved');
  const severityDist = errors.getSeverityDistribution();

  const handleInitiateReplay = (error) => {
    console.log('Initiating replay for:', error.error_id);
    alert(`Initiating replay for error ${error.error_id}\n(Would trigger WF-021)`);
  };

  const handleMarkResolved = (error) => {
    if (!isFounder) return;
    console.log('Marking resolved:', error.error_id);
    alert(`Marked as resolved: ${error.error_id}`);
  };

  return (
    <ScreenGate screenId="SCR-005">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Error Events</h1>
          <button
            onClick={() => { errors.refresh(); routes.refresh(); }}
            className="px-4 py-2 bg-shadow-accent hover:bg-blue-600 rounded transition-colors text-sm"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Error Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Active Errors</div>
            <div className="text-3xl font-bold text-red-400">{activeErrors.length}</div>
            <div className="text-xs text-gray-500 mt-2">Requiring attention</div>
          </div>
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Resolved</div>
            <div className="text-3xl font-bold text-green-400">{resolvedErrors.length}</div>
            <div className="text-xs text-gray-500 mt-2">Completed</div>
          </div>
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Critical</div>
            <div className="text-3xl font-bold text-red-500">{severityDist.critical}</div>
            <div className="text-xs text-gray-500 mt-2">High priority</div>
          </div>
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Total</div>
            <div className="text-3xl font-bold text-blue-400">{errors.getTotalCount()}</div>
            <div className="text-xs text-gray-500 mt-2">All-time</div>
          </div>
        </div>

        {/* Active Errors Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Active Errors ({activeErrors.length})
          </h2>
          <DataTable
            columns={columns}
            data={activeErrors}
            loading={errors.loading}
            error={errors.error}
            actions={[
              {
                label: '▶️ Replay',
                className: 'bg-blue-700 hover:bg-blue-600',
                onClick: handleInitiateReplay
              },
              ...(isFounder ? [{
                label: '✓ Resolve',
                className: 'bg-green-700 hover:bg-green-600',
                onClick: handleMarkResolved
              }] : [])
            ]}
          />
        </div>

        {/* Error Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Severity Distribution */}
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Severity Distribution</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Critical</span>
                  <span className="font-semibold text-red-400">{severityDist.critical}</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${(severityDist.critical / Math.max(1, errors.getTotalCount())) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">High</span>
                  <span className="font-semibold text-orange-400">{severityDist.high}</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${(severityDist.high / Math.max(1, errors.getTotalCount())) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Medium</span>
                  <span className="font-semibold text-yellow-400">{severityDist.medium}</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${(severityDist.medium / Math.max(1, errors.getTotalCount())) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Low</span>
                  <span className="font-semibold text-blue-400">{severityDist.low}</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${(severityDist.low / Math.max(1, errors.getTotalCount())) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Types */}
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Top Error Types</h3>
            <div className="space-y-3 text-sm">
              {(() => {
                const counts = errors.countByErrorType();
                return Object.entries(counts)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([type, count]) => (
                    <div key={type} className="flex justify-between">
                      <span className="text-gray-300 truncate">{type}</span>
                      <span className="font-semibold text-shadow-accent ml-2">{count}</span>
                    </div>
                  ));
              })()}
            </div>
          </div>
        </div>

        {/* Resolved Errors History */}
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Resolved Errors</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {resolvedErrors.slice(0, 10).map((error) => (
              <div
                key={error.error_id}
                className="p-3 bg-gray-800 rounded border border-gray-600 hover:border-gray-500"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium text-gray-200">{error.error_id}</span>
                  <StatusBadge status="resolved" size="sm" />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{error.error_type}</span>
                  <span>{new Date(error.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {resolvedErrors.length === 0 && (
              <p className="text-gray-400 text-sm">No resolved errors yet</p>
            )}
          </div>
        </div>
      </div>
    </ScreenGate>
  );
}
