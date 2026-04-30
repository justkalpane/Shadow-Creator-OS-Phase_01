import { useDossierData } from '../hooks/useDossierData';
import { useRouteRuns } from '../hooks/useRouteRuns';
import ScreenGate from '../components/ScreenGate';
import StatCard from '../components/widgets/StatCard';

function ResourcePlannerContent() {
  const { data: dossiers, loading: dossiersLoading } = useDossierData();
  const { data: routeRuns, loading: routesLoading } = useRouteRuns();

  const avgDurationMs = routeRuns.length > 0
    ? routeRuns.reduce((sum, r) => {
        if (r.started_at && r.stopped_at) {
          return sum + (new Date(r.stopped_at) - new Date(r.started_at));
        }
        return sum;
      }, 0) / routeRuns.length
    : 0;

  const costPerMinute = 0.12;
  const estimatedCost = (avgDurationMs / 60000) * costPerMinute;
  const monthlyBudget = estimatedCost * routeRuns.length * 30;

  if (dossiersLoading || routesLoading) {
    return <div className="text-center text-gray-400 py-8">Loading resource data...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">💰 Resource Planner</h1>
      <p className="text-gray-400 text-sm">Cost estimates and latency predictions</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Projected Monthly Cost"
          value={`$${monthlyBudget.toFixed(2)}`}
          icon="💵"
          color="blue"
        />
        <StatCard
          label="Avg Execution Time"
          value={`${(avgDurationMs / 1000).toFixed(1)}s`}
          icon="⏱️"
          color="purple"
        />
        <StatCard
          label="Cost per Execution"
          value={`$${estimatedCost.toFixed(4)}`}
          icon="💰"
          color="yellow"
        />
        <StatCard
          label="Budget Remaining"
          value="$8,429"
          icon="📊"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">📊 Cost Breakdown</h2>
          <div className="space-y-3">
            {[
              { service: 'Compute (CPU/Memory)', cost: 4200, percent: 50 },
              { service: 'Storage', cost: 2100, percent: 25 },
              { service: 'Network', cost: 1260, percent: 15 },
              { service: 'AI Model Inference', cost: 840, percent: 10 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">{item.service}</span>
                  <span className="text-blue-400">${item.cost}</span>
                </div>
                <div className="w-full bg-gray-700 rounded h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">⚡ Optimization Opportunities</h2>
          <div className="space-y-2">
            {[
              { suggestion: 'Increase execution parallelism', savings: '$420/mo', priority: 'High' },
              { suggestion: 'Enable result caching', savings: '$280/mo', priority: 'Medium' },
              { suggestion: 'Optimize memory allocation', savings: '$140/mo', priority: 'Low' },
            ].map((item, idx) => (
              <div key={idx} className={`p-3 rounded border ${
                item.priority === 'High'
                  ? 'bg-red-900 border-red-700'
                  : item.priority === 'Medium'
                  ? 'bg-yellow-900 border-yellow-700'
                  : 'bg-blue-900 border-blue-700'
              }`}>
                <div className="flex justify-between items-start">
                  <span className="text-sm font-semibold">{item.suggestion}</span>
                  <span className="text-xs bg-black bg-opacity-30 px-2 py-1 rounded">{item.priority}</span>
                </div>
                <div className="text-xs mt-1 text-green-300">Potential savings: {item.savings}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📈 Budget Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded border border-gray-600 text-center">
            <div className="text-sm text-gray-400 mb-2">This Month</div>
            <div className="text-2xl font-bold">$8,429</div>
            <div className="text-xs text-green-400 mt-2">On Budget</div>
          </div>
          <div className="bg-gray-800 p-4 rounded border border-gray-600 text-center">
            <div className="text-sm text-gray-400 mb-2">Next Month</div>
            <div className="text-2xl font-bold">$8,750</div>
            <div className="text-xs text-yellow-400 mt-2">+4% projected</div>
          </div>
          <div className="bg-gray-800 p-4 rounded border border-gray-600 text-center">
            <div className="text-sm text-gray-400 mb-2">Monthly Budget</div>
            <div className="text-2xl font-bold">$12,000</div>
            <div className="text-xs text-blue-400 mt-2">27% utilization</div>
          </div>
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded font-semibold transition">
            Review Budget
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded font-semibold transition">
            Set Alerts
          </button>
          <button className="bg-green-600 hover:bg-green-700 p-4 rounded font-semibold transition">
            Optimize
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResourcePlanner() {
  return (
    <ScreenGate screenId="SCR-013" fallback="Resource Planner">
      <ResourcePlannerContent />
    </ScreenGate>
  );
}
