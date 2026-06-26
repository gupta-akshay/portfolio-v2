import React from 'react';
import Icon from '@/app/components/Icon/Icon';

const LoadingSpinner: React.FC = () => {
  return (
    <div className='loadingSpinner'>
      <Icon name='spinner' spin />
    </div>
  );
};

export default LoadingSpinner;
