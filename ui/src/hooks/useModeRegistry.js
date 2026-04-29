import { useEffect, useState } from 'react';
import yaml from 'js-yaml';

export const useModeRegistry = () => {
  const [modes, setModes] = useState(null);
  const [runtimeModes, setRuntimeModes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadModeRegistry();
  }, []);

  const loadModeRegistry = async () => {
    try {
      // Fetch the YAML file directly or use embedded data
      // For Phase 2A, we'll embed the data to avoid YAML parsing complexity
      const registryData = {
        operating_modes: {
          founder: {
            id: 'founder',
            class: 'operating_mode',
            label: '👑 Founder Mode',
            description: 'Governance, override, cost approval, release authority, and full-route visibility',
            legal_routes: ['ROUTE_PHASE1_STANDARD', 'ROUTE_PHASE1_FAST', 'ROUTE_PHASE1_REPLAY'],
            can_approve_premium: true,
            can_access_rca: true,
            can_edit_registry: true,
            can_access_mission_control: true,
            provider_access_posture: 'founder_approved_only',
          },
          creator: {
            id: 'creator',
            class: 'operating_mode',
            label: '🎬 Creator Mode',
            description: 'Safe daily production mode for content operations',
            legal_routes: ['ROUTE_PHASE1_STANDARD', 'ROUTE_PHASE1_FAST'],
            can_approve_premium: false,
            can_access_rca: false,
            can_edit_registry: false,
            can_access_mission_control: false,
            provider_access_posture: 'no_premium',
          },
          builder: {
            id: 'builder',
            class: 'operating_mode',
            label: '🏗️ Builder Mode',
            description: 'Repo and contract construction mode',
            legal_routes: [],
            can_approve_premium: false,
            can_access_rca: false,
            can_edit_registry: true,
            can_access_mission_control: false,
            provider_access_posture: 'none',
          },
          operator: {
            id: 'operator',
            class: 'operating_mode',
            label: '🎮 Operator Mode',
            description: 'Support and bounded recovery mode',
            legal_routes: ['ROUTE_PHASE1_REPLAY'],
            can_approve_premium: false,
            can_access_rca: true,
            can_edit_registry: false,
            can_access_mission_control: false,
            provider_access_posture: 'no_premium',
          },
        },
        operational_modes: {
          alert_mode: {
            id: 'alert_mode',
            label: '🚨 Alert Mode',
            description: 'Real-time alerts for system state changes',
            min_user_role: 'operator',
            requires_consent: true,
            nesting_rules: {
              can_nest_with: ['creator', 'builder', 'operator', 'troubleshoot_mode', 'analysis_dashboard_mode'],
            },
          },
          troubleshoot_mode: {
            id: 'troubleshoot_mode',
            label: '🔧 Troubleshoot Mode',
            description: 'Deep diagnostic mode for workflow failures',
            min_user_role: 'builder',
            requires_consent: true,
            nesting_rules: {
              can_nest_with: ['operator', 'alert_mode', 'analysis_dashboard_mode'],
            },
          },
          analysis_dashboard_mode: {
            id: 'analysis_dashboard_mode',
            label: '📊 Analysis Dashboard',
            description: 'Real-time analytics and performance monitoring',
            min_user_role: 'operator',
            requires_consent: false,
            nesting_rules: {
              can_nest_with: ['creator', 'builder', 'operator', 'alert_mode', 'troubleshoot_mode'],
            },
          },
          self_learning_mode: {
            id: 'self_learning_mode',
            label: '🧠 Self-Learning Mode',
            description: 'Autonomous system learning and improvement',
            min_user_role: 'founder',
            requires_consent: true,
            nesting_rules: {
              can_nest_with: ['analysis_dashboard_mode'],
            },
          },
          replay_mode: {
            id: 'replay_mode',
            label: '⏮️ Replay Mode',
            description: 'Rerun workflow stages from saved checkpoints',
            min_user_role: 'operator',
            requires_consent: true,
            nesting_rules: {
              can_nest_with: ['troubleshoot_mode'],
            },
          },
          safe_mode: {
            id: 'safe_mode',
            label: '🛡️ Safe Mode',
            description: 'Local Ollama only, no cloud calls',
            min_user_role: 'creator',
            requires_consent: false,
            nesting_rules: {
              can_nest_with: [],
            },
          },
          debug_mode: {
            id: 'debug_mode',
            label: '🐛 Debug Mode',
            description: 'Verbose logging and step-by-step execution',
            min_user_role: 'builder',
            requires_consent: false,
            nesting_rules: {
              can_nest_with: ['troubleshoot_mode', 'analysis_dashboard_mode'],
            },
          },
          context_engineering_mode: {
            id: 'context_engineering_mode',
            label: '⚙️ Context Engineering',
            description: 'Fine-grained system behavior customization',
            min_user_role: 'founder',
            requires_consent: true,
            nesting_rules: {
              can_nest_with: ['debug_mode'],
            },
          },
        },
        runtime_modes: {
          local: {
            id: 'local',
            label: '🖥️ Local',
            description: 'Local Ollama only (Phase 1)',
            allowed_models: ['ollama_local_llama3.2', 'ollama_local_mistral'],
            default_phase1: true,
          },
          hybrid: {
            id: 'hybrid',
            label: '🔄 Hybrid',
            description: 'Local + selective cloud (Phase 2+)',
            allowed_models: ['all'],
            default_phase1: false,
            disabled: true,
          },
          cloud: {
            id: 'cloud',
            label: '☁️ Cloud',
            description: 'Cloud-heavy execution (Phase 3+)',
            allowed_models: ['all'],
            default_phase1: false,
            disabled: true,
          },
        },
      };

      setModes(registryData);
      setRuntimeModes(registryData.runtime_modes);
      setLoading(false);
    } catch (err) {
      console.error('Error loading mode registry:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const getOperatingModesArray = () => {
    if (!modes) return [];
    return Object.values(modes.operating_modes || {});
  };

  const getOperationalModesArray = () => {
    if (!modes) return [];
    return Object.values(modes.operational_modes || {});
  };

  const getRuntimeModesArray = () => {
    if (!runtimeModes) return [];
    return Object.values(runtimeModes);
  };

  const getMode = (modeId) => {
    if (!modes) return null;
    return modes.operating_modes?.[modeId];
  };

  const canAccessScreen = (currentMode, screenName) => {
    const mode = getMode(currentMode);
    if (!mode) return false;
    // TODO: Implement screen access gating based on mode capabilities
    return true;
  };

  const canExecuteWorkflow = (currentMode, workflowId) => {
    const mode = getMode(currentMode);
    if (!mode) return false;
    // Check if workflow is in legal_routes
    return mode.legal_routes && mode.legal_routes.length > 0;
  };

  return {
    modes,
    runtimeModes,
    loading,
    error,
    getOperatingModesArray,
    getOperationalModesArray,
    getRuntimeModesArray,
    getMode,
    canAccessScreen,
    canExecuteWorkflow,
  };
};
