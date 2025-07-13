'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { useCursorInteractions } from '@/app/hooks/useCursorInteractions';
import {
  MagneticHover,
  RippleEffect,
  ScrollAnimation,
  TextAnimation,
} from '@/app/components';

import styles from './styles/sections/notFound.module.scss';

export default function NotFound() {
  const { addCursorInteraction } = useCursorInteractions();
  const goBackRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (goBackRef.current) {
      const cleanup = addCursorInteraction(goBackRef.current, {
        onHover: 'hover',
        onText: 'Go back to home',
        onClick: 'click',
      });
      return cleanup;
    }
    return undefined;
  }, [addCursorInteraction]);

  return (
    <section
      id='not-found'
      data-nav-tooltip='not-found'
      className={`pp-section pp-scrollable`}
    >
      <div className={styles.notFound}>
        <div className='container'>
          <div
            className={`${styles.notFoundContent} col-12 d-flex flex-column justify-content-center align-items-center`}
          >
            <TextAnimation duration={1.2} delay={0.2}>
              <h2>Are you lost?</h2>
            </TextAnimation>
            <ScrollAnimation
              animation='fadeIn'
              duration={0.8}
              delay={0.4}
              scrollReveal={true}
            >
              <p>Could not find what you were looking for!</p>
            </ScrollAnimation>
            <ScrollAnimation animation='scale' duration={0.6} delay={0.6}>
              <MagneticHover intensity={0.4} glowEffect={true}>
                <RippleEffect>
                  <Link
                    href='/'
                    className='px-btn px-btn-regular'
                    ref={goBackRef}
                  >
                    Go Back
                  </Link>
                </RippleEffect>
              </MagneticHover>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
