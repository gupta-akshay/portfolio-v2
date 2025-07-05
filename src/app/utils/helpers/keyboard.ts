import { KeyboardEvent } from 'react';

/**
 * Handle keyboard events for accessibility
 * @param e - Keyboard event
 * @param callback - Function to call on Enter or Space key press
 */
export const handleKeyDown = (
  e: KeyboardEvent<HTMLElement>,
  callback: () => void
): void => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    callback();
  }
};
