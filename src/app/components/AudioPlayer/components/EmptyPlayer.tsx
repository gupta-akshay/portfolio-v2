import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faWaveSquare } from '@fortawesome/free-solid-svg-icons';

const EmptyPlayer: React.FC = () => {
  return (
    <div className='emptyPlayerState'>
      <div className='emptyStateIcon'>
        <FontAwesomeIcon icon={faWaveSquare as IconProp} />
      </div>
      <h3>Ready to Play</h3>
      <p>Select a track from the playlist to start listening</p>
    </div>
  );
};

export default EmptyPlayer;
