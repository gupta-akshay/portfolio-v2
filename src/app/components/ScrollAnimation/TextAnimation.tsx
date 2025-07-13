'use client';

import { ReactNode, Children, cloneElement, isValidElement } from 'react';
import ScrollAnimation from './ScrollAnimation';

interface TextAnimationProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  staggerDelay?: number;
  onAnimationStart?: () => void;
  onAnimationComplete?: () => void;
}

const TextAnimation = ({
  children,
  className = '',
  duration = 0.8,
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  onAnimationStart,
  onAnimationComplete,
}: TextAnimationProps) => {
  const childrenArray = Children.toArray(children);

  return (
    <ScrollAnimation
      className={`text-animation animate-text ${className}`}
      animation='fadeIn'
      duration={duration}
      delay={delay}
      threshold={threshold}
      triggerOnce={triggerOnce}
      textAnimation={true}
      {...(onAnimationStart && { onAnimationStart })}
      {...(onAnimationComplete && { onAnimationComplete })}
    >
      {childrenArray.map((child, index) => (
        <span
          key={index}
          className='text-line'
          style={{ '--line-index': index } as any}
        >
          {isValidElement(child) ? cloneElement(child) : child}
        </span>
      ))}
    </ScrollAnimation>
  );
};

export default TextAnimation;
