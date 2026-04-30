class GuiExecutionTreeBuilder {
  constructor() {
    this.trees = {};
  }

  startExecutionTree(executionId, taskConfig = {}) {
    const now = new Date().toISOString();
    const nodes = [
      {
        id: 'user_command',
        type: 'ROOT',
        level: 1,
        label: 'User Command',
        status: 'ACCEPTED',
        started_at: now,
        children: ['intent', 'mode_route', 'model', 'wf001', 'wf010', 'wf020', 'wf900'],
      },
      { id: 'intent', type: 'INTENT', level: 2, label: 'Intent Resolver', status: 'QUEUED', children: [] },
      { id: 'mode_route', type: 'GUARD', level: 2, label: 'Mode/Route Guard', status: 'QUEUED', children: [] },
      { id: 'model', type: 'MODEL', level: 2, label: 'Model Router', status: 'QUEUED', children: [] },
      { id: 'wf001', type: 'WORKFLOW', workflow_id: 'WF-001', level: 2, label: 'WF-001 Dossier Create', status: 'NOT_STARTED', children: [] },
      { id: 'wf010', type: 'WORKFLOW', workflow_id: 'WF-010', level: 2, label: 'WF-010 Parent Orchestrator', status: 'NOT_STARTED', children: ['wf100', 'wf200', 'wf300', 'wf400', 'wf500', 'wf600'] },
      { id: 'wf100', type: 'WORKFLOW', workflow_id: 'WF-100', level: 3, label: 'WF-100 Topic Intelligence', status: 'NOT_STARTED', children: [] },
      { id: 'wf200', type: 'WORKFLOW', workflow_id: 'WF-200', level: 3, label: 'WF-200 Script Intelligence', status: 'NOT_STARTED', children: [] },
      { id: 'wf300', type: 'WORKFLOW', workflow_id: 'WF-300', level: 3, label: 'WF-300 Context Engineering', status: 'NOT_STARTED', children: [] },
      { id: 'wf400', type: 'WORKFLOW', workflow_id: 'WF-400', level: 3, label: 'WF-400 Media Production', status: 'NOT_STARTED', children: [] },
      { id: 'wf500', type: 'WORKFLOW', workflow_id: 'WF-500', level: 3, label: 'WF-500 Publishing Distribution', status: 'NOT_STARTED', children: [] },
      { id: 'wf600', type: 'WORKFLOW', workflow_id: 'WF-600', level: 3, label: 'WF-600 Analytics Evolution', status: 'NOT_STARTED', children: [] },
      { id: 'wf020', type: 'WORKFLOW', workflow_id: 'WF-020', level: 2, label: 'WF-020 Final Approval', status: taskConfig.approval_required ? 'WAITING_FOR_PACKET_OUTPUT' : 'DEFERRED_PROVIDER_REQUIRED', children: [] },
      { id: 'wf900', type: 'WORKFLOW', workflow_id: 'WF-900', level: 2, label: 'WF-900 Error Handler', status: 'NOT_STARTED', children: [] },
    ];

    this.trees[executionId] = {
      execution_id: executionId,
      task_label: taskConfig.label || 'Task Execution',
      started_at: now,
      nodes,
      timeline: [{ timestamp: now, node_id: 'user_command', status: 'ACCEPTED' }],
    };
    return this.trees[executionId];
  }

  updateNodeStatus(executionId, nodeId, status, details = {}) {
    const tree = this.trees[executionId];
    if (!tree) return null;
    const node = tree.nodes.find((n) => n.id === nodeId);
    if (!node) return tree;
    node.status = status;
    Object.assign(node, details);
    tree.timeline.push({ timestamp: new Date().toISOString(), node_id: nodeId, status });
    return tree;
  }

  completeIntentDetection(executionId, details = {}) {
    return this.updateNodeStatus(executionId, 'intent', 'ACCEPTED', details);
  }

  completeModeRouteCheck(executionId, details = {}) {
    return this.updateNodeStatus(executionId, 'mode_route', 'ACCEPTED', details);
  }

  getExecutionTree(executionId) {
    return this.trees[executionId] || null;
  }

  getTreeAsText(executionId) {
    const t = this.trees[executionId];
    if (!t) return '';
    return t.nodes.map((n) => `${'  '.repeat((n.level || 1) - 1)}- ${n.label}: ${n.status}`).join('\n');
  }
}

module.exports = GuiExecutionTreeBuilder;
