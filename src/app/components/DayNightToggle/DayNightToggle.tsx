'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { handleKeyDown } from '@/app/utils';
import { useTheme } from '@/app/context/ThemeContext';

const DayNightToggle = () => {
  const { isLightMode, toggleTheme } = useTheme();

  return (
    <button
      className='color_switch'
      onClick={toggleTheme}
      onKeyDown={(e) => handleKeyDown(e, toggleTheme)}
      aria-label={`Switch to ${isLightMode ? 'dark' : 'light'} mode`}
      role="switch"
      aria-checked={isLightMode}
      title={`Switch to ${isLightMode ? 'dark' : 'light'} mode`}
    >
      <FontAwesomeIcon icon={(isLightMode ? faMoon : faSun) as IconProp} aria-hidden="true" />
      <span className="visually-hidden">
        {isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
      </span>
    </button>
  );
};

export default DayNightToggle;
