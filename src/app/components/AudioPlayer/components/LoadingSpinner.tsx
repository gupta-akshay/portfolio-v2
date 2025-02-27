import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingSpinner: React.FC = () => {
  return (
    <div className='loadingSpinner'>
      <FontAwesomeIcon icon={faSpinner} spin />
    </div>
  );
};

export default LoadingSpinner;
