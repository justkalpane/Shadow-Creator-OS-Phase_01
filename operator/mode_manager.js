const { readYamlSafe, readJsonSafe, writeJsonSafe, nowIso } = require('./_shared');

class ModeManager {
  constructor() {
    this.modeRegistry = readYamlSafe('registries/mode_registry.yaml', {});
    this.routeRegistry = readYamlSafe('registries/mode_route_registry.yaml', {});
    this.statePath = 'data/se_operator_runtime_state.json';
    this.state = this.loadState();
  }

  loadState() {
    const defaults = {
      selected_mode: this.modeRegistry?.closure_contract?.default_user_mode || 'creator',
      selected_runtime_mode: this.modeRegistry?.closure_contract?.default_runtime_mode || 'local',
      enabled_operational_modes: [],
      last_updated: nowIso(),
    };
    const current = readJsonSafe(this.statePath, defaults);
    return {
      selected_mode: current.selected_mode || defaults.selected_mode,
      selected_runtime_mode: current.selected_runtime_mode || defaults.selected_runtime_mode,
      enabled_operational_modes: Array.isArray(current.enabled_operational_modes)
        ? current.enabled_operational_modes
        : [],
      last_updated: current.last_updated || defaults.last_updated,
    };
  }

  persistState() {
    this.state.last_updated = nowIso();
    writeJsonSafe(this.statePath, this.state);
  }

  listOperatingModes() {
    return Object.entries(this.modeRegistry.mode_definitions || {})
      .filter(([, v]) => v.class === 'operating_mode')
      .map(([id, v]) => ({ mode_id: id, ...v }));
  }

  listOperationalModes() {
    return Object.entries(this.modeRegistry.mode_definitions || {})
      .filter(([, v]) => v.class === 'operational_mode')
      .map(([id, v]) => ({ mode_id: id, ...v }));
  }

  getRuntimeModes() {
    return this.modeRegistry.runtime_modes || {};
  }

  getDefaultMode() {
    return this.state.selected_mode || this.modeRegistry?.closure_contract?.default_user_mode || 'creator';
  }

  getDefaultRuntimeMode() {
    return this.state.selected_runtime_mode || this.modeRegistry?.closure_contract?.default_runtime_mode || 'local';
  }

  getLegalRoutes(modeId) {
    const matrix = this.routeRegistry.mode_route_legalities || {};
    const modeRoutes = matrix[modeId] || {};
    return Object.entries(modeRoutes)
      .filter(([, v]) => v.access === 'allowed')
      .map(([routeId]) => routeId);
  }

  getDefaultRoute(modeId) {
    const matrix = this.routeRegistry.mode_route_legalities || {};
    const modeRoutes = matrix[modeId] || {};
    const byDefault = Object.entries(modeRoutes).find(([, v]) => v.default === true && v.access === 'allowed');
    if (byDefault) return byDefault[0];
    const legal = this.getLegalRoutes(modeId);
    return legal[0] || 'ROUTE_PHASE1_STANDARD';
  }

  validateModeForTask(modeId, taskDef = {}) {
    const allowedModes = taskDef.allowed_modes || [];
    if (allowedModes.length === 0 || allowedModes.includes(modeId)) {
      return { allowed: true };
    }
    return { allowed: false, reason: `mode ${modeId} is not allowed for ${taskDef.id || 'task'}` };
  }

  validateRoute(modeId, routeId) {
    const legal = this.getLegalRoutes(modeId);
    if (legal.includes(routeId)) return { allowed: true };
    return { allowed: false, reason: `route ${routeId} is not legal for mode ${modeId}` };
  }

  setMode(modeId) {
    const modeDef = this.modeRegistry?.mode_definitions?.[modeId];
    if (!modeDef || modeDef.class !== 'operating_mode') {
      return { status: 'failed', reason: `unknown operating mode: ${modeId}` };
    }
    this.state.selected_mode = modeId;
    this.persistState();
    return { status: 'success', selected_mode: modeId, updated_at: this.state.last_updated };
  }

  setRuntimeMode(runtimeMode) {
    const runtimeDef = this.modeRegistry?.runtime_modes?.[runtimeMode];
    if (!runtimeDef) {
      return { status: 'failed', reason: `unknown runtime mode: ${runtimeMode}` };
    }
    this.state.selected_runtime_mode = runtimeMode;
    this.persistState();
    return { status: 'success', selected_runtime_mode: runtimeMode, updated_at: this.state.last_updated };
  }

  enableOperationalMode(modeId, context = {}) {
    const modeDef = this.modeRegistry?.mode_definitions?.[modeId];
    if (!modeDef || modeDef.class !== 'operational_mode') {
      return { status: 'failed', reason: `unknown operational mode: ${modeId}` };
    }

    const actorMode = context.actor_mode || this.getDefaultMode();
    const minRole = modeDef?.enable_requirements?.min_user_role || null;
    if (minRole && actorMode !== minRole && actorMode !== 'founder') {
      return { status: 'failed', reason: `${actorMode} cannot enable ${modeId}; requires ${minRole} or founder` };
    }

    if (!this.state.enabled_operational_modes.includes(modeId)) {
      this.state.enabled_operational_modes.push(modeId);
    }
    this.persistState();
    return { status: 'success', enabled_operational_modes: this.state.enabled_operational_modes, updated_at: this.state.last_updated };
  }

  disableOperationalMode(modeId) {
    this.state.enabled_operational_modes = this.state.enabled_operational_modes.filter((m) => m !== modeId);
    this.persistState();
    return { status: 'success', enabled_operational_modes: this.state.enabled_operational_modes, updated_at: this.state.last_updated };
  }

  getState() {
    return { ...this.state };
  }

  checkPermission(modeId, task) {
    const modeDef = this.modeRegistry?.mode_definitions?.[modeId];
    if (!modeDef) return { allowed: false, reason: `mode ${modeId} not found` };

    if (modeId === 'builder' && /^WF-\d+/.test(String(task || ''))) {
      return { allowed: false, reason: 'builder cannot trigger live workflows' };
    }
    if (this.state.enabled_operational_modes.includes('safe_mode')) {
      const cloudSignals = ['cloud', 'provider', 'publish', 'analytics'];
      if (cloudSignals.some((x) => String(task || '').toLowerCase().includes(x))) {
        return { allowed: false, reason: 'safe_mode blocks cloud/provider actions' };
      }
    }
    return { allowed: true };
  }
}

module.exports = ModeManager;
