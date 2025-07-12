'use client';

import { ReactNode, Children, cloneElement, isValidElement } from 'react';
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
}: StaggerAnimationProps) => {
  const childrenArray = Children.toArray(children);

  return (
    <ScrollAnimation
      className={`stagger-container ${className}`}
      animation={containerAnimation === 'none' ? 'fadeIn' : containerAnimation}
      duration={duration}
      threshold={threshold}
      triggerOnce={triggerOnce}
    >
      <motion.div
        className='stagger-wrapper'
        initial='hidden'
        animate='visible'
        variants={containerVariants[containerAnimation]}
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
          >
            {isValidElement(child) ? cloneElement(child) : child}
          </motion.div>
        ))}
      </motion.div>
    </ScrollAnimation>
  );
};

export default StaggerAnimation;
