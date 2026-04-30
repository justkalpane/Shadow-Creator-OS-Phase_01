import { usePacketIndex } from '../hooks/usePacketIndex';
import StatCard from '../components/widgets/StatCard';

export default function VideoCreatorMode() {
  const { data: packets, loading } = usePacketIndex(true);

  const videoPackets = packets.filter(p => p.artifact_family?.includes('video'));
  const byStatus = {
    planning: videoPackets.filter(p => p.status === 'pending').length,
    rendering: videoPackets.filter(p => p.status === 'processing').length,
    published: videoPackets.filter(p => p.status === 'completed').length,
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading video creation data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🎬 Video Creator Mode</h1>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition">
          + Create New Video
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Videos"
          value={videoPackets.length}
          icon="🎥"
          color="blue"
        />
        <StatCard
          label="Planning"
          value={byStatus.planning}
          icon="📋"
          color="yellow"
        />
        <StatCard
          label="Rendering"
          value={byStatus.rendering}
          icon="⚙️"
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
        <h2 className="text-xl font-semibold mb-4">🎞️ Video Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {videoPackets.slice(0, 6).map(video => (
            <div key={video.instance_id} className="bg-gray-800 rounded border border-gray-600 p-4 hover:border-blue-400 cursor-pointer transition">
              <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-900 rounded mb-3 flex items-center justify-center text-gray-400">
                🎬
              </div>
              <div className="text-sm font-semibold truncate">{video.instance_id}</div>
              <div className="flex justify-between items-center mt-3">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  video.status === 'completed'
                    ? 'bg-green-900 text-green-300'
                    : video.status === 'processing'
                    ? 'bg-yellow-900 text-yellow-300'
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {video.status}
                </span>
                <span className="text-xs text-gray-500">4:32</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📊 Production Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded border border-gray-600">
            <div className="text-gray-400 text-sm">Avg Render Time</div>
            <div className="text-2xl font-bold mt-1">28m 45s</div>
          </div>
          <div className="bg-gray-800 p-4 rounded border border-gray-600">
            <div className="text-gray-400 text-sm">Total Runtime</div>
            <div className="text-2xl font-bold mt-1">156 hrs</div>
          </div>
          <div className="bg-gray-800 p-4 rounded border border-gray-600">
            <div className="text-gray-400 text-sm">Quality Score</div>
            <div className="text-2xl font-bold mt-1">9.1/10</div>
          </div>
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">⚡ Video Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded font-semibold transition">
            New Project
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded font-semibold transition">
            View Templates
          </button>
          <button className="bg-green-600 hover:bg-green-700 p-4 rounded font-semibold transition">
            Export Videos
          </button>
        </div>
      </div>
    </div>
  );
}
