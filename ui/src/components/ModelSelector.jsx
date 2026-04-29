import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

const models = [
  { id: 'ollama_local_llama3.2', label: 'Llama 3.2 (Local)', icon: '🦙' },
  { id: 'ollama_local_mistral', label: 'Mistral (Local)', icon: '🌪️' },
  { id: 'openrouter_claude', label: 'Claude (Cloud)', icon: '🤖', disabled: true },
  { id: 'gemini_pro', label: 'Gemini (Cloud)', icon: '✨', disabled: true },
];

export default function ModelSelector({ currentModel }) {
  const [open, setOpen] = useState(false);
  const { setSelectedModel } = useAppStore();

  const current = models.find((m) => m.id === currentModel);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
      >
        <span>{current?.icon}</span>
        <span className="text-sm font-medium">{current?.label}</span>
        <span className="text-xs">▼</span>
      </button>

      {open && (
        <div className="absolute top-12 right-0 bg-shadow-card border border-gray-600 rounded shadow-lg z-10 min-w-[200px]">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                if (!model.disabled) {
                  setSelectedModel(model.id);
                  setOpen(false);
                }
              }}
              disabled={model.disabled}
              className={`w-full text-left px-4 py-3 flex items-center gap-2 transition-colors ${
                model.disabled
                  ? 'opacity-50 cursor-not-allowed text-gray-500'
                  : currentModel === model.id
                  ? 'bg-shadow-accent'
                  : 'hover:bg-gray-700'
              }`}
            >
              <span>{model.icon}</span>
              <span className="text-sm">{model.label}</span>
              {model.disabled && <span className="text-xs ml-auto text-gray-500">Phase 2+</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
