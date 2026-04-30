import { usePacketIndex } from '../hooks/usePacketIndex';
import StatCard from '../components/widgets/StatCard';

export default function AvatarCreatorMode() {
  const { data: packets, loading } = usePacketIndex(true);

  const avatarPackets = packets.filter(p => p.artifact_family?.includes('avatar'));
  const byStatus = {
    created: avatarPackets.filter(p => p.status === 'pending').length,
    customizing: avatarPackets.filter(p => p.status === 'processing').length,
    finalized: avatarPackets.filter(p => p.status === 'completed').length,
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading avatar data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">👤 Avatar Creator Mode</h1>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition">
          + Generate Avatar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Avatars"
          value={avatarPackets.length}
          icon="👥"
          color="blue"
        />
        <StatCard
          label="Created"
          value={byStatus.created}
          icon="✨"
          color="yellow"
        />
        <StatCard
          label="Customizing"
          value={byStatus.customizing}
          icon="✏️"
          color="purple"
        />
        <StatCard
          label="Finalized"
          value={byStatus.finalized}
          icon="✓"
          color="green"
        />
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">👤 Avatar Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {avatarPackets.slice(0, 10).map(avatar => (
            <div key={avatar.instance_id} className="bg-gray-800 rounded border border-gray-600 p-3 hover:border-blue-400 cursor-pointer transition">
              <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-900 rounded mb-2 flex items-center justify-center text-3xl">
                👤
              </div>
              <div className="text-xs font-semibold truncate">{avatar.instance_id}</div>
              <div className={`text-xs mt-1 px-2 py-1 rounded w-fit ${
                avatar.status === 'completed'
                  ? 'bg-green-900 text-green-300'
                  : avatar.status === 'processing'
                  ? 'bg-yellow-900 text-yellow-300'
                  : 'bg-gray-700 text-gray-300'
              }`}>
                {avatar.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">🎨 Customization</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Avatar Style</label>
            <select className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white">
              <option>Realistic</option>
              <option>Cartoon</option>
              <option>Anime</option>
              <option>Abstract</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Body Type</label>
            <select className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white">
              <option>Humanoid</option>
              <option>Robotic</option>
              <option>Creature</option>
            </select>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold transition">
            Apply Changes
          </button>
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">⚡ Avatar Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded font-semibold transition">
            Generate New
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded font-semibold transition">
            Upload Custom
          </button>
          <button className="bg-green-600 hover:bg-green-700 p-4 rounded font-semibold transition">
            Export Set
          </button>
        </div>
      </div>
    </div>
  );
}
