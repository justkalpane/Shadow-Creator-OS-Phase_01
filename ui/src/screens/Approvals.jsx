import { useNavigate } from 'react-router-dom';
import ScreenGate from '../components/ScreenGate';
import DataTable from '../components/widgets/DataTable';
import StatusBadge from '../components/widgets/StatusBadge';
import { useAppStore } from '../store/useAppStore';
import { useApprovalQueue } from '../hooks/useApprovalQueue';

export default function Approvals() {
  const navigate = useNavigate();
  const approvals = useApprovalQueue(false);
  const { selectedMode } = useAppStore();
  const isFounder = selectedMode === 'founder';

  const columns = [
    { key: 'queue_entry_id', label: 'Entry ID', sortable: true, render: (val) => val?.substring(0, 20) || '—' },
    { key: 'dossier_ref', label: 'Dossier', sortable: true, render: (val) => val?.substring(0, 20) || '—' },
    { key: 'approval_type', label: 'Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val} /> },
    { key: 'created_at', label: 'Created', sortable: true, render: (val) => new Date(val).toLocaleString() },
    { key: 'owner_director', label: 'Owner', sortable: true },
  ];

  const handleApprove = async (row) => {
    try {
      const response = await fetch(`/api/chat/dossiers/${row.dossier_ref}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_mode: selectedMode }),
      });
      if (response.ok) {
        approvals.refresh();
      }
    } catch (err) {
      console.error('Approval error:', err);
    }
  };

  const handleReject = async (row) => {
    const feedback = prompt('Enter rejection feedback:');
    if (feedback) {
      try {
        const response = await fetch(`/api/chat/dossiers/${row.dossier_ref}/reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_mode: selectedMode, feedback }),
        });
        if (response.ok) {
          approvals.refresh();
        }
      } catch (err) {
        console.error('Rejection error:', err);
      }
    }
  };

  const pendingCount = approvals.data.filter(a => a.status === 'PENDING').length;
  const resolvedCount = approvals.data.filter(a => a.status === 'RESOLVED').length;

  return (
    <ScreenGate screenId="SCR-004">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Approvals Queue</h1>
          <button
            onClick={() => approvals.refresh()}
            className="px-4 py-2 bg-shadow-accent hover:bg-blue-600 rounded transition-colors text-sm"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-shadow-card border border-gray-700 rounded p-4">
            <p className="text-sm text-gray-400">Total Entries</p>
            <p className="text-2xl font-bold mt-2">{approvals.getTotalCount()}</p>
          </div>
          <div className="bg-shadow-card border border-gray-700 rounded p-4">
            <p className="text-sm text-gray-400">Pending Review</p>
            <p className="text-2xl font-bold mt-2 text-yellow-400">{pendingCount}</p>
          </div>
          <div className="bg-shadow-card border border-gray-700 rounded p-4">
            <p className="text-sm text-gray-400">Resolved</p>
            <p className="text-2xl font-bold mt-2 text-green-400">{resolvedCount}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Queue Items</h2>
          <DataTable
            columns={columns}
            data={approvals.data}
            loading={approvals.loading}
            error={approvals.error}
            actions={isFounder ? [
              {
                label: '✓ Approve',
                className: 'bg-green-700 hover:bg-green-600 text-white',
                onClick: (row) => handleApprove(row)
              },
              {
                label: '✕ Reject',
                className: 'bg-red-700 hover:bg-red-600 text-white',
                onClick: (row) => handleReject(row)
              }
            ] : []}
          />
        </div>
      </div>
    </ScreenGate>
  );
}
