import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export default function Dashboard() {
  const { selectedMode, setCurrentScreen } = useAppStore();
  const [data, setData] = useState({
    dossiers: { count: 0, source: 'data/se_dossier_index.json', loaded: null, error: null },
    packets: { count: 0, source: 'data/se_packet_index.json', loaded: null, error: null },
    routes: { count: 0, source: 'data/se_route_runs.json', loaded: null, error: null },
    errors: { count: 0, source: 'data/se_error_events.json', loaded: null, error: null },
    approvals: { count: 0, source: 'data/se_approval_queue.json', loaded: null, error: null },
  });

  useEffect(() => {
    setCurrentScreen('dashboard');
    loadData();
  }, [setCurrentScreen]);

  const loadData = async () => {
    const sources = [
      { key: 'dossiers', url: '/data/se_dossier_index.json', getCount: (d) => d.records?.length || d.dossiers?.length || 0 },
      { key: 'packets', url: '/data/se_packet_index.json', getCount: (d) => d.packets?.length || d.records?.length || 0 },
      { key: 'routes', url: '/data/se_route_runs.json', getCount: (d) => d.records?.length || 0 },
      { key: 'errors', url: '/data/se_error_events.json', getCount: (d) => d.records?.length || 0 },
      { key: 'approvals', url: '/data/se_approval_queue.json', getCount: (d) => d.entries?.length || d.queue?.length || 0 },
    ];

    const updated = { ...data };

    for (const { key, url, getCount } of sources) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        updated[key] = {
          ...updated[key],
          count: getCount(json),
          loaded: new Date().toLocaleTimeString(),
          error: null,
        };
      } catch (err) {
        updated[key] = {
          ...updated[key],
          error: err.message,
          loaded: new Date().toLocaleTimeString(),
        };
      }
    }

    setData(updated);
  };

  const DataCard = ({ title, count, source, loaded, error, icon, color }) => (
    <div className={`bg-shadow-card border rounded-lg p-6 ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-3xl font-bold mt-2">{error ? '—' : count}</p>
          <p className="text-xs text-gray-500 mt-3">Source: {source}</p>
          <p className="text-xs text-gray-600">{error ? `Error: ${error}` : `Loaded: ${loaded || 'pending'}`}</p>
        </div>
        <div className="text-4xl opacity-50">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">📊 Dashboard</h1>
          <p className="text-sm text-gray-400 mt-2">Real data binding from canonical registries</p>
        </div>
        <button onClick={loadData} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold">
          🔄 Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <DataCard title="Dossiers" count={data.dossiers.count} source={data.dossiers.source} loaded={data.dossiers.loaded} error={data.dossiers.error} icon="📂" color="bg-blue-900/20 border-blue-700" />
        <DataCard title="Packets" count={data.packets.count} source={data.packets.source} loaded={data.packets.loaded} error={data.packets.error} icon="📦" color="bg-green-900/20 border-green-700" />
        <DataCard title="Route Runs" count={data.routes.count} source={data.routes.source} loaded={data.routes.loaded} error={data.routes.error} icon="🛣️" color="bg-yellow-900/20 border-yellow-700" />
        <DataCard title="Error Events" count={data.errors.count} source={data.errors.source} loaded={data.errors.loaded} error={data.errors.error} icon="⚠️" color="bg-red-900/20 border-red-700" />
        <DataCard title="Approvals" count={data.approvals.count} source={data.approvals.source} loaded={data.approvals.loaded} error={data.approvals.error} icon="✅" color="bg-purple-900/20 border-purple-700" />
      </div>

      <div className="bg-shadow-card border border-gray-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Current Mode</p>
            <p className="text-lg font-bold mt-1 capitalize">{selectedMode}</p>
          </div>
          <div>
            <p className="text-gray-400">UI Port</p>
            <p className="text-lg font-bold mt-1">localhost:5002</p>
          </div>
          <div>
            <p className="text-gray-400">n8n Backend</p>
            <p className="text-lg font-bold mt-1">localhost:5680</p>
          </div>
        </div>
      </div>

      <div className="bg-shadow-card border border-gray-700 rounded-lg p-6">
        <h3 className="font-semibold mb-2">Data Sources</h3>
        <div className="text-xs text-gray-400 space-y-1 font-mono">
          <p>📄 /data/se_dossier_index.json — Dossier registry</p>
          <p>📄 /data/se_packet_index.json — Generated artifacts</p>
          <p>📄 /data/se_route_runs.json — Workflow executions</p>
          <p>📄 /data/se_error_events.json — Error tracking</p>
          <p>📄 /data/se_approval_queue.json — Content approvals</p>
          <p>🔗 /api/chat/message — Real orchestration pipeline</p>
        </div>
      </div>
    </div>
  );
}
