const N8N_BASE_URL = 'http://localhost:5678';

const workflowWebhooks = {
  'WF-001': '/webhook/dossier-create',
  'WF-010': '/webhook/parent-orchestrator',
  'WF-100': '/webhook/topic-intelligence',
  'WF-200': '/webhook/script-intelligence',
  'WF-300': '/webhook/context-engineering',
  'WF-400': '/webhook/media-production',
  'WF-500': '/webhook/publishing-distribution',
  'WF-600': '/webhook/analytics-evolution',
  'WF-900': '/webhook/recovery-escalation',
};

export const n8nClient = {
  async executeWorkflow(workflowId, payload = {}) {
    const webhookPath = workflowWebhooks[workflowId];
    if (!webhookPath) {
      console.error(`Unknown workflow: ${workflowId}`);
      throw new Error(`Workflow ${workflowId} not configured`);
    }

    try {
      const response = await fetch(`${N8N_BASE_URL}${webhookPath}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          ...payload,
        }),
      });

      if (!response.ok) {
        throw new Error(`Workflow execution failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`✅ Workflow ${workflowId} triggered:`, result);
      return result;
    } catch (err) {
      console.error(`❌ Failed to execute ${workflowId}:`, err);
      throw err;
    }
  },

  async createDossier(dossierData) {
    return this.executeWorkflow('WF-001', {
      operation: 'create_dossier',
      ...dossierData,
    });
  },

  async executePhase(phaseWorkflowId, dossierData) {
    return this.executeWorkflow(phaseWorkflowId, {
      operation: 'execute_phase',
      ...dossierData,
    });
  },

  getWebhookUrl(workflowId) {
    return `${N8N_BASE_URL}${workflowWebhooks[workflowId]}`;
  },

  getN8nUrl() {
    return N8N_BASE_URL;
  },
};

export const workflowApi = {
  executeWorkflow: (workflowId, payload) => n8nClient.executeWorkflow(workflowId, payload),
  createDossier: (payload) => n8nClient.createDossier(payload),
  executePhase: (workflowId, payload) => n8nClient.executePhase(workflowId, payload),
};

export const dataApi = {
  async getDossierIndex() {
    try {
      const response = await fetch('/data/se_dossier_index.json');
      if (!response.ok) throw new Error('Failed to fetch dossier index');
      return await response.json();
    } catch (error) {
      console.error('Error fetching dossier index:', error);
      throw error;
    }
  },

  async getPacketIndex() {
    try {
      const response = await fetch('/data/se_packet_index.json');
      if (!response.ok) throw new Error('Failed to fetch packet index');
      return await response.json();
    } catch (error) {
      console.error('Error fetching packet index:', error);
      throw error;
    }
  },

  async getDossier(dossierId) {
    try {
      const response = await fetch(`/data/${dossierId}.json`);
      if (!response.ok) throw new Error(`Failed to fetch dossier ${dossierId}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching dossier ${dossierId}:`, error);
      throw error;
    }
  },
};

export default n8nClient;
