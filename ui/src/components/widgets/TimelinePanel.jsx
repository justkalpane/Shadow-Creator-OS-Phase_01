import { memo, useMemo } from 'react';
import StatusBadge from './StatusBadge';

const TimelinePanel = memo(function TimelinePanel({ title, events, loading, error }) {
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

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const timeA = new Date(a.timestamp);
      const timeB = new Date(b.timestamp);
      return timeB - timeA;
    });
  }, [events]);

  return (
    <div className="bg-shadow-card p-6 rounded border border-gray-700">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}

      {sortedEvents.length === 0 ? (
        <p className="text-gray-400">No events</p>
      ) : (
        <div className="space-y-4">
          {sortedEvents.map((event, idx) => {
            const time = new Date(event.timestamp);
            const timeStr = time.toLocaleTimeString();
            const dateStr = time.toLocaleDateString();

            return (
              <div key={idx} className="flex gap-4 pb-4 border-b border-gray-700 last:border-b-0 last:pb-0">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-3 h-3 rounded-full bg-shadow-accent mt-1"></div>
                  {idx < sortedEvents.length - 1 && (
                    <div className="w-0.5 h-16 bg-gray-700 mt-2"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-gray-200 font-medium">{event.label || event.title || 'Event'}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {dateStr} at {timeStr}
                      </p>
                    </div>
                    {event.status && (
                      <StatusBadge status={event.status} size="sm" />
                    )}
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-400 mt-2">{event.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

export default TimelinePanel;
