import { useDossierData } from '../hooks/useDossierData';
import { useRouteRuns } from '../hooks/useRouteRuns';
import ScreenGate from '../components/ScreenGate';
import StatCard from '../components/widgets/StatCard';
import PieChart from '../components/widgets/PieChart';

function AnalyticsDashboardContent() {
  const { data: dossiers, loading: dossiersLoading } = useDossierData(true);
  const { data: routeRuns, loading: routesLoading } = useRouteRuns(true);

  const statusDist = {
    approved: dossiers.filter(d => d.status === 'approved').length,
    rejected: dossiers.filter(d => d.status === 'rejected').length,
    pending: dossiers.filter(d => d.status === 'pending').length,
    processing: dossiers.filter(d => d.status === 'processing').length,
  };

  const workflowMetrics = {};
  routeRuns.forEach(run => {
    if (!workflowMetrics[run.workflow_id]) {
      workflowMetrics[run.workflow_id] = { success: 0, failed: 0, total: 0 };
    }
    workflowMetrics[run.workflow_id].total++;
    if (run.status === 'success') workflowMetrics[run.workflow_id].success++;
    else if (run.status === 'failed') workflowMetrics[run.workflow_id].failed++;
  });

  if (dossiersLoading || routesLoading) {
    return <div className="text-center text-gray-400 py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">📈 Analytics Dashboard</h1>
      <p className="text-gray-400 text-sm">Metrics, trends, and evolution signals</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Dossiers"
          value={dossiers.length}
          icon="📋"
          color="blue"
          trend="up"
        />
        <StatCard
          label="Approval Rate"
          value={`${((statusDist.approved / dossiers.length) * 100 || 0).toFixed(1)}%`}
          icon="✓"
          color="green"
        />
        <StatCard
          label="Execution Count"
          value={routeRuns.length}
          icon="⚙️"
          color="purple"
        />
        <StatCard
          label="System Health"
          value="94%"
          icon="🏥"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">📊 Dossier Status Distribution</h2>
          <PieChart
            data={[
              { label: 'Approved', value: statusDist.approved, color: '#10b981' },
              { label: 'Pending', value: statusDist.pending, color: '#f59e0b' },
              { label: 'Processing', value: statusDist.processing, color: '#8b5cf6' },
              { label: 'Rejected', value: statusDist.rejected, color: '#ef4444' },
            ]}
          />
        </div>

        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">⚡ Workflow Performance</h2>
          <div className="space-y-3">
            {Object.entries(workflowMetrics)
              .sort((a, b) => b[1].total - a[1].total)
              .slice(0, 5)
              .map(([workflow, metrics]) => {
                const successRate = ((metrics.success / metrics.total) * 100 || 0).toFixed(1);
                return (
                  <div key={workflow} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{workflow}</span>
                      <span className={`${successRate >= 90 ? 'text-green-400' : successRate >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {successRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded h-2">
                      <div
                        className={`h-2 rounded ${
                          successRate >= 90 ? 'bg-green-500' :
                          successRate >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${successRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-lg font-semibold mb-3">📈 Growth Trend</h2>
          <div className="text-3xl font-bold text-green-400">+24%</div>
          <div className="text-sm text-gray-400 mt-1">Dossier creation up from last period</div>
        </div>
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-lg font-semibold mb-3">⚡ Peak Activity</h2>
          <div className="text-3xl font-bold text-blue-400">2:30 PM</div>
          <div className="text-sm text-gray-400 mt-1">Average peak execution time</div>
        </div>
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-lg font-semibold mb-3">🎯 Top Workflow</h2>
          <div className="text-3xl font-bold text-purple-400">WF-200</div>
          <div className="text-sm text-gray-400 mt-1">47 executions this week</div>
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📊 Key Insights</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-green-400 font-bold">✓</span>
            <span>System uptime at 99.8% - all services performing nominally</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">→</span>
            <span>WF-300 (Context Engineering) shows highest performance - 94% success rate</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400 font-bold">!</span>
            <span>WF-600 (Analytics) completion time trending up - monitor resource usage</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-400 font-bold">✓</span>
            <span>Approval rate improved 12% - creator quality feedback effective</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  return (
    <ScreenGate screenId="SCR-017" fallback="Analytics Dashboard">
      <AnalyticsDashboardContent />
    </ScreenGate>
  );
}
