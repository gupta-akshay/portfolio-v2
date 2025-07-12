'use client';

import { ReactNode, useRef, useEffect } from 'react';
import { useCursorInteractions } from '@/app/hooks/useCursorInteractions';

interface CursorInteractiveProps {
  children: ReactNode;
  variant?: 'hover' | 'text' | 'click';
  text?: string;
  onHover?: string;
  onClick?: string;
  className?: string;
}

const CursorInteractive = ({
  children,
  variant = 'hover',
  text,
  onHover,
  onClick,
  className = '',
}: CursorInteractiveProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { addCursorInteraction } = useCursorInteractions();

  // Add cursor interaction on mount
  useEffect(() => {
    if (ref.current) {
      const cursorOptions = {
        onHover: onHover || variant,
        ...(text && { onText: text }),
        onClick: onClick || 'click',
      };

      return addCursorInteraction(ref.current, cursorOptions);
    }
  }, [addCursorInteraction, variant, text, onHover, onClick]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default CursorInteractive;
