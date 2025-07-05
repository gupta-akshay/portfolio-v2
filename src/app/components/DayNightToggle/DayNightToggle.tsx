'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { handleKeyDown } from '@/app/utils';
import { useTheme } from '@/app/context/ThemeContext';
import { DayNightToggleProps } from '@/app/types/components';

const DayNightToggle = ({
  className = 'color_switch',
  isLight,
  onToggle,
}: DayNightToggleProps) => {
  const { isLightMode, toggleTheme } = useTheme();

  // Use props if provided, otherwise use context
  const lightMode = isLight !== undefined ? isLight : isLightMode;
  const toggleHandler = onToggle || toggleTheme;

  return (
    <button
      className={`${className}`.trim()}
      onClick={toggleHandler}
      onKeyDown={(e) => handleKeyDown(e, toggleHandler)}
      aria-label={`Switch to ${lightMode ? 'dark' : 'light'} mode`}
      role='switch'
      aria-checked={lightMode}
      title={`Switch to ${lightMode ? 'dark' : 'light'} mode`}
    >
      <FontAwesomeIcon
        icon={(lightMode ? faMoon : faSun) as IconProp}
        aria-hidden='true'
      />
      <span className='visually-hidden'>
        {lightMode ? 'Switch to dark mode' : 'Switch to light mode'}
      </span>
    </button>
  );
};

export default DayNightToggle;
