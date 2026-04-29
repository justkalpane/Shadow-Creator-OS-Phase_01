import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useModeRegistry } from '../hooks/useModeRegistry';

export default function ModuleSelector({ currentModule }) {
  const [open, setOpen] = useState(false);
  const { setSelectedModule } = useAppStore();
  const { getRuntimeModesArray } = useModeRegistry();

  const runtimeModes = getRuntimeModesArray();
  const current = runtimeModes.find((m) => m.id === currentModule);

  const handleModuleChange = (moduleId) => {
    const mode = runtimeModes.find((m) => m.id === moduleId);
    if (!mode?.disabled) {
      setSelectedModule(moduleId);
      localStorage.setItem('selectedModule', moduleId);
      console.log(`✅ Module changed to: ${moduleId}`);
      setOpen(false);
    }
  };

  if (!current) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
      >
        <span className="text-lg">{current.label.split(' ')[0]}</span>
        <span className="text-sm font-medium">{current.label.split(' ').slice(1).join(' ')}</span>
        <span className="text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute top-12 right-0 bg-shadow-card border border-gray-600 rounded shadow-lg z-10 min-w-[280px]">
          {runtimeModes.map((module) => (
            <button
              key={module.id}
              onClick={() => handleModuleChange(module.id)}
              disabled={module.disabled}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-700 last:border-b-0 ${
                module.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : currentModule === module.id
                  ? 'bg-green-900 border-green-500'
                  : 'hover:bg-gray-700'
              }`}
            >
              <div className="text-2xl">{module.label.split(' ')[0]}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{module.label}</div>
                <div className="text-xs text-gray-400">{module.description}</div>
                {module.disabled && (
                  <div className="text-xs text-yellow-500 mt-1">Available in Phase 2+</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
