import { memo } from 'react';

const DataLoadingError = memo(function DataLoadingError({ error, onRetry, title = 'Data Loading Error' }) {
  return (
    <div className="bg-red-900 border border-red-700 rounded-lg p-6 flex items-start gap-4">
      <div className="flex-shrink-0 text-2xl">⚠️</div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-red-300 mb-2">{title}</h3>
        <p className="text-red-200 text-sm mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
});

export default DataLoadingError;
