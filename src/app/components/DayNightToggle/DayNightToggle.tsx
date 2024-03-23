'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const DayNightToggle = () => {
  const [isLightMode, setIsLightMode] = useState(
    () => localStorage.getItem('theme') === 'theme-light'
  );

  useEffect(() => {
    const bodyClassList = document.querySelector('body')?.classList;
    if (isLightMode) {
      bodyClassList?.add('theme-light');
    } else {
      bodyClassList?.remove('theme-light');
    }
  }, [isLightMode]);

  const changeMode = () => {
    setIsLightMode(!isLightMode);
    localStorage.setItem('theme', isLightMode ? 'theme-dark' : 'theme-light');
  };

  return (
    <label className='color_switch' onClick={() => changeMode()} role='button'>
      <FontAwesomeIcon icon={isLightMode ? faMoon : faSun} />
    </label>
  );
};

export default DayNightToggle;
