import { useEffect } from 'react';

const VOLUME_STEP = 0.05;
const INTERACTIVE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON']);

interface UseKeyboardShortcutsOptions {
  enabled: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleMute: () => void;
  volume: number;
  onVolumeSet: (v: number) => void;
}

export function useKeyboardShortcuts({
  enabled,
  onPlayPause,
  onNext,
  onPrevious,
  onToggleMute,
  volume,
  onVolumeSet,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (INTERACTIVE_TAGS.has(target.tagName) || target.isContentEditable) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onPlayPause();
          break;
        case 'KeyM':
          onToggleMute();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrevious();
          break;
        case 'ArrowUp':
          e.preventDefault();
          onVolumeSet(Math.min(1, volume + VOLUME_STEP));
          break;
        case 'ArrowDown':
          e.preventDefault();
          onVolumeSet(Math.max(0, volume - VOLUME_STEP));
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, onPlayPause, onNext, onPrevious, onToggleMute, volume, onVolumeSet]);
}
