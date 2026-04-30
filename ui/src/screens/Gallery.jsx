import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export default function Gallery() {
  const { setCurrentScreen } = useAppStore();
  const [data, setData] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gallery');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setCurrentScreen('gallery');
    load();
  }, [setCurrentScreen]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <button onClick={load} className="px-3 py-1 rounded bg-blue-600 text-sm">Refresh</button>
      </div>
      <div className="text-xs text-yellow-300">
        Planning packet generated. Actual provider execution is not enabled yet.
      </div>
      {loading && <div className="text-sm text-gray-400">Loading gallery...</div>}
      {error && <div className="text-sm text-red-400">Error: {error}</div>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(data.items || []).map((item) => (
            <div key={item.packet_id || item.instance_id} className="p-3 bg-gray-800 border border-gray-700 rounded">
              <div className="text-sm font-semibold">{item.artifact_family || item.packet_family}</div>
              <div className="text-xs text-gray-400">dossier: {item.dossier_ref || item.dossier_id || '-'}</div>
              <div className="text-xs text-gray-400">packet: {item.packet_id || item.instance_id || '-'}</div>
              <div className="text-xs text-gray-400">status: {item.status || '-'}</div>
            </div>
          ))}
          {(data.items || []).length === 0 && (
            <div className="text-sm text-gray-500">No runtime data yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
