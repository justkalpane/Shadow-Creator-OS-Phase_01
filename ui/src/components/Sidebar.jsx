import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { useModeRouter } from '../hooks/useModeRouter';
import OperationalModes from './OperationalModes';

export default function Sidebar({ isOpen, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedMode } = useAppStore();
  const { getVisibleSidebarItems, getScreenDetails } = useModeRouter();

  const sidebarItems = getVisibleSidebarItems(selectedMode);

  const isActive = (screenId) => {
    const screen = getScreenDetails(screenId);
    if (!screen) return false;
    return location.pathname === screen.route;
  };

  const getRouteForScreen = (screenId) => {
    const screen = getScreenDetails(screenId);
    return screen ? screen.route : '/' + screenId.toLowerCase();
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

        {/* Chat link */}
        <button
          onClick={() => navigate('/chat')}
          className={`w-full flex items-center gap-3 px-4 py-2 rounded transition-colors ${
            location.pathname === '/chat'
              ? 'bg-shadow-accent text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
          title="Chat"
        >
          <span className="text-lg">💬</span>
          {isOpen && <span className="text-sm">Chat</span>}
        </button>

        {/* Mode-specific screens */}
        {sidebarItems.map((item) => {
          const route = getRouteForScreen(item.screenId);
          const active = isActive(item.screenId);

          return (
            <button
              key={item.screenId}
              onClick={() => navigate(route)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded transition-colors ${
                active
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

      {/* Operational Modes Panel */}
      <div className="border-t border-gray-700 p-4">
        <OperationalModes />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
        <p>Phase 1</p>
        <p>UI v0.1</p>
      </div>
    </aside>
  );
}
