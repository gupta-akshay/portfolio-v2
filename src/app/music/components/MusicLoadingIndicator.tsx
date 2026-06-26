import React from 'react';
import Icon from '@/app/components/Icon/Icon';

const MusicLoadingIndicator: React.FC = () => {
  return (
    <div className='loading-container'>
      <div className='loading-spinner'>
        <Icon name='spinner' spin size='2x' />
        <p>Loading tracks...</p>
      </div>
    </div>
  );
};

export default MusicLoadingIndicator;
