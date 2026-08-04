'use client';

import Icon from '@/app/components/Icon/Icon';
import { useRouter } from 'next/navigation';

import styles from './BackBtn.module.scss';

const BackBtn = () => {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <button
      type='button'
      className={styles.backBtn}
      onClick={handleBack}
      aria-label='Go back to previous page'
    >
      <Icon name='arrow-left' aria-hidden='true' />
    </button>
  );
};

export default BackBtn;
