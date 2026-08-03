'use client';

import Icon from '@/app/components/Icon/Icon';
import { handleKeyDown } from '@/app/utils';
import { useTheme } from '@/app/context/ThemeContext';

import styles from './DayNightToggle.module.scss';

const DayNightToggle = () => {
  const { isLightMode: lightMode, toggleTheme: toggleHandler } = useTheme();

  return (
    <button
      className={styles.colorSwitch}
      onClick={toggleHandler}
      onKeyDown={(e) => handleKeyDown(e, toggleHandler)}
      aria-label={`Switch to ${lightMode ? 'dark' : 'light'} mode`}
      role='switch'
      aria-checked={lightMode}
      title={`Switch to ${lightMode ? 'dark' : 'light'} mode`}
    >
      <Icon name={lightMode ? 'moon' : 'sun'} aria-hidden='true' />
      <span className={styles.visuallyHidden}>
        {lightMode ? 'Switch to dark mode' : 'Switch to light mode'}
      </span>
    </button>
  );
};

export default DayNightToggle;
