import { useNavigate } from 'react-router-dom';
import ScreenGate from '../components/ScreenGate';
import DataTable from '../components/widgets/DataTable';
import StatusBadge from '../components/widgets/StatusBadge';
import { useDossierData } from '../hooks/useDossierData';
import { usePacketIndex } from '../hooks/usePacketIndex';

export default function Dossiers() {
  const navigate = useNavigate();
  const dossiers = useDossierData(false);
  const packets = usePacketIndex(false);

  const columns = [
    { key: 'dossier_id', label: 'Dossier ID', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val} /> },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (val) => new Date(val).toLocaleDateString()
    },
    { key: 'workflow', label: 'Workflow', sortable: true },
    {
      key: 'dossier_id',
      label: 'Packets',
      sortable: false,
      render: (val) => packets.getByDossier(val).length
    },
  ];

  const formatDuration = (ms) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${Math.round(ms / 1000)}s`;
    return `${Math.round(ms / 60000)}m`;
  };

  return (
    <ScreenGate screenId="SCR-003">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dossiers</h1>
          <div className="flex gap-2">
            <button
              onClick={() => { dossiers.refresh(); packets.refresh(); }}
              className="px-4 py-2 bg-shadow-accent hover:bg-blue-600 rounded transition-colors text-sm"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm"
            >
              ➕ Create New
            </button>
          </div>
        </div>

        {/* Dossiers Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            All Dossiers ({dossiers.getTotalCount()} total)
          </h2>
          <DataTable
            columns={columns}
            data={dossiers.data}
            loading={dossiers.loading}
            error={dossiers.error}
            onRowClick={(row) => navigate(`/dossiers/${row.dossier_id}/inspector`)}
            actions={[
              {
                label: 'View',
                className: 'bg-shadow-accent hover:bg-blue-600 text-white',
                onClick: (row) => navigate(`/dossiers/${row.dossier_id}/inspector`)
              }
            ]}
          />
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Breakdown */}
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Status Breakdown</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-green-300">Approved</span>
                <span className="font-semibold">{dossiers.getApprovedCount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-300">Pending</span>
                <span className="font-semibold">{dossiers.getPendingCount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-300">Failed</span>
                <span className="font-semibold">{dossiers.getFailedCount()}</span>
              </div>
              <div className="border-t border-gray-600 pt-2 flex justify-between">
                <span className="text-gray-300">Total</span>
                <span className="font-semibold">{dossiers.getTotalCount()}</span>
              </div>
            </div>
          </div>

          {/* Workflow Distribution */}
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Workflow Distribution</h3>
            <div className="space-y-3 text-sm">
              {(() => {
                const workflows = {};
                dossiers.data.forEach(d => {
                  workflows[d.workflow] = (workflows[d.workflow] || 0) + 1;
                });
                return Object.entries(workflows)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([wf, count]) => (
                    <div key={wf} className="flex justify-between">
                      <span className="text-gray-300">{wf}</span>
                      <span className="font-semibold text-shadow-accent">{count}</span>
                    </div>
                  ));
              })()}
            </div>
          </div>

          {/* Packet Statistics */}
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Packet Statistics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Total Packets</span>
                <span className="font-semibold text-blue-400">{packets.getTotalCount()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Artifact Types</span>
                <span className="font-semibold">{packets.getArtifactFamilies().length}</span>
              </div>
              <div className="border-t border-gray-600 pt-2">
                <div className="text-xs text-gray-500 mb-2">Top Types:</div>
                {(() => {
                  const counts = packets.countByArtifactFamily();
                  return Object.entries(counts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([type, count]) => (
                      <div key={type} className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">{type}</span>
                        <span className="text-gray-500">{count}</span>
                      </div>
                    ));
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Dossiers Detail */}
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Latest Dossiers</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {dossiers.data.slice(0, 10).map((dossier) => {
              const packetCount = packets.getByDossier(dossier.dossier_id).length;
              return (
                <div
                  key={dossier.dossier_id}
                  onClick={() => navigate(`/dossiers/${dossier.dossier_id}/inspector`)}
                  className="p-3 bg-gray-800 rounded border border-gray-600 hover:border-shadow-accent cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-gray-200">{dossier.dossier_id}</span>
                    <StatusBadge status={dossier.status} size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{dossier.workflow}</span>
                    <span>{new Date(dossier.created_at).toLocaleString()}</span>
                    <span className="text-gray-400">{packetCount} packets</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScreenGate>
  );
}
