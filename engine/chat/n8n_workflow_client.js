/**
 * n8n Workflow Client
 *
 * Communicates with n8n instance to trigger workflows.
 * Tracks execution status.
 * Returns execution IDs and status.
 */

const axios = require('axios');

class N8nWorkflowClient {
  constructor(options = {}) {
    // PRODUCTION: Use real n8n at 5678
    // DEV ONLY: Set N8N_BASE_URL=http://localhost:5680 for mock server
    this.baseUrl = options.baseUrl || process.env.N8N_BASE_URL || 'http://localhost:5678';
    this.apiKey = options.apiKey || process.env.N8N_API_KEY;
    this.useMockN8n = process.env.USE_MOCK_N8N === 'true';

    console.log(`[N8N Client] Using n8n at: ${this.baseUrl} ${this.useMockN8n ? '(MOCK DEV MODE)' : '(PRODUCTION)'}`);

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: this.apiKey ? { 'X-N8N-API-KEY': this.apiKey } : {},
    });
    this.executionCache = {};  // Track executions in memory
  }

  /**
   * Trigger workflow execution
   * @param {string} workflowId - WF-100, WF-200, etc.
   * @param {object} payload - Input data for workflow
   * @returns {object} { execution_id, workflow_id, status, timestamp }
   */
  async triggerWorkflow(workflowId, payload = {}) {
    try {
      // Build webhook URL
      // Workflows are triggered via POST to /webhook/{workflow_id}
      const webhookUrl = `/webhook/${this.sanitizeWorkflowId(workflowId)}`;

      // Add metadata to payload
      const enrichedPayload = {
        ...payload,
        _metadata: {
          triggered_at: new Date().toISOString(),
          triggered_from: 'chat_orchestration',
        },
      };

      // POST to n8n webhook
      const response = await this.client.post(webhookUrl, enrichedPayload);

      const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Cache execution info
      this.executionCache[executionId] = {
        execution_id: executionId,
        workflow_id: workflowId,
        triggered_at: new Date(),
        status: 'queued',
        payload: enrichedPayload,
        response: response.data,
      };

      return {
        execution_id: executionId,
        workflow_id: workflowId,
        status: 'queued',
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      console.error(`Failed to trigger workflow ${workflowId}:`, err.message);
      return {
        execution_id: null,
        workflow_id: workflowId,
        status: 'failed',
        error: err.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get execution status
   * @param {string} executionId - Execution ID returned from triggerWorkflow
   * @returns {object} Execution status and results
   */
  async getExecutionStatus(executionId) {
    try {
      // First check cache
      const cached = this.executionCache[executionId];
      if (cached && cached.status !== 'queued') {
        return cached;
      }

      // In real implementation, would query n8n API:
      // GET /api/v1/executions/{execution_id}
      // For now, return cached or polling status

      return cached || {
        execution_id: executionId,
        status: 'unknown',
        error: 'Execution not found',
      };
    } catch (err) {
      return {
        execution_id: executionId,
        status: 'error',
        error: err.message,
      };
    }
  }

  /**
   * Common workflow triggers
   */
  async createDossier(topic, metadata = {}) {
    return this.triggerWorkflow('WF-001', {
      topic,
      ...metadata,
    });
  }

  async orchestrateExecution(dossierId, mode = 'creator', route = 'ROUTE_PHASE1_STANDARD') {
    return this.triggerWorkflow('WF-010', {
      dossier_id: dossierId,
      user_mode: mode,
      route_id: route,
    });
  }

  async generateTopic(query) {
    return this.triggerWorkflow('WF-100', {
      query,
    });
  }

  async generateScript(dossierId, topicPacketId) {
    return this.triggerWorkflow('WF-200', {
      dossier_id: dossierId,
      topic_packet_id: topicPacketId,
    });
  }

  async approveContent(dossierId, decision = 'approved') {
    return this.triggerWorkflow('WF-020', {
      dossier_id: dossierId,
      decision,
    });
  }

  async replayWorkflow(dossierId, stage, checkpoint) {
    return this.triggerWorkflow('WF-021', {
      dossier_id: dossierId,
      stage,
      checkpoint,
    });
  }

  async triggerAlert(alertType, dossierId, details = {}) {
    return this.triggerWorkflow('WF-900', {
      alert_type: alertType,
      dossier_id: dossierId,
      ...details,
    });
  }

  /**
   * Sanitize workflow ID for webhook URL
   * @private
   */
  sanitizeWorkflowId(workflowId) {
    // WF-100 -> wf-100 (lowercase, but keep dashes)
    return workflowId.toLowerCase().replace(/\s+/g, '-');
  }

  /**
   * Check if n8n is accessible
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/api/v1/health');
      return {
        healthy: response.status === 200,
        status: response.data?.status || 'unknown',
      };
    } catch (err) {
      return {
        healthy: false,
        error: err.message,
      };
    }
  }
}

module.exports = N8nWorkflowClient;
