import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

const menuItems = [
  { label: 'Dashboard', url: '/dashboard', icon: '🏠', role: 'all' },
  { label: 'Mission Control', url: '/mission-control', icon: '🎮', role: 'builder' },
  { label: 'Workflow Monitor', url: '/workflows', icon: '⚙️', role: 'all' },
  { label: 'Dossiers', url: '/dossiers', icon: '📁', role: 'all' },
  { label: 'Topics', url: '/pipelines/topic-intelligence', icon: '🔍', role: 'all' },
  { label: 'Research', url: '/research', icon: '📚', role: 'all' },
  { label: 'Scripts', url: '/script', icon: '📄', role: 'all' },
  { label: 'Context', url: '/context', icon: '🧩', role: 'all' },
  { label: 'Media', url: '/media', icon: '🖼️', role: 'all' },
  { label: 'Publishing', url: '/publishing', icon: '📤', role: 'all' },
  { label: 'Analytics', url: '/analytics', icon: '📊', role: 'all' },
  { label: 'Alerts', url: '/alerts', icon: '🔔', role: 'all' },
  { label: 'Troubleshoot', url: '/troubleshoot', icon: '🔧', role: 'builder' },
  { label: 'Replay', url: '/replay', icon: '🔄', role: 'operator' },
  { label: 'Learning', url: '/learning', icon: '🧠', role: 'founder' },
  { label: 'Settings', url: '/settings', icon: '⚙️', role: 'founder' },
];

export default function Sidebar({ isOpen, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedMode } = useAppStore();

  const isActive = (url) => location.pathname.startsWith(url.split('/')[1]);

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
        {menuItems.map((item) => (
          <button
            key={item.url}
            onClick={() => navigate(item.url)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded transition-colors ${
              isActive(item.url)
                ? 'bg-shadow-accent text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
            title={item.label}
          >
            <span className="text-lg">{item.icon}</span>
            {isOpen && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
        <p>Phase 1</p>
        <p>UI v0.1</p>
      </div>
    </aside>
  );
}
