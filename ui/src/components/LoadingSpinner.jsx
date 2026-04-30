import { memo } from 'react';

const LoadingSpinner = memo(function LoadingSpinner({ message = 'Loading...', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }[size];

  const containerSizeClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center ${containerSizeClasses}`}>
      <div className={`${sizeClasses} border-4 border-gray-700 border-t-shadow-accent rounded-full animate-spin`} />
      {message && <p className="text-gray-400 text-sm">{message}</p>}
    </div>
  );
});

export default LoadingSpinner;
