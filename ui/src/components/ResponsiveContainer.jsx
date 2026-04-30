import { memo } from 'react';
import { useResponsive } from '../hooks/useResponsive';

const ResponsiveContainer = memo(function ResponsiveContainer({ children, className = '' }) {
  const { isMobile, isTablet } = useResponsive();

  const baseClasses = 'space-y-6 p-4 sm:p-6';
  const responsiveClasses = isMobile ? 'space-y-4 p-3' : baseClasses;

  return (
    <div className={`${responsiveClasses} ${className}`}>
      {children}
    </div>
  );
});

export default ResponsiveContainer;
