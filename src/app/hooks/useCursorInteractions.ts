'use client';

import { useEffect, useCallback } from 'react';
import { useCursor } from '@/app/context/CursorContext';

interface CursorInteractionOptions {
  onHover?: string; // cursor variant on hover
  onText?: string; // text to display
  onClick?: string; // cursor variant on click
}

export const useCursorInteractions = () => {
  const { setCursorVariant, setCursorText } = useCursor();

  const addCursorInteraction = useCallback(
    (element: HTMLElement | null, options: CursorInteractionOptions) => {
      if (!element) return;

      const handleMouseEnter = () => {
        if (options.onHover) {
          setCursorVariant(options.onHover);
        }
        if (options.onText) {
          setCursorText(options.onText);
        }
      };

      const handleMouseLeave = () => {
        setCursorVariant('default');
        setCursorText('');
      };

      const handleMouseDown = () => {
        if (options.onClick) {
          setCursorVariant(options.onClick);
        }
      };

      const handleMouseUp = () => {
        if (options.onHover) {
          setCursorVariant(options.onHover);
        } else {
          setCursorVariant('default');
        }
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('mouseup', handleMouseUp);

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
        element.removeEventListener('mousedown', handleMouseDown);
        element.removeEventListener('mouseup', handleMouseUp);
      };
    },
    [setCursorVariant, setCursorText]
  );

  return { addCursorInteraction };
};

// Hook for automatic cursor interactions on mount
export const useAutoCursorInteraction = (
  ref: React.RefObject<HTMLElement>,
  options: CursorInteractionOptions
) => {
  const { addCursorInteraction } = useCursorInteractions();

  useEffect(() => {
    if (ref.current) {
      return addCursorInteraction(ref.current, options);
    }
  }, [ref, options, addCursorInteraction]);
};
