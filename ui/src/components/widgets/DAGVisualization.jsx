import StatusBadge from './StatusBadge';

export default function DAGVisualization({ title, nodes = [], edges = [], loading, error, onNodeClick }) {
  if (loading) {
    return (
      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <p className="text-gray-400">No nodes to display</p>
      </div>
    );
  }

  // Calculate node positions in a simple left-to-right flow
  const nodeWidth = 140;
  const nodeHeight = 80;
  const horizontalGap = 200;
  const verticalGap = 120;

  // Group nodes by level (distance from start)
  const levels = {};
  const visited = new Set();

  function calculateLevel(nodeId, level = 0) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    if (!levels[level]) levels[level] = [];
    levels[level].push(nodeId);

    // Find children
    const children = edges
      .filter(e => e.source === nodeId)
      .map(e => e.target);

    children.forEach(childId => calculateLevel(childId, level + 1));
  }

  // Start from nodes with no incoming edges
  const nodesWithIncoming = new Set(edges.map(e => e.target));
  nodes.forEach(node => {
    if (!nodesWithIncoming.has(node.id)) {
      calculateLevel(node.id);
    }
  });

  // Position nodes
  const positions = {};
  let maxPerLevel = 0;

  Object.entries(levels).forEach(([level, nodeIds]) => {
    const count = nodeIds.length;
    maxPerLevel = Math.max(maxPerLevel, count);
    nodeIds.forEach((nodeId, idx) => {
      const x = parseInt(level) * horizontalGap + 50;
      const y = (idx - (count - 1) / 2) * verticalGap + 150;
      positions[nodeId] = { x, y };
    });
  });

  const totalWidth = Object.keys(levels).length * horizontalGap + 200;
  const totalHeight = maxPerLevel * verticalGap + 300;

  return (
    <div className="bg-shadow-card p-6 rounded border border-gray-700">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}

      <div className="overflow-x-auto">
        <svg width={totalWidth} height={totalHeight} className="border border-gray-600 rounded bg-gray-900">
          {/* Draw edges first (behind nodes) */}
          {edges.map((edge, idx) => {
            const sourcePos = positions[edge.source];
            const targetPos = positions[edge.target];

            if (!sourcePos || !targetPos) return null;

            const x1 = sourcePos.x + nodeWidth / 2;
            const y1 = sourcePos.y + nodeHeight / 2;
            const x2 = targetPos.x + nodeWidth / 2;
            const y2 = targetPos.y + nodeHeight / 2;

            // Curved path
            const midX = (x1 + x2) / 2;

            return (
              <path
                key={idx}
                d={`M ${x1} ${y1} Q ${midX} ${(y1 + y2) / 2} ${x2} ${y2}`}
                stroke="#4b5563"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
            );
          })}

          {/* Arrow marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#4b5563" />
            </marker>
          </defs>

          {/* Draw nodes */}
          {nodes.map((node) => {
            const pos = positions[node.id];
            if (!pos) return null;

            return (
              <g key={node.id}>
                {/* Node background */}
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx="4"
                  fill="#1f2937"
                  stroke={node.status === 'error' ? '#ef4444' : '#4b5563'}
                  strokeWidth="2"
                  style={{ cursor: onNodeClick ? 'pointer' : 'default' }}
                  onClick={() => onNodeClick && onNodeClick(node)}
                />

                {/* Node label */}
                <text
                  x={pos.x + nodeWidth / 2}
                  y={pos.y + 25}
                  textAnchor="middle"
                  fill="#e5e7eb"
                  fontSize="12"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {node.label || node.id}
                </text>

                {/* Node status */}
                {node.status && (
                  <text
                    x={pos.x + nodeWidth / 2}
                    y={pos.y + 50}
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize="10"
                    pointerEvents="none"
                  >
                    {node.status}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      {nodes.some(n => n.status) && (
        <div className="mt-4 flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border border-gray-400 bg-gray-700"></div>
            <span className="text-gray-400">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border border-red-400 bg-gray-700"></div>
            <span className="text-gray-400">Error</span>
          </div>
        </div>
      )}
    </div>
  );
}
