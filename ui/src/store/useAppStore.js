import { create } from 'zustand';

const loadFromLocalStorage = () => ({
  selectedMode: localStorage.getItem('selectedMode') || 'creator',
  selectedModel: localStorage.getItem('selectedModel') || 'ollama_local_llama3.2',
  selectedModule: localStorage.getItem('selectedModule') || 'local',
  selectedContentMode: localStorage.getItem('selectedContentMode') || null,
  enabledOperationalModes: JSON.parse(localStorage.getItem('enabledOperationalModes') || '["safe"]'),
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

  // Actions for mode selection
  setSelectedMode: (mode) => {
    localStorage.setItem('selectedMode', mode);
    set({ selectedMode: mode });
  },
  setSelectedModel: (model) => {
    localStorage.setItem('selectedModel', model);
    set({ selectedModel: model });
  },
  setSelectedModule: (module) => {
    localStorage.setItem('selectedModule', module);
    set({ selectedModule: module });
  },
  setSelectedContentMode: (contentMode) => {
    if (contentMode) {
      localStorage.setItem('selectedContentMode', contentMode);
    } else {
      localStorage.removeItem('selectedContentMode');
    }
    set({ selectedContentMode: contentMode });
  },
  setEnabledOperationalModes: (modes) => {
    localStorage.setItem('enabledOperationalModes', JSON.stringify(modes));
    set({ enabledOperationalModes: modes });
  },
  toggleOperationalMode: (mode) => {
    set((state) => {
      const updated = state.enabledOperationalModes.includes(mode)
        ? state.enabledOperationalModes.filter(m => m !== mode)
        : [...state.enabledOperationalModes, mode];
      localStorage.setItem('enabledOperationalModes', JSON.stringify(updated));
      return { enabledOperationalModes: updated };
    });
  },

  // Actions for dossiers
  setSelectedDossier: (dossier) => set({ selectedDossier: dossier }),

  // Actions for UI state
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentScreen: (screen) => set({ currentScreen: screen }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Actions for data
  setDossiers: (dossiers) => set({ dossiers }),
  setWorkflows: (workflows) => set({ workflows }),
  setExecutions: (executions) => set({ executions }),
  setAlerts: (alerts) => set({ alertsList: alerts }),

  // Derived state
  getMode: (state) => state.selectedMode,
  getModel: (state) => state.selectedModel,
  getModule: (state) => state.selectedModule,
  getContentMode: (state) => state.selectedContentMode,
  hasOperationalMode: (state, mode) => state.enabledOperationalModes.includes(mode),
}));
