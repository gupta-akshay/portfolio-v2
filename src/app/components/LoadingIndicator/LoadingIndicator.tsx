import React, { memo } from 'react';
import { LoadingIndicatorProps } from '@/app/types/components';

// Memoize the component to prevent unnecessary re-renders
const LoadingIndicator: React.FC<LoadingIndicatorProps> = memo(
  ({ size = 'lg', color, text, className = 'global-loading-container' }) => {
    // Pre-define sizes to avoid recalculation
    const dimensions = {
      sm: { width: '30px', height: '30px' },
      md: { width: '50px', height: '50px' },
      lg: { width: '70px', height: '70px' },
    }[size];

    const spinnerStyle = {
      ...dimensions,
      ...(color && { borderColor: color }),
    };

    return (
      <div className={className}>
        <div className='global-loading-spinner' style={spinnerStyle}>
          <div className='spinner-circle'></div>
          <div className='spinner-circle-inner'></div>
        </div>
        {text && <p className='loading-text'>{text}</p>}
      </div>
    );
  }
);

// Add display name for better debugging
LoadingIndicator.displayName = 'LoadingIndicator';

export default LoadingIndicator;
