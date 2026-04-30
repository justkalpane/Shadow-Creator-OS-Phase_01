const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class ModeGuard {
  constructor() {
    this.registry = this.loadRegistry();
  }

  loadRegistry() {
    try {
      const p = path.join(__dirname, '../../registries/mode_registry.yaml');
      const data = yaml.load(fs.readFileSync(p, 'utf8'));
      return data?.mode_definitions ? data : { mode_definitions: {} };
    } catch {
      return { mode_definitions: {} };
    }
  }

  getMode(mode) {
    return this.registry.mode_definitions?.[mode] || null;
  }

  getDefaultRoute(mode) {
    const def = this.getMode(mode);
    if (Array.isArray(def?.legal_routes) && def.legal_routes.length > 0) {
      return def.legal_routes[0];
    }
    if (mode === 'operator') return 'ROUTE_PHASE1_REPLAY';
    return 'ROUTE_PHASE1_STANDARD';
  }

  validateModeAccess(mode, intent) {
    const def = this.getMode(mode);
    if (!def) return { allowed: false, reason: `Unknown mode: ${mode}` };
    if (Array.isArray(intent?.allowed_modes) && !intent.allowed_modes.includes(mode)) {
      return { allowed: false, reason: `${mode} cannot run ${intent.intent_id}` };
    }
    return { allowed: true };
  }

  validateRouteLegality(mode, route) {
    const def = this.getMode(mode);
    if (!def) return { allowed: false, reason: `Unknown mode: ${mode}` };
    const legal = Array.isArray(def.legal_routes) ? def.legal_routes : [];
    if (legal.length === 0 && mode === 'builder') {
      return { allowed: false, reason: 'Builder mode cannot execute live routes.' };
    }
    if (legal.length > 0 && !legal.includes(route)) {
      return { allowed: false, reason: `${route} is not legal for ${mode}` };
    }
    return { allowed: true };
  }

  enforceHardGuards(mode) {
    if (!['founder', 'creator', 'builder', 'operator'].includes(mode)) {
      return { passed: false, failures: ['invalid_mode'] };
    }
    return { passed: true, failures: [] };
  }
}

module.exports = ModeGuard;
