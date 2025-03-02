import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

interface TrackSearchProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

const TrackSearch: React.FC<TrackSearchProps> = ({ onSearch, searchQuery }) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local state when prop changes (for reset functionality)
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setInputValue('');
    onSearch('');
    // Focus the input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className='track-search-container'>
      <div className='search-input-wrapper'>
        <FontAwesomeIcon icon={faSearch} className='search-icon' />
        <input
          ref={inputRef}
          type='text'
          className='search-input'
          placeholder='Search by track name, artist or type...'
          value={inputValue}
          onChange={handleInputChange}
          aria-label='Search tracks'
        />
        {inputValue && (
          <button
            className='clear-search-button'
            onClick={clearSearch}
            aria-label='Clear search'
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TrackSearch;
