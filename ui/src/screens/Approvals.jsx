import { useAppStore } from '../store/useAppStore';
import ScreenGate from '../components/ScreenGate';
import DataTable from '../components/widgets/DataTable';
import StatCard from '../components/widgets/StatCard';
import StatusBadge from '../components/widgets/StatusBadge';
import { useApprovalQueue } from '../hooks/useApprovalQueue';

export default function Approvals() {
  const { selectedMode } = useAppStore();
  const approvals = useApprovalQueue(false);

  const isFounder = selectedMode === 'founder';

  const columns = [
    { key: 'dossier_ref', label: 'Dossier', sortable: true },
    { key: 'artifact_family', label: 'Artifact Type', sortable: true },
    { key: 'approval_type', label: 'Approval Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val} /> },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (val) => val ? new Date(val).toLocaleString() : '—'
    },
  ];

  const pendingApprovals = approvals.getByStatus('PENDING');
  const resolvedApprovals = approvals.getByStatus('RESOLVED');

  const approvalTypeCounts = approvals.countByApprovalType();

  const handleApprove = (queueEntry) => {
    if (!isFounder) return;
    console.log('Approving:', queueEntry.queue_entry_id);
    alert(`Approved: ${queueEntry.queue_entry_id}\n(In a real system, this would trigger WF-010)`);
  };

  const handleReject = (queueEntry) => {
    if (!isFounder) return;
    console.log('Rejecting:', queueEntry.queue_entry_id);
    alert(`Rejected: ${queueEntry.queue_entry_id}`);
  };

  const handleRemodify = (queueEntry) => {
    if (!isFounder) return;
    console.log('Requesting remodify:', queueEntry.queue_entry_id);
    alert(`Remodify requested: ${queueEntry.queue_entry_id}\n(Would trigger workflow)`);
  };

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Pending"
            value={approvals.getPendingCount()}
            subtext="Awaiting decision"
            color="yellow"
            icon="⏳"
            loading={approvals.loading}
          />
          <StatCard
            title="Resolved"
            value={approvals.getResolvedCount()}
            subtext="Completed"
            color="green"
            icon="✓"
            loading={approvals.loading}
          />
          <StatCard
            title="Total"
            value={approvals.getTotalCount()}
            subtext="All-time queue entries"
            color="blue"
            icon="📋"
            loading={approvals.loading}
          />
        </div>

        {/* Pending Approvals Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Pending Approvals ({pendingApprovals.length})
          </h2>
          <DataTable
            columns={columns}
            data={pendingApprovals}
            loading={approvals.loading}
            error={approvals.error}
            actions={isFounder ? [
              {
                label: '✓ Approve',
                className: 'bg-green-700 hover:bg-green-600',
                onClick: handleApprove
              },
              {
                label: '✗ Reject',
                className: 'bg-red-700 hover:bg-red-600',
                onClick: handleReject
              },
              {
                label: '↻ Remodify',
                className: 'bg-yellow-700 hover:bg-yellow-600',
                onClick: handleRemodify
              }
            ] : undefined}
          />
        </div>

        {/* Approval Type Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* By Type */}
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Breakdown by Type</h3>
            <div className="space-y-3 text-sm">
              {Object.entries(approvalTypeCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-gray-300">{type}</span>
                    <span className="font-semibold text-shadow-accent">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Approval Status</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">In Review</span>
                <span className="font-semibold text-yellow-400">
                  {pendingApprovals.filter(a => a.status === 'PENDING').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Approved</span>
                <span className="font-semibold text-green-400">
                  {resolvedApprovals.filter(a => a.resolution === 'approved').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Rejected</span>
                <span className="font-semibold text-red-400">
                  {resolvedApprovals.filter(a => a.resolution === 'rejected').length}
                </span>
              </div>
              <div className="border-t border-gray-600 pt-3 flex justify-between">
                <span className="text-gray-300">Approval Rate</span>
                <span className="font-semibold text-green-400">
                  {resolvedApprovals.length > 0
                    ? Math.round((resolvedApprovals.filter(a => a.resolution === 'approved').length / resolvedApprovals.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Resolved Approvals */}
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Recent Resolutions</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {resolvedApprovals.slice(0, 10).map((approval) => (
              <div
                key={approval.queue_entry_id}
                className="p-3 bg-gray-800 rounded border border-gray-600 hover:border-gray-500"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium text-gray-200">{approval.dossier_ref}</span>
                  <StatusBadge
                    status={approval.resolution === 'approved' ? 'APPROVED' : 'FAILED'}
                    size="sm"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{approval.artifact_family}</span>
                  <span>{approval.created_at ? new Date(approval.created_at).toLocaleString() : '—'}</span>
                </div>
              </div>
            ))}
            {resolvedApprovals.length === 0 && (
              <p className="text-gray-400 text-sm">No resolved approvals yet</p>
            )}
          </div>
        </div>

        {!isFounder && (
          <div className="bg-blue-900 border border-blue-500 text-blue-200 px-4 py-3 rounded">
            ℹ️ You need Founder mode to approve, reject, or request modifications.
          </div>
        )}
      </div>
    </ScreenGate>
  );
}
