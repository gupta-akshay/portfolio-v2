import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface NoSearchResultsProps {
  searchQuery: string;
  className?: string;
}

const NoSearchResults: React.FC<NoSearchResultsProps> = ({
  searchQuery,
  className = '',
}) => {
  return (
    <div className={`noSearchResults ${className}`}>
      <div className='noResultsIcon'>
        <FontAwesomeIcon icon={faSearch as IconProp} />
      </div>
      <h3>No Results Found</h3>
      <p>
        No tracks match &quot;<strong>{searchQuery}</strong>&quot;.
        <br />
        Try different keywords or check for typos.
      </p>
    </div>
  );
};

export default NoSearchResults;
