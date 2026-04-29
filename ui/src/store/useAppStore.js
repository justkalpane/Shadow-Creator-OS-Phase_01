import { create } from 'zustand';

const loadFromLocalStorage = () => ({
  selectedMode: localStorage.getItem('selectedMode') || 'creator',
  selectedModel: localStorage.getItem('selectedModel') || 'ollama_local_llama3.2',
  selectedModule: localStorage.getItem('selectedModule') || 'local',
  selectedContentMode: localStorage.getItem('selectedContentMode') || 'script_gen',
  enabledOperationalModes: JSON.parse(localStorage.getItem('enabledOperationalModes') || '[]'),
});

export const useAppStore = create((set) => ({
  // Current selections (loaded from localStorage)
  ...loadFromLocalStorage(),
  selectedDossier: null,

  // UI state
  sidebarOpen: true,
  currentScreen: 'dashboard',
  loading: false,
  error: null,

  // Data
  dossiers: [],
  workflows: [],
  executions: [],
  alertsList: [],

  // Actions
  setSelectedMode: (mode) => set({ selectedMode: mode }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setSelectedModule: (module) => set({ selectedModule: module }),
  setSelectedContentMode: (contentMode) => set({ selectedContentMode: contentMode }),
  setSelectedDossier: (dossier) => set({ selectedDossier: dossier }),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentScreen: (screen) => set({ currentScreen: screen }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  setDossiers: (dossiers) => set({ dossiers }),
  setWorkflows: (workflows) => set({ workflows }),
  setExecutions: (executions) => set({ executions }),
  setAlerts: (alerts) => set({ alertsList: alerts }),

  toggleOperationalMode: (modeId) => set((state) => {
    const enabled = state.enabledOperationalModes || [];
    const updated = enabled.includes(modeId)
      ? enabled.filter((m) => m !== modeId)
      : [...enabled, modeId];
    localStorage.setItem('enabledOperationalModes', JSON.stringify(updated));
    return { enabledOperationalModes: updated };
  }),

  // Derived state
  getMode: (state) => state.selectedMode,
  getModel: (state) => state.selectedModel,
  getModule: (state) => state.selectedModule,
  getContentMode: (state) => state.selectedContentMode,
}));
