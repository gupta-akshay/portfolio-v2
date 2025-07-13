'use client';

import { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { handleKeyDown } from '@/app/utils';
import { useTheme } from '@/app/context/ThemeContext';
import { useCursorInteractions } from '@/app/hooks/useCursorInteractions';
import { useCursor } from '@/app/context/CursorContext';
import { useEasterEgg } from '@/app/context/EasterEggContext';
import { DayNightToggleProps } from '@/app/types/components';

const DayNightToggle = ({
  className = 'color_switch',
  isLight,
  onToggle,
}: DayNightToggleProps) => {
  const { isLightMode, toggleTheme } = useTheme();
  const { addCursorInteraction } = useCursorInteractions();
  const { setCursorText, cursorVariant } = useCursor();
  const { togglePartyMode } = useEasterEgg();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use props if provided, otherwise use context
  const lightMode = isLight !== undefined ? isLight : isLightMode;
  const originalToggleHandler = onToggle || toggleTheme;

  const toggleHandler = () => {
    originalToggleHandler();

    // Track rapid clicks for party mode
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    // Clear existing timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    // Check if 5 rapid clicks within 2 seconds
    if (newClickCount >= 5) {
      togglePartyMode();
      setClickCount(0);
    } else {
      // Reset click count after 2 seconds
      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2000);
    }
  };

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  return (
    <button
      ref={buttonRef}
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
