import { usePacketIndex } from '../hooks/usePacketIndex';
import StatCard from '../components/widgets/StatCard';

export default function SongsMode() {
  const { data: packets, loading } = usePacketIndex(true);

  const songPackets = packets.filter(p => p.artifact_family?.includes('songs') || p.artifact_family?.includes('song'));
  const byStatus = {
    drafted: songPackets.filter(p => p.status === 'pending').length,
    recording: songPackets.filter(p => p.status === 'processing').length,
    published: songPackets.filter(p => p.status === 'completed').length,
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading songs data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🎤 Songs Mode</h1>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition">
          + Write New Song
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Songs"
          value={songPackets.length}
          icon="🎵"
          color="blue"
        />
        <StatCard
          label="Drafted"
          value={byStatus.drafted}
          icon="📝"
          color="yellow"
        />
        <StatCard
          label="Recording"
          value={byStatus.recording}
          icon="🎙️"
          color="purple"
        />
        <StatCard
          label="Published"
          value={byStatus.published}
          icon="✓"
          color="green"
        />
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">🎵 Song Collection</h2>
        <div className="space-y-3">
          {songPackets.slice(0, 10).map(song => (
            <div key={song.instance_id} className="bg-gray-800 p-4 rounded border border-gray-600 hover:border-blue-400 cursor-pointer transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold">{song.instance_id}</div>
                  <div className="text-xs text-gray-500 mt-1">Genre: Varied | BPM: 120</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  song.status === 'completed'
                    ? 'bg-green-900 text-green-300'
                    : song.status === 'processing'
                    ? 'bg-yellow-900 text-yellow-300'
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {song.status}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition">Edit</button>
                <button className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition">Preview</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📊 Song Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded border border-gray-600">
            <div className="text-gray-400 text-sm">Total Duration</div>
            <div className="text-2xl font-bold mt-1">34h 12m</div>
          </div>
          <div className="bg-gray-800 p-4 rounded border border-gray-600">
            <div className="text-gray-400 text-sm">Avg Song Length</div>
            <div className="text-2xl font-bold mt-1">4m 32s</div>
          </div>
          <div className="bg-gray-800 p-4 rounded border border-gray-600">
            <div className="text-gray-400 text-sm">Top Genre</div>
            <div className="text-2xl font-bold mt-1">Pop/Rock</div>
          </div>
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">⚡ Song Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded font-semibold transition">
            Write Song
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded font-semibold transition">
            View Lyrics
          </button>
          <button className="bg-green-600 hover:bg-green-700 p-4 rounded font-semibold transition">
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
