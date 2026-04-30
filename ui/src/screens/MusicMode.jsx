import { usePacketIndex } from '../hooks/usePacketIndex';
import StatCard from '../components/widgets/StatCard';

export default function MusicMode() {
  const { data: packets, loading } = usePacketIndex(true);

  const musicPackets = packets.filter(p => p.artifact_family?.includes('music'));
  const byStatus = {
    composed: musicPackets.filter(p => p.status === 'pending').length,
    producing: musicPackets.filter(p => p.status === 'processing').length,
    released: musicPackets.filter(p => p.status === 'completed').length,
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading music data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🎵 Music Mode</h1>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition">
          + Compose New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Tracks"
          value={musicPackets.length}
          icon="🎼"
          color="blue"
        />
        <StatCard
          label="Composed"
          value={byStatus.composed}
          icon="✍️"
          color="yellow"
        />
        <StatCard
          label="Producing"
          value={byStatus.producing}
          icon="🎹"
          color="purple"
        />
        <StatCard
          label="Released"
          value={byStatus.released}
          icon="🎧"
          color="green"
        />
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">🎵 Music Library</h2>
        <div className="space-y-3">
          {musicPackets.slice(0, 8).map(music => (
            <div key={music.instance_id} className="bg-gray-800 p-4 rounded border border-gray-600 hover:border-blue-400 cursor-pointer transition flex justify-between items-center">
              <div className="flex-1">
                <div className="font-semibold">{music.instance_id}</div>
                <div className="text-xs text-gray-500">Dossier: {music.dossier_ref}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">3:45</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  music.status === 'completed'
                    ? 'bg-green-900 text-green-300'
                    : music.status === 'processing'
                    ? 'bg-yellow-900 text-yellow-300'
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {music.status}
                </span>
                <button className="text-gray-400 hover:text-white transition">▶️</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📊 Music Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded border border-gray-600">
            <div className="text-gray-400 text-sm">Total Duration</div>
            <div className="text-2xl font-bold mt-1">47h 23m</div>
          </div>
          <div className="bg-gray-800 p-4 rounded border border-gray-600">
            <div className="text-gray-400 text-sm">Avg Composition Time</div>
            <div className="text-2xl font-bold mt-1">2h 15m</div>
          </div>
          <div className="bg-gray-800 p-4 rounded border border-gray-600">
            <div className="text-gray-400 text-sm">Quality Average</div>
            <div className="text-2xl font-bold mt-1">8.6/10</div>
          </div>
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">⚡ Music Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded font-semibold transition">
            Compose
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded font-semibold transition">
            View Samples
          </button>
          <button className="bg-green-600 hover:bg-green-700 p-4 rounded font-semibold transition">
            Export Tracks
          </button>
        </div>
      </div>
    </div>
  );
}
