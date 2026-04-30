import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export default function Library() {
  const { setCurrentScreen } = useAppStore();
  const [data, setData] = useState({ dossiers: [], packets: [], grouped_by_type: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/library');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      setData(j);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setCurrentScreen('library');
    load();
  }, [setCurrentScreen]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Output Library</h1>
        <button onClick={load} className="px-3 py-1 rounded bg-blue-600 text-sm">Refresh</button>
      </div>
      <div className="text-xs text-gray-400">Data source: data/se_packet_index.json, data/se_dossier_index.json</div>
      {loading && <div className="text-sm text-gray-400">Loading library...</div>}
      {error && <div className="text-sm text-red-400">Error: {error}</div>}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-gray-800 border border-gray-700 rounded">Dossiers: {data.dossiers_count || 0}</div>
            <div className="p-3 bg-gray-800 border border-gray-700 rounded">Packets: {data.packets_count || 0}</div>
            <div className="p-3 bg-gray-800 border border-gray-700 rounded">Types: {Object.keys(data.grouped_by_type || {}).length}</div>
          </div>
          <div className="space-y-2">
            {Object.entries(data.grouped_by_type || {}).map(([k, list]) => (
              <div key={k} className="p-3 bg-gray-800 border border-gray-700 rounded">
                <div className="font-semibold text-sm">{k} ({list.length})</div>
              </div>
            ))}
            {Object.keys(data.grouped_by_type || {}).length === 0 && (
              <div className="text-sm text-gray-500">No runtime data yet.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
