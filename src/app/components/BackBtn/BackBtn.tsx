'use client';

import { useEffect, useRef } from 'react';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useRouter, usePathname } from 'next/navigation';
import { handleKeyDown } from '@/app/utils';
import { useLoading } from '@/app/context/LoadingContext';
import { useCursorInteractions } from '@/app/hooks/useCursorInteractions';
import { useCursor } from '@/app/context/CursorContext';

import styles from './BackBtn.module.scss';

const BackBtn = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { startLoading } = useLoading();
  const { addCursorInteraction } = useCursorInteractions();
  const { setCursorVariant, setCursorText } = useCursor();
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
    return undefined;
  }, [addCursorInteraction]);

  const handleBack = () => {
    if (pathname.startsWith('/blog/')) {
      startLoading();
    }

    setCursorVariant('default');
    setCursorText('');

    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className='back-btn-wrapper'>
      <button
        ref={buttonRef}
        type='button'
        className={styles.backBtn}
        onClick={handleBack}
        onKeyDown={(e) => handleKeyDown(e, handleBack)}
        aria-label='Go back to previous page'
      >
        <FontAwesomeIcon icon={faArrowLeft as IconProp} aria-hidden='true' />
      </button>
    </div>
  );
};

export default BackBtn;
