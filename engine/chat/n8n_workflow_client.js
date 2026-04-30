/**
 * n8n Workflow Client
 *
 * Communicates with n8n instance to trigger workflows.
 * Tracks execution status.
 * Returns execution IDs and status.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class N8nWorkflowClient {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || process.env.N8N_BASE_URL || 'http://localhost:5678';
    this.apiKey = options.apiKey || process.env.N8N_API_KEY;
    this.useMockN8n = process.env.USE_MOCK_N8N === 'true';

    console.log(`[N8N Client] Using n8n at: ${this.baseUrl} ${this.useMockN8n ? '(MOCK DEV MODE)' : '(PRODUCTION)'}`);

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: this.apiKey ? { 'X-N8N-API-KEY': this.apiKey } : {},
    });
    this.executionCache = {};

    this.webhookRegistry = this.loadWebhookRegistry();
    this.workflowWebhookFallback = this.loadWorkflowWebhookFallback();
  }

  /**
   * Load webhook registry from YAML file
   */
  loadWebhookRegistry() {
    try {
      const registryPath = path.join(__dirname, '../../registries/n8n_webhook_registry.yaml');
      const fileContent = fs.readFileSync(registryPath, 'utf8');
      const registry = yaml.load(fileContent);
      console.log('[N8N Client] Webhook registry loaded successfully');
      return registry;
    } catch (err) {
      console.error('[N8N Client] Failed to load webhook registry:', err.message);
      return { webhooks: {} };
    }
  }

  loadWorkflowWebhookFallback() {
    const out = {};
    const root = path.join(__dirname, '../../n8n/workflows');
    const stack = [root];
    while (stack.length > 0) {
      const dir = stack.pop();
      if (!fs.existsSync(dir)) continue;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
          stack.push(full);
          continue;
        }
        if (!e.isFile() || !e.name.endsWith('.json')) continue;
        try {
          const data = JSON.parse(fs.readFileSync(full, 'utf8'));
          const id = data?.meta?.workflow_id;
          if (!id || !Array.isArray(data.nodes)) continue;
          const webhookNode = data.nodes.find((n) => String(n.type || '').toLowerCase().includes('webhook'));
          if (!webhookNode) continue;
          out[id] = {
            method: webhookNode.parameters?.httpMethod || 'POST',
            webhook_path: `/webhook/${webhookNode.parameters?.path || ''}`.replace(/\/+$/, ''),
            trigger_mode: 'ingress',
            source_file: full,
          };
        } catch {
          // ignore parse failures
        }
      }
    }
    return out;
  }

  /**
   * Resolve webhook path from registry
   * @param {string} workflowId - WF-001, WF-200, etc.
   * @returns {object} { webhook_path, config } or null if not found
   */
  resolveWebhookPath(workflowId) {
    const registryWebhooks = this.webhookRegistry.webhooks || this.webhookRegistry || {};
    const webhookConfig = registryWebhooks?.[workflowId] || this.workflowWebhookFallback?.[workflowId];
    if (!webhookConfig) {
      return null;
    }
    return {
      webhook_path: webhookConfig.webhook_path,
      config: webhookConfig,
    };
  }

  /**
   * Trigger workflow execution
   * @param {string} workflowId - WF-001, WF-200, etc.
   * @param {object} payload - Input data for workflow
   * @returns {object} { execution_id, workflow_id, status, error_details, timestamp }
   */
  async triggerWorkflow(workflowId, payload = {}) {
    try {
      if (this.useMockN8n && !this.baseUrl.includes('5680')) {
        return {
          execution_id: null,
          workflow_id: workflowId,
          status: 'failed',
          error: 'USE_MOCK_N8N is true but N8N_BASE_URL is not mock endpoint',
          error_details: {
            code: 'MOCK_GUARD_VIOLATION',
            message: 'Disable USE_MOCK_N8N for production, or set N8N_BASE_URL=http://localhost:5680 for dev harness.',
          },
          timestamp: new Date().toISOString(),
        };
      }

      const webhookResolution = this.resolveWebhookPath(workflowId);
      if (!webhookResolution) {
        return {
          execution_id: null,
          workflow_id: workflowId,
          status: 'failed',
          error: `Workflow ${workflowId} not found in webhook registry`,
          error_details: {
            code: 'WORKFLOW_NOT_REGISTERED',
            message: `Webhook path not configured for ${workflowId}`,
            available_workflows: [
              ...Object.keys(this.webhookRegistry.webhooks || this.webhookRegistry || {}),
              ...Object.keys(this.workflowWebhookFallback || {}),
            ],
          },
          timestamp: new Date().toISOString(),
        };
      }

      const { webhook_path, config } = webhookResolution;
      console.log(`[N8N Client] Triggering ${workflowId} at ${webhook_path}`);

      // Step 2: Validate required payload fields
      const missingFields = (config.required_payload_fields || []).filter(
        field => payload[field] === undefined || payload[field] === null
      );
      if (missingFields.length > 0) {
        return {
          execution_id: null,
          workflow_id: workflowId,
          status: 'failed',
          error: `Missing required fields for ${workflowId}`,
          error_details: {
            code: 'MISSING_PAYLOAD_FIELDS',
            message: `Required fields not provided: ${missingFields.join(', ')}`,
            required_fields: config.required_payload_fields,
            provided_fields: Object.keys(payload),
          },
          timestamp: new Date().toISOString(),
        };
      }

      // Step 3: Add metadata to payload
      const enrichedPayload = {
        ...payload,
        _metadata: {
          triggered_at: new Date().toISOString(),
          triggered_from: 'chat_orchestration',
          workflow_id: workflowId,
          webhook_path: webhook_path,
        },
      };

      // Step 4: POST to n8n webhook
      console.log(`[N8N Client] POST ${this.baseUrl}${webhook_path}`);
      const method = String(config.method || 'POST').toUpperCase();
      const requestedUrl = `${this.baseUrl}${webhook_path}`;
      const response = await this.client.request({
        method,
        url: webhook_path,
        data: enrichedPayload,
      });

      const executionId = response.data?.execution_id || response.data?.executionId || `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Cache execution info
      this.executionCache[executionId] = {
        execution_id: executionId,
        workflow_id: workflowId,
        webhook_path: webhook_path,
        triggered_at: new Date(),
        status: 'queued',
        payload: enrichedPayload,
        response: response.data,
        http_status: response.status,
        requested_url: requestedUrl,
      };

      console.log(`[N8N Client] Workflow ${workflowId} triggered successfully. Execution ID: ${executionId}`);

      return {
        execution_id: executionId,
        workflow_id: workflowId,
        status: 'queued',
        http_status: response.status,
        requested_url: requestedUrl,
        method,
        response_data: response.data,
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      // Detailed error reporting
      console.error(`[N8N Client] Failed to trigger workflow ${workflowId}:`, err.message);

      const webhookResolution = this.resolveWebhookPath(workflowId);
      const requestedUrl = webhookResolution ? `${this.baseUrl}${webhookResolution.webhook_path}` : null;
      const errorDetails = {
        code: 'WORKFLOW_TRIGGER_FAILED',
        message: err.message,
        workflow_id: workflowId,
        requested_url: requestedUrl,
        method: webhookResolution?.config?.method || 'POST',
      };

      // Add HTTP-specific details if available
      if (err.response) {
        errorDetails.http_status = err.response.status;
        errorDetails.http_message = err.response.statusText;
        errorDetails.response_body = err.response.data;
      } else if (err.code) {
        errorDetails.error_code = err.code;
      }

      const likelyFix = err.response
        ? `Check workflow activation and webhook path in n8n for ${workflowId}.`
        : `Check n8n availability at ${this.baseUrl} and verify firewall/port.`;

      return {
        execution_id: null,
        workflow_id: workflowId,
        status: 'failed',
        error: err.message,
        error_details: errorDetails,
        requested_url: requestedUrl,
        http_status: err.response?.status || null,
        response_body: err.response?.data || null,
        likely_fix: likelyFix,
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
   * Get webhook configuration for a workflow
   * @param {string} workflowId - WF-001, WF-200, etc.
   * @returns {object} Webhook configuration from registry
   */
  getWebhookConfig(workflowId) {
    return this.resolveWebhookPath(workflowId)?.config;
  }

  /**
   * List all registered workflows
   * @returns {array} Array of workflow IDs
   */
  getRegisteredWorkflows() {
    return [...new Set([
      ...Object.keys(this.webhookRegistry.webhooks || this.webhookRegistry || {}),
      ...Object.keys(this.workflowWebhookFallback || {}),
    ])];
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
      try {
        const fallback = await this.client.get('/');
        return { healthy: fallback.status < 500, status: 'reachable_root' };
      } catch {
        // no-op
      }
      return {
        healthy: false,
        error: err.message,
      };
    }
  }
}

module.exports = N8nWorkflowClient;
