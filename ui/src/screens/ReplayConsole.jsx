import { useState } from 'react';
import { useErrorEvents } from '../hooks/useErrorEvents';
import ScreenGate from '../components/ScreenGate';
import StatCard from '../components/widgets/StatCard';

function ReplayConsoleContent() {
  const { data: errorEvents, loading } = useErrorEvents(true);
  const [selectedStage, setSelectedStage] = useState('WF-200');
  const [replayInProgress, setReplayInProgress] = useState(false);

  const replayableErrors = errorEvents.filter(e => e.status === 'active');
  const stages = ['WF-100', 'WF-200', 'WF-300', 'WF-400', 'WF-500', 'WF-600'];

  const handleReplay = () => {
    setReplayInProgress(true);
    setTimeout(() => setReplayInProgress(false), 3000);
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading replay data...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">🔄 Replay Console</h1>
      <p className="text-gray-400 text-sm">Checkpoint-based replay and recovery</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Replayable Errors"
          value={replayableErrors.length}
          icon="🔄"
          color="blue"
        />
        <StatCard
          label="Recent Failures"
          value={replayableErrors.length}
          icon="⚠️"
          color="red"
        />
        <StatCard
          label="Success Rate (Last 10)"
          value="80%"
          icon="✓"
          color="green"
        />
        <StatCard
          label="Avg Recovery Time"
          value="2.3s"
          icon="⏱️"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">🎯 Replay Options</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Stage to Replay</label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white"
              >
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">From Checkpoint</label>
              <input
                type="text"
                placeholder="ckpt-2026-04-30-14:22:00"
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white text-sm"
              />
            </div>
            <button
              onClick={handleReplay}
              disabled={replayInProgress}
              className={`w-full px-4 py-3 rounded font-semibold transition ${
                replayInProgress
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {replayInProgress ? 'Replaying...' : 'Start Replay'}
            </button>
          </div>
        </div>

        <div className="bg-shadow-card p-6 rounded border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">📊 Replay History</h2>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {[
              { stage: 'WF-300', status: 'success', time: '2m ago' },
              { stage: 'WF-200', status: 'success', time: '5m ago' },
              { stage: 'WF-100', status: 'failed', time: '12m ago' },
              { stage: 'WF-400', status: 'success', time: '18m ago' },
            ].map((replay, idx) => (
              <div key={idx} className="bg-gray-800 p-3 rounded border border-gray-600 flex justify-between items-center">
                <div>
                  <div className="font-semibold">{replay.stage}</div>
                  <div className="text-xs text-gray-500">{replay.time}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  replay.status === 'success'
                    ? 'bg-green-900 text-green-300'
                    : 'bg-red-900 text-red-300'
                }`}>
                  {replay.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {replayInProgress && (
        <div className="bg-blue-900 border border-blue-600 rounded p-4">
          <div className="font-semibold text-blue-300 mb-3">🔄 Replay in progress...</div>
          <div className="w-full bg-blue-800 rounded h-2 overflow-hidden">
            <div className="bg-blue-400 h-2 rounded animate-pulse" style={{ width: '65%' }} />
          </div>
          <div className="text-sm text-blue-300 mt-2">Stage {selectedStage} - Executing from checkpoint...</div>
        </div>
      )}

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">🚨 Errors Available for Replay</h2>
        <div className="space-y-2">
          {replayableErrors.slice(0, 5).map(error => (
            <div key={error.error_id} className="bg-gray-800 p-3 rounded border border-gray-600 hover:border-blue-400 cursor-pointer transition flex justify-between items-center">
              <div className="flex-1">
                <div className="font-semibold">{error.error_type}</div>
                <div className="text-xs text-gray-500">{error.error_id}</div>
              </div>
              <button className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition">
                Replay
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReplayConsole() {
  return (
    <ScreenGate screenId="SCR-016" fallback="Replay Console">
      <ReplayConsoleContent />
    </ScreenGate>
  );
}
