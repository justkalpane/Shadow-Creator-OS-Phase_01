import { memo } from 'react';
import StatusBadge from './StatusBadge';

const HistoryPanel = memo(function HistoryPanel({ title, items, loading, error, onItemClick }) {
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

  return (
    <div className="bg-shadow-card p-6 rounded border border-gray-700">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}

      {items.length === 0 ? (
        <p className="text-gray-400">No items</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {items.map((item, idx) => {
            const timestamp = item.timestamp || item.created_at || item.date;
            const timeStr = timestamp ? new Date(timestamp).toLocaleString() : '';

            return (
              <div
                key={item.id || idx}
                onClick={() => onItemClick && onItemClick(item)}
                className={`p-3 bg-gray-800 rounded border border-gray-600 hover:border-shadow-accent transition-colors ${onItemClick ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-sm text-gray-200 font-medium flex-1 min-w-0">
                    {item.label || item.title || item.name || 'Item'}
                  </span>
                  {item.status && (
                    <StatusBadge status={item.status} size="sm" />
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-500">{timeStr}</span>
                  {item.badge && (
                    <span className="text-xs bg-shadow-accent text-gray-900 px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="text-xs text-gray-400 mt-2">{item.description}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          Showing {items.length} {items.length === 1 ? 'item' : 'items'}
        </div>
      )}
    </div>
  );
});

export default HistoryPanel;
