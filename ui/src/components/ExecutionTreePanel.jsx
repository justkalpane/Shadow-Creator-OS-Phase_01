import React, { useState, useEffect } from 'react';

/**
 * ExecutionTreePanel
 *
 * Displays the execution tree showing:
 * - Workflows being executed
 * - Directors handling each workflow
 * - Sub-agents executing skills
 * - Real-time status updates
 * - Output from each step
 */
export default function ExecutionTreePanel({ executionTree }) {
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  if (!executionTree) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded p-4">
        <p className="text-gray-400 text-sm">Waiting for execution...</p>
      </div>
    );
  }

  const toggleNodeExpanded = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getStatusColor = (status) => {
    const colors = {
      COMPLETE: 'text-green-400',
      RUNNING: 'text-blue-400 animate-pulse',
      QUEUED: 'text-yellow-400',
      WAITING: 'text-gray-400',
      PENDING: 'text-gray-400',
      FAILED: 'text-red-400',
      PASS: 'text-green-400',
      FAIL: 'text-red-400',
    };
    return colors[status] || 'text-gray-400';
  };

  const getStatusIcon = (status) => {
    const icons = {
      COMPLETE: '✓',
      RUNNING: '⟳',
      QUEUED: '◌',
      WAITING: '⏸',
      PENDING: '◌',
      FAILED: '✗',
      PASS: '✓',
      FAIL: '✗',
    };
    return icons[status] || '◌';
  };

  const renderNode = (node, level = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isNodeGroup = ['WORKFLOW', 'DIRECTOR', 'SUB_AGENT'].includes(node.type);

    return (
      <div key={node.id} className="mb-1">
        <div
          className={`flex items-start gap-2 p-2 rounded hover:bg-gray-700/50 cursor-pointer text-xs font-mono`}
          style={{ marginLeft: `${level * 16}px` }}
          onClick={() => hasChildren && toggleNodeExpanded(node.id)}
        >
          {/* Expand/collapse icon */}
          {hasChildren ? (
            <span className="w-4 text-center">
              {isExpanded ? '▼' : '▶'}
            </span>
          ) : (
            <span className="w-4" />
          )}

          {/* Status icon */}
          <span className={`w-4 text-center ${getStatusColor(node.status)}`}>
            {getStatusIcon(node.status)}
          </span>

          {/* Node label */}
          <span className="flex-1">
            <span className="font-semibold">{node.label}</span>
            {node.workflow_id && (
              <span className="text-gray-500 ml-2">({node.workflow_id})</span>
            )}
          </span>

          {/* Duration */}
          {node.duration_ms && (
            <span className="text-gray-500">({node.duration_ms}ms)</span>
          )}

          {/* Status badge */}
          <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(node.status)}`}>
            {node.status}
          </span>
        </div>

        {/* Node details if expanded */}
        {isExpanded && (
          <div className="bg-gray-900/50 border-l border-gray-700 ml-4 pl-3 py-2 mt-1">
            {node.primary_director && (
              <div className="text-xs text-blue-400">
                <span className="font-semibold">Director:</span> {node.primary_director}
              </div>
            )}
            {node.supporting_directors && node.supporting_directors.length > 0 && (
              <div className="text-xs text-blue-300">
                <span className="font-semibold">Supporting:</span> {node.supporting_directors.join(', ')}
              </div>
            )}
            {node.mode && (
              <div className="text-xs text-purple-400">
                <span className="font-semibold">Mode:</span> {Array.isArray(node.mode) ? node.mode.join(', ') : node.mode}
              </div>
            )}
            {node.error && (
              <div className="text-xs text-red-400 mt-1">
                <span className="font-semibold">Error:</span> {node.error}
              </div>
            )}
            {node.output && typeof node.output === 'object' && (
              <div className="text-xs text-gray-400 mt-1 bg-black/30 p-1 rounded">
                <span className="font-semibold">Output:</span>
                <pre className="text-xs mt-1 overflow-auto max-h-24">
                  {JSON.stringify(node.output, null, 2).substring(0, 200)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Render children */}
        {isExpanded && hasChildren && (
          <div>
            {node.children.map((childId, index) => {
              // Find child node in the full nodes array
              const childNode = executionTree.nodes.find(n => n.id === childId);
              return childNode ? renderNode(childNode, level + 1) : null;
            })}
          </div>
        )}
      </div>
    );
  };

  // Find root node
  const rootNode = executionTree.nodes && executionTree.nodes.find(n => n.level === 1);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-200">
          📊 Execution Tree: {executionTree.task_label}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Started: {new Date(executionTree.started_at).toLocaleTimeString()}
        </p>
      </div>

      <div className="bg-gray-900/50 rounded p-3 font-mono text-xs">
        {rootNode ? renderNode(rootNode, 0) : <p className="text-gray-400">No execution tree available</p>}
      </div>

      {/* Timeline section */}
      {executionTree.timeline && executionTree.timeline.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="text-xs font-semibold text-gray-300 mb-2">Timeline</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {executionTree.timeline.slice(-5).map((event, index) => (
              <div key={index} className="text-xs text-gray-500 font-mono">
                <span className="text-gray-600">{new Date(event.timestamp).toLocaleTimeString()}</span>
                {' '}
                <span className="text-gray-400">{event.node_id}</span>
                {' '}
                <span className="text-blue-400">→</span>
                {' '}
                <span className="text-yellow-400">{event.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
