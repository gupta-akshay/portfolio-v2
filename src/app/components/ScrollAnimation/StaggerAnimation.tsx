'use client';

import {
  ReactNode,
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import { motion } from 'motion/react';
import ScrollAnimation from './ScrollAnimation';

interface StaggerAnimationProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  staggerDelay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  containerAnimation?: 'fadeIn' | 'slideUp' | 'none';
  // New props for additional effects
  useIntersectionObserver?: boolean;
  parallax?: boolean;
  parallaxSpeed?: 'slow' | 'normal' | 'fast';
  scrollReveal?: boolean;
  magnetic?: boolean;
}

const containerVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  none: {
    hidden: {},
    visible: {},
  },
};

const StaggerAnimation = ({
  children,
  className = '',
  duration = 0.6,
  staggerDelay = 0.1,
  threshold = 0.1,
  triggerOnce = true,
  containerAnimation = 'none',
  // New effect props
  useIntersectionObserver = false,
  parallax = false,
  parallaxSpeed = 'normal',
  scrollReveal = false,
  magnetic = false,
}: StaggerAnimationProps) => {
  const childrenArray = Children.toArray(children);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!useIntersectionObserver) return;

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInView(entry.isIntersecting);
        });
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [useIntersectionObserver, threshold]);

  // Build CSS classes based on props
  const cssClasses = [
    'stagger-container',
    className,
    useIntersectionObserver && 'intersection-observer',
    parallax && 'parallax-scroll',
    scrollReveal && 'scroll-reveal',
    magnetic && 'magnetic-scroll',
  ]
    .filter(Boolean)
    .join(' ');

  // Add data attributes
  const dataAttributes = {
    ...(useIntersectionObserver && { 'data-in-view': inView.toString() }),
    ...(parallax && { 'data-parallax-speed': parallaxSpeed }),
  };

  return (
    <ScrollAnimation
      className={cssClasses}
      animation={containerAnimation === 'none' ? 'fadeIn' : containerAnimation}
      duration={duration}
      threshold={threshold}
      triggerOnce={triggerOnce}
      parallax={parallax}
      parallaxSpeed={parallaxSpeed}
      scrollReveal={scrollReveal}
      magnetic={magnetic}
    >
      <motion.div
        ref={containerRef}
        className='stagger-wrapper'
        initial='hidden'
        animate='visible'
        variants={containerVariants[containerAnimation]}
        {...dataAttributes}
      >
        {childrenArray.map((child, index) => (
          <motion.div
            key={index}
            className='stagger-item'
            initial='hidden'
            animate='visible'
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{
              duration,
              delay: index * staggerDelay,
              ease: [0.4, 0, 0.2, 1],
            }}
            {...(useIntersectionObserver && { 'data-stagger-index': index })}
          >
            {isValidElement(child) ? cloneElement(child) : child}
          </motion.div>
        ))}
      </motion.div>
    </ScrollAnimation>
  );
};

export default StaggerAnimation;
