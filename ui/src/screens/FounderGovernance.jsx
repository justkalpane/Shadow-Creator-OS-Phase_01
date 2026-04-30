import ScreenGate from '../components/ScreenGate';
import StatCard from '../components/widgets/StatCard';

function FounderGovernanceContent() {
  const blockerMatrix = {
    critical: [
      { id: 'BLK-001', name: 'Founder signing authority', status: 'resolved', severity: 'critical' },
      { id: 'BLK-002', name: 'Privacy compliance gate', status: 'resolved', severity: 'critical' },
    ],
    high: [
      { id: 'BLK-003', name: 'Quality threshold enforcement', status: 'pending', severity: 'high' },
      { id: 'BLK-004', name: 'Resource allocation limits', status: 'pending', severity: 'high' },
    ],
  };

  const decisionPackets = [
    { id: 'DP-001', type: 'Release Promotion', status: 'approved', timestamp: '2026-04-28T14:22:00Z' },
    { id: 'DP-002', type: 'Policy Override', status: 'pending_review', timestamp: '2026-04-29T09:15:00Z' },
    { id: 'DP-003', type: 'Escalation Authority', status: 'approved', timestamp: '2026-04-27T16:45:00Z' },
  ];

  const providerPosture = [
    { name: 'Local Execution', status: 'healthy', load: 67 },
    { name: 'Cloud Runtime', status: 'healthy', load: 42 },
    { name: 'Hybrid Mode', status: 'degraded', load: 58 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">⚙️ Founder Governance</h1>
      <p className="text-gray-400 text-sm">Registry oversight, decision authority, and system posture</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Critical Blockers"
          value={blockerMatrix.critical.length}
          icon="🔴"
          color={blockerMatrix.critical.filter(b => b.status === 'pending').length > 0 ? 'red' : 'green'}
        />
        <StatCard
          label="High-Priority Items"
          value={blockerMatrix.high.filter(b => b.status === 'pending').length}
          icon="🟠"
          color="yellow"
        />
        <StatCard
          label="Pending Decisions"
          value={decisionPackets.filter(d => d.status === 'pending_review').length}
          icon="⚖️"
          color="blue"
        />
        <StatCard
          label="Provider Health"
          value={providerPosture.filter(p => p.status === 'healthy').length}
          icon="🏥"
          color="green"
        />
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🚫 Blocker Matrix
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-red-400 mb-3">CRITICAL BLOCKERS</h3>
            <div className="space-y-2">
              {blockerMatrix.critical.map(blocker => (
                <div key={blocker.id} className="bg-gray-800 p-4 rounded border border-gray-600 flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{blocker.name}</div>
                    <div className="text-xs text-gray-500">{blocker.id}</div>
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${
                    blocker.status === 'resolved'
                      ? 'bg-green-900 text-green-300'
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {blocker.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-yellow-400 mb-3">HIGH-PRIORITY BLOCKERS</h3>
            <div className="space-y-2">
              {blockerMatrix.high.map(blocker => (
                <div key={blocker.id} className="bg-gray-800 p-4 rounded border border-gray-600 flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{blocker.name}</div>
                    <div className="text-xs text-gray-500">{blocker.id}</div>
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-semibold ${
                    blocker.status === 'resolved'
                      ? 'bg-green-900 text-green-300'
                      : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {blocker.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          ⚖️ Decision Packet Register
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-600">
              <tr>
                <th className="text-left py-2 px-2 font-semibold">Packet ID</th>
                <th className="text-left py-2 px-2 font-semibold">Type</th>
                <th className="text-left py-2 px-2 font-semibold">Status</th>
                <th className="text-left py-2 px-2 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {decisionPackets.map(packet => (
                <tr key={packet.id} className="hover:bg-gray-800 transition">
                  <td className="py-2 px-2 font-semibold">{packet.id}</td>
                  <td className="py-2 px-2">{packet.type}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      packet.status === 'approved'
                        ? 'bg-green-900 text-green-300'
                        : packet.status === 'pending_review'
                        ? 'bg-blue-900 text-blue-300'
                        : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {packet.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-gray-400">{new Date(packet.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🏥 Provider Posture
        </h2>
        <div className="space-y-4">
          {providerPosture.map(provider => (
            <div key={provider.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{provider.name}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  provider.status === 'healthy'
                    ? 'bg-green-900 text-green-300'
                    : provider.status === 'degraded'
                    ? 'bg-yellow-900 text-yellow-300'
                    : 'bg-red-900 text-red-300'
                }`}>
                  {provider.status.toUpperCase()}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded"
                  style={{ width: `${provider.load}%` }}
                />
              </div>
              <div className="text-xs text-gray-500">Load: {provider.load}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          🚀 Release Readiness Status
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>All blockers resolved</span>
            <span className="text-green-400 font-semibold">✓ COMPLETE</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Decision packets approved</span>
            <span className="text-green-400 font-semibold">✓ COMPLETE</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Provider health verified</span>
            <span className="text-green-400 font-semibold">✓ COMPLETE</span>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-600">
            <span className="font-semibold text-lg">Overall Status</span>
            <span className="text-green-400 font-bold text-lg">READY FOR RELEASE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FounderGovernance() {
  return (
    <ScreenGate screenId="SCR-007" fallback="Founder Governance">
      <FounderGovernanceContent />
    </ScreenGate>
  );
}
