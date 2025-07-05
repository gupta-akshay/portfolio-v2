'use client';

import { Fragment, useEffect, useRef } from 'react';
import Typed from 'typed.js';
import { TypingAnimationProps } from '@/app/types/components';

const defaultStrings = [
  'a Passionate Full Stack Developer',
  'an Electronic Music Producer',
  'a Hobbyist DJ',
  'an Enthusiastic Traveller',
  'an Avid Gamer',
];

const TypingAnimation = ({
  strings = defaultStrings,
  typeSpeed = 100,
  backSpeed = 100,
  backDelay = 100,
  loop = true,
  showCursor = true,
  className = 'subtitle subtitle-typed',
}: TypingAnimationProps) => {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!el.current) return;

    const typed = new Typed(el.current, {
      strings,
      typeSpeed,
      backSpeed,
      backDelay,
      smartBackspace: true,
      loop,
      showCursor,
    });

    return () => {
      typed.destroy();
    };
  }, [strings, typeSpeed, backSpeed, backDelay, loop, showCursor]);

  return (
    <Fragment>
      <span id='type-it' className={className} ref={el} />
    </Fragment>
  );
};

export default TypingAnimation;
