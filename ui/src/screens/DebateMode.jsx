import { usePacketIndex } from '../hooks/usePacketIndex';
import StatCard from '../components/widgets/StatCard';

export default function DebateMode() {
  const { data: packets, loading } = usePacketIndex(true);

  const debatePackets = packets.filter(p => p.artifact_family?.includes('debate'));
  const active = debatePackets.filter(p => p.status === 'processing').length;
  const resolved = debatePackets.filter(p => p.status === 'completed').length;

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading debate data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">⚖️ Debate Mode</h1>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition">
          + Start New Debate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Debates"
          value={debatePackets.length}
          icon="💬"
          color="blue"
        />
        <StatCard
          label="Active"
          value={active}
          icon="🔥"
          color="yellow"
        />
        <StatCard
          label="Resolved"
          value={resolved}
          icon="✓"
          color="green"
        />
        <StatCard
          label="Avg Strength"
          value="8.2/10"
          icon="💪"
          color="purple"
        />
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">💬 Active Debates</h2>
        <div className="space-y-4">
          {debatePackets.slice(0, 5).map(debate => (
            <div key={debate.instance_id} className="bg-gray-800 p-4 rounded border border-gray-600 hover:border-blue-400 cursor-pointer transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold">{debate.instance_id}</div>
                  <div className="text-xs text-gray-500">Dossier: {debate.dossier_ref}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  debate.status === 'completed'
                    ? 'bg-green-900 text-green-300'
                    : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {debate.status}
                </span>
              </div>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-blue-400">Pro:</span>
                  <span className="font-semibold">8.5/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-400">Con:</span>
                  <span className="font-semibold">7.2/10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📊 Debate Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded border border-gray-600">
            <div className="font-semibold mb-2">Most Contested Position</div>
            <div className="text-2xl font-bold">Healthcare Policy</div>
            <div className="text-xs text-gray-500 mt-2">12 ongoing debates</div>
          </div>
          <div className="bg-gray-800 p-4 rounded border border-gray-600">
            <div className="font-semibold mb-2">Strongest Argument</div>
            <div className="text-2xl font-bold">Economic Impact</div>
            <div className="text-xs text-gray-500 mt-2">Avg. strength: 8.7/10</div>
          </div>
          <div className="bg-gray-800 p-4 rounded border border-gray-600">
            <div className="font-semibold mb-2">Resolution Rate</div>
            <div className="text-2xl font-bold">68%</div>
            <div className="text-xs text-gray-500 mt-2">Arguments concluded</div>
          </div>
        </div>
      </div>
    </div>
  );
}
