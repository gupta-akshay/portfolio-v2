'use client';

import { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { handleKeyDown } from '@/app/utils';
import { useTheme } from '@/app/context/ThemeContext';
import { useCursorInteractions } from '@/app/hooks/useCursorInteractions';
import { useCursor } from '@/app/context/CursorContext';
import { DayNightToggleProps } from '@/app/types/components';

import styles from './DayNightToggle.module.scss';

const DayNightToggle = ({ isLight, onToggle }: DayNightToggleProps) => {
  const { isLightMode, toggleTheme } = useTheme();
  const { addCursorInteraction } = useCursorInteractions();
  const { setCursorText, cursorVariant } = useCursor();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Use props if provided, otherwise use context
  const lightMode = isLight !== undefined ? isLight : isLightMode;
  const toggleHandler = onToggle || toggleTheme;

  const toggleText = lightMode ? 'Go dark' : 'Go light';

  // Update cursor text immediately when theme changes while hovering
  useEffect(() => {
    if (isHovering && cursorVariant === 'hover') {
      setCursorText(toggleText);
    }
  }, [lightMode, isHovering, cursorVariant, setCursorText, toggleText]);

  // Add cursor interactions
  useEffect(() => {
    if (buttonRef.current) {
      return addCursorInteraction(buttonRef.current, {
        onHover: 'hover',
        onText: toggleText,
        onClick: 'click',
      });
    }

    return undefined;
  }, [addCursorInteraction, lightMode, toggleText]);

  // Track hover state manually to know when to update cursor text
  useEffect(() => {
    const element = buttonRef.current;
    if (!element) return;

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={styles.colorSwitch}
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
      <span className={styles.visuallyHidden}>
        {lightMode ? 'Switch to dark mode' : 'Switch to light mode'}
      </span>
    </button>
  );
};

export default DayNightToggle;
