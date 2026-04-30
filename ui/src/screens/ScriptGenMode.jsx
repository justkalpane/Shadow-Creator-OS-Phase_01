import { usePacketIndex } from '../hooks/usePacketIndex';
import StatCard from '../components/widgets/StatCard';

export default function ScriptGenMode() {
  const { data: packets, loading } = usePacketIndex(true);

  const generatedScripts = packets.filter(p => p.artifact_family?.startsWith('generated_script'));
  const byStatus = {
    pending: generatedScripts.filter(p => p.status === 'pending').length,
    processing: generatedScripts.filter(p => p.status === 'processing').length,
    completed: generatedScripts.filter(p => p.status === 'completed').length,
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading script generation data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📝 Script Generation Mode</h1>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition">
          + Create New Script
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Scripts"
          value={generatedScripts.length}
          icon="📄"
          color="blue"
        />
        <StatCard
          label="Pending"
          value={byStatus.pending}
          icon="⏳"
          color="yellow"
        />
        <StatCard
          label="Processing"
          value={byStatus.processing}
          icon="⚙️"
          color="purple"
        />
        <StatCard
          label="Completed"
          value={byStatus.completed}
          icon="✓"
          color="green"
        />
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📋 Generated Scripts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-600">
              <tr>
                <th className="text-left py-2 px-2 font-semibold">Script ID</th>
                <th className="text-left py-2 px-2 font-semibold">Type</th>
                <th className="text-left py-2 px-2 font-semibold">Status</th>
                <th className="text-left py-2 px-2 font-semibold">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {generatedScripts.slice(0, 10).map(script => (
                <tr key={script.instance_id} className="hover:bg-gray-800 transition">
                  <td className="py-2 px-2 font-semibold">{script.instance_id}</td>
                  <td className="py-2 px-2">{script.artifact_family}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      script.status === 'completed'
                        ? 'bg-green-900 text-green-300'
                        : script.status === 'processing'
                        ? 'bg-yellow-900 text-yellow-300'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {script.status}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-gray-400">{script.dossier_ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">⚡ Script Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded font-semibold transition">
            Generate Script
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded font-semibold transition">
            View Templates
          </button>
          <button className="bg-green-600 hover:bg-green-700 p-4 rounded font-semibold transition">
            Export Scripts
          </button>
        </div>
      </div>
    </div>
  );
}
