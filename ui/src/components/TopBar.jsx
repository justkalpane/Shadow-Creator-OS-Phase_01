import { useAppStore } from '../store/useAppStore';
import ModeSelector from './ModeSelector';
import ModelSelector from './ModelSelector';
import ModuleSelector from './ModuleSelector';
import ContentModeSelector from './ContentModeSelector';

export default function TopBar({ onMenuClick }) {
  const { selectedMode, selectedModel, selectedModule, selectedContentMode } = useAppStore();

  return (
    <header className="bg-shadow-card border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            onClick={onMenuClick}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold whitespace-nowrap">Shadow Creator OS</h1>
        </div>

        {/* Center - Selectors (4 columns) */}
        <div className="flex items-center gap-3 flex-1 justify-center flex-wrap">
          <div className="text-xs text-gray-500 whitespace-nowrap">Mode:</div>
          <ModeSelector currentMode={selectedMode} />
          <div className="text-xs text-gray-500 whitespace-nowrap">Module:</div>
          <ModuleSelector currentModule={selectedModule} />
          <div className="text-xs text-gray-500 whitespace-nowrap">Content:</div>
          <ContentModeSelector currentContentMode={selectedContentMode} />
          <div className="text-xs text-gray-500 whitespace-nowrap">Model:</div>
          <ModelSelector currentModel={selectedModel} />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-xs text-gray-400">
            Connected: <span className="text-green-400 font-medium">n8n:5678</span>
          </div>
          <button className="px-3 py-1 text-sm bg-shadow-accent rounded hover:bg-blue-600 transition-colors">
            Account
          </button>
        </div>
      </div>
    </header>
  );
}
