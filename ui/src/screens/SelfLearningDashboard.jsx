import { useApprovalQueue } from '../hooks/useApprovalQueue';
import { useErrorEvents } from '../hooks/useErrorEvents';
import ScreenGate from '../components/ScreenGate';
import StatCard from '../components/widgets/StatCard';

function SelfLearningDashboardContent() {
  const { data: approvals, loading: approvalsLoading } = useApprovalQueue(true);
  const { data: errors, loading: errorsLoading } = useErrorEvents(true);

  const feedbackItems = approvals.filter(a => a.status === 'PENDING');
  const learningCycles = [
    { cycle: 1, feedback: 47, confidence: 0.78 },
    { cycle: 2, feedback: 52, confidence: 0.82 },
    { cycle: 3, feedback: 61, confidence: 0.87 },
    { cycle: 4, feedback: 58, confidence: 0.91 },
  ];

  const improvements = [
    { area: 'Content Quality', improvement: '+18%', trend: 'up' },
    { area: 'Response Time', improvement: '+22%', trend: 'up' },
    { area: 'User Satisfaction', improvement: '+15%', trend: 'up' },
    { area: 'Error Reduction', improvement: '-31%', trend: 'down' },
  ];

  if (approvalsLoading || errorsLoading) {
    return <div className="text-center text-gray-400 py-8">Loading learning data...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">🧠 Self-Learning Dashboard</h1>
      <p className="text-gray-400 text-sm">Autonomous system learning and auto-tuning</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Feedback Items"
          value={feedbackItems.length}
          icon="💬"
          color="blue"
        />
        <StatCard
          label="Learning Cycles"
          value="4"
          icon="🔄"
          color="purple"
        />
        <StatCard
          label="Model Confidence"
          value="91%"
          icon="🎯"
          color="green"
        />
        <StatCard
          label="Avg Improvement"
          value="+18.5%"
          icon="📈"
          color="green"
        />
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📊 Learning Progress</h2>
        <div className="space-y-4">
          {learningCycles.map((cycle, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Cycle {cycle.cycle}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-400">Feedback: {cycle.feedback}</span>
                  <span className="text-green-400">Confidence: {(cycle.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded"
                  style={{ width: `${cycle.confidence * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">📈 Performance Improvements</h2>
          <div className="space-y-3">
            {improvements.map((item, idx) => (
              <div key={idx} className="bg-gray-800 p-3 rounded border border-gray-600">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm">{item.area}</span>
                  <span className={`font-bold ${item.trend === 'up' ? 'text-green-400' : 'text-blue-400'}`}>
                    {item.improvement}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded h-2">
                  <div
                    className={`h-2 rounded ${item.trend === 'up' ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.abs(parseInt(item.improvement)) * 1.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">💡 Learning Insights</h2>
          <div className="space-y-3">
            <div className="bg-green-900 border border-green-700 rounded p-3">
              <div className="text-green-300 font-semibold text-sm">✓ High Confidence</div>
              <div className="text-xs text-green-300 mt-1">Model achieving 91% confidence in current cycle</div>
            </div>
            <div className="bg-blue-900 border border-blue-700 rounded p-3">
              <div className="text-blue-300 font-semibold text-sm">→ Learning Active</div>
              <div className="text-xs text-blue-300 mt-1">Processing 58 feedback items in current batch</div>
            </div>
            <div className="bg-yellow-900 border border-yellow-700 rounded p-3">
              <div className="text-yellow-300 font-semibold text-sm">! Adjustment Pending</div>
              <div className="text-xs text-yellow-300 mt-1">2 parameters ready for optimization</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">📋 Pending Feedback Items</h2>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {feedbackItems.slice(0, 8).map(item => (
            <div key={item.queue_entry_id} className="bg-gray-800 p-3 rounded border border-gray-600 flex justify-between items-center">
              <div className="text-sm">
                <div className="font-semibold">{item.approval_type}</div>
                <div className="text-xs text-gray-500">{item.queue_entry_id}</div>
              </div>
              <button className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition">
                Learn
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">🎯 Next Learning Goal</h2>
        <div className="bg-gray-800 p-4 rounded border border-gray-600">
          <div className="font-semibold mb-2">Reach 95% Confidence Threshold</div>
          <div className="w-full bg-gray-700 rounded h-3 mb-2">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded" style={{ width: '91%' }} />
          </div>
          <div className="text-sm text-gray-400">Current: 91% | Target: 95% | Remaining: 4% (≈ 25 feedback items)</div>
        </div>
      </div>
    </div>
  );
}

export default function SelfLearningDashboard() {
  return (
    <ScreenGate screenId="SCR-018" fallback="Self-Learning Dashboard">
      <SelfLearningDashboardContent />
    </ScreenGate>
  );
}
