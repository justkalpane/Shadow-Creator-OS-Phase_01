import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useModeRegistry } from '../hooks/useModeRegistry';

export default function ModeSelector({ currentMode }) {
  const [open, setOpen] = useState(false);
  const { setSelectedMode } = useAppStore();
  const { getOperatingModesArray, getMode } = useModeRegistry();

  const modes = getOperatingModesArray();
  const current = getMode(currentMode);

  const handleModeChange = (modeId) => {
    setSelectedMode(modeId);
    localStorage.setItem('selectedMode', modeId);
    console.log(`✅ Mode changed to: ${modeId}`);
    setOpen(false);
  };

  if (!current) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-shadow-accent rounded hover:bg-blue-600 transition-colors"
      >
        <span className="text-lg">{current.label.split(' ')[0]}</span>
        <span className="text-sm font-medium">{current.label.split(' ').slice(1).join(' ')}</span>
        <span className="text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute top-12 left-0 bg-shadow-card border border-gray-600 rounded shadow-lg z-10 min-w-[320px]">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-700 last:border-b-0 ${
                currentMode === mode.id ? 'bg-blue-900 border-blue-500' : 'hover:bg-gray-700'
              }`}
            >
              <div className="text-2xl">{mode.label.split(' ')[0]}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{mode.label}</div>
                <div className="text-xs text-gray-400">{mode.description}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Routes: {mode.legal_routes?.length || 0} | Admin: {mode.can_edit_registry ? '✓' : '✗'}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
