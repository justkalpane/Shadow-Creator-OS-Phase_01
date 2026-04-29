import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

const contentModes = [
  {
    id: 'photo_gen',
    label: '📸 Photo Gen',
    description: 'Generate images and visual content',
    workflow: 'WF-400',
    subWorkflow: 'CWF-410',
    icon: '📸',
  },
  {
    id: 'script_gen',
    label: '🎬 Script Gen',
    description: 'Generate scripts and dialogues',
    workflow: 'WF-200',
    subWorkflow: 'CWF-210',
    icon: '🎬',
  },
  {
    id: 'debate_mode',
    label: '🤝 Debate',
    description: 'Multi-perspective debate generation',
    workflow: 'WF-200',
    subWorkflow: 'CWF-220',
    icon: '🤝',
  },
  {
    id: 'video_creator',
    label: '🎥 Video Creator',
    description: 'Create videos and animations',
    workflow: 'WF-400',
    subWorkflow: 'CWF-430',
    icon: '🎥',
  },
  {
    id: 'avatar_creator',
    label: '👤 Avatar Creator',
    description: 'Generate avatars and digital personas',
    workflow: 'WF-400',
    subWorkflow: 'CWF-440',
    icon: '👤',
  },
  {
    id: 'music_gen',
    label: '🎵 Music',
    description: 'Generate music and instrumental tracks',
    workflow: 'WF-400',
    subWorkflow: 'CWF-450',
    icon: '🎵',
  },
  {
    id: 'song_gen',
    label: '🎤 Songs',
    description: 'Generate songs with lyrics',
    workflow: 'WF-400',
    subWorkflow: 'CWF-460',
    icon: '🎤',
  },
  {
    id: 'poetry_gen',
    label: '📝 Poetry',
    description: 'Generate poetry and creative writing',
    workflow: 'WF-200',
    subWorkflow: 'CWF-270',
    icon: '📝',
  },
];

export default function ContentModeSelector({ currentContentMode }) {
  const [open, setOpen] = useState(false);
  const { setSelectedContentMode } = useAppStore();

  const current = contentModes.find((m) => m.id === currentContentMode);

  const handleContentModeChange = (modeId) => {
    setSelectedContentMode(modeId);
    localStorage.setItem('selectedContentMode', modeId);
    console.log(`✅ Content mode changed to: ${modeId}`);
    setOpen(false);
  };

  if (!current) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
      >
        <span className="text-lg">{current.icon}</span>
        <span className="text-sm font-medium">{current.label.split(' ').pop()}</span>
        <span className="text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute top-12 left-0 bg-shadow-card border border-gray-600 rounded shadow-lg z-10 min-w-[300px]">
          <div className="px-4 py-2 bg-gray-800 border-b border-gray-600">
            <div className="text-xs font-semibold text-gray-400">CONTENT GENERATION MODES</div>
          </div>
          {contentModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleContentModeChange(mode.id)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-700 last:border-b-0 ${
                currentContentMode === mode.id ? 'bg-purple-900 border-purple-500' : 'hover:bg-gray-700'
              }`}
            >
              <div className="text-2xl">{mode.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{mode.label}</div>
                <div className="text-xs text-gray-400">{mode.description}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {mode.workflow} → {mode.subWorkflow}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
