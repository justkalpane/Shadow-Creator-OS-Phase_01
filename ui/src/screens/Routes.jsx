import ScreenGate from '../components/ScreenGate';
import DataTable from '../components/widgets/DataTable';
import StatusBadge from '../components/widgets/StatusBadge';
import { useRouteRuns } from '../hooks/useRouteRuns';

export default function Routes() {
  const routes = useRouteRuns(false);

  const columns = [
    { key: 'route_run_id', label: 'Route ID', sortable: true },
    { key: 'workflow_id', label: 'Workflow', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val} /> },
    {
      key: 'started_at',
      label: 'Started',
      sortable: true,
      render: (val) => new Date(val).toLocaleString()
    },
    {
      key: 'stopped_at',
      label: 'Stopped',
      sortable: true,
      render: (val) => val ? new Date(val).toLocaleString() : '—'
    },
    {
      key: 'route_run_id',
      label: 'Duration',
      sortable: false,
      render: (val, row) => {
        if (!row.started_at || !row.stopped_at) return '—';
        const ms = new Date(row.stopped_at) - new Date(row.started_at);
        return `${Math.round(ms / 1000)}s`;
      }
    },
  ];

  const bottlenecks = routes.getBottlenecks();

  return (
    <ScreenGate screenId="SCR-002">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Routes & Executions</h1>
          <button
            onClick={() => routes.refresh()}
            className="px-4 py-2 bg-shadow-accent hover:bg-blue-600 rounded transition-colors text-sm"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Route Runs Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Execution History ({routes.getTotalCount()} total)</h2>
          <DataTable
            columns={columns}
            data={routes.data}
            loading={routes.loading}
            error={routes.error}
          />
        </div>

        {/* Performance Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bottlenecks */}
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Stage Performance (Bottlenecks)</h3>
            {bottlenecks.length === 0 ? (
              <p className="text-gray-400">No data</p>
            ) : (
              <div className="space-y-3">
                {bottlenecks.map((b) => {
                  const seconds = Math.round(b.avg_duration / 1000);
                  const percentage = (seconds / Math.max(5, Math.max(...bottlenecks.map(x => Math.round(x.avg_duration / 1000))))) * 100;
                  return (
                    <div key={b.workflow_id}>
                      <div className="flex justify-between items-center mb-1 text-sm">
                        <span className="text-gray-300">{b.workflow_id}</span>
                        <span className="text-gray-500">{seconds}s avg</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-shadow-accent to-blue-500 transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Execution Statistics</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Executions</span>
                <span className="font-semibold text-blue-400">{routes.getTotalCount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Successful</span>
                <span className="font-semibold text-green-400">{routes.getSuccessCount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Failed</span>
                <span className="font-semibold text-red-400">{routes.getFailedCount()}</span>
              </div>
              {routes.getTotalCount() > 0 && (
                <>
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Success Rate</span>
                      <span className="font-semibold text-green-400">
                        {Math.round((routes.getSuccessCount() / routes.getTotalCount()) * 100)}%
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Workflow Duration Averages */}
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Average Duration by Workflow</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['WF-001', 'WF-010', 'WF-100', 'WF-200', 'WF-300', 'WF-400', 'WF-500', 'WF-600', 'WF-900'].map((wf) => {
              const avgMs = routes.getAverageDuration(wf);
              const count = routes.getByWorkflow(wf).length;
              return (
                <div key={wf} className="bg-gray-800 p-4 rounded border border-gray-600">
                  <div className="text-sm font-semibold text-gray-300">{wf}</div>
                  <div className="text-2xl font-bold text-shadow-accent mt-2">
                    {avgMs ? `${Math.round(avgMs / 1000)}s` : '—'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{count} execution{count !== 1 ? 's' : ''}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScreenGate>
  );
}
