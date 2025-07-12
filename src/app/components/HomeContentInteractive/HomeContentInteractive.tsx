'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { useCursorInteractions } from '@/app/hooks/useCursorInteractions';

interface HomeContentInteractiveProps {
  children: React.ReactNode;
  type: 'downloadButton' | 'peopleGroveLink';
}

export default function HomeContentInteractive({
  children,
  type,
}: HomeContentInteractiveProps) {
  const { addCursorInteraction } = useCursorInteractions();
  const elementRef = useRef<HTMLAnchorElement>(null);

  // Add cursor interactions
  useEffect(() => {
    if (elementRef.current) {
      const interactions = {
        downloadButton: {
          onHover: 'hover',
          onText: 'Download my CV',
          onClick: 'click',
        },
        peopleGroveLink: {
          onHover: 'hover',
          onText: 'Visit PeopleGrove',
          onClick: 'click',
        },
      };

      return addCursorInteraction(elementRef.current, interactions[type]);
    }

    return undefined;
  }, [addCursorInteraction, type]);

  if (type === 'downloadButton') {
    return (
      <a
        ref={elementRef}
        className='px-btn px-btn-theme'
        href='/assets/akshay-cv.pdf'
        download
      >
        {children}
      </a>
    );
  }

  if (type === 'peopleGroveLink') {
    return (
      <Link href='https://www.peoplegrove.com' target='_blank' ref={elementRef}>
        {children}
      </Link>
    );
  }

  return null;
}
