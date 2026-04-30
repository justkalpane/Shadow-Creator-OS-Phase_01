import { useState } from 'react';
import { useDossierData } from '../hooks/useDossierData';
import { useRouteRuns } from '../hooks/useRouteRuns';
import ScreenGate from '../components/ScreenGate';
import StatCard from '../components/widgets/StatCard';

function TroubleshootConsoleContent() {
  const { data: dossiers, loading: dossiersLoading } = useDossierData(true);
  const { data: routeRuns, loading: routesLoading } = useRouteRuns(true);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [showTrace, setShowTrace] = useState(false);

  const failedRuns = routeRuns.filter(r => r.status === 'failed').length;
  const pendingDossiers = dossiers.filter(d => d.status === 'pending').length;

  const selectedDossierRuns = selectedDossier
    ? routeRuns.filter(r => r.workflow_id?.includes(selectedDossier.split('-')[1]))
    : [];

  if (dossiersLoading || routesLoading) {
    return <div className="text-center text-gray-400 py-8">Loading diagnostics...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">🔧 Troubleshoot Console</h1>
      <p className="text-gray-400 text-sm">Deep diagnostics and workflow troubleshooting</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Failed Runs"
          value={failedRuns}
          icon="⚠️"
          color={failedRuns > 0 ? 'red' : 'green'}
        />
        <StatCard
          label="Pending Dossiers"
          value={pendingDossiers}
          icon="⏳"
          color="yellow"
        />
        <StatCard
          label="Total Executions"
          value={routeRuns.length}
          icon="⚙️"
          color="blue"
        />
        <StatCard
          label="Success Rate"
          value={`${((routeRuns.filter(r => r.status === 'success').length / routeRuns.length) * 100 || 0).toFixed(1)}%`}
          icon="✓"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">🔍 Select Dossier</h2>
          <select
            value={selectedDossier || ''}
            onChange={(e) => setSelectedDossier(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm"
          >
            <option value="">Choose dossier to debug...</option>
            {dossiers.slice(0, 20).map(d => (
              <option key={d.instance_id} value={d.instance_id}>
                {d.instance_id} - {d.status}
              </option>
            ))}
          </select>
          {selectedDossier && (
            <button
              onClick={() => setShowTrace(!showTrace)}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition"
            >
              {showTrace ? 'Hide' : 'Show'} Trace
            </button>
          )}
        </div>

        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">🐛 Debug Information</h2>
          {selectedDossier ? (
            <div className="space-y-2 text-sm">
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400">Dossier ID:</span>
                <span className="ml-2 font-semibold">{selectedDossier}</span>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400">Related Runs:</span>
                <span className="ml-2 font-semibold">{selectedDossierRuns.length}</span>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400">Failed:</span>
                <span className="ml-2 font-semibold text-red-400">{selectedDossierRuns.filter(r => r.status === 'failed').length}</span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Select a dossier to view debug info</div>
          )}
        </div>
      </div>

      {showTrace && selectedDossier && (
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">📋 Execution Trace</h2>
          <div className="bg-gray-900 p-4 rounded font-mono text-xs text-gray-300 max-h-96 overflow-y-auto">
            <div className="text-blue-400">► Workflow Execution Trace for {selectedDossier}</div>
            <div className="mt-2 text-gray-500">[DEBUG] Initialization phase started</div>
            <div className="mt-1">[INFO] Loading data from se_dossier_index.json</div>
            <div className="mt-1">[DEBUG] Stage WF-100 (Topic Intelligence) - PENDING</div>
            <div className="mt-1">[DEBUG] Stage WF-200 (Script Intelligence) - PENDING</div>
            <div className="mt-1">[DEBUG] Stage WF-300 (Context Engineering) - PENDING</div>
            {selectedDossierRuns.slice(0, 3).map((run, idx) => (
              <div key={idx} className={`mt-1 ${run.status === 'failed' ? 'text-red-400' : 'text-green-400'}`}>
                [{run.status.toUpperCase()}] {run.workflow_id} - {run.route_run_id}
              </div>
            ))}
            <div className="mt-2 text-gray-500">[DEBUG] Trace completed</div>
          </div>
        </div>
      )}

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">⚡ Failed Runs (Recent)</h2>
        <div className="space-y-2">
          {routeRuns.filter(r => r.status === 'failed').slice(0, 5).map(run => (
            <div key={run.route_run_id} className="bg-gray-800 p-3 rounded border border-red-600 text-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-red-400">{run.workflow_id}</div>
                  <div className="text-xs text-gray-500">{run.route_run_id}</div>
                </div>
                <button className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded transition">
                  Debug
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TroubleshootConsole() {
  return (
    <ScreenGate screenId="SCR-015" fallback="Troubleshoot Console">
      <TroubleshootConsoleContent />
    </ScreenGate>
  );
}
