'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { useCursorInteractions } from '@/app/hooks/useCursorInteractions';

export default function NotFound() {
  const { addCursorInteraction } = useCursorInteractions();
  const goBackRef = useRef<HTMLAnchorElement>(null);

  // Add cursor interactions
  useEffect(() => {
    if (goBackRef.current) {
      addCursorInteraction(goBackRef.current, {
        onHover: 'hover',
        onText: 'Go back to home',
        onClick: 'click',
      });
    }
  }, [addCursorInteraction]);

  return (
    <section
      id='not-found'
      data-nav-tooltip='not-found'
      className='pp-section pp-scrollable'
    >
      <div className='not-found'>
        <div className='container'>
          <div className='col-12 d-flex flex-column justify-content-center align-items-center not-found-content'>
            <h2>Are you lost?</h2>
            <p>Could not find what you were looking for!</p>
            <Link href='/' className='px-btn px-btn-theme' ref={goBackRef}>
              Go Back
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
