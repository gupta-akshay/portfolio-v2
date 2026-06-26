import React from 'react';
import Icon from '@/app/components/Icon/Icon';

const EmptyPlayer: React.FC = () => {
  return (
    <div className='emptyPlayerState'>
      <div className='emptyStateIcon'>
        <Icon name='wave-square' />
      </div>
      <h3>Ready to Play</h3>
      <p>Select a track from the playlist to start listening</p>
    </div>
  );
};

export default EmptyPlayer;
