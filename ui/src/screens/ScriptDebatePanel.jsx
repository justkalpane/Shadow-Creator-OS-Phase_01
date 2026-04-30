import { usePacketIndex } from '../hooks/usePacketIndex';
import StatCard from '../components/widgets/StatCard';

export default function ScriptDebatePanel() {
  const { data: packets, loading } = usePacketIndex(true);

  const scripts = packets.filter(p => p.artifact_family?.includes('script'));
  const debates = packets.filter(p => p.artifact_family?.includes('debate'));

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading scripts and debates...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">📝 Script & Debate Panel</h1>
      <p className="text-gray-400 text-sm">Script generation and debate outputs</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Scripts Generated"
          value={scripts.length}
          icon="📄"
          color="blue"
        />
        <StatCard
          label="Debates Created"
          value={debates.length}
          icon="⚖️"
          color="purple"
        />
        <StatCard
          label="Quality Score"
          value="8.7/10"
          icon="⭐"
          color="yellow"
        />
        <StatCard
          label="Ready for Review"
          value={scripts.filter(s => s.status === 'completed').length}
          icon="✓"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">📄 Scripts</h2>
          <div className="space-y-2">
            {scripts.slice(0, 5).map(script => (
              <div key={script.instance_id} className="bg-gray-800 p-3 rounded border border-gray-600">
                <div className="flex justify-between items-start">
                  <div className="text-sm font-semibold">{script.instance_id}</div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    script.status === 'completed'
                      ? 'bg-green-900 text-green-300'
                      : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {script.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">3,245 words | Confidence: 87%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">⚖️ Debates</h2>
          <div className="space-y-2">
            {debates.slice(0, 5).map(debate => (
              <div key={debate.instance_id} className="bg-gray-800 p-3 rounded border border-gray-600">
                <div className="flex justify-between items-start">
                  <div className="text-sm font-semibold">{debate.instance_id}</div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    debate.status === 'completed'
                      ? 'bg-green-900 text-green-300'
                      : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {debate.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Pro: 8.2/10 | Con: 7.5/10</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">⚡ Refinement Controls</h2>
        <div className="space-y-3">
          <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-semibold transition">
            Regenerate Script
          </button>
          <button className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded font-semibold transition">
            Run New Debate
          </button>
          <button className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-semibold transition">
            Approve & Export
          </button>
        </div>
      </div>
    </div>
  );
}
