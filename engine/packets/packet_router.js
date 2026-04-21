/**
 * Packet Router Engine
 * Routes packets to the correct next workflow based on artifact_family and status section.
 */

class PacketRouter {
  constructor(config = {}) {
    this.config = { strict_mode: config.strict_mode !== false };
    this.routing_log = [];

    this.routing_table = {
      topic_candidate_board:      { default_next: 'CWF-120', on_empty: 'CWF-110', on_error: 'WF-900' },
      topic_finalization_packet:  { default_next: 'CWF-130', on_rejected: 'CWF-110', on_error: 'WF-900' },
      topic_scorecard:            { default_next: 'CWF-140', on_no_promotion: 'CWF-110', on_error: 'WF-900' },
      research_synthesis_packet:  { default_next: 'WF-200', on_low_confidence: 'CWF-140', on_error: 'WF-900' },
      script_draft_packet:        { default_next: 'CWF-220', on_error: 'WF-900' },
      script_debate_packet:       { default_next: 'CWF-230', on_rewrite: 'WF-021', on_rejected: 'WF-021', on_error: 'WF-900' },
      script_refinement_packet:   { default_next: 'CWF-240', on_additional_debate: 'CWF-220', on_error: 'WF-900' },
      final_script_packet:        { default_next: 'WF-020', on_error: 'WF-900' },
      approval_decision_packet:   { default_next: 'WF-300', on_rejection: 'WF-021', on_error: 'WF-900' },
      replay_routing_packet:      { default_next: 'dynamic', on_error: 'WF-900' }
    };
  }

  /**
   * Route packet to next workflow
   * @param {object} packet - Full packet with artifact_family and payload.status
   * @returns {object} - { next_workflow, route_reason, escalate }
   */
  route(packet) {
    const route_id = 'ROUTE-' + Date.now();

    try {
      const artifact_family = packet.artifact_family;
      const status = packet.payload?.status || {};
      const routing_def = this.routing_table[artifact_family];

      if (!routing_def) {
        throw new Error(`No routing definition for artifact_family: ${artifact_family}`);
      }

      // Use next_workflow from packet status section if present
      if (status.next_workflow && status.next_workflow !== 'dynamic') {
        this.log(route_id, packet, status.next_workflow, 'packet_status_directive');
        return { next_workflow: status.next_workflow, route_reason: 'packet_status_directive', escalate: false };
      }

      // Route based on decision_path in status
      const decision_path = status.decision_path || '';

      if (status.escalation_needed || status.generation_phase === 'FAILED') {
        this.log(route_id, packet, 'WF-900', 'escalation_required');
        return { next_workflow: 'WF-900', route_reason: 'escalation_required', escalate: true };
      }

      // Family-specific routing fallbacks
      let next_workflow = routing_def.default_next;
      let route_reason = 'default_routing';

      if (artifact_family === 'script_debate_packet') {
        const debate_result = status.debate_result || '';
        if (debate_result === 'NEEDS_REWRITE' || debate_result === 'REJECTED') {
          next_workflow = routing_def.on_rewrite || 'WF-021';
          route_reason = 'debate_rewrite_or_rejected';
        }
      } else if (artifact_family === 'topic_candidate_board') {
        if (!packet.payload?.narrative?.topic_candidates?.length) {
          next_workflow = routing_def.on_empty || 'CWF-110';
          route_reason = 'empty_candidate_board';
        }
      } else if (artifact_family === 'topic_scorecard') {
        if (!packet.payload?.evidence?.scorecard?.top_candidate_for_research) {
          next_workflow = routing_def.on_no_promotion || 'CWF-110';
          route_reason = 'no_candidate_promoted';
        }
      }

      this.log(route_id, packet, next_workflow, route_reason);
      return { next_workflow, route_reason, escalate: false };

    } catch (e) {
      this.log(route_id, packet, 'WF-900', 'routing_error: ' + e.message);
      return { next_workflow: 'WF-900', route_reason: 'routing_error', error: e.message, escalate: true };
    }
  }

  log(route_id, packet, next_workflow, reason) {
    this.routing_log.push({
      route_id,
      packet_instance_id: packet.instance_id || 'UNKNOWN',
      artifact_family: packet.artifact_family || 'UNKNOWN',
      next_workflow,
      reason,
      timestamp: new Date().toISOString()
    });
  }

  getRoutingLog(filter = {}) {
    let log = this.routing_log;
    if (filter.artifact_family) log = log.filter(r => r.artifact_family === filter.artifact_family);
    if (filter.next_workflow) log = log.filter(r => r.next_workflow === filter.next_workflow);
    return log;
  }
}

module.exports = PacketRouter;
