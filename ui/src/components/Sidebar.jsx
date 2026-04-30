import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useModeRouter } from '../hooks/useModeRouter';

const operationalModes = [
  { id: 'alert', label: 'Alert Mode', icon: '🚨', minRole: 'operator', requiresConsent: true },
  { id: 'troubleshoot', label: 'Troubleshoot', icon: '🔧', minRole: 'builder', requiresConsent: true },
  { id: 'analysis', label: 'Analysis', icon: '📊', minRole: 'operator', requiresConsent: false },
  { id: 'self_learning', label: 'Self-Learning', icon: '🧠', minRole: 'founder', requiresConsent: true },
  { id: 'replay', label: 'Replay Mode', icon: '🔄', minRole: 'operator', requiresConsent: true },
  { id: 'safe', label: 'Safe Mode', icon: '✓', minRole: 'creator', requiresConsent: false },
  { id: 'debug', label: 'Debug Mode', icon: '🐛', minRole: 'builder', requiresConsent: false },
  { id: 'context_engineering', label: 'Context Eng.', icon: '🧩', minRole: 'founder', requiresConsent: false },
];

export default function Sidebar({ isOpen, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedMode, enabledOperationalModes, toggleOperationalMode } = useAppStore();
  const { getVisibleSidebarItems } = useModeRouter();
  const [showOperationalModes, setShowOperationalModes] = useState(false);

  const sidebarItems = getVisibleSidebarItems(selectedMode);
  const isActive = (url) => location.pathname.startsWith(url.split('/')[1]);

  const canEnableOperationalMode = (minRole) => {
    const modeHierarchy = { creator: 0, operator: 1, builder: 2, founder: 3 };
    const minRequired = modeHierarchy[minRole] || 0;
    const currentLevel = modeHierarchy[selectedMode] || 0;
    return currentLevel >= minRequired;
  };

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-shadow-card border-r border-gray-700 transition-all duration-300 flex flex-col overflow-y-auto`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <div className="text-2xl font-bold">
          {isOpen ? '🌑 ShadowOS' : '🌑'}
        </div>
      </div>

      {/* Mode Badge */}
      <div className="p-4 border-b border-gray-700">
        <div className="text-xs text-gray-400">CURRENT MODE</div>
        <div className="mt-1 px-2 py-1 bg-shadow-accent rounded text-sm font-medium capitalize">
          {selectedMode}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Dashboard link */}
        <button
          onClick={() => navigate('/')}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded transition-colors ${
            location.pathname === '/' || location.pathname === '/dashboard'
              ? 'bg-shadow-accent text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
          title="Dashboard"
        >
          <span className="text-lg">🏠</span>
          {isOpen && <span className="text-sm">Dashboard</span>}
        </button>

        {/* Mode-specific screens */}
        {sidebarItems.map((item) => {
          const screenRoutes = {
            'SCR-001': '/overview',
            'SCR-002': '/routes',
            'SCR-003': '/dossiers',
            'SCR-004': '/approvals',
            'SCR-005': '/errors',
            'SCR-006': '/mission-control',
            'SCR-007': '/founder-governance',
            'SCR-008': '/workflows',
            'SCR-014': '/alerts',
            'SCR-015': '/troubleshoot',
            'SCR-016': '/replay',
            'SCR-017': '/analytics',
            'SCR-018': '/learning',
          };
          const route = screenRoutes[item.screenId] || '/' + item.screenId.toLowerCase();

          return (
            <button
              key={item.screenId}
              onClick={() => navigate(route)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded transition-colors ${
                location.pathname === route
                  ? 'bg-shadow-accent text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              title={item.label}
            >
              <span className="text-lg">{item.icon}</span>
              {isOpen && <span className="text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Operational Modes Toggle */}
      <div className="border-t border-gray-700 p-4">
        <button
          onClick={() => setShowOperationalModes(!showOperationalModes)}
          className="w-full flex items-center gap-2 px-2 py-2 text-xs text-gray-400 hover:text-gray-200 transition-colors"
        >
          <span>⚡ Operational Modes</span>
          <span className="ml-auto text-xs">{showOperationalModes ? '▲' : '▼'}</span>
        </button>

        {showOperationalModes && isOpen && (
          <div className="mt-3 space-y-2 text-xs">
            {operationalModes.map((mode) => {
              const isEnabled = enabledOperationalModes.includes(mode.id);
              const canEnable = canEnableOperationalMode(mode.minRole);

              return (
                <label
                  key={mode.id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                    canEnable
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'text-gray-600 cursor-not-allowed'
                  }`}
                  title={!canEnable ? `Requires ${mode.minRole} mode` : ''}
                >
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={() => canEnable && toggleOperationalMode(mode.id)}
                    disabled={!canEnable}
                    className="rounded"
                  />
                  <span>{mode.icon}</span>
                  <span className="flex-1">{mode.label}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
        <p>Phase 1</p>
        <p>UI v0.1</p>
      </div>
    </aside>
  );
}
