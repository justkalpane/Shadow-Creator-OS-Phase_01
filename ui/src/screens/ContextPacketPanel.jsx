import { usePacketIndex } from '../hooks/usePacketIndex';
import StatCard from '../components/widgets/StatCard';

export default function ContextPacketPanel() {
  const { data: packets, loading } = usePacketIndex(true);

  const contextPackets = packets.filter(p => p.artifact_family?.includes('context'));

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading context packets...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">🧩 Context Packet Panel</h1>
      <p className="text-gray-400 text-sm">Execution context and platform packaging</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Context Packets"
          value={contextPackets.length}
          icon="🧩"
          color="blue"
        />
        <StatCard
          label="Platform Configs"
          value="6"
          icon="⚙️"
          color="purple"
        />
        <StatCard
          label="Asset Briefs"
          value={Math.round(contextPackets.length * 1.5)}
          icon="📋"
          color="yellow"
        />
        <StatCard
          label="Lineage Depth"
          value="4 levels"
          icon="🔗"
          color="green"
        />
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📦 Execution Context</h2>
        <div className="space-y-3">
          {[
            { name: 'Platform: Cloud Standard', items: 12 },
            { name: 'Runtime: Node.js 18', items: 8 },
            { name: 'Memory: 2GB', items: 4 },
            { name: 'Timeout: 300s', items: 15 },
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-800 p-3 rounded border border-gray-600 flex justify-between items-center">
              <span className="text-sm font-semibold">{item.name}</span>
              <span className="text-xs bg-gray-700 px-2 py-1 rounded">{item.items} configs</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📊 Packet Lineage</h2>
        <div className="bg-gray-800 p-4 rounded border border-gray-600 font-mono text-xs text-gray-300">
          <div className="mb-2">Dossier Root</div>
          <div className="ml-4 mb-2">├─ WF-100 Topic Intelligence</div>
          <div className="ml-8 mb-2">│  ├─ Packet: topic-001</div>
          <div className="ml-8 mb-2">│  └─ Context: ctx-101</div>
          <div className="ml-4 mb-2">├─ WF-200 Script Generation</div>
          <div className="ml-8 mb-2">│  ├─ Packet: script-201</div>
          <div className="ml-8 mb-2">│  └─ Context: ctx-202</div>
          <div className="ml-4">└─ WF-300 Context Engineering</div>
          <div className="ml-8">   └─ Context: ctx-305 (final)</div>
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">🧩 Recent Context Packets</h2>
        <div className="space-y-2">
          {contextPackets.slice(0, 6).map(packet => (
            <div key={packet.instance_id} className="bg-gray-800 p-3 rounded border border-gray-600 hover:border-blue-400 cursor-pointer transition">
              <div className="flex justify-between items-start">
                <div className="text-sm font-semibold">{packet.instance_id}</div>
                <span className={`text-xs px-2 py-1 rounded ${
                  packet.status === 'completed'
                    ? 'bg-green-900 text-green-300'
                    : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {packet.status}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{packet.dossier_ref}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
