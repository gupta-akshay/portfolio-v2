import React, { memo } from 'react';

type LoadingIndicatorProps = {
  size?: 'small' | 'medium' | 'large',
};

// Memoize the component to prevent unnecessary re-renders
const LoadingIndicator: React.FC<LoadingIndicatorProps> = memo(
  ({ size = 'large' }) => {
    // Pre-define sizes to avoid recalculation
    const dimensions = {
      small: { width: '30px', height: '30px' },
      medium: { width: '50px', height: '50px' },
      large: { width: '70px', height: '70px' },
    }[size];

    return (
      <div className='global-loading-container'>
        <div className='global-loading-spinner' style={dimensions}>
          <div className='spinner-circle'></div>
          <div className='spinner-circle-inner'></div>
        </div>
      </div>
    );
  }
);

// Add display name for better debugging
LoadingIndicator.displayName = 'LoadingIndicator';

export default LoadingIndicator;
