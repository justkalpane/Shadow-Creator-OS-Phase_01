const N8nWorkflowClient = require('../engine/chat/n8n_workflow_client');

class OperatorN8nClient {
  constructor() {
    this.client = new N8nWorkflowClient();
  }

  async health() {
    return this.client.healthCheck();
  }

  async trigger(workflowId, payload = {}) {
    return this.client.triggerWorkflow(workflowId, payload);
  }

  getRegisteredWorkflows() {
    return this.client.getRegisteredWorkflows();
  }
}

module.exports = OperatorN8nClient;

