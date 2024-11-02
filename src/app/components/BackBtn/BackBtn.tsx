'use client';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { handleKeyDown } from '@/app/utils';
const BackBtn = () => {
  const router = useRouter();

  return (
    <button
      type='button'
      className='back-btn'
      onClick={() => router.back()}
      onKeyDown={(e) => handleKeyDown(e, () => router.back())}
      aria-label='Go back to previous page'
    >
      <FontAwesomeIcon icon={faArrowLeft} aria-hidden='true' />
    </button>
  );
};

export default BackBtn;
