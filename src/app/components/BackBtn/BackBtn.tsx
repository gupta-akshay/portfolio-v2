'use client';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useRouter, usePathname } from 'next/navigation';
import { handleKeyDown } from '@/app/utils';
import { useLoading } from '@/app/context/LoadingContext';

import styles from './BackBtn.module.scss';

const BackBtn = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { startLoading } = useLoading();

  const handleBack = () => {
    if (pathname.startsWith('/blog/')) {
      startLoading();
    }

    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
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
