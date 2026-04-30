import { useNavigate } from 'react-router-dom';
import ScreenGate from '../components/ScreenGate';
import StatCard from '../components/widgets/StatCard';
import DataTable from '../components/widgets/DataTable';
import StatusBadge from '../components/widgets/StatusBadge';
import DataLoadingError from '../components/DataLoadingError';
import LoadingSpinner from '../components/LoadingSpinner';
import { useDossierData } from '../hooks/useDossierData';
import { useErrorEvents } from '../hooks/useErrorEvents';
import { useApprovalQueue } from '../hooks/useApprovalQueue';
import { useRouteRuns } from '../hooks/useRouteRuns';

export default function Overview() {
  const navigate = useNavigate();
  const dossiers = useDossierData(false);
  const errors = useErrorEvents(false);
  const approvals = useApprovalQueue(false);
  const routes = useRouteRuns(false);

  const activeDossiers = dossiers.getApprovedCount();
  const openErrors = errors.getActiveCount();
  const pendingApprovals = approvals.getPendingCount();

  const bottlenecks = routes.getBottlenecks();
  const avgQueueDepth = bottlenecks.length > 0
    ? Math.round(bottlenecks.reduce((sum, b) => sum + b.avg_duration, 0) / bottlenecks.length / 1000)
    : 0;

  const recentFailures = dossiers.getByStatus('FAILED').slice(0, 10);

  const failureColumns = [
    { key: 'dossier_id', label: 'Dossier ID', sortable: true },
    { key: 'created_at', label: 'Created', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
    { key: 'workflow', label: 'Workflow', sortable: true },
    { key: 'status', label: 'Status', sortable: false, render: (val) => <StatusBadge status={val} /> },
  ];

  const loading = dossiers.loading || errors.loading || approvals.loading || routes.loading;
  const error = dossiers.error || errors.error || approvals.error || routes.error;

  return (
    <ScreenGate screenId="SCR-001">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">System Overview</h1>
          <button
            onClick={() => { dossiers.refresh(); errors.refresh(); approvals.refresh(); routes.refresh(); }}
            className="px-4 py-2 bg-shadow-accent hover:bg-blue-600 rounded transition-colors text-sm"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Dossiers"
            value={activeDossiers}
            subtext="Approved & executing"
            color="green"
            icon="✓"
            loading={dossiers.loading}
          />
          <StatCard
            title="Open Errors"
            value={openErrors}
            subtext="Active error events"
            color="red"
            icon="⚠️"
            onClick={() => navigate('/errors')}
            loading={errors.loading}
          />
          <StatCard
            title="Pending Approvals"
            value={pendingApprovals}
            subtext="Awaiting review"
            color="yellow"
            icon="⏳"
            onClick={() => navigate('/approvals')}
            loading={approvals.loading}
          />
          <StatCard
            title="Avg Queue Depth"
            value={`${avgQueueDepth}s`}
            subtext="Route execution time"
            color="blue"
            icon="⏱️"
            loading={routes.loading}
          />
        </div>

        {/* Error states with retry */}
        {dossiers.error && (
          <DataLoadingError
            error={dossiers.error}
            onRetry={dossiers.retry}
            title="Failed to Load Dossiers"
          />
        )}
        {errors.error && (
          <DataLoadingError
            error={errors.error}
            onRetry={errors.retry}
            title="Failed to Load Error Events"
          />
        )}
        {approvals.error && (
          <DataLoadingError
            error={approvals.error}
            onRetry={approvals.retry}
            title="Failed to Load Approvals"
          />
        )}
        {routes.error && (
          <DataLoadingError
            error={routes.error}
            onRetry={routes.retry}
            title="Failed to Load Route Runs"
          />
        )}

        {/* Recent Failures */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Failures</h2>
          <DataTable
            columns={failureColumns}
            data={recentFailures}
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

        {/* System Health Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Workflow Performance */}
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Workflow Performance</h3>
            <div className="space-y-3">
              {bottlenecks.slice(0, 5).map((b) => (
                <div key={b.workflow_id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300">{b.workflow_id}</span>
                  <span className="text-gray-500">{Math.round(b.avg_duration / 1000)}s avg</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dossier Status Distribution */}
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Dossier Status</h3>
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
              <div className="border-t border-gray-600 pt-2 mt-2 flex justify-between">
                <span className="text-gray-300">Total</span>
                <span className="font-semibold">{dossiers.getTotalCount()}</span>
              </div>
            </div>
          </div>

          {/* Error Severity */}
          <div className="bg-shadow-card p-6 rounded border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Error Severity</h3>
            <div className="space-y-3 text-sm">
              {(() => {
                const dist = errors.getSeverityDistribution();
                return (
                  <>
                    <div className="flex justify-between">
                      <span className="text-red-300">Critical</span>
                      <span className="font-semibold">{dist.critical}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-300">High</span>
                      <span className="font-semibold">{dist.high}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-300">Medium</span>
                      <span className="font-semibold">{dist.medium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-300">Low</span>
                      <span className="font-semibold">{dist.low}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </ScreenGate>
  );
}
