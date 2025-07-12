'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

interface MagneticHoverProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  distance?: number;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
  };
  glowEffect?: boolean;
  glowColor?: string;
  scale?: number;
  disabled?: boolean;
  triggerDistance?: number;
}

const MagneticHover = ({
  children,
  className = '',
  intensity = 0.3,
  distance = 100,
  springConfig = { damping: 20, stiffness: 300, mass: 0.5 },
  glowEffect = true,
  glowColor = 'var(--px-theme)',
  scale = 1.05,
  disabled = false,
  triggerDistance = 50,
}: MagneticHoverProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  const scaleSpring = useSpring(1, springConfig);

  // Transform values for smooth animations
  const translateX = useTransform(x, (value) => `${value}px`);
  const translateY = useTransform(y, (value) => `${value}px`);

  useEffect(() => {
    if (disabled) return;

    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Only activate if mouse is within trigger distance
      if (distanceFromCenter <= triggerDistance) {
        const moveX = deltaX * intensity;
        const moveY = deltaY * intensity;

        x.set(moveX);
        y.set(moveY);
        scaleSpring.set(scale);
      }
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
      scaleSpring.set(1);
    };

    const handleMouseEnter = () => {
      scaleSpring.set(scale);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [disabled, intensity, scale, triggerDistance, x, y, scaleSpring]);

  // Respect reduced motion preference
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) {
      x.set(0);
      y.set(0);
      scaleSpring.set(1);
    }
  }, [x, y, scaleSpring]);

  return (
    <motion.div
      ref={ref}
      className={`magnetic-hover ${className}`}
      style={{
        x: translateX,
        y: translateY,
        scale: scaleSpring,
        position: 'relative',
        display: 'inline-block',
        willChange: 'transform',
      }}
      {...(glowEffect && {
        whileHover: {
          filter: `drop-shadow(0 0 20px ${glowColor})`,
        },
      })}
      transition={{ duration: 0.3 }}
    >
      {children}
      {glowEffect && (
        <motion.div
          className='glow-effect'
          style={{
            position: 'absolute',
            top: '-5px',
            left: '-5px',
            right: '-5px',
            bottom: '-5px',
            background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`,
            borderRadius: 'inherit',
            zIndex: -1,
            pointerEvents: 'none',
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default MagneticHover;
