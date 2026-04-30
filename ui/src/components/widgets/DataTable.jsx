import { useState } from 'react';
import StatusBadge from './StatusBadge';

export default function DataTable({ title, columns, data, loading, error, onRowClick, actions }) {
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  let displayData = data;

  // Filter
  if (searchTerm) {
    displayData = displayData.filter(row =>
      Object.values(row).some(val =>
        val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  // Sort
  if (sortBy) {
    displayData = [...displayData].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === 'asc' ? comparison : -comparison;
    });
  }

  return (
    <div className="bg-shadow-card p-6 rounded border border-gray-700">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-gray-200 placeholder-gray-500 focus:outline-none focus:border-shadow-accent"
        />
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">Error: {error}</p>
      ) : displayData.length === 0 ? (
        <p className="text-gray-400">No data available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-600">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`text-left py-3 px-4 text-gray-400 font-medium ${col.sortable ? 'cursor-pointer hover:text-gray-300' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {col.sortable && sortBy === col.key && (
                        <span className="text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                ))}
                {actions && <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`border-b border-gray-700 hover:bg-gray-800 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="py-3 px-4 text-gray-300">
                      {col.render ? col.render(row[col.key], row) : renderCell(row[col.key])}
                    </td>
                  ))}
                  {actions && (
                    <td className="py-3 px-4 text-gray-300">
                      <div className="flex gap-2">
                        {actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              action.onClick(row);
                            }}
                            className={`px-2 py-1 text-xs rounded transition-colors ${action.className || 'bg-gray-700 hover:bg-gray-600'}`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {displayData.length > 0 && (
        <div className="mt-4 text-xs text-gray-500">
          Showing {displayData.length} {displayData.length === 1 ? 'item' : 'items'}
          {searchTerm && ` (filtered from ${data.length})`}
        </div>
      )}
    </div>
  );
}

function renderCell(value) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? '✓' : '✗';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
