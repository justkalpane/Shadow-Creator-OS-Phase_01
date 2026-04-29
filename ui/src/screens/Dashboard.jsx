import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export default function Dashboard() {
  const { setCurrentScreen } = useAppStore();
  const [dossiers, setDossiers] = useState([]);
  const [stats, setStats] = useState({
    totalExecutions: 25,
    successRate: 100,
    errorCount: 0,
    totalCost: '$0.00',
  });

  useEffect(() => {
    setCurrentScreen('dashboard');
  }, [setCurrentScreen]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Total Executions</div>
          <div className="text-3xl font-bold mt-2">{stats.totalExecutions}</div>
        </div>
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Success Rate</div>
          <div className="text-3xl font-bold mt-2 text-green-400">{stats.successRate}%</div>
        </div>
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Errors</div>
          <div className="text-3xl font-bold mt-2 text-red-400">{stats.errorCount}</div>
        </div>
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <div className="text-sm text-gray-400">Total Cost</div>
          <div className="text-3xl font-bold mt-2">{stats.totalCost}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-shadow-accent rounded hover:bg-blue-600 transition-colors">
            Create New Dossier
          </button>
          <button className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
            View History
          </button>
          <button className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
            Manage Settings
          </button>
        </div>
      </div>

      {/* Recent Dossiers */}
      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Recent Dossiers</h2>
        <p className="text-gray-400">Loading dossiers from local storage...</p>
      </div>

      {/* System Health */}
      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">System Health</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>n8n Connection</span>
            <span className="text-green-400">✓ Connected</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Local Ollama</span>
            <span className="text-green-400">✓ Running</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Disk Space</span>
            <span className="text-green-400">✓ Sufficient</span>
          </div>
        </div>
      </div>
    </div>
  );
}
