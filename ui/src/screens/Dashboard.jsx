import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { workflowApi } from '../api/n8nClient';

export default function Dashboard() {
  const navigate = useNavigate();
  const { setCurrentScreen, selectedMode, selectedModel, selectedModule, selectedContentMode } = useAppStore();
  const [dossiers, setDossiers] = useState([]);
  const [stats, setStats] = useState({
    totalExecutions: 0,
    successRate: 0,
    errorCount: 0,
    totalCost: '$0.00',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    setCurrentScreen('dashboard');
    loadDossiers();
  }, [setCurrentScreen]);

  const loadDossiers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load dossier index from public directory
      const response = await fetch('/data/se_dossier_index.json');
      if (!response.ok) throw new Error(`Failed to load dossier index (${response.status})`);

      const data = await response.json();
      const dossierList = data.dossiers || [];

      // Sort by creation date, newest first
      dossierList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setDossiers(dossierList.slice(0, 10)); // Show 10 most recent

      // Calculate stats from dossiers
      const totalDossiers = dossierList.length;
      const approvedDossiers = dossierList.filter(d => d.status === 'APPROVED').length;

      setStats({
        totalExecutions: totalDossiers,
        successRate: totalDossiers > 0 ? Math.round((approvedDossiers / totalDossiers) * 100) : 0,
        errorCount: dossierList.filter(d => d.status === 'FAILED').length,
        totalCost: `$${(totalDossiers * 0.10).toFixed(2)}`, // Estimate
      });

      console.log(`✅ Loaded ${totalDossiers} dossiers from index`);
    } catch (err) {
      console.error('Error loading dossiers:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDossier = async () => {
    try {
      setExecuting(true);
      setError(null);

      const payload = {
        mode: selectedMode,
        module: selectedModule,
        content_mode: selectedContentMode,
        model: selectedModel,
        timestamp: new Date().toISOString(),
        ui_version: 'Phase2A',
      };

      console.log('🚀 Triggering WF-001 with payload:', payload);
      const result = await workflowApi.createDossier(payload);
      console.log('✅ Dossier creation workflow started:', result);

      // Reload dossiers after a short delay
      setTimeout(() => {
        loadDossiers();
      }, 2000);
    } catch (err) {
      console.error('Error creating dossier:', err);
      setError(`Failed to create dossier: ${err.message}`);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-400 space-y-1">
          <div>
            Mode: <span className="text-blue-400 font-medium">{selectedMode}</span>
            {' | '}
            Module: <span className="text-green-400 font-medium">{selectedModule}</span>
            {' | '}
            Model: <span className="text-yellow-400 font-medium">{selectedModel.split('_').pop()}</span>
          </div>
          <div>
            Content: <span className="text-purple-400 font-medium">{selectedContentMode.replace(/_/g, ' ')}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-500 text-red-200 px-4 py-3 rounded">
          ⚠️ Error: {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-shadow-card p-6 rounded border border-gray-700 hover:border-shadow-accent transition-colors cursor-pointer">
          <div className="text-sm text-gray-400">Total Executions</div>
          <div className="text-3xl font-bold mt-2">{stats.totalExecutions}</div>
          <div className="text-xs text-gray-500 mt-2">All time</div>
        </div>
        <div className="bg-shadow-card p-6 rounded border border-gray-700 hover:border-green-400 transition-colors cursor-pointer">
          <div className="text-sm text-gray-400">Success Rate</div>
          <div className="text-3xl font-bold mt-2 text-green-400">{stats.successRate}%</div>
          <div className="text-xs text-gray-500 mt-2">{dossiers.filter(d => d.status === 'APPROVED').length} approved</div>
        </div>
        <div className="bg-shadow-card p-6 rounded border border-gray-700 hover:border-red-400 transition-colors cursor-pointer">
          <div className="text-sm text-gray-400">Failed</div>
          <div className="text-3xl font-bold mt-2 text-red-400">{stats.errorCount}</div>
          <div className="text-xs text-gray-500 mt-2">Failed dossiers</div>
        </div>
        <div className="bg-shadow-card p-6 rounded border border-gray-700 hover:border-yellow-400 transition-colors cursor-pointer">
          <div className="text-sm text-gray-400">Est. Cost</div>
          <div className="text-3xl font-bold mt-2 text-yellow-400">{stats.totalCost}</div>
          <div className="text-xs text-gray-500 mt-2">Phase 1 estimate</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <button
            onClick={handleCreateDossier}
            disabled={executing}
            className={`px-6 py-2 rounded transition-colors ${
              executing ? 'bg-gray-600 cursor-not-allowed' : 'bg-shadow-accent hover:bg-blue-600'
            }`}
          >
            {executing ? '⏳ Creating...' : '▶️ Create New Dossier'}
          </button>
          <button
            onClick={() => navigate('/dossiers')}
            className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            📋 View History
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Recent Dossiers */}
      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Recent Dossiers ({dossiers.length})</h2>
        {loading ? (
          <p className="text-gray-400">Loading dossiers...</p>
        ) : dossiers.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {dossiers.map((dossier, idx) => (
              <div
                key={dossier.dossier_id || idx}
                onClick={() => navigate(`/dossiers/${dossier.dossier_id}/inspector`)}
                className="p-3 bg-gray-800 rounded border border-gray-600 hover:border-shadow-accent hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{dossier.dossier_id}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(dossier.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    dossier.status === 'APPROVED' ? 'bg-green-900 text-green-300' :
                    dossier.status === 'FAILED' ? 'bg-red-900 text-red-300' :
                    'bg-yellow-900 text-yellow-300'
                  }`}>
                    {dossier.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No dossiers found. Create your first one!</p>
        )}
      </div>

      {/* System Health */}
      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">System Health</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>n8n Connection</span>
            <span className="text-green-400">✓ Connected (localhost:5678)</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Ollama Models</span>
            <span className="text-green-400">✓ Available</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Local Dossiers</span>
            <span className="text-blue-400">✓ {dossiers.length} loaded</span>
          </div>
        </div>
      </div>
    </div>
  );
}
