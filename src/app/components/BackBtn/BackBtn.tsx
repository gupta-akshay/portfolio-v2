'use client';

import { useEffect, useRef } from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useRouter, usePathname } from 'next/navigation';
import { handleKeyDown } from '@/app/utils';
import { useLoading } from '@/app/context/LoadingContext';
import { BackButtonProps } from '@/app/types/components';
import { useCursorInteractions } from '@/app/hooks/useCursorInteractions';

const BackBtn = ({
  onClick,
  text = '',
  className = 'back-btn',
  showIcon = true,
}: BackButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { startLoading } = useLoading();
  const { addCursorInteraction } = useCursorInteractions();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Add cursor interactions
  useEffect(() => {
    if (buttonRef.current) {
      return addCursorInteraction(buttonRef.current, {
        onHover: 'hover',
        onText: 'Go back',
        onClick: 'click',
      });
    }
  }, [addCursorInteraction]);

  const handleBack = () => {
    // Only show loading indicator when navigating from a blog post
    if (pathname.startsWith('/blog/')) {
      startLoading();
    }

    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <div className='back-btn-wrapper'>
      <button
        ref={buttonRef}
        type='button'
        className={className}
        onClick={handleBack}
        onKeyDown={(e) => handleKeyDown(e, handleBack)}
        aria-label={text || 'Go back to previous page'}
      >
        {showIcon && (
          <FontAwesomeIcon icon={faArrowLeft as IconProp} aria-hidden='true' />
        )}
        {text && <span className='back-btn-text'>{text}</span>}
      </button>
    </div>
  );
};

export default BackBtn;
