/**
 * Packet Router Engine
 * Resolves packet routing using workflow bindings registry.
 */

const fs = require('fs');
const path = require('path');

class PacketRouter {
  constructor(config = {}) {
    this.config = {
      strict_mode: config.strict_mode !== false,
      workflow_bindings_path: config.workflow_bindings_path || './registries/workflow_bindings.yaml'
    };

    this.routing_log = [];
    this.route_counter = 0;
    this.routing_table = this.loadRoutingTable();
  }

  route(packet = {}) {
    const routeId = this.buildRouteId(packet);

    try {
      const artifactFamily = packet.artifact_family;
      if (!artifactFamily) {
        throw new Error('Packet missing artifact_family');
      }

      const status = this.getPacketStatus(packet);
      if (this.isEscalationStatus(packet, status)) {
        return this.finalizeRoute(routeId, packet, 'WF-900', 'escalation_required', true);
      }

      const explicitWorkflow = this.extractExplicitWorkflow(status);
      if (explicitWorkflow) {
        return this.finalizeRoute(routeId, packet, explicitWorkflow, 'packet_status_directive', false);
      }

      const replayWorkflow = this.resolveReplayWorkflow(artifactFamily, status);
      if (replayWorkflow) {
        return this.finalizeRoute(routeId, packet, replayWorkflow, 'replay_or_rejection_route', false);
      }

      const routeDef = this.routing_table[artifactFamily];
      if (!routeDef || !routeDef.default_next) {
        throw new Error(`No workflow binding for artifact_family: ${artifactFamily}`);
      }

      return this.finalizeRoute(routeId, packet, routeDef.default_next, 'registry_default_routing', false);
    } catch (error) {
      return this.finalizeRoute(routeId, packet, 'WF-900', `routing_error:${error.message}`, true, error.message);
    }
  }

  reloadBindings() {
    this.routing_table = this.loadRoutingTable();
    return this.routing_table;
  }

  loadRoutingTable() {
    const registryPath = this.resolveBindingsPath();
    if (!registryPath) {
      return {};
    }

    const text = fs.readFileSync(registryPath, 'utf8').replace(/\r\n/g, '\n');
    const lines = text.split('\n');

    const bindings = [];
    let current = null;
    let inRouting = false;
    let inOnSuccess = false;

    const finalizeCurrent = () => {
      if (current) {
        bindings.push(current);
      }
      current = null;
      inRouting = false;
      inOnSuccess = false;
    };

    for (const line of lines) {
      const skillMatch = line.match(/^\s*-\s*skill_id:\s*(M-\d{3})\s*$/);
      if (skillMatch) {
        finalizeCurrent();
        current = {
          skill_id: skillMatch[1],
          emitted_packet_family: null,
          default_next: null,
          on_error: 'WF-900',
          on_replay: 'WF-021'
        };
        continue;
      }

      if (!current) {
        continue;
      }

      const familyMatch = line.match(/^\s*emitted_packet_family:\s*([a-zA-Z0-9_-]+)\s*$/);
      if (familyMatch) {
        current.emitted_packet_family = familyMatch[1];
        continue;
      }

      if (/^\s*routing:\s*$/.test(line)) {
        inRouting = true;
        inOnSuccess = false;
        continue;
      }

      if (!inRouting) {
        continue;
      }

      // Nested form: on_success:\n  next_workflow: <ID>
      if (/^\s*on_success:\s*$/.test(line)) {
        inOnSuccess = true;
        continue;
      }

      // Scalar form: on_success: <ID>  (treated as default_next)
      const onSuccessScalarMatch = line.match(/^\s*on_success:\s*([A-Z0-9-]+)\s*$/);
      if (onSuccessScalarMatch) {
        current.default_next = onSuccessScalarMatch[1];
        inOnSuccess = false;
        continue;
      }

      const nextWorkflowMatch = line.match(/^\s*next_workflow:\s*([A-Z0-9-]+)\s*$/);
      if (nextWorkflowMatch && inOnSuccess) {
        current.default_next = nextWorkflowMatch[1];
        continue;
      }

      const onErrorMatch = line.match(/^\s*on_error:\s*([A-Z0-9-]+)\s*$/);
      if (onErrorMatch) {
        current.on_error = onErrorMatch[1];
        inOnSuccess = false;
        continue;
      }

      const onReplayMatch = line.match(/^\s*on_replay:\s*([A-Z0-9-]+)\s*$/);
      if (onReplayMatch) {
        current.on_replay = onReplayMatch[1];
        inOnSuccess = false;
        continue;
      }
    }

    finalizeCurrent();

    const table = {};
    const duplicates = [];
    for (const binding of bindings) {
      if (!binding.emitted_packet_family) {
        continue;
      }
      if (table[binding.emitted_packet_family]) {
        duplicates.push(binding.emitted_packet_family);
        continue;
      }

      table[binding.emitted_packet_family] = {
        skill_id: binding.skill_id,
        default_next: binding.default_next,
        on_error: binding.on_error || 'WF-900',
        on_replay: binding.on_replay || 'WF-021'
      };
    }

    if (duplicates.length > 0 && this.config.strict_mode) {
      throw new Error(`Duplicate emitted_packet_family bindings: ${duplicates.join(', ')}`);
    }

    return table;
  }

  resolveBindingsPath() {
    const candidates = [this.config.workflow_bindings_path, './registries/workflow_bindings.yaml'];
    for (const candidate of candidates) {
      const absolute = path.resolve(candidate);
      if (fs.existsSync(absolute)) {
        return absolute;
      }
    }
    if (this.config.strict_mode) {
      throw new Error(`Workflow bindings registry not found: ${this.config.workflow_bindings_path}`);
    }
    return null;
  }

  getPacketStatus(packet) {
    const status = packet?.payload?.status;
    if (!status || typeof status !== 'object' || Array.isArray(status)) {
      return {};
    }
    return status;
  }

  extractExplicitWorkflow(status) {
    const direct = status.next_workflow || status.route_to_workflow;
    if (typeof direct === 'string') {
      const trimmed = direct.trim();
      if (trimmed && trimmed !== 'dynamic') {
        return trimmed;
      }
    }
    return null;
  }

  isEscalationStatus(packet, status) {
    if (packet.status === 'FAILED') {
      return true;
    }
    if (status.escalation_needed === true) {
      return true;
    }
    if (status.generation_phase === 'FAILED') {
      return true;
    }
    if (status.validation_status === 'FAILED') {
      return true;
    }
    return false;
  }

  resolveReplayWorkflow(artifactFamily, status) {
    const routeDef = this.routing_table[artifactFamily] || {};
    const replayTarget = routeDef.on_replay || 'WF-021';

    const decisionSignals = [
      status.debate_result,
      status.approval_decision,
      status.decision,
      status.resolution,
      status.outcome,
      status.route_reason
    ]
      .filter((value) => typeof value === 'string')
      .map((value) => value.toUpperCase());

    const replayDecisions = new Set(['REJECTED', 'REMODIFY', 'NEEDS_REWRITE', 'REPLAY_REQUIRED']);
    if (decisionSignals.some((value) => replayDecisions.has(value))) {
      return replayTarget;
    }

    if (status.replay_required === true || status.rejected === true) {
      return replayTarget;
    }

    return null;
  }

  finalizeRoute(routeId, packet, nextWorkflow, routeReason, escalate, error = null) {
    const route = {
      next_workflow: nextWorkflow || 'WF-900',
      route_reason: routeReason,
      escalate: Boolean(escalate)
    };

    if (error) {
      route.error = error;
    }

    this.log({
      route_id: routeId,
      packet_instance_id: packet?.instance_id || 'UNKNOWN',
      artifact_family: packet?.artifact_family || 'UNKNOWN',
      next_workflow: route.next_workflow,
      reason: route.route_reason,
      escalate: route.escalate,
      error: route.error || null
    });

    return route;
  }

  buildRouteId(packet) {
    this.route_counter += 1;
    const signature = this.stableStringify({
      artifact_family: packet?.artifact_family || 'UNKNOWN',
      instance_id: packet?.instance_id || 'UNKNOWN',
      sequence: this.route_counter
    });
    return `ROUTE-${this.computeHash(signature).slice(0, 12)}`;
  }

  computeHash(text) {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  stableStringify(value) {
    if (value === null || typeof value !== 'object') {
      return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
      return `[${value.map((item) => this.stableStringify(item)).join(',')}]`;
    }
    const keys = Object.keys(value).sort();
    const pairs = keys.map((key) => `${JSON.stringify(key)}:${this.stableStringify(value[key])}`);
    return `{${pairs.join(',')}}`;
  }

  log(entry) {
    this.routing_log.push({
      ...entry,
      timestamp: new Date().toISOString()
    });
  }

  getRoutingLog(filter = {}) {
    let log = this.routing_log;
    if (filter.artifact_family) {
      log = log.filter((row) => row.artifact_family === filter.artifact_family);
    }
    if (filter.next_workflow) {
      log = log.filter((row) => row.next_workflow === filter.next_workflow);
    }
    if (filter.escalate !== undefined) {
      log = log.filter((row) => row.escalate === filter.escalate);
    }
    return log;
  }
}

module.exports = PacketRouter;
