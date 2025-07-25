'use client';

import { useState, useRef, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface RippleEffectProps {
  children: ReactNode;
  className?: string;
  color?: string;
  duration?: number;
  size?: number;
  disabled?: boolean;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

const RippleEffect = ({
  children,
  className = '',
  color = 'rgba(255, 255, 255, 0.6)',
  duration = 0.6,
  size = 100,
  disabled = false,
}: RippleEffectProps) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const nextRippleId = useRef(0);
  const timeoutIds = useRef<Set<NodeJS.Timeout>>(new Set());

  // Clean up timeouts on unmount
  useEffect(() => {
    const timeouts = timeoutIds.current;
    return () => {
      timeouts.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      timeouts.clear();
    };
  }, []);

  const addRipple = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rippleSize = Math.max(rect.width, rect.height) * (size / 100);

    const newRipple: Ripple = {
      id: nextRippleId.current++,
      x,
      y,
      size: rippleSize,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    const timeoutId = setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      const timeouts = timeoutIds.current;
      timeouts.delete(timeoutId);
    }, duration * 1000);

    const timeouts = timeoutIds.current;
    timeouts.add(timeoutId);
  };

  return (
    <div
      ref={ref}
      className={`ripple-container ${className}`}
      onMouseDown={addRipple}
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-block',
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className='ripple'
            style={{
              position: 'absolute',
              borderRadius: '50%',
              background: color,
              pointerEvents: 'none',
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
              zIndex: 1,
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default RippleEffect;
