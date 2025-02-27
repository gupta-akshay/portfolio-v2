import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const MusicLoadingIndicator: React.FC = () => {
  return (
    <div className='loading-container'>
      <div className='loading-spinner'>
        <FontAwesomeIcon icon={faSpinner} spin size='2x' />
        <p>Loading tracks...</p>
      </div>
    </div>
  );
};

export default MusicLoadingIndicator; 