import { useRouteRuns } from '../hooks/useRouteRuns';
import ScreenGate from '../components/ScreenGate';
import StatCard from '../components/widgets/StatCard';
import DataTable from '../components/widgets/DataTable';
import TimelinePanel from '../components/widgets/TimelinePanel';

function WorkflowMonitorContent() {
  const { data: routeRuns, loading } = useRouteRuns(true);

  const successCount = routeRuns.filter(r => r.status === 'success').length;
  const failedCount = routeRuns.filter(r => r.status === 'failed').length;
  const avgDuration = routeRuns.length > 0
    ? routeRuns.reduce((sum, r) => {
        if (r.started_at && r.stopped_at) {
          return sum + (new Date(r.stopped_at) - new Date(r.started_at));
        }
        return sum;
      }, 0) / routeRuns.length / 1000
    : 0;

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading workflow metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">⚡ Workflow Monitor</h1>
      <p className="text-gray-400 text-sm">Detailed execution trace and performance metrics</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Executions"
          value={routeRuns.length}
          icon="⚙️"
          color="blue"
        />
        <StatCard
          label="Success Rate"
          value={`${((successCount / routeRuns.length) * 100 || 0).toFixed(1)}%`}
          icon="✓"
          color="green"
        />
        <StatCard
          label="Failed"
          value={failedCount}
          icon="⚠️"
          color={failedCount > 0 ? 'red' : 'green'}
        />
        <StatCard
          label="Avg Duration"
          value={`${avgDuration.toFixed(1)}s`}
          icon="⏱️"
          color="purple"
        />
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📊 Execution History</h2>
        <DataTable
          columns={[
            { key: 'route_run_id', label: 'Execution ID', width: '20%' },
            { key: 'workflow_id', label: 'Workflow', width: '15%' },
            { key: 'status', label: 'Status', width: '15%', render: (v) => (
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                v === 'success' ? 'bg-green-900 text-green-300' :
                v === 'failed' ? 'bg-red-900 text-red-300' :
                'bg-yellow-900 text-yellow-300'
              }`}>{v}</span>
            )},
            { key: 'started_at', label: 'Started', width: '20%', render: (v) => new Date(v).toLocaleString() },
            { key: 'stopped_at', label: 'Completed', width: '20%', render: (v) => v ? new Date(v).toLocaleString() : 'pending' },
          ]}
          data={routeRuns.slice(0, 20)}
        />
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📈 Recent Activity</h2>
        <TimelinePanel
          events={routeRuns.slice(0, 8).map(run => ({
            id: run.route_run_id,
            timestamp: run.started_at,
            title: `${run.workflow_id} execution`,
            status: run.status,
            details: `Duration: ${run.stopped_at && run.started_at ? ((new Date(run.stopped_at) - new Date(run.started_at)) / 1000).toFixed(1) : '?'}s`,
          }))}
        />
      </div>
    </div>
  );
}

export default function WorkflowMonitor() {
  return (
    <ScreenGate screenId="SCR-008" fallback="Workflow Monitor">
      <WorkflowMonitorContent />
    </ScreenGate>
  );
}
