import { usePacketIndex } from '../hooks/usePacketIndex';
import StatCard from '../components/widgets/StatCard';
import StatusBadge from '../components/widgets/StatusBadge';

export default function TopicPipeline() {
  const { data: packets, loading } = usePacketIndex(true);

  const stages = [
    { name: 'Discovery', icon: '🔍', items: packets.filter(p => p.status === 'pending').length },
    { name: 'Qualification', icon: '✓', items: packets.filter(p => p.status === 'processing').length },
    { name: 'Scoring', icon: '📊', items: Math.round(packets.length * 0.3) },
    { name: 'Research', icon: '📚', items: packets.filter(p => p.status === 'completed').length },
  ];

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading pipeline...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">📋 Topic Pipeline</h1>
      <p className="text-gray-400 text-sm">Visual stage flow for topic intelligence processing</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stages.map((stage, idx) => (
          <div key={idx} className="bg-shadow-card p-4 rounded border border-gray-700 text-center hover:border-blue-400 transition">
            <div className="text-3xl mb-2">{stage.icon}</div>
            <div className="font-semibold text-sm">{stage.name}</div>
            <div className="text-2xl font-bold text-blue-400 mt-2">{stage.items}</div>
          </div>
        ))}
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">🔄 Pipeline Flow Visualization</h2>
        <div className="flex items-center justify-between px-4 py-8 bg-gray-800 rounded">
          {stages.map((stage, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1">
              <div className="text-4xl mb-2">{stage.icon}</div>
              <div className="text-xs font-semibold mb-2">{stage.name}</div>
              <div className="text-lg font-bold text-blue-400">{stage.items}</div>
              {idx < stages.length - 1 && (
                <div className="text-gray-500 text-2xl mt-2">→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📊 Recent Topics</h2>
        <div className="space-y-2">
          {packets.slice(0, 8).map(packet => (
            <div key={packet.instance_id} className="bg-gray-800 p-3 rounded border border-gray-600 flex justify-between items-center">
              <div className="flex-1 text-sm">
                <div className="font-semibold">{packet.instance_id}</div>
                <div className="text-xs text-gray-500">{packet.dossier_ref}</div>
              </div>
              <StatusBadge status={packet.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
