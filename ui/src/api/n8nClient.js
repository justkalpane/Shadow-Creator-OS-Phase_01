import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_N8N_URL || 'http://localhost:5678';

const n8nClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Workflow operations
export const workflowApi = {
  // List all workflows
  listWorkflows: async () => {
    try {
      const response = await n8nClient.get('/workflows');
      return response.data;
    } catch (error) {
      console.error('Error fetching workflows:', error);
      throw error;
    }
  },

  // Get workflow by ID
  getWorkflow: async (workflowId) => {
    try {
      const response = await n8nClient.get(`/workflows/${workflowId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching workflow ${workflowId}:`, error);
      throw error;
    }
  },

  // Execute workflow via webhook
  executeWorkflow: async (webhookUrl, payload) => {
    try {
      const response = await axios.post(webhookUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error executing workflow:', error);
      throw error;
    }
  },

  // Get execution history
  getExecutions: async (workflowId, limit = 50) => {
    try {
      const response = await n8nClient.get(`/workflows/${workflowId}/executions`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching executions:', error);
      throw error;
    }
  },
};

// Local file operations (via backend)
export const dataApi = {
  // Get dossier index
  getDossierIndex: async () => {
    try {
      const response = await axios.get('/api/data/se_dossier_index.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching dossier index:', error);
      throw error;
    }
  },

  // Get packet index
  getPacketIndex: async () => {
    try {
      const response = await axios.get('/api/data/se_packet_index.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching packet index:', error);
      throw error;
    }
  },

  // Get dossier by ID
  getDossier: async (dossierId) => {
    try {
      const response = await axios.get(`/api/dossiers/${dossierId}.json`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching dossier ${dossierId}:`, error);
      throw error;
    }
  },
};

export default n8nClient;
