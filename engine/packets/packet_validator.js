/**
 * Packet Validator Engine
 * Validates packets against schema, enforces 5-section structure, checks lineage.
 * Rules: artifact_family required, schema_version required, all 5 sections must be present
 */

class PacketValidator {
  constructor(config = {}) {
    this.config = {
      strict_mode: config.strict_mode !== false,
      allow_missing_sections: config.allow_missing_sections || false
    };

    this.validation_log = [];

    // Define packet schema families
    this.schema_families = {
      'topic_candidate_board': {
        sections: ['narrative', 'context', 'evidence', 'quality', 'status'],
        producer_workflows: ['CWF-110'],
        critical_fields: {
          narrative: ['topic_candidates', 'signals'],
          context: ['discovered_from', 'discovery_timestamp'],
          evidence: ['candidate_count'],
          quality: ['discovery_confidence'],
          status: ['next_workflow']
        }
      },
      'topic_finalization_packet': {
        sections: ['narrative', 'context', 'evidence', 'quality', 'status'],
        producer_workflows: ['CWF-120', 'CWF-130'],
        critical_fields: {
          narrative: ['qualified_candidates', 'rejected_candidates'],
          context: ['sourced_from_packet_id'],
          evidence: ['qualification_checks'],
          quality: ['decision_summary'],
          status: ['next_workflow']
        }
      },
      'topic_scorecard': {
        sections: ['narrative', 'context', 'evidence', 'quality', 'status'],
        producer_workflows: ['CWF-130'],
        critical_fields: {
          narrative: ['evaluated_candidates'],
          context: ['sourced_from_packet_id'],
          evidence: ['scorecard'],
          quality: ['top_candidate_assessment'],
          status: ['promotion_decision']
        }
      },
      'research_synthesis_packet': {
        sections: ['narrative', 'context', 'evidence', 'quality', 'status'],
        producer_workflows: ['CWF-140'],
        critical_fields: {
          narrative: ['main_claim'],
          context: ['sourced_from_packet_id'],
          evidence: ['supporting_claims'],
          quality: ['overall_confidence'],
          status: ['ready_for_script_generation']
        }
      },
      'script_draft_packet': {
        sections: ['narrative', 'context', 'evidence', 'quality', 'status'],
        producer_workflows: ['CWF-210'],
        critical_fields: {
          narrative: ['title', 'hook', 'body', 'closing'],
          context: ['topic_statement', 'research_confidence'],
          evidence: ['main_claim', 'supporting_claims'],
          quality: ['draft_confidence'],
          status: ['generation_phase']
        }
      },
      'script_debate_packet': {
        sections: ['narrative', 'context', 'evidence', 'quality', 'status'],
        producer_workflows: ['CWF-220'],
        critical_fields: {
          narrative: ['original_draft'],
          context: ['sourced_from_packet_id'],
          evidence: ['critique_points'],
          quality: ['overall_debate_decision'],
          status: ['debate_result']
        }
      },
      'script_refinement_packet': {
        sections: ['narrative', 'context', 'evidence', 'quality', 'status'],
        producer_workflows: ['CWF-230'],
        critical_fields: {
          narrative: ['refined_title', 'refined_hook'],
          context: ['sourced_from_debate_packet_id'],
          evidence: ['new_supporting_evidence'],
          quality: ['overall_quality_improvement'],
          status: ['refinement_complete']
        }
      },
      'final_script_packet': {
        sections: ['narrative', 'context', 'evidence', 'quality', 'status'],
        producer_workflows: ['CWF-240'],
        critical_fields: {
          narrative: ['production_ready_title'],
          context: ['target_platform'],
          evidence: ['sources_cited'],
          quality: ['seo_readiness', 'governance_compliance'],
          status: ['ready_for_approval']
        }
      },
      'approval_decision_packet': {
        sections: ['approval_request', 'context', 'evidence', 'quality', 'status'],
        producer_workflows: ['WF-020'],
        critical_fields: {
          approval_request: ['approval_request_id'],
          context: ['owner_director'],
          evidence: ['quality_checklist'],
          quality: ['overall_recommendation'],
          status: ['possible_decisions']
        }
      },
      'replay_routing_packet': {
        sections: ['routing_decision', 'context', 'evidence', 'quality', 'status'],
        producer_workflows: ['WF-021'],
        critical_fields: {
          routing_decision: ['target_workflow'],
          context: ['current_replay_iteration'],
          evidence: ['rejection_context'],
          quality: ['routing_confidence'],
          status: ['decision_path']
        }
      },
      'execution_context_packet': {
        sections: ['narrative', 'context', 'evidence', 'quality', 'status'],
        producer_workflows: ['CWF-310'],
        critical_fields: {
          narrative: ['execution_strategy'],
          context: ['sourced_from_packet_id'],
          evidence: ['constraint_set'],
          quality: ['context_integrity'],
          status: ['context_ready']
        }
      },
      'platform_package_packet': {
        sections: ['narrative', 'context', 'evidence', 'quality', 'status'],
        producer_workflows: ['CWF-320'],
        critical_fields: {
          narrative: ['platform_targets'],
          context: ['sourced_from_packet_id'],
          evidence: ['package_elements'],
          quality: ['platform_fit'],
          status: ['package_ready']
        }
      },
      'asset_brief_packet': {
        sections: ['narrative', 'context', 'evidence', 'quality', 'status'],
        producer_workflows: ['CWF-330'],
        critical_fields: {
          narrative: ['asset_plan'],
          context: ['sourced_from_packet_id'],
          evidence: ['brief_components'],
          quality: ['brief_quality'],
          status: ['asset_brief_ready']
        }
      },
      'context_engineering_packet': {
        sections: ['narrative', 'context', 'evidence', 'quality', 'status'],
        producer_workflows: ['CWF-340'],
        critical_fields: {
          narrative: ['context_summary'],
          context: ['sourced_from_packet_id'],
          evidence: ['lineage_checks'],
          quality: ['final_context_confidence'],
          status: ['context_engineering_complete']
        }
      }
    };
  }

  /**
   * Validate packet against schema
   */
  validatePacket(packet) {
    const validation_id = 'VAL-' + Date.now();
    const errors = [];
    const warnings = [];

    try {
      // 1. Validate envelope
      const envelope_check = this.validateEnvelope(packet);
      if (!envelope_check.valid) {
        errors.push(...envelope_check.errors);
      }

      // 2. Get schema family
      const artifact_family = packet.artifact_family || 'UNKNOWN';
      const schema = this.schema_families[artifact_family];

      if (!schema) {
        errors.push(`Unknown artifact_family: ${artifact_family}`);
      } else {
        // 3. Validate sections
        const sections_check = this.validateSections(packet, schema);
        if (!sections_check.valid) {
          errors.push(...sections_check.errors);
        }
        warnings.push(...sections_check.warnings);

        // 4. Validate critical fields
        const critical_check = this.validateCriticalFields(packet, schema);
        if (!critical_check.valid) {
          errors.push(...critical_check.errors);
        }

        // 5. Validate lineage
        const lineage_check = this.validateLineage(packet);
        if (!lineage_check.valid) {
          warnings.push(...lineage_check.warnings);
        }
      }

      const is_valid = errors.length === 0;

      // Log validation
      this.logValidation({
        validation_id,
        packet_instance_id: packet.instance_id || 'UNKNOWN',
        artifact_family: artifact_family,
        valid: is_valid,
        errors: errors,
        warnings: warnings
      });

      return {
        valid: is_valid,
        validation_id: validation_id,
        errors: errors,
        warnings: warnings,
        packet_instance_id: packet.instance_id,
        timestamp: new Date().toISOString()
      };

    } catch (e) {
      this.logValidation({
        validation_id,
        artifact_family: packet.artifact_family || 'UNKNOWN',
        valid: false,
        error: e.message
      });

      return {
        valid: false,
        validation_id: validation_id,
        error: e.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Validate packet envelope (metadata)
   */
  validateEnvelope(packet) {
    const errors = [];

    const required_fields = ['instance_id', 'artifact_family', 'schema_version', 'producer_workflow', 'dossier_ref', 'status', 'payload'];

    for (const field of required_fields) {
      if (!(field in packet)) {
        errors.push(`Missing required envelope field: ${field}`);
      }
    }

    if (packet.artifact_family && !this.schema_families[packet.artifact_family]) {
      errors.push(`Unknown artifact_family: ${packet.artifact_family}`);
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Validate 5-section structure
   */
  validateSections(packet, schema) {
    const errors = [];
    const warnings = [];

    const payload = packet.payload || {};
    const required_sections = schema.sections || [];

    for (const section of required_sections) {
      if (!(section in payload)) {
        errors.push(`Missing section: ${section}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors,
      warnings: warnings
    };
  }

  /**
   * Validate critical fields present
   */
  validateCriticalFields(packet, schema) {
    const errors = [];
    const payload = packet.payload || {};
    const critical_fields = schema.critical_fields || {};

    for (const [section, fields] of Object.entries(critical_fields)) {
      const section_data = payload[section] || {};

      for (const field of fields) {
        if (!(field in section_data)) {
          errors.push(`Missing critical field: ${section}.${field}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Validate lineage tracking
   */
  validateLineage(packet) {
    const warnings = [];
    const payload = packet.payload || {};

    // For most packets, expect sourced_from reference or topic/research references
    const context = payload.context || {};

    const has_lineage = (
      context.sourced_from_packet_id ||
      context.sourced_from_topic_id ||
      context.sourced_from_research_id ||
      context.sourced_from_debate_packet_id ||
      context.sourced_from_refinement_packet_id
    );

    if (!has_lineage && packet.artifact_family !== 'topic_candidate_board') {
      warnings.push('No sourced_from reference found. Lineage may not be fully tracked.');
    }

    return {
      valid: true,
      warnings: warnings
    };
  }

  /**
   * Batch validate packets
   */
  validateBatch(packets) {
    const results = packets.map(p => this.validatePacket(p));

    return {
      total_packets: packets.length,
      valid_packets: results.filter(r => r.valid).length,
      invalid_packets: results.filter(r => !r.valid).length,
      results: results
    };
  }

  /**
   * Log validation
   */
  logValidation(entry) {
    this.validation_log.push({
      ...entry,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get validation log
   */
  getValidationLog(filter = {}) {
    let log = this.validation_log;

    if (filter.valid !== undefined) {
      log = log.filter(v => v.valid === filter.valid);
    }
    if (filter.artifact_family) {
      log = log.filter(v => v.artifact_family === filter.artifact_family);
    }

    return log;
  }
}

module.exports = PacketValidator;
