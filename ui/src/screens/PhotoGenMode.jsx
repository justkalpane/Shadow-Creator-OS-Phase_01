import { usePacketIndex } from '../hooks/usePacketIndex';
import { useAppStore } from '../store/useAppStore';
import StatCard from '../components/widgets/StatCard';

export default function PhotoGenMode() {
  const { data: packets, loading } = usePacketIndex(true);
  const selectedContentMode = useAppStore((state) => state.selectedContentMode);

  const generatedImages = packets.filter(p => p.artifact_family?.startsWith('generated_image'));
  const byStatus = {
    pending: generatedImages.filter(p => p.status === 'pending').length,
    processing: generatedImages.filter(p => p.status === 'processing').length,
    completed: generatedImages.filter(p => p.status === 'completed').length,
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading photo generation data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🎨 Photo Generation Mode</h1>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition">
          + Create New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Generated"
          value={generatedImages.length}
          icon="🖼️"
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
        <h2 className="text-xl font-semibold mb-4">📸 Generated Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {generatedImages.slice(0, 8).map(image => (
            <div
              key={image.instance_id}
              className="bg-gray-800 rounded border border-gray-600 p-3 hover:border-blue-400 cursor-pointer transition"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-900 rounded mb-2 flex items-center justify-center text-gray-400">
                {image.artifact_family}
              </div>
              <div className="text-xs font-semibold truncate">{image.instance_id}</div>
              <div className={`text-xs mt-1 px-2 py-1 rounded w-fit ${
                image.status === 'completed'
                  ? 'bg-green-900 text-green-300'
                  : image.status === 'processing'
                  ? 'bg-yellow-900 text-yellow-300'
                  : 'bg-gray-700 text-gray-300'
              }`}>
                {image.status}
              </div>
            </div>
          ))}
        </div>
        {generatedImages.length > 8 && (
          <div className="text-center mt-4 text-gray-400 text-sm">
            +{generatedImages.length - 8} more images
          </div>
        )}
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded font-semibold transition">
            Generate New Image
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 p-4 rounded font-semibold transition">
            Batch Process
          </button>
          <button className="bg-green-600 hover:bg-green-700 p-4 rounded font-semibold transition">
            Export Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
