'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'motion/react';
import { useCursor } from '@/app/context/CursorContext';
import { useIsMobile } from '@/app/hooks/useIsMobile';

import './CustomCursor.scss';

const CustomCursor = () => {
  const { cursorVariant, cursorText } = useCursor();
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  // Motion values for smooth cursor movement (no spring)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Function to get cursor size based on variant
  const getCursorSize = (variant: string): number => {
    switch (variant) {
      case 'text':
        return 64;
      case 'hover':
        return 80;
      case 'subtle':
        return 48;
      case 'click':
        return 24;
      case 'default':
      default:
        return 32;
    }
  };

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Calculate offset based on current cursor size
      const cursorSize = getCursorSize(cursorVariant);
      const offset = cursorSize / 2;

      cursorX.set(x - offset);
      cursorY.set(y - offset);

      // Ensure cursor is visible when mouse moves
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Add event listeners
    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Check if cursor should be visible on mount
    const checkInitialVisibility = () => {
      if (window.innerWidth > 768 && !('ontouchstart' in window)) {
        setIsVisible(true);
      }
    };

    checkInitialVisibility();

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible, cursorVariant]);

  // Cursor animation variants
  const variants = {
    default: {
      scale: 1,
      backgroundColor: 'var(--cursor-color)',
      mixBlendMode: 'difference' as const,
      width: 32,
      height: 32,
    },
    text: {
      scale: 1.5,
      backgroundColor: 'var(--cursor-hover-color)',
      mixBlendMode: 'difference' as const,
      width: 64,
      height: 64,
    },
    hover: {
      scale: 2,
      backgroundColor: 'var(--cursor-hover-color)',
      mixBlendMode: 'difference' as const,
      width: 80,
      height: 80,
    },
    subtle: {
      scale: 1.3,
      backgroundColor: 'var(--cursor-hover-color)',
      mixBlendMode: 'difference' as const,
      width: 48,
      height: 48,
    },
    click: {
      scale: 0.8,
      backgroundColor: 'var(--cursor-click-color)',
      mixBlendMode: 'difference' as const,
      width: 24,
      height: 24,
    },
    hidden: {
      scale: 0,
      opacity: 0,
    },
  };

  // Don't render on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className='custom-cursor'
        style={{
          left: cursorX,
          top: cursorY,
          opacity: isVisible ? 1 : 0,
        }}
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 400,
          mass: 0.5,
        }}
      />

      {/* Cursor text */}
      {cursorText && isVisible && (
        <motion.div
          className={`cursor-text ${cursorVariant === 'subtle' ? 'cursor-text-subtle' : ''}`}
          style={{
            left: cursorX,
            top: cursorY,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 400,
          }}
        >
          {cursorText}
        </motion.div>
      )}
    </>
  );
};

export default CustomCursor;
