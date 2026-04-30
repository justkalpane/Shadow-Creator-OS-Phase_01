import { usePacketIndex } from '../hooks/usePacketIndex';
import StatCard from '../components/widgets/StatCard';

export default function PoetryMode() {
  const { data: packets, loading } = usePacketIndex(true);

  const poetryPackets = packets.filter(p => p.artifact_family?.includes('poetry') || p.artifact_family?.includes('poem'));
  const byStatus = {
    written: poetryPackets.filter(p => p.status === 'pending').length,
    editing: poetryPackets.filter(p => p.status === 'processing').length,
    published: poetryPackets.filter(p => p.status === 'completed').length,
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading poetry data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">✍️ Poetry Mode</h1>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition">
          + Compose New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Poems"
          value={poetryPackets.length}
          icon="📖"
          color="blue"
        />
        <StatCard
          label="Written"
          value={byStatus.written}
          icon="✍️"
          color="yellow"
        />
        <StatCard
          label="Editing"
          value={byStatus.editing}
          icon="📝"
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
        <h2 className="text-xl font-semibold mb-4">📖 Poetry Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {poetryPackets.slice(0, 6).map(poem => (
            <div key={poem.instance_id} className="bg-gray-800 p-4 rounded border border-gray-600 hover:border-blue-400 cursor-pointer transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold">{poem.instance_id}</div>
                  <div className="text-xs text-gray-500">Lines: 24 | Stanzas: 4</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  poem.status === 'completed'
                    ? 'bg-green-900 text-green-300'
                    : poem.status === 'processing'
                    ? 'bg-yellow-900 text-yellow-300'
                    : 'bg-gray-700 text-gray-300'
                }`}>
                  {poem.status}
                </span>
              </div>
              <div className="bg-gray-900 p-3 rounded text-xs text-gray-300 mb-3 italic max-h-24 overflow-hidden">
                "In shadows deep where whispers dwell,<br/>
                A tale of grace begins to tell,<br/>
                Through winding paths of light and dark,<br/>
                We find our truth, we find our spark..."
              </div>
              <div className="flex gap-2">
                <button className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded flex-1 transition">View Full</button>
                <button className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded flex-1 transition">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📊 Poetry Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded border border-gray-600">
            <div className="text-gray-400 text-sm">Total Lines</div>
            <div className="text-2xl font-bold mt-1">1,847</div>
          </div>
          <div className="bg-gray-800 p-4 rounded border border-gray-600">
            <div className="text-gray-400 text-sm">Avg Stanzas</div>
            <div className="text-2xl font-bold mt-1">4.2</div>
          </div>
          <div className="bg-gray-800 p-4 rounded border border-gray-600">
            <div className="text-gray-400 text-sm">Rhyme Schemes</div>
            <div className="text-2xl font-bold mt-1">12</div>
          </div>
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">🎨 Poetry Forms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-gray-800 p-3 rounded border border-gray-600 text-center hover:border-blue-400 cursor-pointer transition">
            <div className="font-semibold">Sonnet</div>
            <div className="text-xs text-gray-500 mt-1">14 lines</div>
          </div>
          <div className="bg-gray-800 p-3 rounded border border-gray-600 text-center hover:border-blue-400 cursor-pointer transition">
            <div className="font-semibold">Haiku</div>
            <div className="text-xs text-gray-500 mt-1">3 lines</div>
          </div>
          <div className="bg-gray-800 p-3 rounded border border-gray-600 text-center hover:border-blue-400 cursor-pointer transition">
            <div className="font-semibold">Free Verse</div>
            <div className="text-xs text-gray-500 mt-1">Any form</div>
          </div>
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">⚡ Poetry Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded font-semibold transition">
            Write Poem
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded font-semibold transition">
            Review Form
          </button>
          <button className="bg-green-600 hover:bg-green-700 p-4 rounded font-semibold transition">
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
