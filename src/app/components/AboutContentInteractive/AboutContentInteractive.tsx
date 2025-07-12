'use client';

import Link from 'next/link';
import { useRef, useEffect } from 'react';
import { useCursorInteractions } from '@/app/hooks/useCursorInteractions';

interface AboutContentInteractiveProps {
  children: React.ReactNode;
}

export default function AboutContentInteractive({
  children,
}: AboutContentInteractiveProps) {
  const { addCursorInteraction } = useCursorInteractions();
  const workTogetherRef = useRef<HTMLAnchorElement>(null);

  // Add cursor interactions
  useEffect(() => {
    if (workTogetherRef.current) {
      addCursorInteraction(workTogetherRef.current, {
        onHover: 'hover',
        onText: "Let's work together!",
        onClick: 'click',
      });
    }
    return undefined;
  }, [addCursorInteraction]);

  return (
    <Link className='px-btn px-btn-theme' href='/contact' ref={workTogetherRef}>
      {children}
    </Link>
  );
}
