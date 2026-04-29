import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

const modes = [
  { id: 'founder', label: 'Founder Mode', icon: '👑' },
  { id: 'creator', label: 'Creator Mode', icon: '🎬' },
  { id: 'builder', label: 'Builder Mode', icon: '🏗️' },
  { id: 'operator', label: 'Operator Mode', icon: '🎮' },
];

export default function ModeSelector({ currentMode }) {
  const [open, setOpen] = useState(false);
  const { setSelectedMode } = useAppStore();

  const current = modes.find((m) => m.id === currentMode);

  const handleModeChange = (modeId) => {
    setSelectedMode(modeId);
    localStorage.setItem('selectedMode', modeId);
    console.log(`✅ Mode changed to: ${modeId}`);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-shadow-accent rounded hover:bg-blue-600 transition-colors"
      >
        <span>{current?.icon}</span>
        <span className="text-sm font-medium">{current?.label}</span>
        <span className="text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute top-12 left-0 bg-shadow-card border border-gray-600 rounded shadow-lg z-10 min-w-[180px]">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={`w-full text-left px-4 py-3 flex items-center gap-2 transition-colors ${
                currentMode === mode.id
                  ? 'bg-shadow-accent'
                  : 'hover:bg-gray-700'
              }`}
              title={`Switch to ${mode.label}`}
            >
              <span>{mode.icon}</span>
              <span className="text-sm">{mode.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
