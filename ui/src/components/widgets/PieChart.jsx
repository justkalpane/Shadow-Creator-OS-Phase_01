export default function PieChart({ title, data, loading, error }) {
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

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  if (total === 0) {
    return (
      <div className="bg-shadow-card p-6 rounded border border-gray-700">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
  ];

  const entries = Object.entries(data);
  const segments = entries.map(([label, value], idx) => ({
    label,
    value,
    percentage: (value / total) * 100,
    color: colors[idx % colors.length],
  }));

  // Simple SVG pie chart
  let currentAngle = 0;
  const pathData = segments.map((segment) => {
    const sliceAngle = (segment.percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const start = polarToCartesian(100, 100, 80, endAngle);
    const end = polarToCartesian(100, 100, 80, startAngle);
    const largeArc = sliceAngle > 180 ? 1 : 0;

    const path = `
      M 100 100
      L ${end.x} ${end.y}
      A 80 80 0 ${largeArc} 1 ${start.x} ${start.y}
      Z
    `;

    currentAngle += sliceAngle;

    return { ...segment, path };
  });

  return (
    <div className="bg-shadow-card p-6 rounded border border-gray-700">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Chart */}
        <div className="flex-1 flex items-center justify-center">
          <svg width="220" height="220" viewBox="0 0 200 200" className="drop-shadow-lg">
            {pathData.map((segment, idx) => (
              <path
                key={idx}
                d={segment.path}
                fill={segment.color}
                opacity="0.8"
                stroke="#111827"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 flex flex-col justify-center gap-2">
          {pathData.map((segment, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="text-gray-300">{segment.label}</span>
              <span className="text-gray-500 ml-auto">
                {segment.value} ({segment.percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
