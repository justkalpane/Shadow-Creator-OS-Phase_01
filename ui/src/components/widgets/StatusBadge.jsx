export default function StatusBadge({ status, label = null, size = 'sm' }) {
  const statusStyles = {
    APPROVED: { bg: 'bg-green-900', text: 'text-green-300', dot: 'bg-green-400' },
    approved: { bg: 'bg-green-900', text: 'text-green-300', dot: 'bg-green-400' },
    success: { bg: 'bg-green-900', text: 'text-green-300', dot: 'bg-green-400' },
    FAILED: { bg: 'bg-red-900', text: 'text-red-300', dot: 'bg-red-400' },
    failed: { bg: 'bg-red-900', text: 'text-red-300', dot: 'bg-red-400' },
    error: { bg: 'bg-red-900', text: 'text-red-300', dot: 'bg-red-400' },
    PENDING: { bg: 'bg-yellow-900', text: 'text-yellow-300', dot: 'bg-yellow-400' },
    pending: { bg: 'bg-yellow-900', text: 'text-yellow-300', dot: 'bg-yellow-400' },
    running: { bg: 'bg-blue-900', text: 'text-blue-300', dot: 'bg-blue-400' },
    active: { bg: 'bg-blue-900', text: 'text-blue-300', dot: 'bg-blue-400' },
    resolved: { bg: 'bg-gray-800', text: 'text-gray-300', dot: 'bg-gray-400' },
    critical: { bg: 'bg-red-900', text: 'text-red-300', dot: 'bg-red-400' },
    high: { bg: 'bg-orange-900', text: 'text-orange-300', dot: 'bg-orange-400' },
    medium: { bg: 'bg-yellow-900', text: 'text-yellow-300', dot: 'bg-yellow-400' },
    low: { bg: 'bg-blue-900', text: 'text-blue-300', dot: 'bg-blue-400' },
  };

  const style = statusStyles[status] || { bg: 'bg-gray-800', text: 'text-gray-300', dot: 'bg-gray-400' };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }[size];

  return (
    <span className={`${style.bg} ${style.text} ${sizeClasses} rounded inline-flex items-center gap-1.5`}>
      <span className={`${style.dot} w-2 h-2 rounded-full`}></span>
      {label || status}
    </span>
  );
}
