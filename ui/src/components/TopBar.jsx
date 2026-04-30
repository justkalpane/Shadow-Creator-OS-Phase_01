import { useAppStore } from '../store/useAppStore';
import ModeSelector from './ModeSelector';
import ModelSelector from './ModelSelector';
import ModuleSelector from './ModuleSelector';
import ContentModeSelector from './ContentModeSelector';

export default function TopBar({ onMenuClick }) {
  const { selectedMode, selectedModel, selectedContentMode } = useAppStore();

  return (
    <header className="bg-shadow-card border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="text-gray-300 hover:text-white transition-colors">Menu</button>
          <h1 className="text-xl font-semibold">Shadow Creator OS</h1>
        </div>

        <div className="flex items-center gap-4">
          <ModeSelector currentMode={selectedMode} />
          <ModelSelector currentModel={selectedModel} />
          <ModuleSelector />
          {selectedContentMode && <ContentModeSelector currentContentMode={selectedContentMode} />}
        </div>

        <div className="text-xs text-gray-400">
          backend <span className="text-green-400">localhost:5002</span> | n8n <span className="text-green-400">localhost:5678</span>
        </div>
      </div>
    </header>
  );
}
