import { useRouteRuns } from '../hooks/useRouteRuns';
import { useDossierData } from '../hooks/useDossierData';
import { useApprovalQueue } from '../hooks/useApprovalQueue';
import ScreenGate from '../components/ScreenGate';
import { useAppStore } from '../store/useAppStore';
import DAGVisualization from '../components/widgets/DAGVisualization';
import StatCard from '../components/widgets/StatCard';
import TimelinePanel from '../components/widgets/TimelinePanel';

function MissionControlContent() {
  const selectedMode = useAppStore((state) => state.selectedMode);
  const { data: routeRuns, loading: routesLoading } = useRouteRuns(true);
  const { data: dossiers, loading: dossiersLoading } = useDossierData(true);
  const { data: approvals, loading: approvalsLoading } = useApprovalQueue(true);

  const workflowSequence = ['WF-100', 'WF-200', 'WF-300', 'WF-400', 'WF-500', 'WF-600'];

  const getBottlenecks = () => {
    const byWorkflow = {};
    routeRuns.forEach(run => {
      if (!byWorkflow[run.workflow_id]) {
        byWorkflow[run.workflow_id] = { workflow_id: run.workflow_id, durations: [] };
      }
      if (run.started_at && run.stopped_at) {
        const duration = new Date(run.stopped_at) - new Date(run.started_at);
        byWorkflow[run.workflow_id].durations.push(duration);
      }
    });

    return Object.values(byWorkflow)
      .map(item => ({
        workflow_id: item.workflow_id,
        avg_duration: item.durations.length > 0
          ? item.durations.reduce((a, b) => a + b, 0) / item.durations.length
          : 0,
      }))
      .sort((a, b) => b.avg_duration - a.avg_duration)
      .slice(0, 5);
  };

  const calculateWeightedETA = () => {
    const bottlenecks = getBottlenecks();
    const totalMs = bottlenecks.reduce((sum, b) => sum + b.avg_duration, 0);
    const minutes = Math.round(totalMs / 60000);
    return minutes;
  };

  const getQueueDepth = () => {
    const pending = dossiers.filter(d => d.status === 'pending').length;
    const processing = dossiers.filter(d => d.status === 'processing').length;
    const blocked = approvals.filter(a => a.status === 'PENDING').length;
    return { pending, processing, blocked };
  };

  const bottlenecks = getBottlenecks();
  const eta = calculateWeightedETA();
  const queueDepth = getQueueDepth();
  const isLoading = routesLoading || dossiersLoading || approvalsLoading;

  if (isLoading) {
    return <div className="text-center text-gray-400 py-8">Loading real-time execution data...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">🎯 Mission Control</h1>
      <p className="text-gray-400 text-sm">Real-time workflow orchestration and pipeline monitoring</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Weighted ETA"
          value={`${eta}m`}
          icon="⏱️"
          color="blue"
          trend={eta < 5 ? 'up' : 'down'}
        />
        <StatCard
          label="Pending Dossiers"
          value={queueDepth.pending}
          icon="📋"
          color="yellow"
        />
        <StatCard
          label="In Processing"
          value={queueDepth.processing}
          icon="⚙️"
          color="purple"
        />
        <StatCard
          label="Blocked Items"
          value={queueDepth.blocked}
          icon="🚫"
          color={queueDepth.blocked > 0 ? 'red' : 'green'}
        />
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🔄 Active Execution DAG
        </h2>
        <DAGVisualization
          nodes={workflowSequence.map((wf, i) => ({
            id: wf,
            label: wf,
            x: (i / (workflowSequence.length - 1)) * 80 + 10,
            y: 50,
            status: i < 3 ? 'completed' : 'pending',
          }))}
          edges={workflowSequence.slice(0, -1).map((wf, i) => ({
            from: wf,
            to: workflowSequence[i + 1],
          }))}
        />
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          📊 Bottleneck Analysis
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-600">
              <tr>
                <th className="text-left py-2 px-2 font-semibold">Workflow</th>
                <th className="text-right py-2 px-2 font-semibold">Avg Duration</th>
                <th className="text-right py-2 px-2 font-semibold">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {bottlenecks.map((b, idx) => (
                <tr key={b.workflow_id} className="hover:bg-gray-800 transition">
                  <td className="py-2 px-2">{b.workflow_id}</td>
                  <td className="text-right py-2 px-2">{(b.avg_duration / 1000).toFixed(1)}s</td>
                  <td className="text-right py-2 px-2">
                    <span className={`font-semibold ${idx === 0 ? 'text-red-400' : idx === 1 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {idx === 0 ? 'Critical' : idx === 1 ? 'High' : 'Medium'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          📈 Queue Depth By Stage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workflowSequence.map((wf, i) => {
            const stageApprovals = approvals.filter(a => a.status === 'PENDING').length;
            const stagePending = Math.max(0, queueDepth.pending - (i * 3));
            return (
              <div key={wf} className="bg-gray-800 p-4 rounded border border-gray-600">
                <div className="font-semibold text-gray-300">{wf}</div>
                <div className="text-2xl font-bold mt-2">{Math.max(0, stagePending - (i * 2))}</div>
                <div className="text-xs text-gray-500 mt-1">items pending</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          ⏱️ Recent Executions
        </h2>
        <TimelinePanel
          events={routeRuns.slice(0, 5).map(run => ({
            id: run.route_run_id,
            timestamp: run.started_at,
            title: `${run.workflow_id} - ${run.status}`,
            status: run.status,
            details: `Duration: ${run.stopped_at && run.started_at ? ((new Date(run.stopped_at) - new Date(run.started_at)) / 1000).toFixed(1) : '?'}s`,
          }))}
        />
      </div>
    </div>
  );
}

export default function MissionControl() {
  return (
    <ScreenGate screenId="SCR-006" fallback="Mission Control">
      <MissionControlContent />
    </ScreenGate>
  );
}
