import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useModeRouter } from '../hooks/useModeRouter';

const operationalModesRegistry = {
  alert: {
    id: 'alert',
    label: 'Alert Mode',
    icon: '🔔',
    description: 'Real-time system monitoring and alerting',
    min_role: 'operator',
    requires_consent: true,
  },
  troubleshoot: {
    id: 'troubleshoot',
    label: 'Troubleshoot Mode',
    icon: '🔧',
    description: 'Debug and diagnose system issues',
    min_role: 'builder',
    requires_consent: true,
  },
  analysis: {
    id: 'analysis',
    label: 'Analysis Dashboard',
    icon: '📊',
    description: 'Deep-dive operational analytics',
    min_role: 'operator',
    requires_consent: false,
  },
  self_learning: {
    id: 'self_learning',
    label: 'Self-Learning Mode',
    icon: '🧠',
    description: 'Automated model improvement',
    min_role: 'founder',
    requires_consent: true,
  },
  replay: {
    id: 'replay',
    label: 'Replay Mode',
    icon: '🔄',
    description: 'Replay and rerun workflows',
    min_role: 'operator',
    requires_consent: true,
  },
  safe: {
    id: 'safe',
    label: 'Safe Mode',
    icon: '🛡️',
    description: 'Conservative, safe execution mode',
    min_role: 'creator',
    requires_consent: false,
  },
  debug: {
    id: 'debug',
    label: 'Debug Mode',
    icon: '🐛',
    description: 'Detailed execution tracing',
    min_role: 'builder',
    requires_consent: true,
  },
  context_engineering: {
    id: 'context_engineering',
    label: 'Context Engineering',
    icon: '🧩',
    description: 'Advanced context manipulation',
    min_role: 'founder',
    requires_consent: true,
  },
};

export default function OperationalModesToggles() {
  const [showConsent, setShowConsent] = useState(null);
  const selectedMode = useAppStore((state) => state.selectedMode);
  const enabledOperationalModes = useAppStore((state) => state.enabledOperationalModes);
  const toggleOperationalMode = useAppStore((state) => state.toggleOperationalMode);

  const canAccessMode = (modeConfig) => {
    const roleHierarchy = { founder: 0, creator: 1, builder: 2, operator: 3 };
    const userRoleLevel = roleHierarchy[selectedMode] || 3;
    const requiredRoleLevel = roleHierarchy[modeConfig.min_role] || 3;
    return userRoleLevel <= requiredRoleLevel;
  };

  const handleToggle = (mode) => {
    const modeConfig = operationalModesRegistry[mode.id];
    if (modeConfig.requires_consent) {
      setShowConsent(mode.id);
    } else {
      toggleOperationalMode(mode.id);
    }
  };

  const confirmConsent = () => {
    toggleOperationalMode(showConsent);
    setShowConsent(null);
  };

  return (
    <div className="space-y-3">
      <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase">
        Operational Modes
      </div>

      <div className="space-y-2 px-2">
        {Object.values(operationalModesRegistry).map(mode => {
          const canAccess = canAccessMode(mode);
          const isEnabled = enabledOperationalModes.includes(mode.id);

          return (
            <button
              key={mode.id}
              onClick={() => canAccess && handleToggle(mode)}
              disabled={!canAccess}
              className={`w-full text-left px-3 py-2 rounded border transition flex items-center gap-2 ${
                canAccess
                  ? isEnabled
                    ? 'bg-green-900 border-green-600 text-white'
                    : 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-900 border-gray-700 text-gray-600 opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="text-lg">{mode.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">{mode.label}</div>
                <div className="text-xs text-gray-500 truncate">{mode.description}</div>
              </div>
              <div className={`w-4 h-4 rounded border-2 transition ${
                isEnabled
                  ? 'bg-green-500 border-green-400'
                  : 'border-gray-500'
              }`}>
                {isEnabled && <div className="text-xs text-white text-center">✓</div>}
              </div>
            </button>
          );
        })}
      </div>

      {showConsent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-shadow-card rounded border border-gray-600 p-6 max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-3">
              {operationalModesRegistry[showConsent]?.label}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {operationalModesRegistry[showConsent]?.description}
            </p>
            <div className="bg-yellow-900 border border-yellow-700 rounded p-3 mb-4 text-sm text-yellow-200">
              ⚠️ This mode requires explicit consent. It may affect system behavior and data handling.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConsent(null)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmConsent}
                className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold transition"
              >
                Enable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
