'use client';

import { Fragment, useEffect, useRef } from 'react';
import Typed from 'typed.js';

const TypingAnimation = () => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        'a Passionate Full Stack Developer',
        'an Electronic Music Producer',
        'a Hobbyist DJ',
        'an Enthusiastic Traveller',
        'an Avid Gamer',
      ],
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 100,
      smartBackspace: true,
      loop: true,
      showCursor: true,
    });

    // destroy
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <Fragment>
      <span id='type-it' className='subtitle subtitle-typed' ref={el} />
    </Fragment>
  );
};

export default TypingAnimation;
