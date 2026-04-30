import { useAppStore } from '../store/useAppStore';
import ModeSelector from './ModeSelector';
import ModelSelector from './ModelSelector';
import ModuleSelector from './ModuleSelector';
import ContentModeSelector from './ContentModeSelector';

export default function TopBar({ onMenuClick }) {
  const { selectedMode, selectedModel, selectedModule, selectedContentMode } = useAppStore();

  return (
    <header className="bg-shadow-card border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ☰
          </button>
          <h1 className="text-xl font-semibold">Shadow Creator OS</h1>
        </div>

        {/* Center - Selectors */}
        <div className="flex items-center gap-6">
          <ModeSelector currentMode={selectedMode} />
          <ModelSelector currentModel={selectedModel} />
          <ModuleSelector />
          {selectedContentMode && <ContentModeSelector currentContentMode={selectedContentMode} />}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            Connected to: <span className="text-green-400 font-medium">localhost:5678</span>
          </div>
          <button className="px-4 py-2 bg-shadow-accent rounded hover:bg-blue-600 transition-colors">
            Account
          </button>
        </div>
      </div>
    </header>
  );
}
