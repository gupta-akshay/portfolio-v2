'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const DayNightToggle = () => {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Once the component has mounted, we're safe to use localStorage
    const storedTheme = localStorage.getItem('theme');
    const isStoredThemeLight = storedTheme === 'theme-light';
    setIsLightMode(isStoredThemeLight);

    const bodyClassList = document.querySelector('body')?.classList;
    if (isStoredThemeLight) {
      bodyClassList?.add('theme-light');
    } else {
      bodyClassList?.remove('theme-light');
    }
  }, []);

  useEffect(() => {
    const bodyClassList = document.querySelector('body')?.classList;
    if (isLightMode) {
      bodyClassList?.add('theme-light');
      localStorage.setItem('theme', 'theme-light');
    } else {
      bodyClassList?.remove('theme-light');
      localStorage.setItem('theme', 'theme-dark');
    }
  }, [isLightMode]);

  const changeMode = () => {
    setIsLightMode(!isLightMode);
    localStorage?.setItem('theme', isLightMode ? 'theme-dark' : 'theme-light');
  };

  return (
    <label
      className='color_switch'
      onClick={() => changeMode()}
      role='button'
      aria-label={`switch to ${isLightMode ? 'dark' : 'light'} mode`}
    >
      <FontAwesomeIcon icon={isLightMode ? faMoon : faSun} />
    </label>
  );
};

export default DayNightToggle;
