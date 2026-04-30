import { memo } from 'react';

const StatCard = memo(function StatCard({ title, value, subtext, color = 'gray', icon, onClick, loading }) {
  const borderColorClass = {
    gray: 'border-gray-700 hover:border-shadow-accent',
    green: 'border-gray-700 hover:border-green-400',
    red: 'border-gray-700 hover:border-red-400',
    yellow: 'border-gray-700 hover:border-yellow-400',
    blue: 'border-gray-700 hover:border-shadow-accent',
    purple: 'border-gray-700 hover:border-purple-400',
  }[color];

  const textColorClass = {
    gray: 'text-gray-300',
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    blue: 'text-shadow-accent',
    purple: 'text-purple-400',
  }[color];

  return (
    <div
      onClick={onClick}
      className={`bg-shadow-card p-6 rounded border ${borderColorClass} transition-colors ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-sm text-gray-400">{title}</div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className={`text-3xl font-bold ${textColorClass} mb-2`}>
        {loading ? '...' : value}
      </div>
      {subtext && <div className="text-xs text-gray-500">{subtext}</div>}
    </div>
  );
});

export default StatCard;
