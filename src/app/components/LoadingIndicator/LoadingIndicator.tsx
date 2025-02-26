import React from 'react';

type LoadingIndicatorProps = {
  size?: 'small' | 'medium' | 'large';
};

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  size = 'large'
}) => {
  const sizeMap = {
    small: { width: '30px', height: '30px' },
    medium: { width: '50px', height: '50px' },
    large: { width: '70px', height: '70px' },
  };

  const dimensions = sizeMap[size];

  return (
    <div className="global-loading-container">
      <div className="global-loading-spinner" style={dimensions}>
        <div className="spinner-circle"></div>
        <div className="spinner-circle-inner"></div>
      </div>
    </div>
  );
};

export default LoadingIndicator; 