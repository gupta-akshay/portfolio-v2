'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion, useAnimation } from 'motion/react';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  animation?:
    | 'fadeIn'
    | 'slideUp'
    | 'slideDown'
    | 'slideLeft'
    | 'slideRight'
    | 'scale'
    | 'rotate'
    | 'custom';
  duration?: number;
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  stagger?: number;
  customVariants?: {
    hidden: any;
    visible: any;
  };
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
  // New props for additional effects
  parallax?: boolean;
  parallaxSpeed?: 'slow' | 'normal' | 'fast';
  scrollReveal?: boolean;
  magnetic?: boolean;
  textAnimation?: boolean;
  textAnimationDelay?: number;
}

const animationVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -10 },
    visible: { opacity: 1, rotate: 0 },
  },
};

const ScrollAnimation = ({
  children,
  className = '',
  animation = 'fadeIn',
  duration = 0.6,
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  stagger = 0,
  customVariants,
  onAnimationStart,
  onAnimationComplete,
  // New effect props
  parallax = false,
  parallaxSpeed = 'normal',
  scrollReveal = false,
  magnetic = false,
  textAnimation = false,
  textAnimationDelay = 0,
}: ScrollAnimationProps) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasAnimated) {
              if (onAnimationStart) onAnimationStart();
              controls.start('visible');
              if (triggerOnce) {
                setHasAnimated(true);
              }
            }
            // Trigger scroll reveal effect
            if (scrollReveal && !isRevealed) {
              setIsRevealed(true);
            }
          } else if (!triggerOnce) {
            controls.start('hidden');
            if (scrollReveal) {
              setIsRevealed(false);
            }
          }
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    controls,
    threshold,
    triggerOnce,
    hasAnimated,
    onAnimationStart,
    scrollReveal,
    isRevealed,
  ]);

  const variants =
    customVariants ||
    (animation !== 'custom'
      ? animationVariants[animation]
      : animationVariants.fadeIn);

  // Build CSS classes based on props
  const cssClasses = [
    'scroll-animation',
    className,
    parallax && 'parallax-scroll',
    scrollReveal && 'scroll-reveal',
    scrollReveal && isRevealed && 'revealed',
    magnetic && 'magnetic-scroll',
    textAnimation && 'text-animation',
  ]
    .filter(Boolean)
    .join(' ');

  // Add data attributes for parallax speed
  const dataAttributes = parallax
    ? { 'data-parallax-speed': parallaxSpeed }
    : {};

  return (
    <motion.div
      ref={ref}
      className={cssClasses}
      initial='hidden'
      animate={controls}
      variants={variants}
      transition={{
        duration,
        delay: delay + stagger,
        ease: [0.4, 0, 0.2, 1],
      }}
      {...dataAttributes}
      {...(onAnimationComplete && { onAnimationComplete })}
      {...(textAnimation && {
        style: { '--line-index': textAnimationDelay } as any,
      })}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;
